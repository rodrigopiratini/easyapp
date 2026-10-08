/* Laboratório do primeiro acesso.
   "Cliente novo" cria no servidor uma conta de teste de verdade e abre o app
   com ela. "Salvar este teste" dá um nome e a guarda: fica na lista para entrar
   de novo quando quiser (as não salvas somem depois de 6 horas): o roteiro grava como num cliente, e
   no fim o app abre com o que foi montado. A sessão fica em outra chave
   (app/?demo=1), sem trocar a sessão do app de quem usa este navegador.
   "Simulação rápida" passa pelo roteiro sem gravar nada. */
(function(){
'use strict';
var KEY='easyapp:gestao:testes-primeiro-acesso:v2', notas='', inicio=0, relogio=null, ultimo='', atual=null;
try{notas=localStorage.getItem(KEY)||'';}catch(e){}
function html(){return '<style>.labGrid{display:grid;grid-template-columns:minmax(0,430px) minmax(240px,1fr);gap:24px;align-items:start;margin-top:20px}.labPhone{width:100%;height:820px;border:1px solid #40516c;border-radius:22px;background:#0f1420}.labTools{padding:18px;border:1px solid var(--line);border-radius:16px;background:var(--card)}.labTools button,.labTools a.bt{display:inline-block;min-height:44px;margin:8px 6px 0 0;background:#202d44;color:#eaf1fc;border:1px solid #40516c;border-radius:10px;padding:10px 13px;font:inherit;cursor:pointer;text-decoration:none}.labTools button:disabled{opacity:.5}#labNovo{background:#377bed;border-color:#377bed}.labTools textarea{width:100%;min-height:140px;background:var(--bg);color:var(--tx);border:1px solid var(--line);border-radius:9px;padding:11px;font:inherit;resize:vertical}.labTools ol{padding-left:18px;color:var(--tx2);font-size:13px;line-height:1.6}#labVazio[hidden],.labPhone[hidden]{display:none!important}#labVazio{display:flex;align-items:center;justify-content:center;text-align:center;padding:30px;color:var(--tx2)}@media(max-width:780px){.labGrid{grid-template-columns:1fr}.labPhone{height:740px;max-width:430px;display:block;margin:auto}}</style>'+
'<h2>Testar primeiro acesso</h2><p class="sub"><b>Cliente novo</b> cria uma conta de teste de verdade e abre o app com ela: você passa pelo roteiro como um cliente e, no fim, o app abre com o que montou. <b>Salvar este teste</b> guarda a conta com um nome, para voltar nela depois; as não salvas somem depois de 6 horas. Nenhuma entra nos números do painel.</p>'+
'<div class="labGrid"><div><div id="labVazio" class="labPhone">Toque em <b>&nbsp;Cliente novo&nbsp;</b> para começar.</div><iframe id="labFrame" class="labPhone" title="App do cliente de teste" hidden></iframe></div>'+
'<aside class="labTools"><h2 style="margin-top:0">Roteiro</h2><ol><li>Nome completo e planilha?</li><li>Bancos (PF/PJ, conta e cartão)</li><li>Saldos e cartões (quem paga cada fatura)</li><li>Famílias de contas</li><li>Contas</li><li>Valores, frequência e reajuste</li><li>Metas</li><li>Plano</li><li>Automação, ou ver o app</li></ol>'+
'<button id="labNovo">Cliente novo</button><button id="labSalvar" disabled>💾 Salvar este teste</button><button id="labSim">Simulação rápida (não grava)</button><a class="bt" id="labCheia" href="#" target="_blank" rel="noopener">Abrir em tela cheia ↗</a>'+
'<p id="labStatus" class="sub" style="margin-top:12px"></p>'+
'<h2 style="margin:18px 0 6px">Testes salvos</h2><div id="labLista" class="sub">carregando...</div>'+
'<label for="labNotes" class="sub" style="display:block;margin:16px 0 6px">Anotações (ficam só neste navegador)</label><textarea id="labNotes" maxlength="3000" placeholder="O que ficou fácil ou confuso?"></textarea></aside></div>';}
function status(t){var el=document.getElementById('labStatus');if(el)el.textContent=t;}
function tempo(){var el=document.getElementById('labStatus');if(!el||!inicio){clearInterval(relogio);relogio=null;return;}var n=Math.round((Date.now()-inicio)/1000);el.textContent=(ultimo?ultimo+' · ':'')+'tempo desta rodada: '+Math.floor(n/60)+'min '+String(n%60).padStart(2,'0')+'s';}
function abrir(src){var f=document.getElementById('labFrame');if(!f)return;document.getElementById('labVazio').hidden=true;f.hidden=false;f.src=src;document.getElementById('labCheia').href=src;inicio=Date.now();if(!relogio)relogio=setInterval(tempo,1000);tempo();}
function chamar(corpo){return token().then(function(t){return fetch(URL_SB+'/functions/v1/gestao',{method:'POST',headers:{apikey:CHAVE,Authorization:'Bearer '+t,'Content-Type':'application/json'},body:JSON.stringify(corpo)});}).then(function(r){return r.json();}).then(function(d){if(d.mfa){telaMfa();throw new Error('confirme o código');}if(!d.ok)throw new Error(d.erro||'falhou');return d;});}
function esc2(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function quando(iso){var d=new Date(iso);return isNaN(d)?'':('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2)+' '+('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2);}
// abre o app com a sessão de uma conta de teste (nova ou salva)
function usarSessao(s,rotulo){
  try{localStorage.setItem('easyapp:sessao-demo',JSON.stringify({token:s.access_token,refresh:s.refresh_token,user_id:s.user.id,expira:Date.now()+(Number(s.expires_in)||3600)*1000}));}
  catch(e){status('o navegador não deixou guardar a sessão de teste');return false;}
  atual={id:s.user.id,rotulo:rotulo||''};var b=document.getElementById('labSalvar');if(b){b.disabled=false;b.textContent=rotulo?'💾 Renomear este teste':'💾 Salvar este teste';}
  abrir('app/?demo=1&r='+Date.now());return true;
}
function listar(){
  var box=document.getElementById('labLista');if(!box)return;
  chamar({acao:'testes_listar'}).then(function(d){
    var l=d.testes||[];
    if(!l.length){box.innerHTML='Nenhum teste ainda.';return;}
    box.innerHTML=l.map(function(t){
      return '<div style="border:1px solid var(--line);border-radius:12px;padding:10px 12px;margin-bottom:8px'+(atual&&atual.id===t.id?';border-color:#377bed':'')+'">'+
        '<div style="font-weight:700;color:var(--tx)">'+(t.salvo?'💾 '+esc2(t.rotulo||'sem nome'):'⏳ não salvo · some em 6 h')+'</div>'+
        '<div style="font-size:12.5px">'+esc2(t.nome||'sem nome no cadastro')+' · '+(t.montado?'app montado':'no roteiro')+' · criado '+quando(t.criado)+'</div>'+
        '<button data-entrar="'+t.id+'" data-rot="'+esc2(t.rotulo)+'">Entrar</button>'+
        '<button data-salvar="'+t.id+'" data-rot="'+esc2(t.rotulo)+'">'+(t.salvo?'Renomear':'Salvar')+'</button>'+
        '<button data-apagar="'+t.id+'" style="color:#fca5a5">Apagar</button></div>';
    }).join('');
    box.querySelectorAll('[data-entrar]').forEach(function(b){b.onclick=function(){
      status('entrando no teste...');
      chamar({acao:'teste_entrar',user_id:b.dataset.entrar}).then(function(d){ultimo='teste: '+(b.dataset.rot||d.email);usarSessao(d.sessao,b.dataset.rot);listar();})
        .catch(function(e){status(e.message);});};});
    box.querySelectorAll('[data-salvar]').forEach(function(b){b.onclick=function(){salvar(b.dataset.salvar,b.dataset.rot);};});
    box.querySelectorAll('[data-apagar]').forEach(function(b){b.onclick=function(){
      if(!confirm('Apagar este cliente de teste e tudo o que foi montado nele?'))return;
      chamar({acao:'teste_apagar',user_id:b.dataset.apagar}).then(function(){if(atual&&atual.id===b.dataset.apagar){atual=null;pause();}listar();}).catch(function(e){status(e.message);});};});
  }).catch(function(e){box.textContent='não consegui listar: '+e.message;});
}
function salvar(id,rotuloAtual){
  var n=prompt('Nome para este teste (ex.: "2 contas PJ no C6, IPVA parcelado")',rotuloAtual||'');
  if(n===null)return;n=String(n).trim();if(!n){status('dê um nome para salvar');return;}
  chamar({acao:'teste_salvar',user_id:id,rotulo:n}).then(function(){
    if(atual&&atual.id===id){atual.rotulo=n;var b=document.getElementById('labSalvar');if(b)b.textContent='💾 Renomear este teste';}
    status('salvo: '+n);listar();}).catch(function(e){status(e.message);});
}
function novo(){
  var b=document.getElementById('labNovo');b.disabled=true;status('criando o cliente de teste...');
  token().then(function(t){return fetch(URL_SB+'/functions/v1/gestao',{method:'POST',headers:{apikey:CHAVE,Authorization:'Bearer '+t,'Content-Type':'application/json'},body:JSON.stringify({acao:'cliente_teste'})});})
  .then(function(r){return r.json();}).then(function(d){
    b.disabled=false;
    if(d.mfa){telaMfa();return;}
    if(!d.ok){status(d.erro||'não consegui criar o cliente de teste');return;}
    ultimo='cliente de teste: '+d.email;usarSessao(d.sessao,'');listar();
  }).catch(function(e){b.disabled=false;status('falhou: '+((e&&e.message)||e));});
}
function pause(){var f=document.getElementById('labFrame');if(f)f.removeAttribute('src');if(relogio){clearInterval(relogio);relogio=null;}}
function mount(){var t=document.getElementById('labNotes');t.value=notas;t.oninput=function(){notas=this.value;try{localStorage.setItem(KEY,notas);}catch(e){}};
  document.getElementById('labNovo').onclick=novo;
  document.getElementById('labSalvar').onclick=function(){if(atual)salvar(atual.id,atual.rotulo);};
  listar();
  document.getElementById('labSim').onclick=function(){ultimo='simulação (não grava)';abrir('app/?lab='+Date.now()+'#teste-primeiro-acesso');};
  document.getElementById('labCheia').onclick=function(e){if(this.getAttribute('href')==='#'){e.preventDefault();status('comece um teste primeiro');}};}
window.TestePrimeiroAcesso={html:html,mount:mount,pause:pause};
})();
