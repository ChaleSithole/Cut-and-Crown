(()=>{
'use strict';
const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)];
const SVC=[
{id:'classic-cut',n:'Classic Cut',p:180,m:30,c:'Haircuts',d:'Scissor and clipper cut with a clean neck shave.'},
{id:'skin-fade',n:'Skin Fade',p:220,m:45,c:'Haircuts',d:'Sharp, seamless fade down to the skin, styled to finish.'},
{id:'taper-fade',n:'Taper Fade',p:210,m:40,c:'Haircuts',d:'A softer fade that keeps length on top.'},
{id:'kids-cut',n:'Kids Cut',p:140,m:30,c:'Haircuts',d:'For clients 12 and under. Patient, quick and tidy.'},
{id:'beard-trim',n:'Beard Trim',p:120,m:20,c:'Grooming',d:'Shaped, lined up and conditioned.'},
{id:'hot-towel-shave',n:'Hot Towel Shave',p:160,m:30,c:'Grooming',d:'Traditional straight-razor shave with hot towels.'},
{id:'haircut-beard',n:'Haircut + Beard',p:280,m:60,c:'Grooming',d:'Any haircut paired with a full beard trim.'},
{id:'crown-package',n:'The Crown Package',p:350,m:75,c:'Packages',d:'Haircut, beard trim and a hot towel finish.'},
{id:'executive',n:'The Executive',p:450,m:90,c:'Packages',d:'Premium cut, beard, hot towel shave and styling.'}];
const BARB=[
{id:'marcus',n:'Marcus Williams',r:'Senior Barber',y:8,f:'Marcus'},
{id:'liam',n:'Liam Daniels',r:'Fade Specialist',y:6,f:'Liam'},
{id:'thabo',n:'Thabo Mokoena',r:'Grooming Specialist',y:5,f:'Thabo'}];
const svc=id=>SVC.find(s=>s.id===id),barb=id=>BARB.find(b=>b.id===id);
const p=n=>String(n).padStart(2,'0'),hm=m=>p(Math.floor(m/60))+':'+p(m%60);
const iso=d=>`${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CFG=window.CC_CONFIG||{},LIVE=!!(CFG.url&&CFG.key);
const rpc=async(fn,body)=>{const r=await fetch(`${CFG.url}/rest/v1/rpc/${fn}`,{method:'POST',headers:Object.assign({'Content-Type':'application/json',apikey:CFG.key},CFG.key.startsWith('eyJ')?{Authorization:'Bearer '+CFG.key}:{}),body:JSON.stringify(body)});if(!r.ok){const e=new Error('rpc '+r.status);e.status=r.status;throw e}return r.status===204?null:r.json()};
const LOC='Cut & Crown Barbers, 214 Church Street, Arcadia, Pretoria, 0083';

/* ---------- content ---------- */
const IMG={'classic-cut':['cut','A barber trimming a classic haircut with comb and scissors'],'skin-fade':['fade','A skin fade being finished with clippers'],'taper-fade':['classic','Side view of a neat taper fade with a slicked-back top'],'kids-cut':['chairs','Leather barber chairs waiting under brass lamps'],'beard-trim':['beard','A full beard being shaped with comb and scissors'],'hot-towel-shave':['shave','A hot towel being placed on a client before a shave'],'haircut-beard':['fade','A fresh fade with a lined-up beard'],'crown-package':['shave','A hot towel and brush ready for a traditional shave'],'executive':['cut','A premium cut at the barber chair']};
const card=s=>`<article class="card svc"><img class="ph" src="img/${IMG[s.id][0]}.jpg" alt="${IMG[s.id][1]}" width="800" height="${['cut','chairs'].includes(IMG[s.id][0])?450:600}" loading="lazy"><h3>${s.n}</h3><p>${s.d}</p><div class="meta"><span class="price">R${s.p}</span><span>${s.m} min</span></div><a class="btn ghost sm" href="#/book/${s.id}">Book this service</a></article>`;
$('#svc-prev').innerHTML=['classic-cut','skin-fade','beard-trim','haircut-beard','kids-cut','crown-package'].map(i=>card(svc(i))).join('');
$('#svc-all').innerHTML=['Haircuts','Grooming','Packages'].map(c=>`<h2 class="cat">${c}</h2><div class="grid">${SVC.filter(s=>s.c===c).map(card).join('')}</div>`).join('');
const bc=BARB.map(b=>`<article class="card"><img class="ph tall" src="img/${b.id}.jpg" alt="${b.n}, ${b.r}" width="600" height="800" loading="lazy"><h3>${b.n}</h3><p>${b.r}<br>${b.y} years experience</p></article>`).join('');
$('#barb-home').innerHTML=bc;$('#barb-about').innerHTML=bc;

/* ---------- routing ---------- */
const TITLES={home:'Cut & Crown Barbers | Pretoria',services:'Services',about:'About',contact:'Contact',book:'Book an appointment',terms:'Terms & Conditions',privacy:'Privacy Policy'};
const nav=$('#nav'),burger=$('#burger');
const setMenu=o=>{nav.classList.toggle('open',o);burger.setAttribute('aria-expanded',o)};
burger.onclick=()=>setMenu(!nav.classList.contains('open'));
function route(){
 const [pg0,arg]=location.hash.replace(/^#\/?/,'').split('/');
 const pg=TITLES[pg0||'home']?pg0||'home':'home';
 $$('[data-p]').forEach(s=>s.classList.toggle('show',s.dataset.p===pg));
 $$('nav a').forEach(a=>a.classList.toggle('on',a.dataset.n===pg));
 document.title=pg==='home'?TITLES.home:TITLES[pg]+' | Cut & Crown';
 setMenu(false);
 if(pg==='book'){
  if(S.step===5)reset();
  if(arg&&svc(arg)){S.svc=arg;S.step=Math.max(S.step,2);}
  bk();
 }
 scrollTo(0,0);
}
addEventListener('hashchange',route);

/* ---------- availability (simulated) ---------- */
const H=s=>{let h=7;for(const c of s)h=(h*31+c.charCodeAt(0))%9973;return h};
const store=()=>{try{return JSON.parse(localStorage.getItem('ccBookings')||'[]')}catch{return[]}};
const save=k=>{try{localStorage.setItem('ccBookings',JSON.stringify(store().concat(k)))}catch{}};
const HRS=[[10,15],[9,18],[9,18],[9,18],[9,18],[9,18],[8,17]];
const busy=(b,d,m)=>LIVE?S.taken.has(`${b}|${m}`):(H(`${d}|${b}|${m}`)%100<24||store().includes(`${d}|${b}|${m}`));
const isFree=(b,d,m,n)=>{for(let i=0;i<n;i++)if(busy(b,d,m+i*30))return false;return true};
function slots(){
 const sv=svc(S.svc),[y,mo,da]=S.date.split('-').map(Number),o=HRS[new Date(y,mo-1,da).getDay()],n=Math.ceil(sv.m/30);
 const now=new Date(),today=S.date===iso(now),lead=now.getHours()*60+now.getMinutes()+60;
 const bs=S.barber==='any'?BARB.map(b=>b.id):[S.barber],out=[];
 for(let m=o[0]*60;m+sv.m<=o[1]*60;m+=30)out.push({m,ok:!(today&&m<lead)&&bs.some(b=>isFree(b,S.date,m,n))});
 return out;
}

/* ---------- booking wizard ---------- */
const blank=()=>({step:1,svc:null,barber:'any',date:'',time:null,f:{name:'',email:'',phone:'',notes:''},promo:'',done:null,taken:new Set(),loading:false,notice:''});
let S=blank();
const reset=()=>{const promo=S.promo;S=blank();S.promo=promo};
const root=$('#bk');
async function load(){
 if(!LIVE)return;
 const dt=S.date;S.taken=new Set();if(!dt)return;
 S.loading=true;S.notice=S.notice||'';bk();
 try{const r=await rpc('taken_slots',{d:dt});if(S.date!==dt)return;S.taken=new Set(r.map(x=>`${x.barber}|${x.block}`))}
 catch{if(S.date===dt)S.notice='We could not load live availability. Check your connection and choose the date again.'}
 if(S.date===dt){S.loading=false;bk()}
}
function bk(jump){
 const bar=['Service','Barber','Date & time','Your details'].map((l,i)=>`<li class="${S.step===i+1?'on':S.step>i+1?'done':''}">${i+1}. ${l}</li>`).join('');
 let h='';
 if(S.step===1)h=`<h2>Choose your service</h2><br><div class="opts">${SVC.map(s=>`<button type="button" class="opt" data-svc="${s.id}" aria-pressed="${S.svc===s.id}"><span>${s.n}<small>${s.m} min</small></span><b>R${s.p}</b></button>`).join('')}</div>`;
 if(S.step===2)h=`<h2>Choose your barber</h2><br><div class="opts">${[{id:'any',n:'Any available barber',r:'Fastest availability'}].concat(BARB.map(b=>({id:b.id,n:b.n,r:b.r}))).map(b=>`<button type="button" class="opt" data-b="${b.id}" aria-pressed="${S.barber===b.id}"><span>${b.n}<small>${b.r}</small></span></button>`).join('')}</div><div class="nav2"><button class="btn ghost" data-go="1">Back</button></div>`;
 if(S.step===3){
  const min=iso(new Date()),mx=new Date();mx.setDate(mx.getDate()+60);
  let t='';
  if(S.date&&S.loading)t='<p class="lead">Loading times…</p>';
  else if(S.date){const sl=slots();t=sl.some(x=>x.ok)?`<div class="opts times">${sl.map(x=>`<button type="button" class="opt" data-t="${x.m}" aria-pressed="${S.time===x.m}" ${x.ok?'':'disabled'}><span>${hm(x.m)}</span></button>`).join('')}</div>`:'<p class="err">No times left on this day. Try another date or barber.</p>'}
  h=`<h2>Pick a date and time</h2>${S.notice?`<p class="err" role="alert">${S.notice}</p>`:'<br>'}<div class="f form"><label for="dt">Date</label><input type="date" id="dt" min="${min}" max="${iso(mx)}" value="${S.date}"></div>${t}<div class="nav2"><button class="btn ghost" data-go="2">Back</button><button class="btn" data-go="4" ${S.date&&S.time!=null&&!S.loading?'':'disabled'}>Continue</button></div>`;
 }
 if(S.step===4){
  const sv=svc(S.svc),b=S.barber==='any'?'Any available barber':barb(S.barber).n,f=S.f;
  h=`<h2>Your details</h2><p class="lead" style="margin:.5rem 0 1.5rem">${sv.n} with ${b}, ${longDate()} at ${hm(S.time)}</p>
  <form class="form" id="frm" novalidate>
  <div class="f"><label for="nm">Full name</label><input id="nm" autocomplete="name" value="${esc(f.name)}"><div class="err" id="e-nm"></div></div>
  <div class="f"><label for="em">Email</label><input id="em" type="email" autocomplete="email" value="${esc(f.email)}"><div class="err" id="e-em"></div></div>
  <div class="f"><label for="ph">Phone number</label><input id="ph" type="tel" autocomplete="tel" value="${esc(f.phone)}" placeholder="e.g. 082 555 0123"><div class="err" id="e-ph"></div></div>
  <div class="f"><label for="pr">Promo code (optional)</label><input id="pr" value="${esc(S.promo)}" autocapitalize="characters"><div class="err" id="e-pr"></div></div>
  <div class="f"><label for="nt">Notes (optional)</label><textarea id="nt" rows="3">${esc(f.notes)}</textarea></div>
  <div class="f"><label><input type="checkbox" id="tc"> I accept the <a href="#/terms" target="_blank">Terms &amp; Conditions</a></label><div class="err" id="e-tc"></div></div>
  <div class="err" id="e-form" role="alert"></div>
  <div class="nav2"><button type="button" class="btn ghost" data-go="3">Back</button><button class="btn" type="submit">Confirm booking</button></div></form>`;
 }
 if(S.step===5)h=done();
 root.innerHTML=(S.step<5?`<ol class="steps">${bar}</ol>`:'')+h;
 if(jump)root.scrollIntoView({block:'start'});
}
const longDate=()=>{const [y,m,d]=S.date.split('-').map(Number);return new Date(y,m-1,d).toLocaleDateString('en-ZA',{weekday:'long',day:'numeric',month:'long',year:'numeric'})};
root.addEventListener('click',e=>{
 const t=e.target.closest('button');if(!t||t.disabled)return;
 if(t.dataset.svc){S.svc=t.dataset.svc;S.step=2;S.time=null;bk(1)}
 else if(t.dataset.b){S.barber=t.dataset.b;S.step=3;S.time=null;S.notice='';bk(1);load()}
 else if(t.dataset.t){S.time=+t.dataset.t;S.notice='';bk()}
 else if(t.dataset.go){keep();S.step=+t.dataset.go;bk(1);if(S.step===3)load()}
 else if(t.dataset.new){reset();bk(1)}
});
root.addEventListener('change',e=>{if(e.target.id==='dt'){const v=e.target.value,lo=e.target.min,hi=e.target.max;S.date=v&&v>=lo&&v<=hi?v:'';S.time=null;S.notice='';bk();if(v&&!S.date)$('#dt',root).insertAdjacentHTML('afterend','<div class="err">Choose a date within the next 60 days.</div>');else if(S.date)load()}});
root.addEventListener('submit',e=>{
 e.preventDefault();keep();
 const f=S.f,er={};
 if(f.name.trim().length<2)er.nm='Enter your full name.';
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim()))er.em='Enter a valid email address.';
 const dg=f.phone.replace(/[\s()-]/g,'');
 if(!/^\+?\d{9,14}$/.test(dg))er.ph='Enter a valid phone number, 9 to 14 digits.';
 if(S.promo.trim()&&S.promo.trim().toUpperCase()!=='FIRSTCUT')er.pr="That code isn't valid. Clear it or try FIRSTCUT.";
 if(!$('#tc').checked)er.tc='Accept the Terms & Conditions to continue.';
 $$('.err',root).forEach(x=>x.textContent='');
 Object.keys(er).forEach(k=>$('#e-'+k).textContent=er[k]);
 const first=Object.keys(er)[0];
 if(first){(first==='tc'?$('#tc'):$({nm:'#nm',em:'#em',ph:'#ph',pr:'#pr'}[first])).focus();return}
 finish();
});
function keep(){
 if(S.step!==4)return;
 const g=id=>$(id,root)?$(id,root).value:'';
 S.f={name:g('#nm'),email:g('#em'),phone:g('#ph'),notes:g('#nt')};S.promo=g('#pr');
}
async function finish(){
 const sv=svc(S.svc),n=Math.ceil(sv.m/30),f=S.f;
 const disc=S.promo.trim().toUpperCase()==='FIRSTCUT',price=disc?Math.round(sv.p*.9):sv.p;
 const ref='CC-'+Math.random().toString(36).slice(2,8).toUpperCase();
 const cands=S.barber==='any'?BARB.filter(x=>isFree(x.id,S.date,S.time,n)):[barb(S.barber)];
 let b=null;
 if(LIVE){
  const btn=$('#frm button[type=submit]',root);btn.disabled=true;btn.textContent='Confirming…';
  for(const c of cands){
   try{await rpc('create_booking',{p_ref:ref,p_service:sv.id,p_barber:c.id,p_day:S.date,p_start:S.time,p_duration:sv.m,p_name:f.name.trim(),p_email:f.email.trim(),p_phone:f.phone.trim(),p_notes:f.notes.trim(),p_price:price});b=c;break}
   catch(e){if(e.status!==409){$('#e-form').textContent='We could not save your booking. Check your connection and try again.';btn.disabled=false;btn.textContent='Confirm booking';return}}
  }
  if(!b){S.step=3;S.time=null;S.notice='Sorry, that time was just booked by someone else. Please pick another.';bk(1);await load();return}
 }else{
  b=cands[0]||BARB[0];
  save(Array.from({length:n},(_,i)=>`${S.date}|${b.id}|${S.time+i*30}`));
 }
 S.done={sv,b,disc,price,ref};
 S.step=5;bk(1);
}

/* ---------- calendar ---------- */
function calendar(){
 const {sv,b,price,ref}=S.done,d=S.date.replace(/-/g,''),tm=m=>d+'T'+hm(m).replace(':','')+'00';
 const st=tm(S.time),en=tm(S.time+sv.m);
 const title=`${sv.n} at Cut & Crown`;
 const det=`Barber: ${b.n}\nService: ${sv.n} (${sv.m} min)\nPrice: R${price}\nBooking ref: ${ref}\nPhone: +27 12 555 0147`;
 const google=`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${st}/${en}&details=${encodeURIComponent(det)}&location=${encodeURIComponent(LOC)}&ctz=Africa/Johannesburg`;
 const x=s=>s.replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n');
 const stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d+/,'');
 const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Cut & Crown//Booking//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH',
 'BEGIN:VTIMEZONE','TZID:Africa/Johannesburg','BEGIN:STANDARD','DTSTART:19700101T000000','TZOFFSETFROM:+0200','TZOFFSETTO:+0200','TZNAME:SAST','END:STANDARD','END:VTIMEZONE',
 'BEGIN:VEVENT',`UID:${ref}@cutandcrown.co.za`,`DTSTAMP:${stamp}`,`DTSTART;TZID=Africa/Johannesburg:${st}`,`DTEND;TZID=Africa/Johannesburg:${en}`,
 `SUMMARY:${x(title)}`,`LOCATION:${x(LOC)}`,`DESCRIPTION:${x(det)}`,'STATUS:CONFIRMED',
 'BEGIN:VALARM','TRIGGER:-PT60M','ACTION:DISPLAY','DESCRIPTION:Appointment in 1 hour','END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n');
 const ua=navigator.userAgent,ios=/iPhone|iPad|iPod/.test(ua)||(ua.includes('Macintosh')&&navigator.maxTouchPoints>1);
 const data='data:text/calendar;charset=utf-8,'+encodeURIComponent(ics);
 let url=data;if(!ios){try{url=URL.createObjectURL(new Blob([ics],{type:'text/calendar;charset=utf-8'}))}catch{}}
 return {google,ics:url,ios};
}
function done(){
 const {sv,b,price,disc,ref}=S.done,c=calendar(),f=S.f;
 return `<div class="ok"><div class="tick" aria-hidden="true">&#10003;</div><h2>You're booked, ${esc(f.name.trim().split(' ')[0])}</h2>
 <p class="lead" style="margin-inline:auto">Show your reference when you arrive.</p>
 <div class="sum"><div><span>Service</span><b>${sv.n}</b></div><div><span>Barber</span><b>${b.n}</b></div><div><span>Date</span><b>${longDate()}</b></div><div><span>Time</span><b>${hm(S.time)} – ${hm(S.time+sv.m)}</b></div><div><span>Price</span><b>R${price}${disc?' (10% off)':''}</b></div><div><span>Location</span><b>214 Church Street, Arcadia, Pretoria</b></div><div><span>Reference</span><b>${ref}</b></div></div>
 <div class="cta"><a class="btn" target="_blank" rel="noopener" href="${c.google}">Add to Google Calendar</a><a class="btn ghost" href="${c.ics}"${c.ios?'':` download="cut-and-crown-${ref}.ics"`}>Add to Apple Calendar</a></div>
 <div class="nav2" style="justify-content:center"><button class="btn ghost sm" data-new="1">Book another appointment</button></div></div>`;
}

/* ---------- offer modal ---------- */
const D=$('#offer');
const closeD=()=>D.close();
$('#offer-x').onclick=closeD;
D.addEventListener('click',e=>{if(e.target===D)closeD()});
$('#offer-go').addEventListener('click',()=>{S.promo='FIRSTCUT';closeD()});
try{
 if(typeof D.showModal==='function'&&!localStorage.getItem('ccOfferSeen'))
  setTimeout(()=>{if(!D.open&&!location.hash.startsWith('#/book')){D.showModal();localStorage.setItem('ccOfferSeen','1')}},5000);
}catch{}

route();
})();
