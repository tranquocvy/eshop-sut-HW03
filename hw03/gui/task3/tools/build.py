from pathlib import Path
import json,hashlib,shutil,collections,re,html
from datetime import datetime,timezone
repo=Path(r'D:/Workspace/SoftwareTesting/HW03/eshop-sut-HW03');work=repo.parent/'_working/eshop-sut-HW03';out=repo/'hw03/gui/task3';out.mkdir(parents=True,exist_ok=True)
platforms={'chrome':['task3-chrome-20261110/runs/2026-11-09T18-12-09-870Z'],'edge':['task3-edge-20261110/runs/2026-11-09T18-27-08-246Z'],'firefox':['task3-firefox-content-full-20261110/runs/2026-11-09T18-55-41-740Z','task3-firefox-content-full-20261110/runs/2026-11-09T18-59-52-389Z']}
rows=[];environments=[];inventory=[];integrityExceptions=[]
def dump(p,v):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(v,ensure_ascii=False,indent=2),encoding='utf-8')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
for platform,runpaths in platforms.items():
 keys=set();versions=set()
 for runpath in runpaths:
  run=work/runpath
  for p in sorted(run.glob('GUI-*/**/result.json')):
   r=json.loads(p.read_text(encoding='utf-8'));assert r['instanceKey'] not in keys;keys.add(r['instanceKey']);case=r['checklistId'];key='--'.join([case,r['variant'],r['page'],r['viewportKey']]);folder=out/'evidence'/platform/key;folder.mkdir(parents=True,exist_ok=True)
   pics=[]
   for e in r['evidence']:
    if e['kind'] not in ['screenshot','native-window-screenshot','content-screenshot-with-url-label']:continue
    src=run/e['path'];actualHash=sha(src)
    if actualHash!=e['sha256']:
     integrityExceptions.append({'platform':platform,'caseId':case,'sourcePath':e['path'],'expectedSHA256':e['sha256'],'actualSHA256':actualHash,'action':'Excluded from packaged evidence; raw preserved. Native capture must be retaken for submission.'});continue
    dest=folder/src.name;shutil.copyfile(src,dest);rel=dest.relative_to(out).as_posix();pics.append({'kind':e['kind'],'path':rel,'sha256':e['sha256']});inventory.append({'path':rel,'sha256':e['sha256'],'sourceRun':runpath,'sourcePath':e['path']})
   events=p.parent/'logs/events.jsonl'
   if events.exists():
    for ln in events.read_text(encoding='utf-8').splitlines():
     ev=json.loads(ln)
     if 'browserVersion' in ev:versions.add(ev['browserVersion'])
   row={'platform':platform,'caseId':case,'variant':r['variant'],'page':r['page'],'viewport':r['viewportKey'],'comparisonKey':key,'assessment':r['assessment'],'expected':r['expected'],'actual':r['actual'],'assertions':r['assertionResults'],'actions':r['actionsPerformed'],'reason':r.get('reason'),'prerequisites':r['prerequisites'],'blockedBy':r['blockedBy'],'sourceCommit':r['sutHash'],'startedAtUTC':r['startedAt'],'finishedAtUTC':r['finishedAt'],'humanReview':r['humanReview'],'evidence':pics,'sourceRun':runpath,'sourceResult':str(p.relative_to(run)),'reviewStatus':'pending' if r['assessment']=='needs-review' else 'not-required'}
   dest=out/'records'/platform/(key+'.json');dump(dest,row);row['recordPath']=dest.relative_to(out).as_posix();rows.append(row)
 assert len(keys)==122
 environments.append({'platform':platform,'browser':'Playwright Firefox (patched Gecko)' if platform=='firefox' else 'Installed Google Chrome' if platform=='chrome' else 'Installed Microsoft Edge','versions':sorted(versions),'os':'Windows_NT 10.0.26300','runner':'Playwright Test 1.65.0','viewports':'VD 1440x900; VM 390x844 CSS px; same Windows platform','runs':runpaths,'capture':'content + transparent URL label (not native address bar)' if platform=='firefox' else 'native window screenshot + email overlay','runtimeMode':'Copied tracked SUT source; existing SQLite OPEN_READONLY; no initializer/seed; GET products/categories only'})
