// Synthetic container metadata fixtures. Not codec validation.
// Real Chromium MediaRecorder output: 32x32 synthetic red canvas, VP8,
// 300ms / 50ms timeslice; no microphone or display/private content.
export const browserWebm=Buffer.from('GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQRChYECGFOAZwH/////////FUmpZpkq17GDD0JATYCGQ2hyb21lV0GGQ2hyb21lFlSua7yuuteBAXPFh5D71hGkM2KDgQFV7oEBhoVWX1ZQOOCdsIEguoEgU8CBAVWwkFWxgQFVuYECVbqBDVW7gQEfQ7Z1Af/////////ngQCg7aHAgQAAADADAJ0BKiAAIAAABwiFhYiZhIgBJBATrVAfwB/QEELJdIOA/v7rvL/5T2OK+j/yn7//k92eNKaJf/k4AHWhqKam7oEBpaFQAgCdASogACAAAAcIhYWImYSIASQQADyHnk4A/v+6gwCgt6GWgQBrANEBAAAQCSAAwADCwX+gAEOAAHWhmaaX7oEBpZLRAQAAEAkgAMAAwsF/oABDgAD7gQCgt6GWgQDJANEBAAAQCSAAwADCwX+gAEOAAHWhmaaX7oEBpZLRAQAAEAkgAMAAwsF/oABDgAD7gWs=','base64');
export const concat=(...b)=>Buffer.concat(b);
const id=n=>Buffer.from(n.toString(16).padStart(Math.ceil(n.toString(16).length/2)*2,'0'),'hex');
const length=n=>{for(let w=1;w<=8;w++){if(BigInt(n)<(1n<<BigInt(w*7))-1n){let v=BigInt(n)|(1n<<BigInt(w*7));const b=Buffer.alloc(w);for(let i=w-1;i>=0;i--){b[i]=Number(v&255n);v>>=8n;}return b;}}throw Error('size');};
export const eb=(n,...parts)=>{const b=concat(...parts);return concat(id(n),length(b.length),b);};
export const webm=(kinds=[1],{unknownCluster=false}={})=>concat(
 eb(0x1a45dfa3,eb(0x4282,Buffer.from('webm'))),
 id(0x18538067),Buffer.from('01ffffffffffffff','hex'),
 eb(0x1654ae6b,...kinds.map((kind,i)=>eb(0xae,eb(0xd7,Buffer.from([i+1])),eb(0x73c5,Buffer.from([i+1])),eb(0x83,Buffer.from([kind])),eb(0x86,Buffer.from(kind===2?'A_OPUS':'V_VP8'))))),
 unknownCluster?concat(id(0x1f43b675),Buffer.from([255]),eb(0xe7,Buffer.from([0]))):eb(0x1f43b675,eb(0xe7,Buffer.from([0])))
);
export const box=(name,body=Buffer.alloc(0),extended=false)=>{
 const h=Buffer.alloc(extended?16:8);h.writeUInt32BE(extended?1:body.length+8);h.write(name,4,4,'ascii');if(extended)h.writeBigUInt64BE(BigInt(body.length+16),8);return concat(h,body);
};
export const mp4=(handlers=['vide'],extended=false)=>concat(
 box('ftyp',Buffer.from('isom0000')),
 box('mdat',Buffer.alloc(8),extended),
 box('moov',concat(...handlers.map(handler=>{
  const h=Buffer.alloc(24);h.write(handler,8,4,'ascii');
  return box('trak',box('mdia',box('hdlr',h,extended),extended),extended);
 })),extended)
);
