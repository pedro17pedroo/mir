'use client';

import { useState } from 'react';
import {
  FaPlus,
  FaGraduationCap,
  FaUsers,
  FaEdit,
  FaTrash,
  FaWhatsapp,
  FaDownload
} from 'react-icons/fa';
import { Button, Modal, Badge, EmptyState, Loading, ImageUploader } from '@/components/common';
import { useCRUD, useModal } from '@/hooks';
import { cursos as cursosApi } from '@/lib/api';

const CATEGORIAS = {
  escola_biblica: 'Escola Bíblica Dominical',
  batismo: 'Preparação para o Batismo',
  discipulado: 'Discipulado Inicial',
  lideranca: 'Escola de Líderes / Obreiros',
  familia: 'Curso para Casais e Família'
};

const INITIAL_FORM = {
  titulo: '',
  categoria: 'escola_biblica',
  descricao: '',
  professor: '',
  horario: 'Domingos às 08h00',
  duracao: '8 aulas',
  local: 'Sala de Ensino MIR',
  imagem: '',
  materialUrl: '',
  vagas: 0,
  inscricoesAbertas: true,
  ativo: true
};

export default function AdminCursosPage() {
  const { items, loading, create, update, remove, fetchAll } = useCRUD(cursosApi);
  const formModal = useModal();
  const alunosModal = useModal();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  const handleOpenNew = () => {
    setFormData(INITIAL_FORM);
    formModal.open(null);
  };

  const handleOpenEdit = (c) => {
    setFormData({
      titulo: c.titulo || '',
      categoria: c.categoria || 'escola_biblica',
      descricao: c.descricao || '',
      professor: c.professor || '',
      horario: c.horario || '',
      duracao: c.duracao || '',
      local: c.local || '',
      imagem: c.imagem || '',
      materialUrl: c.materialUrl || '',
      vagas: c.vagas || 0,
      inscricoesAbertas: c.inscricoesAbertas !== false,
      ativo: c.ativo !== false
    });
    formModal.open(c);
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
      alert(err.message || 'Erro ao salvar curso');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoverAluno = async (cursoId, alunoId) => {
    if (!confirm('Remover aluno desta turma?')) return;
    try {
      const res = await cursosApi.removerAluno(cursoId, alunoId);
      alunosModal.open(res.data);
      fetchAll();
    } catch (err) {
      alert(err.message || 'Erro ao remover aluno');
    }
  };

  const handleExportAlunosCSV = (curso) => {
    const lista = curso?.alunos || [];
    if (!lista.length) return;
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFFNome;Telefone;Email;DataMatricula\n' +
      lista
        .map(
          (a) =>
            `"${a.nome}";"${a.telefone}";"${a.email || ''}";"${new Date(
              a.dataInscricao
            ).toLocaleDateString('pt-AO')}"`
        )
        .join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `alunos-${curso.titulo}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Escola Bíblica, Batismo e Cursos
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie as classes de discipulado, preparação para o batismo, escola de líderes e alunos matriculados
          </p>
        </div>
        <Button icon={FaPlus} onClick={handleOpenNew}>
          Nova Classe / Curso
        </Button>
      </div>

      {loading ? (
        <Loading text="Carregando cursos e classes..." />
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200">
          <EmptyState
            icon={FaGraduationCap}
            title="Nenhuma classe ou curso cadastrado"
            description="Crie turmas de Preparação para o Batismo, Discipulado ou Escola Bíblica."
            actionLabel="Criar Primeira Classe"
            onAction={handleOpenNew}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
                    {CATEGORIAS[c.categoria] || 'Escola Bíblica'}
                  </span>
                  <Badge variant={c.inscricoesAbertas ? 'success' : 'default'}>
                    {c.inscricoesAbertas ? 'Matrículas Abertas' : 'Encerrado'}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{c.titulo}</h3>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">{c.descricao}</p>

                <div className="text-xs text-gray-600 space-y-1.5 border-t border-gray-100 pt-3">
                  {c.professor && (
                    <p>
                      <strong>Professor(a):</strong> {c.professor}
                    </p>
                  )}
                  {c.horario && (
                    <p>
                      <strong>Horário:</strong> {c.horario}{' '}
                      {c.duracao ? `(${c.duracao})` : ''}
                    </p>
                  )}
                  {c.local && (
                    <p>
                      <strong>Local:</strong> {c.local}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => alunosModal.open(c)}
                  className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1.5"
                >
                  <FaUsers className="w-4 h-4" />
                  <span>
                    {c.alunos?.length || 0} aluno(s)
                    {c.vagas > 0 ? ` / ${c.vagas}` : ''}
                  </span>
                </button>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => remove(c._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Criar / Editar Curso */}
      <Modal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        title={formModal.data ? 'Editar Classe / Curso' : 'Nova Classe / Curso'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Nome do Curso / Classe *
              </label>
              <input
                type="text"
                required
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Ex: Classe de Batismo e Novos Membros"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Categoria *
              </label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                {Object.entries(CATEGORIAS).map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Descrição / Conteúdo Programático *
            </label>
            <textarea
              rows={3}
              required
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Explique o objetivo do curso e a quem se destina..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Professor(a) / Facilitador
              </label>
              <input
                type="text"
                value={formData.professor}
                onChange={(e) => setFormData({ ...formData, professor: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Dia e Horário
              </label>
              <input
                type="text"
                value={formData.horario}
                onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Duração / Carga Horária
              </label>
              <input
                type="text"
                value={formData.duracao}
                onChange={(e) => setFormData({ ...formData, duracao: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Sala / Local
              </label>
              <input
                type="text"
                value={formData.local}
                onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Limite de Vagas (0 = Livre)
              </label>
              <input
                type="number"
                min={0}
                value={formData.vagas}
                onChange={(e) => setFormData({ ...formData, vagas: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div className="pt-4">
              <label className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.inscricoesAbertas}
                  onChange={(e) =>
                    setFormData({ ...formData, inscricoesAbertas: e.target.checked })
                  }
                  className="rounded text-purple-600"
                />
                <span>Matrículas Abertas</span>
              </label>
            </div>
          </div>

          <ImageUploader
            label="Imagem de Capa do Curso / Classe (Opcional)"
            value={formData.imagem}
            onChange={(val) => setFormData({ ...formData, imagem: val })}
            aspectRatio="video"
          />

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Link da Apostila / Material em PDF (opcional)
            </label>
            <input
              type="url"
              value={formData.materialUrl}
              onChange={(e) => setFormData({ ...formData, materialUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button type="button" variant="outline" onClick={formModal.close}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              Salvar Curso
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Alunos Matriculados */}
      <Modal
        isOpen={alunosModal.isOpen}
        onClose={alunosModal.close}
        title={`Alunos Matriculados — ${alunosModal.data?.titulo || ''}`}
        size="lg"
      >
        {!alunosModal.data?.alunos?.length ? (
          <p className="text-center text-gray-500 py-8">
            Nenhum aluno matriculado nesta classe até o momento.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-purple-50 p-3 rounded-lg">
              <span className="text-sm font-semibold text-purple-900">
                Total de Alunos: {alunosModal.data.alunos.length}
              </span>
              <Button
                size="sm"
                variant="outline"
                icon={FaDownload}
                onClick={() => handleExportAlunosCSV(alunosModal.data)}
              >
                Exportar CSV
              </Button>
            </div>
            <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
              {alunosModal.data.alunos.map((a) => {
                const cleanPhone = (a.telefone || '').replace(/\D/g, '');
                return (
                  <div key={a._id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{a.nome}</p>
                      <p className="text-xs text-gray-500">
                        Tel: {a.telefone} {a.email ? `• ${a.email}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {cleanPhone && (
                        <a
                          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                            `Olá ${a.nome}, a paz do Senhor! Confirmamos a sua matrícula na classe "${alunosModal.data.titulo}" da Igreja MIR.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-green-600 text-white rounded text-xs font-medium flex items-center gap-1"
                        >
                          <FaWhatsapp /> WhatsApp
                        </a>
                      )}
                      <button
                        onClick={() =>
                          handleRemoverAluno(alunosModal.data._id, a._id)
                        }
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      >
                        <FaTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

