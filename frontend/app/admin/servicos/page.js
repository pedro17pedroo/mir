'use client';

import { useState, useEffect } from 'react';
import { FaSave, FaPlus, FaTrash, FaClock, FaChurch, FaBible, FaPray, FaUsers, FaHeart, FaMusic, FaChild } from 'react-icons/fa';
import Swal from 'sweetalert2';

const iconOptions = [
  { value: 'FaChurch', label: 'Igreja', icon: FaChurch },
  { value: 'FaBible', label: 'Bíblia', icon: FaBible },
  { value: 'FaPray', label: 'Oração', icon: FaPray },
  { value: 'FaUsers', label: 'Pessoas', icon: FaUsers },
  { value: 'FaHeart', label: 'Coração', icon: FaHeart },
  { value: 'FaMusic', label: 'Música', icon: FaMusic },
  { value: 'FaChild', label: 'Criança', icon: FaChild },
  { value: 'FaClock', label: 'Relógio', icon: FaClock }
];

export default function ServicosAdminPage() {
  const [data, setData] = useState({
    titulo: 'Nossos Serviços',
    servicos: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadServicos();
  }, []);

  const loadServicos = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/servicos`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Erro ao carregar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/servicos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'Salvo!',
          text: 'Serviços atualizados com sucesso',
          confirmButtonColor: '#9333ea'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Não foi possível salvar os serviços',
        confirmButtonColor: '#9333ea'
      });
    } finally {
      setSaving(false);
    }
  };

  const addServico = () => {
    setData({
      ...data,
      servicos: [
        ...data.servicos,
        {
          titulo: '',
          descricao: '',
          horario: '',
          icone: 'FaChurch',
          cor: '#9333ea',
          exibirNaLanding: true
        }
      ]
    });
  };

  const removeServico = (index) => {
    Swal.fire({
      title: 'Remover serviço?',
      text: 'Esta ação não pode ser desfeita',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, remover',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const newServicos = data.servicos.filter((_, i) => i !== index);
        setData({ ...data, servicos: newServicos });
      }
    });
  };

  const updateServico = (index, field, value) => {
    const newServicos = [...data.servicos];
    newServicos[index][field] = value;
    setData({ ...data, servicos: newServicos });
  };

  const getIconComponent = (iconName) => {
    const option = iconOptions.find(opt => opt.value === iconName);
    return option ? option.icon : FaChurch;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Serviços</h2>
          <p className="text-gray-600 mt-1">Gerir serviços e horários da igreja</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <FaSave />
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      {/* Título da Página */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-bold mb-4">Título da Página</h3>
        <input
          type="text"
          value={data.titulo}
          onChange={(e) => setData({ ...data, titulo: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          placeholder="Ex: Nossos Serviços"
        />
      </div>

      {/* Lista de Serviços */}
      <div className="space-y-6">
        {data.servicos.map((servico, index) => {
          const IconComponent = getIconComponent(servico.icone);
          
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-900">Serviço #{index + 1}</h3>
                <button
                  onClick={() => removeServico(index)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <FaTrash />
                  Remover
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Título */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={servico.titulo}
                    onChange={(e) => updateServico(index, 'titulo', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Ex: Culto de Celebração"
                  />
                </div>

                {/* Horário */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horário
                  </label>
                  <input
                    type="text"
                    value={servico.horario}
                    onChange={(e) => updateServico(index, 'horario', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Ex: Domingos às 10h"
                  />
                </div>

                {/* Ícone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ícone
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={servico.icone}
                      onChange={(e) => updateServico(index, 'icone', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      {iconOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: servico.cor }}
                    >
                      <IconComponent className="text-2xl" />
                    </div>
                  </div>
                </div>

                {/* Cor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={servico.cor}
                      onChange={(e) => updateServico(index, 'cor', e.target.value)}
                      className="w-16 h-12 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={servico.cor}
                      onChange={(e) => updateServico(index, 'cor', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="#9333ea"
                    />
                  </div>
                </div>

                {/* Descrição */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={servico.descricao}
                    onChange={(e) => updateServico(index, 'descricao', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Descrição do serviço..."
                  />
                </div>

                {/* Exibir na Landing Page */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={servico.exibirNaLanding !== false}
                      onChange={(e) => updateServico(index, 'exibirNaLanding', e.target.checked)}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Exibir na Landing Page (Página Inicial)
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 ml-8">
                    Quando marcado, este serviço aparecerá na seção "Nossos Serviços" da página inicial
                  </p>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div 
                    className="w-16 h-16 rounded-lg flex items-center justify-center text-white mb-3"
                    style={{ backgroundColor: servico.cor }}
                  >
                    <IconComponent className="text-3xl" />
                  </div>
                  <h4 className="font-bold text-lg mb-1">{servico.titulo || 'Título do Serviço'}</h4>
                  {servico.horario && (
                    <p className="text-sm text-gray-600 mb-2">
                      <FaClock className="inline mr-1" />
                      {servico.horario}
                    </p>
                  )}
                  <p className="text-gray-600 text-sm">{servico.descricao || 'Descrição do serviço...'}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botão Adicionar */}
      <div className="mt-6">
        <button
          onClick={addServico}
          className="w-full bg-purple-600 text-white px-6 py-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 font-semibold"
        >
          <FaPlus />
          Adicionar Novo Serviço
        </button>
      </div>

      {/* Empty State */}
      {data.servicos.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FaChurch className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Nenhum serviço cadastrado
          </h3>
          <p className="text-gray-600 mb-6">
            Comece adicionando o primeiro serviço da sua igreja
          </p>
          <button
            onClick={addServico}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
          >
            <FaPlus />
            Adicionar Primeiro Serviço
          </button>
        </div>
      )}
    </div>
  );
}
