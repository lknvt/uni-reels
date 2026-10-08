import {chromium} from 'playwright-core';
const U='/root/.claude/uploads/c12f7821-2b6c-51ba-af85-d3d8b33bd6c5';
const sites={archa:'339896bf-design-b-dark.html',toefl:'8e7b01e1-toefl-passport.html',tirazh:'cdfb7c14-tirazh-swiss.html'};
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox']});
for(const [k,f] of Object.entries(sites)){
  const p=await b.newPage({viewport:{width:430,height:932},deviceScaleFactor:2.5});
  await p.route(/^https?:/,r=>r.abort());
  await p.goto('file://'+U+'/'+f);
  await p.waitForTimeout(1800);
  const h=await p.evaluate(()=>document.documentElement.scrollHeight);
  console.log(k,h);
  for(let i=0;i<3;i++){
    await p.evaluate(y=>window.scrollTo(0,y),i*Math.min(900,(h-932)/2));
    await p.waitForTimeout(1500);
    await p.screenshot({path:'shots/'+k+'-'+i+'.png'});
  }
}
await b.close();
