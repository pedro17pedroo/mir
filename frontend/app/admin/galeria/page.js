'use client';

import { useState, useEffect } from 'react';
import {
  FaImages,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaUpload,
  FaStar
} from 'react-icons/fa';
import { galeria } from '@/lib/api';
import { Loading } from '@/components/common';

const CATEGORIAS = [
  'Culto',
  'Batismo',
  'Conferência',
  'Ação Social',
  'Jovens',
  'Casamento',
  'Infantil',
  'Outro'
];

export default function GaleriaAdminPage() {
  const [albuns, setAlbuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [novaFotoUrl, setNovaFotoUrl] = useState('');
  const [novaFotoLegenda, setNovaFotoLegenda] = useState('');

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    categoria: 'Culto',
    dataEvento: new Date().toISOString().split('T')[0],
    capa: '',
    fotos: [],
    destaque: false,
    ativo: true
  });

  useEffect(() => {
    loadAlbuns();
  }, []);

  const loadAlbuns = async () => {
    try {
      setLoading(true);
      const res = await galeria.getAllAdmin();
      setAlbuns(res.data || []);
    } catch (err) {
      console.error('Erro ao carregar álbuns:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingAlbum(null);
    setFormData({
      titulo: '',
      descricao: '',
      categoria: 'Culto',
      dataEvento: new Date().toISOString().split('T')[0],
      capa: '',
      fotos: [],
      destaque: false,
      ativo: true
    });
    setShowModal(true);
  };

  const handleOpenEdit = (album) => {
    setEditingAlbum(album);
    setFormData({
      titulo: album.titulo || '',
      descricao: album.descricao || '',
      categoria: album.categoria || 'Culto',
      dataEvento: album.dataEvento
        ? new Date(album.dataEvento).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      capa: album.capa || '',
      fotos: Array.isArray(album.fotos) ? album.fotos : [],
      destaque: Boolean(album.destaque),
      ativo: album.ativo !== false
    });
    setShowModal(true);
  };

  const handleUploadFoto = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    try {
      setUploading(true);
      const uploadedFotos = await Promise.all(
        files.map(
          (file) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve({ url: reader.result, legenda: '' });
              reader.onerror = reject;
              reader.readAsDataURL(file);
            })
        )
      );
      setFormData((prev) => ({
        ...prev,
        capa: prev.capa || (uploadedFotos[0]?.url || ''),
        fotos: [...prev.fotos, ...uploadedFotos]
      }));
    } catch (err) {
      alert('Erro ao carregar imagem: ' + (err.message || 'Tente novamente'));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleAddFotoManual = () => {
    if (!novaFotoUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      capa: prev.capa || novaFotoUrl.trim(),
      fotos: [...prev.fotos, { url: novaFotoUrl.trim(), legenda: novaFotoLegenda.trim() }]
    }));
    setNovaFotoUrl('');
    setNovaFotoLegenda('');
  };

  const handleRemoveFoto = (idx) => {
    setFormData((prev) => {
      const updated = prev.fotos.filter((_, i) => i !== idx);
      return {
        ...prev,
        fotos: updated,
        capa: prev.capa === prev.fotos[idx]?.url ? updated[0]?.url || '' : prev.capa
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingAlbum) {
        await galeria.update(editingAlbum._id, formData);
      } else {
        await galeria.create(formData);
      }
      setShowModal(false);
      loadAlbuns();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Erro ao guardar álbum');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja remover este álbum fotográfico?')) return;
    try {
      await galeria.delete(id);
      loadAlbuns();
    } catch (err) {
      alert('Erro ao remover álbum');
    }
  };

  if (loading) {
    return <Loading text="Carregando galeria de fotos..." />;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Galeria de Fotos & Álbuns
          </h2>
          <p className="text-gray-600 mt-1">
            Publique álbuns de cultos, batismos, conferências e ações sociais da Igreja MIR
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium shadow-sm"
        >
          <FaPlus /> Novo Álbum de Fotos
        </button>
      </div>

      {albuns.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <FaImages className="text-5xl text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            Nenhum álbum publicado
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Crie o primeiro álbum de fotos para exibir na Galeria pública da igreja.
          </p>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
          >
            <FaPlus /> Criar Álbum
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albuns.map((album) => (
            <div
              key={album._id}
              className="bg-white rounded-xl shadow overflow-hidden border border-gray-100 flex flex-col"
            >
              <div className="relative h-48 bg-gray-100">
                {album.capa || album.fotos?.[0]?.url ? (
                  <img
                    src={album.capa || album.fotos?.[0]?.url}
                    alt={album.titulo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FaImages className="text-4xl" />
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-black/70 text-white">
                    {album.categoria}
                  </span>
                  {album.destaque && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500 text-white flex items-center gap-1">
                      <FaStar /> Destaque
                    </span>
                  )}
                </div>
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md text-xs font-bold bg-black/70 text-white">
                  {album.fotos?.length || 0} foto(s)
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {album.titulo}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    {new Date(album.dataEvento || album.createdAt).toLocaleDateString('pt-AO')}
                  </p>
                  {album.descricao && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {album.descricao}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      album.ativo
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {album.ativo ? 'Visível no Site' : 'Oculto'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEdit(album)}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                      title="Editar álbum"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(album._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Excluir álbum"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Criar / Editar Álbum */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editingAlbum ? 'Editar Álbum Fotográfico' : 'Novo Álbum Fotográfico'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título do Álbum *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Ex: Batismo nas Águas - Novembro"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoria
                    </label>
                    <select
                      value={formData.categoria}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      {CATEGORIAS.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data
                    </label>
                    <input
                      type="date"
                      value={formData.dataEvento}
                      onChange={(e) =>
                        setFormData({ ...formData, dataEvento: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição Breve
                </label>
                <textarea
                  rows={2}
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Resumo do momento especial vivido pela igreja..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Upload e Adição de Fotos */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-sm font-bold text-gray-800">
                    Fotografias do Álbum ({formData.fotos.length})
                  </label>
                  <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-purple-700">
                    <FaUpload />
                    {uploading ? 'A carregar...' : 'Carregar Fotos do Computador'}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleUploadFoto}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={novaFotoUrl}
                    onChange={(e) => setNovaFotoUrl(e.target.value)}
                    placeholder="Ou cole o URL de uma imagem (https://...)"
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    value={novaFotoLegenda}
                    onChange={(e) => setNovaFotoLegenda(e.target.value)}
                    placeholder="Legenda (opcional)"
                    className="sm:w-48 px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddFotoManual}
                    className="px-3 py-1.5 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900"
                  >
                    Adicionar
                  </button>
                </div>

                {formData.fotos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 max-h-56 overflow-y-auto">
                    {formData.fotos.map((f, idx) => (
                      <div
                        key={idx}
                        className="relative group rounded-lg overflow-hidden border border-gray-200 bg-white"
                      >
                        <img
                          src={f.url}
                          alt={f.legenda || `Foto ${idx + 1}`}
                          className="w-full h-24 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFoto(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full text-xs opacity-90 hover:opacity-100"
                          title="Remover foto"
                        >
                          <FaTimes />
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, capa: f.url })}
                          className={`w-full text-[11px] py-1 font-semibold ${
                            formData.capa === f.url
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {formData.capa === f.url ? '★ Capa do Álbum' : 'Definir Capa'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.destaque}
                    onChange={(e) =>
                      setFormData({ ...formData, destaque: e.target.checked })
                    }
                    className="rounded text-purple-600"
                  />
                  Álbum em Destaque
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.ativo}
                    onChange={(e) =>
                      setFormData({ ...formData, ativo: e.target.checked })
                    }
                    className="rounded text-purple-600"
                  />
                  Visível no Site
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
                >
                  {saving ? 'A guardar...' : 'Guardar Álbum'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
