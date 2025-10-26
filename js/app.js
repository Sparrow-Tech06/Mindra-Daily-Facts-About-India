// app.js
// UI behaviour, navigation, save & share logic

const STORAGE_KEY = 'savedFacts';
let facts = [];
let idx = 0;
let navLocked = false;

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

async function load(category) {
  showLoading();
  try {
    if (category === 'all') {
      facts = await DataService.fetchAllMixed();
    } else {
      facts = await DataService.fetchCategory(category);
    }

    // shuffle when 'all' OR when reloading category to give random experience
    facts = shuffleArray(facts || []);
    idx = 0;
    if (facts.length === 0) {
      showEmpty();
      return;
    }
    showFact();
  } catch (err) {
    console.error(err);
    showError('Failed to load facts. Try reloading.');
  }
}

function showLoading() {
  emptyState.style.display = 'none';
  factCard.style.display = 'none';
  factText.textContent = 'Loading...';
  factCard.style.display = 'block';
}

function showEmpty() {
  factCard.style.display = 'none';
  emptyState.style.display = 'block';
}

function showError(msg){
  factCard.style.display = 'block';
  emptyState.style.display = 'none';
  factText.textContent = msg;
  factMeta.textContent = '';
}

function showFact() {
  if (!facts || facts.length === 0) {
    showEmpty();
    return;
  }
  const fact = facts[idx];
  factText.textContent = fact;
  factMeta.textContent = `Fact ${idx + 1} of ${facts.length}`;
  factCard.style.display = 'block';
  disableNavFor(5000); // disable prev/next for 5 seconds after showing
}

function prevFact() {
  if (navLocked) return;
  idx = (idx - 1 + facts.length) % facts.length;
  showFact();
}

function nextFact() {
  if (navLocked) return;
  idx = (idx + 1) % facts.length;
  showFact();
}

function disableNavFor(ms=5000) {
  navLocked = true;
  prevBtn.disabled = true;
  nextBtn.disabled = true;
  setTimeout(()=> {
    navLocked = false;
    prevBtn.disabled = false;
    nextBtn.disabled = false;
  }, ms);
}

function saveCurrent() {
  if (!facts || facts.length === 0) return;
  const cur = facts[idx];
  let saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if (saved.includes(cur)) {
    Swal.fire({ icon: 'info', title: 'Already saved', text: 'This fact is already in your saved list.'});
    return;
  }
  saved.push(cur);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  Swal.fire({ icon: 'success', title: 'Saved', timer: 1000, showConfirmButton: false });
}

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
