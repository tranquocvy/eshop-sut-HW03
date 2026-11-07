import test from 'node:test';import assert from 'node:assert/strict';import {feedbackVerdict} from '../../lib/feedback.mjs';import {assess} from '../../lib/status.mjs';
const before={button:{visible:true,text:'Thêm vào giỏ hàng',disabled:false,busy:null},cart:{visible:true,text:'Giỏ hàng',counts:[]},notices:[]};
test('Unrelated header/login change cannot release dependency',()=>assert.equal(feedbackVerdict(before,{...before,header:'Hello Alice'}),'none'));
test('Hidden success notice is not visual proof',()=>assert.equal(feedbackVerdict(before,{...before,notices:[{text:'Đã thêm vào giỏ',visible:false}]}),'none'));
test('Visible unrelated notice is not action proof',()=>assert.equal(feedbackVerdict(before,{...before,notices:[{text:'Đăng nhập thành công',visible:true}]}),'none'));
test('Busy alone needs review, not success',()=>assert.equal(feedbackVerdict(before,{...before,button:{...before.button,busy:'true'}}),'ambiguous'));
test('Disabled alone needs review, not success',()=>assert.equal(feedbackVerdict(before,{...before,button:{...before.button,disabled:true}}),'ambiguous'));
test('Visible action-related success toast accepted',()=>assert.equal(feedbackVerdict(before,{...before,notices:[{text:'Đã thêm vào giỏ hàng',visible:true}]}),'success'));
test('Visible success state on action button accepted',()=>assert.equal(feedbackVerdict(before,{...before,button:{...before.button,text:'Đã thêm'}}),'success'));
test('Actual visible cart badge 1 accepted',()=>assert.equal(feedbackVerdict(before,{...before,cart:{visible:true,text:'Giỏ hàng 1',counts:[1]}}),'success'));
test('Existing badge or hidden badge cannot certify new action',()=>{assert.equal(feedbackVerdict({...before,cart:{visible:true,counts:[1]}},{...before,cart:{visible:true,counts:[1]}}),'none');assert.equal(feedbackVerdict(before,{...before,cart:{visible:false,counts:[1]}}),'none');});
test('Text containing expect does not turn setup failure into SUT fail',()=>assert.equal(assess({nativeStatus:'failed',actual:{old:true},errors:[{message:'expect(setup).toBe ready'}]}).assessment,'blocked'));
test('Technical capture failure overrides earlier oracle failure',()=>assert.equal(assess({nativeStatus:'failed',oracleFailure:true,technicalFailure:true}).assessment,'blocked'));

test('Negative success wording never certifies acceptance',()=>{assert.equal(feedbackVerdict(before,{...before,button:{...before.button,text:'Thêm chưa thành công'}}),'ambiguous');assert.notEqual(feedbackVerdict(before,{...before,notices:[{text:'Sản phẩm không được thêm thành công',visible:true}]}),'success');});
