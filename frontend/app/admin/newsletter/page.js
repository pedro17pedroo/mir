'use client';

import { useState } from 'react';
import { newsletters } from '@/lib/api';
import { useCRUD, useModal } from '@/hooks';
import { Loading, Table, Button, Modal } from '@/components/common';
import { FaEnvelope, FaPaperPlane, FaDownload } from 'react-icons/fa';
import { formatDate } from '@/utils';

export default function NewsletterAdmin() {
  const { data, loading, remove } = useCRUD(newsletters);
  const sendModal = useModal();
  const [boletim, setBoletim] = useState({ subject: '', content: '' });
  const [sending, setSending] = useState(false);

  const columns = [
    { header: 'Email', accessor: 'email' },
    {
      header: 'Data de Inscrição',
      render: (row) => (
        <span className="text-sm text-gray-500">{formatDate(row.createdAt)}</span>
      )
    }
  ];

  const handleSendNewsletter = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await newsletters.send(boletim);
      alert(res.data?.message || 'Boletim enviado com sucesso!');
      setBoletim({ subject: '', content: '' });
      sendModal.close();
    } catch (err) {
      alert(err.message || 'Erro ao enviar boletim');
    } finally {
      setSending(false);
    }
  };

  const handleExportCSV = () => {
    if (!data.length) return;
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFFEmail;DataInscricao\n' +
      data
        .map(
          (r) =>
            `${r.email};${r.createdAt ? new Date(r.createdAt).toLocaleDateString('pt-AO') : ''}`
        )
        .join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'inscritos-newsletter-mir.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && data.length === 0) {
    return <Loading text="Carregando inscritos..." />;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Newsletter e Boletim</h2>
          <p className="text-gray-600 mt-1">
            Gerencie inscritos e envie comunicados para a lista de e-mails da igreja
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            icon={<FaDownload />}
            onClick={handleExportCSV}
            disabled={!data.length}
          >
            Exportar CSV
          </Button>
          <Button
            icon={<FaPaperPlane />}
            onClick={() => sendModal.open()}
            disabled={!data.length}
          >
            Enviar Comunicado
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total de Inscritos Ativos</p>
            <p className="text-3xl font-bold text-purple-600">{data.length}</p>
          </div>
          <FaEnvelope className="text-5xl text-purple-600 opacity-20" />
        </div>
      </div>

      <Table
        columns={columns}
        data={data}
        onDelete={remove}
        emptyIcon={<FaEnvelope />}
        emptyTitle="Nenhum inscrito"
        emptyDescription="Os inscritos da newsletter aparecerão aqui"
      />

      <Modal
        isOpen={sendModal.isOpen}
        onClose={sendModal.close}
        title="Enviar Comunicado / Boletim por E-mail"
      >
        <form onSubmit={handleSendNewsletter} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assunto do Comunicado *
            </label>
            <input
              type="text"
              required
              value={boletim.subject}
              onChange={(e) => setBoletim({ ...boletim, subject: e.target.value })}
              placeholder="Ex: Programação Especial de Domingo — Igreja MIR"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mensagem *
            </label>
            <textarea
              rows={5}
              required
              value={boletim.content}
              onChange={(e) => setBoletim({ ...boletim, content: e.target.value })}
              placeholder="Escreva o conteúdo do boletim..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button type="button" variant="outline" onClick={sendModal.close}>
              Cancelar
            </Button>
            <Button type="submit" loading={sending} icon={<FaPaperPlane />}>
              Disparar para {data.length} inscrito(s)
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
