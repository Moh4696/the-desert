import {products, money, filterProducts, normalizeCart, cartTotals} from './data.js';

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const state = {category:'All',query:'',sort:'featured',savedOnly:false};
const colorMap = {'Ivory':'#e3d9c3','White':'#fff','Cream':'#efe5cc','Black':'#191919','Burnt orange':'#bd4c24','Terracotta':'#b95b3d','Rust':'#994024','Red & white':'#c24432'};
function readStore(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
function writeStore(key, value) { try { localStorage.setItem(key,JSON.stringify(value)); } catch { /* The shopping session remains usable without persistence. */ } }
let cart = normalizeCart(readStore('desert-bag',[]));
const storedSaved = readStore('desert-saved',[]);
let saved = Array.isArray(storedSaved) ? [...new Set(storedSaved.filter(id=>products.some(p=>p.id===id)))] : [];
let toastTimer;
let currentProduct;
function toast(message) { $('#toast').textContent=message; $('#toast').classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2800); }
function openDialog(id) { const dialog=$(`#${id}`); if(!dialog.open) dialog.showModal(); }
function closeDialog(dialog) { dialog.close(); }
function productById(id) { return products.find(p=>p.id===id); }
function swatch(p) { return `<span class="swatch" style="background:${colorMap[p.color]||'#d6c8b6'}" aria-hidden="true"></span>`; }
function productCard(p) {
  const isSaved=saved.includes(p.id);
  return `<article class="product-card" data-product="${p.id}"><div class="product-visual"><button class="product-image-button" data-product-open="${p.id}" aria-label="View ${p.name}"><img src="${p.image}" alt="${p.color} ${p.category==='Accessories'?'headwear set':p.category==='Bishts'?'bisht':'thobe'} — ${p.name}" width="768" height="1024" loading="lazy"></button>${p.badge?`<span class="product-badge ${p.badge==='New'||p.badge==='Limited palette'?'hot':''}">${p.badge}</span>`:''}<button class="save-button ${isSaved?'saved':''}" data-save="${p.id}" aria-label="${isSaved?'Unsave':'Save'} ${p.name}" aria-pressed="${isSaved}">${isSaved?'♥':'♡'}</button><button class="quick-add" data-product-open="${p.id}" aria-label="Choose size for ${p.name}"><span class="quick-label">View piece</span><span aria-hidden="true">+</span></button></div><div class="product-meta"><div><h3><button data-product-open="${p.id}">${p.name}</button></h3><p>${swatch(p)}${p.color}</p></div><span class="product-price">${money(p.price)}</span></div></article>`;
}
function renderProducts() {
  const list=filterProducts({...state,saved});
  $('#product-grid').innerHTML=list.length?list.map(productCard).join(''):`<div class="empty-results"><h3>No pieces here yet.</h3><p>${state.savedOnly?'Tap the heart on a piece to save it here.':'Try another color, name, or category.'}</p><button class="button dark" id="reset-filters">Explore all pieces ↗</button></div>`;
  $('#result-count').textContent=`${list.length} ${list.length===1?'piece':'pieces'} shown`;
  $$('.filters button').forEach(b=>{const active=b.dataset.category===state.category;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  $('#saved-filter').setAttribute('aria-pressed',String(state.savedOnly));
  $('#active-search').hidden=!state.query;
  $('#active-search span').textContent=`Results for “${state.query}”`;
}
function updateBag() {
  cart=normalizeCart(cart); writeStore('desert-bag',cart);
  const totals=cartTotals(cart);
  $('#bag-count').textContent=totals.count;
  $('#bag-open').setAttribute('aria-label',`Open bag, ${totals.count} ${totals.count===1?'item':'items'}`);
  if(!cart.length){$('#bag-content').innerHTML='<div class="bag-empty"><span aria-hidden="true">✳</span><h3>A little room for character.</h3><p>Your bag is waiting for its first piece.</p><button class="button dark" id="continue-shopping">Explore the collection ↗</button></div>';return;}
  $('#bag-content').innerHTML=cart.map((row,i)=>{const p=productById(row.id);return `<article class="bag-row"><img src="${p.image}" alt="${p.name}"><div><div class="bag-row-title"><button data-product-open="${p.id}" data-from-bag>${p.name}</button><span>${money(p.price*row.quantity)}</span></div><p class="bag-row-details">${p.color} / ${row.size}</p><div class="bag-row-actions"><div class="quantity"><button data-quantity="${i}" data-delta="-1" aria-label="Decrease quantity of ${p.name}" ${row.quantity===1?'disabled':''}>−</button><span aria-label="Quantity">${row.quantity}</span><button data-quantity="${i}" data-delta="1" aria-label="Increase quantity of ${p.name}" ${row.quantity===10?'disabled':''}>+</button></div><button class="remove-item" data-remove="${i}" aria-label="Remove ${p.name}, size ${row.size}">Remove</button></div></div></article>`;}).join('')+`<div class="bag-summary"><div class="total-row"><span>Subtotal</span><strong>${money(totals.subtotal)}</strong></div><p class="fine-print">Sample prices in USD. This concept store does not take payments or ship products.</p><button class="button orange full" id="checkout-open">Preview checkout <span>↗</span></button><button class="text-link" id="continue-shopping">Continue exploring</button></div>`;
}
function renderProduct(id) {
  const p=productById(id); if(!p) return; currentProduct=id;
  $('#product-content').innerHTML=`<div class="product-layout"><img class="product-detail-image" src="${p.image}" alt="${p.name}, ${p.color}"><div class="product-detail-copy"><p class="eyebrow">EDITION 01 / ${p.category}</p><h2 id="product-title">${p.name}</h2><p class="detail-price">${money(p.price)} <small class="fine-print">USD</small></p><p class="product-description">${p.description}</p><p class="detail-color">${swatch(p)}Color: <strong>${p.color}</strong></p><form id="add-product-form"><div class="size-label"><span>Select size</span><button type="button" data-open="guide">Size guide ↗</button></div><fieldset class="sizes"><legend class="sr-only">Size for ${p.name}</legend>${p.sizes.map((size,i)=>`<label><input type="radio" name="size" value="${size}" ${i===0?'required':''} ${p.sizes.length===1?'checked':''}><span>${size}</span></label>`).join('')}</fieldset><button class="button orange full product-add" type="submit">Add to bag <span>+</span></button></form><p class="fine-print">Concept design · Sample price · No payment collected</p><div class="details-accordion"><details><summary>Design & material</summary><p>${p.fabric}. ${p.category==='Bishts'?'Open-front outer layer, styled over a thobe.':p.category==='Accessories'?'One-size headwear set, pictured with an agal.':'Full-length silhouette with long sleeves.'} Materials are design specifications for this concept collection, not verified manufacturing claims.</p></details><details><summary>Fit & care</summary><p>${p.category==='Accessories'?'One-size styling piece.':p.category==='Bishts'?'Generous outer-layer fit. Compare the guide with an outer garment you already own.':'Check the illustrative size guide against a garment you already own.'} Follow the final garment label for care; delicate borders and trims may need specialist cleaning.</p></details></div></div></div>`;
  openDialog('product-dialog');
}
function shopCategory(category) { state.category=category;state.query='';state.savedOnly=false;renderProducts();document.querySelector('#collection').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}); }
function renderSearch() {
  const q=$('#search-input').value;
  const list=filterProducts({query:q}).slice(0,5);
  $('#search-results').innerHTML=list.length?list.map(p=>`<button class="search-result" data-search-product="${p.id}"><img src="${p.image}" alt="" loading="lazy"><span><strong>${p.name}</strong><small>${p.category} / ${p.color}</small></span><em>${money(p.price)}</em></button>`).join(''):'<p class="search-no-results">No pieces match that search. Try “ivory”, “thobe”, or “bisht”.</p>';
}
const infoPages={
  guide:`<p class="eyebrow">FIND YOUR FIT</p><h2 id="info-title">A little guidance.</h2><p>These are illustrative garment measurements for the concept collection. Measure a well-fitting garment flat and compare before choosing. Final production measurements must be confirmed before ordering.</p><div class="table-wrap"><table><caption class="sr-only">Illustrative thobe measurements in centimeters</caption><thead><tr><th>Size</th><th>Chest, flat</th><th>Shoulder</th><th>Length</th></tr></thead><tbody><tr><th>S</th><td>52 cm</td><td>44 cm</td><td>140 cm</td></tr><tr><th>M</th><td>56 cm</td><td>46 cm</td><td>145 cm</td></tr><tr><th>L</th><td>60 cm</td><td>48 cm</td><td>150 cm</td></tr><tr><th>XL</th><td>64 cm</td><td>50 cm</td><td>155 cm</td></tr><tr><th>XXL</th><td>68 cm</td><td>52 cm</td><td>160 cm</td></tr></tbody></table></div><h3>How to measure</h3><p><strong>Chest:</strong> across the garment, under the arms, with the fabric lying flat.<br><strong>Shoulder:</strong> seam to seam across the back.<br><strong>Length:</strong> from the shoulder's highest point to the hem.</p><h3>Bishts & headwear</h3><p>Bishts are an intentionally generous outer layer. Their final dimensions will be listed separately. Shemagh and ghutra sets are shown as one size.</p>`,
  care:`<p class="eyebrow">LOOK AFTER YOUR PIECES</p><h2 id="info-title">Care, considered.</h2><p>Always follow the label supplied with your finished garment. The materials shown in this collection are design specifications.</p><h3>Everyday thobes</h3><p>For washable cotton or linen garments, gentle washing and air drying can help maintain their shape. Wash similar colors together and avoid harsh bleaching.</p><h3>Bishts & embellished pieces</h3><p>Fine borders, embroidery, and delicate outer layers may need specialist care. Check the garment label before washing or pressing.</p><h3>Between wears</h3><p>Air garments after wearing, use a suitable hanger, and store away from direct sunlight.</p>`,
  about:`<p class="eyebrow">THE FIRST EDITION</p><h2 id="info-title">A new expression.</h2><p>The Desert is a concept for a modern Arabian menswear label, built around a vivid illustrated identity and familiar garment forms.</p><p>This preview contains 16 imagined products, AI-created imagery, illustrative material specifications, and sample USD prices. It is an interactive storefront demonstration. No stock is reserved, payments are accepted, or orders are sent.</p><p>Real stock, final measurements, shipping and returns policies, customer service details, and a payment provider will be connected before commercial launch.</p>`,
  privacy:`<p class="eyebrow">YOUR BROWSER, YOUR CHOICES</p><h2 id="info-title">Privacy in this preview.</h2><p>Your shopping bag, saved pieces, and motion preference are stored locally in this browser so they can remain between visits. Clearing this site's browser storage removes them.</p><p>The demo checkout does not ask for contact details, delivery addresses, or payment information. It creates a sample confirmation in the page only. No order is sent to a merchant.</p><p>This site does not include analytics or advertising scripts. Fonts may be loaded from Google Fonts. Hosting services may process routine connection information to deliver the website.</p>`
};
function showInfo(page) { $('#info-content').innerHTML=infoPages[page]||infoPages.about;openDialog('info-dialog'); }
function openCheckout() {
  if(!cart.length) return;
  closeDialog($('#bag-dialog'));
  const total=cartTotals(cart);
  $('#checkout-content').innerHTML=`<p class="eyebrow">THE DESERT / CHECKOUT PREVIEW</p><h2 id="checkout-title">One last look.</h2><p class="checkout-notice">This is a <strong>demo checkout</strong>. No payment will be collected, no stock reserved, and no order sent. Your selection is for preview only.</p><div>${cart.map(r=>{const p=productById(r.id);return `<div class="checkout-item"><span>${p.name}<small>${p.color} / ${r.size} / Qty ${r.quantity}</small></span><strong>${money(p.price*r.quantity)}</strong></div>`;}).join('')}</div><div class="total-row grand"><span>Sample subtotal</span><span>${money(total.subtotal)}</span></div><p class="fine-print">USD. Shipping and tax have not been calculated for this concept.</p><form id="demo-order-form"><label class="checkout-choice"><input type="checkbox" required><span>I understand this creates a sample confirmation only and does not place a real order.</span></label><button class="button orange full" type="submit">Create demo order <span>↗</span></button></form>`;
  openDialog('checkout-dialog');
}

