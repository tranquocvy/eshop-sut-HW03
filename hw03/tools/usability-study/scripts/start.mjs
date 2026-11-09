import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createStudyService } from '../server/index.mjs';
import { prepareSut, startSutGateway } from '../runtime/index.mjs';
import { appRoot, repoRoot, ensureWork, outsideRepo } from './environment.mjs';
import { sourceFingerprints, verifyFingerprints } from './integrity.mjs';
const args=process.argv.slice(2);
function option(name,fallback){const i=args.indexOf(name);if(i<0)return fallback;if(!args[i+1]||args[i+1].startsWith('--'))throw new Error('Thiếu giá trị '+name);return args[i+1];}
const work=ensureWork();
const dataDir=outsideRepo(option('--data-dir',process.env.STUDY_DATA_DIR||path.join(work,'private-compact-v04')));
const configFile=option('--config',process.env.STUDY_CONFIG_PATH);
const config=configFile?JSON.parse(fs.readFileSync(configFile,'utf8')):{};
const participantPort=Number(option('--participant-port',process.env.STUDY_PORT||4310));
const adminPort=Number(option('--admin-port',process.env.STUDY_ADMIN_PORT||4312));
const sutPort=Number(option('--sut-port',process.env.STUDY_SUT_PORT||4311));
for(const p of [participantPort,adminPort,sutPort])if(!Number.isInteger(p)||p<1024||p>65535)throw new Error('Cổng phải là số nguyên từ 1024 đến 65535.');
if(new Set([participantPort,adminPort,sutPort]).size!==3)throw new Error('Ba dịch vụ cần ba cổng khác nhau.');
const portalDir=path.join(work,'portal-dist');
if(!fs.existsSync(path.join(portalDir,'index.html')))throw new Error('Chưa build portal. Chạy npm run setup rồi npm run build.');
const before=sourceFingerprints();
const provenance={sutCommit:execFileSync('git',['rev-parse','HEAD'],{cwd:repoRoot,encoding:'utf8'}).trim(),sourceHashes:before,transport:'External Axios URL prefix adapter; original UI source byte-identical'};
let service,sut,stopping=false;
async function stop(code=0){if(stopping)return;stopping=true;try{await service?.close();await sut?.close();verifyFingerprints(before);}catch{console.error('Chưa dừng sạch hoặc source đã đổi. Kiểm tra trước khi chạy tiếp.');code=1;}process.exitCode=code;}
process.on('SIGINT',()=>stop());process.on('SIGTERM',()=>stop());
try{
 const prepared=await prepareSut({repoRoot,workDir:path.join(work,'sut-runtime')});
 sut=await startSutGateway({prepared,port:sutPort,publicOrigin:config.sutOrigin||'http://localhost:'+sutPort});
 service=createStudyService({dataDir,portalDir,participantPort,adminPort,provenance,host:'127.0.0.1',config:{participantFlow:'compact-screen-v1',probeVersion:'v0.4',organizer:'Người phụ trách nghiên cứu HW03',organizerContact:'Liên hệ người đã gửi link mời',storageDescription:'Dữ liệu lưu riêng trên máy tổ chức nghiên cứu, ngoài thư mục mã nguồn và Git.',accessDescription:'Người phụ trách nghiên cứu và giảng viên/trợ giảng phục vụ kiểm tra bài học.',sutOrigin:'http://localhost:'+sutPort,...config}});
 const addresses=await service.start();
 fs.writeFileSync(path.join(dataDir,'sut-provenance.json'),JSON.stringify(prepared.provenance,null,2));
 verifyFingerprints(before);
 console.log('Web khảo sát local: '+(config.studyOrigin||'http://127.0.0.1:'+participantPort));
 console.log('Trang điều phối local: http://127.0.0.1:'+adminPort+'/moderator');
 console.log('EShop nguyên UI: '+(config.sutOrigin||'http://localhost:'+sutPort));
 console.log('Mật khẩu điều phối nằm trong tệp riêng: '+addresses.adminPasswordFile);
 console.log('Không có phiên/người tham gia tạo sẵn. Chưa mở tunnel hoặc kiểm truy cập từ máy ngoài.');
}catch(error){console.error('Không khởi động được: '+error.message);await stop(1);}
