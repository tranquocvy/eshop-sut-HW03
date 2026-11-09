import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateStep,internalPilot,summary} from './domain.mjs';
test('internal pilot accommodates honest ineligibility, never main or legacy; no aggregate inclusion',()=>{
 const d={eligible:false,experience:'',itBackground:''};
 const s={kind:'pilot',phase:'screening',snapshot:{participantFlow:'compact-screen-v1'},review:{accommodation:'INTERNAL-PILOT: study designer; technical rehearsal only'}};
 assert.equal(internalPilot(s),true);assert.equal(validateStep(s,'screening',d),'consent');assert.equal(d.eligible,false);
 assert.equal(validateStep({...s,kind:'main'},'screening',d),'ineligible');
 assert.equal(validateStep({...s,review:{accommodation:'Other'}},'screening',d),'ineligible');
 assert.equal(validateStep({...s,snapshot:{}},'screening',{adult:true,vietnamese:true,shopping:true,outsideClass:false,uninvolved:false,experience:'',itBackground:''}),'ineligible');
 assert.equal(summary([{...s,phase:'done',review:{...s.review,reviewed:true}}]).reviewedMain,0);
});
