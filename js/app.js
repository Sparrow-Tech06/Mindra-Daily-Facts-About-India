const STORAGE_KEY = 'savedFacts';
let facts = [], idx = 0, navLocked = false;

const categorySelect = document.getElementById('categorySelect');
const reloadBtn = document.getElementById('reloadBtn');
const factCard = document.getElementById('factCard');
const factText = document.getElementById('factText');
const factMeta = document.getElementById('factMeta');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const saveBtn = document.getElementById('saveBtn');
const shareBtn = document.getElementById('shareBtn');
const emptyState = document.getElementById('emptyState');
const toastContainer = document.getElementById('toastContainer');

async function load(category){
  showLoading();
  try{
    if(category==='all'){
      facts = await DataService.fetchAllMixed();
    } else {
      facts = await DataService.fetchCategory(category);
    }
    facts = shuffleArray(facts||[]);
    idx=0;
    if(facts.length===0){ showEmpty(); return; }
    showFact();
  } catch(err){
    showError('Failed to load facts');
  }
}

function showLoading(){ emptyState.style.display='none'; factCard.style.display='block'; factText.textContent='Loading...'; }
function showEmpty(){ factCard.style.display='none'; emptyState.style.display='block'; }
function showError(msg){ factText.textContent=msg; factMeta.textContent=''; }

function showFact(){
  if(!facts || facts.length===0){ showEmpty(); return; }
  factText.textContent = facts[idx];
  factMeta.textContent = `Fact ${idx+1} of ${facts.length}`;
  disableNavFor(5000);
}

function prevFact(){ if(navLocked) return; idx=(idx-1+facts.length)%facts.length; showFact(); }
function nextFact(){ if(navLocked) return; idx=(idx+1)%facts.length; showFact(); }
function disableNavFor(ms=5000){ navLocked=true; prevBtn.disabled=true; nextBtn.disabled=true; setTimeout(()=>{ navLocked=false; prevBtn.disabled=false; nextBtn.disabled=false; },ms); }

function saveCurrent(){
  if(!facts || facts.length===0) return;
  const cur=facts[idx];
  let saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
  if(saved.includes(cur)){ showToast('Already saved','info'); return; }
  saved.push(cur); localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  showToast('Saved successfully','success');
}

function shareCurrent(){
  if(!facts || facts.length===0) return;
  const cur=facts[idx];
  const url=`https://api.whatsapp.com/send?text=${encodeURIComponent(cur)}`;
  window.open(url,'_blank');
}

function shuffleArray(a){ const arr=Array.from(a); for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; } return arr; }

function showToast(message,type='info'){
  const toast=document.createElement('div');
  toast.className=`toast toast-${type}`;
  toast.textContent=message;
  toastContainer.appendChild(toast);
  setTimeout(()=>{ toast.remove(); },3500);
}

// Event Listeners
prevBtn.addEventListener('click',prevFact);
nextBtn.addEventListener('click',nextFact);
saveBtn.addEventListener('click',saveCurrent);
shareBtn.addEventListener('click',shareCurrent);
categorySelect.addEventListener('change',e=>load(e.target.value));
reloadBtn.addEventListener('click',()=>load(categorySelect.value));

document.addEventListener('DOMContentLoaded',()=>{ load('all'); });
function shareCurrent() {
  if (!facts || facts.length === 0) return;
  const cur = facts[idx];
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(cur)}`;
  window.open(url, '_blank');
}

function shuffleArray(a){
  // Fisher-Yates
  const arr = Array.from(a);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// events
prevBtn.addEventListener('click', prevFact);
nextBtn.addEventListener('click', nextFact);
saveBtn.addEventListener('click', saveCurrent);
shareBtn.addEventListener('click', shareCurrent);
categorySelect.addEventListener('change', e => load(e.target.value));
reloadBtn.addEventListener('click', () => load(categorySelect.value));

// initial load
document.addEventListener('DOMContentLoaded', () => {
  load('all');
});
