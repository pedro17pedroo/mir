'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaArrowUp,
  FaArrowDown,
  FaChevronDown,
  FaLink,
  FaPalette,
  FaFileAlt,
  FaEye,
  FaEyeSlash,
  FaExternalLinkAlt,
  FaStar
} from 'react-icons/fa';
import { menus, pages } from '@/lib/api';
import useSiteStore from '@/store/useSiteStore';
import Swal from 'sweetalert2';

const SYSTEM_ROUTES = [
  { label: 'Início (Home)', url: '/' },
  { label: 'Serviços e Cultos', url: '/servicos' },
  { label: 'Ministérios e Células', url: '/ministerios' },
  { label: 'Eventos', url: '/eventos' },
  { label: 'Galeria de Fotos', url: '/galeria' },
  { label: 'Devocional e Palavra Pastoral', url: '/devocional' },
  { label: 'Ensino - Vídeos', url: '/ensino/video' },
  { label: 'Ensino - Áudios', url: '/ensino/audio' },
  { label: 'Escola Bíblica e Cursos', url: '/ensino/cursos' },
  { label: 'Culto Ao Vivo (Livestream)', url: '/livestream' },
  { label: 'Pedidos de Oração', url: '/oracao' },
  { label: 'Sou Novo / Visitantes', url: '/sou-novo' },
  { label: 'Mural de Avisos', url: '/avisos' },
  { label: 'Escala de Obreiros', url: '/escalas' },
  { label: 'Dízimos e Ofertas', url: '/donate' },
  { label: 'Contacto', url: '/contato' }
];

const INITIAL_FORM = {
  titulo: '',
  url: '',
  pageId: '',
  ordem: 0,
  ativo: true,
  parentId: null,
  corTexto: '',
  corFundo: '',
  destaque: false,
  badge: '',
  corBadge: '#ef4444',
  abrirNovaAba: false,
  criarNovaPagina: false,
  novaPaginaMetaDescricao: ''
};

