// assets/js/share.js
window.addEventListener('DOMContentLoaded', ()=>{
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if(!id) return;
  // fetch facts then attach events (reuse fetch path)
  fetch('../data/facts.json').then(r=>r.json()).then(F=>{
    const f = F.find(x=>x.id===id);
    if(!f) return;
    document.getElementById('factImg').src = f.image;
    document.getElementById('factTitle').textContent = f.title;
    document.getElementById('factText').textContent = f.text;
    document.getElementById('bookmarkBtn').addEventListener('click', ()=>{
      const bookmarks = JSON.parse(localStorage.getItem('til_bookmarks')||'[]');
      if(!bookmarks.includes(id)) bookmarks.push(id);
      localStorage.setItem('til_bookmarks', JSON.stringify(bookmarks));
      Swal.fire({toast:true, position:'top-end', icon:'success', title:'Bookmarked', showConfirmButton:false, timer:1500});
    });
    document.getElementById('shareBtn').addEventListener('click', ()=>{
      if(navigator.share){navigator.share({title:f.title, text:f.text}).catch(()=>{});} else {
        // fallback: copy text
        navigator.clipboard.writeText(f.title + '\n' + f.text).then(()=>{
          Swal.fire({toast:true, position:'top-end', icon:'success', title:'Copied to clipboard', showConfirmButton:false, timer:1300});
        });
      }
    });
  });
});
