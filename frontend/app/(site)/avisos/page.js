'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { avisos as avisosApi } from '@/lib/api';
import { FaBullhorn, FaThumbtack } from 'react-icons/fa';

const CATEGORIAS = {
  geral: 'Comunicado Geral',
  urgente: 'Aviso Importante',
  jejum_oracao: 'Jejum e Oração',
  departamento: 'Departamentos',
  agenda: 'Boletim da Semana'
};

export default function AvisosPublicPage() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        const res = await avisosApi.getAll({ ativo: true });
        setLista(res.data || []);
      } catch (err) {
        console.error('Erro ao carregar avisos:', err);
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, []);

  return (
    <>
      <Navbar />
      <PageHero
        badge="Comunicados Oficiais"
        badgeIcon={FaBullhorn}
        titulo="Mural de Avisos e Boletim Semanal"
        subtitulo="Fique por dentro dos comunicados oficiais, campanhas de oração e agenda da semana na Igreja MIR."
      />
      <main className="min-h-screen bg-gray-50 py-12 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Carregando comunicados...</div>
          ) : lista.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <FaBullhorn className="w-12 h-12 text-purple-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-800">
                Nenhum comunicado publicado no momento
              </h3>
            </div>
          ) : (
            <div className="space-y-5">
              {lista.map((item) => (
                <div
                  key={item._id}
                  className={`bg-white rounded-2xl p-6 shadow-sm border ${
                    item.fixado
                      ? 'border-purple-400 ring-2 ring-purple-100'
                      : 'border-gray-100'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      {item.fixado && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full">
                          <FaThumbtack /> Destaque
                        </span>
                      )}
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          item.categoria === 'urgente'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-indigo-50 text-indigo-800'
                        }`}
                      >
                        {CATEGORIAS[item.categoria] || 'Comunicado'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString('pt-AO', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-2">{item.titulo}</h2>
                  <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                    {item.conteudo}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

