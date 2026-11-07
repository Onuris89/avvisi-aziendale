'use strict';
// Delivery/click handling only. Scheduling stops when the page is closed.
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  event.waitUntil((async()=>{
    const scope=new URL(self.registration.scope);
    const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    const client=windows.find(c=>{
      const u=new URL(c.url);
      return u.origin===scope.origin&&(u.pathname===scope.pathname||u.pathname===new URL('./index.html',scope).pathname);
    });
    if(client){await client.focus();client.postMessage({type:'OPEN_REMINDER_SUMMARY'});}
    else await self.clients.openWindow(new URL('./#avvisi',scope).href);
  })());
});
