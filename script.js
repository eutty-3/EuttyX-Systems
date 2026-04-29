// ═══════════════════════════════
// THREE.JS 3D BACKGROUND
// ═══════════════════════════════
const canvas = document.getElementById('bg3d');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth, innerHeight);

const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(70, innerWidth/innerHeight, 0.1, 1000);
cam.position.z = 32;

// Gold particles
const N = 2200;
const pos = new Float32Array(N*3);
for(let i=0;i<N*3;i++) pos[i]=(Math.random()-0.5)*130;
const pg = new THREE.BufferGeometry();
pg.setAttribute('position', new THREE.BufferAttribute(pos,3));
const particles = new THREE.Points(pg, new THREE.PointsMaterial({color:0xf0a030,size:0.11,transparent:true,opacity:0.38,sizeAttenuation:true}));
scene.add(particles);

// Wireframe shapes
const mkMesh = (geo, col, op) => new THREE.Mesh(geo, new THREE.MeshBasicMaterial({color:col, wireframe:true, transparent:true, opacity:op}));
const oct = mkMesh(new THREE.OctahedronGeometry(11,1), 0xf0a030, 0.05);
oct.position.set(-14,4,-12); scene.add(oct);
const ico = mkMesh(new THREE.IcosahedronGeometry(6,1), 0xc07818, 0.07);
ico.position.set(16,-4,-8); scene.add(ico);
const tor1 = mkMesh(new THREE.TorusGeometry(8,0.05,8,90), 0xf0a030, 0.055);
tor1.position.set(4,-8,-18); tor1.rotation.x=Math.PI/3; scene.add(tor1);
const tor2 = mkMesh(new THREE.TorusGeometry(4,0.03,6,60), 0x00c8f4, 0.06);
tor2.position.set(-10,-8,-6); tor2.rotation.y=Math.PI/4; scene.add(tor2);
const box = mkMesh(new THREE.BoxGeometry(8,8,8), 0xf0a030, 0.035);
box.position.set(20,10,-20); scene.add(box);

let mx=0, my=0;
document.addEventListener('mousemove', e=>{mx=(e.clientX/innerWidth-0.5)*2; my=(e.clientY/innerHeight-0.5)*2;});

const clk = new THREE.Clock();
(function loop(){
  requestAnimationFrame(loop);
  const t = clk.getElapsedTime();
  particles.rotation.y = t*0.01; particles.rotation.x = t*0.005;
  oct.rotation.y=t*0.07; oct.rotation.x=t*0.04;
  ico.rotation.y=-t*0.09; ico.rotation.z=t*0.05;
  tor1.rotation.z=t*0.06; tor1.rotation.x=Math.PI/3+t*0.03;
  tor2.rotation.z=-t*0.08; tor2.rotation.y=t*0.06;
  box.rotation.y=t*0.05; box.rotation.x=t*0.04;
  cam.position.x+=(mx*5-cam.position.x)*0.025;
  cam.position.y+=(-my*4-cam.position.y)*0.025;
  cam.lookAt(scene.position);
  renderer.render(scene, cam);
})();
window.addEventListener('resize',()=>{cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});

// ═══════════════════════════════
// CURSOR
// ═══════════════════════════════
const cur=document.getElementById('cur'), ring=document.getElementById('cur-ring');
let rx=0,ry=0,cx=0,cy=0;
document.addEventListener('mousemove',e=>{cx=e.clientX;cy=e.clientY;});
(function animCur(){requestAnimationFrame(animCur);rx+=(cx-rx)*0.14;ry+=(cy-ry)*0.14;cur.style.left=cx-4+'px';cur.style.top=cy-4+'px';ring.style.left=rx-16+'px';ring.style.top=ry-16+'px';})();
document.querySelectorAll('a,button,.btn,.type-opt,.budget-opt,.tl-opt,.pillar').forEach(el=>{
  el.addEventListener('mouseenter',()=>ring.classList.add('big'));
  el.addEventListener('mouseleave',()=>ring.classList.remove('big'));
});

// ═══════════════════════════════
// TYPING ANIMATION
// ═══════════════════════════════
const words = ['Futures.','Websites.','Systems.','Solutions.','Dreams.'];
let wi=0, ci2=0, deleting=false;
const el = document.getElementById('typed-text');
function type(){
  const w = words[wi];
  if(!deleting){ el.textContent=w.slice(0,++ci2); if(ci2===w.length){deleting=true;setTimeout(type,1800);return;} }
  else{ el.textContent=w.slice(0,--ci2); if(ci2===0){deleting=false;wi=(wi+1)%words.length;} }
  setTimeout(type, deleting?60:100);
}
type();

