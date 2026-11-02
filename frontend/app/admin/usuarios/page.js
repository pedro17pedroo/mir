'use client';

import { useState, useEffect } from 'react';
import {
  FaUserShield,
  FaPlus,
  FaEdit,
  FaTrash,
  FaKey,
  FaCheckCircle,
  FaBan
} from 'react-icons/fa';
import { Button, Modal, Badge, Loading, EmptyState } from '@/components/common';
import { useModal } from '@/hooks';
import { auth } from '@/lib/api';

const ROLES = [
  { id: 'admin', label: 'Administrador Geral', color: 'bg-purple-100 text-purple-800' },
  { id: 'pastor', label: 'Equipa Pastoral', color: 'bg-indigo-100 text-indigo-800' },
  { id: 'secretaria', label: 'Secretaria', color: 'bg-blue-100 text-blue-800' },
  { id: 'midia', label: 'Mídia e Comunicação', color: 'bg-pink-100 text-pink-800' },
  { id: 'tesouraria', label: 'Tesouraria / Finanças', color: 'bg-emerald-100 text-emerald-800' }
];

const INITIAL_FORM = {
  nome: '',
  email: '',
  password: '',
  role: 'secretaria',
  cargo: '',
  telefone: '',
  ativo: true
};

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const userModal = useModal();

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const res = await auth.getUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error('Erro ao carregar utilizadores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const handleOpenNew = () => {
    setFormData(INITIAL_FORM);
    userModal.open(null);
  };

  const handleOpenEdit = (u) => {
    setFormData({
      nome: u.nome || '',
      email: u.email || '',
      password: '',
      role: u.role || 'admin',
      cargo: u.cargo || '',
      telefone: u.telefone || '',
      ativo: u.ativo !== false
    });
    userModal.open(u);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (userModal.data?._id) {
        await auth.updateUser(userModal.data._id, formData);
      } else {
        await auth.registerUser(formData);
      }
      userModal.close();
      carregarUsuarios();
    } catch (err) {
      alert(err.message || 'Erro ao salvar utilizador');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAtivo = async (u) => {
    try {
      await auth.updateUser(u._id, { ativo: u.ativo === false });
      carregarUsuarios();
    } catch (err) {
      alert(err.message || 'Erro ao alterar status da conta');
    }
  };

  const handleDelete = async (u) => {
    if (!confirm(`Tem certeza que deseja excluir o utilizador "${u.nome || u.email}"?`)) return;
    try {
      await auth.deleteUser(u._id);
      carregarUsuarios();
    } catch (err) {
      alert(err.message || 'Erro ao excluir utilizador');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestão de Utilizadores e Permissões
          </h1>
          <p className="text-gray-600 mt-1">
            Adicione membros da equipa administrativa, pastores, secretaria, mídia e tesouraria
          </p>
        </div>
        <Button icon={FaPlus} onClick={handleOpenNew}>
          Novo Utilizador
        </Button>
      </div>

      {loading ? (
        <Loading text="Carregando utilizadores do sistema..." />
      ) : users.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200">
          <EmptyState
            icon={FaUserShield}
            title="Nenhum utilizador encontrado"
            description="Cadastre utilizadores para gerir o sistema."
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Utilizador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Função / Nível
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cargo / Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((u) => {
                const roleInfo = ROLES.find((r) => r.id === u.role) || ROLES[0];
                return (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm">
                          {(u.nome || u.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {u.nome || 'Sem nome'}
                          </div>
                          <div className="text-xs text-gray-500">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${roleInfo.color}`}
                      >
                        {roleInfo.label}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                      <div>{u.cargo || '-'}</div>
                      {u.telefone && <div className="text-gray-400">{u.telefone}</div>}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={u.ativo !== false ? 'success' : 'error'}>
                        {u.ativo !== false ? 'Ativo' : 'Desativado'}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleAtivo(u)}
                          className={`p-2 rounded-lg text-xs ${
                            u.ativo !== false
                              ? 'text-amber-600 hover:bg-amber-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={u.ativo !== false ? 'Desativar conta' : 'Ativar conta'}
                        >
                          {u.ativo !== false ? <FaBan /> : <FaCheckCircle />}
                        </button>
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Editar / Redefinir senha"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(u)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Excluir"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Criar / Editar */}
      <Modal
        isOpen={userModal.isOpen}
        onClose={userModal.close}
        title={userModal.data ? 'Editar Utilizador' : 'Novo Utilizador do Painel'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo *
            </label>
            <input
              type="text"
              required
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Ex: Pr. António Silva"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail de Acesso *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="email@igrejamir.org"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Função / Permissão *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {ROLES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cargo Eclesiástico / Departamento
              </label>
              <input
                type="text"
                value={formData.cargo}
                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Ex: Secretária Executiva"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
              <FaKey className="text-purple-600" />
              {userModal.data
                ? 'Nova Senha (deixe em branco para manter a atual)'
                : 'Senha de Acesso *'}
            </label>
            <input
              type="password"
              required={!userModal.data}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Mínimo 8 caracteres (Maiúscula, minúscula e número)"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button type="button" variant="outline" onClick={userModal.close}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              {userModal.data ? 'Salvar Alterações' : 'Criar Utilizador'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

