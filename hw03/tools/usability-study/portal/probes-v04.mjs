// Câu hỏi tự soạn, không phải SUS/UEQ-S. Không tính thành thang điểm.
export const probeQuestions=[
 {choice:'clarityChoice',detail:'clarity',title:'Trong lúc tìm điện thoại, có thông tin hoặc nút nào bạn chưa hiểu rõ không?',follow:'Đó là chỗ nào? Bạn nghĩ nó có nghĩa gì?'},
 {choice:'recoveryChoice',detail:'recovery',title:'Trong lúc làm, bạn có bấm nhầm, gặp lỗi hoặc bị kẹt ở bước nào không?',follow:'Bạn đã làm gì tiếp theo? Có tiếp tục được không?'},
 {choice:'speedChoice',detail:'speed',title:'Có bước nào mất nhiều thời gian hơn bạn mong đợi không?',follow:'Đó là bước nào? Điều gì làm bạn mất thời gian?'},
 {choice:'trustChoice',detail:'trust',title:'Thông tin trên EShop đã đủ để bạn quyết định chọn một chiếc điện thoại chưa?',follow:'Thông tin nào giúp bạn quyết định, hoặc bạn còn cần biết thêm điều gì?'}
];
export const probeOptions=[['Có','yes'],['Không','no'],['Không chắc','unsure'],['Bỏ qua câu này','skip']];
export const showProbeDetail=(q,value)=>q.choice==='trustChoice'?['yes','no','unsure'].includes(value):['yes','unsure'].includes(value);
export function probePayload(data){
 const out={};for(const q of probeQuestions){if(data[q.choice]!==undefined)out[q.choice]=data[q.choice];out[q.detail]=showProbeDetail(q,data[q.choice])?(data[q.detail]??''):'';}
 out.recoveryObserved=data.recoveryChoice==='yes'?true:data.recoveryChoice==='no'?false:null;
 out.improvement=data.improvement??'';out.missingReason='';return out;
}
