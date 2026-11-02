'use client';

import { useState, useEffect } from 'react';
import {
  FaBookOpen,
  FaQuoteLeft,
  FaWhatsapp,
  FaCalendarAlt,
  FaUser,
  FaPrayingHands
} from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { mensagens } from '@/lib/api';

const CATEGORIAS = [
  'Todas',
  'Devocional Diário',
  'Palavra Pastoral',
  'Versículo da Semana',
  'Estudo Bíblico'
];

export default function DevocionalPublicPage() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoria, setCategoria] = useState('Todas');
  const [selecionado, setSelecionado] = useState(null);

  useEffect(() => {
    loadDevocionais();
  }, []);

  const loadDevocionais = async () => {
    try {
      setLoading(true);
      const res = await mensagens.getAll();
      const ativos = (res.data || []).filter((m) => m.status === 'ativo');
      setLista(ativos);
      if (ativos.length > 0) {
        setSelecionado(ativos[0]);
      }
    } catch (err) {
      console.error('Erro ao carregar devocionais:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtrados =
    categoria === 'Todas'
      ? lista
      : lista.filter((m) => (m.categoria || 'Devocional Diário') === categoria);

  const partilharWhatsApp = (item) => {
    const texto = `*${item.titulo}* — Igreja MIR\n\n"${
      item.versiculo || item.resumo || ''
    }"\n\n${item.conteudo || ''}\n\n${
      item.autor ? `— ${item.autor}` : ''
    }`;
    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <Navbar />
      <PageHero
        badge="Alimento Espiritual Diário"
        badgeIcon={FaBookOpen}
        titulo="Devocional & Palavra Pastoral"
        subtitulo="Meditações bíblicas, palavras proféticas e reflexões pastorais para edificar a sua fé e a sua família"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh]">
        {/* Destaque Principal (Devocional do Dia) */}
        {selecionado && (
          <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-3xl shadow-xl border border-purple-100 p-8 md:p-10 mb-12">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-purple-600 text-white uppercase tracking-wider">
                {selecionado.categoria || 'Devocional em Destaque'}
              </span>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <FaCalendarAlt className="text-purple-600" />
                  {new Date(selecionado.data || selecionado.createdAt).toLocaleDateString(
                    'pt-AO',
                    { day: '2-digit', month: 'long', year: 'numeric' }
                  )}
                </span>
                {selecionado.autor && (
                  <span className="flex items-center gap-1 font-medium text-gray-700">
                    <FaUser className="text-purple-600" /> {selecionado.autor}
                  </span>
                )}
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              {selecionado.titulo}
            </h2>

            {(selecionado.versiculo || selecionado.resumo) && (
              <blockquote className="bg-white border-l-4 border-purple-600 p-5 rounded-r-xl shadow-sm mb-6">
                <FaQuoteLeft className="text-purple-300 text-xl mb-2" />
                <p className="text-lg font-semibold text-purple-950 italic">
                  {selecionado.versiculo || selecionado.resumo}
                </p>
              </blockquote>
            )}

            {selecionado.conteudo && (
              <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line mb-6 text-base md:text-lg">
                {selecionado.conteudo}
              </div>
            )}

            {selecionado.oracaoFinal && (
              <div className="bg-purple-900 text-white rounded-2xl p-6 mb-6">
                <h4 className="flex items-center gap-2 font-bold text-purple-200 text-sm uppercase tracking-wider mb-2">
                  <FaPrayingHands /> Oração do Dia
                </h4>
                <p className="italic text-purple-50">{selecionado.oracaoFinal}</p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => partilharWhatsApp(selecionado)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm shadow transition-all"
              >
                <FaWhatsapp className="text-lg" /> Partilhar no WhatsApp
              </button>
            </div>
          </div>
        )}

        {/* Filtro de Categorias */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoria(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                categoria === cat
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Lista de Mensagens e Devocionais */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
          </div>
        ) : filtrados.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <FaBookOpen className="text-5xl text-gray-300 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-gray-700 mb-1">
              Nenhuma mensagem disponível nesta categoria
            </h3>
            <p className="text-gray-500 text-sm">
              Volte em breve para acompanhar novas meditações pastorais.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtrados.map((item) => (
              <div
                key={item._id}
                onClick={() => {
                  setSelecionado(item);
                  window.scrollTo({ top: 200, behavior: 'smooth' });
                }}
                className={`cursor-pointer bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border flex flex-col justify-between ${
                  selecionado?._id === item._id
                    ? 'border-purple-600 ring-2 ring-purple-600/20'
                    : 'border-gray-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                      {item.categoria || 'Devocional'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(item.data || item.createdAt).toLocaleDateString('pt-AO')}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {item.titulo}
                  </h3>
                  {item.resumo && (
                    <p className="text-sm text-purple-900 italic mb-2 line-clamp-2">
                      &ldquo;{item.resumo}&rdquo;
                    </p>
                  )}
                  {item.conteudo && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {item.conteudo}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                  <span className="text-xs font-medium text-gray-500">
                    {item.autor || 'Igreja MIR'}
                  </span>
                  <span className="text-xs font-bold text-purple-600">
                    Ler meditação →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

