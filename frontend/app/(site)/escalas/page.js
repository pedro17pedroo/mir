'use client';

import { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { escalas as escalasApi } from '@/lib/api';
import WhatsAppEscalaModal from '@/components/escalas/WhatsAppEscalaModal';
import {
  FaCalendarCheck,
  FaClock,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaSearch,
  FaUsers,
  FaShareAlt
} from 'react-icons/fa';

export default function EscalasPublicPage() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [escalaParaWhatsApp, setEscalaParaWhatsApp] = useState(null);

  useEffect(() => {
    const carregar = async () => {
      try {
        const res = await escalasApi.getAll({ publicada: true });
        setLista(res.data || []);
      } catch (err) {
        console.error('Erro ao carregar escalas:', err);
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, []);

  const filtradas = useMemo(() => {
    if (!busca.trim()) return lista;
    const q = busca.toLowerCase();
    return lista.filter((escala) => {
      const matchTitulo = escala.titulo?.toLowerCase().includes(q);
      const matchLocal = escala.local?.toLowerCase().includes(q);
      const matchEquipa = (escala.equipa || []).some(
        (eq) =>
          eq.nome?.toLowerCase().includes(q) || eq.funcao?.toLowerCase().includes(q)
      );
      return matchTitulo || matchLocal || matchEquipa;
    });
  }, [lista, busca]);

  return (
    <>
      <Navbar />
      <PageHero
        badge="Serviço e Organização"
        badgeIcon={FaCalendarCheck}
        titulo="Escala de Serviço dos Cultos"
        subtitulo="Confira as equipas de obreiros, louvor, recepção, diaconato e mídia escaladas para as celebrações da Igreja MIR."
      />

      <main className="min-h-screen bg-gray-50 py-12 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Barra de Filtro e Busca */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <FaSearch className="absolute left-3.5 top-3.5 text-gray-400 text-sm" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Pesquisar por obreiro, função ou culto..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
              />
            </div>

            <div className="text-xs text-gray-500 font-medium flex items-center gap-2">
              <FaUsers className="text-purple-600" />
              <span>
                {filtradas.length} {filtradas.length === 1 ? 'escala disponível' : 'escalas disponíveis'}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-500">
              <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-3" />
              Carregando escalas oficiais...
            </div>
          ) : filtradas.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 max-w-md mx-auto">
              <FaCalendarCheck className="w-12 h-12 text-purple-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-800">
                {busca ? 'Nenhuma escala coincide com a pesquisa' : 'Nenhuma escala publicada no momento'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {busca ? 'Experimente pesquisar por outro termo ou nome de voluntário.' : 'Fique atento às atualizações da equipa pastoral.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtradas.map((escala) => {
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
                  <div
                    key={escala._id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header do Card */}
                      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 text-white p-5">
                        <div className="flex items-start justify-between gap-2">
                          <h2 className="text-xl font-bold leading-tight">{escala.titulo}</h2>
                        </div>

                        <div className="flex flex-wrap gap-3 text-xs text-purple-200 mt-3 pt-3 border-t border-white/10">
                          {dataFormatada && (
                            <span className="flex items-center gap-1.5 capitalize font-medium">
                              <FaCalendarCheck className="text-amber-300" />
                              {dataFormatada}
                            </span>
                          )}
                          {escala.horario && (
                            <span className="flex items-center gap-1.5 font-medium">
                              <FaClock className="text-amber-300" /> {escala.horario}
                            </span>
                          )}
                          {escala.local && (
                            <span className="flex items-center gap-1.5 font-medium">
                              <FaMapMarkerAlt className="text-amber-300" /> {escala.local}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Lista da Equipa */}
                      <div className="p-5 divide-y divide-gray-100">
                        {(escala.equipa || []).map((eq, i) => (
                          <div key={i} className="py-2.5 flex justify-between items-center text-sm">
                            <span className="font-bold text-xs uppercase tracking-wide text-purple-800">
                              {eq.funcao}
                            </span>
                            <span className="text-gray-900 font-medium">{eq.nome}</span>
                          </div>
                        ))}

                        {escala.observacoes && (
                          <div className="pt-3 text-xs text-gray-500 italic">
                            <span className="font-semibold text-gray-700">Nota:</span> {escala.observacoes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Rodapé com Ação WhatsApp */}
                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] text-gray-400 font-medium">
                        {(escala.equipa || []).length} escalados
                      </span>
                      <button
                        type="button"
                        onClick={() => setEscalaParaWhatsApp(escala)}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
                      >
                        <FaWhatsapp className="text-sm" /> Card WhatsApp
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modal Card e Texto WhatsApp */}
      <WhatsAppEscalaModal
        escala={escalaParaWhatsApp}
        isOpen={Boolean(escalaParaWhatsApp)}
        onClose={() => setEscalaParaWhatsApp(null)}
        nomeIgreja="Igreja MIR"
      />

      <Footer />
    </>
  );
}
