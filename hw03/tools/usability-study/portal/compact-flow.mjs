import {probePayload} from './probes-v04.mjs';
// Một lựa chọn chỉ được mở rộng khi người tham gia đã trả lời rõ ràng.
export const compactFlow = c => c?.participantFlow === 'compact-screen-v1';
const eligibility = ['adult','vietnamese','shopping','outsideClass','uninvolved'];
const agreement = ['participate','research','verification'];
const explicit = (keys,value) => typeof value === 'boolean' ? Object.fromEntries(keys.map(k=>[k,value])) : {};
export function compactPayload(step,data,{hasEvidence=false,probeVersion='v0.3'}={}) {
 if(step==='probes'&&probeVersion==='v0.4')return probePayload(data);
 if(step==='screening')return {...explicit(['eligible'],data.eligible),experience:'',itBackground:''};
 if(step==='consent')return {...explicit(agreement,data.agree),...explicit(['screen'],data.screen),audio:false,publicEvidence:false,name:'',maskedContact:''};
 if(step==='prepare')return {...explicit(['desktop','callReady'],data.ready),recorderChecked:false,playbackChecked:false};
 if(step==='finish')return {videoLater:!hasEvidence,videoReason:hasEvidence?'':data.videoReason??''};
 return data;
}
export function compactRestore(step,data={}){
 if(step==='screening')return typeof data.eligible==='boolean'?{eligible:data.eligible}:{...(eligibility.every(k=>typeof data[k]==='boolean')?{eligible:eligibility.every(k=>data[k])}:{})};
 if(step==='consent')return {...(agreement.every(k=>typeof data[k]==='boolean')?{agree:agreement.every(k=>data[k])}:{}),...(typeof data.screen==='boolean'?{screen:data.screen}:{})};
 if(step==='prepare')return {...(typeof data.desktop==='boolean'&&typeof data.callReady==='boolean'?{ready:data.desktop&&data.callReady}:{})};
 return data;
}
