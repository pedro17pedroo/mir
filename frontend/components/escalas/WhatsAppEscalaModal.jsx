'use client';

import { useState } from 'react';
import {
  FaWhatsapp,
  FaCopy,
  FaCheck,
  FaPrint,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaTimes,
  FaExternalLinkAlt
} from 'react-icons/fa';

/**
 * Gera texto profissional com formatação nativa do WhatsApp (negrito, itálico, divisores, emojis).
 */
export function formatarEscalaWhatsApp(escala, nomeIgreja = 'IGREJA MIR') {
  if (!escala) return '';

  const dataFormatada = escala.dataCulto
    ? new Date(escala.dataCulto).toLocaleDateString('pt-AO', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC'
      })
    : '';

  let texto = `🏛️ *${nomeIgreja.toUpperCase()}*\n`;
  texto += `📋 *ESCALA DE SERVIÇO DOS CULTOS*\n\n`;
  texto += `✨ *Culto:* ${escala.titulo || 'Culto de Celebração'}\n`;
  if (dataFormatada) {
    texto += `📅 *Data:* ${dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1)}\n`;
  }
  if (escala.horario) {
    texto += `⏰ *Horário:* ${escala.horario}\n`;
  }
  if (escala.local) {
    texto += `📍 *Local:* ${escala.local}\n`;
  }

  texto += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
  texto += `👥 *EQUIPA ESCALADA PARA O SERVIÇO:*\n`;
  texto += `━━━━━━━━━━━━━━━━━━━━━\n`;

  if (escala.equipa && escala.equipa.length > 0) {
    escala.equipa.forEach((m) => {
      let icon = '👉';
      const func = (m.funcao || '').toLowerCase();
      if (func.includes('pregad') || func.includes('pastor')) icon = '🎤';
      else if (func.includes('dirigent')) icon = '📖';
      else if (func.includes('louvor') || func.includes('músic') || func.includes('canto')) icon = '🎵';
      else if (func.includes('recep') || func.includes('diacon') || func.includes('acolh')) icon = '🤝';
      else if (func.includes('mídia') || func.includes('midia') || func.includes('som') || func.includes('proj')) icon = '🎥';
      else if (func.includes('infantil') || func.includes('crianç') || func.includes('tia')) icon = '👶';
      else if (func.includes('oraç') || func.includes('intercess')) icon = '🙏';

      texto += `${icon} *${m.funcao}:* ${m.nome || 'A definir'}\n`;
    });
  } else {
    texto += `(Nenhum obreiro adicionado à equipa ainda)\n`;
  }

  if (escala.observacoes) {
    texto += `\n📌 *Observações:* ${escala.observacoes}\n`;
  }

  texto += `\n_“Tudo quanto fizerdes, fazei-o de todo o coração, como ao Senhor e não aos homens.” (Cl 3:23)_\n`;
  texto += `\n📲 *Consulte as escalas completas no nosso site oficial.*`;

  return texto;
}

export default function WhatsAppEscalaModal({ escala, isOpen, onClose, nomeIgreja = 'Igreja MIR' }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('card'); // 'card' | 'texto'

  if (!isOpen || !escala) return null;

  const textoWhatsApp = formatarEscalaWhatsApp(escala, nomeIgreja);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textoWhatsApp);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Erro ao copiar texto:', err);
    }
  };

  const handleOpenWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(textoWhatsApp)}`;
    window.open(url, '_blank');
  };

  const dataFormatada = escala.dataCulto
    ? new Date(escala.dataCulto).toLocaleDateString('pt-AO', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC'
      })
    : '';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/15 rounded-2xl backdrop-blur-md">
              <FaWhatsapp className="text-2xl" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg leading-tight">Card & Texto para WhatsApp</h3>
              <p className="text-xs text-emerald-100">
                Divulgue a equipa de obreiros nos grupos de WhatsApp da igreja
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition text-white"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-gray-100 bg-gray-50 px-5 pt-3">
          <button
            type="button"
            onClick={() => setActiveTab('card')}
            className={`pb-3 px-4 font-bold text-xs uppercase tracking-wider border-b-2 transition ${
              activeTab === 'card'
                ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-lg'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            🖼️ Pré-visualização do Card
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('texto')}
            className={`pb-3 px-4 font-bold text-xs uppercase tracking-wider border-b-2 transition ${
              activeTab === 'texto'
                ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-lg'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            💬 Texto Formatado WhatsApp
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'card' ? (
            /* Visual Card Preview */
            <div
              id="printable-escala-card"
              className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border-2 border-amber-400/50 relative overflow-hidden"
            >
              {/* Marca d'água de fundo */}
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />

              {/* Cabeçalho do Card */}
              <div className="border-b border-white/15 pb-4 mb-5 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="inline-block text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30 mb-1">
                    Escala Oficial de Serviço
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {escala.titulo}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-purple-200 block uppercase tracking-wider">
                    {nomeIgreja}
                  </span>
                </div>
              </div>

              {/* Informações de Data, Horário e Local */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-amber-300 text-sm flex-shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-purple-200 block">Data</span>
                    <span className="font-bold text-white capitalize">{dataFormatada}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-amber-300 text-sm flex-shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-purple-200 block">Horário</span>
                    <span className="font-bold text-white">{escala.horario}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-amber-300 text-sm flex-shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-purple-200 block">Local</span>
                    <span className="font-bold text-white">{escala.local}</span>
                  </div>
                </div>
              </div>

              {/* Roster de Obreiros */}
              <div className="space-y-2.5">
                <p className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FaUsers /> Equipa Escalada:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(escala.equipa || []).map((m, idx) => (
                    <div
                      key={idx}
                      className="bg-white/10 hover:bg-white/15 backdrop-blur-sm p-3 rounded-xl border border-white/10 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-amber-300 uppercase block tracking-wider">
                          {m.funcao}
                        </span>
                        <span className="font-bold text-sm text-white">{m.nome}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {escala.observacoes && (
                <div className="mt-5 p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs text-amber-200">
                  <span className="font-bold text-amber-300">Nota pastoral:</span> {escala.observacoes}
                </div>
              )}
            </div>
          ) : (
            /* Text Box para copiar */
            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Texto formatado para envio direto em grupos e canais
              </label>
              <textarea
                readOnly
                rows={12}
                value={textoWhatsApp}
                className="w-full font-mono text-xs p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-800 leading-relaxed"
              />
            </div>
          )}
        </div>

        {/* Rodapé com Botões de Ação */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold transition shadow-sm"
          >
            <FaPrint /> Imprimir Card
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopy}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-md ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-900 hover:bg-black text-white'
              }`}
            >
              {copied ? (
                <>
                  <FaCheck className="text-emerald-300" /> Copiado com Sucesso!
                </>
              ) : (
                <>
                  <FaCopy /> Copiar Texto WhatsApp
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-md"
            >
              <FaWhatsapp className="text-base" /> Partilhar no WhatsApp
              <FaExternalLinkAlt className="text-[10px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

