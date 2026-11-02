'use client';

import { useState, useEffect } from 'react';
import { FaSave, FaMapMarkerAlt } from 'react-icons/fa';
import { Button, ImageUploader } from '@/components/common';
import MapPicker from '@/components/MapPicker';

export const EventoForm = ({ evento, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    dataInicio: '',
    dataFim: '',
    horarioInicio: '',
    horarioFim: '',
    local: '',
    localizacao: {
      latitude: null,
      longitude: null,
      endereco: ''
    },
    organizador: '',
    capacidade: 0,
    preco: 0,
    inscricaoAberta: true,
    imagem: '',
    destaque: false,
    status: 'ativo'
  });

  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (evento) {
      const dataInicioFormatada = evento.dataInicio
        ? new Date(evento.dataInicio).toISOString().split('T')[0]
        : '';
      const dataFimFormatada = evento.dataFim
        ? new Date(evento.dataFim).toISOString().split('T')[0]
        : '';

      setFormData({
        titulo: evento.titulo || '',
        descricao: evento.descricao || '',
        dataInicio: dataInicioFormatada,
        dataFim: dataFimFormatada,
        horarioInicio: evento.horarioInicio || '',
        horarioFim: evento.horarioFim || '',
        local: evento.local || '',
        localizacao: evento.localizacao || {
          latitude: null,
          longitude: null,
          endereco: ''
        },
        organizador: evento.organizador || '',
        capacidade: evento.capacidade || 0,
        preco: evento.preco || 0,
        inscricaoAberta: evento.inscricaoAberta !== false,
        imagem: evento.imagem || '',
        destaque: evento.destaque ?? false,
        status: evento.status || 'ativo'
      });

      if (evento.localizacao?.latitude && evento.localizacao?.longitude) {
        setShowMap(true);
      }
    }
  }, [evento]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (evento) {
        await onSubmit(evento._id, formData);
      } else {
        await onSubmit(formData);
      }
      onCancel();
    } catch (error) {
      // Erro já tratado pelo useCRUD
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Título *
        </label>
        <input
          type="text"
          required
          value={formData.titulo}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Nome do evento"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          rows={3}
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Descrição do evento"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data Início *
          </label>
          <input
            type="date"
            required
            value={formData.dataInicio}
            onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data Fim
          </label>
          <input
            type="date"
            value={formData.dataFim}
            onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Horário Início
          </label>
          <input
            type="time"
            value={formData.horarioInicio}
            onChange={(e) => setFormData({ ...formData, horarioInicio: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Horário Fim
          </label>
          <input
            type="time"
            value={formData.horarioFim}
            onChange={(e) => setFormData({ ...formData, horarioFim: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Local
          </label>
          <input
            type="text"
            value={formData.local}
            onChange={(e) => setFormData({ ...formData, local: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Nome do local (ex: Igreja MIR - Sede Central)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organizador
          </label>
          <input
            type="text"
            value={formData.organizador}
            onChange={(e) => setFormData({ ...formData, organizador: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Nome do organizador / ministério"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-purple-50/60 p-4 rounded-xl border border-purple-100">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Capacidade Máx. (0 = Ilimitado)
          </label>
          <input
            type="number"
            min={0}
            value={formData.capacidade}
            onChange={(e) => setFormData({ ...formData, capacidade: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Taxa / Valor em Kz (0 = Grátis)
          </label>
          <input
            type="number"
            min={0}
            value={formData.preco}
            onChange={(e) => setFormData({ ...formData, preco: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          />
        </div>
        <div className="flex items-center pt-5">
          <input
            type="checkbox"
            checked={formData.inscricaoAberta}
            onChange={(e) => setFormData({ ...formData, inscricaoAberta: e.target.checked })}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-xs font-semibold text-gray-900">
            Inscrições Online Abertas
          </label>
        </div>
      </div>

      {/* Localização no Mapa */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            <FaMapMarkerAlt className="inline mr-2 text-purple-600" />
            Localização no Mapa
          </label>
          <button
            type="button"
            onClick={() => setShowMap(!showMap)}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            {showMap ? 'Ocultar Mapa' : 'Adicionar Localização'}
          </button>
        </div>

        {showMap && (
          <MapPicker
            value={formData.localizacao}
            onChange={(localizacao) => setFormData({ ...formData, localizacao })}
          />
        )}
      </div>

      <ImageUploader
        label="Imagem / Cartaz do Evento"
        value={formData.imagem}
        onChange={(val) => setFormData({ ...formData, imagem: val })}
        aspectRatio="video"
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.destaque}
            onChange={(e) => setFormData({ ...formData, destaque: e.target.checked })}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Evento em Destaque
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          icon={<FaSave />}
          loading={loading}
        >
          {evento ? 'Atualizar' : 'Criar'} Evento
        </Button>
      </div>
    </form>
  );
};
