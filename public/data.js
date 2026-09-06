const garmentSizes = ['S', 'M', 'L', 'XL', 'XXL'];
const records = [
  ['dune','The Dune Thobe','Thobes','Ivory',148,'Signature','A clean, uninterrupted silhouette. A concealed placket and refined stand collar give this everyday essential its quiet presence.','Cotton poplin', 'ivory thobe, structured stand collar, concealed front placket, straight long sleeves'],
  ['noir','The Noir Thobe','Thobes','Black',158,'Bestseller','Deep black, sharp lines, and a soft drape. Made to move effortlessly from the everyday to the evening.','Cotton twill','matte black thobe, stand collar, concealed front placket, tailored straight silhouette'],
  ['saffron','The Saffron Thobe','Thobes','Burnt orange',168,'Limited palette','A warm, expressive take on a familiar silhouette. Clean tailoring lets the rich burnt-orange tone speak for itself.','Linen blend','burnt orange linen thobe, band collar, discreet chest pocket, long straight sleeves'],
  ['riyadh','The Riyadh Thobe','Thobes','White',145,'Essential','Crisp white and considered proportions. A pointed collar and buttoned cuffs bring a formal finish to the collection.','Cotton poplin','crisp white thobe, pointed shirt collar, small exposed buttons, formal button cuffs'],
  ['oasis','The Oasis Thobe','Thobes','Cream',155,'','Relaxed through the body with a soft collarless neckline. A lighter expression of modern Arabian dressing.','Linen blend','cream linen collarless thobe, short split round neckline, relaxed straight fit'],
  ['ember','The Ember Thobe','Thobes','Terracotta',175,'New','Earthy terracotta meets precise detailing. Tonal embroidery frames the neckline without overwhelming the form.','Cotton blend','terracotta orange thobe with subtle tonal geometric embroidery around short placket'],
  ['midnight','The Midnight Thobe','Thobes','Black',180,'','Subtle texture gives this black thobe its depth. A narrow collar and clean cuff make an understated statement.','Textured cotton','black subtly textured thobe with narrow band collar and clean fitted cuffs'],
  ['nomad','The Nomad Thobe','Thobes','Ivory',165,'','A relaxed cut with visible texture and an easy drape. Designed as a versatile foundation for layered looks.','Textured linen','warm ivory textured linen thobe, relaxed silhouette, simple round neckline and short placket'],
  ['asir','The Asir Thobe','Thobes','White',170,'','An off-center fastening reinterprets classic tailoring. The result is a simple shape with a distinctive detail.','Cotton blend','white thobe with minimal asymmetrical neckline fastening and clean tailored sleeves'],
  ['copper','The Copper Thobe','Thobes','Rust',178,'New','A deep rust color and clean proportions bring warmth to the collection. Finished with a discreet tonal pocket.','Linen blend','deep copper rust thobe, stand collar, tonal chest pocket, linen weave'],
  ['majlis','The Majlis Bisht','Bishts','Black',295,'Signature','A flowing outer layer with a narrow warm-metallic edge. A statement of occasion, worn over a simple thobe.','Lightweight woven fabric','flowing black Arabian bisht cloak open at front over white thobe, narrow muted gold border'],
  ['sahara','The Sahara Bisht','Bishts','Ivory',285,'','An ivory outer layer with fluid volume and a fine border. Tonal dressing with a quietly ceremonial finish.','Lightweight woven fabric','flowing ivory Arabian bisht cloak over white thobe, delicate champagne trim'],
  ['sunset','The Sunset Bisht','Bishts','Burnt orange',310,'Limited palette','Burnt-orange fabric falls in generous folds. A fine dark border makes the outline feel bold and modern.','Lightweight woven fabric','burnt orange Arabian bisht cloak open front over cream thobe, thin dark brown border'],
  ['obsidian','The Obsidian Bisht','Bishts','Black',320,'','Black-on-black details focus attention on the cut and movement. A contemporary interpretation of occasionwear.','Textured woven fabric','black Arabian bisht cloak over black thobe, tone-on-tone black embroidered front border'],
  ['shemagh','The Heritage Shemagh','Accessories','Red & white',65,'Essential','A red-and-white geometric weave that gives every look a finishing note. Styled with a classic black agal.','Woven cotton','red and white geometric patterned shemagh scarf neatly folded with black double cord agal placed beside it, elegant flat lay'],
  ['ghutra','The White Ghutra','Accessories','White',55,'','Clean white fabric and a soft finish. An understated finishing piece, paired here with a black agal.','Woven cotton','white ghutra scarf neatly folded with black double cord agal placed beside it, elegant flat lay']
];
export const products = records.map(([id,name,category,color,price,badge,description,fabric,visual],index) => ({ id,name,category,color,price,badge,description,fabric,visual,index, sizes: category === 'Accessories' ? ['One size'] : garmentSizes, image:`/assets/products/${id}.webp` }));
export const currency = 'USD';
export function money(amount) { return new Intl.NumberFormat('en-US',{ style:'currency',currency,maximumFractionDigits:0 }).format(amount); }
export function filterProducts({category='All',query='',sort='featured',savedOnly=false,saved=[]}={}) {
  const words=query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const list=products.filter(p => (category==='All'||p.category===category) && (!savedOnly||saved.includes(p.id)) && words.every(word=>`${p.name} ${p.category} ${p.color} ${p.fabric}`.toLowerCase().includes(word)));
  if(sort==='price-low') list.sort((a,b)=>a.price-b.price);
  if(sort==='price-high') list.sort((a,b)=>b.price-a.price);
  if(sort==='newest') list.sort((a,b)=>Number(b.badge==='New')-Number(a.badge==='New')||b.index-a.index);
  return list;
}
export function normalizeCart(value) {
  if(!Array.isArray(value)) return [];
  const valid=[];
  for(const row of value) {
    const p=products.find(p=>p.id===row?.id);
    if(!p||!p.sizes.includes(row.size)||!Number.isInteger(row.quantity)||row.quantity<1) continue;
    const old=valid.find(r=>r.id===row.id&&r.size===row.size);
    if(old) old.quantity=Math.min(10,old.quantity+row.quantity);
    else valid.push({id:row.id,size:row.size,quantity:Math.min(10,row.quantity)});
  }
  return valid;
}
export function cartTotals(cart) {
  const valid=normalizeCart(cart);
  return {count:valid.reduce((sum,r)=>sum+r.quantity,0), subtotal:valid.reduce((sum,r)=>sum+products.find(p=>p.id===r.id).price*r.quantity,0)};
}
