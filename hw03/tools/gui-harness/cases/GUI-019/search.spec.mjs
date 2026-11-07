import {test,home} from '../../lib/evidence.mjs';import {observeUntil} from '../../lib/observe.mjs';
test('GUI-019::full-name--home',async({browser,evidence:ev})=>{
 ev.expected('Tìm iPhone 15 Pro Max trả đúng một card ID=1, không sản phẩm tên khác.');const page=await ev.open(browser);await home(page);await ev.shot('01-before');
 await page.getByPlaceholder('Tìm kiếm...').fill('iPhone 15 Pro Max');const response=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).searchParams.get('search')==='iPhone 15 Pro Max');await page.getByRole('button',{name:'Tìm',exact:true}).click();const error=await(await response).finished();if(error)throw Error('Search response incomplete: '+error);
 const read=async()=>({titles:await page.locator('main h2').allTextContents(),links:await page.locator('main a[href^="/product/"]').evaluateAll(a=>a.map(e=>e.getAttribute('href')))});
 const observation=await observeUntil(read,o=>JSON.stringify(o.titles)===JSON.stringify(['iPhone 15 Pro Max'])&&JSON.stringify(o.links)===JSON.stringify(['/product/1']));ev.actual(observation);await ev.shot('02-results');
 ev.assert('exact-product-match',JSON.stringify(observation.titles)===JSON.stringify(['iPhone 15 Pro Max'])&&JSON.stringify(observation.links)===JSON.stringify(['/product/1']),observation,'Tên chính xác TD1 và chỉ link /product/1',{class:'R',refs:['GUI-019','FR-05','API §3.1']});
});
