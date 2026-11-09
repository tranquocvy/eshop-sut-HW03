import { randomBytes, createHash, timingSafeEqual } from 'node:crypto';
export const token = () => randomBytes(32).toString('base64url');
export const hash = value => createHash('sha256').update(value).digest('hex');
export const equal = (a,b) => typeof a === 'string' && typeof b === 'string' && a.length === b.length && timingSafeEqual(Buffer.from(a),Buffer.from(b));
export function fail(message,status=400) { const e=new Error(message); e.status=status; throw e; }
export function str(v, name, required=false, max=12000) { if(typeof v!=='string'||v.length>max||(required&&!v.trim())) fail('Vui lòng kiểm tra trường '+name+'.'); return v; }
export function bool(v,name) { if(typeof v!=='boolean') fail('Vui lòng chọn rõ Có hoặc Không cho '+name+'.'); return v; }
export function origin(v) { try {const u=new URL(v); if(!['http:','https:'].includes(u.protocol)||u.origin!==v||u.username||u.password) throw 0; return v;}catch{fail('Địa chỉ phải là origin HTTP(S), không có đường dẫn hoặc mật khẩu.');} }
export function scoreSUS(values) {
 if(!Array.isArray(values)||values.length!==10||values.some(v=>!Number.isInteger(v)||v<1||v>5)) return {score:null,contributions:null,reason:'Thiếu hoặc sai câu trả lời; không bù dữ liệu.'};
 const contributions=values.map((v,i)=>i%2?5-v:v-1);
 return {score:contributions.reduce((a,b)=>a+b,0)*2.5,contributions,formula:'SUS odd=response-1; even=5-response; sum*2.5',instrument:'INSTRUMENTS-v0.2'};
}
export const phases=['screening','consent','prepare','scenario','task','sus','probes','video','done','ineligible','declined','withdrawn'];
export const participantFlow = c => c?.participantFlow ?? 'legacy';
export function recordingPolicy(c) {
 const compact=participantFlow(c)==='compact-screen-v1';
 return {participantFlow:participantFlow(c),recording:compact?'screen-only':'legacy-audio-allowed',audioAllowed:!compact,publicEvidenceAllowed:!compact,liveModeration:'external'};
}
// Pilot nội bộ được đánh dấu riêng bởi moderator; không sửa câu trả lời điều kiện.
export const internalPilot = s => s.kind==='pilot' && s.review?.accommodation?.startsWith('INTERNAL-PILOT:')===true;
export function validateStep(s, step,d,draft=false) {
 const compact=participantFlow(s.snapshot)==='compact-screen-v1';
 const probesV04=compact&&s.snapshot.probeVersion==='v0.4';
 const probeChoices=['clarityChoice','recoveryChoice','speedChoice','trustChoice'];
 const fields={
 screening:[...(compact?['eligible']:[]),'adult','vietnamese','shopping','outsideClass','uninvolved','experience','itBackground'],
 consent:['participate','screen','audio','research','verification','publicEvidence','name','maskedContact'],
 prepare:['recorderChecked','playbackChecked','callReady','desktop'],scenario:['understood'],
 task:['finished','product','price','reason','stopReason'],sus:['values','missingReason'],
 probes:['clarity','recovery','recoveryObserved','speed','trust','improvement','missingReason',...(probesV04?probeChoices:[])],
 finish:['videoLater','videoReason'],withdraw:['reason']
 };
 if(!fields[step]||!d||typeof d!=='object'||Array.isArray(d)) fail('Bước hoặc dữ liệu không hợp lệ.');
 if(Object.keys(d).some(k=>!fields[step].includes(k))) fail('Có trường dữ liệu không được hỗ trợ.');
 const booleanFields=['eligible','adult','vietnamese','shopping','outsideClass','uninvolved','participate','screen','audio','research','verification','publicEvidence','recorderChecked','playbackChecked','callReady','desktop','understood','finished','videoLater'];
 for(const [k,v] of Object.entries(d)) {
  if(booleanFields.includes(k)) bool(v,k);
  else if(k==='values') {if(!Array.isArray(v)||v.length!==10||v.some(x=>x!==null&&(!Number.isInteger(x)||x<1||x>5))) fail('SUS cần 10 giá trị 1–5 hoặc bỏ trống (null).');}
  else if(k==='recoveryObserved') {if(v!==null&&typeof v!=='boolean') fail('Ghi nhận phục hồi phải là Có, Không hoặc chưa biết.');}
  else str(v,k);
 }
 if(compact&&step==='consent') {
  if(d.audio===true) fail('Luồng này chỉ quay màn hình, không đồng ý hoặc thu âm thanh.');
  if(d.publicEvidence===true) fail('Luồng này không xin chia sẻ bằng chứng công khai.');
  if(d.name?.trim()||d.maskedContact?.trim()) fail('Luồng này không thu tên hoặc thông tin liên hệ.');
 }
 if(d.maskedContact&&!/[*•…]/u.test(d.maskedContact)) fail('Chỉ nhập liên hệ đã che bằng dấu *, không nhập liên hệ đầy đủ.');
 const groupedScreen=compact&&step==='screening'&&Object.hasOwn(d,'eligible');
 if(groupedScreen&&['adult','vietnamese','shopping','outsideClass','uninvolved'].some(k=>Object.hasOwn(d,k)))fail('Không trộn xác nhận điều kiện chung với câu trả lời từng điều kiện.');
 if(probesV04&&step==='probes'){
  for(const k of probeChoices)if(d[k]!==undefined&&!['yes','no','unsure','skip'].includes(d[k]))fail('Lựa chọn câu hỏi mở không hợp lệ.');
  const expected=d.recoveryChoice==='yes'?true:d.recoveryChoice==='no'?false:null;
  if(d.recoveryChoice!==undefined&&d.recoveryObserved!==undefined&&d.recoveryObserved!==expected)fail('Câu trả lời phục hồi không khớp.');
  for(const [choice,detail] of [['clarityChoice','clarity'],['recoveryChoice','recovery'],['speedChoice','speed']])if(['no','skip'].includes(d[choice])&&d[detail]?.trim())fail('Không gửi giải thích bị ẩn.');
  if(d.trustChoice==='skip'&&d.trust?.trim())fail('Không gửi giải thích đã bỏ qua.');
 }
 if(draft) return s.phase;
 for(const k of fields[step]) if(d[k]===undefined&&!(groupedScreen&&['adult','vietnamese','shopping','outsideClass','uninvolved'].includes(k))&&!(compact&&step==='screening'&&!groupedScreen&&k==='eligible')&&!(step==='withdraw'&&k==='reason')&&!(compact&&step==='consent'&&['name','maskedContact'].includes(k))) fail('Vui lòng trả lời hoặc ghi lý do còn thiếu: '+k+'.');
 switch(step) {
 case 'screening': return ((groupedScreen?d.eligible:['adult','vietnamese','shopping','outsideClass','uninvolved'].every(k=>d[k]))||(compact&&internalPilot(s)))?'consent':'ineligible';
 case 'consent': return d.participate&&d.research&&d.verification?'prepare':'declined';
 case 'prepare':
  if(compact) {
   if(!d.callReady||!d.desktop) fail('Hãy kiểm tra cuộc gọi và máy tính trước khi tiếp tục.');
   if(!s.answers.consent.screen&&!s.review.accommodation) fail('Cần điều phối viên xác nhận phương án phù hợp lựa chọn không quay màn hình.');
   return 'scenario';
  }
  if(!d.callReady||!d.desktop||((!d.recorderChecked||!d.playbackChecked)&&!s.review.accommodation)) fail('Hãy kiểm tra cuộc gọi, máy tính và bản quay thử, hoặc nhờ điều phối viên xác nhận phương án thay thế.');
  if((!s.answers.consent.screen||!s.answers.consent.audio)&&!s.review.accommodation) fail('Cần điều phối viên xác nhận phương án phù hợp lựa chọn đồng ý của bạn.');
  return 'scenario';
 case 'scenario': if(!d.understood) fail('Bạn có thể hỏi điều phối viên trước khi tiếp tục.'); if(!s.taskReleased) fail('Hãy đợi điều phối viên cho bắt đầu.',409);return 'task';
 case 'task': if(d.finished) ['product','price','reason'].forEach(k=>str(d[k],k,true)); else str(d.stopReason,'lý do dừng',true);return 'sus';
 case 'sus': if(d.values.includes(null)) str(d.missingReason,'lý do thiếu câu trả lời',true);return 'probes';
 case 'probes': if(probesV04)return 'video';if(['clarity','recovery','speed','trust'].some(k=>!d[k].trim())||d.recoveryObserved===null) str(d.missingReason,'lý do chưa trả lời',true);return 'video';
 case 'finish': if(d.videoLater||!s.evidence?.some(e=>['received','verified'].includes(e.status))) str(d.videoReason,'lý do video còn thiếu hoặc cần gửi lại',true);return 'done';
 case 'withdraw':return 'withdrawn';
 }
}
export function evidenceStatus(s) {return !s.evidence.length?'pending':s.evidence.some(e=>e.status==='needs-replacement')?'needs-replacement':s.evidence.every(e=>['verified','waived-with-reason'].includes(e.status))?'reviewed':'pending-review';}
export function participant(s) {
 return {id:s.id,code:s.code,kind:s.kind,internalPilot:internalPilot(s),phase:s.phase,revision:s.revision,evidenceStatus:evidenceStatus(s),answers:s.answers,drafts:s.drafts??{},evidence:s.evidence.map(({id,status,size,originalName})=>({id,status,size,originalName})),taskReleased:s.taskReleased,submittedAt:s.submittedAt,withdrawnAt:s.withdrawnAt};
}
export function redacted(s) {
 const answers=structuredClone(s.answers),drafts=structuredClone(s.drafts??{});
 for(const c of [answers.consent,drafts.consent])if(c){delete c.name;delete c.maskedContact;}
 // Free-text is human-authored and requires human privacy review before public sharing.
 return {id:s.id,code:s.code,kind:s.kind,phase:s.phase,revision:s.revision,evidenceStatus:evidenceStatus(s),answers,drafts,submittedAt:s.submittedAt,configVersion:s.snapshot.version,
  review:{outcome:s.review.outcome??null,k1:s.review.k1??null,taskSeconds:s.review.taskSeconds??null,timingSource:s.review.timingSource??null,recoveryObserved:s.review.recoveryObserved??null,reviewed:s.review.reviewed??false,reviewedAt:s.review.reviewedAt??null,notes:s.review.notes??[],observation:s.review.observation??[],accommodation:s.review.accommodation??null},
  events:s.events??[],createdAt:s.createdAt,
  evidence:s.evidence.map(({id,status,size,sha256,source,receivedAt,reviewedAt,reviewReason})=>({id,status,size,sha256,receivedAt,reviewedAt,source:source==='participant'?'participant':'moderator-import',reviewReason:reviewReason? '[private review]':undefined})),sus:{...scoreSUS(answers.sus?.values),status:answers.sus?'submitted':drafts.sus?'draft':'missing'}};
}
export function summary(sessions) {
 const main=sessions.filter(s=>s.kind==='main'&&s.phase==='done'&&s.review.reviewed);
 const scores=main.map(s=>scoreSUS(s.answers.sus?.values).score).filter(v=>v!==null).sort((a,b)=>a-b);
 const n=scores.length;
 return {scope:'main + submitted(done) + moderator reviewed only; pilot/incomplete excluded',reviewedMain:main.length,susDenominator:n,mean:n?scores.reduce((a,b)=>a+b,0)/n:null,median:n?(scores[Math.floor((n-1)/2)]+scores[Math.floor(n/2)])/2:null,range:n?[scores[0],scores.at(-1)]:null,outcomes:main.reduce((a,s)=>{const k=s.review.outcome||'unknown';a[k]=(a[k]||0)+1;return a;},{}),outcomeDenominator:main.length,assignmentComplete:false};
}
export const escapeHTML = v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const csvCell = v=>'"'+String(v??'').replace(/^(?:[=+@\-\t\r\n]|\s+[=+@-])/,"'$&").replaceAll('"','""')+'"';
