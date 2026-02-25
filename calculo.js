// ==================== FUNÇÕES DE ITENS ====================
function adicionarItem() {
  itens.push({ id: Date.now(), qtd: 1, descricao: '', valorUnitario: 0, valorTotal: 0 });
  renderizarItens();
}

function removerItem(id) {
  itens = itens.filter(i => i.id !== id);
  renderizarItens();
}

function atualizarItem(id, campo, valor) {
  const item = itens.find(i => i.id === id);
  if (!item) return;
  
  if (campo === 'qtd') item.qtd = parseInt(valor) || 1;
  if (campo === 'descricao') item.descricao = valor.toUpperCase();
  if (campo === 'valorUnitario') item.valorUnitario = parseFloat(valor) || 0;
  
  item.valorTotal = item.qtd * item.valorUnitario;
  renderizarItens();
}

function atualizarItemValorUnitario(input, id) {
  let valor = parseValorMonetario(input.value);
  atualizarItem(id, 'valorUnitario', valor);
  input.value = formatarMoeda(valor);
}

function renderizarItens() {
  const container = document.getElementById('itensContainer');
  let html = '';
  let total = 0;
  
  itens.forEach(i => {
    total += i.valorTotal;
    html += `
      <div class="item-row">
        <input type="number" value="${i.qtd}" min="1" onchange="atualizarItem(${i.id}, 'qtd', this.value)">
        <input type="text" value="${i.descricao}" placeholder="Descrição" onchange="atualizarItem(${i.id}, 'descricao', this.value)">
        <input type="text" value="${formatarMoeda(i.valorUnitario)}" 
               onblur="atualizarItemValorUnitario(this, ${i.id})"
               onkeyup="mascaraMoeda(event)"
               placeholder="0,00">
        <div>R$ ${formatarMoeda(i.valorTotal)}</div>
        <div><button class="btn-danger btn-small" onclick="removerItem(${i.id})"><i class="fas fa-trash"></i></button></div>
      </div>
    `;
  });
  
  container.innerHTML = html;
  document.getElementById('totalItens').innerHTML = `Subtotal: R$ ${formatarMoeda(total)}`;
}

// ==================== FUNÇÕES DO CHECKBOX PAGO HOJE ====================
function togglePagoCheckbox() {
  const forma = document.getElementById('formaPagamento').value;
  const container = document.getElementById('pagoHojeContainer');
  if (forma === 'dinheiro') {
    container.style.display = 'flex';
  } else {
    container.style.display = 'none';
    document.getElementById('pagoHojeCheckbox').checked = false;
  }
}

// ==================== FUNÇÕES DE CÁLCULO ====================
// ==================== FUNÇÕES DE CÁLCULO ====================
function calcular() {
  const idProfissional = parseInt(document.getElementById('selectProfissional').value);
  const profissional = profissionais.find(p => p.id === idProfissional);
  
  if (!profissional) {
    showToast('Selecione um profissional', 'error');
    return;
  }
  
  const subtotal = itens.reduce((s, i) => s + i.valorTotal, 0);
  if (subtotal <= 0) {
    showToast('Adicione itens com valor positivo', 'error');
    return;
  }
  
  let pis = 0, csll = 0, irrf = 0, cofins = 0;
  
  if (profissional.regime === 'pj-presumido') {
    // VERIFICAÇÃO DO LIMITE DE R$ 215,05
    if (subtotal <= 215.05) {
      // NENHUM IMPOSTO PARA VALORES ABAIXO DE R$ 215,05
      pis = 0;
      csll = 0;
      cofins = 0;
      irrf = 0;
      document.getElementById('impostosContainer').style.display = 'none';
      document.getElementById('irrfItem').style.display = 'none';
    } 
    else if (subtotal > 215.05 && subtotal <= TAXAS.LIMITE_IRRF) {
      // ENTRE 215,05 E 666,67: APENAS PIS, COFINS E CSLL
      pis = subtotal * TAXAS.PIS;
      csll = subtotal * TAXAS.CSLL;
      cofins = subtotal * TAXAS.COFINS;
      irrf = 0;
      document.getElementById('impostosContainer').style.display = 'block';
      document.getElementById('irrfItem').style.display = 'none';
    } 
    else {
      // ACIMA DE 666,67: TODOS OS IMPOSTOS
      pis = subtotal * TAXAS.PIS;
      csll = subtotal * TAXAS.CSLL;
      cofins = subtotal * TAXAS.COFINS;
      irrf = subtotal * TAXAS.IRRF;
      document.getElementById('impostosContainer').style.display = 'block';
      document.getElementById('irrfItem').style.display = 'flex';
    }
  } else {
    document.getElementById('impostosContainer').style.display = 'none';
  }
  
  const totalDescontos = pis + csll + irrf + cofins;
  const liquido = subtotal - totalDescontos;
  const data = new Date().toLocaleString('pt-BR');
  
  togglePagoCheckbox();
  
  dadosCalculo = {
    profissional,
    formaPagamento: document.getElementById('formaPagamento').value,
    itens: [...itens],
    subtotal,
    pis, csll, irrf, cofins,
    totalDescontos,
    liquido,
    data
  };
  
  document.getElementById('infoNome').textContent = profissional.nome;
  document.getElementById('infoCpf').textContent = profissional.documento;
  document.getElementById('infoTipo').textContent = profissional.regime === 'funcionario' ? 'Sem Descontos' : 'PJ';
  document.getElementById('infoData').textContent = data;
  document.getElementById('valorSubtotal').textContent = `R$ ${formatarMoeda(subtotal)}`;
  document.getElementById('pis').textContent = `R$ ${formatarMoeda(pis)}`;
  document.getElementById('csll').textContent = `R$ ${formatarMoeda(csll)}`;
  document.getElementById('cofins').textContent = `R$ ${formatarMoeda(cofins)}`;
  document.getElementById('irrf').textContent = `R$ ${formatarMoeda(irrf)}`;
  document.getElementById('liquido').textContent = `R$ ${formatarMoeda(liquido)}`;
  
  document.getElementById('resultado').style.display = 'block';
  document.getElementById('semResultado').style.display = 'none';
}

function limparCalculo() {
  itens = [];
  renderizarItens();
  document.getElementById('resultado').style.display = 'none';
  document.getElementById('semResultado').style.display = 'block';
  dadosCalculo = null;
  document.getElementById('pagoHojeContainer').style.display = 'none';
}