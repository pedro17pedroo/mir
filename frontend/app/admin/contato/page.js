'use client';

import { useState, useEffect } from 'react';
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('@/components/MapPicker'), { ssr: false });

export default function ContatoAdminPage() {
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact/info`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setContactInfo(data);
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact/info`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(contactInfo)
      });

      if (response.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'Salvo!',
          text: 'Informações atualizadas com sucesso',
          confirmButtonColor: '#9333ea'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Não foi possível salvar as informações',
        confirmButtonColor: '#9333ea'
      });
    } finally {
      setSaving(false);
    }
  };

  const addTelefone = () => {
    setContactInfo({
      ...contactInfo,
      telefones: [...(contactInfo.telefones || []), { tipo: 'principal', numero: '' }]
    });
  };

  const removeTelefone = (index) => {
    const newTelefones = contactInfo.telefones.filter((_, i) => i !== index);
    setContactInfo({ ...contactInfo, telefones: newTelefones });
  };

  const addEmail = () => {
    setContactInfo({
      ...contactInfo,
      emails: [...(contactInfo.emails || []), { tipo: 'geral', email: '' }]
    });
  };

  const removeEmail = (index) => {
    const newEmails = contactInfo.emails.filter((_, i) => i !== index);
    setContactInfo({ ...contactInfo, emails: newEmails });
  };

  const addHorario = () => {
    setContactInfo({
      ...contactInfo,
      horariosFuncionamento: [...(contactInfo.horariosFuncionamento || []), { dia: '', horario: '' }]
    });
  };

  const removeHorario = (index) => {
    const newHorarios = contactInfo.horariosFuncionamento.filter((_, i) => i !== index);
    setContactInfo({ ...contactInfo, horariosFuncionamento: newHorarios });
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
          <h2 className="text-2xl font-bold text-gray-900">Informações de Contato</h2>
          <p className="text-gray-600 mt-1">Gerir informações da página de contato</p>
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

      <div className="space-y-6">
        {/* Mensagem de Boas-Vindas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">Mensagem de Boas-Vindas</h3>
          <textarea
            value={contactInfo?.mensagemBemVindo || ''}
            onChange={(e) => setContactInfo({ ...contactInfo, mensagemBemVindo: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Mensagem que aparece no topo da página"
          />
        </div>

        {/* Endereço */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">Endereço</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rua</label>
              <input
                type="text"
                value={contactInfo?.endereco?.rua || ''}
                onChange={(e) => setContactInfo({
                  ...contactInfo,
                  endereco: { ...contactInfo.endereco, rua: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
              <input
                type="text"
                value={contactInfo?.endereco?.cidade || ''}
                onChange={(e) => setContactInfo({
                  ...contactInfo,
                  endereco: { ...contactInfo.endereco, cidade: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <input
                type="text"
                value={contactInfo?.endereco?.estado || ''}
                onChange={(e) => setContactInfo({
                  ...contactInfo,
                  endereco: { ...contactInfo.endereco, estado: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
              <input
                type="text"
                value={contactInfo?.endereco?.cep || ''}
                onChange={(e) => setContactInfo({
                  ...contactInfo,
                  endereco: { ...contactInfo.endereco, cep: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Localização no Mapa */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">Localização no Mapa</h3>
          <div style={{ height: '400px' }}>
            <MapPicker
              value={contactInfo?.localizacao}
              onChange={(location) => {
                setContactInfo({
                  ...contactInfo,
                  localizacao: location
                });
              }}
            />
          </div>
        </div>

        {/* Telefones */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Telefones</h3>
            <button
              onClick={addTelefone}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <FaPlus /> Adicionar
            </button>
          </div>
          <div className="space-y-3">
            {contactInfo?.telefones?.map((tel, index) => (
              <div key={index} className="flex gap-3">
                <select
                  value={tel.tipo}
                  onChange={(e) => {
                    const newTelefones = [...contactInfo.telefones];
                    newTelefones[index].tipo = e.target.value;
                    setContactInfo({ ...contactInfo, telefones: newTelefones });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="principal">Principal</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="secretaria">Secretaria</option>
                </select>
                <input
                  type="text"
                  value={tel.numero}
                  onChange={(e) => {
                    const newTelefones = [...contactInfo.telefones];
                    newTelefones[index].numero = e.target.value;
                    setContactInfo({ ...contactInfo, telefones: newTelefones });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="(00) 00000-0000"
                />
                <button
                  onClick={() => removeTelefone(index)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Emails */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">E-mails</h3>
            <button
              onClick={addEmail}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <FaPlus /> Adicionar
            </button>
          </div>
          <div className="space-y-3">
            {contactInfo?.emails?.map((email, index) => (
              <div key={index} className="flex gap-3">
                <select
                  value={email.tipo}
                  onChange={(e) => {
                    const newEmails = [...contactInfo.emails];
                    newEmails[index].tipo = e.target.value;
                    setContactInfo({ ...contactInfo, emails: newEmails });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="geral">Geral</option>
                  <option value="pastoral">Pastoral</option>
                  <option value="secretaria">Secretaria</option>
                </select>
                <input
                  type="email"
                  value={email.email}
                  onChange={(e) => {
                    const newEmails = [...contactInfo.emails];
                    newEmails[index].email = e.target.value;
                    setContactInfo({ ...contactInfo, emails: newEmails });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="email@exemplo.com"
                />
                <button
                  onClick={() => removeEmail(index)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Horários */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Horários de Funcionamento</h3>
            <button
              onClick={addHorario}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <FaPlus /> Adicionar
            </button>
          </div>
          <div className="space-y-3">
            {contactInfo?.horariosFuncionamento?.map((horario, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={horario.dia}
                  onChange={(e) => {
                    const newHorarios = [...contactInfo.horariosFuncionamento];
                    newHorarios[index].dia = e.target.value;
                    setContactInfo({ ...contactInfo, horariosFuncionamento: newHorarios });
                  }}
                  className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Dia da semana"
                />
                <input
                  type="text"
                  value={horario.horario}
                  onChange={(e) => {
                    const newHorarios = [...contactInfo.horariosFuncionamento];
                    newHorarios[index].horario = e.target.value;
                    setContactInfo({ ...contactInfo, horariosFuncionamento: newHorarios });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Horário"
                />
                <button
                  onClick={() => removeHorario(index)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Redes Sociais */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">Redes Sociais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
              <input
                type="url"
                value={contactInfo?.redesSociais?.facebook || ''}
                onChange={(e) => setContactInfo({
                  ...contactInfo,
                  redesSociais: { ...contactInfo.redesSociais, facebook: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
              <input
                type="url"
                value={contactInfo?.redesSociais?.instagram || ''}
                onChange={(e) => setContactInfo({
                  ...contactInfo,
                  redesSociais: { ...contactInfo.redesSociais, instagram: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">YouTube</label>
              <input
                type="url"
                value={contactInfo?.redesSociais?.youtube || ''}
                onChange={(e) => setContactInfo({
                  ...contactInfo,
                  redesSociais: { ...contactInfo.redesSociais, youtube: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="https://youtube.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
              <input
                type="url"
                value={contactInfo?.redesSociais?.twitter || ''}
                onChange={(e) => setContactInfo({
                  ...contactInfo,
                  redesSociais: { ...contactInfo.redesSociais, twitter: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="https://twitter.com/..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
