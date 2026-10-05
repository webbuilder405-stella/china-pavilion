const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

const menuItems = [
  {id:1,name:'Fried Chicken Wing',price:7.95,cat:'wings',label:'Wings',size:'6 Pieces',desc:'Crispy fried wings served in a set of six.',theme:'t1'},
  {id:2,name:'Fried Dumplings',price:5.95,cat:'dumplings',label:'Dumplings',size:'8 Pieces',desc:'Crispy dumplings served in a set of 8 pieces.',theme:'t2'},
  {id:3,name:'Barbecue Pork',price:4.95,cat:'bbq',label:'BBQ',size:'',desc:'Tender pork in a sweet and tangy barbecue sauce.',theme:'t3'},
  {id:4,name:'Shrimp Toast',price:4.95,cat:'seafood',label:'Seafood',size:'6 Pieces',desc:'Crispy shrimp toast served in a set of 6.',theme:'t4'},
  {id:5,name:'Barbecue Spare Ribs',price:9.95,cat:'bbq',label:'BBQ',size:'4 Pieces',desc:'Tender pork ribs smothered in a sweet and tangy barbecue sauce.',theme:'t5'},
  {id:6,name:'Crab Rangoon',price:3.95,cat:'seafood',label:'Seafood',size:'4 Pieces',desc:'Crisp wontons filled with crab and cream cheese.',theme:'t6'},
  {id:7,name:'Egg Roll',price:1.00,cat:'appetizer',label:'Appetizer',size:'',desc:'Crispy pastry wrapped around a savory filling.',theme:'t2'},
  {id:8,name:'Fried Shrimp',price:5.95,cat:'seafood',label:'Seafood',size:'6 Pieces',desc:'Succulent shrimp pieces, crispy on the outside and tender within.',theme:'t3'},
  {id:9,name:'Shrimp Egg Roll',price:2.95,cat:'seafood',label:'Seafood',size:'2 Pieces',desc:'Crisp rolls filled with shrimp and egg.',theme:'t4'},
  {id:10,name:'Spicy Buffalo Wing',price:7.95,cat:'wings',label:'Wings',size:'6 Pieces',desc:'Spicy chicken wings tossed in buffalo sauce.',theme:'t5'},
  {id:11,name:'Steamed Dumplings',price:5.95,cat:'dumplings',label:'Dumplings',size:'8 Pieces',desc:'Delicate, tender dumplings served in a set of 8 pieces.',theme:'t6'},
  {id:12,name:'BBQ Chicken Wing',price:7.95,cat:'wings',label:'Wings',size:'6 Pieces',desc:'Tender chicken wings smothered in a sweet and tangy BBQ sauce.',theme:'t1'},
  {id:13,name:'Corn Nugget',price:4.95,cat:'appetizer',label:'Appetizer',size:'15 Pieces',desc:'Crispy corn bites served in a generous portion of 15 pieces.',theme:'t2'},
  {id:14,name:'Appetizer Platter',price:12.95,cat:'appetizer',label:'Sharing',size:'Perfect for sharing',desc:'Two egg rolls, two crab rangoon, two shrimp toasts, two fried shrimp, two paper-wrapped chicken, and two BBQ ribs.',theme:'t4',featured:true},
  {id:15,name:'Crab Rangoon',price:null,cat:'seafood',label:'Seafood',size:'6 Pieces',desc:'Crisp wontons filled with crab and cream cheese.',theme:'t6',callOnly:true}
];

const hours = [
  ['Sunday','11:30 AM – 10:00 PM',11.5,22],
  ['Monday','Closed',null,null],
  ['Tuesday','11:00 AM – 10:00 PM',11,22],
  ['Wednesday','11:00 AM – 10:00 PM',11,22],
  ['Thursday','11:00 AM – 10:00 PM',11,22],
  ['Friday','11:00 AM – 10:00 PM',11,22],
  ['Saturday','11:30 AM – 10:00 PM',11.5,22]
];

const reviews = [
  {quote:'A strong menu presentation should make it easy to decide, easy to call, and easy to come back.',cite:'CHINA PAVILION • WEBSITE CONCEPT'},
  {quote:'The appetizer platter gives the table a little bit of everything — built for sharing and easy ordering.',cite:'FEATURED MENU ITEM'},
  {quote:'A clean, premium digital experience for a neighborhood Chinese restaurant in Irving.',cite:'IRVING, TEXAS'}
];

