import { escapeHTML } from './domain.mjs';
const probeChoice=v=>({yes:'Có',no:'Không',unsure:'Không chắc',skip:'Bỏ qua'}[v]??'Chưa ghi');
const missing='Chưa có dữ liệu';
const text=v=>v===null||v===undefined||v===''?missing:typeof v==='boolean'?(v?'Có':'Không'):String(v);
const pairs=v=>v&&typeof v==='object'?Object.entries(v).map(([k,x])=>k+': '+text(x)).join('; '):text(v);
const outcome=v=>({'independent':'Độc lập','assisted':'Có hỗ trợ','unfinished':'Chưa hoàn thành','technical-interruption':'Gián đoạn kỹ thuật'}[v]??text(v));
const md=v=>escapeHTML(text(v)).replace(/\\/g,'&#92;').replace(/\|/g,'&#124;').replace(/[\r\n]+/g,' ').replace(/([\x60*_[\]{}!])/g,'\\$1').replace(/^#/,'\\#');
/** Human-readable report derived only from the already redacted reproducible export. */
export function reportSections(r){
 const ss=r.sessions,main=ss.filter(s=>s.kind==='main'),pilot=ss.filter(s=>s.kind==='pilot');
 const reviewed=main.filter(s=>s.phase==='done'&&s.review.reviewed);
 const timed=reviewed.filter(s=>Number.isFinite(s.review.taskSeconds)&&s.review.timingSource);
 const blocks=[];
 const heading=t=>blocks.push({heading:t}),p=t=>blocks.push({paragraph:t});
 const table=(headers,rows)=>blocks.push({headers,rows});
 heading('1. Mục tiêu và thiết kế');
 p('RQ1: tìm sản phẩm, điều hướng, trở ngại và thời gian. RQ2: hiểu tên/giá/mô tả và căn cứ lựa chọn, mức tin tưởng. RQ3: khả năng tự phục hồi khi thực sự gặp khó khăn; không gặp thì ghi không quan sát được, không tự đánh đạt.');
 p('Profile D1-A: từ 18 tuổi, đọc hiểu tiếng Việt, từng xem/tìm sản phẩm online trong 12 tháng, ngoài lớp HW03 và không tham gia phát triển SUT/thiết kế nghiên cứu. Mục tiêu: một pilot trước bảy phiên chính. Pilot không gộp vào mẫu chính.');
 heading('2. Scenario và tiêu chí K1');
 p('D2-A: Bạn đang cân nhắc mua một chiếc điện thoại cho bản thân, với ngân sách tối đa 30 triệu đồng. Hãy dùng EShop để tìm một sản phẩm phù hợp. Khi đã quyết định, cho biết bạn chọn sản phẩm nào, giá bao nhiêu và thông tin nào trên website giúp bạn lựa chọn. Chưa cần mua hoặc thêm vào giỏ hàng.');
 p('K1 độc lập cần cả ba: tìm đúng loại/ngân sách từ Home; mở chi tiết và xác định đúng tên/giá; nêu căn cứ trên site và thông báo quyết định, không có gợi ý chỉ đường. Lời tự báo đã xong không tự chứng minh K1.');
 heading('3. Phương pháp, protocol và nguồn');
 p('Moderated online desktop, think-aloud qua cuộc gọi live bên ngoài portal và screen share theo consent. Không ép trả lời; không điền bù missing. Portal markers không phải thời gian task.');
 for(const c of r.snapshots) p('Snapshot '+c.version+' — '+((c.participantFlow??'legacy')==='compact-screen-v1'?'compact-screen-v1: chỉ quay màn hình, không thu âm thanh; kiểm máy tính/cuộc gọi; không thu tên/liên hệ, không xin chia sẻ bằng chứng công khai.':'legacy: cho phép audio theo consent; kiểm recorder/phát lại hoặc phương án thay thế.')+' Screening → consent → chuẩn bị → hiểu scenario và moderator release → task trên SUT tab riêng → SUS 10 câu 1–5 → probes → upload/import video → moderator kiểm evidence và review. Không thu âm không có nghĩa là không think-aloud qua cuộc gọi live.');
 table(['Nguồn thiết kế','Vai trò / giới hạn'],[
 ['hw03/usability/EVALUATION-DESIGN.md','D1-A / D2-A / K1, RQ1–RQ3'],
 ['hw03/usability/PROTOCOL.md','Moderation, think-aloud, assistance, dừng, đo thời gian'],
 ['hw03/usability/INSTRUMENTS.md','SUS và probes; bản Việt cần human/pilot review'],
 ['hw03/usability/ONLINE-STUDY-PLAN.md','Tách origin, raw/derived, evidence, privacy'],
 ['hw03/tools/usability-study/CONTRACT.md','API và cấu trúc dữ liệu'],
 ['Provenance runtime SUT / adapter / DB','Xem fingerprint từng snapshot bên dưới nếu được startup cung cấp. Chưa có thì ghi chưa có dữ liệu; không suy kiểm chứng runtime/remote, byte-identical bundle hoặc W01 PASS.']]);
 p('Các đường dẫn trên là tài liệu tham chiếu; phiên bản áp dụng cho từng phiên nằm trong provenance snapshot bên dưới, không suy từ bản tài liệu hiện hành.');
 table(['Snapshot','Study origin','SUT origin','Scenario / instrument / protocol','Hạn rút / xóa'],r.snapshots.map(c=>[c.version,c.studyOrigin,c.sutOrigin,pairs(c.provenance),c.withdrawBy+' / '+c.deleteBy]));
 for(const c of r.snapshots){
  p('Provenance snapshot '+c.version+' — commit: '+text(c.sutProvenance?.sutCommit)+'; transport (khai báo startup): '+text(c.sutProvenance?.transport));
  table(['Source path tương đối','SHA-256'],Object.entries(c.sutProvenance?.sourceHashes??{}));
 }
 heading('4. Phiên và mẫu số thực tế');
 p('Chỉ phiên main đã nộp (done) và được moderator review mới vào summary. done chỉ xác nhận đã nhận khảo sát, không xác nhận phiên người thật hợp lệ hay hoàn thành độc lập. Không tự đánh hoàn thành bài.');
 table(['Chỉ số','Tử số / mẫu số hoặc giá trị'],[
 ['Slot main có bản ghi (không gồm withdrawn)',main.length+' / 7 dự kiến'],
 ['Pilot có bản ghi',pilot.length],
 ['Main đã nộp và review',reviewed.length+' / '+main.length+' main có bản ghi'],
 ['SUS đủ 10 câu hợp lệ',r.summary.susDenominator+' / '+reviewed.length+' main đã review'],
 ['Outcome có ghi nhận',reviewed.filter(s=>s.review.outcome).length+' / '+reviewed.length+' main đã review'],
 ['Task time có nguồn',timed.length+' / '+reviewed.length+' main đã review'],
 ['SUS mean / median / range',text(r.summary.mean)+' / '+text(r.summary.median)+' / '+(r.summary.range?.join('–')??missing)]]);
 table(['Mã','Loại','Tiến độ','Nộp khảo sát','Review','Video / lý do thiếu'],ss.map(s=>[s.code,s.kind,s.phase,s.submittedAt,s.review.reviewed,
  s.evidence.length?s.evidence.map(e=>e.id+': '+e.status).join('; '):'Chưa nhận video; '+text(s.answers.finish?.videoReason)]));
 heading('5. SUS: dữ liệu thô và phép tính');
 p('Câu lẻ: response − 1; câu chẵn: 5 − response. Tổng 10 contributions × 2,5 = SUS 0–100, không phải phần trăm thành công. Thiếu/không hợp lệ: không tính tổng. Bảng hiển thị từng phiên để truy vết; pilot và phiên chưa review không được gộp vào summary.');
 table(['Mã','Trạng thái trả lời','Q1–Q10 đã nộp (— = thiếu)','C1–C10','SUS','Lý do thiếu'],ss.map(s=>[s.code,s.sus.status==='draft'?'Bản nháp — chưa nộp, không tính điểm':s.sus.status==='submitted'?'Đã nộp':'Chưa nộp',s.answers.sus?.values?.map(v=>v??'—').join(', '),s.sus.contributions?.join(', '),s.sus.score,s.answers.sus?.missingReason||s.sus.reason]));
 heading('6. Performance, K1 và nguồn thời gian');
 table(['Mã','Tự báo task / lý do dừng','K1 moderator','Outcome moderator','Giây','Nguồn đo','Recovery thực tế'],ss.map(s=>[s.code,
  s.answers.task?(s.answers.task.finished?'Đã xong: '+[s.answers.task.product,s.answers.task.price,s.answers.task.reason].join('; '):'Dừng: '+s.answers.task.stopReason):null,
  pairs(s.review.k1),outcome(s.review.outcome),s.review.taskSeconds,s.review.timingSource,s.review.recoveryObserved===null?'Không quan sát / chưa ghi':s.review.recoveryObserved]));
 table(['Outcome trong main đã review','Số / mẫu số'],Object.entries(r.summary.outcomes).map(([k,v])=>[outcome(k),v+' / '+r.summary.outcomeDenominator]));
 for(const s of ss){
  if(s.review.notes?.length||s.review.observation?.length||s.review.accommodation){
   p('Ghi nhận '+s.code+' — phương án thay thế: '+text(s.review.accommodation));
   table(['Loại','Thời điểm','Nội dung'],['notes','observation'].flatMap(k=>(s.review[k]??[]).map(n=>[k,n.at,n.text])));
  }
 }
 // Lựa chọn/tự báo không phải recovery do moderator quan sát; lời trống không tự thành Không gặp.
 for(const s of ss)if(s.answers.probes?.clarityChoice!==undefined){const a=s.answers.probes;p('Probes tự soạn v0.4 — '+s.code+'; tách khỏi SUS và quan sát moderator.');table(['Nhóm','Lựa chọn tự báo','Giải thích không bắt buộc'],[['Clarity',probeChoice(a.clarityChoice),a.clarity],['Recovery',probeChoice(a.recoveryChoice),a.recovery],['Speed',probeChoice(a.speedChoice),a.speed],['Trust',probeChoice(a.trustChoice),a.trust]]);if(a.improvement)p('Góp ý thêm '+s.code+': '+a.improvement);}
 heading('7. Pilot, thay đổi và freeze');
 p('Cấu hình hiện tại: version '+r.config.version+'; pilotReview: '+text(r.policy.pilotReview)+'; frozen: '+text(r.policy.frozen)+'. Cờ review/freeze là khai báo của moderator; không chứng minh tự động nghiên cứu người thật.');
 table(['Pilot','Review lúc','Snapshot','Tham chiếu phiên'],pilot.map(s=>[s.code,s.review.reviewedAt,s.configVersion,s.id]));
 table(['Thời điểm thay đổi','Version từ → đến','Trường thay đổi','Frozen / pilotReview','Pilot refs'],(r.configHistory??[]).map(h=>[h.at,h.fromVersion+' → '+h.toVersion,h.changedFields.join(', '),text(h.frozen)+' / '+text(h.pilotReview),h.pilotRefs.join(', ')]));
 p('Lý do thay đổi/pilot issues phải được moderator ghi trong notes/observations của pilot và đối chiếu lịch sử cấu hình ở trên. Nếu không có ghi nhận thì chưa có change rationale; không tự dựng. Dữ liệu cũ trước khi có lịch sử không được suy ngược thời điểm freeze.');
 heading('8. Findings, severity và khuyến nghị');
 if(!r.findings.length)p('Chưa có finding được ghi. Không tự sinh kết luận từ số form đã điền.');
 for(const f of r.findings){
  p('Finding '+f.id+' — '+f.title);
  const refs=ss.filter(s=>f.participantIds.includes(s.id));
  table(['Thuộc tính','Nội dung'],[
   ['Loại / severity',f.kind+' / '+f.severity],['Cơ sở severity',f.reason],
   ['Phiên tham chiếu',refs.map(s=>s.code).join(', ')],
   ['Mẫu số exposure','Có '+refs.length+' phiên được tham chiếu; chưa có dữ liệu số người thực sự exposed. Không suy tỷ lệ prevalence.'],
   ['Expected / actual',text(f.expected)+' / '+text(f.actual)],['Các bước tái hiện',f.reproduction],
   ['Khuyến nghị',f.recommendation],['Issue reference (không tự đăng)',f.issueUrl],
   ['Evidence refs',f.evidenceRefs.join(', ')],['Cập nhật',f.updatedAt]]);
 }
 heading('9. Evidence manifest (không kèm tệp hay đường dẫn riêng)');
 table(['Mã','Evidence ID','Trạng thái','Bytes','SHA-256','Nguồn'],ss.flatMap(s=>s.evidence.map(e=>[s.code,e.id,e.status,e.size,e.sha256,e.source])));
 p('received chỉ là receipt; verified cần moderator xem/phát và đối chiếu consent/task. Header magic/checksum không chứng minh codec phát được hoặc authenticity. Evidence thiếu/cần thay không được coi là đủ. Video chỉ playback bằng admin auth, không có link public trong report.');
 heading('10. Giới hạn, DRAFT và quyền riêng tư');
 p('DRAFT — cần con người kiểm tra. Không chứng nhận hoàn thành HW03, không tự xác thực người thật, live moderation hay remote acceptance. Mẫu nhỏ 7 người, catalog nhỏ, bản dịch SUS làm việc và thiếu dữ liệu giới hạn khả năng suy rộng; không suy quan hệ nhân quả hoặc tỷ lệ dân số.');
 p('Luồng compact không thu tên/liên hệ, không xin chia sẻ bằng chứng công khai; export không phải quyền công bố. Tên/liên hệ lịch sử legacy đã tách sang participant table riêng; known identifiers được che trong export. Văn bản tự do, ghi chú, Issue URL và video có thể còn PII gián tiếp: người phụ trách phải rà soát/khử định danh thủ công trước khi chia sẻ. Không công khai report/video chỉ vì đã export. Bảng participant vẫn riêng tư.');
 p('JSON export riêng giữ dữ liệu raw đã khử định danh, snapshots, events, review, findings và derived scores để dựng lại phân tích. Markdown/HTML này là báo cáo đọc được, không thay thế JSON. Phiên withdrawn không có trong dataset và không được dựng lại. In / Lưu PDF từ HTML sau khi review.');
 return blocks;
}
export function renderStudyReport(r,format='markdown'){
 const blocks=reportSections(r);
 if(format==='html'){
  const e=v=>escapeHTML(text(v));
  const body=blocks.map(b=>b.heading?'<h2>'+e(b.heading)+'</h2>':b.paragraph?'<p>'+e(b.paragraph)+'</p>':
   '<table><thead><tr>'+b.headers.map(h=>'<th scope="col">'+e(h)+'</th>').join('')+'</tr></thead><tbody>'+
   (b.rows.length?b.rows.map(row=>'<tr>'+row.map(v=>'<td>'+e(v)+'</td>').join('')+'</tr>').join(''):'<tr><td colspan="'+b.headers.length+'">Chưa có dữ liệu</td></tr>')+'</tbody></table>').join('\n');
  return '<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Báo cáo usability — DRAFT</title><style>body{font:14px sans-serif;margin:2em;line-height:1.5}table{border-collapse:collapse;width:100%;margin:1em 0}th,td{border:1px solid #888;padding:.4em;text-align:left;overflow-wrap:anywhere;white-space:pre-wrap}h2{break-after:avoid}thead{display:table-header-group}@media print{body{margin:0;font-size:10pt}tr{break-inside:avoid}}</style></head><body><h1>Báo cáo usability — DRAFT</h1><p>Xuất lúc '+e(r.generatedAt)+'</p>'+body+'</body></html>';
 }
 return '# Báo cáo usability — DRAFT\n\nXuất lúc '+md(r.generatedAt)+'\n\n'+blocks.map(b=>b.heading?'## '+md(b.heading):b.paragraph?md(b.paragraph):
  '| '+b.headers.map(md).join(' | ')+' |\n| '+b.headers.map(()=>'---').join(' | ')+' |\n'+(b.rows.length?b.rows:[b.headers.map((_,i)=>i===0?missing:'')]).map(row=>'| '+row.map(md).join(' | ')+' |').join('\n')).join('\n\n')+'\n';
}
