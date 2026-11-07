// Pure oracle: chỉ success nhìn thấy, đúng hành động; trạng thái busy không chứng minh thành công.
export function feedbackVerdict(before,after){
 const successText=t=>/đã thêm|thêm.+thành công/iu.test(t)&&!/chưa|không|thất bại|lỗi|hủy/iu.test(t);
 if(after.button?.visible&&successText(after.button.text)&&after.button.text!==before.button?.text)return 'success';
 const oldNotices=new Set((before.notices||[]).filter(n=>n.visible).map(n=>n.text));
 if((after.notices||[]).some(n=>n.visible&&!oldNotices.has(n.text)&&successText(n.text)&&/giỏ|sản phẩm|iPhone/iu.test(n.text)))return 'success';
 const oldCounts=new Set(before.cart?.counts||[]);
 if(after.cart?.visible&&(after.cart.counts||[]).some(n=>n===1&&!oldCounts.has(n)))return 'success';
 if(after.button?.visible&&(after.button.busy==='true'||after.button.disabled!==before.button?.disabled||after.button.text!==before.button?.text))return 'ambiguous';
 if((after.notices||[]).some(n=>n.visible&&!oldNotices.has(n.text)&&/giỏ|sản phẩm|thêm/iu.test(n.text)))return 'ambiguous';
 return 'none';
}
export async function snapshotFeedback(page){return page.evaluate(()=>{
 const visible=e=>{if(!e)return false;const r=e.getBoundingClientRect();if(r.width<=0||r.height<=0||r.bottom<=0||r.top>=innerHeight||r.right<=0||r.left>=innerWidth)return false;for(let p=e;p;p=p.parentElement){const s=getComputedStyle(p);if(s.display==='none'||s.visibility!=='visible'||Number(s.opacity)===0)return false;}return true;};
 const b=document.querySelector('main button');const cart=document.querySelector('header a[href="/cart"]');
 const text=e=>(e?.innerText||'').trim();const counts=[];if(cart&&visible(cart)){for(const e of cart.querySelectorAll('span,[class*="badge"],[data-testid*="badge"],[aria-label*="số lượng"]'))if(visible(e)&&/^\d+$/.test(text(e)))counts.push(Number(text(e)));const inline=text(cart).match(/^Giỏ hàng\s*[[(]?\s*(\d+)\s*[)\]]?$/iu);if(inline)counts.push(Number(inline[1]));}
 return {button:{text:text(b),visible:visible(b),disabled:!!b?.disabled,busy:b?.getAttribute('aria-busy')||null},cart:{visible:visible(cart),text:text(cart),counts},notices:[...document.querySelectorAll('[role="status"],[role="alert"],[data-sonner-toast],.Toastify__toast,.toast')].map(e=>({text:text(e),visible:visible(e)}))};
 });}
