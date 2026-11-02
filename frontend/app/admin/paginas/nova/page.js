'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Swal from 'sweetalert2';
import useAuthStore from '@/store/useAuthStore';
import { ImageUploader } from '@/components/common';
import { menus as menusApi } from '@/lib/api';

// Importar GrapesEditor dinamicamente (client-side only)
const GrapesEditor = dynamic(() => import('@/components/editor/GrapesEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando editor...</p>
      </div>
    </div>
  ),
});

export default function NovaPagina() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [parentMenus, setParentMenus] = useState([]);
  const [templateTrigger, setTemplateTrigger] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    slug: '',
    conteudo: '',
    metaDescricao: '',
    usarCorPadrao: true,
    corFundo: '#ffffff',
    corTexto: '',
    fonteTitulo: '',
    larguraConteudo: 'normal',
    mostrarHero: true,
    mostrarCta: true,
    imagemHero: '',
    posicaoImagemHero: 'center',
    alturaHero: '',
    menu: false,
    parentMenuId: '',
    status: 'publicado',
    ativa: true,
    destaque: false,
  });

  useEffect(() => {
    menusApi
      .getAll()
      .then((res) => {
        const all = res.data || [];
        setParentMenus(all.filter((m) => !m.parentId));
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nextValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({
      ...prev,
      [name]: nextValue,
      ...(name === 'status' ? { ativa: nextValue === 'publicado' } : {})
    }));

    // Auto-gerar slug do título
    if (name === 'titulo') {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9/]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.slug) {
      Swal.fire({
        icon: 'error',
        title: 'Campos obrigatórios',
        text: 'Por favor, preencha o título e o slug',
        confirmButtonColor: '#9333ea',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/paginas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar página');
      }

      await Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Página criada com sucesso',
        timer: 1500,
        showConfirmButton: false,
      });

      router.push('/admin/paginas');
    } catch (error) {
      console.error('Erro:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Erro ao criar página. Tente novamente.',
        confirmButtonColor: '#9333ea',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header Fixo */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/paginas')}
                className="text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                title="Voltar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Nova Página</h1>
                <p className="text-sm text-gray-500">Editor visual drag & drop</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => router.push('/admin/paginas')}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Publicar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content - Tela Cheia */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor - Ocupa toda a largura */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Título e Modelos Prontos */}
          <div className="bg-gray-50 border-b border-gray-200 px-4 md:px-6 py-3 space-y-3">
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Digite o título da página (ex: Quem Somos, Rede de Jovens, Conferência)..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-semibold"
              required
            />

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-1">
                Começar com Modelo Pronto:
              </span>
              {[
                {
                  label: '🏛️ Institucional / Quem Somos',
                  html: `
                    <div style="max-width: 1100px; margin: 0 auto; font-family: 'Inter', sans-serif;">
                      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 36px; align-items: center; margin: 20px 0 48px;">
                        <div>
                          <span style="display: inline-block; background: #f3e8ff; color: #7e22ce; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 9999px; margin-bottom: 12px; text-transform: uppercase;">Nossa História & Identidade</span>
                          <h2 style="font-size: 2.25rem; font-weight: 800; color: #1f2937; margin-bottom: 16px;">Uma Igreja Chamada para Restaurar Vidas</h2>
                          <p style="color: #4b5563; line-height: 1.8; margin-bottom: 16px;">
                            O Ministério Internacional da Restauração nasceu com o propósito de anunciar o Evangelho de Jesus Cristo, formar discípulos comprometidos com a Palavra e servir as famílias com amor e excelência.
                          </p>
                          <p style="color: #4b5563; line-height: 1.8;">
                            Cremos no poder transformador do Espírito Santo e na comunhão fraterna que edifica cada membro para cumprir o seu chamado.
                          </p>
                        </div>
                        <div>
                          <img src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=900&auto=format&fit=crop&q=80" alt="Igreja MIR" style="width: 100%; border-radius: 20px; box-shadow: 0 12px 30px rgba(0,0,0,0.12); object-fit: cover; max-height: 400px;" />
                        </div>
                      </div>
                      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin: 40px 0;">
                        <div style="background: #faf5ff; border-radius: 16px; padding: 28px; border: 1px solid #e9d5ff;">
                          <h3 style="font-size: 20px; font-weight: 700; color: #581c87; margin-bottom: 10px;">🎯 Nossa Missão</h3>
                          <p style="color: #4b5563; line-height: 1.6;">Levar cada pessoa a um encontro verdadeiro com Cristo, discipulando e integrando na família da fé.</p>
                        </div>
                        <div style="background: #faf5ff; border-radius: 16px; padding: 28px; border: 1px solid #e9d5ff;">
                          <h3 style="font-size: 20px; font-weight: 700; color: #581c87; margin-bottom: 10px;">👁️ Nossa Visão</h3>
                          <p style="color: #4b5563; line-height: 1.6;">Ser uma igreja referência no ensino bíblico, adoração genuína e transformação social e espiritual.</p>
                        </div>
                        <div style="background: #faf5ff; border-radius: 16px; padding: 28px; border: 1px solid #e9d5ff;">
                          <h3 style="font-size: 20px; font-weight: 700; color: #581c87; margin-bottom: 10px;">💛 Nossos Valores</h3>
                          <p style="color: #4b5563; line-height: 1.6;">Fidelidade às Escrituras, oração contínua, santidade, família, generosidade e serviço ao próximo.</p>
                        </div>
                      </div>
                    </div>
                  `,
                },
                {
                  label: '🙌 Ministério / Departamento',
                  html: `
                    <div style="max-width: 1100px; margin: 0 auto; font-family: 'Inter', sans-serif;">
                      <div style="background: linear-gradient(135deg, #581c87 0%, #9333ea 100%); color: white; border-radius: 24px; padding: 48px 32px; text-align: center; margin-bottom: 40px;">
                        <span style="display: inline-block; background: rgba(255,255,255,0.2); padding: 6px 16px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px;">Ministério em Ação</span>
                        <h2 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 12px; color: white;">Faça Parte Deste Ministério</h2>
                        <p style="font-size: 1.15rem; max-width: 680px; margin: 0 auto 24px; opacity: 0.92;">Junte-se a nós para servir ao Senhor com os seus dons, crescer em comunhão e abençoar vidas todas as semanas.</p>
                        <a href="/ministerios" style="display: inline-block; background: #facc15; color: #1f2937; font-weight: 700; padding: 14px 32px; border-radius: 9999px; text-decoration: none;">Quero Participar</a>
                      </div>
                      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; margin-bottom: 40px;">
                        <div style="background: white; padding: 28px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.06);">
                          <h4 style="font-size: 18px; font-weight: 700; color: #1f2937; margin-bottom: 8px;">📅 Nossos Encontros</h4>
                          <p style="color: #4b5563;">Sábados às 17h00 no Auditório Principal da Igreja MIR.</p>
                        </div>
                        <div style="background: white; padding: 28px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.06);">
                          <h4 style="font-size: 18px; font-weight: 700; color: #1f2937; margin-bottom: 8px;">👥 Liderança</h4>
                          <p style="color: #4b5563;">Equipa dedicada ao acompanhamento pastoral e discipulado.</p>
                        </div>
                        <div style="background: white; padding: 28px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.06);">
                          <h4 style="font-size: 18px; font-weight: 700; color: #1f2937; margin-bottom: 8px;">📖 Propósito</h4>
                          <p style="color: #4b5563;">Edificar vidas através do ensino da Palavra, louvor e serviço.</p>
                        </div>
                      </div>
                    </div>
                  `,
                },
                {
                  label: '🔥 Campanha / Conferência',
                  html: `
                    <div style="max-width: 1100px; margin: 0 auto; font-family: 'Inter', sans-serif;">
                      <div style="background: #111827; color: white; border-radius: 24px; padding: 56px 32px; text-align: center; margin-bottom: 40px;">
                        <span style="color: #facc15; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; font-size: 13px;">Convocação Especial</span>
                        <h2 style="font-size: 2.75rem; font-weight: 800; margin: 12px 0 16px; color: white;">Conferência de Avivamento e Restauração</h2>
                        <p style="color: #d1d5db; font-size: 1.15rem; max-width: 650px; margin: 0 auto 28px;">Dias de clamor, ensino profundo da Palavra e renovo espiritual para toda a família.</p>
                        <a href="/eventos" style="display: inline-block; background: #9333ea; color: white; font-weight: 700; padding: 14px 36px; border-radius: 9999px; text-decoration: none;">Fazer Inscrição Gratuita</a>
                      </div>
                      <div style="background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%); border-left: 6px solid #9333ea; border-radius: 16px; padding: 32px; text-align: center;">
                        <p style="font-family: 'Playfair Display', serif; font-size: 1.4rem; font-style: italic; color: #3b0764; margin-bottom: 10px;">
                          &ldquo;Aviva, ó Senhor, a tua obra no meio dos anos, no meio dos anos a notifica.&rdquo;
                        </p>
                        <span style="font-weight: 700; color: #9333ea; text-transform: uppercase; font-size: 0.85rem;">Habacuque 3:2</span>
                      </div>
                    </div>
                  `,
                },
                {
                  label: '📄 Limpar / Em Branco',
                  html: '',
                },
              ].map((tpl) => (
                <button
                  key={tpl.label}
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, conteudo: tpl.html }));
                    setTemplateTrigger({ html: tpl.html, ts: Date.now() });
                  }}
                  className="px-3 py-1.5 text-xs font-semibold rounded-full bg-white border border-purple-200 text-purple-800 hover:bg-purple-600 hover:text-white transition shadow-sm"
                >
                  {tpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Editor GrapesJS - Tela Cheia */}
          <div className="flex-1 overflow-hidden">
            <GrapesEditor
              value={formData.conteudo}
              templateTrigger={templateTrigger}
              onChange={(content) => setFormData(prev => ({ ...prev, conteudo: content }))}
              className="h-full"
            />
          </div>
        </div>

        {/* Sidebar Direita - Configurações - Fixa e Responsiva */}
        <div className="hidden lg:block w-80 bg-white border-l border-gray-200 flex-shrink-0">
          <div className="h-full overflow-y-auto">
            <div className="p-6 space-y-6">
            {/* Status */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Publicação</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="rascunho">Rascunho</option>
                    <option value="publicado">Publicado</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="destaque"
                    id="destaque"
                    checked={formData.destaque}
                    onChange={handleChange}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="destaque" className="ml-2 text-sm text-gray-700">
                    Destacar página
                  </label>
                </div>

                <div className="pt-2 border-t border-gray-100 space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="menu"
                      id="menu"
                      checked={formData.menu}
                      onChange={handleChange}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="menu" className="ml-2 text-xs font-semibold text-purple-800">
                      Adicionar ao Menu de Navegação
                    </label>
                  </div>

                  {formData.menu && (
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Posição no Menu
                      </label>
                      <select
                        name="parentMenuId"
                        value={formData.parentMenuId}
                        onChange={handleChange}
                        className="w-full px-2.5 py-1.5 text-xs border border-purple-200 rounded-lg bg-purple-50/40"
                      >
                        <option value="">Menu Principal (Topo)</option>
                        {parentMenus.map((pm) => (
                          <option key={pm._id} value={pm._id}>
                            Submenu de: {pm.titulo || pm.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200"></div>

            {/* SEO */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">SEO</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Slug (URL)
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">/</span>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      placeholder="url-da-pagina"
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Gerado automaticamente do título
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Meta Descrição (Subtítulo Hero)
                  </label>
                  <textarea
                    name="metaDescricao"
                    rows={3}
                    maxLength={160}
                    value={formData.metaDescricao}
                    onChange={handleChange}
                    placeholder="Breve descrição da página (até 160 caracteres)"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200"></div>

            {/* Design & Aparência da Página */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Design & Hero da Página</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="usarCorPadrao"
                    id="usarCorPadrao"
                    checked={formData.usarCorPadrao}
                    onChange={handleChange}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="usarCorPadrao" className="ml-2 text-xs font-medium text-gray-700">
                    Usar cor de fundo padrão do tema
                  </label>
                </div>

                {!formData.usarCorPadrao && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Cor de Fundo Desta Página
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        name="corFundo"
                        value={formData.corFundo || '#ffffff'}
                        onChange={handleChange}
                        className="h-9 w-12 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        name="corFundo"
                        value={formData.corFundo || '#ffffff'}
                        onChange={handleChange}
                        className="flex-1 px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                )}

                <ImageUploader
                  label="Imagem de Fundo do Hero (Opcional)"
                  helperText="Se vazia, usa o estilo padrão de páginas internas definido no Tema."
                  value={formData.imagemHero}
                  onChange={(val) => setFormData((prev) => ({ ...prev, imagemHero: val }))}
                  aspectRatio="banner"
                  showPositionControl={true}
                  positionValue={formData.posicaoImagemHero}
                  onPositionChange={(pos) => setFormData((prev) => ({ ...prev, posicaoImagemHero: pos }))}
                />

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Altura do Hero
                  </label>
                  <select
                    name="alturaHero"
                    value={formData.alturaHero}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg"
                  >
                    <option value="">Padrão do Tema</option>
                    <option value="small">Compacto</option>
                    <option value="medium">Médio</option>
                    <option value="large">Grande</option>
                    <option value="xlarge">Extra Grande</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Fonte dos Títulos Desta Página
                  </label>
                  <select
                    name="fonteTitulo"
                    value={formData.fonteTitulo}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg"
                  >
                    <option value="">Padrão do Tema</option>
                    <option value="Playfair Display">Playfair Display</option>
                    <option value="Cinzel">Cinzel</option>
                    <option value="Merriweather">Merriweather</option>
                    <option value="Lora">Lora</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Inter">Inter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Cor do Texto (Opcional)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.corTexto || '#1F2937'}
                      onChange={(e) => setFormData((prev) => ({ ...prev, corTexto: e.target.value }))}
                      className="h-8 w-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      name="corTexto"
                      value={formData.corTexto}
                      onChange={handleChange}
                      placeholder="Padrão do tema"
                      className="flex-1 px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Largura do Conteúdo
                  </label>
                  <select
                    name="larguraConteudo"
                    value={formData.larguraConteudo}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg"
                  >
                    <option value="narrow">Estreita / Leitura (896px)</option>
                    <option value="normal">Normal (1280px)</option>
                    <option value="full">Largura Total (100%)</option>
                  </select>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="mostrarHero"
                      id="mostrarHero"
                      checked={formData.mostrarHero}
                      onChange={handleChange}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded"
                    />
                    <label htmlFor="mostrarHero" className="ml-2 text-xs text-gray-700">
                      Exibir Banner Hero no topo
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="mostrarCta"
                      id="mostrarCta"
                      checked={formData.mostrarCta}
                      onChange={handleChange}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded"
                    />
                    <label htmlFor="mostrarCta" className="ml-2 text-xs text-gray-700">
                      Exibir Faixa de Convite (CTA) no final
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200"></div>

            {/* Dicas */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-purple-900 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Dicas Rápidas
              </h3>
              <ul className="space-y-1 text-xs text-purple-800">
                <li>• Arraste blocos para o canvas</li>
                <li>• Clique para editar elementos</li>
                <li>• Use ícones do topo para dispositivos</li>
                <li>• Blocos da igreja na categoria "Igreja"</li>
              </ul>
            </div>
            </div>
          </div>
        </div>

        {/* Botão Flutuante para Mobile - Abre Configurações */}
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-50 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
          title="Configurações"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Sidebar Mobile - Overlay */}
        {mobileSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <div
              className="absolute right-0 top-0 h-full w-80 max-w-full bg-white shadow-xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Configurações</h3>
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Status */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Publicação</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="rascunho">Rascunho</option>
                        <option value="publicado">Publicado</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="destaque"
                        id="destaque-mobile"
                        checked={formData.destaque}
                        onChange={handleChange}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <label htmlFor="destaque-mobile" className="ml-2 text-sm text-gray-700">
                        Destacar página
                      </label>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200"></div>

                {/* SEO */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">SEO</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Slug (URL)
                      </label>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">/</span>
                        <input
                          type="text"
                          name="slug"
                          value={formData.slug}
                          onChange={handleChange}
                          placeholder="url-da-pagina"
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Meta Descrição (Subtítulo Hero)
                      </label>
                      <textarea
                        name="metaDescricao"
                        rows={3}
                        maxLength={160}
                        value={formData.metaDescricao}
                        onChange={handleChange}
                        placeholder="Breve descrição da página (até 160 caracteres)"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