document.addEventListener('click',event=>{
  const button=event.target.closest('button');
  if(!button) return;
  if(button.hasAttribute('data-close')) return closeDialog(button.closest('dialog'));
  if(button.dataset.productOpen) {
    if(button.hasAttribute('data-from-bag')) closeDialog($('#bag-dialog'));
    return renderProduct(button.dataset.productOpen);
  }
  if(button.dataset.searchProduct) { closeDialog($('#search-dialog'));return renderProduct(button.dataset.searchProduct); }
  if(button.dataset.save) {
    const id=button.dataset.save;
    saved=saved.includes(id)?saved.filter(s=>s!==id):[...saved,id];writeStore('desert-saved',saved);
    renderProducts();toast(saved.includes(id)?'Piece saved to your collection.':'Piece removed from saved.');return;
  }
  if(button.dataset.category) { state.category=button.dataset.category;renderProducts();return; }
  if(button.dataset.shop) return shopCategory(button.dataset.shop);
  if(button.dataset.open) { $('#mobile-nav').hidden=true;$('#menu-toggle').setAttribute('aria-expanded','false'); return showInfo(button.dataset.open); }
  if(button.hasAttribute('data-quantity')) {
    const i=Number(button.dataset.quantity), delta=Number(button.dataset.delta);
    if(cart[i]) cart[i].quantity=Math.max(1,Math.min(10,cart[i].quantity+delta));
    updateBag(); return;
  }
  if(button.hasAttribute('data-remove')) {cart.splice(Number(button.dataset.remove),1);updateBag();toast('Piece removed from your bag.');return;}
  if(button.id==='bag-open'||button.id==='footer-bag'){updateBag();openDialog('bag-dialog');return;}
  if(button.id==='search-open'){renderSearch();openDialog('search-dialog');$('#search-input').focus();return;}
  if(button.id==='saved-filter'){state.savedOnly=!state.savedOnly;renderProducts();return;}
  if(button.id==='continue-shopping'){closeDialog($('#bag-dialog'));$('#collection').scrollIntoView();return;}
  if(button.id==='checkout-open') return openCheckout();
  if(button.id==='reset-filters'){Object.assign(state,{category:'All',query:'',savedOnly:false});renderProducts();return;}
  if(button.id==='clear-search'){state.query='';renderProducts();return;}
  if(button.id==='menu-toggle') {const nav=$('#mobile-nav');nav.hidden=!nav.hidden;button.setAttribute('aria-expanded',String(!nav.hidden));return;}
});
document.addEventListener('submit',event=>{
  if(event.target.id==='add-product-form') {
    event.preventDefault();const p=productById(currentProduct),size=new FormData(event.target).get('size');
    if(!p||!p.sizes.includes(size))return;
    const existing=cart.find(r=>r.id===p.id&&r.size===size);
    if(existing?.quantity===10){toast('Maximum 10 of each size in this preview.');return;}
    if(existing)existing.quantity++;else cart.push({id:p.id,size,quantity:1});
    updateBag();closeDialog($('#product-dialog'));openDialog('bag-dialog');toast(`${p.name} added to your bag.`);
  }
  if(event.target.id==='search-form') {event.preventDefault();state.query=$('#search-input').value.trim();state.category='All';state.savedOnly=false;renderProducts();closeDialog($('#search-dialog'));$('#collection').scrollIntoView();}
  if(event.target.id==='demo-order-form') {
    event.preventDefault();const total=cartTotals(cart),reference=`DESERT-DEMO-${Date.now().toString(36).toUpperCase()}`;
    $('#checkout-content').innerHTML=`<span class="confirmation-symbol" aria-hidden="true">✳</span><p class="eyebrow">PREVIEW COMPLETE</p><h2 id="checkout-title">A little more character.</h2><p class="checkout-notice">Your demo order is complete. <strong>No real order was placed and no payment was taken.</strong></p><p class="order-reference">${reference}</p><div class="confirmation-items"><div class="total-row"><span>${total.count} ${total.count===1?'piece':'pieces'}</span><strong>${money(total.subtotal)} USD</strong></div></div><p class="fine-print">Your bag has been cleared for another preview. Your saved pieces remain in your browser.</p><button class="button orange full" data-close style="margin-top:25px">Keep exploring ↗</button>`;
    cart=[];updateBag();$('#checkout-title').setAttribute('tabindex','-1');$('#checkout-title').focus();
  }
});
$('#sort').addEventListener('change',event=>{state.sort=event.target.value;renderProducts();});
$('#search-input').addEventListener('input',renderSearch);
$$('#mobile-nav a').forEach(a=>a.addEventListener('click',()=>{$('#mobile-nav').hidden=true;$('#menu-toggle').setAttribute('aria-expanded','false');}));
$$('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{
  if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();
  if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();
}));
window.addEventListener('storage',event=>{
  if(event.key==='desert-bag'){cart=normalizeCart(readStore('desert-bag',[]));updateBag();}
  if(event.key==='desert-saved'){const value=readStore('desert-saved',[]);saved=Array.isArray(value)?value.filter(id=>products.some(p=>p.id===id)):[];renderProducts();}
});

