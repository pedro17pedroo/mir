'use client';

import { useState } from 'react';
import {
  FaPlus,
  FaUsers,
  FaChurch,
  FaHome,
  FaEdit,
  FaTrash,
  FaWhatsapp,
  FaPhone,
  FaClock,
  FaMapMarkerAlt,
  FaUserCheck,
  FaChartLine
} from 'react-icons/fa';
import { Button, Modal, Badge, EmptyState, Loading, ImageUploader } from '@/components/common';
import { useCRUD, useModal } from '@/hooks';
import { ministerios as ministeriosApi } from '@/lib/api';
import { formatCurrency } from '@/utils';

const INITIAL_FORM = {
  nome: '',
  tipo: 'ministerio',
  descricao: '',
  missao: '',
  lider: '',
  cargoLider: 'Líder',
  telefoneContato: '',
  emailContato: '',
  diaReuniao: '',
  horarioReuniao: '',
  local: '',
  bairro: '',
  imagem: '',
  cor: '#7c3aed',
  ordem: 0,
  ativo: true
};

export default function AdminMinisteriosPage() {
  const { items, loading, create, update, remove, fetchAll } = useCRUD(ministeriosApi);
  const formModal = useModal();
  const interessadosModal = useModal();
  const relatoriosModal = useModal();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [relatorioForm, setRelatorioForm] = useState({
    data: new Date().toISOString().split('T')[0],
    presentes: '',
    visitantes: '',
    decisoes: '',
    oferta: '',
    tema: '',
    observacoes: ''
  });
  const [saving, setSaving] = useState(false);
  const [filterTipo, setFilterTipo] = useState('todos');

  const filteredItems = items.filter((item) => {
    if (filterTipo === 'todos') return true;
    return item.tipo === filterTipo;
  });

  const handleOpenNew = (tipo = 'ministerio') => {
    setFormData({ ...INITIAL_FORM, tipo });
    formModal.open(null);
  };

  const handleOpenEdit = (item) => {
    setFormData({
      nome: item.nome || '',
      tipo: item.tipo || 'ministerio',
      descricao: item.descricao || '',
      missao: item.missao || '',
      lider: item.lider || '',
      cargoLider: item.cargoLider || 'Líder',
      telefoneContato: item.telefoneContato || '',
      emailContato: item.emailContato || '',
      diaReuniao: item.diaReuniao || '',
      horarioReuniao: item.horarioReuniao || '',
      local: item.local || '',
      bairro: item.bairro || '',
      imagem: item.imagem || '',
      cor: item.cor || '#7c3aed',
      ordem: item.ordem || 0,
      ativo: item.ativo !== false
    });
    formModal.open(item);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (formModal.data?._id) {
        await update(formModal.data._id, formData);
      } else {
        await create(formData);
      }
      formModal.close();
    } catch (err) {
      alert(err.message || 'Erro ao salvar ministério/célula');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, nome) => {
    if (!confirm(`Tem certeza que deseja excluir "${nome}"?`)) return;
    try {
      await remove(id);
    } catch (err) {
      alert(err.message || 'Erro ao excluir');
    }
  };

  const handleRemoveInteressado = async (ministerioId, interessadoId) => {
    if (!confirm('Remover esta inscrição da lista?')) return;
    try {
      const res = await ministeriosApi.removerInteressado(ministerioId, interessadoId);
      interessadosModal.open(res.data);
      fetchAll();
    } catch (err) {
      alert(err.message || 'Erro ao remover interessado');
    }
  };

  const handleAddRelatorio = async (e) => {
    e.preventDefault();
    if (!relatoriosModal.data?._id) return;
    try {
      setSaving(true);
      const res = await ministeriosApi.adicionarRelatorio(relatoriosModal.data._id, relatorioForm);
      relatoriosModal.open(res.data);
      setRelatorioForm({
        data: new Date().toISOString().split('T')[0],
        presentes: '',
        visitantes: '',
        decisoes: '',
        oferta: '',
        tema: '',
        observacoes: ''
      });
      fetchAll();
    } catch (err) {
      alert(err.message || 'Erro ao guardar relatório de reunião');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveRelatorio = async (ministerioId, relatorioId) => {
    if (!confirm('Excluir este relatório de reunião?')) return;
    try {
      const res = await ministeriosApi.removerRelatorio(ministerioId, relatorioId);
      relatoriosModal.open(res.data);
      fetchAll();
    } catch (err) {
      alert(err.message || 'Erro ao remover relatório');
    }
  };

  const totalMinisterios = items.filter((i) => i.tipo !== 'celula').length;
  const totalCelulas = items.filter((i) => i.tipo === 'celula').length;
  const totalInteressados = items.reduce((acc, i) => acc + (i.interessados?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ministérios e Células</h1>
          <p className="text-gray-600 mt-1">
            Gerencie os departamentos ministeriais, células caseiras e inscrições de voluntários
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" icon={FaHome} onClick={() => handleOpenNew('celula')}>
            Nova Célula
          </Button>
          <Button icon={FaPlus} onClick={() => handleOpenNew('ministerio')}>
            Novo Ministério
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Departamentos / Ministérios</p>
            <p className="text-2xl font-bold text-purple-700 mt-1">{totalMinisterios}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <FaChurch className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Células / Grupos Caseiros</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">{totalCelulas}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <FaHome className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Inscrições / Voluntários</p>
            <p className="text-2xl font-bold text-green-700 mt-1">{totalInteressados}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
            <FaUserCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        {[
          { id: 'todos', label: `Todos (${items.length})` },
          { id: 'ministerio', label: `Ministérios (${totalMinisterios})` },
          { id: 'celula', label: `Células (${totalCelulas})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterTipo(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterTipo === tab.id
                ? 'bg-purple-600 text-white shadow'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      {loading ? (
        <Loading text="Carregando ministérios e células..." />
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <EmptyState
            icon={FaUsers}
            title="Nenhum ministério ou célula cadastrado"
            description="Comece criando os departamentos da igreja (Louvor, Infantil, Jovens, Intercessão) ou grupos caseiros."
            actionLabel="Criar Primeiro"
            onAction={() => handleOpenNew('ministerio')}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div
                  className="h-2 w-full"
                  style={{ backgroundColor: item.cor || '#7c3aed' }}
                />
                <div className="p-6">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span
                        className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2 ${
                          item.tipo === 'celula'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {item.tipo === 'celula' ? 'Célula / Grupo Caseiro' : 'Ministério'}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900">{item.nome}</h3>
                    </div>
                    <Badge variant={item.ativo !== false ? 'success' : 'default'}>
                      {item.ativo !== false ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">{item.descricao}</p>

                  <div className="space-y-2 text-xs text-gray-600 border-t border-gray-100 pt-3">
                    {item.lider && (
                      <p className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">{item.cargoLider || 'Líder'}:</span>
                        <span>{item.lider}</span>
                      </p>
                    )}
                    {(item.diaReuniao || item.horarioReuniao) && (
                      <p className="flex items-center gap-2">
                        <FaClock className="text-purple-500 flex-shrink-0" />
                        <span>
                          {[item.diaReuniao, item.horarioReuniao].filter(Boolean).join(' às ')}
                        </span>
                      </p>
                    )}
                    {(item.local || item.bairro) && (
                      <p className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-purple-500 flex-shrink-0" />
                        <span>{[item.local, item.bairro].filter(Boolean).join(' - ')}</span>
                      </p>
                    )}
                    {item.telefoneContato && (
                      <p className="flex items-center gap-2">
                        <FaPhone className="text-purple-500 flex-shrink-0" />
                        <span>{item.telefoneContato}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => interessadosModal.open(item)}
                    className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                  >
                    <FaUsers className="w-3.5 h-3.5" />
                    <span>{item.interessados?.length || 0} inscrito(s)</span>
                  </button>
                  <button
                    onClick={() => relatoriosModal.open(item)}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                  >
                    <FaChartLine className="w-3.5 h-3.5" />
                    <span>{item.relatorios?.length || 0} relatório(s)</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id, item.nome)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Criar / Editar */}
      <Modal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        title={
          formModal.data
            ? `Editar ${formData.tipo === 'celula' ? 'Célula' : 'Ministério'}`
            : `Novo ${formData.tipo === 'celula' ? 'Célula / Grupo Caseiro' : 'Ministério'}`
        }
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Ministério de Louvor / Célula Betel"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="ministerio">Ministério / Departamento</option>
                <option value="celula">Célula / Grupo Caseiro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
            <textarea
              rows={3}
              required
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descreva o propósito, atividades e público-alvo..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Líder / Responsável</label>
              <input
                type="text"
                value={formData.lider}
                onChange={(e) => setFormData({ ...formData, lider: e.target.value })}
                placeholder="Ex: Pr. João / Irmã Maria"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp de Contato</label>
              <input
                type="text"
                value={formData.telefoneContato}
                onChange={(e) => setFormData({ ...formData, telefoneContato: e.target.value })}
                placeholder="Ex: +244 923 000 000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dia de Reunião / Ensaio</label>
              <input
                type="text"
                value={formData.diaReuniao}
                onChange={(e) => setFormData({ ...formData, diaReuniao: e.target.value })}
                placeholder="Ex: Quintas-feiras / Sábados"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
              <input
                type="text"
                value={formData.horarioReuniao}
                onChange={(e) => setFormData({ ...formData, horarioReuniao: e.target.value })}
                placeholder="Ex: 18h30"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Local / Endereço</label>
              <input
                type="text"
                value={formData.local}
                onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                placeholder="Ex: Templo Principal / Rua Direita nº 15"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bairro / Município</label>
              <input
                type="text"
                value={formData.bairro}
                onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                placeholder="Ex: Talatona / Morro Bento"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <ImageUploader
            label="Foto de Capa do Ministério / Célula (Opcional)"
            value={formData.imagem}
            onChange={(val) => setFormData({ ...formData, imagem: val })}
            aspectRatio="video"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cor de Destaque</label>
              <input
                type="color"
                value={formData.cor}
                onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                className="w-full h-10 p-1 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ordem de Exibição</label>
              <input
                type="number"
                value={formData.ordem}
                onChange={(e) => setFormData({ ...formData, ordem: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="pt-5">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.ativo}
                  onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500 h-4 w-4"
                />
                <span className="text-sm font-medium text-gray-700">Visível no site</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={formModal.close}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              {formModal.data ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Interessados / Voluntários */}
      <Modal
        isOpen={interessadosModal.isOpen}
        onClose={interessadosModal.close}
        title={`Inscritos em: ${interessadosModal.data?.nome || ''}`}
        size="lg"
      >
        {!interessadosModal.data?.interessados?.length ? (
          <p className="text-center text-gray-500 py-8">
            Ainda não há inscrições registradas pelo site para este grupo.
          </p>
        ) : (
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {interessadosModal.data.interessados.map((pessoa) => {
              const cleanPhone = (pessoa.telefone || '').replace(/\D/g, '');
              return (
                <div key={pessoa._id} className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-900">{pessoa.nome}</p>
                    <p className="text-xs text-gray-600">
                      Tel: {pessoa.telefone} {pessoa.email ? `• ${pessoa.email}` : ''}
                    </p>
                    {pessoa.mensagem && (
                      <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded mt-1">
                        &ldquo;{pessoa.mensagem}&rdquo;
                      </p>
                    )}
                    <p className="text-[11px] text-gray-400 mt-1">
                      Inscrito em {new Date(pessoa.data).toLocaleDateString('pt-AO')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {cleanPhone && (
                      <a
                        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                          `Olá ${pessoa.nome}, a paz do Senhor! Recebemos a sua inscrição para participar de ${interessadosModal.data.nome} na Igreja MIR.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-green-700"
                      >
                        <FaWhatsapp className="w-3.5 h-3.5" />
                        WhatsApp
                      </a>
                    )}
                    <button
                      onClick={() =>
                        handleRemoveInteressado(interessadosModal.data._id, pessoa._id)
                      }
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                      title="Remover inscrição"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal>

      {/* Modal Relatórios Semanais de Célula / Reunião */}
      <Modal
        isOpen={relatoriosModal.isOpen}
        onClose={relatoriosModal.close}
        title={`Relatórios de Reunião — ${relatoriosModal.data?.nome || ''}`}
        size="lg"
      >
        <div className="space-y-6">
          <form
            onSubmit={handleAddRelatorio}
            className="bg-purple-50/60 border border-purple-100 rounded-xl p-4 space-y-3"
          >
            <h4 className="text-sm font-bold text-purple-900">
              Registar Nova Reunião / Célula
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Data *</label>
                <input
                  type="date"
                  required
                  value={relatorioForm.data}
                  onChange={(e) => setRelatorioForm({ ...relatorioForm, data: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Presentes *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={relatorioForm.presentes}
                  onChange={(e) =>
                    setRelatorioForm({ ...relatorioForm, presentes: e.target.value })
                  }
                  placeholder="0"
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Visitantes</label>
                <input
                  type="number"
                  min="0"
                  value={relatorioForm.visitantes}
                  onChange={(e) =>
                    setRelatorioForm({ ...relatorioForm, visitantes: e.target.value })
                  }
                  placeholder="0"
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Decisões</label>
                <input
                  type="number"
                  min="0"
                  value={relatorioForm.decisoes}
                  onChange={(e) =>
                    setRelatorioForm({ ...relatorioForm, decisoes: e.target.value })
                  }
                  placeholder="0"
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Oferta (Kz)</label>
                <input
                  type="number"
                  min="0"
                  value={relatorioForm.oferta}
                  onChange={(e) => setRelatorioForm({ ...relatorioForm, oferta: e.target.value })}
                  placeholder="0"
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={relatorioForm.tema}
                onChange={(e) => setRelatorioForm({ ...relatorioForm, tema: e.target.value })}
                placeholder="Tema da palavra ministrada..."
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={relatorioForm.observacoes}
                  onChange={(e) =>
                    setRelatorioForm({ ...relatorioForm, observacoes: e.target.value })
                  }
                  placeholder="Observações / pedidos de oração..."
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700"
                >
                  Guardar
                </button>
              </div>
            </div>
          </form>

          {!relatoriosModal.data?.relatorios?.length ? (
            <p className="text-center text-gray-500 py-6 text-sm">
              Nenhum relatório de reunião registado ainda para este grupo.
            </p>
          ) : (
            <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
              {relatoriosModal.data.relatorios.map((rel) => (
                <div
                  key={rel._id}
                  className="py-3 flex items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 font-bold text-gray-900">
                      <span>{new Date(rel.data).toLocaleDateString('pt-AO')}</span>
                      {rel.tema && <span className="text-purple-700">— {rel.tema}</span>}
                    </div>
                    <div className="flex flex-wrap gap-3 text-gray-600 mt-1">
                      <span>👥 Presentes: <strong>{rel.presentes}</strong></span>
                      <span>👋 Visitantes: <strong>{rel.visitantes}</strong></span>
                      <span>✝️ Decisões: <strong>{rel.decisoes}</strong></span>
                      {rel.oferta > 0 && (
                        <span>💰 Oferta: <strong>{formatCurrency(rel.oferta)}</strong></span>
                      )}
                    </div>
                    {rel.observacoes && (
                      <p className="text-gray-500 italic mt-1">{rel.observacoes}</p>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      handleRemoveRelatorio(relatoriosModal.data._id, rel._id)
                    }
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                    title="Remover relatório"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

