// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', function() {
  // Adiciona evento de busca com debounce
  document.getElementById('buscaProfissional').addEventListener('keyup', filtrarProfissionaisBase);
  
  // Inicia com um item
  if (typeof adicionarItem === 'function') {
    adicionarItem();
  }
  
  // Toggle tema
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
});

// Tema escuro/claro
function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const btn = document.getElementById('themeToggle');
  if (document.body.classList.contains('dark-theme')) {
    btn.innerHTML = '<i class="fas fa-sun"></i> Tema Claro';
  } else {
    btn.innerHTML = '<i class="fas fa-moon"></i> Tema Escuro';
  }
}

// Exportar funções globais
window.login = login;
window.filtrarProfissionaisBase = filtrarProfissionaisBase;
window.selecionarProfissionalBase = selecionarProfissionalBase;
window.salvarCadastro = salvarCadastro;
window.preencherEdicao = preencherEdicao;
window.excluir = excluir;
window.exportarDados = exportarDados;
window.importarDados = importarDados;
window.adicionarItem = adicionarItem;
window.removerItem = removerItem;
window.atualizarItem = atualizarItem;
window.atualizarItemValorUnitario = atualizarItemValorUnitario;
window.togglePagoCheckbox = togglePagoCheckbox;
window.calcular = calcular;
window.limparCalculo = limparCalculo;
window.gerarRecibo = gerarRecibo;