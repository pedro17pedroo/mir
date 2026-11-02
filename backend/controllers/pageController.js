import Page from '../models/Page.js';
import { validationResult } from 'express-validator';

// Função para processar HTML e aplicar estilos inline nas imagens
const processarAlinhamentoImagens = (html) => {
  if (!html) return html;
  
  // Processar imagens em parágrafos centralizados
  html = html.replace(
    /<p class="ql-align-center">(.*?)<img(.*?)>(.*?)<\/p>/gi,
    (match, before, imgAttrs, after) => {
      // Adicionar estilos inline na imagem
      const newImgAttrs = imgAttrs.includes('style=')
        ? imgAttrs.replace(/style="([^"]*)"/, 'style="$1 display: block; margin-left: auto; margin-right: auto;"')
        : imgAttrs + ' style="display: block; margin-left: auto; margin-right: auto;"';
      return `<p class="ql-align-center">${before}<img${newImgAttrs}>${after}</p>`;
    }
  );
  
  // Processar imagens em parágrafos alinhados à direita
  html = html.replace(
    /<p class="ql-align-right">(.*?)<img(.*?)>(.*?)<\/p>/gi,
    (match, before, imgAttrs, after) => {
      const newImgAttrs = imgAttrs.includes('style=')
        ? imgAttrs.replace(/style="([^"]*)"/, 'style="$1 display: block; margin-left: auto; margin-right: 0;"')
        : imgAttrs + ' style="display: block; margin-left: auto; margin-right: 0;"';
      return `<p class="ql-align-right">${before}<img${newImgAttrs}>${after}</p>`;
    }
  );
  
  // Processar imagens em parágrafos alinhados à esquerda
  html = html.replace(
    /<p class="ql-align-left">(.*?)<img(.*?)>(.*?)<\/p>/gi,
    (match, before, imgAttrs, after) => {
      const newImgAttrs = imgAttrs.includes('style=')
        ? imgAttrs.replace(/style="([^"]*)"/, 'style="$1 display: block; margin-left: 0; margin-right: auto;"')
        : imgAttrs + ' style="display: block; margin-left: 0; margin-right: auto;"';
      return `<p class="ql-align-left">${before}<img${newImgAttrs}>${after}</p>`;
    }
  );
  
  return html;
};

// @desc    Obter todas as páginas
// @route   GET /api/paginas
// @access  Público
export const getPaginas = async (req, res, next) => {
  try {
    const { ativa, menu, search } = req.query;
    const filter = {};
    
    // Filtrar por status de ativação
    if (ativa === 'true' || ativa === 'false') {
      filter.ativa = ativa === 'true';
    }
    
    // Filtrar por páginas que devem aparecer no menu
    if (menu === 'true') {
      filter.menu = true;
      filter.ativa = true; // Garantir que só retorne páginas ativas no menu
    }
    
    // Busca por texto
    if (search) {
      filter.$text = { $search: search };
    }
    
    const paginas = await Page.find(filter)
      .sort({ ordemMenu: 1, titulo: 1 })
      .select('-__v -updatedAt')
      .populate('criadoPor', 'nome')
      .populate('atualizadoPor', 'nome');
      
    res.json(paginas);
  } catch (err) {
    next(err);
  }
};

// @desc    Obter uma página por ID
// @route   GET /api/paginas/:id
// @access  Público
export const getPaginaPorId = async (req, res, next) => {
  try {
    const pagina = await Page.findById(req.params.id)
      .select('-__v')
      .populate('criadoPor', 'nome')
      .populate('atualizadoPor', 'nome');
      
    if (!pagina) {
      return res.status(404).json({ mensagem: 'Página não encontrada' });
    }
    
    res.json(pagina);
  } catch (err) {
    next(err);
  }
};

// @desc    Obter uma página por slug
// @route   GET /api/paginas/slug/:slug
// @access  Público
export const getPaginaPorSlug = async (req, res, next) => {
  try {
    const rawSlug = (req.params.slug || req.params[0] || '').replace(/^\/+|\/+$/g, '').toLowerCase();
    const pagina = await Page.findOne({ 
      slug: rawSlug,
      ativa: true 
    })
    .select('-__v -atualizadoPor -criadoPor -menu -ordemMenu -createdAt -updatedAt');
    
    if (!pagina) {
      return res.status(404).json({ mensagem: 'Página não encontrada' });
    }
    
    res.json(pagina);
  } catch (err) {
    next(err);
  }
};

