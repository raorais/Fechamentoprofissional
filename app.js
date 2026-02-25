// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', function() {
  // Adiciona evento de busca com debounce
  const buscaInput = document.getElementById('buscaProfissional');
  if (buscaInput) {
    buscaInput.addEventListener('keyup', filtrarProfissionaisBase);
  }
  
  // Inicia com um item
  if (typeof adicionarItem === 'function') {
    adicionarItem();
  }
  
  // Toggle tema
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }
});

// Tema escuro/claro
function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const btn = document.getElementById('themeToggle');
  if (btn) {
    if (document.body.classList.contains('dark-theme')) {
      btn.innerHTML = '<i class="fas fa-sun"></i> Tema Claro';
    } else {
      btn.innerHTML = '<i class="fas fa-moon"></i> Tema Escuro';
    }
  }
}

// Exportar função global
window.toggleTheme = toggleTheme;
