function gerarRecibo() {
  if (!dadosCalculo) {
    showToast('Calcule primeiro', 'error');
    return;
  }

  const d = dadosCalculo;

  const formaPagamentoTexto = {
    pix: 'PIX',
    dinheiro: 'Dinheiro',
    transferencia: 'Transferência'
  }[d.formaPagamento] || d.formaPagamento;

  // Data/Hora no formato da imagem (dd/mm/aaaa hh:mm)
  const agora = new Date();
  const data = agora.toLocaleDateString('pt-BR');
  const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const dataHoraFormatada = `${data} ${hora}`;

  // Aliquota proporcional (para PJ presumido)
  let aliquotaDesconto = 0;
  if (d.profissional.regime === 'pj-presumido' && d.subtotal > 0) {
    aliquotaDesconto = d.totalDescontos / d.subtotal;
  }

  // Itens válidos
  const itensValidos = d.itens.filter(item => item.descricao.trim() !== '' && item.valorTotal !== 0);

  let linhasTabela = '';
  itensValidos.forEach(item => {
    const valorBruto = item.valorTotal;
    const valorLiquido = valorBruto * (1 - aliquotaDesconto);

    linhasTabela += `
      <tr>
        <td class="col-qtd">${item.qtd}</td>
        <td class="col-item">${item.descricao}</td>
        <td class="col-valor">R$ ${formatarMoeda(valorBruto)}</td>
        <td class="col-valor col-liquido">R$ ${formatarMoeda(valorLiquido)}</td>
      </tr>
    `;
  });

  // Linha Total bruto / TOTAL (como na imagem)
  linhasTabela += `
    <tr class="linha-totais">
      <td colspan="2"></td>
      <td class="col-valor total-bruto">Total bruto: R$ ${formatarMoeda(d.subtotal)}</td>
      <td class="col-valor total-liquido">TOTAL: R$ ${formatarMoeda(d.liquido)}</td>
    </tr>
  `;

  // Linha TOTAL PAGO (última coluna)
  const pagoHoje = document.getElementById('pagoHojeCheckbox').checked;
  if (pagoHoje) {
    linhasTabela += `
      <tr class="linha-total-pago">
        <td colspan="3"></td>
        <td class="col-valor total-pago">TOTAL PAGO: R$ ${formatarMoeda(d.liquido)}</td>
      </tr>
    `;
  }

  const dia = agora.getDate().toString().padStart(2, '0');
  const mes = (agora.getMonth() + 1).toString().padStart(2, '0');
  const ano = agora.getFullYear();
  const dataPagamento = pagoHoje ? `${dia}/${mes}/${ano}` : '____/____/____';

  // Impostos em linha única (como na imagem)
  const impostosLinha =
    (d.profissional.regime === 'pj-presumido')
      ? `Impostos: PIS: R$ ${formatarMoeda(d.pis)} | CSLL: R$ ${formatarMoeda(d.csll)} | COFINS: R$ ${formatarMoeda(d.cofins)}${(d.irrf > 0 ? ` | IRRF: R$ ${formatarMoeda(d.irrf)}` : '')}`
      : '';

  const reciboHTML = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <title>Repasse Consolidado</title>
      <style>
        /* Impressão bem próxima do layout da imagem */
        @page {
          size: A4;
          margin-top: 0mm;
          margin-bottom: 0mm;
          margin-left: 5.5mm;
          margin-right: 9mm;
        }

        body {
          font-family: Arial, Helvetica, sans-serif;
          margin: 0;
          background: #fff;
          color: #000;
        }

        .recibo {
          width: 210mm;
          box-sizing: border-box;
          padding: 8mm 0 0 0;
          margin: 0 auto;
        }

        .titulo {
          text-align: center;
          font-size: 26px;
          font-weight: 500;
          margin: 0 0 8mm 0;
        }

        /* Linha fina no topo */
        .linha-topo {
          border: none;
          border-top: 1px solid #000;
          margin: 0 0 8mm 0;
        }

        .topo {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6mm;
          font-size: 12px;
          line-height: 1.45;
        }

        .topo .esq .clinica {
          font-weight: 700;
          margin-bottom: 1mm;
        }

        .topo .dir {
          text-align: right;
        }

        .pagoa {
          margin: 8mm 0 6mm 0;
          font-size: 14px;
        }
        .pagoa strong { font-weight: 700; }

        /* Tabela com bordas finas */
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }

        th, td {
          border: 1px solid #000;  /* borda fina */
          padding: 6px 8px;
          vertical-align: middle;
        }

        th {
          text-align: center;
          font-weight: 700;
        }

        .col-qtd { width: 10%; text-align: center; }
        .col-item { width: 45%; }
        .col-valor { width: 22.5%; text-align: right; white-space: nowrap; }
        .col-liquido { font-weight: 700; }

        .linha-totais td {
          font-weight: 700;
        }
        .total-bruto { font-weight: 700; }
        .total-liquido { font-weight: 700; }

        .linha-total-pago td {
          font-weight: 700;
        }
        .total-pago {
          font-weight: 700;
        }

        .impostos {
          margin-top: 4mm;
          font-size: 12px;
        }

        .validacao {
          margin: 6mm 0 4mm 0;
          text-align: center;
          font-size: 12px;
        }

        /* Rodapé: grid dinâmico conforme condição de pagamento */
        .rodape {
          display: grid;
          grid-template-columns: ${pagoHoje ? '1fr 1fr 1fr' : '1fr 2fr'};
          gap: 12mm;          /* Aumentado para 12mm */
          margin-top: 10mm;    /* Aumentado para 10mm */
          font-size: 12px;
          align-items: end;
        }

        .data-pag {
          white-space: nowrap;
          text-align: left;
        }

        .assin {
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          height: 100%;
          margin-top: 8px;
        }

        /* Linha fina nas assinaturas */
        .assin .linha {
          border-top: 1px solid #000;
          width: 60%;
          margin: 0 auto 6px auto;
        }

        .assin .label {
          font-size: 12px;
        }

        /* Classe auxiliar para ocultar elemento (se necessário) */
        .oculto {
          visibility: hidden;
        }
      </style>
    </head>

    <body>
      <div class="recibo">
        <!-- Cabeçalho com logo e título -->
        <div class="cabecalho" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8mm;">
          <div class="logo" style="width: 80px;">
            <img src="assets/mascote.png.webp" alt="Logo da Clínica" style="max-width: 100%; height: auto;">
          </div>
          <div class="titulo-container" style="flex: 1; text-align: center;">
            <div class="titulo">Repasse Consolidado</div>
          </div>
          <div class="espaco-direita" style="width: 80px;"></div>
        </div>

        <hr class="linha-topo" />

        <div class="topo">
          <div class="esq">
            <div class="clinica">Amor Saúde SP Pirituba</div>
            <div>Endereço: Avenida Doutor Felipe Pinel</div>
            <div>Bairro: Pirituba / Cidade/Estado: São Paulo/SP</div>
            <div>Data/Hora: ${dataHoraFormatada} - Pagamento: ${formaPagamentoTexto}</div>
          </div>

          <div class="dir">
            <div>Usuário: ${usuario || 'Sistema'}</div>
          </div>
        </div>

        <div class="pagoa">
          <strong>Pago a: ${d.profissional.nome}</strong> / CPF/CNPJ:
          <strong>${d.profissional.documento}</strong>
        </div>

        <table>
          <thead>
            <tr>
              <th>Qtd</th>
              <th>Item</th>
              <th>Valor Bruto</th>
              <th>Valor Líquido</th>
            </tr>
          </thead>
          <tbody>
            ${linhasTabela}
          </tbody>
        </table>

        ${impostosLinha ? `<div class="impostos">${impostosLinha}</div>` : ''}

        <div class="validacao">
          Atendimentos conferidos; ciente do pagamento por transferência conforme calendário da clínica.
        </div>

        <div class="rodape">
          <div class="data-pag"><strong>DATA DE PAGAMENTO:</strong> ${dataPagamento}</div>

          <div class="assin">
            <div class="linha"></div>
            <div class="label">Carimbo e Assinatura</div>
          </div>

          ${pagoHoje ? `
          <div class="assin">
            <div class="linha"></div>
            <div class="label">Responsável do pagamento</div>
          </div>
          ` : ''}
        </div>
      </div>
    </body>
    </html>
  `;

  const w = window.open('', '_blank');
  w.document.write(reciboHTML);
  w.document.close();
}
window.gerarRecibo = gerarRecibo;