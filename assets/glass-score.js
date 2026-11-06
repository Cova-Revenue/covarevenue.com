/* Revenue Glass Score™ – autoevaluación de 8 dimensiones.
   Cada respuesta vale 0–3 puntos; el score es el promedio llevado a 0–100.
   "No lo sé / no lo medimos" vale 0: no medirlo ya es una fuga. */
(function(){
  var HUBSPOT_PORTAL_ID = '52274975';
  var HUBSPOT_FORM_ID   = '09f70af8-820c-464a-9554-4900c679857f';
  var EMAIL = 'john@covarevenue.com';
  var WA_NUMBER = '524448467204';

  var NS = 'No lo sé / no lo medimos';
  var Q = [
    { key:'coverage', group:'pipeline', label:'Cobertura de pipeline',
      q:'¿Cuánto pipeline calificado tienes frente a tu meta del trimestre?',
      help:'Valor del pipeline calificado ÷ meta de ingreso del trimestre.',
      o:[['Menos de 2x',0],['Entre 2x y 3x',1],['Entre 3x y 5x',2],['5x o más',3],[NS,0]],
      leak:'Tu pipeline no alcanza para cubrir la meta con margen: el trimestre depende de cerrar casi todo.' },
    { key:'health', group:'pipeline', label:'Salud del pipeline',
      q:'¿Qué tan consistente es la calificación de oportunidades en tu equipo?',
      help:'Si dos vendedores ven el mismo deal, ¿lo califican igual?',
      o:[['Cada vendedor califica a su manera',0],['Hay criterios, pero casi no se aplican',1],['Hay criterios y se aplican casi siempre',2],['Metodología compartida y revisada en el CRM',3]],
      leak:'Sin criterios compartidos, el pipeline se llena de oportunidades que nunca iban a cerrar.' },
    { key:'velocity', group:'pipeline', label:'Velocidad',
      q:'¿Qué porcentaje de tus deals avanza entre etapas en el tiempo esperado?',
      help:'Deals que cumplen el tiempo objetivo (SLA) de cada etapa.',
      o:[['Menos de 40%',0],['Entre 40% y 60%',1],['Entre 60% y 80%',2],['Más de 80%',3],[NS,0]],
      leak:'Los deals tardan más de lo esperado entre etapas: el ciclo se alarga y el forecast se mueve.' },
    { key:'aging', group:'pipeline', label:'Antigüedad del pipeline',
      q:'¿Qué parte de tu pipeline lleva más de 45 días sin avanzar?',
      help:'Oportunidades abiertas sin cambio de etapa en 45 días o más.',
      o:[['Más de 50%',0],['Entre 30% y 50%',1],['Entre 15% y 30%',2],['Menos de 15%',3],[NS,0]],
      leak:'Mucho pipeline lleva semanas detenido: infla el forecast y esconde el problema real.' },
    { key:'conversion', group:'cierre', label:'Conversión en etapa final',
      q:'¿Cuál es tu win rate en etapa final (ganados ÷ deals en negociación)?',
      help:'De los deals que llegan a negociación, ¿cuántos se ganan?',
      o:[['Menos de 20%',0],['Entre 20% y 35%',1],['Entre 35% y 50%',2],['Más de 50%',3],[NS,0]],
      leak:'Lo que llega a negociación no se está convirtiendo en ingreso: la fuga está en el cierre.' },
    { key:'forecast', group:'cierre', label:'Precisión del forecast',
      q:'¿Qué tan cerca termina tu ingreso real del forecast del trimestre?',
      help:'Diferencia entre lo que pronosticaste y lo que realmente cerraste.',
      o:[['Más de 30% de diferencia',0],['Entre 15% y 30%',1],['Entre 5% y 15%',2],['Menos de 5%',3],['No hacemos forecast formal',0]],
      leak:'El forecast no es confiable: la dirección decide con números que cambian cada semana.' },
    { key:'productivity', group:'cierre', label:'Productividad comercial',
      q:'¿Qué parte de la semana dedican tus vendedores a vender?',
      help:'Tiempo frente a clientes y prospectos, frente a administración y herramientas.',
      o:[['Menos de 30%',0],['Entre 30% y 45%',1],['Entre 45% y 60%',2],['Más de 60%',3],[NS,0]],
      leak:'Tus vendedores pasan gran parte de la semana en tareas no comerciales.' },
    { key:'process', group:'proceso', label:'Proceso comercial',
      q:'¿Tus etapas de venta están definidas, se miden y se cumplen?',
      help:'Las tres preguntas con las que se evalúa cada etapa del proceso.',
      o:[['Ninguna de las tres',0],['Están definidas',1],['Están definidas y se miden',2],['Definidas, medidas y se cumplen',3]],
      leak:'Las etapas no están definidas o no se cumplen: cada vendedor vende a su manera.' }
  ];

  var ans = new Array(Q.length).fill(null), i = 0, started = false;
  var $ = function(id){ return document.getElementById(id); };
  function dl(o){ try{ (window.dataLayer = window.dataLayer || []).push(o); }catch(e){} }
  function esc(t){ return String(t).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

  function render(){
    var q = Q[i];
    $('gsProg').style.width = (i / Q.length * 100) + '%';
    $('gsStep').textContent = 'Pregunta ' + (i+1) + ' de ' + Q.length + ' · ' + q.label;
    $('gsQ').textContent = q.q;
    $('gsHelp').textContent = q.help;
    $('gsCount').textContent = '';
    $('gsBack').disabled = (i === 0);
    var box = $('gsOpts'); box.innerHTML = '';
    q.o.forEach(function(opt, k){
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'gs-opt' + (ans[i] === k ? ' sel' : ''); b.textContent = opt[0];
      b.addEventListener('click', function(){ pick(k); });
      box.appendChild(b);
    });
  }
  function pick(k){
    if(!started){ started = true; dl({event:'score_start'}); }
    ans[i] = k;
    if(i < Q.length - 1){ i++; render(); } else { finish(); }
  }

  function dimScore(n){ return Math.round(Q[n].o[ans[n]][1] / 3 * 100); }
  function color(v){ return v < 40 ? '#DC2626' : v < 65 ? '#F4B400' : v < 85 ? '#00B8B8' : '#16A34A'; }
  function band(v){
    if(v < 40) return ['Fugas críticas','band-crit','Hay fugas importantes en varias etapas. Es probable que una parte relevante del ingreso se esté perdiendo cada mes.'];
    if(v < 65) return ['Requiere atención','band-att','Tu motor funciona, pero tiene fugas claras que limitan el crecimiento y la previsibilidad.'];
    if(v < 85) return ['Saludable con oportunidades','band-ok','Buena base. Hay ajustes concretos que pueden mejorar la conversión y la precisión del forecast.'];
    return ['Motor sólido','band-top','Tu motor comercial está bien definido y medido. El siguiente paso es escalar sin perder control.'];
  }

  var result = null;
  function finish(){
    $('gsProg').style.width = '100%';
    var dims = Q.map(function(q, n){ return { n:n, label:q.label, group:q.group, v:dimScore(n), leak:q.leak }; });
    var total = Math.round(dims.reduce(function(s,d){ return s + d.v; }, 0) / dims.length);
    var b = band(total);
    var weakest = dims.slice().sort(function(a,c){ return a.v - c.v; }).filter(function(d){ return d.v < 85; }).slice(0,2);
    function avg(g){ var xs = dims.filter(function(d){ return d.group === g; }); return xs.reduce(function(s,d){ return s + d.v; },0) / xs.length; }
    var p = avg('pipeline'), c = avg('cierre'), pr = dims[7].v, rec;
    if((p < 60 && c < 60) || pr < Math.min(p, c)) rec = {name:'Diagnóstico Completo', why:'Las fugas aparecen tanto en la entrada del pipeline como en el cierre.', href:'/diagnostico-comercial/', interest:'Diagnóstico'};
    else if(p < c) rec = {name:'Diagnóstico de Pipeline', why:'Tu mayor fuga está en la entrada: cobertura, calificación y velocidad del pipeline.', href:'/diagnostico-comercial/', interest:'Diagnóstico'};
    else if(!weakest.length) rec = {name:'validar tu score con los datos de tu CRM', why:'No detectamos fugas importantes en tus respuestas. En una llamada de 20 minutos confirmamos el score con datos reales y vemos cómo escalar sin perder control.', href:'/diagnostico-comercial/', interest:'Diagnóstico'};
    else rec = {name:'Diagnóstico de Cierre + Sprint de Cierre', why:'Tu mayor fuga está en el cierre: lo que llega a negociación no se convierte en ingreso.', href:'/capacitacion-ventas-b2b/', interest:'Ambos'};
    result = { total:total, band:b[0], weakest:weakest, rec:rec };

    $('gsNum').textContent = total;
    var bandEl = $('gsBand'); bandEl.textContent = b[0]; bandEl.className = 'gs-band ' + b[1];
    $('gsBandTxt').textContent = b[2];
    $('gsBars').innerHTML = dims.map(function(d){
      return '<div class="gs-bar"><span>' + esc(d.label) + '</span><div class="track"><div class="fill" style="width:' + d.v + '%; background:' + color(d.v) + '"></div></div><b>' + d.v + '</b></div>';
    }).join('');
    $('gsLeaksTitle').textContent = weakest.length === 2 ? 'Tus dos mayores fugas' : weakest.length === 1 ? 'Tu mayor fuga' : 'No detectamos fugas importantes';
    $('gsLeaks').innerHTML = weakest.map(function(d){
      var ns = (Q[d.n].o[ans[d.n]][0] === NS || /No hacemos/.test(Q[d.n].o[ans[d.n]][0])) ? ' No medirlo ya es parte de la fuga.' : '';
      return '<div class="gs-leak"><b>' + esc(d.label) + ' · ' + d.v + '/100</b>' + esc(d.leak + ns) + '</div>';
    }).join('');
    $('gsRec').innerHTML = '<b>Lo que te recomiendo: ' + esc(rec.name) + '.</b> ' + esc(rec.why) + ' <a href="' + rec.href + '">Ver cómo funciona →</a>';

    $('gsQuiz').hidden = true; $('gsResult').hidden = false;
    $('gsResult').scrollIntoView({behavior:'smooth', block:'start'});
    dl({event:'score_complete', glass_score: total, score_band: b[0]});
  }

  $('gsBack').addEventListener('click', function(){ if(i > 0){ i--; render(); } });
  $('gsRestart').addEventListener('click', function(){
    ans.fill(null); i = 0; result = null;
    $('gsResult').hidden = true; $('gsQuiz').hidden = false; $('gsMsg').hidden = true; render();
    $('gsQuiz').scrollIntoView({behavior:'smooth', block:'start'});
  });

  function getCookie(n){ var m = document.cookie.match('(^|;)\\s*' + n + '=([^;]*)'); return m ? decodeURIComponent(m[2]) : undefined; }

  $('gsForm').addEventListener('submit', async function(e){
    e.preventDefault();
    if(!result) return;
    var name = $('gsName').value.trim(), company = $('gsCompany').value.trim(), email = $('gsEmail').value.trim(), size = $('gsSize').value;
    var summary = 'Revenue Glass Score ' + result.total + ' (' + result.band + ') · Fugas: ' + (result.weakest.length ? result.weakest.map(function(d){ return d.label; }).join(', ') : 'ninguna relevante') + ' · Recomendado: ' + result.rec.name;
    var msg = $('gsMsg'), btn = $('gsSubmit');
    var bodyRaw = 'Nombre: ' + name + '\nEmpresa: ' + company + '\nEmail: ' + email + '\nTamaño de equipo: ' + size + '\n' + summary;
    var wa = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent('Hola John, hice el Revenue Glass Score y quiero el análisis.\n' + bodyRaw);
    var mail = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Revenue Glass Score: ' + company) + '&body=' + encodeURIComponent(bodyRaw);
    btn.disabled = true; var label = btn.textContent; btn.textContent = 'Enviando…';
    try{
      var ctx = { pageUri: location.href, pageName: document.title }; var hutk = getCookie('hubspotutk'); if(hutk) ctx.hutk = hutk;
      var res = await fetch('https://api.hsforms.com/submissions/v3/integration/submit/' + HUBSPOT_PORTAL_ID + '/' + HUBSPOT_FORM_ID, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ fields:[
          {objectTypeId:'0-1', name:'firstname', value:name},
          {objectTypeId:'0-1', name:'company', value:company},
          {objectTypeId:'0-1', name:'email', value:email},
          {objectTypeId:'0-1', name:'team_size', value:size},
          {objectTypeId:'0-1', name:'lead_interest', value:summary}
        ], context: ctx })
      });
      if(!res.ok) throw new Error('HubSpot ' + res.status);
      dl({event:'lead_form_submit', lead_interest:'Revenue Glass Score', team_size:size, glass_score:result.total});
      msg.innerHTML = '<strong>Listo, ' + esc(name) + '.</strong> Recibí tu score (' + result.total + '/100). Te escribo a ' + esc(email) + ' con el análisis y para agendar la llamada. También puedes escribirme por <a href="' + wa + '" target="_blank" rel="noopener">WhatsApp</a>.';
      msg.hidden = false; e.target.reset();
    }catch(err){
      dl({event:'lead_form_error', error_message:String(err && err.message || err)});
      msg.innerHTML = 'No pude registrar tu solicitud automáticamente. Envíame tu score en un clic por <a href="' + wa + '" target="_blank" rel="noopener">WhatsApp</a> o por <a href="' + mail + '">correo</a>.';
      msg.hidden = false;
    }finally{ btn.disabled = false; btn.textContent = label; }
  });

  render();
})();