let filter='all';
let search='';
let cart = JSON.parse(localStorage.getItem('chinaPavilionCart') || '[]');
let reviewIndex=0;
let toastTimer;

function saveCart(){ localStorage.setItem('chinaPavilionCart', JSON.stringify(cart)); }
function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove('show'),2200); }
function money(v){ return `$${v.toFixed(2)}`; }

function renderMenu(){
  const grid=$('#menuGrid');
  const q=search.toLowerCase();
  const items=menuItems.filter(i=>(filter==='all'||i.cat===filter) && (!q || `${i.name} ${i.desc} ${i.label}`.toLowerCase().includes(q)));
  $('#resultCount').textContent=`${items.length} dish${items.length===1?'':'es'}`;
  grid.innerHTML='';
  $('#emptyMenu').style.display=items.length?'none':'block';
  items.forEach(i=>{
    const card=document.createElement('article'); card.className='menu-card';
    card.innerHTML=`
      ${i.featured?'<span class="featured-ribbon">TABLE FAVORITE</span>':''}
      <button class="menu-thumb ${i.theme}" data-view="${i.id}" aria-label="View ${i.name}"><div class="food-swirls"></div></button>
      <div class="menu-card-body">
        <div class="menu-top"><div><div class="menu-category-label">${i.label}</div><h3>${i.name}</h3></div><span class="price">${i.price==null?'Call':money(i.price)}</span></div>
        <p>${i.desc}</p>
        <div class="menu-bottom"><span class="menu-size">${i.size||'China Pavilion'}</span>${i.callOnly?'<button disabled>Call for price</button>':`<button data-add="${i.id}">+ Add</button>`}</div>
      </div>`;
    grid.appendChild(card);
  });
}

function addToCart(id){
  const item=menuItems.find(i=>i.id===id); if(!item||item.price==null){toast('Call the restaurant for this item.');return;}
  const existing=cart.find(i=>i.id===id);
  if(existing) existing.qty++; else cart.push({id,qty:1});
  saveCart(); renderCart(); toast(`${item.name} added to order`);
}
function removeFromCart(id){ cart=cart.filter(i=>i.id!==id); saveCart(); renderCart(); }
function changeQty(id,delta){ const x=cart.find(i=>i.id===id); if(!x)return; x.qty+=delta; if(x.qty<=0)removeFromCart(id); else {saveCart();renderCart();} }
function renderCart(){
  const body=$('#cartBody'), count=cart.reduce((s,i)=>s+i.qty,0); $('#cartCount').textContent=count;
  if(!cart.length){body.innerHTML='<div class="drawer-empty"><div>🥢</div><h4>Your order is empty</h4><p>Add menu items to build a preview.</p></div>'; $('#cartTotal').textContent='$0.00'; return;}
  let total=0; body.innerHTML='';
  cart.forEach(c=>{const i=menuItems.find(x=>x.id===c.id); const subtotal=i.price*c.qty; total+=subtotal; const el=document.createElement('div');el.className='cart-line';el.innerHTML=`<div class="cart-line-top"><span class="cart-line-name">${i.name}</span><span class="cart-line-price">${money(subtotal)}</span></div><div class="cart-line-bottom"><div class="qty"><button data-minus="${i.id}">−</button><span>${c.qty}</span><button data-plus="${i.id}">+</button></div><button class="remove" data-remove="${i.id}">Remove</button></div>`;body.appendChild(el);});
  $('#cartTotal').textContent=money(total);
}

function openDrawer(){ $('#cartDrawer').classList.add('open'); $('#drawerOverlay').classList.add('active'); }
function closeDrawer(){ $('#cartDrawer').classList.remove('open'); $('#drawerOverlay').classList.remove('active'); }
function openModal(id){ $('#'+id).classList.add('open'); document.body.classList.add('modal-lock'); }
function closeModal(id){ $('#'+id).classList.remove('open'); document.body.classList.remove('modal-lock'); }

