'use client';

import { useState } from 'react';
import {
  FaSearch,
  FaDownload,
  FaPlus,
  FaMinus,
  FaPrint,
  FaTimes
} from 'react-icons/fa';
import { donations } from '@/lib/api';
import { useCRUD, useDebounce } from '@/hooks';
import { Loading, Button } from '@/components/common';
import { formatCurrency } from '@/utils';
import { DoacoesStats } from './DoacoesStats';
import { DoacoesTable } from './DoacoesTable';

const CATEGORIAS_DESPESA = [
  { value: 'energia_agua', label: 'Energia e Água' },
  { value: 'renda_instalacoes', label: 'Renda / Instalações' },
  { value: 'som_midia', label: 'Som, Multimédia e Internet' },
  { value: 'acao_social', label: 'Ação Social e Diaconia' },
  { value: 'manutencao', label: 'Manutenção e Limpeza' },
  { value: 'subsidios_pessoal', label: 'Subsídios / Apoio Obreiros' },
  { value: 'eventos_cultos', label: 'Logística de Cultos / Eventos' },
  { value: 'missoes', label: 'Apoio Missionário' },
  { value: 'outro', label: 'Outras Despesas' }
];

export default function DoacoesAdmin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroNatureza, setFiltroNatureza] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [modalMode, setModalMode] = useState(null); // 'entrada' | 'saida' | null
  const [showBalancete, setShowBalancete] = useState(false);
  const [saving, setSaving] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);

  const [formData, setFormData] = useState({
    valor: '',
    data: new Date().toISOString().split('T')[0],
    tipoContribuicao: 'dizimo',
    categoriaDespesa: 'energia_agua',
    beneficiario: '',
    nome: '',
    telefone: '',
    metodoPagamento: 'dinheiro',
    referenciaComprovativo: '',
    observacoes: ''
  });

  const { data, loading, fetchAll, remove } = useCRUD(donations, {
    autoLoad: true
  });

  const handleOpenModal = (mode) => {
    setModalMode(mode);
    setFormData({
      valor: '',
      data: new Date().toISOString().split('T')[0],
      tipoContribuicao: 'dizimo',
      categoriaDespesa: 'energia_agua',
      beneficiario: '',
      nome: '',
      telefone: '',
      metodoPagamento: 'dinheiro',
      referenciaComprovativo: '',
      observacoes: ''
    });
  };

  const handleSaveMovimento = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await donations.create({
        natureza: modalMode,
        valor: Number(formData.valor),
        data: formData.data,
        tipoContribuicao: formData.tipoContribuicao,
        categoriaDespesa: modalMode === 'saida' ? formData.categoriaDespesa : '',
        beneficiario: modalMode === 'saida' ? formData.beneficiario : '',
        nome: modalMode === 'entrada' ? formData.nome || 'Oferta de Culto' : formData.beneficiario,
        telefone: formData.telefone,
        metodoPagamento: formData.metodoPagamento,
        referenciaComprovativo: formData.referenciaComprovativo,
        observacoes: formData.observacoes,
        status: 'concluido'
      });
      setModalMode(null);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Erro ao registar movimento');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await donations.updateStatus(id, status);
      fetchAll();
    } catch (err) {
      alert(err.message || 'Erro ao atualizar status da doação');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente excluir este registo financeiro?')) return;
    try {
      await remove(id);
    } catch (err) {
      alert(err.message || 'Erro ao excluir registo');
    }
  };

  const filteredDoacoes = data.filter((d) => {
    const nat = d.natureza || 'entrada';
    if (filtroNatureza !== 'todos' && nat !== filtroNatureza) {
      return false;
    }
    if (filtroTipo !== 'todos' && (d.tipoContribuicao || 'dizimo') !== filtroTipo) {
      return false;
    }
    if (filtroStatus !== 'todos' && d.status !== filtroStatus) {
      return false;
    }
    if (!debouncedSearch) return true;
    const q = debouncedSearch.toLowerCase();
    return (
      d.nome?.toLowerCase().includes(q) ||
      d.beneficiario?.toLowerCase().includes(q) ||
      d.observacoes?.toLowerCase().includes(q) ||
      d.email?.toLowerCase().includes(q) ||
      d.referenciaComprovativo?.toLowerCase().includes(q)
    );
  });

  const handleExportCSV = () => {
    if (!filteredDoacoes.length) return;
    const headers = [
      'Data',
      'Movimento',
      'Contribuinte/Beneficiario',
      'Categoria',
      'Metodo',
      'Referencia',
      'ValorKz',
      'Status',
      'Observacoes'
    ];
    const rows = filteredDoacoes.map((d) => {
      const isSaida = d.natureza === 'saida';
      return [
        new Date(d.data || d.createdAt).toLocaleDateString('pt-AO'),
        isSaida ? 'SAIDA' : 'ENTRADA',
        `"${(isSaida ? d.beneficiario || 'Despesa' : d.doador?.anonimo ? 'Anônimo' : d.nome || 'Anônimo').replace(/"/g, '""')}"`,
        isSaida ? d.categoriaDespesa || 'despesa' : d.tipoContribuicao || 'dizimo',
        d.metodoPagamento || '',
        `"${(d.referenciaComprovativo || '').replace(/"/g, '""')}"`,
        isSaida ? -Math.abs(d.valor || 0) : d.valor || 0,
        d.status || 'pendente',
        `"${(d.observacoes || '').replace(/"/g, '""')}"`
      ];
    });
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'fluxo-caixa-tesouraria-mir.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && data.length === 0) {
    return <Loading text="Carregando fluxo de caixa da tesouraria..." />;
  }

  // Cálculos para o Balancete
  const confirmados = filteredDoacoes.filter((d) => d.status === 'concluido');
  const totalDizimos = confirmados
    .filter((d) => (d.natureza || 'entrada') === 'entrada' && (d.tipoContribuicao || 'dizimo') === 'dizimo')
    .reduce((s, d) => s + (d.valor || 0), 0);
  const totalOfertas = confirmados
    .filter((d) => (d.natureza || 'entrada') === 'entrada' && d.tipoContribuicao === 'oferta')
    .reduce((s, d) => s + (d.valor || 0), 0);
  const totalMissoesConstrucao = confirmados
    .filter(
      (d) =>
        (d.natureza || 'entrada') === 'entrada' &&
        ['missoes', 'construcao', 'outro'].includes(d.tipoContribuicao)
    )
    .reduce((s, d) => s + (d.valor || 0), 0);
  const totalEntradas = totalDizimos + totalOfertas + totalMissoesConstrucao;
  const totalSaidas = filteredDoacoes
    .filter((d) => d.natureza === 'saida' && d.status !== 'falhou')
    .reduce((s, d) => s + (d.valor || 0), 0);

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Tesouraria & Fluxo de Caixa
          </h2>
          <p className="text-gray-600 mt-1">
            Gestão de dízimos, ofertas, despesas operacionais e balancete financeiro da Igreja MIR
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleOpenModal('entrada')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm shadow-sm"
          >
            <FaPlus /> Registar Entrada
          </button>
          <button
            onClick={() => handleOpenModal('saida')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm shadow-sm"
          >
            <FaMinus /> Registar Despesa
          </button>
          <button
            onClick={() => setShowBalancete(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm shadow-sm"
          >
            <FaPrint /> Balancete
          </button>
          <Button
            variant="outline"
            icon={<FaDownload />}
            onClick={handleExportCSV}
            disabled={!filteredDoacoes.length}
          >
            CSV
          </Button>
        </div>
      </div>

      <DoacoesStats doacoes={filteredDoacoes} />

      <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar nome, beneficiário ou ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
          />
        </div>

        <select
          value={filtroNatureza}
          onChange={(e) => setFiltroNatureza(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="todos">Entradas e Saídas</option>
          <option value="entrada">Apenas Entradas (+)</option>
          <option value="saida">Apenas Despesas / Saídas (-)</option>
        </select>

        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="todos">Todas as Finalidades</option>
          <option value="dizimo">Dízimos</option>
          <option value="oferta">Ofertas Gerais</option>
          <option value="missoes">Missões</option>
          <option value="construcao">Obras / Construção</option>
        </select>

        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="todos">Todos os Status</option>
          <option value="pendente">Pendentes de Confirmação</option>
          <option value="concluido">Confirmados</option>
          <option value="falhou">Cancelados</option>
        </select>
      </div>

      <DoacoesTable
        doacoes={filteredDoacoes}
        loading={loading}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDelete}
      />

      {/* Modal de Registo de Entrada ou Despesa */}
      {modalMode && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {modalMode === 'saida'
                  ? 'Registar Despesa / Saída de Caixa'
                  : 'Registar Entrada Manual (Culto / Tesouraria)'}
              </h3>
              <button
                onClick={() => setModalMode(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSaveMovimento} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor (Kz) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    placeholder="Ex: 25000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data do Movimento *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {modalMode === 'entrada' ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Finalidade *
                      </label>
                      <select
                        value={formData.tipoContribuicao}
                        onChange={(e) =>
                          setFormData({ ...formData, tipoContribuicao: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="dizimo">Dízimo</option>
                        <option value="oferta">Oferta de Culto</option>
                        <option value="missoes">Missões</option>
                        <option value="construcao">Obras / Construção</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contribuinte / Culto *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        placeholder="Nome do irmão ou 'Oferta Culto Domingo'"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoria da Despesa *
                      </label>
                      <select
                        value={formData.categoriaDespesa}
                        onChange={(e) =>
                          setFormData({ ...formData, categoriaDespesa: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        {CATEGORIAS_DESPESA.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fornecedor / Beneficiário *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.beneficiario}
                        onChange={(e) =>
                          setFormData({ ...formData, beneficiario: e.target.value })
                        }
                        placeholder="Ex: ENDE, EPAL, Loja de Som..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Método de Pagamento
                  </label>
                  <select
                    value={formData.metodoPagamento}
                    onChange={(e) =>
                      setFormData({ ...formData, metodoPagamento: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="dinheiro">Numerário (Dinheiro)</option>
                    <option value="transferencia">Transferência Bancária (IBAN)</option>
                    <option value="multicaixa">Multicaixa Express / TPA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nº Fatura / Comprovativo
                  </label>
                  <input
                    type="text"
                    value={formData.referenciaComprovativo}
                    onChange={(e) =>
                      setFormData({ ...formData, referenciaComprovativo: e.target.value })
                    }
                    placeholder="Opcional"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações / Descrição
                </label>
                <textarea
                  rows={2}
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Detalhes adicionais sobre este lançamento..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={`px-5 py-2 rounded-lg text-white font-semibold ${
                    modalMode === 'saida'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {saving ? 'A guardar...' : 'Guardar Lançamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Balancete Financeiro Imprimível */}
      {showBalancete && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b pb-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-purple-900">
                  IGREJA MIR — BALANCETE DA TESOURARIA
                </h3>
                <p className="text-sm text-gray-500">
                  Emitido em {new Date().toLocaleDateString('pt-AO')}
                </p>
              </div>
              <div className="flex gap-2 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
                >
                  <FaPrint /> Imprimir
                </button>
                <button
                  onClick={() => setShowBalancete(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-green-700 uppercase tracking-wider mb-2">
                  1. Resumo de Entradas Confirmadas
                </h4>
                <div className="bg-green-50/60 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Dízimos</span>
                    <span className="font-semibold">{formatCurrency(totalDizimos)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ofertas Gerais de Cultos</span>
                    <span className="font-semibold">{formatCurrency(totalOfertas)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Missões, Construção e Outras</span>
                    <span className="font-semibold">
                      {formatCurrency(totalMissoesConstrucao)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-green-200 pt-2 font-bold text-green-800 text-base">
                    <span>Total de Entradas</span>
                    <span>{formatCurrency(totalEntradas)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-red-700 uppercase tracking-wider mb-2">
                  2. Resumo de Despesas / Saídas
                </h4>
                <div className="bg-red-50/60 rounded-xl p-4 space-y-2 text-sm">
                  {CATEGORIAS_DESPESA.map((cat) => {
                    const subtotal = filteredDoacoes
                      .filter(
                        (d) =>
                          d.natureza === 'saida' &&
                          d.status !== 'falhou' &&
                          d.categoriaDespesa === cat.value
                      )
                      .reduce((s, d) => s + (d.valor || 0), 0);
                    if (subtotal === 0) return null;
                    return (
                      <div key={cat.value} className="flex justify-between">
                        <span>{cat.label}</span>
                        <span className="font-semibold">{formatCurrency(subtotal)}</span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between border-t border-red-200 pt-2 font-bold text-red-800 text-base">
                    <span>Total de Despesas</span>
                    <span>{formatCurrency(totalSaidas)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-900 text-white rounded-xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-purple-200">
                    Saldo Líquido do Período
                  </p>
                  <p className="text-sm text-purple-100">Total Entradas − Total Despesas</p>
                </div>
                <p className="text-2xl font-extrabold">
                  {formatCurrency(totalEntradas - totalSaidas)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-8 text-center text-xs text-gray-500">
                <div className="border-t border-gray-300 pt-2">
                  Responsável da Tesouraria
                </div>
                <div className="border-t border-gray-300 pt-2">
                  Pastor Presidente / Direção
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
