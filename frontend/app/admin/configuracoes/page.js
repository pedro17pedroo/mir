'use client';

import { useState, useEffect } from 'react';
import { FaSave, FaDatabase, FaDownload } from 'react-icons/fa';
import { Button, Loading } from '@/components/common';
import { contact, theme, backup } from '@/lib/api';
import useSiteStore from '@/store/useSiteStore';
import Swal from 'sweetalert2';

export default function ConfiguracoesAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [contactDoc, setContactDoc] = useState(null);
  const [themeDoc, setThemeDoc] = useState(null);
  const loadContactInfo = useSiteStore(state => state.loadContactInfo);
  const loadTheme = useSiteStore(state => state.loadTheme);

  const [formData, setFormData] = useState({
    nomeIgreja: 'Igreja MIR',
    email: 'contato@igrejamir.com',
    telefone: '(+244) 900 000 000',
    endereco: 'Luanda, Angola',
    facebook: '',
    instagram: '',
    youtube: '',
    whatsapp: ''
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const [contactRes, themeRes] = await Promise.allSettled([
          contact.getInfo(),
          theme.get()
        ]);

        const cData = contactRes.status === 'fulfilled' ? contactRes.value.data : null;
        const tData = themeRes.status === 'fulfilled' ? themeRes.value.data : null;

        setContactDoc(cData);
        setThemeDoc(tData);

        const end = cData?.endereco;
        const enderecoStr = end
          ? [end.rua, end.bairro, end.cidade, end.estado, end.pais].filter(Boolean).join(', ')
          : 'Luanda, Angola';

        setFormData({
          nomeIgreja: tData?.nomeIgreja || 'Igreja MIR',
          email: cData?.emails?.[0]?.email || 'contato@igrejamir.com',
          telefone: cData?.telefones?.[0]?.numero || '(+244) 900 000 000',
          endereco: enderecoStr,
          facebook: cData?.redesSociais?.facebook || '',
          instagram: cData?.redesSociais?.instagram || '',
          youtube: cData?.redesSociais?.youtube || '',
          whatsapp: cData?.redesSociais?.whatsapp || ''
        });
      } catch (err) {
        console.error('Erro ao carregar configurações:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      const updatedContact = {
        ...(contactDoc || {}),
        endereco: {
          ...(contactDoc?.endereco || {}),
          rua: formData.endereco
        },
        emails: [
          { tipo: 'geral', email: formData.email },
          ...(contactDoc?.emails?.slice(1) || [])
        ],
        telefones: [
          { tipo: 'principal', numero: formData.telefone, whatsapp: true },
          ...(contactDoc?.telefones?.slice(1) || [])
        ],
        redesSociais: {
          ...(contactDoc?.redesSociais || {}),
          facebook: formData.facebook,
          instagram: formData.instagram,
          youtube: formData.youtube,
          whatsapp: formData.whatsapp
        }
      };

      await Promise.all([
        contact.updateInfo(updatedContact),
        theme.update({ ...(themeDoc || {}), nomeIgreja: formData.nomeIgreja })
      ]);

      await Promise.all([loadContactInfo(true), loadTheme(true)]);

      await Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Configurações salvas com sucesso!',
        confirmButtonColor: '#9333ea',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: error.message || 'Erro ao salvar configurações',
        confirmButtonColor: '#9333ea'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleExportBackup = async () => {
    try {
      setExporting(true);
      const res = await backup.exportarJSON();
      const jsonString = JSON.stringify(res.data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `backup-igreja-mir-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Erro ao exportar backup',
        text: error.message || 'Apenas administradores podem exportar o backup completo.',
        confirmButtonColor: '#9333ea'
      });
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <Loading text="Carregando configurações..." />;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Configurações Gerais</h2>
        <p className="text-gray-600 mt-1">Configurações do site</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Igreja
            </label>
            <input
              type="text"
              value={formData.nomeIgreja}
              onChange={(e) => setFormData({ ...formData, nomeIgreja: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="text"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço
            </label>
            <input
              type="text"
              value={formData.endereco}
              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Redes Sociais</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook
                </label>
                <input
                  type="text"
                  value={formData.facebook}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  placeholder="https://facebook.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="https://instagram.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube
                </label>
                <input
                  type="text"
                  value={formData.youtube}
                  onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                  placeholder="https://youtube.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button
              type="submit"
              variant="primary"
              icon={<FaSave />}
              loading={saving}
            >
              Salvar Configurações
            </Button>
          </div>
        </form>
      </div>

      {/* Segurança e Backup Completo */}
      <div className="bg-white rounded-lg shadow p-6 mt-6 border-l-4 border-purple-600">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <FaDatabase className="text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Cópia de Segurança / Backup Completo da Base de Dados
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Exporte um ficheiro JSON com todos os membros, tesouraria, eventos, ministérios, escalas, escola bíblica, património e configurações da Igreja MIR.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            icon={<FaDownload />}
            loading={exporting}
            onClick={handleExportBackup}
          >
            Exportar Backup JSON
          </Button>
        </div>
      </div>
    </div>
  );
}
