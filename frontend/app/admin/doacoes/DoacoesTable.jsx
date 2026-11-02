'use client';

import { FaHandHoldingHeart, FaCheck, FaTimes, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { EmptyState, Badge } from '@/components/common';
import { formatCurrency, formatDate } from '@/utils';

const LABELS_TIPO = {
  dizimo: 'Dízimo',
  oferta: 'Oferta Geral',
  missoes: 'Missões',
  construcao: 'Obras / Construção',
  outro: 'Outra Contribuição'
};

const LABELS_DESPESA = {
  energia_agua: 'Energia e Água',
  renda_instalacoes: 'Renda / Instalações',
  som_midia: 'Som, Multimédia e Internet',
  acao_social: 'Ação Social e Diaconia',
  manutencao: 'Manutenção e Limpeza',
  subsidios_pessoal: 'Subsídios / Obreiros',
  eventos_cultos: 'Logística de Cultos / Eventos',
  missoes: 'Apoio Missionário',
  outro: 'Outras Despesas'
};

export const DoacoesTable = ({ doacoes, loading, onUpdateStatus, onDelete }) => {
  if (loading) {
    return null;
  }

  if (doacoes.length === 0) {
    return (
      <EmptyState
        icon={<FaHandHoldingHeart />}
        title="Nenhum registo financeiro encontrado"
        description="As entradas de dízimos/ofertas e saídas de despesas aparecerão aqui"
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Movimento
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Contribuinte / Beneficiário
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Categoria / Finalidade
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Valor
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Método / Ref.
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Data
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {doacoes.map((doacao) => {
            const isSaida = doacao.natureza === 'saida';
            return (
              <tr key={doacao._id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  {isSaida ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                      <FaArrowDown className="text-[10px]" /> Saída
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                      <FaArrowUp className="text-[10px]" /> Entrada
                    </span>
                  )}
                </td>

                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {isSaida
                      ? doacao.beneficiario || doacao.doador?.nome || 'Fornecedor / Despesa'
                      : doacao.doador?.anonimo
                      ? 'Anônimo'
                      : doacao.doador?.nome || doacao.nome || 'Anônimo'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {doacao.observacoes
                      ? doacao.observacoes
                      : doacao.doador?.anonimo
                      ? '-'
                      : [doacao.doador?.telefone, doacao.doador?.email || doacao.email]
                          .filter(Boolean)
                          .join(' • ') || '-'}
                  </div>
                </td>

                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      isSaida
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {isSaida
                      ? LABELS_DESPESA[doacao.categoriaDespesa] || 'Despesa Operacional'
                      : LABELS_TIPO[doacao.tipoContribuicao] || 'Dízimo / Oferta'}
                  </span>
                </td>

                <td className="px-4 py-4 whitespace-nowrap">
                  <div
                    className={`text-sm font-bold ${
                      isSaida ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {isSaida ? '- ' : '+ '}
                    {formatCurrency(doacao.valor || 0)}
                  </div>
                </td>

                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-800 capitalize">
                    {doacao.metodoPagamento || doacao.metodo || 'N/A'}
                  </div>
                  {doacao.referenciaComprovativo && (
                    <div className="text-xs font-mono text-gray-500">
                      Ref: {doacao.referenciaComprovativo}
                    </div>
                  )}
                </td>

                <td className="px-4 py-4 whitespace-nowrap">
                  <Badge
                    variant={
                      doacao.status === 'concluido'
                        ? 'success'
                        : doacao.status === 'falhou'
                        ? 'error'
                        : 'warning'
                    }
                  >
                    {doacao.status === 'concluido'
                      ? 'Confirmado'
                      : doacao.status === 'falhou'
                      ? 'Cancelado'
                      : 'Pendente'}
                  </Badge>
                </td>

                <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500">
                  {formatDate(doacao.data || doacao.createdAt)}
                </td>

                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-1.5">
                    {doacao.status !== 'concluido' && onUpdateStatus && (
                      <button
                        onClick={() => onUpdateStatus(doacao._id, 'concluido')}
                        className="p-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded"
                        title="Confirmar movimento"
                      >
                        <FaCheck className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {doacao.status === 'pendente' && onUpdateStatus && (
                      <button
                        onClick={() => onUpdateStatus(doacao._id, 'falhou')}
                        className="p-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded"
                        title="Rejeitar / Cancelar"
                      >
                        <FaTimes className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(doacao._id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        title="Excluir registo"
                      >
                        <FaTrash className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
