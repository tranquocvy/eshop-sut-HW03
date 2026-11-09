// Container track metadata inspection only: not codec/bitstream validation.
// Random-access reads skip media payloads. Fail closed for unsupported/ambiguous metadata.
import {open} from 'node:fs/promises';
const reject=()=>{const e=new Error('Compact chỉ nhận video chỉ có hình: metadata track không hợp lệ, không hỗ trợ hoặc có âm thanh.');e.status=415;throw e;};
export const TRACK_LIMITS=Object.freeze({headers:50000,readBytes:2*1024*1024,tracks:32,metadataBytes:1024*1024});
export async function inspectScreenOnly(filename,type) {
 const fh=await open(filename,'r');
 try {
  const size=(await fh.stat()).size;
  let reads=0,headers=0,tracks=0;
  const read=async(pos,n)=>{
   if(!Number.isSafeInteger(pos)||n<0||pos<0||pos+n>size||(reads+=n)>TRACK_LIMITS.readBytes)reject();
   const b=Buffer.alloc(n);const r=await fh.read(b,0,n,pos);if(r.bytesRead!==n)reject();return b;
  };
  const tick=()=>{if(++headers>TRACK_LIMITS.headers)reject();};
  const track=()=>{if(++tracks>TRACK_LIMITS.tracks)reject();};
  if(type==='video/webm'){
   const numbers=new Set(),uids=new Set();
   const vint=async(pos,id=false)=>{
    const first=(await read(pos,1))[0];let width=1,mask=128;
    while(width<=8&&!(first&mask)){width++;mask>>=1;}
    if(width>8||(id&&width>4))reject();
    const b=await read(pos,width);let value=BigInt(id?b[0]:b[0]&(mask-1));
    for(let i=1;i<width;i++)value=(value<<8n)|BigInt(b[i]);
    const unknown=!id&&value===(1n<<BigInt(7*width))-1n;
    if(value>BigInt(Number.MAX_SAFE_INTEGER)) {if(!unknown)reject();}
    return {width,value:unknown?-1:Number(value)};
   };
   const element=async(pos,end)=>{
    tick();const id=await vint(pos,true),len=await vint(pos+id.width);
    const start=pos+id.width+len.width,stop=len.value===-1?end:start+len.value;
    if(start>end||stop>end||stop<start)reject();
    return {id:id.value,start,end:stop,unknown:len.value===-1};
   };
   const each=async(start,end,fn)=>{
    for(let pos=start;pos<end;){const e=await element(pos,end);if(e.unknown)reject();await fn(e);pos=e.end;}
   };
   const uint=async(e,wide=false)=>{
    const n=e.end-e.start;if(n<1||n>8)reject();
    const b=await read(e.start,n);let v=0n;for(const x of b)v=(v<<8n)|BigInt(x);
    if(wide)return v;if(v>BigInt(Number.MAX_SAFE_INTEGER))reject();return Number(v);
   };
   const text=async(e)=>{if(e.end-e.start<1||e.end-e.start>128)reject();const b=await read(e.start,e.end-e.start);if(b.some(x=>x<32||x>126))reject();return b.toString('ascii');};
   const ebml=await element(0,size);if(ebml.id!==0x1a45dfa3||ebml.unknown||ebml.end-ebml.start>4096)reject();
   let doc=false;
   await each(ebml.start,ebml.end,async e=>{if(e.id===0x4282){if(doc||await text(e)!=='webm')reject();doc=true;}});
   if(!doc)reject();
   const segment=await element(ebml.end,size);
   if(segment.id!==0x18538067||segment.end!==size)reject();
   let found=false,cluster=false;
   const segmentIds=new Set([0x114d9b74,0x1549a966,0x1654ae6b,0x1f43b675,0x1c53bb6b,0x1941a469,0x1043a770,0x1254c367]);
   // MediaRecorder may leave Cluster sizes unknown. Walk element boundaries (never
   // search payload bytes), stopping at the next schema-defined Segment child.
   const clusterEnd=async(start,end)=>{
    let pos=start;
    while(pos<end){
     const child=await element(pos,end);
     if(segmentIds.has(child.id))return pos;
     if(child.unknown||![0xe7,0xa3,0xa0,0xa7,0xab,0x5854,0xec,0xbf].includes(child.id))reject();
     pos=child.end;
    }
    return pos;
   };
   const segmentEach=async fn=>{
    let pos=segment.start;
    while(pos<segment.end){
     const e=await element(pos,segment.end);
     if(e.unknown){if(e.id!==0x1f43b675)reject();e.end=await clusterEnd(e.start,segment.end);}
     await fn(e);pos=e.end;
    }
   };
   await segmentEach(async e=>{
    if(!segmentIds.has(e.id)&&![0xec,0xbf].includes(e.id))reject();
    if(e.id===0x1f43b675){if(!found)reject();cluster=true;return;}
    if(e.id!==0x1654ae6b)return;
    if(found||cluster||e.end-e.start>TRACK_LIMITS.metadataBytes)reject();found=true;
    await each(e.start,e.end,async entry=>{
     if(entry.id===0xec||entry.id===0xbf)return; // Void / CRC-32
     if(entry.id!==0xae)reject();track();
     let kind,codec,number,uid;
     await each(entry.start,entry.end,async field=>{
      if(field.id===0x83){if(kind!==undefined)reject();kind=await uint(field);}
      if(field.id===0x86){if(codec!==undefined)reject();codec=await text(field);}
      if(field.id===0xd7){if(number!==undefined)reject();number=await uint(field);}
      if(field.id===0x73c5){if(uid!==undefined)reject();uid=await uint(field,true);}
      // Encrypted/compressed track content is not inspectable by this reader.
      if(field.id===0x6d80||field.id===0xe1)reject(); // ContentEncodings / contradictory Audio descriptor
     });
     if(kind!==1||!['V_VP8','V_VP9','V_AV1'].includes(codec)||!number||!uid)reject();
     if(numbers.has(number)||uids.has(uid))reject();numbers.add(number);uids.add(uid);
    });
   });
   if(!found||!tracks||!cluster)reject();
  }else if(type==='video/mp4'){
   const boxes=async(start,end,fn)=>{
    for(let pos=start;pos<end;){
     tick();if(end-pos<8)reject();const h=await read(pos,8),name=h.toString('latin1',4,8);
     let length=h.readUInt32BE(0),head=8;
     if(length===1){if(end-pos<16)reject();const wide=(await read(pos+8,8)).readBigUInt64BE();if(wide>BigInt(Number.MAX_SAFE_INTEGER))reject();length=Number(wide);head=16;}
     else if(length===0)length=end-pos;
     if(length<head||pos+length>end||!Number.isSafeInteger(pos+length))reject();
     await fn({name,start:pos+head,end:pos+length});pos+=length;
    }
   };
   let moov=false,ftyp=false,mdat=false;
   await boxes(0,size,async b=>{
    if(b.name==='ftyp'){if(ftyp||b.end-b.start<8||b.end-b.start>4096)reject();ftyp=true;}
    if(b.name==='mdat')mdat=true;
    if(b.name!=='moov')return;
    if(moov||b.end-b.start>TRACK_LIMITS.metadataBytes)reject();moov=true;
    await boxes(b.start,b.end,async child=>{
     if(child.name==='cmov')reject();
     if(child.name!=='trak')return;track();let mdia=false;
     await boxes(child.start,child.end,async part=>{
      if(part.name!=='mdia')return;if(mdia)reject();mdia=true;let handler=false;
      await boxes(part.start,part.end,async field=>{
       if(field.name!=='hdlr')return;
       if(handler||field.end-field.start<24)reject();handler=true;
       const h=await read(field.start,12);
       if(h.readUInt32BE(0)!==0||h.toString('latin1',8,12)!=='vide')reject();
      });
      if(!handler)reject();
     });
     if(!mdia)reject();
    });
   });
   if(!ftyp||!moov||!mdat||!tracks)reject();
  }else reject();
  return {container:type==='video/webm'?'webm':'mp4',videoTracks:tracks,audioTracks:0,inspection:'container-track-metadata-only'};
 }finally{await fh.close();}
}
