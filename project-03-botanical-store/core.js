'use strict';
(() => {
  const $ = s => document.querySelector(s), esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const api = PortfolioAPI;
  const readCart = () => { try { return JSON.parse(localStorage.getItem('verde.cart.usd.v1') || '{}'); } catch { return {}; } };
  const state = {data:null,filter:'All',query:'',limit:24,cart:readCart(),modules:[],hooks:{productActions:[],routes:[]}};
  const money = n => new Intl.NumberFormat('en-US',{style:'currency',currency:state.data?.store.currency || 'USD',maximumFractionDigits:0}).format(n);
  function toast(text) { const el=$('#toast'); el.textContent=text; el.classList.add('show'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove('show'),2600); }
  function saveCart() { try { localStorage.setItem('verde.cart.usd.v1',JSON.stringify(state.cart)); } catch { toast('Your browser could not save the cart. It will be cleared when you close this page.'); } }
  function renderCart() {
    const products=state.data.products, ids=Object.keys(state.cart).filter(id=>state.cart[id]>0), sum=ids.reduce((n,id)=>n+(products.find(p=>p.id===id)?.price||0)*state.cart[id],0);
    $('#cartCount').textContent=ids.reduce((n,id)=>n+state.cart[id],0); $('#drawerCount').textContent=ids.length?`(${ids.length})`:''; $('#cartTotal').textContent=money(sum);
    $('#cartLines').innerHTML=ids.map(id=>{const p=products.find(x=>x.id===id); if(!p)return ''; const q=state.cart[id]; return `<div class="cart-line"><img src="${esc(p.image)}" alt=""><div><div class="cart-line-name">${esc(p.name)}</div><div class="cart-line-meta">${esc(p.volume)} · ${esc(p.category)}</div><div class="line-controls"><button data-dec="${esc(id)}" aria-label="Decrease quantity">−</button><span>${q}</span><button data-inc="${esc(id)}" aria-label="Increase quantity">+</button><button class="remove" data-remove="${esc(id)}">Remove</button></div></div><span class="line-price">${money(p.price*q)}</span></div>`;}).join('') || '<div class="empty-state">Your cart is empty.<br>Add something from the collection.</div>';
    const left=Math.max(0,state.data.store.freeDeliveryFrom-sum); $('#freeDeliveryNote').textContent=sum===0?'':left?`Add ${money(left)} for free shipping`:'Your shipping is on us';
  }
  function renderProducts() {
    const max=Number($('#maxPrice').value)||Infinity, sort=$('#catalogSort').value;
    let items=state.data.products.filter(p=>(state.filter==='All'||p.category===state.filter)&&p.price<=max&&p.name.toLowerCase().includes(state.query.toLowerCase()));
    if(sort==='price')items.sort((a,b)=>a.price-b.price); if(sort==='name')items.sort((a,b)=>a.name.localeCompare(b.name,'en'));
    $('#resultCount').textContent=`${items.length} ${items.length===1?'product':'products'}`; $('#emptyState').hidden=!!items.length;
    $('#productGrid').innerHTML=items.slice(0,state.limit).map(p=>`<article class="product-card"><div class="product-image" data-detail="${esc(p.id)}" tabindex="0" role="button" aria-label="View details: ${esc(p.name)}"><img src="${esc(p.image)}" alt="${esc(p.imageAlt)}">${p.badge?`<span class="product-badge">${esc(p.badge)}</span>`:''}<button class="quick-add" data-add="${esc(p.id)}">Add to cart</button></div><div class="product-info"><div><h3>${esc(p.name)}</h3><p>${esc(p.volume)} · ${esc(p.category)}</p></div><strong>${money(p.price)}</strong></div><p class="product-short">${esc(p.short)}</p><button class="mobile-add" data-add="${esc(p.id)}">Add · ${money(p.price)}</button></article>`).join('');
    $('#loadMore').hidden=items.length<=state.limit; $('#loadMore').textContent=`Show ${Math.min(24,items.length-state.limit)} more`;
  }
  function renderDetail(id) {
    const p=state.data.products.find(x=>x.id===id); if(!p)return;
    $('#productDetail').innerHTML=`<div class="detail-layout"><img src="${esc(p.image)}" alt="${esc(p.imageAlt)}"><div><p class="eyebrow">${esc(p.category)} · ${esc(p.volume)}</p><h2>${esc(p.name)}</h2><p>${esc(p.description)}</p><strong class="detail-price">${money(p.price)}</strong><button class="button button-dark" id="detailAdd">Add to cart <span>+</span></button><div class="detail-block"><h3>Ingredients</h3><p>${esc(p.ingredients)}</p></div><div class="detail-block"><h3>How to use</h3><p>${esc(p.howTo)}</p></div><div class="detail-block"><h3>Reviews</h3><div id="productReviews"></div></div><div class="detail-block"><h3>You may also like</h3>${state.data.products.filter(x=>x.id!==id).sort((a,b)=>Number(b.category===p.category)-Number(a.category===p.category)).slice(0,3).map(x=>`<button class="related-product" data-related="${esc(x.id)}">${esc(x.name)} · ${money(x.price)}</button>`).join('')}</div></div></div>`;
    $('#detailAdd').onclick=()=>add(id); document.querySelectorAll('[data-related]').forEach(b=>b.onclick=()=>renderDetail(b.dataset.related));
    if(window.CustomerFeatures) CustomerFeatures.reviews(p);
    $('#productDialog').showModal();
  }
  function renderJournal() { $('#journalGrid').innerHTML=state.data.journal.map((j,i)=>`<article class="journal-card"><span class="journal-type">${esc(j.type)}</span><h3>${esc(j.title)}</h3><p>${esc(j.text)}</p><button class="text-link" data-article="${i}">Read article →</button></article>`).join(''); document.querySelectorAll('[data-article]').forEach(b=>b.onclick=()=>CustomerFeatures.article(Number(b.dataset.article))); }
  function add(id) { state.cart[id]=(state.cart[id]||0)+1; saveCart(); renderCart(); toast('Added to your cart'); }
  function bind() {
    $('#filters').innerHTML=state.data.categories.map(c=>`<button class="filter ${c===state.filter?'active':''}" data-filter="${esc(c)}">${esc(c)}</button>`).join('');
    document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{state.filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));renderProducts();});
    $('#search').oninput=e=>{state.query=e.target.value;renderProducts();}; $('#maxPrice').oninput=renderProducts; $('#catalogSort').onchange=renderProducts;
    $('#loadMore').onclick=()=>{state.limit+=24;renderProducts();};
    $('#productGrid').onclick=e=>{const addBtn=e.target.closest('[data-add]'); if(addBtn){add(addBtn.dataset.add);return;} const detail=e.target.closest('[data-detail]'); if(detail)renderDetail(detail.dataset.detail);};
    $('#productGrid').onkeydown=e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-detail]')){e.preventDefault();renderDetail(e.target.dataset.detail);}};
    $('#openCart').onclick=()=>{ $('#cartDrawer').classList.add('open'); $('#cartDrawer').setAttribute('aria-hidden','false'); $('#drawerBackdrop').hidden=false;};
    function closeCart(){ $('#cartDrawer').classList.remove('open'); $('#cartDrawer').setAttribute('aria-hidden','true'); $('#drawerBackdrop').hidden=true; }
    $('#closeCart').onclick=closeCart; $('#drawerBackdrop').onclick=closeCart;
    $('#cartLines').onclick=e=>{const b=e.target.closest('[data-dec],[data-inc],[data-remove]');if(!b)return;const id=b.dataset.dec||b.dataset.inc||b.dataset.remove;if(b.hasAttribute('data-remove')||b.dataset.dec&&state.cart[id]<=1)delete state.cart[id];else state.cart[id]+=b.dataset.inc?1:-1;saveCart();renderCart();};
    $('#closeProduct').onclick=()=>$('#productDialog').close(); $('#checkoutButton').onclick=()=>CustomerFeatures.checkout(state);
    $('#openAccount').onclick=()=>CustomerFeatures.account();
    $('#closeCustomer').onclick=()=>$('#customerDialog').close();
    if($('#openAdmin')) $('#openAdmin').onclick=()=>toast('Store management is available in the server version.');
  }
  function render() {
    const s=state.data.store; $('#brandName').textContent=s.name; $('#footerBrand').textContent=s.name; $('#heroEyebrow').textContent=s.hero.eyebrow; $('#heroTitle').textContent=s.hero.title; $('#heroText').textContent=s.hero.text; $('#heroNote').textContent=s.hero.note; $('#heroImage').src=s.hero.image; $('#heroCaption').textContent=s.hero.caption; $('#storyTitle').textContent=s.story.title; $('#storyText').textContent=s.story.text; $('#storyImage').src=s.story.image; $('#footerLine').textContent=s.footer.line; $('#footerBrandNote').textContent=s.footer.note; $('#footerShipping').textContent=s.footer.shipping; $('#footerLegal').textContent=s.footer.legal;
    $('#footerEmail').textContent=s.footer.email; $('#footerEmail').href='mailto:'+s.footer.email; $('#footerInstagram').textContent=s.footer.instagramLabel; $('#footerInstagram').href=s.footer.instagram; $('#footerTelegram').textContent=s.footer.telegramLabel; $('#footerTelegram').href=s.footer.telegram;
    document.title=s.name+' — Botanical Skincare'; if(window.CustomerFeatures)CustomerFeatures.init(window.StoreCore); bind(); renderProducts(); renderCart(); renderJournal();
  }
  api.content('store','data/store.json').then(d=>{state.data=d;render();}).catch(error=>{$('#emptyState').hidden=false;$('#emptyState').textContent=error.message||'Could not load store data. Run the project through a local web server.';});
  window.StoreCore={money,toast,renderCart,renderProducts,add,state,escape:esc,get data(){return state.data;}};
})();
