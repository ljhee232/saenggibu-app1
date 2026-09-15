
const CACHE_NAME="student-record-v1";

const FILES=[
"index.html",
"dashboard.html",
"add.html",
"records.html",
"summary.html",
"app.js",
"manifest.json",
"logo.png"
];

self.addEventListener("install",e=>{

e.waitUntil(

caches.open(CACHE_NAME).then(cache=>cache.addAll(FILES))

);

});

self.addEventListener("fetch",e=>{

e.respondWith(

caches.match(e.request).then(res=>res||fetch(e.request))

);

});
