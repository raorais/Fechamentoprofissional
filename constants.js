// Constantes do sistema
const TAXAS = {
  PIS: 0.0065,
  CSLL: 0.01,
  COFINS: 0.03,
  IRRF: 0.015,
  LIMITE_IRRF: 666.67
};

const CATEGORIAS = ['repasse'];
const TIPOS_REGIME = [
  { value: 'funcionario', label: 'Sem Descontos' },
  { value: 'pj-presumido', label: 'Lucro Presumido' }
];