// ═══════════════════════════════
// COUNTER ANIMATION
// ═══════════════════════════════
const counters = document.querySelectorAll('[data-count]');
let counted = false;
function runCounters(){
  if(counted) return; counted=true;
  counters.forEach(el=>{
    const target=+el.dataset.count, suffix=el.dataset.count==='100'?'%':'+';
    let cur=0;
    const step=()=>{cur=Math.min(cur+Math.ceil(target/40),target);el.textContent=cur+(target>2?suffix:'');if(cur<target)requestAnimationFrame(step);};
    step();
  });
}

// ═══════════════════════════════
// SCROLL REVEAL + NAV ACTIVE
// ═══════════════════════════════
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in');
      if(e.target.id==='hero') runCounters();
    }
  });
},{threshold:0.08});
document.querySelectorAll('.rv,.rv2,.rv3').forEach(el=>io.observe(el));

const secs=document.querySelectorAll('section[id]');
const nlinks=document.querySelectorAll('.nav-links a');
const btt=document.getElementById('btt');
window.addEventListener('scroll',()=>{
  let active='';
  secs.forEach(s=>{if(scrollY>=s.offsetTop-140)active=s.id;});
  nlinks.forEach(a=>{a.classList.toggle('active',a.getAttribute('href')==='#'+active);});
  btt.classList.toggle('show',scrollY>600);
});

// ═══════════════════════════════
// PORTFOLIO URL GENERATOR
// ═══════════════════════════════
const DEFAULT_PROJECTS = [
  {url:'https://eutty-a.onrender.com', name:'EuttyA Portfolio', desc:'Personal portfolio for Alex Minyira (Eutty) — web developer & cyber specialist based in Kisii, Kenya.', tech:['HTML5','CSS3','JavaScript','Three.js','Render'], emoji:'👨‍💻'},
  {url:'https://jgwaro.onrender.com',  name:'J. Gwaro Portfolio', desc:'Premium dark editorial portfolio for Joshua Ondari Gwaro — law student at Kabarak University.', tech:['HTML5','CSS3','JavaScript','Render'], emoji:'⚖️'},
];

let projects = JSON.parse(localStorage.getItem('ex_projects')||'null') || DEFAULT_PROJECTS;

function saveProjects(){ try{localStorage.setItem('ex_projects',JSON.stringify(projects));}catch(e){} }

function techGuess(url){
  const sets = [
    {keys:['react','next','gatsby'],tags:['React','JavaScript','CSS3']},
    {keys:['vue','nuxt'],tags:['Vue.js','JavaScript','CSS3']},
    {keys:['wordpress','wp'],tags:['WordPress','PHP','CSS3']},
    {keys:['shopify'],tags:['Shopify','Liquid','CSS3']},
  ];
  const lower=url.toLowerCase();
  for(const s of sets) if(s.keys.some(k=>lower.includes(k))) return s.tags;
  return ['HTML5','CSS3','JavaScript'];
}

function emojiForUrl(url){
  const u=url.toLowerCase();
  if(u.includes('law')||u.includes('legal')) return '⚖️';
  if(u.includes('shop')||u.includes('store')) return '🛍️';
  if(u.includes('food')||u.includes('restaurant')) return '🍽️';
  if(u.includes('photo')||u.includes('studio')) return '📷';
  if(u.includes('tech')||u.includes('dev')) return '💻';
  return ['🌐','🚀','✨','🎨','⚡'][Math.floor(Math.random()*5)];
}

