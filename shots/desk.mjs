import {chromium} from 'playwright-core';
const U='/root/.claude/uploads/c12f7821-2b6c-51ba-af85-d3d8b33bd6c5';
const sites={archa:'339896bf-design-b-dark.html',toefl:'8e7b01e1-toefl-passport.html',tirazh:'cdfb7c14-tirazh-swiss.html'};
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox']});
for(const [k,f] of Object.entries(sites)){
  const p=await b.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
  await p.route(/^https?:/,r=>r.abort());
  await p.goto('file://'+U+'/'+f);
  await p.waitForTimeout(2500);
  await p.addStyleTag({content:'.fab,.wa{display:none!important}.reveal{opacity:1!important;transform:none!important}.hs{height:auto!important}.hs-stick{position:static!important;height:auto!important}.hs-track{transform:none!important}'});
  await p.waitForTimeout(500);
  await p.screenshot({path:'shots/desk-'+k+'.png',fullPage:true,clip:{x:0,y:0,width:1440,height:3200}});
}
await b.close();