const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
if(!reducedMotion.matches&&'IntersectionObserver' in window){
  document.documentElement.classList.add('js-motion');
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target);}}),{threshold:.12});
  $$('.reveal').forEach(el=>revealObserver.observe(el));
}
async function setupHero(){
  const video=$('#hero-video'),button=$('#motion-toggle');
  try{
    const response=await fetch('/assets/hero-config.json'); if(!response.ok)return;
    const config=await response.json(); if(!config.video)return;
    const source=new URL(config.video,location.origin); if(source.origin!==location.origin)return;
    video.src=source.href;video.preload='metadata';
    let paused=readStore('desert-motion-paused',false)===true;
    const updateButton=()=>{const isPaused=video.paused;$('#motion-label').textContent=isPaused?'Play motion':'Pause motion';$('#motion-icon').textContent=isPaused?'▷':'Ⅱ';button.setAttribute('aria-label',isPaused?'Play hero animation':'Pause hero animation');};
    video.addEventListener('playing',()=>{video.classList.add('ready');updateButton();});video.addEventListener('pause',updateButton);
    video.addEventListener('error',()=>{video.classList.remove('ready');button.hidden=true;});
    const play=()=>{if(!paused&&!reducedMotion.matches)video.play().catch(()=>{button.hidden=false;updateButton();});};
    button.hidden=reducedMotion.matches;
    button.addEventListener('click',()=>{if(video.paused){paused=false;play();}else{paused=true;video.pause();}writeStore('desert-motion-paused',paused);updateButton();});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else play();});
    reducedMotion.addEventListener('change',()=>{button.hidden=reducedMotion.matches;if(reducedMotion.matches)video.pause();else play();});
    if('IntersectionObserver' in window)new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)play();else video.pause();}),{threshold:.1}).observe(video);
    play();updateButton();
  }catch{/* The approved still artwork remains visible if video is unavailable. */}
}
renderProducts();updateBag();setupHero();
