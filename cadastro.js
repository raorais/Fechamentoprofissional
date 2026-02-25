// ==================== FUNÇÕES DE BUSCA COM DEBOUNCE ====================
const buscarProfissionaisDebounced = debounce(function() {
  const termo = document.getElementById('buscaProfissional').value.toLowerCase().trim();
  const resultadosDiv = document.getElementById('resultadosBusca');
  
  if (termo.length < 2) {
    resultadosDiv.style.display = 'none';
    return;
  }

  const filtrados = baseProfissionais.filter(p => 
    p.nome.toLowerCase().includes(termo)
  );

  if (filtrados.length === 0) {
    resultadosDiv.style.display = 'none';
    return;
  }

  let html = '';
  filtrados.forEach(p => {
    html += `<div class="search-result-item" onclick="selecionarProfissionalBase('${p.nome}', '${p.documento}', '${p.categoria}')">
      ${p.nome} - ${p.documento}
    </div>`;
  });
  resultadosDiv.innerHTML = html;
  resultadosDiv.style.display = 'block';
}, 300);

function filtrarProfissionaisBase() {
  buscarProfissionaisDebounced();
}

function selecionarProfissionalBase(nome, documento, categoria) {
  document.getElementById('profNome').value = nome;
  document.getElementById('profCpf').value = documento;
  document.getElementById('profCategoria').value = categoria;
  document.getElementById('buscaProfissional').value = '';
  document.getElementById('resultadosBusca').style.display = 'none';
}

// ==================== FUNÇÕES DE CADASTRO ====================
function salvarCadastro() {
  const id = document.getElementById('profId').value;
  if (id) {
    editarProfissional(parseInt(id));
  } else {
    cadastrar();
  }
}

function cadastrar() {
  const nome = document.getElementById('profNome').value;
  const doc = document.getElementById('profCpf').value;
  const regime = document.getElementById('profRegime').value;
  const categoria = document.getElementById('profCategoria').value;
  
  if (!nome || !doc || !regime || !categoria) {
    showToast('Preencha todos os campos obrigatórios', 'error');
    return;
  }
  
  // Validação básica de CPF (opcional)
  if (!validarCPF(doc)) {
    showToast('CPF inválido', 'error');
    return;
  }
  
  if (profissionais.some(p => p.documento === doc)) {
    showToast('Documento já cadastrado', 'error');
    return;
  }
  
  const novoProfissional = {
    id: Date.now(),
    nome,
    documento: doc,
    regime,
    categoria,
    chavePix: document.getElementById('profChavePix').value
  };
  
  profissionais.push(novoProfissional);
  profissionais.sort((a, b) => a.nome.localeCompare(b.nome));
  localStorage.setItem('profissionais', JSON.stringify(profissionais));
  
  limparFormulario();
  atualizarListas();
  showToast('Cadastro realizado!', 'success');
}

function editarProfissional(id) {
  const profissional = profissionais.find(p => p.id === id);
  if (!profissional) return;
  
  const nome = document.getElementById('profNome').value;
  const doc = document.getElementById('profCpf').value;
  const regime = document.getElementById('profRegime').value;
  const categoria = document.getElementById('profCategoria').value;
  const chavePix = document.getElementById('profChavePix').value;
  
  if (!nome || !doc || !regime || !categoria) {
    showToast('Preencha todos os campos obrigatórios', 'error');
    return;
  }
  
  // Verifica se documento já existe em outro profissional
  if (profissionais.some(p => p.documento === doc && p.id !== id)) {
    showToast('Documento já cadastrado em outro profissional', 'error');
    return;
  }
  
  profissional.nome = nome;
  profissional.documento = doc;
  profissional.regime = regime;
  profissional.categoria = categoria;
  profissional.chavePix = chavePix;
  
  profissionais.sort((a, b) => a.nome.localeCompare(b.nome));
  localStorage.setItem('profissionais', JSON.stringify(profissionais));
  
  limparFormulario();
  atualizarListas();
  showToast('Cadastro atualizado!', 'success');
}

function preencherEdicao(id) {
  const profissional = profissionais.find(p => p.id === id);
  if (!profissional) return;
  
  document.getElementById('profId').value = profissional.id;
  document.getElementById('profNome').value = profissional.nome;
  document.getElementById('profCpf').value = profissional.documento;
  document.getElementById('profRegime').value = profissional.regime;
  document.getElementById('profCategoria').value = profissional.categoria;
  document.getElementById('profChavePix').value = profissional.chavePix || '';
}

function limparFormulario() {
  document.getElementById('profId').value = '';
  document.getElementById('profNome').value = '';
  document.getElementById('profCpf').value = '';
  document.getElementById('profRegime').value = '';
  document.getElementById('profCategoria').value = '';
  document.getElementById('profChavePix').value = '';
  document.getElementById('buscaProfissional').value = '';
  document.getElementById('resultadosBusca').style.display = 'none';
}

function atualizarListas() {
  const lista = document.getElementById('listaProfissionais');
  const select = document.getElementById('selectProfissional');
  
  if (profissionais.length === 0) {
    document.getElementById('semProfissionais').style.display = 'block';
    lista.innerHTML = '';
    select.innerHTML = '<option value="">Selecione...</option>';
    return;
  }
  
  document.getElementById('semProfissionais').style.display = 'none';
  
  let html = '<table><tr><th>Nome</th><th>Tipo</th><th>Ações</th></tr>';
  let options = '<option value="">Selecione...</option>';
  
  profissionais.forEach(p => {
    const tipo = p.regime === 'funcionario' ? 'Sem Descontos' : 'PJ';
    html += `<tr>
      <td>${p.nome}</td>
      <td><span class="badge ${p.regime}">${tipo}</span></td>
      <td>
        <button class="btn-primary btn-small" onclick="preencherEdicao(${p.id})"><i class="fas fa-edit"></i></button>
        <button class="btn-danger btn-small" onclick="excluir(${p.id})"><i class="fas fa-trash"></i></button>
      </td>
    </tr>`;
    options += `<option value="${p.id}">${p.nome} (${tipo})</option>`;
  });
  
  html += '</table>';
  lista.innerHTML = html;
  select.innerHTML = options;
}

async function excluir(id) {
  const confirmado = await confirmar('Excluir este cadastro?');
  if (confirmado) {
    profissionais = profissionais.filter(p => p.id !== id);
    localStorage.setItem('profissionais', JSON.stringify(profissionais));
    atualizarListas();
    limparFormulario();
    showToast('Cadastro excluído', 'success');
  }
}

function exportarDados() {
  const dados = JSON.stringify(profissionais, null, 2);
  const blob = new Blob([dados], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `profissionais_backup_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Dados exportados com sucesso', 'success');
}

function importarDados() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const dados = JSON.parse(event.target.result);
        if (Array.isArray(dados)) {
          profissionais = dados;
          localStorage.setItem('profissionais', JSON.stringify(profissionais));
          atualizarListas();
          showToast('Dados importados com sucesso', 'success');
        } else {
          showToast('Arquivo inválido', 'error');
        }
      } catch {
        showToast('Erro ao ler arquivo', 'error');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

// Exportar funções globais
window.filtrarProfissionaisBase = filtrarProfissionaisBase;
window.selecionarProfissionalBase = selecionarProfissionalBase;
window.salvarCadastro = salvarCadastro;
window.preencherEdicao = preencherEdicao;
window.excluir = excluir;
window.exportarDados = exportarDados;
window.importarDados = importarDados;