function renderProjects(){
  const grid=document.getElementById('proj-grid');
  const empty=document.getElementById('port-empty');
  grid.innerHTML='';
  if(!projects.length){empty.style.display='block';return;}
  empty.style.display='none';
  projects.forEach((p,i)=>{
    const card=document.createElement('div');
    card.className='proj-card';
    const host=new URL(p.url).hostname;
    card.innerHTML=`
      <div class="proj-preview-placeholder">${p.emoji}</div>
      <div class="proj-body">
        <div class="proj-tag">
          <span>${host}</span>
          <span class="proj-live-dot">Live</span>
        </div>
        <h3 class="proj-t">${p.name}</h3>
        <p class="proj-d">${p.desc}</p>
        <div class="proj-tech">${p.tech.map(t=>`<span class="tech-tag">${t}</span>`).join('')}</div>
        <div class="proj-foot">
          <a class="proj-link" href="${p.url}" target="_blank" rel="noopener">Visit Site</a>
          <button class="proj-del" onclick="removeProject(${i})">✕ Remove</button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

function setStatus(msg,type=''){
  const s=document.getElementById('port-status');
  s.textContent=msg; s.className=type;
}

async function addProject(){
  const urlEl=document.getElementById('port-url');
  const nameEl=document.getElementById('port-name');
  const raw=urlEl.value.trim();
  if(!raw){setStatus('Please enter a URL.','error');return;}
  let url=raw;
  if(!/^https?:\/\//i.test(url)) url='https://'+url;
  try{new URL(url);}catch{setStatus('Invalid URL format.','error');return;}
  if(projects.some(p=>p.url===url)){setStatus('Already added!','error');return;}

  setStatus('Fetching site info…','loading');
  let name=nameEl.value.trim();
  let desc='', tech=techGuess(url);

  // Try to get page title & description via allorigins proxy
  try{
    const proxy=`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const res=await fetch(proxy,{signal:AbortSignal.timeout(8000)});
    const data=await res.json();
    const html=data.contents||'';
    const titleMatch=html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descMatch=html.match(/name=["']description["'][^>]*content=["']([^"']+)["']/i)||html.match(/content=["']([^"']+)["'][^>]*name=["']description["']/i);
    if(!name && titleMatch) name=titleMatch[1].trim().replace(/\s*[|–-].*$/,'').trim();
    if(descMatch) desc=descMatch[1].trim();
  }catch(e){}

  if(!name){ try{name=new URL(url).hostname.replace('www.','').split('.')[0];name=name.charAt(0).toUpperCase()+name.slice(1);}catch{name='My Project';} }
  if(!desc) desc=`A website built and deployed at ${new URL(url).hostname}. Added to the EuttyX Systems portfolio.`;
  tech=[...tech,'Render'];

  projects.push({url,name,desc,tech,emoji:emojiForUrl(url)});
  saveProjects();
  renderProjects();
  urlEl.value=''; nameEl.value='';
  setStatus('✓ Project added!','success');
  setTimeout(()=>setStatus(''),3000);
}

function removeProject(i){
  if(!confirm('Remove this project?')) return;
  projects.splice(i,1);
  saveProjects();
  renderProjects();
}

renderProjects();

// ═══════════════════════════════
// WIZARD
// ═══════════════════════════════
let wizData={type:'',desc:'',ref:'',features:'',budget:'',timeline:'',name:'',email:'',phone:''};

function selectType(el,val){
  document.querySelectorAll('.type-opt').forEach(o=>o.classList.remove('sel'));
  el.classList.add('sel'); wizData.type=val;
}
function selectBudget(el,val){
  document.querySelectorAll('.budget-opt').forEach(o=>o.classList.remove('sel'));
  el.classList.add('sel'); wizData.budget=val;
}
function selectTimeline(el,val){
  document.querySelectorAll('.tl-opt').forEach(o=>o.classList.remove('sel'));
  el.classList.add('sel'); wizData.timeline=val;
}

function wizNext(to){
  if(to===1 && !wizData.type){alert('Please select a project type.');return;}
  if(to===2 && !document.getElementById('wiz-desc').value.trim()){alert('Please describe your project.');return;}
  if(to===3 && (!wizData.budget||!wizData.timeline)){alert('Please select a budget and timeline.');return;}
  document.querySelector('.wiz-page.show').classList.remove('show');
  document.getElementById('wpage-'+to).classList.add('show');
  document.querySelectorAll('.wiz-step').forEach((s,i)=>{
    s.classList.remove('active','done');
    if(i<to) s.classList.add('done');
    if(i===to) s.classList.add('active');
  });
}
function wizBack(to){
  document.querySelector('.wiz-page.show').classList.remove('show');
  document.getElementById('wpage-'+to).classList.add('show');
  document.querySelectorAll('.wiz-step').forEach((s,i)=>{
    s.classList.remove('active','done');
    if(i<to) s.classList.add('done');
    if(i===to) s.classList.add('active');
  });
}

function submitWizard(){
  const n=document.getElementById('wiz-name').value.trim();
  const em=document.getElementById('wiz-email').value.trim();
  if(!n||!em){alert('Please fill in your name and email.');return;}
  wizData.desc=document.getElementById('wiz-desc').value;
  wizData.ref=document.getElementById('wiz-ref').value;
  wizData.features=document.getElementById('wiz-features').value;
  wizData.name=n; wizData.email=em;
  wizData.phone=document.getElementById('wiz-phone').value;

  // Build WhatsApp message
  const msg=encodeURIComponent(
    `*New Project Enquiry — EuttyX Systems*\n\n`+
    `*Type:* ${wizData.type}\n`+
    `*Budget:* ${wizData.budget}\n`+
    `*Timeline:* ${wizData.timeline}\n\n`+
    `*Description:*\n${wizData.desc}\n\n`+
    `*Features:* ${wizData.features||'N/A'}\n`+
    `*Reference:* ${wizData.ref||'N/A'}\n\n`+
    `*From:* ${wizData.name} | ${wizData.email} | ${wizData.phone||'N/A'}`
  );
  // Open WhatsApp with pre-filled message
  window.open(`https://wa.me/254719742686?text=${msg}`,'_blank');

  document.getElementById('wiz-pages').style.display='none';
  document.getElementById('wiz-success').style.display='block';
}

// ═══════════════════════════════
// CONTACT FORM
// ═══════════════════════════════
async function submitContact(e){
  e.preventDefault();

  const ok = document.getElementById('form-ok');

  const form = e.target;

  const data = {
    first_name: form.querySelector('input[placeholder="John"]').value,
    last_name: form.querySelectorAll('input')[1].value,
    email: form.querySelector('input[type="email"]').value,
    phone: form.querySelector('input[type="tel"]').value,
    subject: form.querySelector('input[placeholder="Project enquiry..."]').value,
    message: form.querySelector('textarea').value,
  };

  try {
    const res = await fetch("https://euttyx-systems-backend.onrender.com/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.success) {
      ok.style.display = 'block';
      form.reset();

      setTimeout(() => ok.style.display = 'none', 6000);
    } else {
      alert("Message failed to send.");
    }

  } catch (err) {
    console.log(err);
    alert("Server error. Try again later.");
  }
}

// ═══════════════════════════════
// NEWSLETTER
// ═══════════════════════════════
function submitNewsletter(e){
  e.preventDefault();
  document.getElementById('nl-ok').style.display='block';
  document.getElementById('nl-email').value='';
  setTimeout(()=>document.getElementById('nl-ok').style.display='none',5000);
}

const ADMIN_KEY = "euttyx-admin";

function checkAdmin() {
  document.getElementById("admin-modal").classList.remove("hidden");
}

function closeAdminModal() {
  document.getElementById("admin-modal").classList.add("hidden");
  document.getElementById("admin-key-input").value = "";
}

function submitAdminKey() {
  const key = document.getElementById("admin-key-input").value;

  if (key === ADMIN_KEY) {
    localStorage.setItem("isAdmin", "true");
    enableAdminUI();
    closeAdminModal();
    toast("Admin unlocked 🔓");
  } else {
    toast("Wrong key ❌");
  }
}

function logoutAdmin() {
  const confirmBox = confirm("Exit admin mode?");
  
  if (confirmBox) {
    localStorage.removeItem("isAdmin");
    disableAdminUI();
    toast("Logged out");
  }
}

function enableAdminUI() {
  document.getElementById("admin-bar").style.display = "flex";
  document.getElementById("port-add-bar").style.display = "flex";
}

function disableAdminUI() {
  document.getElementById("admin-bar").style.display = "none";
  document.getElementById("port-add-bar").style.display = "none";
}

// auto login state
if (localStorage.getItem("isAdmin") === "true") {
  enableAdminUI();
}

// small toast system
function toast(msg){
  const t = document.createElement("div");
  t.textContent = msg;
  t.style = `
    position:fixed;
    bottom:20px;
    left:50%;
    transform:translateX(-50%);
    background:#111;
    border:1px solid #f0a030;
    color:#f0a030;
    padding:10px 14px;
    border-radius:10px;
    font-size:13px;
    z-index:999999;
    animation:fadeIn .2s ease;
  `;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),2000);
}