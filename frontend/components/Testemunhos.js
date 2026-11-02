'use client';

import { useEffect, useState } from 'react';
import useSiteStore from '../store/useSiteStore';
import { testemunhos as testemunhosApi } from '../lib/api';
import { FaQuoteLeft, FaPlus, FaTimes, FaCheckCircle } from 'react-icons/fa';

export default function Testemunhos() {
  const testemunhos = useSiteStore((state) => state.testemunhos);
  const loadTestemunhos = useSiteStore((state) => state.loadTestemunhos);
  const theme = useSiteStore((state) => state.theme);
  const [modalAberto, setModalAberto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState('');
  const [form, setForm] = useState({ nome: '', telefone: '', local: '', mensagem: '' });

  useEffect(() => {
    if (!testemunhos.length) {
      loadTestemunhos();
    }
  }, []);

  const ativos = testemunhos.filter((t) => t.ativo !== false && t.status === 'ativo');

  const handleEnviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      const res = await testemunhosApi.enviarPublico(form);
      setSucesso(
        res.data?.message ||
          'O seu testemunho foi enviado com sucesso e aguarda aprovação!'
      );
      setForm({ nome: '', telefone: '', local: '', mensagem: '' });
    } catch (err) {
      alert(err.message || 'Erro ao enviar testemunho.');
    } finally {
      setEnviando(false);
    }
  };

  // Cores dinâmicas configuráveis no Tema
  const corFundo = theme?.homeSecaoTestemunhosCorFundo || '#faf5ff';
  const corTitulo = theme?.homeSecaoTestemunhosCorTitulo || '#111827';
  const corSubtitulo = theme?.homeSecaoTestemunhosCorSubtitulo || '#4b5563';
  const corCardFundo = theme?.homeSecaoTestemunhosCorCardFundo || '#ffffff';
  const corCardTexto = theme?.homeSecaoTestemunhosCorCardTexto || '#374151';
  const corCardAutor = theme?.homeSecaoTestemunhosCorCardAutor || '#111827';
  const corCardLocal = theme?.homeSecaoTestemunhosCorCardLocal || '#7e22ce';
  const corAspas = theme?.homeSecaoTestemunhosCorAspas || '#facc15';
  const corBotao = theme?.homeSecaoTestemunhosCorBotao || '#7e22ce';
  const corBotaoTexto = theme?.homeSecaoTestemunhosCorBotaoTexto || '#ffffff';

  return (
    <section
      className="py-20 transition-colors"
      style={{
        backgroundColor: corFundo,
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: corTitulo }}
          >
            {theme?.homeSecaoTestemunhosTitulo || 'Testemunhos'}
          </h2>
          <p
            className="text-xl max-w-2xl mx-auto mb-6"
            style={{ color: corSubtitulo }}
          >
            {theme?.homeSecaoTestemunhosSubtitulo || 'Vidas transformadas pelo poder de Deus'}
          </p>
          <button
            onClick={() => {
              setSucesso('');
              setModalAberto(true);
            }}
            style={{
              backgroundColor: corBotao,
              color: corBotaoTexto,
            }}
            className="inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-full shadow-md hover:brightness-110 transition-all text-sm"
          >
            <FaPlus />
            Partilhar o Meu Testemunho
          </button>
        </div>

        {ativos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ativos.map((testemunho, i) => (
              <div
                key={testemunho._id || i}
                style={{
                  backgroundColor: corCardFundo,
                }}
                className="rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative border border-black/5"
              >
                <div
                  className="absolute top-6 right-6 opacity-25"
                  style={{ color: corAspas }}
                >
                  <FaQuoteLeft className="text-6xl" />
                </div>

                {testemunho.foto && (
                  <div className="flex justify-center mb-6">
                    <img
                      src={testemunho.foto}
                      alt={testemunho.nome}
                      style={{
                        borderColor: corAspas,
                        objectPosition: 'center',
                      }}
                      className="w-24 h-24 rounded-full object-cover border-4 shadow-lg"
                    />
                  </div>
                )}

                <p
                  className="text-lg italic mb-6 relative z-10 line-clamp-6 leading-relaxed"
                  style={{ color: corCardTexto }}
                >
                  &ldquo;{testemunho.mensagem || testemunho.texto}&rdquo;
                </p>

                <div className="text-center border-t border-gray-100 pt-4">
                  <p
                    className="font-bold text-lg"
                    style={{ color: corCardAutor }}
                  >
                    {testemunho.nome}
                  </p>
                  <p
                    className="text-sm font-semibold mt-0.5"
                    style={{ color: corCardLocal }}
                  >
                    {testemunho.local}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Enviar Testemunho */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setModalAberto(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="w-5 h-5" />
            </button>

            {sucesso ? (
              <div className="text-center py-6">
                <FaCheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Testemunho Recebido!
                </h3>
                <p className="text-gray-600 text-sm mb-4">{sucesso}</p>
                <button
                  onClick={() => setModalAberto(false)}
                  className="px-6 py-2 bg-purple-700 text-white rounded-lg text-sm font-medium"
                >
                  Fechar
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnviar} className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Partilhar o Meu Testemunho
                </h3>
                <p className="text-xs text-gray-500">
                  Conte o que Deus fez na sua vida para inspirar e edificar a igreja.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    placeholder="Seu nome"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Telefone / WhatsApp (Opcional)
                  </label>
                  <input
                    type="tel"
                    value={form.telefone}
                    onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                    placeholder="Ex: 923 000 000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Local / Congregação / Bairro
                  </label>
                  <input
                    type="text"
                    value={form.local}
                    onChange={(e) => setForm({ ...form, local: e.target.value })}
                    placeholder="Ex: Luanda, Sede / Viana"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    O Seu Testemunho *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.mensagem}
                    onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                    placeholder="Escreva como o Senhor operou na sua vida..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setModalAberto(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={enviando}
                    className="px-5 py-2 bg-purple-700 text-white rounded-lg text-xs font-semibold hover:bg-purple-800 disabled:opacity-50"
                  >
                    {enviando ? 'A enviar...' : 'Enviar Testemunho'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
