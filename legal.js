/* O contato oficial do EasyAPP para privacidade e suporte - um lugar só. */
var CONTATO = 'rodrigopiratini@gmail.com';
document.querySelectorAll('.contato').forEach(function (e) {
  if (CONTATO) { e.innerHTML = '<a href="mailto:' + CONTATO + '">' + CONTATO + '</a>'; }
  else { e.textContent = 'pelo próprio app, em Config → Minha conta'; }
});