counts={p:dict(collections.Counter(r['assessment'] for r in rows if r['platform']==p)) for p in platforms};total=dict(collections.Counter(r['assessment'] for r in rows))
bykey=collections.defaultdict(dict)
for r in rows:bykey[r['comparisonKey']][r['platform']]=r['assessment']
diffs=[{'key':k,'assessments':v} for k,v in bykey.items() if len(set(v.values()))>1]
assert len(rows)==366 and len(bykey)==122
summary={'ids':52,'variantsPerPlatform':122,'platformCount':3,'executionRecords':366,'counts':counts,'total':total,'statusDifferences':diffs,'submissionStatus':'execution packaged; pending human review and assignment exceptions','pendingReview':114,'integrityExceptions':integrityExceptions,'evidenceFiles':len(inventory)}
dump(out/'results.json',{'schemaVersion':'task3-aggregate-1','summary':summary,'environments':environments,'records':rows});dump(out/'evidence/inventory.json',inventory)
# Map existing Task 1 issue groups without importing historical review decisions.
issueText=(repo/'hw03/gui/task1/findings/README.md').read_text(encoding='utf-8');findings=[]
for line in issueText.splitlines():
 m=re.search(r'\[([RH]\d+).*?— (.*?)\]\([^)]*\).*?\[Issue #(\d+)\]\((https:[^)]*)\).*?— (.*)',line)
 if not m:continue
 ids=re.findall(r'GUI-\d+',m[5]);status={p:dict(collections.Counter(r['assessment'] for r in rows if r['platform']==p and r['caseId'] in ids)) for p in platforms};findings.append({'group':m[1],'title':m[2],'issue':m[4],'caseIds':ids,'task3Statuses':status,'interpretation':'Same checklist area; raw Fail supports recurrence, pending review does not independently confirm recurrence; no new issue created.'})
assert len(findings)==19
dump(out/'findings/mapping.json',findings)
fl=['# Đối chiếu 19 Issues Task 1','','Không sao chép verdict sau review của Task 1. Đây là đối chiếu theo checklist ID; không khẳng định cùng root cause. Fail mới hỗ trợ tái hiện; needs-review cần đánh giá bằng evidence Task 3. Không có Issue mới được đăng.','']
for f in findings:fl+=['- ['+f['group']+' — '+f['title']+']('+f['issue']+'): '+', '.join(f['caseIds'])+'; '+str(f['task3Statuses'])]
(out/'findings/README.md').write_text('\n'.join(fl),encoding='utf-8')
envtext='# Môi trường thực thi\n\n'+ '\n\n'.join('## '+e['platform']+'\n\n'+ '\n'.join('- '+k+': '+str(v) for k,v in e.items() if k!='platform') for e in environments)
(out/'ENVIRONMENTS.md').write_text(envtext,encoding='utf-8')
dump(out/'integrity-exceptions.json',integrityExceptions)
limitations=['Edge GUI-001 native screenshot checksum mismatch: excluded from packaged evidence; content original retained; cần chụp lại native evidence.','Edge thay Safari/Android Chrome theo lựa chọn của sinh viên; chưa có xác nhận TA rằng thay thế này được chấp nhận.','114 biến thể needs-review: chưa có human sign-off trên evidence Task 3; không kế thừa manual Pass của Task 1.','Firefox dùng binary có patch của Playwright 159.0, không phải Firefox Microsoft Store; URL trong ảnh là nhãn từ page.url(), không phải thanh địa chỉ thật.','Chrome dùng overlay nền tối của lượt trước; Edge/Firefox dùng nền trong suốt. Không chỉnh ảnh lịch sử để giả lượt chạy mới.','Overlay hiện có email/MSSV qua email, chưa có họ tên đầy đủ theo §11. Cần làm rõ/bổ sung identity evidence trước nộp.','Zoom 200% và IME thật chưa thực thi; dependency Blocked không được coi Pass/N/A.','Windows ở cả ba browser; VM chỉ là viewport hẹp, không phải Android.','14 Blocked mỗi browser được giữ nguyên; thiếu capability khác lỗi SUT. SQLite chỉ đọc giới hạn kết luận nghiệp vụ ghi.','Firefox full có hai run: 46 kết quả lưu ở run đầu bị treo, 76 ở run tiếp nối. Verifier single-run báo orphan root; mapping hợp nhất đã đối chiếu root ở run đầu.','Chưa commit/push/publish; evidence chỉ trong workspace. BrowserStack không được dùng làm execution evidence.']
report=['# Task 3 — Cross-Browser / Cross-Platform','','Ngày tổng hợp: 10/11/2026 (Asia/Bangkok). Trạng thái: đã thực thi và đóng gói ba browser; chưa xác nhận đủ điều kiện nộp.','','## Phạm vi và phương pháp','','EShop frontend-web thật: Home / Listing & Search (FR-05), Product Detail (FR-06), header/navigation. Giữ 52 ID/122 biến thể từ checklist Task 1. Source commit của từng record nằm trong results.json; SUT runtime là bản sao source tracked, DB chỉ đọc, không seed/reset/fix sản phẩm. Playwright thực hiện thao tác/assertion; browser mới có context sạch, không retry che Fail. GUI-048 chạy trước; GUI-026/027 bị chặn trước UI khi root Detail không đạt; GUI-050 có gate riêng.','','## Kết quả raw','','| Browser | Pass | Fail | Blocked | Needs review | Tổng |','|---|---:|---:|---:|---:|---:|']
for p,c in counts.items():report.append('| '+p+' | '+' | '.join(str(c.get(s,0)) for s in ['pass','fail','blocked','needs-review'])+' | 122 |')
report+=['| Tổng | 132 | 78 | 42 | 114 | 366 |','','Không hiểu native test passed là GUI Passed. Có 52 ID, 122 biến thể riêng biệt và 366 execution records; không báo 366 checklist ID. Counts được tính lại từ records, không nhập kết quả Task 1.','','## So sánh browser','','Không có khác biệt ở verdict raw của 122 comparison keys giữa ba browser. Điều này không chứng minh UI giống hệt: 38 biến thể/browser cần đánh giá thị giác/hành vi/applicability. Chrome/Edge dùng Blink, Firefox dùng Gecko; không gọi ba hệ điều hành. 26 Fail/browser có cùng khóa kiểm thử; chưa có bằng chứng độc lập về bug chỉ xảy ra ở một browser.','','## Findings và bằng chứng','','[Đối chiếu 19 nhóm Issues Task 1](findings/README.md). Các nhóm đã có Issue được liên kết lại; không tạo Issue trùng hoặc khai 78 Fail là 78 bugs. Các nhóm lịch sử dựa trên review có thể vẫn needs-review ở Task 3. Xem từng assertion trong JSON, không suy recurrence chỉ từ ID.','','[Môi trường và versions](ENVIRONMENTS.md), [366 records](results.json), [checksum inventory](evidence/inventory.json), [queue review](HUMAN-REVIEW.html), [ma trận 122 biến thể](comparison.html).','','## Giới hạn và việc còn mở','']+['- '+x for x in limitations]+['','## Hồ sơ AI và khả năng tái tạo','','AI tái sử dụng adapter Task 1, cấu hình browser, chạy test, thu evidence, kiểm checksum và tổng hợp. Sinh viên chọn Edge và duyệt kiểu overlay; chưa có review đủ 114 biến thể mới. Không tự ký thay sinh viên. Không sửa log AI lịch sử hoặc dựng prompt/output. Provenance của mỗi record và run root được giữ trong JSON. Code adapter/raw trace/video ở _working; builder tổng hợp được lưu cùng bộ giao.','','## Kết luận','','Đã có execution cho Chrome, Edge và Playwright Firefox; bộ này là bản tổng hợp để review. Chỉ đóng nghĩa vụ nộp khi giải quyết review, identity và các ngoại lệ browser/capture theo đề.']
(out/'Task3_Report.md').write_text('\n'.join(report),encoding='utf-8')
head='<!doctype html><meta charset="utf-8"><style>body{font:15px Arial;max-width:1250px;margin:30px auto}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:8px}img{max-width:100%}summary{padding:10px;background:#eef3fa}pre{white-space:pre-wrap}</style>'
review=[head,'<h1>Task 3 — Review 114 biến thể</h1><p>Review evidence mới; không tự gán verdict từ Task 1. Mỗi mục ghi expected, observation và link raw record. Cần xác nhận thị giác/hành vi/applicability theo assertion, không yêu cầu chấm dựa trên ảnh duy nhất.</p>']
comparison=[head,'<h1>Cross-browser matrix</h1><table><tr><th>Case / variant / page / viewport</th><th>Chrome</th><th>Edge</th><th>Firefox</th></tr>']
for k in sorted(bykey):
 cells=[]
 for p in platforms:
  r=next(x for x in rows if x['comparisonKey']==k and x['platform']==p);cells.append('<td><a href="'+r['recordPath']+'">'+r['assessment']+'</a></td>')
 comparison.append('<tr><td>'+html.escape(k)+'</td>'+''.join(cells)+'</tr>')
