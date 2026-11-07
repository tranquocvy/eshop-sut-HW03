// Đọc observation có giới hạn; không tự phát assertion hoặc lặp UI action.
export async function observeUntil(read,predicate,{timeout=3000,interval=75}={}){const end=Date.now()+timeout;let observed;do{observed=await read();if(predicate(observed))return observed;await new Promise(resolve=>setTimeout(resolve,interval));}while(Date.now()<end);return observed;}