function showItemModal(id){
  const i=menuItems.find(x=>x.id===id); if(!i)return;
  $('#itemModalContent').innerHTML=`<p class="eyebrow">${i.label}</p><h2>${i.name}</h2><p class="modal-desc">${i.desc}</p><div class="modal-price">${i.price==null?'Call for price':money(i.price)}</div><div class="item-modal-footer"><span class="menu-size">${i.size||'China Pavilion'}</span>${i.price==null?'':`<button class="btn btn-red" data-modal-add="${i.id}">Add to order <span>+</span></button>`}</div>`;
  openModal('itemModal');
}

function currentDay(){ return new Date().toLocaleDateString('en-US',{weekday:'long'}); }
function localHour(){ const n=new Date(); return n.getHours()+n.getMinutes()/60; }
function updateHours(){
  const d=currentDay(); const row=hours.find(h=>h[0]===d);
  const open=row&&row[2]!=null&&localHour()>=row[2]&&localHour()<row[3];
  const closed=!row||row[2]==null;
  const status=open?'Open now':(closed?'Closed today':'Closed now');
  $('#statusText').textContent=status; $('#statusDot').classList.toggle('closed',!open); $('#liveHoursStatus').textContent=status; $('#liveDot').classList.toggle('closed',!open); $('#currentDayLabel').textContent=d; $('#liveHoursNote').textContent=`Irving local time • ${new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})}`;
  $('#hoursList').innerHTML=hours.map(h=>`<div class="hour-row ${h[0]===d?'today':''} ${h[2]==null?'closed':''}"><span>${h[0]}</span><strong>${h[1]}</strong></div>`).join('');
}

function renderReviews(){
  $('#reviewTrack').innerHTML=reviews.map(r=>`<article class="review-card"><blockquote>“${r.quote}”</blockquote><cite>${r.cite}</cite></article>`).join('');
  $('#reviewDots').innerHTML=reviews.map((_,i)=>`<button class="review-dot ${i===0?'active':''}" data-review="${i}"></button>`).join('');
  updateReview();
}
function updateReview(){ $('#reviewTrack').style.transform=`translateX(-${reviewIndex*100}%)`; $$('.review-dot').forEach((d,i)=>d.classList.toggle('active',i===reviewIndex)); }
function moveReview(delta){ reviewIndex=(reviewIndex+delta+reviews.length)%reviews.length; updateReview(); }

function reveal(){
  const items=$$('.reveal-up,.reveal-left,.reveal-right'); const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');io.unobserve(e.target)}}),{threshold:.15}); items.forEach(x=>io.observe(x));
  $$('.stat strong[data-count]').forEach(el=>{const end=+el.dataset.count;const io2=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;let n=0;const step=Math.max(1,Math.ceil(end/30));const timer=setInterval(()=>{n+=step;if(n>=end){n=end;clearInterval(timer)}el.textContent=n},35);io2.unobserve(e.target)}),{threshold:.8});io2.observe(el);});
}

function setupFAQ(){ $$('.faq-item button').forEach(btn=>btn.addEventListener('click',()=>btn.parentElement.classList.toggle('open'))); }
function setupGallery(){ $$('#galleryGrid .gallery-card').forEach((card,index)=>card.addEventListener('click',()=>{ $('#lightboxCaption').textContent=card.dataset.title; $('#lightboxArt').style.background=`linear-gradient(145deg, hsl(${index*34+20} 30% 27%), hsl(${index*34+20} 42% 62%))`; $('#lightbox').classList.add('open'); })); $('#lightboxClose').addEventListener('click',()=>$('#lightbox').classList.remove('open')); $('#lightbox').addEventListener('click',e=>{if(e.target.id==='lightbox')$('#lightbox').classList.remove('open')}); }

window.addEventListener('scroll',()=>{
  const top=window.scrollY; const height=document.documentElement.scrollHeight-window.innerHeight; $('#scrollProgress').style.width=`${height?top/height*100:0}%`; $('#siteHeader').classList.toggle('scrolled',top>45); $('#backTop').classList.toggle('show',top>600);
});