for r in rows:
 if r['assessment']!='needs-review':continue
 pics=[e for e in r['evidence'] if e['kind']!='screenshot'];pic=pics[-1]['path'] if pics else ''
 review+=['<details><summary>'+html.escape(r['platform']+' / '+r['comparisonKey'])+'</summary><p><a href="'+r['recordPath']+'">Record / assertions</a></p><pre>'+html.escape(json.dumps(r['assertions'],ensure_ascii=False,indent=2))+'</pre><img loading="lazy" src="'+pic+'"></details>']
(out/'HUMAN-REVIEW.html').write_text('\n'.join(review),encoding='utf-8');(out/'comparison.html').write_text('\n'.join(comparison)+'</table>',encoding='utf-8')
(out/'README.md').write_text('# Task 3 — Bắt đầu\n\nĐã tổng hợp 3 browser / 52 ID / 122 biến thể mỗi browser. **Bản chờ review, chưa đóng nghĩa vụ nộp.**\n\n- [Report Markdown](Task3_Report.md) / [PDF](Task3_Report.pdf)\n- [Excel](GUI_Checklist_CrossPlatform.xlsx) / [JSON](results.json)\n- [Ma trận so sánh](comparison.html) / [114 mục cần review](HUMAN-REVIEW.html)\n- [Môi trường](ENVIRONMENTS.md) / [Findings và Issues](findings/README.md)\n- [Kiểm chứng](VALIDATION.md)\n\nMỗi browser: 44 Pass / 26 Fail / 14 Blocked / 38 needs-review. Edge thay browser đề nêu; Firefox ảnh có nhãn URL, không có native address bar. Chi tiết giới hạn nằm trong report. Không sửa kết quả lịch sử Task 1.\n',encoding='utf-8')
print(summary)
