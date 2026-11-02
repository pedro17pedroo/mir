'use client';

import { useState, useEffect } from 'react';
import { FaSave } from 'react-icons/fa';
import { Button, ImageUploader } from '@/components/common';

export const MembroForm = ({ membro, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    dataNascimento: '',
    dataBatismo: '',
    ministerio: '',
    cargo: '',
    foto: '',
    posicaoFoto: 'center',
    ativo: true
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (membro) {
      setFormData({
        nome: membro.nome || '',
        email: membro.email || '',
        telefone: membro.telefone || '',
        endereco: membro.endereco || '',
        dataNascimento: membro.dataNascimento 
          ? new Date(membro.dataNascimento).toISOString().split('T')[0] 
          : '',
        dataBatismo: membro.dataBatismo 
          ? new Date(membro.dataBatismo).toISOString().split('T')[0] 
          : '',
        ministerio: membro.ministerio || '',
        cargo: membro.cargo || '',
        foto: membro.foto || '',
        posicaoFoto: membro.posicaoFoto || 'center',
        ativo: membro.ativo ?? true
      });
    }
  }, [membro]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (membro) {
        await onSubmit(membro._id, formData);
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
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome Completo *
          </label>
          <input
            type="text"
            required
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Endereço
          </label>
          <input
            type="text"
            value={formData.endereco}
            onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data de Nascimento
          </label>
          <input
            type="date"
            value={formData.dataNascimento}
            onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data de Batismo
          </label>
          <input
            type="date"
            value={formData.dataBatismo}
            onChange={(e) => setFormData({ ...formData, dataBatismo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ministério
          </label>
          <input
            type="text"
            value={formData.ministerio}
            onChange={(e) => setFormData({ ...formData, ministerio: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cargo
          </label>
          <input
            type="text"
            value={formData.cargo}
            onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div className="col-span-2 space-y-3">
          <ImageUploader
            label="Fotografia Oficial do Membro (Exibida no Cartão e Ficha Ministerial)"
            value={formData.foto}
            onChange={(val) => setFormData({ ...formData, foto: val })}
            aspectRatio="square"
            maxWidth={600}
            showPositionControl={true}
            positionValue={formData.posicaoFoto}
            onPositionChange={(pos) => setFormData({ ...formData, posicaoFoto: pos })}
            helperText="Recomendamos foto tipo passe/rosto. Use o ajuste de enquadramento abaixo para centralizar os olhos do membro."
          />

          {formData.foto && (
            <div className="bg-purple-50/70 p-3.5 rounded-xl border border-purple-100 flex items-center justify-between gap-4">
              <div className="text-xs">
                <p className="font-bold text-purple-900">Pré-visualização do Enquadramento Facial:</p>
                <p className="text-purple-700 text-[11px]">
                  Como a foto aparecerá na Tabela de Membros e na Credencial Oficial
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* Avatar Circular */}
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500 shadow-sm mx-auto bg-gray-100">
                    <img
                      src={formData.foto}
                      alt="Avatar"
                      style={{ objectPosition: formData.posicaoFoto || 'center' }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium mt-0.5 block">Tabela</span>
                </div>
                {/* 3x4 Credencial */}
                <div className="text-center">
                  <div className="w-10 h-12 rounded-lg overflow-hidden border-2 border-amber-400 shadow-sm mx-auto bg-gray-100">
                    <img
                      src={formData.foto}
                      alt="Credencial 3x4"
                      style={{ objectPosition: formData.posicaoFoto || 'center' }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium mt-0.5 block">Cartão</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="col-span-2 flex items-center">
          <input
            type="checkbox"
            checked={formData.ativo}
            onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Membro Ativo
          </label>
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
          {membro ? 'Atualizar' : 'Criar'} Membro
        </Button>
      </div>
    </form>
  );
};
