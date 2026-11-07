import {test,detail} from '../../lib/evidence.mjs';
for(const quantity of ['1','2'])test('GUI-025::quantity-'+quantity+'--detail',async({browser,evidence:ev})=>{
 ev.expected('Ô giữ đúng số nguyên dương '+quantity+' sau blur; không suy ra hành động đã tiếp nhận.');const page=await ev.open(browser);await detail(page);await ev.shot('01-before');const input=page.getByRole('spinbutton');await input.fill(quantity);await input.press('Tab');ev.step('quantity-edited',{quantity,action:'fill then Tab; no add click'});
 const observation=await input.evaluate(e=>({valid:e.validity.valid,validationMessage:e.validationMessage,value:e.value}));ev.actual(observation);await ev.shot('02-after-blur');ev.assert('valid-input-retained',observation.value===quantity&&observation.valid,observation,'Giữ nguyên '+quantity+' và validity không báo sai',{class:'H',refs:['GUI-025','S13 tr.11/19'],rationale:'Hành vi giữ giá trị là đề xuất; miền số nguyên dương theo FR-06.'});
});