$('#hamburger').addEventListener('click',()=>$('#mobileNav').classList.toggle('open'));
$$('#mobileNav a').forEach(a=>a.addEventListener('click',()=>$('#mobileNav').classList.remove('open')));
$('#cartOpenBtn').addEventListener('click',openDrawer); $('#cartCloseBtn').addEventListener('click',closeDrawer); $('#drawerOverlay').addEventListener('click',closeDrawer);
$('#contactOpenBtn').addEventListener('click',()=>openModal('contactModal')); $('#footerContactBtn').addEventListener('click',()=>openModal('contactModal')); $('#reserveOpenBtn').addEventListener('click',()=>openModal('reservationModal'));
$$('[data-close]').forEach(b=>b.addEventListener('click',()=>closeModal(b.dataset.close)));
$$('.modal-backdrop').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeModal(m.id)}));
$('#menuGrid').addEventListener('click',e=>{const add=e.target.closest('[data-add]');const view=e.target.closest('[data-view]');if(add)addToCart(+add.dataset.add);if(view)showItemModal(+view.dataset.view);});
$('#cartBody').addEventListener('click',e=>{const m=e.target.closest('[data-minus]');const p=e.target.closest('[data-plus]');const r=e.target.closest('[data-remove]');if(m)changeQty(+m.dataset.minus,-1);if(p)changeQty(+p.dataset.plus,1);if(r)removeFromCart(+r.dataset.remove);});
$('#itemModal').addEventListener('click',e=>{const b=e.target.closest('[data-modal-add]');if(b){addToCart(+b.dataset.modalAdd);closeModal('itemModal')}});
$('#filterRow').addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;filter=b.dataset.filter;$$('.filter-chip').forEach(x=>x.classList.toggle('active',x===b));renderMenu();});
$('#menuSearch').addEventListener('input',e=>{search=e.target.value;renderMenu();});
$('#clearFilters').addEventListener('click',()=>{filter='all';search='';$('#menuSearch').value='';$$('.filter-chip').forEach(x=>x.classList.toggle('active',x.dataset.filter==='all'));renderMenu();});
$('#resetMenuBtn').addEventListener('click',()=>$('#clearFilters').click());
$('#spotlightAdd').addEventListener('click',()=>addToCart(14));
$('#reviewPrev').addEventListener('click',()=>moveReview(-1)); $('#reviewNext').addEventListener('click',()=>moveReview(1)); $('#reviewDots').addEventListener('click',e=>{const b=e.target.closest('[data-review]');if(b){reviewIndex=+b.dataset.review;updateReview()}});
$('#backTop').addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
$('#themeBtn').addEventListener('click',()=>{document.body.classList.toggle('dark');localStorage.setItem('chinaPavilionTheme',document.body.classList.contains('dark')?'dark':'light')});
if(localStorage.getItem('chinaPavilionTheme')==='dark')document.body.classList.add('dark');
$('#newsletterForm').addEventListener('submit',e=>{e.preventDefault();const email=$('#emailInput').value.trim();if(email){toast('Demo signup captured — connect an email service to store it.');e.target.reset();}});
$('#reservationForm').addEventListener('submit',e=>{e.preventDefault();closeModal('reservationModal');toast('Demo request captured — connect a reservation service to receive it.');e.target.reset();});

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeDrawer();$$('.modal-backdrop').forEach(m=>closeModal(m.id));$('#lightbox').classList.remove('open')}
  if(e.key==='/' && document.activeElement.tagName!=='INPUT' && document.activeElement.tagName!=='TEXTAREA'){e.preventDefault();$('#menuSearch').focus();}
});

if(window.matchMedia('(pointer:fine)').matches){
  const dot=$('#cursorDot'),ring=$('#cursorRing');dot.style.display='block';ring.style.display='block';window.addEventListener('mousemove',e=>{dot.style.left=`${e.clientX}px`;dot.style.top=`${e.clientY}px`;ring.animate({left:`${e.clientX}px`,top:`${e.clientY}px`},{duration:180,fill:'forwards'});});
  $$('.magnetic,a,button').forEach(el=>el.addEventListener('mouseenter',()=>{ring.style.width='52px';ring.style.height='52px'}));
  $$('.magnetic,a,button').forEach(el=>el.addEventListener('mouseleave',()=>{ring.style.width='35px';ring.style.height='35px'}));
}

$('#year').textContent=new Date().getFullYear();
renderMenu();renderCart();renderReviews();updateHours();setupFAQ();setupGallery();reveal();setInterval(updateHours,60000);
setTimeout(()=>$('#preloader').remove(),2300);
