import test from 'node:test';
import assert from 'node:assert/strict';
import {compactFlow,compactPayload,compactRestore} from '../portal/compact-flow.mjs';
test('compact choices never preselect consent or eligibility and preserve explicit refusal',()=>{
 assert.equal(compactFlow({}),false);assert.equal(compactFlow({participantFlow:'compact-screen-v1'}),true);
 const empty=compactPayload('consent',{});for(const key of ['participate','research','verification','screen'])assert.equal(Object.hasOwn(empty,key),false);
 assert.equal(empty.audio,false);assert.equal(empty.publicEvidence,false);
 assert.deepEqual(compactRestore('consent',empty),{});
 const no=compactPayload('consent',{agree:false,screen:false,name:'must not collect',maskedContact:'must not collect'});
 assert.equal(no.participate,false);assert.equal(no.research,false);assert.equal(no.verification,false);assert.equal(no.name,'');assert.equal(no.maskedContact,'');
 assert.deepEqual(compactRestore('consent',no),{agree:false,screen:false});
 assert.equal(Object.hasOwn(compactPayload('screening',{}),'adult'),false);
 assert.deepEqual(compactPayload('screening',{eligible:true}),{eligible:true,experience:'',itBackground:''});
 assert.deepEqual(compactPayload('screening',{eligible:false}),{eligible:false,experience:'',itBackground:''});
 assert.deepEqual(compactRestore('screening',compactPayload('screening',{eligible:false})),{eligible:false});
});
test('compact preparation does not fabricate recorder tests and pending video retains reason',()=>{
 assert.deepEqual(compactPayload('prepare',{ready:true}),{desktop:true,callReady:true,recorderChecked:false,playbackChecked:false});
 assert.deepEqual(compactRestore('prepare',{desktop:true,callReady:true,recorderChecked:false,playbackChecked:false}),{ready:true});
 assert.deepEqual(compactPayload('finish',{videoReason:'mất mạng'},{hasEvidence:false}),{videoLater:true,videoReason:'mất mạng'});
 assert.deepEqual(compactPayload('finish',{videoReason:''},{hasEvidence:true}),{videoLater:false,videoReason:''});
});

import {validateStep} from '../server/domain.mjs';
test('grouped eligibility stores only the actual overall answer, not invented per-condition negatives',()=>{
 const session={phase:'screening',snapshot:{participantFlow:'compact-screen-v1'}};
 const yes=compactPayload('screening',{eligible:true});const no=compactPayload('screening',{eligible:false});
 assert.equal(validateStep(session,'screening',yes),'consent');assert.equal(validateStep(session,'screening',no),'ineligible');
 assert(!Object.hasOwn(no,'adult'));assert.throws(()=>validateStep(session,'screening',{...yes,adult:false}));
});
