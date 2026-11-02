'use client';

import { useState } from 'react';
import {
  FaPlus,
  FaSearch,
  FaDownload,
  FaBirthdayCake,
  FaPrint,
  FaIdCard,
  FaAward
} from 'react-icons/fa';
import api from '@/lib/api';
import { useCRUD, useModal, useDebounce } from '@/hooks';
import { Button, Loading, Modal } from '@/components/common';
import { MembrosTable } from './MembrosTable';
import { MembroForm } from './MembroForm';

export default function MembrosAdmin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroMinisterio, setFiltroMinisterio] = useState('todos');
  const [apenasAniversariantes, setApenasAniversariantes] = useState(false);
  const [tipoDoc, setTipoDoc] = useState('cartao'); // 'cartao' | 'batismo'
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data, loading, create, update, remove } = useCRUD(
    {
      getAll: () => api.get('/members'),
      create: (payload) => api.post('/members', payload),
      update: (id, payload) => api.put(`/members/${id}`, payload),
      delete: (id) => api.delete(`/members/${id}`)
    },
    {
      successMessages: {
        create: 'Membro criado com sucesso!',
        update: 'Membro atualizado com sucesso!',
        delete: 'Membro excluído com sucesso!'
      }
    }
  );

  const { isOpen, open, close, editingItem } = useModal();
  const docModal = useModal();

  const handleSubmit = async (idOrData, dataIfUpdate) => {
    if (dataIfUpdate) {
      await update(idOrData, dataIfUpdate);
    } else {
      await create(idOrData);
    }
  };

  const mesAtual = new Date().getMonth();

  const ministeriosUnicos = Array.from(
    new Set(data.map((m) => m.ministerio).filter(Boolean))
  );

  const filteredMembros = data.filter((m) => {
    if (filtroStatus === 'ativos' && m.ativo === false) return false;
    if (filtroStatus === 'inativos' && m.ativo !== false) return false;
    if (filtroStatus === 'batizados' && !m.batizado && !m.dataBatismo) return false;
    if (filtroMinisterio !== 'todos' && m.ministerio !== filtroMinisterio) return false;

    if (apenasAniversariantes) {
      if (!m.dataNascimento) return false;
      const d = new Date(m.dataNascimento);
      if (Number.isNaN(d.getTime()) || d.getUTCMonth() !== mesAtual) return false;
    }

    if (!debouncedSearch) return true;
    const q = debouncedSearch.toLowerCase();
    return (
      m.nome?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.telefone?.toLowerCase().includes(q) ||
      m.ministerio?.toLowerCase().includes(q)
    );
  });

  const handleExportCSV = () => {
    if (!filteredMembros.length) return;
    const headers = ['Nome', 'Telefone', 'Email', 'Ministerio', 'Cargo', 'DataNascimento', 'Status'];
    const rows = filteredMembros.map((m) => [
      `"${(m.nome || '').replace(/"/g, '""')}"`,
      `"${(m.telefone || '').replace(/"/g, '""')}"`,
      `"${(m.email || '').replace(/"/g, '""')}"`,
      `"${(m.ministerio || '').replace(/"/g, '""')}"`,
      `"${(m.cargo || '').replace(/"/g, '""')}"`,
      m.dataNascimento ? new Date(m.dataNascimento).toISOString().split('T')[0] : '',
      m.ativo !== false ? 'Ativo' : 'Inativo'
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'membros-igreja-mir.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalAniversariantesMes = data.filter((m) => {
    if (!m.dataNascimento) return false;
    const d = new Date(m.dataNascimento);
    return !Number.isNaN(d.getTime()) && d.getUTCMonth() === mesAtual;
  }).length;

  if (loading && data.length === 0) {
    return <Loading text="Carregando membros..." />;
  }

  const membroDoc = docModal.data;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Membros</h2>
          <p className="text-gray-600 mt-1">
            Cadastre membros, emita cartões/certificados de batismo e acompanhe aniversariantes
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            icon={<FaDownload />}
            onClick={handleExportCSV}
            disabled={!filteredMembros.length}
          >
            Exportar CSV
          </Button>
          <Button variant="primary" icon={<FaPlus />} onClick={() => open()}>
            Novo Membro
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, telefone ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>

        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="todos">Todos os Membros ({data.length})</option>
          <option value="ativos">Membros Ativos</option>
          <option value="inativos">Membros Inativos</option>
          <option value="batizados">Membros Batizados</option>
        </select>

        <select
          value={filtroMinisterio}
          onChange={(e) => setFiltroMinisterio(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="todos">Todos os Ministérios</option>
          {ministeriosUnicos.map((min) => (
            <option key={min} value={min}>
              {min}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setApenasAniversariantes(!apenasAniversariantes)}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
            apenasAniversariantes
              ? 'bg-pink-600 text-white border-pink-600'
              : 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100'
          }`}
        >
          <FaBirthdayCake />
          <span>Aniversariantes do Mês ({totalAniversariantesMes})</span>
        </button>
      </div>

      <MembrosTable
        membros={filteredMembros}
        loading={loading}
        onEdit={(item) => open(item)}
        onDelete={remove}
        onPrintDoc={(item) => {
          setTipoDoc('cartao');
          docModal.open(item);
        }}
      />

      <Modal
        isOpen={isOpen}
        onClose={close}
        title={editingItem ? 'Editar Membro' : 'Novo Membro'}
        size="lg"
      >
        <MembroForm
          membro={editingItem}
          onSubmit={handleSubmit}
          onCancel={close}
        />
      </Modal>

      {/* Modal Emissão de Cartão de Membro / Certificado de Batismo */}
      <Modal
        isOpen={docModal.isOpen}
        onClose={docModal.close}
        title="Emissão de Documento Eclesiástico"
        size="lg"
      >
        {membroDoc && (
          <div className="space-y-6">
            <div className="flex gap-2 justify-center print:hidden">
              <button
                type="button"
                onClick={() => setTipoDoc('cartao')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold ${
                  tipoDoc === 'cartao'
                    ? 'bg-purple-700 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <FaIdCard /> Cartão de Membro
              </button>
              <button
                type="button"
                onClick={() => setTipoDoc('batismo')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold ${
                  tipoDoc === 'batismo'
                    ? 'bg-purple-700 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <FaAward /> Certificado de Batismo
              </button>
            </div>

            {tipoDoc === 'cartao' ? (
              /* Cartão Oficial de Membro */
              <div
                id="cartao-membro-oficial"
                className="max-w-md mx-auto bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-amber-400/80 relative overflow-hidden"
              >
                {/* Efeito decorativo dourado */}
                <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-amber-400/15 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-purple-500/10 blur-xl pointer-events-none" />

                <div className="flex items-start justify-between border-b border-white/20 pb-4 mb-4 relative z-10">
                  <div>
                    <span className="inline-block text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-400/15 px-2.5 py-0.5 rounded-full border border-amber-400/30 mb-1">
                      Credencial Oficial de Membro
                    </span>
                    <h3 className="text-2xl font-black tracking-tight text-white">IGREJA MIR</h3>
                    <p className="text-[11px] text-purple-200">Ministério Internacional da Restauração</p>
                  </div>
                  {membroDoc.foto ? (
                    <div className="w-16 h-20 rounded-xl overflow-hidden border-2 border-amber-400 shadow-lg bg-gray-900 flex-shrink-0">
                      <img
                        src={membroDoc.foto}
                        alt={membroDoc.nome}
                        style={{ objectPosition: membroDoc.posicaoFoto || 'center' }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-20 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-purple-950 font-black flex items-center justify-center text-2xl shadow-lg border-2 border-amber-300 flex-shrink-0">
                      {membroDoc.nome?.charAt(0)?.toUpperCase() || 'M'}
                    </div>
                  )}
                </div>

                <div className="space-y-3 text-sm relative z-10">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-200 block tracking-wider">
                      Nome do Membro
                    </span>
                    <span className="font-extrabold text-base text-white">{membroDoc.nome}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl border border-white/10">
                      <span className="text-[10px] uppercase font-bold text-purple-200 block tracking-wider">
                        Cargo / Função
                      </span>
                      <span className="font-bold text-amber-300 text-xs sm:text-sm">
                        {membroDoc.cargo || 'Membro Efetivo'}
                      </span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl border border-white/10">
                      <span className="text-[10px] uppercase font-bold text-purple-200 block tracking-wider">
                        Ministério
                      </span>
                      <span className="font-bold text-white text-xs sm:text-sm truncate block">
                        {membroDoc.ministerio || 'Comunhão Geral'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-purple-200 block">
                        Data de Batismo
                      </span>
                      <span className="font-medium text-xs text-gray-200">
                        {membroDoc.dataBatismo
                          ? new Date(membroDoc.dataBatismo).toLocaleDateString('pt-AO')
                          : 'Membro Batizado'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-purple-200 block">
                        Nº de Registo Eclesiástico
                      </span>
                      <span className="font-mono text-xs font-bold text-amber-300">
                        MIR-MBR-{String(membroDoc._id).slice(-6).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/15 flex items-center justify-between text-[10px] text-purple-200">
                    <span>Luanda, Angola</span>
                    <span className="font-semibold text-emerald-400">● Membro Regular</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Certificado de Batismo */
              <div className="bg-amber-50/40 border-4 border-double border-amber-600 rounded-xl p-8 text-center space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-purple-800">
                  Igreja MIR — Comunidade de Fé, Amor e Esperança
                </p>
                <h3 className="text-3xl font-serif font-extrabold text-gray-900">
                  Certificado de Batismo
                </h3>
                <p className="text-sm text-gray-700 max-w-lg mx-auto leading-relaxed">
                  Certificamos que{' '}
                  <strong className="text-lg text-purple-900 underline">
                    {membroDoc.nome}
                  </strong>{' '}
                  foi batizado(a) nas águas em nome do Pai, do Filho e do Espírito Santo, conforme o mandamento do Senhor Jesus Cristo em Mateus 28:19.
                </p>
                <p className="text-xs italic text-gray-600">
                  &ldquo;Portanto, se alguém está em Cristo, é nova criatura; as coisas velhas já passaram; eis que tudo se fez novo.&rdquo; — 2 Coríntios 5:17
                </p>
                <div className="pt-6 grid grid-cols-2 gap-8 max-w-md mx-auto text-xs text-gray-700">
                  <div className="border-t border-gray-400 pt-1">
                    Data:{' '}
                    {membroDoc.dataBatismo
                      ? new Date(membroDoc.dataBatismo).toLocaleDateString('pt-AO')
                      : new Date().toLocaleDateString('pt-AO')}
                  </div>
                  <div className="border-t border-gray-400 pt-1">
                    Pastor Oficiante — Igreja MIR
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t print:hidden">
              <Button variant="outline" onClick={docModal.close}>
                Fechar
              </Button>
              <Button icon={<FaPrint />} onClick={() => window.print()}>
                Imprimir / Salvar PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
