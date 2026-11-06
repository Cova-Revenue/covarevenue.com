(function(){
  var html=document.documentElement, btn=document.getElementById('themeToggle');
  function icon(){ if(btn) btn.textContent = html.getAttribute('data-theme')==='dark' ? '☀️' : '🌙'; }
  icon();
  if(btn) btn.addEventListener('click',function(){ var n=html.getAttribute('data-theme')==='dark'?'light':'dark'; html.setAttribute('data-theme',n); try{localStorage.setItem('cova-theme',n);}catch(e){} icon(); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target);} }); },{threshold:0.12});
    document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
  } else { document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('is-visible'); }); }
  function dl(o){ try{ (window.dataLayer=window.dataLayer||[]).push(o);}catch(e){} }
  function loc(a){ if(a.classList.contains('wa-float')) return 'boton_flotante'; var b=a.closest('section[id], footer, nav'); return b ? (b.id || b.tagName.toLowerCase()) : 'otro'; }
  var page=location.pathname.replace(/\//g,'') || 'home';
  document.addEventListener('click',function(e){
    var a=e.target.closest('a[href]'); if(!a) return; var h=a.getAttribute('href')||'';
    if(h.indexOf('https://wa.me/')===0) dl({event:'whatsapp_click', click_location: page+'_'+loc(a)});
    else if(h.indexOf('mailto:')===0) dl({event:'email_click', click_location: page+'_'+loc(a)});
    else if(a.hasAttribute('data-interest')) dl({event:'sprint_cta_click', lead_interest: a.getAttribute('data-interest')});
  },true);
})();
