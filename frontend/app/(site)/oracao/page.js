'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { oracoes as oracoesApi } from '@/lib/api';
import {
  FaPrayingHands,
  FaLock,
  FaGlobe,
  FaHeart,
  FaCheckCircle,
  FaExclamationCircle,
  FaUserSecret
} from 'react-icons/fa';

export default function OracaoPublicPage() {
  const [mural, setMural] = useState([]);
  const [loadingMural, setLoadingMural] = useState(true);
  const [oradosLocal, setOradosLocal] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState('');
  const [erro, setErro] = useState('');
  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    email: '',
    tipo: 'oracao',
    pedido: '',
    privacidade: 'publico',
    anonimo: false
  });

  const carregarMural = async () => {
    try {
      const res = await oracoesApi.getPublicas();
      setMural(res.data || []);
    } catch (err) {
      console.error('Erro ao carregar mural de oração:', err);
    } finally {
      setLoadingMural(false);
    }
  };

  useEffect(() => {
    carregarMural();
    try {
      const saved = JSON.parse(localStorage.getItem('mir-oracoes-feitas') || '[]');
      setOradosLocal(saved);
    } catch (_) {}
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setSucesso('');
    setErro('');
    try {
      const res = await oracoesApi.create(form);
      setSucesso(res.data?.message || 'Pedido enviado com sucesso!');
      setForm({
        nome: '',
        telefone: '',
        email: '',
        tipo: 'oracao',
        pedido: '',
        privacidade: 'publico',
        anonimo: false
      });
      if (form.privacidade === 'publico') {
        carregarMural();
      }
    } catch (err) {
      setErro(err.response?.data?.message || err.message || 'Erro ao enviar pedido de oração');
    } finally {
      setEnviando(false);
    }
  };

  const handleOrarPorPedido = async (id) => {
    if (oradosLocal.includes(id)) return;
    try {
      const res = await oracoesApi.orar(id);
      setMural((prev) =>
        prev.map((item) =>
          item._id === id
            ? { ...item, contadorOracoes: res.data.contadorOracoes }
            : item
        )
      );
      const novos = [...oradosLocal, id];
      setOradosLocal(novos);
      localStorage.setItem('mir-oracoes-feitas', JSON.stringify(novos));
    } catch (err) {
      console.error('Erro ao registrar oração:', err);
    }
  };

  return (
    <>
      <Navbar />
      <PageHero
        badge="Intercessão e Cuidado Pastoral"
        badgeIcon={FaPrayingHands}
        titulo="Central de Oração e Aconselhamento"
        subtitulo="“Orai uns pelos outros, para serdes curados. Muito pode, por sua eficácia, a súplica do justo.” — Tiago 5:16"
      />
      <main className="min-h-screen bg-gray-50 py-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Formulário */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 sticky top-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Envie o seu Pedido
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Partilhe a sua causa no mural da igreja ou envie de forma confidencial apenas para os pastores.
              </p>

              {sucesso && (
                <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-3 text-green-800 text-sm animate-fade-in">
                  <FaCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{sucesso}</span>
                </div>
              )}

              {erro && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-sm animate-fade-in">
                  <FaExclamationCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>{erro}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tipo de Solicitação
                  </label>
                  <select
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="oracao">Pedido de Oração / Intercessão</option>
                    <option value="aconselhamento">Pedido de Aconselhamento Pastoral</option>
                    <option value="gratidao">Ação de Graças / Gratidão</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, privacidade: 'publico' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      form.privacidade === 'publico'
                        ? 'border-purple-600 bg-purple-50 text-purple-900'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold text-xs mb-1">
                      <FaGlobe className="text-purple-600" />
                      Mural Público
                    </div>
                    <p className="text-[11px] opacity-80">
                      Toda a igreja poderá interceder por si
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setForm({ ...form, privacidade: 'pastoral' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      form.privacidade === 'pastoral'
                        ? 'border-purple-600 bg-purple-50 text-purple-900'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold text-xs mb-1">
                      <FaLock className="text-amber-600" />
                      Só Pastores
                    </div>
                    <p className="text-[11px] opacity-80">
                      100% confidencial para a equipa pastoral
                    </p>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Seu Nome {!form.anonimo && '*'}
                  </label>
                  <input
                    type="text"
                    required={!form.anonimo}
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    placeholder={form.anonimo ? 'Será exibido como Anônimo' : 'Seu nome'}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm"
                  />
                </div>

                {form.privacidade === 'publico' && (
                  <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.anonimo}
                      onChange={(e) => setForm({ ...form, anonimo: e.target.checked })}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <FaUserSecret className="text-gray-500" />
                    <span>Ocultar meu nome no mural público (Exibir como Anônimo)</span>
                  </label>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Telefone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={form.telefone}
                      onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                      placeholder="+244 923 000 000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
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
                      placeholder="seu@email.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Descreva o seu Pedido *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.pedido}
                    onChange={(e) => setForm({ ...form, pedido: e.target.value })}
                    placeholder="Escreva aqui o seu motivo de oração, família, saúde ou pedido de aconselhamento..."
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full py-3.5 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-xl shadow-sm transition-colors disabled:opacity-50"
                >
                  {enviando ? 'Enviando...' : 'Enviar Pedido de Oração'}
                </button>
              </form>
            </div>
          </div>

          {/* Mural de Oração */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Mural de Intercessão da Igreja
                </h2>
                <p className="text-sm text-gray-600">
                  Una a sua fé com a dos nossos irmãos clicando em &ldquo;Eu orei por você&rdquo;.
                </p>
              </div>
            </div>

            {loadingMural ? (
              <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
                Carregando pedidos de oração...
              </div>
            ) : mural.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <FaPrayingHands className="w-12 h-12 text-purple-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  Seja o primeiro a publicar um pedido no mural
                </h3>
                <p className="text-sm text-gray-500">
                  A nossa equipa de intercessão está pronta para clamar consigo.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {mural.map((item) => {
                  const jaOrou = oradosLocal.includes(item._id);
                  return (
                    <div
                      key={item._id}
                      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-purple-200 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">{item.nome}</span>
                            <span
                              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                                item.tipo === 'gratidao'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-purple-100 text-purple-700'
                              }`}
                            >
                              {item.tipo === 'gratidao' ? 'Gratidão' : 'Intercessão'}
                            </span>
                            {item.status === 'em_oracao' && (
                              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                Equipa Pastoral em Oração
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(item.createdAt).toLocaleDateString('pt-AO', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>

                        <button
                          onClick={() => handleOrarPorPedido(item._id)}
                          disabled={jaOrou}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                            jaOrou
                              ? 'bg-purple-100 text-purple-800 cursor-default'
                              : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm'
                          }`}
                        >
                          <FaHeart className={jaOrou ? 'text-purple-600' : 'text-pink-200'} />
                          <span>
                            {jaOrou ? 'Orei por si' : 'Eu orei por você'} ({item.contadorOracoes || 0})
                          </span>
                        </button>
                      </div>

                      <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                        {item.pedido}
                      </p>

                      {item.respostaPastoral && (
                        <div className="mt-4 p-3.5 rounded-xl bg-purple-50 border border-purple-100 text-xs text-purple-900">
                          <p className="font-bold mb-1">Palavra Pastoral:</p>
                          <p>{item.respostaPastoral}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

