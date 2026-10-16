const CACHE='momo-ai-studio-v3';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(
  caches.keys()
    .then(keys=>Promise.all(keys.filter(k=>k.startsWith('momo-ai-studio-')&&k!==CACHE).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim())
));
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==self.location.origin)return;
 if(r.mode==='navigate'||u.pathname.endsWith('/index.html')||u.pathname.endsWith('/')){
  e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(cache=>cache.put(r,c));return res;}).catch(()=>caches.match(r).then(hit=>hit||caches.match('./index.html'))));
 } else e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(cache=>cache.put(r,c));}return res;})));
});
