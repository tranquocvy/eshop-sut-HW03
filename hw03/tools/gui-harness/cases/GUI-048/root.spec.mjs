import {test,detail} from '../../lib/evidence.mjs';
import {feedbackVerdict,snapshotFeedback} from '../../lib/feedback.mjs';
test('GUI-048::detail-first-click',async({browser,evidence:ev})=>{
 ev.expected('Có feedback trực quan liên quan hành động sau đúng một click đầu: success trên nút/toast hoặc badge quantity=1; busy-only/không rõ cần review, không cung cấp prerequisite.');
 const page=await ev.open(browser);await detail(page);await ev.shot('01-before');
 const before=await snapshotFeedback(page);ev.step('first-click',{count:1,quantity:'1'});await page.getByRole('button',{name:'Thêm vào giỏ hàng',exact:true}).click();
 let after,verdict='none',ambiguousSeen=false;const samples=[];const deadline=Date.now()+2000;
 do{after=await snapshotFeedback(page);const current=feedbackVerdict(before,after);samples.push({at:new Date().toISOString(),verdict:current,observed:after});ambiguousSeen ||= current==='ambiguous';if(current==='success'){verdict='success';break;}await new Promise(r=>setTimeout(r,75));}while(Date.now()<deadline);
 if(verdict!=='success'&&ambiguousSeen)verdict='ambiguous';
 const observation={before,after,samples,firstClickCount:1,feedbackVerdict:verdict};ev.actual(observation);await ev.shot('02-after-first-click');
 if(verdict==='ambiguous'){ev.review(observation,'visible-feedback-unconfirmed');return;}
 ev.assert('first-visible-action-feedback',verdict==='success',observation,'Success feedback nhìn thấy và liên quan hành động, hoặc badge đúng state; không nhận hidden/unrelated/busy-only.',{class:'R',refs:['GUI-048','FR-06','FR-24']});
});
