/* Laboratório do primeiro acesso: abre o roteiro REAL do app (app/#teste-primeiro-acesso)
   em modo de simulação. O app não grava nada nesse modo; ao final mostra o que gravaria. */
(function(){
'use strict';
var KEY='easyapp:gestao:testes-primeiro-acesso:v2', notas='', inicio=0;
try{notas=localStorage.getItem(KEY)||'';}catch(e){}
function html(){return '<style>.labGrid{display:grid;grid-template-columns:minmax(0,430px) minmax(240px,1fr);gap:24px;align-items:start;margin-top:20px}.labPhone{width:100%;height:820px;border:1px solid #40516c;border-radius:22px;background:#0f1420}.labTools{padding:18px;border:1px solid var(--line);border-radius:16px;background:var(--card)}.labTools button,.labTools a.bt{display:inline-block;min-height:44px;margin:8px 6px 0 0;background:#202d44;color:#eaf1fc;border:1px solid #40516c;border-radius:10px;padding:10px 13px;font:inherit;cursor:pointer;text-decoration:none}#labNew{background:#377bed;border-color:#377bed}.labTools textarea{width:100%;min-height:140px;background:var(--bg);color:var(--tx);border:1px solid var(--line);border-radius:9px;padding:11px;font:inherit;resize:vertical}.labTools ol{padding-left:18px;color:var(--tx2);font-size:13px;line-height:1.6}@media(max-width:780px){.labGrid{grid-template-columns:1fr}.labPhone{height:740px;max-width:430px;display:block;margin:auto}}</style>'+
'<h2>Testar primeiro acesso</h2><p class="sub">É o roteiro de verdade do app (o mesmo que o cliente novo vê), em modo de simulação: nada é gravado. No fim ele mostra o que gravaria.</p>'+
'<div class="labGrid"><div><iframe id="labFrame" class="labPhone" title="Primeiro acesso do app"></iframe></div>'+
'<aside class="labTools"><h2 style="margin-top:0">Roteiro</h2><ol><li>Planilha? (sim abre o assistente; não segue o roteiro)</li><li>Bancos — PF/PJ, só cliques</li><li>Famílias de contas</li><li>Contas — valor, recorrência e reajuste</li><li>Indicadores — meta do cartão, inflação, reajuste</li><li>Plano — agora ou depois</li><li>Automação — configurar ou ver o app antes</li></ol>'+
'<button id="labNew">Recomeçar do zero</button><a class="bt" href="app/#teste-primeiro-acesso" target="_blank" rel="noopener">Abrir em tela cheia ↗</a>'+
'<p id="labTempo" class="sub" style="margin-top:12px"></p>'+
'<label for="labNotes" class="sub" style="display:block;margin:16px 0 6px">Anotações (ficam só neste navegador)</label><textarea id="labNotes" maxlength="3000" placeholder="O que ficou fácil ou confuso?"></textarea></aside></div>';}
var relogio=null;
function tempo(){var el=document.getElementById('labTempo');if(!el){clearInterval(relogio);relogio=null;return;}var n=Math.round((Date.now()-inicio)/1000);el.textContent='Tempo desta rodada: '+Math.floor(n/60)+'min '+String(n%60).padStart(2,'0')+'s';}
function start(){var f=document.getElementById('labFrame');if(!f)return;f.src='app/?lab='+Date.now()+'#teste-primeiro-acesso';inicio=Date.now();if(!relogio)relogio=setInterval(tempo,1000);tempo();}
function pause(){var f=document.getElementById('labFrame');if(f)f.removeAttribute('src');if(relogio){clearInterval(relogio);relogio=null;}}
function mount(){var t=document.getElementById('labNotes');t.value=notas;t.oninput=function(){notas=this.value;try{localStorage.setItem(KEY,notas);}catch(e){}};document.getElementById('labNew').onclick=start;start();}
window.TestePrimeiroAcesso={html:html,mount:mount,pause:pause};
})();