export default function MenusAdmin() {
  const [menusList, setMenusList] = useState([]);
  const [pagesList, setPagesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const reloadStoreMenus = useSiteStore(state => state.loadMenus);
  const storeTheme = useSiteStore(state => state.theme);
  const loadTheme = useSiteStore(state => state.loadTheme);
  const [formData, setFormData] = useState(INITIAL_FORM);

  useEffect(() => {
    loadMenus();
    loadPages();
    loadTheme();
  }, [loadTheme]);

  const loadMenus = async () => {
    try {
      setLoading(true);
      const response = await menus.getAll();
      const allMenus = response.data || [];

      const menuTree = allMenus
        .filter(m => !m.parentId)
        .sort((a, b) => a.ordem - b.ordem)
        .map(parent => ({
          ...parent,
          submenus: allMenus
            .filter(m => m.parentId === parent._id)
            .sort((a, b) => a.ordem - b.ordem)
        }));

      setMenusList(menuTree);
    } catch (error) {
      console.error('Erro:', error);
      setMenusList([]);
    } finally {
      setLoading(false);
    }
  };

  const loadPages = async () => {
    try {
      const response = await pages.getAll();
      setPagesList(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar páginas:', error);
      setPagesList([]);
    }
  };

  const handleOpenNew = (parentId = null) => {
    setEditingItem(null);
    const siblings = parentId
      ? menusList.find(m => m._id === parentId)?.submenus || []
      : menusList;
    setFormData({
      ...INITIAL_FORM,
      parentId,
      ordem: siblings.length
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);

    const associatedPage = pagesList.find(p => {
      const pageUrl = p.slug === 'inicio' ? '/' : `/${p.slug}`;
      return pageUrl === item.url;
    });

    setFormData({
      titulo: item.titulo || '',
      url: item.url || '',
      pageId: associatedPage?._id || '',
      ordem: item.ordem || 0,
      ativo: item.ativo !== false,
      parentId: item.parentId || null,
      corTexto: item.corTexto || '',
      corFundo: item.corFundo || '',
      destaque: Boolean(item.destaque),
      badge: item.badge || '',
      corBadge: item.corBadge || '#ef4444',
      abrirNovaAba: Boolean(item.abrirNovaAba),
      criarNovaPagina: false,
      novaPaginaMetaDescricao: ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      let finalUrl = formData.url;

      // Se o administrador pediu para criar automaticamente uma nova página CMS associada a este item
      if (formData.criarNovaPagina && formData.titulo) {
        const autoSlug = (formData.url || formData.titulo)
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9/]+/g, '-')
          .replace(/(^-|-$)/g, '');

        const pageRes = await pages.create({
          titulo: formData.titulo,
          slug: autoSlug,
          metaDescricao:
            formData.novaPaginaMetaDescricao ||
            `Página oficial de ${formData.titulo} — Igreja MIR`,
          conteudo: `<div style="padding: 20px 0;"><h2>${formData.titulo}</h2><p>Bem-vindo à página de <strong>${formData.titulo}</strong>. Pode editar este conteúdo visualmente no gestor de páginas.</p></div>`,
          status: 'publicado',
          ativa: true
        });

        const createdSlug = pageRes.data?.pagina?.slug || autoSlug;
        finalUrl = `/${createdSlug}`;
        await loadPages();
      } else if (formData.pageId) {
        const selectedPage = pagesList.find(p => p._id === formData.pageId);
        if (selectedPage) {
          finalUrl = selectedPage.slug === 'inicio' ? '/' : `/${selectedPage.slug}`;
        }
      }

      const dataToSend = {
        titulo: formData.titulo,
        url: finalUrl,
        ordem: formData.ordem,
        ativo: formData.ativo,
        parentId: formData.parentId || null,
        corTexto: formData.corTexto || '',
        corFundo: formData.corFundo || '',
        destaque: Boolean(formData.destaque),
        badge: formData.badge || '',
        corBadge: formData.corBadge || '#ef4444',
        abrirNovaAba: Boolean(formData.abrirNovaAba)
      };

      if (editingItem) {
        await menus.update(editingItem._id, dataToSend);
      } else {
        await menus.create(dataToSend);
      }

      setShowModal(false);
      setEditingItem(null);
      setFormData(INITIAL_FORM);
      await loadMenus();
      await reloadStoreMenus(true);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao salvar',
        text: error.message || 'Não foi possível guardar o item de menu.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAtivo = async (item) => {
    try {
      await menus.update(item._id, { ativo: !item.ativo });
      await loadMenus();
      await reloadStoreMenus(true);
    } catch (error) {
      console.error('Erro ao alternar status:', error);
    }
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: 'Excluir item do menu?',
      text: 'Se for um menu principal, verifique também os seus submenus.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    });
    if (!res.isConfirmed) return;
    try {
      await menus.delete(id);
      await loadMenus();
      await reloadStoreMenus(true);
    } catch (error) {
      alert('Erro ao excluir');
    }
  };

  const moveItem = async (parentIndex, subIndex, direction) => {
    const newList = [...menusList];

    if (subIndex !== undefined) {
      const submenus = [...newList[parentIndex].submenus];
      const targetIndex = direction === 'up' ? subIndex - 1 : subIndex + 1;
      if (targetIndex < 0 || targetIndex >= submenus.length) return;

      [submenus[subIndex], submenus[targetIndex]] = [submenus[targetIndex], submenus[subIndex]];
      submenus.forEach((item, i) => (item.ordem = i));
      newList[parentIndex].submenus = submenus;

      setMenusList(newList);
      try {
        await Promise.all(submenus.map(item => menus.update(item._id, { ordem: item.ordem })));
        reloadStoreMenus(true);
      } catch (error) {
        loadMenus();
      }
    } else {
      const targetIndex = direction === 'up' ? parentIndex - 1 : parentIndex + 1;
      if (targetIndex < 0 || targetIndex >= newList.length) return;

      [newList[parentIndex], newList[targetIndex]] = [newList[targetIndex], newList[parentIndex]];
      newList.forEach((item, i) => (item.ordem = i));

      setMenusList(newList);
      try {
        await Promise.all(newList.map(item => menus.update(item._id, { ordem: item.ordem })));
        reloadStoreMenus(true);
      } catch (error) {
        loadMenus();
      }
    }
  };

  const parentMenus = menusList.filter(m => !m.parentId);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Construtor de Menus e Submenus</h2>
          <p className="text-gray-600 mt-1">
            Crie menus principais, submenus (dropdown), personalize cores/destaques individuais e associe páginas
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/tema"
            className="flex items-center px-4 py-2 bg-white border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 text-sm font-medium"
          >
            <FaPalette className="mr-2" /> Cores & Fontes da Navbar / Dropdown
          </Link>
          <button
            onClick={() => handleOpenNew(null)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium shadow-sm"
          >
            <FaPlus className="mr-2" /> Novo Menu Principal
          </button>
        </div>
      </div>

      {/* Banner de Orientação: Cores dos Submenus no Portal Admin */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-sm flex-shrink-0">
            🎨
          </div>
          <div>
            <h4 className="text-sm font-bold text-purple-950">
              Personalização Global das Cores dos Submenus (Dropdown)
            </h4>
            <p className="text-xs text-purple-800 mt-0.5">
              Para ajustar a cor de fundo, cor do texto, efeitos de hover, contorno e sombra de todas as caixas suspensas, aceda a <strong>Tema &gt; Navbar/Menu &gt; Menu Dropdown</strong>. Também pode definir cores individuais por item na tabela abaixo.
            </p>
          </div>
        </div>
        <Link
          href="/admin/tema"
          className="whitespace-nowrap px-4 py-2 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
        >
          <span>Ajustar Cores no Tema</span>
          <span>→</span>
        </Link>
      </div>

      {/* Pré-visualização Interativa da Navbar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Pré-visualização em Tempo Real da Barra de Navegação
          </span>
          <span className="text-xs text-gray-500">
            {menusList.length} menus principais •{' '}
            {menusList.reduce((acc, m) => acc + (m.submenus?.length || 0), 0)} submenus
          </span>
        </div>
        <div
          className="rounded-xl px-6 py-4 flex items-center justify-between border overflow-x-auto"
          style={{
            backgroundColor: storeTheme?.navbarCorFundo || '#ffffff',
            borderColor: storeTheme?.navbarCorBorda || '#e5e7eb'
          }}
        >
          <div className="flex items-center gap-3 mr-6 flex-shrink-0">
            <img
              src={storeTheme?.logoUrl || '/logo.png'}
              alt="Logo"
              className="h-8 w-auto object-contain"
            />
          </div>
          <div className="flex items-center gap-5 flex-wrap">
            {menusList
              .filter(m => m.ativo)
              .map(m => (
                <div
                  key={m._id}
                  className={`flex items-center gap-1.5 text-sm font-semibold ${
                    m.destaque ? 'px-3.5 py-1.5 rounded-full shadow-sm' : ''
                  }`}
                  style={{
                    color: m.destaque
                      ? m.corTexto || '#ffffff'
                      : m.corTexto || storeTheme?.navbarCorTexto || '#1f2937',
                    backgroundColor: m.destaque
                      ? m.corFundo || storeTheme?.corPrimaria || '#9333ea'
                      : m.corFundo || 'transparent'
                  }}
                >
                  <span>{m.titulo}</span>
                  {m.badge && (
                    <span
                      className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-full text-white"
                      style={{ backgroundColor: m.corBadge || '#ef4444' }}
                    >
                      {m.badge}
                    </span>
                  )}
                  {m.submenus?.length > 0 && <FaChevronDown className="text-[10px] opacity-60" />}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Tabela Hierárquica de Menus e Submenus */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                 Estrutura do Menu / Submenu
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Destino (URL / Página)
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Estilo Individual
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Ordem
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                Ações Rápidas
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {menusList.map((item, parentIndex) => (
              <React.Fragment key={item._id}>
                {/* Menu Principal */}
                <tr className="hover:bg-purple-50/40 bg-gray-50/70 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    <div className="flex items-center gap-2">
                      {item.submenus?.length > 0 && (
                        <FaChevronDown className="text-purple-600 text-xs" />
                      )}
                      <span>{item.titulo}</span>
                      {item.badge && (
                        <span
                          className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full text-white"
                          style={{ backgroundColor: item.corBadge || '#ef4444' }}
                        >
                          {item.badge}
                        </span>
                      )}
                      {item.destaque && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-800 rounded-full">
                          <FaStar className="text-[9px]" /> Botão Destaque
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.url ? (
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs bg-white px-2.5 py-1 rounded border border-gray-200">
                        <FaLink className="text-gray-400" />
                        {item.url}
                        {item.abrirNovaAba && <FaExternalLinkAlt className="text-[10px] text-gray-400" />}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic text-xs">
                        Menu Dropdown ({item.submenus?.length || 0} submenus)
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {item.corTexto || item.corFundo ? (
                      <div className="flex items-center gap-2">
                        {item.corTexto && (
                          <span className="inline-flex items-center gap-1">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-gray-300"
                              style={{ backgroundColor: item.corTexto }}
                            />
                            Texto
                          </span>
                        )}
                        {item.corFundo && (
                          <span className="inline-flex items-center gap-1">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-gray-300"
                              style={{ backgroundColor: item.corFundo }}
                            />
                            Fundo
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">Padrão do Tema</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs">{item.ordem}</span>
                      <button
                        onClick={() => moveItem(parentIndex, undefined, 'up')}
                        disabled={parentIndex === 0}
                        className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                        title="Subir"
                      >
                        <FaArrowUp />
                      </button>
                      <button
                        onClick={() => moveItem(parentIndex, undefined, 'down')}
                        disabled={parentIndex === menusList.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                        title="Descer"
                      >
                        <FaArrowDown />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => handleToggleAtivo(item)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full transition ${
                        item.ativo
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {item.ativo ? <FaEye className="text-[10px]" /> : <FaEyeSlash className="text-[10px]" />}
                      {item.ativo ? 'Ativo' : 'Oculto'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleOpenNew(item._id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition"
                      title="Adicionar Submenu a este item"
                    >
                      <FaPlus className="text-[10px]" /> Submenu
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="p-1.5 text-purple-600 hover:bg-purple-50 rounded"
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item._id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      title="Excluir"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>

                {/* Submenus */}
                {item.submenus?.map((submenu, subIndex) => (
                  <tr key={submenu._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3.5 text-sm text-gray-700 pl-12">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">└─</span>
                        <span className="font-medium">{submenu.titulo}</span>
                        {submenu.badge && (
                          <span
                            className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-full text-white"
                            style={{ backgroundColor: submenu.corBadge || '#ef4444' }}
                          >
                            {submenu.badge}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-gray-500">
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                        <FaLink className="text-[10px] text-gray-400" />
                        {submenu.url}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-gray-500">
                      {submenu.corTexto || submenu.corFundo ? (
                        <div className="flex items-center gap-2">
                          {submenu.corTexto && (
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-gray-300"
                              style={{ backgroundColor: submenu.corTexto }}
                              title={`Texto: ${submenu.corTexto}`}
                            />
                          )}
                          {submenu.corFundo && (
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-gray-300"
                              style={{ backgroundColor: submenu.corFundo }}
                              title={`Fundo: ${submenu.corFundo}`}
                            />
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">Padrão Dropdown</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs">{submenu.ordem}</span>
                        <button
                          onClick={() => moveItem(parentIndex, subIndex, 'up')}
                          disabled={subIndex === 0}
                          className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                        >
                          <FaArrowUp />
                        </button>
                        <button
                          onClick={() => moveItem(parentIndex, subIndex, 'down')}
                          disabled={subIndex === item.submenus.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                        >
                          <FaArrowDown />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <button
                        type="button"
                        onClick={() => handleToggleAtivo(submenu)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                          submenu.ativo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {submenu.ativo ? 'Ativo' : 'Oculto'}
                      </button>
                    </td>
                    <td className="px-6 py-3.5 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(submenu)}
                        className="p-1.5 text-purple-600 hover:bg-purple-50 rounded"
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(submenu._id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Criar / Editar Item de Menu ou Submenu */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="relative bg-white rounded-2xl p-6 max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="border-b pb-3">
                <h3 className="text-lg font-bold text-gray-900">
                  {editingItem
                    ? `Editar: ${editingItem.titulo}`
                    : formData.parentId
                    ? 'Novo Submenu (Dropdown)'
                    : 'Novo Menu Principal'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Configure o título, o destino (página ou módulo) e as cores/etiquetas opcionais deste item.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Título no Menu *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Ex: Sobre Nós, Cultos, Jovens..."
                    className="w-full rounded-lg border-gray-300 px-3 py-2 border text-sm focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nível Hierárquico
                  </label>
                  <select
                    value={formData.parentId || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, parentId: e.target.value || null })
                    }
                    className="w-full rounded-lg border-gray-300 px-3 py-2 border text-sm"
                  >
                    <option value="">Menu Principal (Topo da Navbar)</option>
                    {parentMenus
                      .filter(p => p._id !== editingItem?._id)
                      .map(parent => (
                        <option key={parent._id} value={parent._id}>
                          Submenu dentro de: {parent.titulo}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Destino do Link: Módulo, Página CMS Existente, ou Criar Nova Página */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    Destino do Item de Menu
                  </span>
                  {!editingItem && (
                    <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.criarNovaPagina}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            criarNovaPagina: e.target.checked,
                            pageId: ''
                          })
                        }
                        className="rounded text-purple-600"
                      />
                      <FaFileAlt /> Criar página nova automaticamente
                    </label>
                  )}
                </div>

                {formData.criarNovaPagina ? (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 space-y-2">
                    <p className="text-xs text-purple-900 font-medium">
                      Uma nova página será criada automaticamente e ligada a este menu!
                    </p>
                    <div>
                      <label className="block text-xs text-purple-800 mb-1">
                        Subtítulo Hero da Nova Página (Opcional)
                      </label>
                      <input
                        type="text"
                        value={formData.novaPaginaMetaDescricao}
                        onChange={(e) =>
                          setFormData({ ...formData, novaPaginaMetaDescricao: e.target.value })
                        }
                        placeholder="Breve descrição exibida no topo da página..."
                        className="w-full px-3 py-1.5 text-xs bg-white border border-purple-200 rounded-lg"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        1. Módulo do Sistema
                      </label>
                      <select
                        value={
                          SYSTEM_ROUTES.some(r => r.url === formData.url) ? formData.url : ''
                        }
                        onChange={(e) => {
                          const route = SYSTEM_ROUTES.find(r => r.url === e.target.value);
                          setFormData({
                            ...formData,
                            url: e.target.value,
                            pageId: '',
                            titulo: formData.titulo || (route ? route.label : '')
                          });
                        }}
                        className="w-full rounded-lg border-gray-300 px-3 py-2 border text-xs bg-white"
                      >
                        <option value="">Escolher página do sistema...</option>
                        {SYSTEM_ROUTES.map(route => (
                          <option key={route.url} value={route.url}>
                            {route.label} ({route.url})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        2. Ou Página Criada no Editor
                      </label>
                      <select
                        value={formData.pageId}
                        onChange={(e) => {
                          const pg = pagesList.find(p => p._id === e.target.value);
                          setFormData({
                            ...formData,
                            pageId: e.target.value,
                            url: pg ? (pg.slug === 'inicio' ? '/' : `/${pg.slug}`) : '',
                            titulo: formData.titulo || (pg ? pg.titulo : '')
                          });
                        }}
                        className="w-full rounded-lg border-gray-300 px-3 py-2 border text-xs bg-white"
                      >
                        <option value="">Escolher página CMS...</option>
                        {pagesList.map(page => (
                          <option key={page._id} value={page._id}>
                            {page.titulo} (/{page.slug})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        3. Ou URL Personalizada / Externa
                      </label>
                      <input
                        type="text"
                        value={formData.url}
                        onChange={(e) =>
                          setFormData({ ...formData, url: e.target.value, pageId: '' })
                        }
                        placeholder="/minha-pagina ou https://... (vazio se for apenas título de Dropdown)"
                        className="w-full rounded-lg border-gray-300 px-3 py-2 border text-xs bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Personalização Visual Individual do Item (Cores, Botão Destaque, Badge) */}
              <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 space-y-3">
                <span className="block text-xs font-bold uppercase tracking-wider text-purple-900">
                  Estilo Visual & Cores Deste Item (Opcional)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Cor do Texto Individual
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.corTexto || '#1f2937'}
                        onChange={(e) =>
                          setFormData({ ...formData, corTexto: e.target.value })
                        }
                        className="h-8 w-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.corTexto}
                        onChange={(e) =>
                          setFormData({ ...formData, corTexto: e.target.value })
                        }
                        placeholder="Padrão da Navbar"
                        className="flex-1 px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                      />
                      {formData.corTexto && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, corTexto: '' })}
                          className="text-[11px] text-gray-500 hover:text-red-600"
                        >
                          Limpar
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Cor de Fundo Individual
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.corFundo || '#9333ea'}
                        onChange={(e) =>
                          setFormData({ ...formData, corFundo: e.target.value })
                        }
                        className="h-8 w-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.corFundo}
                        onChange={(e) =>
                          setFormData({ ...formData, corFundo: e.target.value })
                        }
                        placeholder="Padrão do Tema (#ffffff)"
                        className="flex-1 px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                      />
                      {formData.corFundo && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, corFundo: '' })}
                          className="text-[11px] text-gray-500 hover:text-red-600"
                        >
                          Limpar
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Etiqueta / Badge (Ex: AO VIVO, NOVO)
                    </label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="Sem etiqueta"
                      className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Cor da Etiqueta
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.corBadge || '#ef4444'}
                        onChange={(e) =>
                          setFormData({ ...formData, corBadge: e.target.value })
                        }
                        className="h-8 w-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.corBadge}
                        onChange={(e) =>
                          setFormData({ ...formData, corBadge: e.target.value })
                        }
                        className="flex-1 px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-5 pt-2">
                  <label className="inline-flex items-center gap-2 text-xs font-medium text-gray-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.destaque}
                      onChange={(e) =>
                        setFormData({ ...formData, destaque: e.target.checked })
                      }
                      className="rounded text-purple-600"
                    />
                    <span>Exibir como Botão Arredondado (Destaque)</span>
                  </label>

                  <label className="inline-flex items-center gap-2 text-xs font-medium text-gray-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.abrirNovaAba}
                      onChange={(e) =>
                        setFormData({ ...formData, abrirNovaAba: e.target.checked })
                      }
                      className="rounded text-purple-600"
                    />
                    <span>Abrir link em nova aba</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Ordem de Exibição
                  </label>
                  <input
                    type="number"
                    value={formData.ordem}
                    onChange={(e) =>
                      setFormData({ ...formData, ordem: parseInt(e.target.value || '0', 10) })
                    }
                    className="w-full rounded-lg border-gray-300 px-3 py-2 border text-sm"
                  />
                </div>
                <div className="pt-5">
                  <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.ativo}
                      onChange={(e) =>
                        setFormData({ ...formData, ativo: e.target.checked })
                      }
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span>Item Visível no Menu</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                    setFormData(INITIAL_FORM);
                  }}
                  className="px-4 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 disabled:opacity-50"
                >
                  <FaSave className="inline mr-2" />
                  {saving ? 'A guardar...' : 'Salvar Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
