function login() {
  const user = document.getElementById('loginUsername').value;
  if (!user) {
    showToast('Selecione um usuário', 'error');
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