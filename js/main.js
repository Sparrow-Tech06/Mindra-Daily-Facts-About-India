let facts = [];
let currentIndex = 0;
let currentCategory = "all";
let currentLang = "eng";
let btnLocked = false;

const factText = document.getElementById("factText");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const saveBtn = document.getElementById("saveBtn");
const shareBtn = document.getElementById("shareBtn");
const langSelect = document.getElementById("langSelect");

async function loadCategory(category) {
  currentCategory = category;
  if (category === "all") {
    const categories = ["nature", "science", "society", "history"];
    const allData = await Promise.all(categories.map(cat => fetch(`json/${cat}.json`).then(r => r.json())));
    facts = allData.flat();
  } else {
    facts = await fetch(`json/${category}.json`).then(r => r.json());
  }
  shuffleFacts();
  currentIndex = 0;
  showFact();
}

function shuffleFacts() {
  for (let i = facts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [facts[i], facts[j]] = [facts[j], facts[i]];
  }
}

function showFact() {
  if (!facts.length) return;
  const factObj = facts[currentIndex];
  factText.textContent = factObj[currentLang] || factObj["eng"];
  lockButtons();
}

function lockButtons() {
  btnLocked = true;
  prevBtn.disabled = true;
  nextBtn.disabled = true;
  setTimeout(() => {
    btnLocked = false;
    prevBtn.disabled = false;
    nextBtn.disabled = false;
  }, 5000);
}

prevBtn.addEventListener("click", () => {
  if (btnLocked) return;
  currentIndex = (currentIndex - 1 + facts.length) % facts.length;
  showFact();
});

nextBtn.addEventListener("click", () => {
  if (btnLocked) return;
  currentIndex = (currentIndex + 1) % facts.length;
  showFact();
});

saveBtn.addEventListener("click", () => {
  let saved = JSON.parse(localStorage.getItem("savedFacts")) || [];
  const fact = facts[currentIndex][currentLang];
  if (!saved.includes(fact)) {
    saved.push(fact);
    localStorage.setItem("savedFacts", JSON.stringify(saved));
    showToast("Fact saved successfully!");
  } else {
    showToast("Already saved!");
  }
});

shareBtn.addEventListener("click", () => {
  const text = facts[currentIndex][currentLang];
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
});

langSelect.addEventListener("change", e => {
  currentLang = e.target.value;
  showFact();
});

document.querySelectorAll(".dropdown-item").forEach(item => {
  item.addEventListener("click", e => {
    e.preventDefault();
    loadCategory(e.target.getAttribute("data-cat"));
  });
});

loadCategory("all");
