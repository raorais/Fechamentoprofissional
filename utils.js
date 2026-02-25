// Funções utilitárias

// Formata valor para moeda brasileira (ex: 1.234,56)
function formatarMoeda(valor) {
  return valor.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Converte string formatada (ex: 1.234,56) para número
function parseValorMonetario(valorString) {
  if (!valorString) return 0;
  const numero = valorString.replace(/\./g, '').replace(',', '.');
  return parseFloat(numero) || 0;
}

// Máscara de moeda enquanto digita
function mascaraMoeda(event) {
  const input = event.target;
  let valor = input.value.replace(/\D/g, '');
  valor = (parseInt(valor) / 100).toFixed(2) + '';
  valor = valor.replace('.', ',');
  valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  input.value = valor;
}

// Validação básica de CPF (apenas formato e dígitos)
function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  // Validação de dígitos verificadores simplificada
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;
  
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf.charAt(10));
}

// Mostrar notificação toast
function showToast(mensagem, tipo = 'info', duracao = 3000) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;
  
  let icone = 'info-circle';
  if (tipo === 'success') icone = 'check-circle';
  if (tipo === 'error') icone = 'exclamation-circle';
  
  toast.innerHTML = `<i class="fas fa-${icone}"></i><span>${mensagem}</span>`;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, duracao);
}

// Modal de confirmação personalizado
function confirmar(mensagem) {
  return new Promise((resolve) => {
    const modal = document.getElementById('confirmModal');
    const msg = document.getElementById('confirmMessage');
    const btnSim = document.getElementById('confirmYes');
    const btnNao = document.getElementById('confirmNo');
    
    msg.textContent = mensagem;
    modal.style.display = 'flex';
    
    btnSim.onclick = () => {
      modal.style.display = 'none';
      resolve(true);
    };
    btnNao.onclick = () => {
      modal.style.display = 'none';
      resolve(false);
    };
  });
}

// Debounce para busca
function debounce(func, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}