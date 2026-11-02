'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { cursos as cursosApi } from '@/lib/api';
import {
  FaGraduationCap,
  FaClock,
  FaMapMarkerAlt,
  FaUserTie,
  FaBookOpen,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes
} from 'react-icons/fa';

const CATEGORIAS = {
  escola_biblica: 'Escola Bíblica Dominical',
  batismo: 'Preparação para o Batismo',
  discipulado: 'Discipulado Inicial',
  lideranca: 'Escola de Líderes',
  familia: 'Família e Casais'
};

export default function CursosPublicPage() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selecionado, setSelecionado] = useState(null);
  const [form, setForm] = useState({ nome: '', telefone: '', email: '' });
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    const carregar = async () => {
      try {
        const res = await cursosApi.getAll({ ativo: true });
        setLista(res.data || []);
      } catch (err) {
        console.error('Erro ao carregar cursos:', err);
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, []);

  const handleMatricular = async (e) => {
    e.preventDefault();
    if (!selecionado) return;
    setEnviando(true);
    setSucesso('');
    setErro('');
    try {
      const res = await cursosApi.matricular(selecionado._id, form);
      setSucesso(res.data?.message || 'Matrícula realizada com sucesso!');
      setForm({ nome: '', telefone: '', email: '' });
    } catch (err) {
      setErro(err.response?.data?.message || err.message || 'Erro ao realizar matrícula.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <Navbar />
      <PageHero
        badge="Formação Cristã"
        badgeIcon={FaGraduationCap}
        titulo="Escola Bíblica e Discipulado"
        subtitulo="Cresça no conhecimento da Palavra de Deus! Inscreva-se na Classe de Batismo, Discipulado ou Escola de Líderes da Igreja MIR."
      />
      <main className="min-h-screen bg-gray-50 py-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Carregando turmas...</div>
          ) : lista.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 max-w-xl mx-auto">
              <FaBookOpen className="w-12 h-12 text-purple-300 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Novas turmas em breve
              </h3>
              <p className="text-gray-600 text-sm">
                Acompanhe os avisos nos cultos de domingo para a abertura das próximas classes.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {lista.map((c) => (
                <div
                  key={c._id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {c.imagem && (
                      <div className="h-44 w-full overflow-hidden">
                        <img
                          src={c.imagem}
                          alt={c.titulo}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6 pb-0">
                    <span className="inline-block text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full mb-3">
                      {CATEGORIAS[c.categoria] || 'Escola Bíblica'}
                    </span>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{c.titulo}</h2>
                    <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                      {c.descricao}
                    </p>

                    <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-xs text-gray-700 mb-5">
                      {c.professor && (
                        <div className="flex items-center gap-2">
                          <FaUserTie className="text-purple-600" />
                          <span>
                            <strong>Professor(a):</strong> {c.professor}
                          </span>
                        </div>
                      )}
                      {c.horario && (
                        <div className="flex items-center gap-2">
                          <FaClock className="text-purple-600" />
                          <span>
                            {c.horario} {c.duracao ? `• ${c.duracao}` : ''}
                          </span>
                        </div>
                      )}
                      {c.local && (
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-purple-600" />
                          <span>{c.local}</span>
                        </div>
                      )}
                    </div>
                    </div>
                  </div>

                  <div className="p-6 pt-2 space-y-2">
                    {c.materialUrl && (
                      <a
                        href={c.materialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-2.5 text-center rounded-xl border border-purple-200 text-purple-700 font-semibold text-xs hover:bg-purple-50"
                      >
                        Baixar Material / Apostila (PDF)
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setSelecionado(c);
                        setSucesso('');
                      }}
                      disabled={!c.inscricoesAbertas}
                      className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50"
                    >
                      {c.inscricoesAbertas
                        ? 'Fazer Matrícula Gratuita'
                        : 'Matrículas Encerradas'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Matrícula */}
        {selecionado && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
              <button
                onClick={() => setSelecionado(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-5 h-5" />
              </button>

              {sucesso ? (
                <div className="text-center py-6">
                  <FaCheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Matrícula Confirmada!
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">{sucesso}</p>
                  <button
                    onClick={() => setSelecionado(null)}
                    className="px-6 py-2.5 bg-purple-700 text-white rounded-xl font-semibold text-sm"
                  >
                    Fechar
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Matrícula: {selecionado.titulo}
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    Inscreva-se gratuitamente nesta turma da Igreja MIR.
                  </p>
                  {erro && (
                    <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-800 text-xs animate-fade-in">
                      <FaExclamationCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>{erro}</span>
                    </div>
                  )}
                  <form onSubmit={handleMatricular} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.nome}
                        onChange={(e) => setForm({ ...form, nome: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Telefone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.telefone}
                        onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        E-mail (opcional)
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={enviando}
                      className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-semibold text-sm"
                    >
                      {enviando ? 'Confirmando...' : 'Confirmar Matrícula'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

