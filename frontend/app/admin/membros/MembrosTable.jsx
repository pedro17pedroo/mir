'use client';

import {
  FaEdit,
  FaTrash,
  FaUsers,
  FaBirthdayCake,
  FaWhatsapp,
  FaIdCard
} from 'react-icons/fa';
import { Badge, Button, EmptyState } from '@/components/common';

export const MembrosTable = ({ membros, loading, onEdit, onDelete, onPrintDoc }) => {
  if (loading && (!membros || membros.length === 0)) {
    return (
      <div className="py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (membros.length === 0) {
    return (
      <EmptyState
        icon={<FaUsers />}
        title="Nenhum membro encontrado"
        description="Comece adicionando membros da igreja ou ajuste os filtros"
      />
    );
  }

  const mesAtual = new Date().getMonth();

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Nome / Cargo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Contato
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Aniversário
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Ministério
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {membros.map((membro) => {
            const dataNasc = membro.dataNascimento ? new Date(membro.dataNascimento) : null;
            const isAniversarianteMes =
              dataNasc && !Number.isNaN(dataNasc.getTime()) && dataNasc.getUTCMonth() === mesAtual;
            const cleanPhone = (membro.telefone || '').replace(/\D/g, '');

            return (
              <tr key={membro._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    {membro.foto ? (
                      <img
                        src={membro.foto}
                        alt={membro.nome}
                        style={{ objectPosition: membro.posicaoFoto || 'center' }}
                        className="w-10 h-10 rounded-full object-cover border-2 border-purple-200 shadow-sm flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm flex-shrink-0 border border-purple-200 shadow-sm">
                        {membro.nome?.charAt(0)?.toUpperCase() || 'M'}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">{membro.nome}</span>
                        {isAniversarianteMes && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-pink-100 text-pink-700"
                            title="Aniversariante deste mês!"
                          >
                            <FaBirthdayCake /> Parabéns
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {membro.cargo || 'Membro'}{' '}
                        {(membro.batizado || membro.dataBatismo) && '• Batizado(a)'}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                  <div>{membro.telefone || '-'}</div>
                  <div className="text-gray-400">{membro.email || ''}</div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                  {dataNasc && !Number.isNaN(dataNasc.getTime())
                    ? dataNasc.toLocaleDateString('pt-AO', {
                        day: '2-digit',
                        month: 'short',
                        timeZone: 'UTC'
                      })
                    : '-'}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {membro.ministerio ||
                    (membro.gruposMinisteriais?.length
                      ? membro.gruposMinisteriais.join(', ')
                      : '-')}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={membro.ativo !== false ? 'success' : 'error'} size="sm">
                    {membro.ativo !== false ? 'Ativo' : 'Inativo'}
                  </Badge>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end items-center gap-1.5">
                    {onPrintDoc && (
                      <button
                        onClick={() => onPrintDoc(membro)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                        title="Emitir Cartão de Membro / Certificado de Batismo"
                      >
                        <FaIdCard className="w-4 h-4" />
                      </button>
                    )}
                    {cleanPhone && (
                      <a
                        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                          isAniversarianteMes
                            ? `Feliz aniversário, ${membro.nome}! 🎉 A família da Igreja MIR celebra a sua vida e declara as mais ricas bênçãos do Senhor sobre si!`
                            : `A paz do Senhor, ${membro.nome}!`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title={
                          isAniversarianteMes
                            ? 'Enviar parabéns no WhatsApp'
                            : 'Conversar no WhatsApp'
                        }
                      >
                        <FaWhatsapp className="w-4 h-4" />
                      </a>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<FaEdit />}
                      onClick={() => onEdit(membro)}
                      className="p-2"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<FaTrash />}
                      onClick={() => onDelete(membro._id)}
                      className="p-2 text-red-600 hover:bg-red-50"
                    />
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
