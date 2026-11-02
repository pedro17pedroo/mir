'use client';

import { useState } from 'react';
import {
  FaBoxes,
  FaPlus,
  FaEdit,
  FaTrash,
  FaDownload,
  FaTools,
  FaCheckCircle,
  FaSearch
} from 'react-icons/fa';
import { patrimonio as patrimonioApi } from '@/lib/api';
import { useCRUD, useModal, useDebounce } from '@/hooks';
import { Loading, Button, Modal, Badge, EmptyState } from '@/components/common';
import { formatCurrency } from '@/utils';

const CATEGORIAS = [
  'Som e Áudio',
  'Instrumentos Musicais',
  'Vídeo e Projeção',
  'Mobiliário',
  'Informática',
  'Climatização e Energia',
  'Viaturas',
  'Imóveis',
  'Outro'
];

const ESTADOS = ['Bom', 'Regular', 'Em Manutenção', 'Danificado'];

const INITIAL_FORM = {
  nome: '',
  codigo: '',
  categoria: 'Som e Áudio',
  quantidade: 1,
  valorUnitario: '',
  dataAquisicao: new Date().toISOString().split('T')[0],
  estado: 'Bom',
  localizacao: 'Templo Principal',
  responsavel: '',
  observacoes: ''
};

export default function PatrimonioAdminPage() {
  const { data, loading, create, update, remove } = useCRUD(patrimonioApi);
  const formModal = useModal();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const handleOpenNew = () => {
    setFormData(INITIAL_FORM);
    formModal.open(null);
  };

  const handleOpenEdit = (item) => {
    setFormData({
      nome: item.nome || '',
      codigo: item.codigo || '',
      categoria: item.categoria || 'Som e Áudio',
      quantidade: item.quantidade || 1,
      valorUnitario: item.valorUnitario || '',
      dataAquisicao: item.dataAquisicao
        ? new Date(item.dataAquisicao).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      estado: item.estado || 'Bom',
      localizacao: item.localizacao || 'Templo Principal',
      responsavel: item.responsavel || '',
      observacoes: item.observacoes || ''
    });
    formModal.open(item);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...formData,
        quantidade: Number(formData.quantidade) || 1,
        valorUnitario: Number(formData.valorUnitario) || 0
      };
      if (formModal.data?._id) {
        await update(formModal.data._id, payload);
      } else {
        await create(payload);
      }
      formModal.close();
    } catch (err) {
      alert(err.message || 'Erro ao guardar item de património');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, nome) => {
    if (!confirm(`Remover "${nome}" do inventário da igreja?`)) return;
    try {
      await remove(id);
    } catch (err) {
      alert('Erro ao remover item');
    }
  };

  const filtered = data.filter((item) => {
    if (filtroCategoria !== 'Todas' && item.categoria !== filtroCategoria) return false;
    if (filtroEstado !== 'Todos' && item.estado !== filtroEstado) return false;
    if (!debouncedSearch) return true;
    const q = debouncedSearch.toLowerCase();
    return (
      item.nome?.toLowerCase().includes(q) ||
      item.codigo?.toLowerCase().includes(q) ||
      item.localizacao?.toLowerCase().includes(q) ||
      item.responsavel?.toLowerCase().includes(q)
    );
  });

  const handleExportCSV = () => {
    if (!filtered.length) return;
    const headers = [
      'Codigo',
      'Bem/Equipamento',
      'Categoria',
      'Quantidade',
      'ValorUnitarioKz',
      'ValorTotalKz',
      'Estado',
      'Localizacao',
      'Responsavel'
    ];
    const rows = filtered.map((i) => [
      `"${(i.codigo || '').replace(/"/g, '""')}"`,
      `"${(i.nome || '').replace(/"/g, '""')}"`,
      i.categoria,
      i.quantidade || 1,
      i.valorUnitario || 0,
      (i.quantidade || 1) * (i.valorUnitario || 0),
      i.estado,
      `"${(i.localizacao || '').replace(/"/g, '""')}"`,
      `"${(i.responsavel || '').replace(/"/g, '""')}"`
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'inventario-patrimonio-mir.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalUnidades = filtered.reduce((s, i) => s + (i.quantidade || 1), 0);
  const valorPatrimonial = filtered.reduce(
    (s, i) => s + (i.quantidade || 1) * (i.valorUnitario || 0),
    0
  );
  const emManutencao = filtered.filter((i) =>
    ['Em Manutenção', 'Danificado'].includes(i.estado)
  ).length;

  if (loading && data.length === 0) {
    return <Loading text="Carregando inventário de património..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Património & Inventário de Equipamentos
          </h2>
          <p className="text-gray-600 mt-1">
            Controlo de instrumentos musicais, som, vídeo, mobiliário e bens da Igreja MIR
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            icon={<FaDownload />}
            onClick={handleExportCSV}
            disabled={!filtered.length}
          >
            Exportar CSV
          </Button>
          <Button icon={<FaPlus />} onClick={handleOpenNew}>
            Novo Equipamento / Bem
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl shadow border-l-4 border-purple-600 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">
              Total de Bens / Unidades
            </p>
            <p className="text-2xl font-bold text-purple-700 mt-1">
              {totalUnidades} unidade(s)
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {filtered.length} item(ns) catalogado(s)
            </p>
          </div>
          <FaBoxes className="text-3xl text-purple-200" />
        </div>

        <div className="bg-white p-5 rounded-xl shadow border-l-4 border-emerald-600 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">
              Valor Patrimonial Estimado
            </p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">
              {formatCurrency(valorPatrimonial)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Soma total do inventário</p>
          </div>
          <FaCheckCircle className="text-3xl text-emerald-200" />
        </div>

        <div className="bg-white p-5 rounded-xl shadow border-l-4 border-amber-500 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">
              Manutenção / Reparação
            </p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {emManutencao} item(ns)
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Equipamentos em manutenção ou danificados
            </p>
          </div>
          <FaTools className="text-3xl text-amber-200" />
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl shadow grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar equipamento, código ou responsável..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="Todas">Todas as Categorias</option>
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="Todos">Todos os Estados</option>
          {ESTADOS.map((est) => (
            <option key={est} value={est}>
              {est}
            </option>
          ))}
        </select>
      </div>

      {/* Tabela */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow">
          <EmptyState
            icon={<FaBoxes />}
            title="Nenhum item de património registado"
            description="Cadastre os equipamentos de som, instrumentos, projetores, cadeiras e viaturas da igreja."
            actionLabel="Registar Primeiro Item"
            onAction={handleOpenNew}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Bem / Equipamento
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Categoria
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Qtd.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Valor Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Localização / Resp.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="text-sm font-bold text-gray-900">{item.nome}</div>
                    {item.codigo && (
                      <div className="text-xs font-mono text-gray-500">
                        Cód: {item.codigo}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.categoria}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    {item.quantidade || 1}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-emerald-700">
                    {formatCurrency((item.quantidade || 1) * (item.valorUnitario || 0))}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    <div className="font-medium text-gray-800">{item.localizacao}</div>
                    {item.responsavel && <div>Resp: {item.responsavel}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        item.estado === 'Bom'
                          ? 'success'
                          : item.estado === 'Regular'
                          ? 'default'
                          : item.estado === 'Em Manutenção'
                          ? 'warning'
                          : 'error'
                      }
                    >
                      {item.estado}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id, item.nome)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Criar / Editar */}
      <Modal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        title={formModal.data ? 'Editar Item de Património' : 'Novo Item de Património'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Bem / Equipamento *
              </label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Mesa de Som Digital Behringer X32"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código / Série
              </label>
              <input
                type="text"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                placeholder="Ex: MIR-SOM-01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado de Conservação
              </label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {ESTADOS.map((est) => (
                  <option key={est} value={est}>
                    {est}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.quantidade}
                onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor Unitário (Kz)
              </label>
              <input
                type="number"
                min="0"
                value={formData.valorUnitario}
                onChange={(e) =>
                  setFormData({ ...formData, valorUnitario: e.target.value })
                }
                placeholder="Ex: 150000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Aquisição
              </label>
              <input
                type="date"
                value={formData.dataAquisicao}
                onChange={(e) =>
                  setFormData({ ...formData, dataAquisicao: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Localização / Sala
              </label>
              <input
                type="text"
                value={formData.localizacao}
                onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                placeholder="Ex: Altar / Sala de Som / Secretaria"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsável pelo Bem
              </label>
              <input
                type="text"
                value={formData.responsavel}
                onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                placeholder="Ex: Líder do Louvor / Multimédia"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações Técnicas
            </label>
            <textarea
              rows={2}
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Detalhes de garantia, manutenção ou acessórios..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button type="button" variant="outline" onClick={formModal.close}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              Guardar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

