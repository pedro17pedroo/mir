'use client';

import { useState, useEffect } from 'react';
import { FaEnvelope, FaEnvelopeOpen, FaTrash, FaReply, FaEye, FaWhatsapp } from 'react-icons/fa';
import { Badge, Button, Modal, EmptyState, Loading } from '@/components/common';
import Swal from 'sweetalert2';

export default function MensagensContatoPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('todos');
  const [respostaTexto, setRespostaTexto] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    loadMessages();
  }, []);

  const getToken = () => {
    try {
      return JSON.parse(localStorage.getItem('auth-storage'))?.state?.token;
    } catch {
      return '';
    }
  };

  const loadMessages = async () => {
    try {
      const response = await fetch(`${apiBase}/contact/messages`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Excluir mensagem?',
      text: 'Esta ação não pode ser desfeita',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${apiBase}/contact/messages/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${getToken()}` }
        });

        if (response.ok) {
          setMessages(messages.filter((m) => m._id !== id));
          Swal.fire('Excluído!', 'Mensagem excluída com sucesso', 'success');
        }
      } catch (error) {
        Swal.fire('Erro', 'Não foi possível excluir a mensagem', 'error');
      }
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await fetch(`${apiBase}/contact/messages/${id}/read`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      loadMessages();
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!selectedMessage || !respostaTexto.trim()) return;
    setSendingReply(true);
    try {
      const response = await fetch(
        `${apiBase}/contact/messages/${selectedMessage._id}/respond`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`
          },
          body: JSON.stringify({ resposta: respostaTexto })
        }
      );

      if (response.ok) {
        const updated = await response.json();
        setSelectedMessage(updated);
        setRespostaTexto('');
        loadMessages();
        Swal.fire('Respondido!', 'A resposta foi registada e enviada.', 'success');
      } else {
        Swal.fire('Erro', 'Não foi possível enviar a resposta.', 'error');
      }
    } catch (err) {
      Swal.fire('Erro', 'Erro de conexão ao responder mensagem.', 'error');
    } finally {
      setSendingReply(false);
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (filter === 'todos') return true;
    return m.status === filter;
  });

  const getStatusBadge = (status) => {
    const variants = {
      novo: 'error',
      lido: 'warning',
      respondido: 'success',
      arquivado: 'default'
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  if (loading) return <Loading text="Carregando mensagens..." />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mensagens de Contato</h2>
          <p className="text-gray-600 mt-1">
            Visualize e responda às mensagens enviadas pelos visitantes do site
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {['todos', 'novo', 'lido', 'respondido', 'arquivado'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== 'todos' && ` (${messages.filter((m) => m.status === f).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Mensagens */}
      {filteredMessages.length === 0 ? (
        <EmptyState
          icon={<FaEnvelope />}
          title="Nenhuma mensagem"
          description="Não há mensagens nesta categoria"
        />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y">
            {filteredMessages.map((message) => (
              <div
                key={message._id}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  message.status === 'novo' ? 'bg-purple-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {message.status === 'novo' ? (
                        <FaEnvelope className="text-purple-600" />
                      ) : (
                        <FaEnvelopeOpen className="text-gray-400" />
                      )}
                      <h3 className="font-bold text-lg">{message.nome}</h3>
                      {getStatusBadge(message.status)}
                    </div>

                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Email:</span> {message.email}
                      {message.telefone && (
                        <>
                          {' '}
                          | <span className="font-medium">Tel:</span> {message.telefone}
                        </>
                      )}
                    </div>

                    <div className="mb-2">
                      <span className="font-medium text-gray-700">Assunto:</span>{' '}
                      {message.assunto}
                    </div>

                    <p className="text-gray-600 line-clamp-2">{message.mensagem}</p>

                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(message.createdAt).toLocaleString('pt-BR')}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<FaEye />}
                      onClick={() => {
                        setSelectedMessage(message);
                        setRespostaTexto('');
                        setShowModal(true);
                        if (message.status === 'novo') handleMarkAsRead(message._id);
                      }}
                    >
                      Ver / Responder
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={<FaTrash />}
                      onClick={() => handleDelete(message._id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Detalhes e Resposta */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Detalhes da Mensagem"
        size="lg"
      >
        {selectedMessage && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-medium text-gray-500">Remetente</label>
                <p className="text-gray-900 font-bold text-lg">{selectedMessage.nome}</p>
              </div>
              {selectedMessage.telefone && (
                <a
                  href={`https://wa.me/${selectedMessage.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Olá ${selectedMessage.nome}, a paz do Senhor! Em resposta ao seu contato pelo site da Igreja MIR sobre "${selectedMessage.assunto}":`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-green-700"
                >
                  <FaWhatsapp /> Responder no WhatsApp
                </a>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-gray-500">Email</label>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="text-purple-600 hover:underline"
                >
                  {selectedMessage.email}
                </a>
              </div>
              {selectedMessage.telefone && (
                <div>
                  <label className="block text-xs font-medium text-gray-500">Telefone</label>
                  <a
                    href={`tel:${selectedMessage.telefone}`}
                    className="text-purple-600 hover:underline"
                  >
                    {selectedMessage.telefone}
                  </a>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Assunto</label>
              <p className="text-gray-900 font-medium">{selectedMessage.assunto}</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Mensagem</label>
              <div className="bg-gray-50 p-4 rounded-lg text-sm">
                <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.mensagem}</p>
              </div>
            </div>

            {selectedMessage.resposta && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Resposta Enviada
                </label>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-sm">
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {selectedMessage.resposta}
                  </p>
                  {selectedMessage.respondidoEm && (
                    <p className="text-xs text-gray-500 mt-2">
                      Respondido em{' '}
                      {new Date(selectedMessage.respondidoEm).toLocaleString('pt-BR')}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Formulário de Resposta */}
            <form onSubmit={handleSendReply} className="pt-4 border-t space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                {selectedMessage.resposta ? 'Enviar Nova Resposta' : 'Responder por E-mail'}
              </label>
              <textarea
                rows={3}
                required
                value={respostaTexto}
                onChange={(e) => setRespostaTexto(e.target.value)}
                placeholder="Escreva a resposta oficial da igreja..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                >
                  Fechar
                </Button>
                <Button type="submit" icon={<FaReply />} loading={sendingReply}>
                  Enviar Resposta
                </Button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}
