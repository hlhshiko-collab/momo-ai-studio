const CACHE='momo-ai-studio-v10';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon.svg'];
const INDEX_CACHE_KEY=new URL('./index.html',self.registration.scope).toString();

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(SHELL))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(
        keys.filter(key=>key.startsWith('momo-ai-studio-')&&key!==CACHE).map(key=>caches.delete(key))
      ))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  const url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin)return;

  const isPage=request.mode==='navigate'||url.pathname.endsWith('/index.html')||url.pathname.endsWith('/');
  if(isPage){
    // Always prefer a fresh GitHub Pages document; only use cache when offline.
    event.respondWith(
      fetch(new Request(request,{cache:'no-store'}))
        .then(response=>{
          if(response.ok){
            const copy=response.clone();
            caches.open(CACHE).then(cache=>cache.put(INDEX_CACHE_KEY,copy));
          }
          return response;
        })
        .catch(()=>caches.match(request).then(hit=>hit||caches.match(INDEX_CACHE_KEY)))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(hit=>hit||fetch(request).then(response=>{
      if(response.ok){
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(request,copy));
      }
      return response;
    }))
  );
});
