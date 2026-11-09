import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm,open} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {inspectScreenOnly,TRACK_LIMITS} from './media-tracks.mjs';
import {webm,mp4,box,eb,concat,browserWebm} from './media-fixtures.mjs';
test('bounded container metadata: screen-only, audio, ambiguous/malformed and limits',async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'study-track-synthetic-')),file=path.join(dir,'fixture');
 async function check(bytes,type,ok){await writeFile(file,bytes);if(ok)assert.equal((await inspectScreenOnly(file,type)).audioTracks,0);else await assert.rejects(inspectScreenOnly(file,type),{status:415});}
 try{
  await check(browserWebm,'video/webm',true);
  for(const unknownCluster of [false,true])await check(webm([1],{unknownCluster}),'video/webm',true);
  for(const extended of [false,true])await check(mp4(['vide'],extended),'video/mp4',true);
  for(const kinds of [[1,2],[2],[17],[],Array(33).fill(1)])await check(webm(kinds),'video/webm',false);
  for(const handlers of [['vide','soun'],['soun'],['text'],[],Array(33).fill('vide')])await check(mp4(handlers),'video/mp4',false);
  for(const [bytes,type] of [[webm(),'video/webm'],[mp4(),'video/mp4']]){
   for(const n of [0,1,8,bytes.length-1])await check(bytes.subarray(0,n),type,false);
   await check(concat(bytes,Buffer.from([0])) ,type,false);
  }
  // Conflicting/missing handler metadata, including extended-size inner boxes.
  const h=Buffer.alloc(24);h.write('vide',8);
  for(const mdia of [box('mdia'),box('mdia',concat(box('hdlr',h),box('hdlr',h))),box('mdia',box('hdlr',h.subarray(0,12),true))]){
   await check(concat(box('ftyp',Buffer.from('isom0000')),box('mdat'),box('moov',box('trak',mdia))),'video/mp4',false);
  }
  // Unsupported/missing/duplicate WebM track metadata must not be inferred.
  const header=eb(0x1a45dfa3,eb(0x4282,Buffer.from('webm')));
  const validFields=[eb(0xd7,Buffer.from([1])),eb(0x73c5,Buffer.from([1])),eb(0x83,Buffer.from([1]))];
  for(const fields of [
   validFields,
   [...validFields,eb(0x86,Buffer.from('V_UNKNOWN'))],
   [...validFields,eb(0x86,Buffer.from('V_VP8')),eb(0x83,Buffer.from([2]))],
   [...validFields,eb(0x86,Buffer.from('V_VP8')),eb(0xe1)],
  ])await check(concat(header,eb(0x18538067,eb(0x1654ae6b,eb(0xae,...fields)),eb(0x1f43b675))),'video/webm',false);
  const over=Buffer.alloc(TRACK_LIMITS.metadataBytes+1);
  await check(concat(header,eb(0x18538067,eb(0x1654ae6b,over))),'video/webm',false);
  await check(concat(box('ftyp',Buffer.from('isom0000')),box('moov',over)),'video/mp4',false);
  await check(concat(mp4(),...Array.from({length:TRACK_LIMITS.headers},()=>box('free'))),'video/mp4',false);
  const tooWide=Buffer.alloc(16);tooWide.writeUInt32BE(1);tooWide.write('moov',4);tooWide.writeBigUInt64BE(2n**63n,8);
  await check(concat(box('ftyp',Buffer.from('isom0000')),tooWide),'video/mp4',false);
  await check(concat(webm(),eb(0x1654ae6b)),'video/webm',false);
  // An unknown-length first Segment must not hide a second Segment or header.
  await check(concat(webm(),eb(0x18538067,eb(0x1654ae6b,eb(0xae,eb(0x83,Buffer.from([2])))))),'video/webm',false);
  await check(concat(webm(),header),'video/webm',false);
  // Sparse mdat demonstrates random access, not whole-media buffering.
  const f=await open(file,'w');try{
   const ftyp=box('ftyp',Buffer.from('isom0000')),header=Buffer.alloc(16);header.writeUInt32BE(1);header.write('mdat',4);header.writeBigUInt64BE(32n*1024n*1024n,8);
   await f.write(ftyp,0,ftyp.length,0);await f.write(header,0,16,ftyp.length);
   const tail=mp4().subarray(32);await f.write(tail,0,tail.length,ftyp.length+32*1024*1024);
  }finally{await f.close();}
  assert.equal((await inspectScreenOnly(file,'video/mp4')).videoTracks,1);
 }finally{await rm(dir,{recursive:true,force:true});}
});
