type Listing = {id:string; title:string; city:string; state:string; type:string; category:string; listed_price:string; currency:string; bedrooms:number|null; bathrooms:number|null; square_meters:string|null; toilets:number|null; commercial_type:string|null; cover_url:string|null};
const api = 'https://api.rentease9ja.com';
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function text(tag:string, value:string, className='') {
  const element=document.createElement(tag); element.textContent=value; element.className=className; return element;
}
function card(row:Listing) {
  const link=document.createElement('a'); link.className='public-listing'; link.href=`${api}/listing/${row.id}`;
  const photo=text('div','Photo unavailable','photo');
  if(row.cover_url) {
    try {
      const url=new URL(row.cover_url);
      if(url.protocol==='https:' && ['res.cloudinary.com','api.rentease9ja.com'].includes(url.hostname)) {
        const img=document.createElement('img'); img.src=url.href; img.alt=row.title; img.loading='lazy'; img.decoding='async'; img.width=800; img.height=600;
        img.addEventListener('error',()=>photo.replaceChildren(document.createTextNode('Photo unavailable')),{once:true});
        photo.replaceChildren(img);
      }
    } catch { /* Missing or invalid images never become sample property photos. */ }
  }
  const details=text('div','','details');
  const amount=Number(row.listed_price);
  let price='Price unavailable';
  if(Number.isFinite(amount)&&amount>=0) {
    try { price=new Intl.NumberFormat('en-NG',{style:'currency',currency:row.currency||'NGN',maximumFractionDigits:2}).format(amount); } catch { /* Preserve an honest unavailable state. */ }
  }
  const facts:string[]=[];
  if(row.category==='residential') {
    if(row.bedrooms!=null)facts.push(`${row.bedrooms} beds`);
    if(row.bathrooms!=null)facts.push(`${row.bathrooms} baths`);
  } else if(row.category==='commercial') {
    facts.push(row.commercial_type?.replaceAll('_',' ')||'Commercial');
    if(row.toilets!=null)facts.push(`${row.toilets} toilets`);
  } else if(row.category==='land')facts.push('Land');
  if(row.square_meters&&Number(row.square_meters)>0)facts.push(`${Number(row.square_meters).toLocaleString('en-NG')} m²`);
  details.append(text('p',row.type==='sale'?'For sale':row.type==='short_lease'?'Short let':'For rent','type'),text('p',price,'price'),text('h3',row.title||'Property'),text('p',[row.city,row.state].filter(Boolean).join(', '),'location'),text('p',facts.join(' · '),'facts'));
  link.append(photo,details); return link;
}
export function initializePublicListings(root:HTMLElement) {
  const grid=root.querySelector<HTMLElement>('.public-grid')!;
  const status=root.querySelector<HTMLElement>('.feed-status')!;
  const retry=root.querySelector<HTMLButtonElement>('.retry')!;
  const more=root.querySelector<HTMLButtonElement>('.load-more')!;
  const sort=root.querySelector<HTMLSelectElement>('select');
  let offset=0, generation=0, controller:AbortController|undefined;
  const seen=new Set<string>();
  async function load(reset=false) {
    const current=++generation; controller?.abort(); controller=new AbortController();
    const timer=setTimeout(()=>controller?.abort(),15000);
    if(reset){offset=0;seen.clear();grid.replaceChildren();}
    grid.setAttribute('aria-busy','true'); retry.hidden=true; more.hidden=true; status.textContent='Loading available properties...';
    const params=new URLSearchParams({limit:root.dataset.limit||'12',offset:String(offset),sort:sort?.value||'newest'});
    if(root.dataset.type)params.set('type',root.dataset.type);
    if(root.dataset.category)params.set('category',root.dataset.category);
    try {
      const response=await fetch(`${api}/v1/public/listings?${params}`,{signal:controller.signal,credentials:'omit',cache:'no-store'});
      if(!response.ok)throw Error('Unavailable');
      const result=await response.json();
      if(!result.ok||!Array.isArray(result.data?.listings)||!Number.isInteger(result.data?.pagination?.total))throw Error('Invalid response');
      if(current!==generation)return;
      for(const row of result.data.listings as Listing[])if(uuid.test(row.id)&&!seen.has(row.id)){grid.append(card(row));seen.add(row.id);}
      offset+=result.data.listings.length;
      status.textContent=seen.size ? `${seen.size} of ${result.data.pagination.total} available properties` : 'No public listings are available here yet. Please check back soon.';
      more.hidden=root.dataset.compact==='true'||offset>=result.data.pagination.total||result.data.listings.length===0;
    } catch {
      if(current!==generation)return;
      status.textContent=seen.size?'Could not load more listings. The properties above may have changed.':'Listings could not be loaded. Please try again.';
      retry.hidden=false;
    } finally {clearTimeout(timer);if(current===generation)grid.setAttribute('aria-busy','false');}
  }
  retry.addEventListener('click',()=>void load()); more.addEventListener('click',()=>void load()); sort?.addEventListener('change',()=>void load(true));
  void load();
}