// @desc    Criar uma nova página
// @route   POST /api/paginas
// @access  Privado (Admin)
export const criarPagina = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ erros: errors.array() });
  }
  
  try {
    const {
      titulo,
      slug: rawSlug,
      conteudo,
      metaDescricao,
      corFundo,
      usarCorPadrao,
      imagemHero,
      posicaoImagemHero,
      alturaHero,
      corTexto,
      fonteTitulo,
      larguraConteudo,
      mostrarHero,
      mostrarCta,
      ativa,
      status,
      destaque,
      menu,
      ordemMenu,
      parentMenuId
    } = req.body;
    const slug = (rawSlug || '').replace(/^\/+|\/+$/g, '').toLowerCase();
    
    // Verificar se já existe uma página com o mesmo slug
    const paginaExistente = await Page.findOne({ slug });
    if (paginaExistente) {
      return res.status(400).json({ mensagem: 'Já existe uma página com este slug' });
    }
    
    // Processar o conteúdo para garantir alinhamento das imagens
    const conteudoProcessado = processarAlinhamentoImagens(conteudo);
    const ativaFinal = ativa !== undefined ? ativa : (status ? status === 'publicado' : true);
    const statusFinal = status || (ativaFinal ? 'publicado' : 'rascunho');
    
    const novaPagina = new Page({
      titulo,
      slug,
      conteudo: conteudoProcessado,
      metaDescricao,
      corFundo: corFundo !== undefined ? corFundo : null,
      usarCorPadrao: usarCorPadrao !== undefined ? usarCorPadrao : true,
      imagemHero: imagemHero || '',
      posicaoImagemHero: posicaoImagemHero || 'center',
      alturaHero: alturaHero || '',
      corTexto: corTexto || '',
      fonteTitulo: fonteTitulo || '',
      larguraConteudo: larguraConteudo || 'normal',
      mostrarHero: mostrarHero !== false,
      mostrarCta: mostrarCta !== false,
      ativa: ativaFinal,
      status: statusFinal,
      destaque: Boolean(destaque),
      menu: menu || false,
      ordemMenu: menu ? (ordemMenu || 0) : 0,
      criadoPor: req.user.id
    });
    
    const paginaSalva = await novaPagina.save();

    // Se o utilizador pediu para adicionar automaticamente ao Menu de Navegação
    if (menu) {
      const Menu = (await import('../models/Menu.js')).default;
      const targetUrl = slug === 'inicio' ? '/' : `/${slug}`;
      const existingMenu = await Menu.findOne({ url: targetUrl });
      if (!existingMenu) {
        await Menu.create({
          titulo,
          url: targetUrl,
          ordem: ordemMenu || 0,
          ativo: true,
          parentId: parentMenuId || null
        });
      }
    }
    
    res.status(201).json({
      mensagem: 'Página criada com sucesso',
      pagina: paginaSalva
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Atualizar uma página
// @route   PUT /api/paginas/:id
// @access  Privado (Admin)
export const atualizarPagina = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ erros: errors.array() });
  }
  
  try {
    const {
      titulo,
      slug: rawSlug,
      conteudo,
      metaDescricao,
      corFundo,
      usarCorPadrao,
      imagemHero,
      posicaoImagemHero,
      alturaHero,
      corTexto,
      fonteTitulo,
      larguraConteudo,
      mostrarHero,
      mostrarCta,
      ativa,
      status,
      destaque,
      menu,
      ordemMenu,
      parentMenuId
    } = req.body;
    const slug = rawSlug ? rawSlug.replace(/^\/+|\/+$/g, '').toLowerCase() : undefined;
    
    // Verificar se a página existe
    let pagina = await Page.findById(req.params.id);
    if (!pagina) {
      return res.status(404).json({ mensagem: 'Página não encontrada' });
    }
    
    // Verificar se já existe outra página com o mesmo slug
    if (slug && slug !== pagina.slug) {
      const paginaComMesmoSlug = await Page.findOne({ slug, _id: { $ne: req.params.id } });
      if (paginaComMesmoSlug) {
        return res.status(400).json({ mensagem: 'Já existe uma página com este slug' });
      }
    }
    
    // Atualizar os campos
    pagina.titulo = titulo || pagina.titulo;
    pagina.slug = slug || pagina.slug;
    
    // Processar o conteúdo para garantir alinhamento das imagens
    if (conteudo) {
      pagina.conteudo = processarAlinhamentoImagens(conteudo);
    }
    
    if (metaDescricao !== undefined) pagina.metaDescricao = metaDescricao;
    if (corFundo !== undefined) pagina.corFundo = corFundo;
    if (usarCorPadrao !== undefined) pagina.usarCorPadrao = usarCorPadrao;
    if (imagemHero !== undefined) pagina.imagemHero = imagemHero;
    if (posicaoImagemHero !== undefined) pagina.posicaoImagemHero = posicaoImagemHero;
    if (alturaHero !== undefined) pagina.alturaHero = alturaHero;
    if (corTexto !== undefined) pagina.corTexto = corTexto;
    if (fonteTitulo !== undefined) pagina.fonteTitulo = fonteTitulo;
    if (larguraConteudo !== undefined) pagina.larguraConteudo = larguraConteudo;
    if (mostrarHero !== undefined) pagina.mostrarHero = mostrarHero;
    if (mostrarCta !== undefined) pagina.mostrarCta = mostrarCta;
    if (destaque !== undefined) pagina.destaque = Boolean(destaque);
    
    if (ativa !== undefined) {
      pagina.ativa = ativa;
      pagina.status = ativa ? 'publicado' : 'rascunho';
    } else if (status !== undefined) {
      pagina.status = status;
      pagina.ativa = status === 'publicado';
    }

    if (menu !== undefined) {
      pagina.menu = menu;
      // Se estiver marcando para mostrar no menu, garante que tem uma ordem
      if (menu && ordemMenu === undefined && !pagina.ordemMenu) {
        pagina.ordemMenu = 0;
      }
    }
    if (ordemMenu !== undefined) pagina.ordemMenu = ordemMenu;
    
    pagina.atualizadoPor = req.user.id;
    
    const paginaAtualizada = await pagina.save();
    
    res.json({
      mensagem: 'Página atualizada com sucesso',
      pagina: paginaAtualizada
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Excluir uma página
// @route   DELETE /api/paginas/:id
// @access  Privado (Admin)
export const excluirPagina = async (req, res, next) => {
  try {
    const pagina = await Page.findById(req.params.id);
    
    if (!pagina) {
      return res.status(404).json({ mensagem: 'Página não encontrada' });
    }
    
    // Verificar se é uma página do sistema que não pode ser excluída
    const paginasSistema = ['inicio', 'sobre', 'contato', 'eventos', 'sermoes', 'doacoes'];
    if (paginasSistema.includes(pagina.slug)) {
      return res.status(400).json({ 
        mensagem: 'Esta é uma página do sistema e não pode ser excluída' 
      });
    }
    
    await Page.deleteOne({ _id: req.params.id });
    
    res.json({ mensagem: 'Página excluída com sucesso' });
  } catch (err) {
    next(err);
  }
};

// @desc    Atualizar a ordem das páginas no menu
// @route   PATCH /api/paginas/ordem
// @access  Privado (Admin)
export const atualizarOrdemMenu = async (req, res, next) => {
  try {
    const { paginas } = req.body;
    
    if (!Array.isArray(paginas)) {
      return res.status(400).json({ mensagem: 'Formato de dados inválido' });
    }
    
    // Atualizar a ordem de cada página
    const operacoes = paginas.map((pagina, index) => ({
      updateOne: {
        filter: { _id: pagina._id },
        update: { 
          $set: { 
            ordemMenu: index,
            menu: true,
            atualizadoPor: req.user.id 
          } 
        }
      }
    }));
    
    await Page.bulkWrite(operacoes);
    
    res.json({ mensagem: 'Ordem do menu atualizada com sucesso' });
  } catch (err) {
    next(err);
  }
};
