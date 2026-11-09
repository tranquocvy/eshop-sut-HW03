import test from 'node:test';import assert from 'node:assert/strict';
import {probeQuestions,probePayload,showProbeDetail} from '../portal/probes-v04.mjs';
import {compactPayload} from '../portal/compact-flow.mjs';
import {validateStep} from '../server/domain.mjs';
const session={phase:'probes',snapshot:{participantFlow:'compact-screen-v1',probeVersion:'v0.4'}};
const answers=value=>Object.fromEntries(probeQuestions.map(q=>[q.choice,value]));
test('v0.4 explicit choices, skip/unsure preserved and details genuinely optional',()=>{
 assert.equal(probeQuestions.length,4);const empty=probePayload({});assert(!('clarityChoice' in empty));assert.throws(()=>validateStep(session,'probes',empty));assert.equal(validateStep(session,'probes',empty,true),'probes');
 for(const value of ['yes','no','unsure','skip']){const p=probePayload(answers(value));assert.equal(validateStep(session,'probes',p),'video');assert.equal(p.recoveryObserved,value==='yes'?true:value==='no'?false:null);assert.equal(p.missingReason,'');}
 assert.throws(()=>validateStep(session,'probes',{...probePayload(answers('skip')),clarityChoice:'bad'},true));
});
test('hidden details are excluded, skipped details cannot be sent, legacy contract unchanged',()=>{
 const d={...answers('no'),clarity:'stale hidden',recovery:'stale hidden',speed:'stale hidden',trust:'visible trust'};const p=probePayload(d);
 assert.equal(p.clarity,'');assert.equal(p.recovery,'');assert.equal(p.speed,'');assert.equal(p.trust,'visible trust');
 assert.equal(showProbeDetail(probeQuestions[3],'no'),true);assert.equal(showProbeDetail(probeQuestions[0],'no'),false);
 assert.throws(()=>validateStep(session,'probes',{...p,clarity:'stale'}));assert.throws(()=>validateStep(session,'probes',{...p,recoveryObserved:true}));
 const skipped=probePayload({...answers('skip'),trust:'stale'});assert.equal(skipped.trust,'');
 const legacy={phase:'probes',snapshot:{participantFlow:'compact-screen-v1'}};assert.throws(()=>validateStep(legacy,'probes',p));
 const old={clarity:'',recovery:'',recoveryObserved:null,speed:'',trust:'',improvement:'',missingReason:'voluntary skip'};assert.equal(validateStep(legacy,'probes',old),'video');
 assert.deepEqual(compactPayload('probes',old),old);assert.deepEqual(compactPayload('probes',answers('skip'),{probeVersion:'v0.4'}),skipped);
});
