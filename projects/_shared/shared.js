(function(){
  try{document.documentElement.setAttribute('data-theme',JSON.parse(localStorage.getItem('jh-theme')||'"night"'))}catch(e){}
  window.$=function(s,r){return(r||document).querySelector(s)};
  window.$$=function(s,r){return Array.from((r||document).querySelectorAll(s))};
  window.esc=function(t){return String(t).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
  window.rp=function(n){return'Rp'+Number(n).toLocaleString('id-ID')};
  window.load=function(k,f){try{var v=localStorage.getItem(k);return v===null?f:JSON.parse(v)}catch(e){return f}};
  window.save=function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
  var tt;window.toast=function(m){var t=$('#toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';t.setAttribute('role','status');document.body.appendChild(t)}t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){t.classList.remove('show')},2600)};
  document.addEventListener('DOMContentLoaded',function(){
    if(window.STANDALONE)return;
    var h=document.createElement('header');h.className='demo-bar';
    h.innerHTML='<a class="btn btn-sm" href="../../index.html#projects">&#9664; Portofolio</a><strong>'+esc(document.body.dataset.title||'')+'</strong>';
    document.body.prepend(h);
  });
})();
