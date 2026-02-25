function login() {
  const user = document.getElementById('loginUsername').value;
  if (!user) {
    if (typeof showToast === 'function') {
      showToast('Selecione um usuário', 'error');
    } else {
      alert('Selecione um usuário');
    }
    return;
  }
  usuario = user;
  document.getElementById('userGreeting').textContent = `Olá, ${user}`;
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('mainSystem').style.display = 'block';
  if (typeof atualizarListas === 'function') {
    atualizarListas();
  }
  if (typeof adicionarItem === 'function') {
    adicionarItem();
  }
}

// Exportar globalmente
window.login = login;
