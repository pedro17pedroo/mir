'use client';
import { useMemo, useRef, useState, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Swal from 'sweetalert2';

// Importar Delta para manipulação de conteúdo
const Delta = Quill.import('delta');

// Importar módulo de redimensionamento de imagens
import ImageResize from 'quill-image-resize-module-react';
Quill.register('modules/imageResize', ImageResize);

// Criar Blot customizado para vídeos
const BlockEmbed = Quill.import('blots/block/embed');

// Blot customizado para Hero Box
class HeroBoxBlot extends BlockEmbed {
  static create(value) {
    const node = super.create();
    node.setAttribute('contenteditable', 'true');
    node.setAttribute('class', `hero-box-gradient hero-box-${value.gradient}`);
    node.setAttribute('data-gradient', value.gradient);
    
    const title = document.createElement('h2');
    title.className = 'hero-box-title';
    title.textContent = value.title;
    title.setAttribute('contenteditable', 'true');
    
    const desc = document.createElement('p');
    desc.className = 'hero-box-desc';
    desc.textContent = value.desc;
    desc.setAttribute('contenteditable', 'true');
    
    node.appendChild(title);
    node.appendChild(desc);
    
    return node;
  }

  static value(node) {
    const title = node.querySelector('.hero-box-title');
    const desc = node.querySelector('.hero-box-desc');
    return {
      gradient: node.dataset.gradient || 'purple-pink',
      title: title ? title.textContent : '',
      desc: desc ? desc.textContent : ''
    };
  }
}

HeroBoxBlot.blotName = 'herobox';
HeroBoxBlot.tagName = 'div';
HeroBoxBlot.className = 'hero-box-gradient';

Quill.register(HeroBoxBlot);

class VideoBlot extends BlockEmbed {
  static create(value) {
    const node = super.create();
    node.setAttribute('contenteditable', 'false');
    node.setAttribute('class', 'video-wrapper');
    
    const { url, width = '640px', align = 'center' } = typeof value === 'string' ? { url: value } : value;
    
    // Calcular altura proporcional (16:9)
    const height = width.includes('%') ? '360px' : `${parseInt(width) * 9 / 16}px`;
    
    // Definir margens baseado no alinhamento
    let marginLeft = 'auto';
    let marginRight = 'auto';
    
    if (align === 'left') {
      marginLeft = '0';
      marginRight = 'auto';
    } else if (align === 'right') {
      marginLeft = 'auto';
      marginRight = '0';
    }
    
    node.style.width = width;
    node.style.margin = `20px ${marginRight} 20px ${marginLeft}`;
    node.style.display = 'block';
    node.style.position = 'relative';
    node.style.cursor = 'pointer';
    
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', url);
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.style.width = '100%';
    iframe.style.height = height;
    iframe.style.display = 'block';
    iframe.style.border = 'none';
    
    // Adicionar overlay para permitir seleção
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.cursor = 'pointer';
    overlay.style.zIndex = '1';
    
    node.appendChild(iframe);
    node.appendChild(overlay);
    
    // Armazenar dados no dataset
    node.dataset.url = url;
    node.dataset.width = width;
    node.dataset.align = align;
    
    return node;
  }

  static value(node) {
    return {
      url: node.dataset.url,
      width: node.dataset.width,
      align: node.dataset.align
    };
  }
}

VideoBlot.blotName = 'video';
VideoBlot.tagName = 'div';
VideoBlot.className = 'video-wrapper';

Quill.register(VideoBlot);

const QuillEditor = ({ 
  value, 
  onChange, 
  placeholder = 'Escreva seu conteúdo aqui...',
  className = ''
}) => {
  const quillRef = useRef(null);
  const [content, setContent] = useState(value || '');
  const [isMounted, setIsMounted] = useState(false);

  // Garante que o componente está montado antes de renderizar o Quill
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Prevenir scroll automático ao formatar
  useEffect(() => {
    if (!quillRef.current || !isMounted) return;

    const quill = quillRef.current.getEditor();
    if (!quill) return;

    const wrapper = quill.container.closest('.quill-scroll-wrapper');
    if (!wrapper) return;

    // Desabilitar scrollIntoView completamente
    quill.scrollIntoView = () => {};
    const editor = quill.root;
    if (editor.scrollIntoView) {
      editor.scrollIntoView = () => {};
    }

    // Interceptar o método format (usado por cor, background, align, header)
    const originalFormat = quill.format.bind(quill);
    quill.format = function(name, value, source) {
      // Salvar scroll antes
      const currentScroll = wrapper.scrollTop;
      const selection = quill.getSelection();
      
      // Executar formatação
      const result = originalFormat(name, value, source);
      
      // Restaurar scroll imediatamente
      requestAnimationFrame(() => {
        wrapper.scrollTop = currentScroll;
        if (selection) {
          quill.setSelection(selection.index, selection.length, 'silent');
        }
      });
      
      // Garantir restauração com múltiplos delays
      setTimeout(() => { wrapper.scrollTop = currentScroll; }, 0);
      setTimeout(() => { wrapper.scrollTop = currentScroll; }, 10);
      setTimeout(() => { wrapper.scrollTop = currentScroll; }, 50);
      setTimeout(() => { wrapper.scrollTop = currentScroll; }, 100);
      setTimeout(() => { wrapper.scrollTop = currentScroll; }, 200);
      
      return result;
    };

    // Interceptar o método formatText (usado internamente)
    const originalFormatText = quill.formatText.bind(quill);
    quill.formatText = function(index, length, formats, source) {
      const currentScroll = wrapper.scrollTop;
      const result = originalFormatText(index, length, formats, source);
      
      requestAnimationFrame(() => {
        wrapper.scrollTop = currentScroll;
      });
      setTimeout(() => { wrapper.scrollTop = currentScroll; }, 0);
      setTimeout(() => { wrapper.scrollTop = currentScroll; }, 50);
      
      return result;
    };

    // Interceptar o método formatLine (usado para align e header)
    const originalFormatLine = quill.formatLine.bind(quill);
    quill.formatLine = function(index, length, formats, source) {
      const currentScroll = wrapper.scrollTop;
      const result = originalFormatLine(index, length, formats, source);
      
      requestAnimationFrame(() => {
        wrapper.scrollTop = currentScroll;
      });
      setTimeout(() => { wrapper.scrollTop = currentScroll; }, 0);
      setTimeout(() => { wrapper.scrollTop = currentScroll; }, 50);
      
      return result;
    };

    // Interceptar setSelection para prevenir scroll
    const originalSetSelection = quill.setSelection.bind(quill);
    quill.setSelection = function(index, length, source) {
      const currentScroll = wrapper.scrollTop;
      const result = originalSetSelection(index, length, source || 'silent');
      
      requestAnimationFrame(() => {
        wrapper.scrollTop = currentScroll;
      });
      
      return result;
    };

    // Interceptar update para prevenir scroll
    const originalUpdate = quill.update.bind(quill);
    quill.update = function(source) {
      const currentScroll = wrapper.scrollTop;
      const result = originalUpdate(source || 'silent');
      
      requestAnimationFrame(() => {
        wrapper.scrollTop = currentScroll;
      });
      
      return result;
    };

    // Observer para detectar mudanças no scroll e forçar restauração
    let lastKnownScroll = wrapper.scrollTop;
    const scrollObserver = new MutationObserver(() => {
      // Se o scroll mudou sem interação do usuário, restaurar
      if (Math.abs(wrapper.scrollTop - lastKnownScroll) > 50) {
        wrapper.scrollTop = lastKnownScroll;
      }
    });

    scrollObserver.observe(editor, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });

    // Atualizar lastKnownScroll quando usuário scrollar manualmente
    const handleUserScroll = () => {
      lastKnownScroll = wrapper.scrollTop;
    };

    wrapper.addEventListener('scroll', handleUserScroll, { passive: true });

    return () => {
      wrapper.removeEventListener('scroll', handleUserScroll);
      scrollObserver.disconnect();
    };
  }, [isMounted]);

  // Atualiza o conteúdo quando o valor muda
  useEffect(() => {
    if (value !== content) {
      setContent(value || '');
    }
  }, [value]);

  // Adiciona botões customizados para alinhamento de imagens e edição de vídeos
  useEffect(() => {
    if (!quillRef.current || !isMounted) return;

    const quill = quillRef.current.getEditor();
    if (!quill) return;

    // Adicionar botões customizados na toolbar
    const toolbar = quill.getModule('toolbar');
    if (toolbar && toolbar.container) {
      const toolbarElement = toolbar.container;
      
      // Verificar se os botões já existem
      if (!toolbarElement.querySelector('.ql-image-align-left')) {
        // Criar grupo de botões de alinhamento de imagem
        const alignGroup = document.createElement('span');
        alignGroup.className = 'ql-formats';
        alignGroup.style.marginLeft = '10px';
        alignGroup.style.borderLeft = '1px solid #ccc';
        alignGroup.style.paddingLeft = '10px';
        
        // Botão alinhar à esquerda
        const btnLeft = document.createElement('button');
        btnLeft.className = 'ql-image-align-left';
        btnLeft.innerHTML = '⬅️';
        btnLeft.title = 'Alinhar imagem à esquerda';
        btnLeft.onclick = (e) => {
          e.preventDefault();
          alignImageLeft();
        };
        
        // Botão centralizar
        const btnCenter = document.createElement('button');
        btnCenter.className = 'ql-image-align-center';
        btnCenter.innerHTML = '↔️';
        btnCenter.title = 'Centralizar imagem';
        btnCenter.onclick = (e) => {
          e.preventDefault();
          alignImageCenter();
        };
        
        // Botão alinhar à direita
        const btnRight = document.createElement('button');
        btnRight.className = 'ql-image-align-right';
        btnRight.innerHTML = '➡️';
        btnRight.title = 'Alinhar imagem à direita';
        btnRight.onclick = (e) => {
          e.preventDefault();
          alignImageRight();
        };
        
        alignGroup.appendChild(btnLeft);
        alignGroup.appendChild(btnCenter);
        alignGroup.appendChild(btnRight);
        
        // Criar grupo de botões de vídeo
        const videoGroup = document.createElement('span');
        videoGroup.className = 'ql-formats';
        videoGroup.style.marginLeft = '10px';
        videoGroup.style.borderLeft = '1px solid #ccc';
        videoGroup.style.paddingLeft = '10px';
        
        // Botão para editar vídeo
        const btnEditVideo = document.createElement('button');
        btnEditVideo.className = 'ql-edit-video';
        btnEditVideo.innerHTML = '⚙️';
        btnEditVideo.title = 'Editar tamanho e alinhamento do vídeo';
        btnEditVideo.onclick = async (e) => {
          e.preventDefault();
          await editVideoHandler();
        };
        
        videoGroup.appendChild(btnEditVideo);
        
        // Criar grupo de componentes
        const componentGroup = document.createElement('span');
        componentGroup.className = 'ql-formats';
        componentGroup.style.marginLeft = '10px';
        componentGroup.style.borderLeft = '1px solid #ccc';
        componentGroup.style.paddingLeft = '10px';
        
        // Botão para inserir componentes
        const btnComponent = document.createElement('button');
        btnComponent.className = 'ql-insert-component';
        btnComponent.innerHTML = '🧩';
        btnComponent.title = 'Inserir Componente (Cards, Timeline, etc)';
        btnComponent.onclick = async (e) => {
          e.preventDefault();
          await insertComponentHandler();
        };
        
        componentGroup.appendChild(btnComponent);
        
        // Adicionar ao final da toolbar
        toolbarElement.appendChild(alignGroup);
        toolbarElement.appendChild(videoGroup);
        toolbarElement.appendChild(componentGroup);
      }
    }

    // Adicionar listener para clique duplo em vídeos
    const handleDoubleClick = async (e) => {
      if (e.target.closest('.video-wrapper')) {
        e.preventDefault();
        await editVideoHandler();
      }
    };

    const editor = quill.root;
    editor.addEventListener('dblclick', handleDoubleClick);

    return () => {
      editor.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [isMounted]);

  // Observa mudanças no editor para aplicar estilos inline nas imagens
  useEffect(() => {
    if (!quillRef.current || !isMounted) return;

    const quill = quillRef.current.getEditor();
    if (!quill) return;
    
    // Função para aplicar estilos inline nas imagens baseado no alinhamento do parágrafo
    const applyImageAlignment = () => {
      try {
        const editor = quill.root;
        if (!editor) return;
        
        // Salvar posição do scroll e cursor ANTES de fazer alterações
        const scrollTop = editor.scrollTop;
        const selection = quill.getSelection();
        
        // Imagens em parágrafos centralizados
        const centerImages = editor.querySelectorAll('p.ql-align-center img, .ql-align-center img');
        centerImages.forEach(img => {
          if (img && img.style) {
            img.style.display = 'block';
            img.style.marginLeft = 'auto';
            img.style.marginRight = 'auto';
          }
        });

        // Imagens em parágrafos alinhados à direita
        const rightImages = editor.querySelectorAll('p.ql-align-right img, .ql-align-right img');
        rightImages.forEach(img => {
          if (img && img.style) {
            img.style.display = 'block';
            img.style.marginLeft = 'auto';
            img.style.marginRight = '0';
          }
        });

        // Imagens em parágrafos alinhados à esquerda
        const leftImages = editor.querySelectorAll('p.ql-align-left img, .ql-align-left img');
        leftImages.forEach(img => {
          if (img && img.style) {
            img.style.display = 'block';
            img.style.marginLeft = '0';
            img.style.marginRight = 'auto';
          }
        });
        
        // Restaurar posição do scroll e cursor DEPOIS das alterações
        if (scrollTop !== undefined && scrollTop !== null) {
          editor.scrollTop = scrollTop;
        }
        if (selection) {
          quill.setSelection(selection.index, selection.length, 'silent');
        }
      } catch (error) {
        console.warn('Erro ao aplicar alinhamento de imagens:', error);
      }
    };

    // Aplica alinhamento inicial com delay
    const initialTimeout = setTimeout(applyImageAlignment, 200);

    return () => {
      clearTimeout(initialTimeout);
    };
  }, [isMounted]);

  const handleChange = (content) => {
    const quill = quillRef.current?.getEditor();
    const wrapper = quill?.container?.closest('.quill-scroll-wrapper');
    const scrollTop = wrapper?.scrollTop;
    
    setContent(content);
    if (onChange) {
      const editor = quill?.getEditor ? quill.getEditor() : quill;
      onChange(content, editor?.getContents ? editor.getContents() : null);
    }
    
    // Restaurar scroll após mudança de estado
    if (wrapper && scrollTop !== undefined) {
      requestAnimationFrame(() => {
        wrapper.scrollTop = scrollTop;
      });
    }
  };

  // Handler para inserir componentes/blocos
  const insertComponentHandler = async () => {
    const { value: componentType } = await Swal.fire({
      title: 'Inserir Componente',
      html: `
        <div style="text-align: left;">
          <p style="margin-bottom: 20px; color: #666;">Escolha um componente para inserir na página:</p>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
            <button type="button" class="component-btn" data-component="hero-box" style="padding: 20px; border: 2px solid #e5e7eb; border-radius: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; cursor: pointer; transition: all 0.2s;">
              <div style="font-size: 32px; margin-bottom: 8px;">🎨</div>
              <div style="font-weight: 600;">Caixa Hero</div>
              <div style="font-size: 12px; opacity: 0.9;">Destaque com gradiente colorido</div>
            </button>
            
            <button type="button" class="component-btn" data-component="card-person" style="padding: 20px; border: 2px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; transition: all 0.2s;">
              <div style="font-size: 32px; margin-bottom: 8px;">👤</div>
              <div style="font-weight: 600; color: #333;">Card de Pessoa</div>
              <div style="font-size: 12px; color: #666;">Perfil com foto e descrição</div>
            </button>
            
            <button type="button" class="component-btn" data-component="card-grid" style="padding: 20px; border: 2px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; transition: all 0.2s;">
              <div style="font-size: 32px; margin-bottom: 8px;">📦</div>
              <div style="font-weight: 600; color: #333;">Grid de Cards</div>
              <div style="font-size: 12px; color: #666;">2, 3 ou 4 colunas</div>
            </button>
            
            <button type="button" class="component-btn" data-component="highlight-box" style="padding: 20px; border: 2px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; transition: all 0.2s;">
              <div style="font-size: 32px; margin-bottom: 8px;">💡</div>
              <div style="font-weight: 600; color: #333;">Caixa de Destaque</div>
              <div style="font-size: 12px; color: #666;">Aviso, dica ou citação</div>
            </button>
            
            <button type="button" class="component-btn" data-component="cta-button" style="padding: 20px; border: 2px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; transition: all 0.2s;">
              <div style="font-size: 32px; margin-bottom: 8px;">🎯</div>
              <div style="font-weight: 600; color: #333;">Call-to-Action</div>
              <div style="font-size: 12px; color: #666;">Botão de ação destacado</div>
            </button>
            
            <button type="button" class="component-btn" data-component="timeline" style="padding: 20px; border: 2px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; transition: all 0.2s;">
              <div style="font-size: 32px; margin-bottom: 8px;">⏱️</div>
              <div style="font-weight: 600; color: #333;">Timeline</div>
              <div style="font-size: 12px; color: #666;">Linha do tempo</div>
            </button>
            
            <button type="button" class="component-btn" data-component="accordion" style="padding: 20px; border: 2px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; transition: all 0.2s;">
              <div style="font-size: 32px; margin-bottom: 8px;">📋</div>
              <div style="font-weight: 600; color: #333;">Accordion</div>
              <div style="font-size: 12px; color: #666;">Perguntas frequentes</div>
            </button>
          </div>
        </div>
      `,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: 'Cancelar',
      didOpen: () => {
        const buttons = document.querySelectorAll('.component-btn');
        buttons.forEach(btn => {
          btn.addEventListener('mouseenter', function() {
            if (this.getAttribute('data-component') !== 'hero-box') {
              this.style.borderColor = '#9333ea';
            }
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 6px rgba(147, 51, 234, 0.1)';
          });
          btn.addEventListener('mouseleave', function() {
            if (this.getAttribute('data-component') !== 'hero-box') {
              this.style.borderColor = '#e5e7eb';
            }
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
          });
          btn.addEventListener('click', function() {
            const component = this.getAttribute('data-component');
            Swal.clickConfirm();
            Swal.close();
            setTimeout(() => insertComponent(component), 100);
          });
        });
      }
    });
  };

  // Função para inserir o componente selecionado
  const insertComponent = async (componentType) => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const range = quill.getSelection(true);
    if (!range) return;

    let componentHTML = '';

    switch (componentType) {
      case 'hero-box':
        // Hero box usa Blot customizado, inserção é feita dentro da função
        await getHeroBoxHTML();
        return; // Retornar aqui porque já foi inserido
      case 'card-person':
        componentHTML = await getCardPersonHTML();
        break;
      case 'card-grid':
        componentHTML = await getCardGridHTML();
        break;
      case 'highlight-box':
        componentHTML = await getHighlightBoxHTML();
        break;
      case 'cta-button':
        componentHTML = await getCTAButtonHTML();
        break;
      case 'timeline':
        componentHTML = await getTimelineHTML();
        break;
      case 'accordion':
        componentHTML = await getAccordionHTML();
        break;
    }

    if (componentHTML) {
      const delta = quill.clipboard.convert(componentHTML);
      quill.updateContents(new Delta().retain(range.index).concat(delta), 'user');
      quill.setSelection(range.index + delta.length(), 'silent');
    }
  };

  // Templates dos componentes
  const getHeroBoxHTML = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Caixa Hero com Gradiente',
      html: `
        <div style="text-align: left;">
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Título:</label>
          <input id="hero-title" class="swal2-input" placeholder="Título principal" value="Título Principal" style="width: 90%; margin: 0 0 15px 0;">
          
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Subtítulo/Descrição:</label>
          <textarea id="hero-desc" class="swal2-textarea" placeholder="Descrição ou subtítulo..." style="width: 90%; margin: 0 0 15px 0;">Descrição do conteúdo</textarea>
          
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Estilo de Gradiente:</label>
          <select id="hero-gradient" class="swal2-input" style="width: 90%; margin: 0;">
            <option value="purple-pink">Roxo → Rosa (Padrão)</option>
            <option value="blue-purple">Azul → Roxo</option>
            <option value="green-blue">Verde → Azul</option>
            <option value="orange-red">Laranja → Vermelho</option>
            <option value="purple-blue">Roxo → Azul</option>
            <option value="pink-orange">Rosa → Laranja</option>
          </select>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Inserir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#9333ea',
      preConfirm: () => {
        return {
          title: document.getElementById('hero-title').value || 'Título',
          desc: document.getElementById('hero-desc').value || 'Descrição',
          gradient: document.getElementById('hero-gradient').value
        };
      }
    });

    if (formValues) {
      const quill = quillRef.current?.getEditor();
      if (!quill) return '';
      
      const range = quill.getSelection(true);
      if (!range) return '';
      
      // Inserir usando o Blot customizado
      quill.insertEmbed(range.index, 'herobox', {
        title: formValues.title,
        desc: formValues.desc,
        gradient: formValues.gradient
      });
      
      // Mover cursor para depois do hero box
      quill.setSelection(range.index + 1);
      
      // Inserir linha em branco após
      quill.insertText(range.index + 1, '\n');
      
      return ''; // Retornar vazio porque já inserimos diretamente
    }
    return '';
  };

  const getCardPersonHTML = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Card de Pessoa',
      html: `
        <div style="text-align: left;">
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Emoji/Ícone:</label>
          <input id="person-icon" class="swal2-input" placeholder="👤" value="👤" style="width: 90%; margin: 0 0 15px 0;">
          
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Nome:</label>
          <input id="person-name" class="swal2-input" placeholder="Nome da Pessoa" style="width: 90%; margin: 0 0 15px 0;">
          
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Cargo/Função:</label>
          <input id="person-role" class="swal2-input" placeholder="Cargo ou função" style="width: 90%; margin: 0 0 15px 0;">
          
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Descrição:</label>
          <textarea id="person-desc" class="swal2-textarea" placeholder="Breve descrição..." style="width: 90%; margin: 0;"></textarea>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Inserir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#9333ea',
      preConfirm: () => {
        return {
          icon: document.getElementById('person-icon').value || '👤',
          name: document.getElementById('person-name').value || 'Nome',
          role: document.getElementById('person-role').value || 'Cargo',
          desc: document.getElementById('person-desc').value || 'Descrição'
        };
      }
    });

    if (formValues) {
      return `
        <div class="card-person-animate" style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; margin: 20px 0; animation: fadeInUp 0.6s ease-out; transition: transform 0.3s ease;">
          <div style="font-size: 48px; margin-bottom: 20px;">${formValues.icon}</div>
          <h3 style="font-size: 24px; margin-bottom: 10px; color: #333; font-weight: 700;">${formValues.name}</h3>
          <p style="color: #9333ea; font-weight: 600; margin-bottom: 15px;">${formValues.role}</p>
          <p style="color: #666; line-height: 1.6;">${formValues.desc}</p>
        </div>
        <p><br></p>
      `;
    }
    return '';
  };

  const getCardGridHTML = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Grid de Cards',
      html: `
        <div style="text-align: left;">
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Número de Colunas:</label>
          <select id="grid-columns" class="swal2-input" style="width: 90%; margin: 0 0 15px 0;">
            <option value="2">2 Colunas</option>
            <option value="3" selected>3 Colunas</option>
            <option value="4">4 Colunas</option>
          </select>
          
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Número de Cards:</label>
          <select id="grid-rows" class="swal2-input" style="width: 90%; margin: 0 0 15px 0;">
            <option value="2">2 Cards</option>
            <option value="3" selected>3 Cards</option>
            <option value="4">4 Cards</option>
            <option value="6">6 Cards</option>
            <option value="8">8 Cards</option>
            <option value="9">9 Cards</option>
            <option value="12">12 Cards</option>
          </select>
          
          <p style="font-size: 12px; color: #666;">Você poderá editar o conteúdo de cada card depois de inserir.</p>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Inserir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#9333ea',
      preConfirm: () => {
        return {
          columns: document.getElementById('grid-columns').value,
          totalCards: document.getElementById('grid-rows').value
        };
      }
    });

    if (formValues) {
      const { columns, totalCards } = formValues;
      const cards = Array(parseInt(totalCards)).fill(0).map((_, i) => `
        <div class="grid-card-item" style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; transition: transform 0.3s ease; min-height: 200px;">
          <div style="font-size: 40px; margin-bottom: 15px;">📦</div>
          <h4 style="font-size: 20px; margin-bottom: 10px; color: #333; font-weight: 600;">Card ${i + 1}</h4>
          <p style="color: #666; line-height: 1.6;">Edite este texto com o conteúdo desejado.</p>
        </div>
      `).join('');

      return `
        <div class="card-grid-container" style="display: grid !important; grid-template-columns: repeat(${columns}, 1fr) !important; gap: 20px !important; margin: 30px 0 !important; width: 100% !important;">
          ${cards}
        </div>
        <p><br></p>
      `;
    }
    return '';
  };

  const getHighlightBoxHTML = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Caixa de Destaque',
      html: `
        <div style="text-align: left;">
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Tipo:</label>
          <select id="box-type" class="swal2-input" style="width: 90%; margin: 0 0 15px 0;">
            <option value="info">💡 Informação (Azul)</option>
            <option value="success">✅ Sucesso (Verde)</option>
            <option value="warning">⚠️ Aviso (Amarelo)</option>
            <option value="danger">❌ Perigo (Vermelho)</option>
            <option value="quote">💬 Citação (Roxo)</option>
          </select>
          
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Título (opcional):</label>
          <input id="box-title" class="swal2-input" placeholder="Título" style="width: 90%; margin: 0 0 15px 0;">
          
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Conteúdo:</label>
          <textarea id="box-content" class="swal2-textarea" placeholder="Conteúdo da caixa..." style="width: 90%; margin: 0;"></textarea>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Inserir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#9333ea',
      preConfirm: () => {
        return {
          type: document.getElementById('box-type').value,
          title: document.getElementById('box-title').value,
          content: document.getElementById('box-content').value || 'Conteúdo'
        };
      }
    });

    if (formValues) {
      const colors = {
        info: { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af' },
        success: { bg: '#f0fdf4', border: '#22c55e', text: '#166534' },
        warning: { bg: '#fffbeb', border: '#f59e0b', text: '#92400e' },
        danger: { bg: '#fef2f2', border: '#ef4444', text: '#991b1b' },
        quote: { bg: '#faf5ff', border: '#9333ea', text: '#6b21a8' }
      };
      
      const color = colors[formValues.type];
      const titleHTML = formValues.title ? `<h4 style="font-size: 18px; font-weight: 600; margin-bottom: 10px; color: ${color.text};">${formValues.title}</h4>` : '';
      
      return `
        <div style="background: ${color.bg}; border-left: 4px solid ${color.border}; border-radius: 8px; padding: 20px; margin: 20px 0;">
          ${titleHTML}
          <p style="color: ${color.text}; line-height: 1.6; margin: 0;">${formValues.content}</p>
        </div>
        <p><br></p>
      `;
    }
    return '';
  };

  const getCTAButtonHTML = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Call-to-Action',
      html: `
        <div style="text-align: left;">
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Texto do Botão:</label>
          <input id="cta-text" class="swal2-input" placeholder="Clique Aqui" style="width: 90%; margin: 0 0 15px 0;">
          
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">URL/Link:</label>
          <input id="cta-url" class="swal2-input" placeholder="https://..." style="width: 90%; margin: 0 0 15px 0;">
          
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Cor:</label>
          <select id="cta-color" class="swal2-input" style="width: 90%; margin: 0;">
            <option value="#9333ea">Roxo (Padrão)</option>
            <option value="#3b82f6">Azul</option>
            <option value="#22c55e">Verde</option>
            <option value="#f59e0b">Amarelo</option>
            <option value="#ef4444">Vermelho</option>
          </select>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Inserir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#9333ea',
      preConfirm: () => {
        return {
          text: document.getElementById('cta-text').value || 'Clique Aqui',
          url: document.getElementById('cta-url').value || '#',
          color: document.getElementById('cta-color').value
        };
      }
    });

    if (formValues) {
      return `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${formValues.url}" style="display: inline-block; background: ${formValues.color}; color: white; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 18px; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">${formValues.text}</a>
        </div>
        <p><br></p>
      `;
    }
    return '';
  };

  const getTimelineHTML = async () => {
    return `
      <div style="margin: 30px 0;">
        <div style="border-left: 3px solid #9333ea; padding-left: 30px; margin-left: 20px;">
          <div style="position: relative; margin-bottom: 30px;">
            <div style="position: absolute; left: -38px; top: 0; width: 16px; height: 16px; background: #9333ea; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 3px #9333ea;"></div>
            <h4 style="font-size: 18px; font-weight: 600; color: #333; margin-bottom: 5px;">2020</h4>
            <p style="color: #666; line-height: 1.6;">Fundação do ministério</p>
          </div>
          
          <div style="position: relative; margin-bottom: 30px;">
            <div style="position: absolute; left: -38px; top: 0; width: 16px; height: 16px; background: #9333ea; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 3px #9333ea;"></div>
            <h4 style="font-size: 18px; font-weight: 600; color: #333; margin-bottom: 5px;">2022</h4>
            <p style="color: #666; line-height: 1.6;">Expansão para novas cidades</p>
          </div>
          
          <div style="position: relative;">
            <div style="position: absolute; left: -38px; top: 0; width: 16px; height: 16px; background: #9333ea; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 3px #9333ea;"></div>
            <h4 style="font-size: 18px; font-weight: 600; color: #333; margin-bottom: 5px;">2024</h4>
            <p style="color: #666; line-height: 1.6;">Lançamento da plataforma online</p>
          </div>
        </div>
      </div>
      <p><br></p>
    `;
  };

  const getAccordionHTML = async () => {
    return `
      <div style="margin: 30px 0;">
        <details style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 10px;">
          <summary style="font-weight: 600; color: #333; cursor: pointer; font-size: 16px;">Pergunta 1</summary>
          <p style="margin-top: 15px; color: #666; line-height: 1.6;">Resposta para a pergunta 1. Edite este texto.</p>
        </details>
        
        <details style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 10px;">
          <summary style="font-weight: 600; color: #333; cursor: pointer; font-size: 16px;">Pergunta 2</summary>
          <p style="margin-top: 15px; color: #666; line-height: 1.6;">Resposta para a pergunta 2. Edite este texto.</p>
        </details>
        
        <details style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
          <summary style="font-weight: 600; color: #333; cursor: pointer; font-size: 16px;">Pergunta 3</summary>
          <p style="margin-top: 15px; color: #666; line-height: 1.6;">Resposta para a pergunta 3. Edite este texto.</p>
        </details>
      </div>
      <p><br></p>
    `;
  };
  // Handler customizado para aplicar alinhamento nas imagens
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', e.target.result);
            quill.setSelection(range.index + 1);
          }
        };
        reader.readAsDataURL(file);
      }
    };
  };

  // Handler para inserir link
  const linkHandler = async () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    
    const range = quill.getSelection();
    if (range) {
      const selectedText = quill.getText(range.index, range.length);
      
      const { value: formValues } = await Swal.fire({
        title: 'Inserir Link',
        html: `
          <div style="text-align: left;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">URL do Link:</label>
            <input id="swal-input-url" class="swal2-input" placeholder="https://exemplo.com" value="" style="width: 90%; margin: 0 0 15px 0;">
            
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">Texto do Link:</label>
            <input id="swal-input-text" class="swal2-input" placeholder="Clique aqui" value="${selectedText}" style="width: 90%; margin: 0;">
          </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Inserir',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#9333ea',
        preConfirm: () => {
          const url = document.getElementById('swal-input-url').value;
          const text = document.getElementById('swal-input-text').value;
          
          if (!url) {
            Swal.showValidationMessage('Por favor, digite a URL');
            return false;
          }
          
          if (!text) {
            Swal.showValidationMessage('Por favor, digite o texto do link');
            return false;
          }
          
          return { url, text };
        }
      });
      
      if (formValues) {
        const { url, text } = formValues;
        
        if (range.length > 0) {
          // Substituir texto selecionado
          quill.deleteText(range.index, range.length);
          quill.insertText(range.index, text, 'link', url);
        } else {
          // Inserir novo link
          quill.insertText(range.index, text, 'link', url);
        }
        
        quill.setSelection(range.index + text.length);
      }
    }
  };

  // Handler para inserir vídeo com blot customizado
  const videoHandler = async () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    
    const range = quill.getSelection(true);
    if (range) {
      const { value: formValues } = await Swal.fire({
        title: 'Inserir Vídeo',
        html: `
          <div style="text-align: left;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">URL do Vídeo:</label>
            <input id="swal-input-video" class="swal2-input" placeholder="https://www.youtube.com/watch?v=..." style="width: 90%; margin: 0 0 15px 0;">
            <p style="font-size: 12px; color: #666; margin: 0 0 15px 0;">
              Suporta YouTube e Vimeo
            </p>
            
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">Largura:</label>
            <select id="swal-input-width" class="swal2-input" style="width: 90%; margin: 0 0 15px 0;">
              <option value="100%">100% (Largura total)</option>
              <option value="80%">80%</option>
              <option value="640px" selected>640px (Padrão)</option>
              <option value="560px">560px</option>
              <option value="480px">480px</option>
              <option value="400px">400px</option>
            </select>
            
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">Alinhamento:</label>
            <select id="swal-input-align" class="swal2-input" style="width: 90%; margin: 0;">
              <option value="center" selected>Centro</option>
              <option value="left">Esquerda</option>
              <option value="right">Direita</option>
            </select>
          </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Inserir',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#9333ea',
        preConfirm: () => {
          const url = document.getElementById('swal-input-video').value;
          const width = document.getElementById('swal-input-width').value;
          const align = document.getElementById('swal-input-align').value;
          
          if (!url) {
            Swal.showValidationMessage('Por favor, digite a URL do vídeo');
            return false;
          }
          
          return { url, width, align };
        }
      });
      
      if (formValues) {
        const { url, width, align } = formValues;
        
        // Processar URL do YouTube para formato embed
        let embedUrl = url;
        
        // YouTube
        if (url.includes('youtube.com/watch')) {
          const videoId = url.split('v=')[1]?.split('&')[0];
          if (videoId) {
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
          }
        } else if (url.includes('youtu.be/')) {
          const videoId = url.split('youtu.be/')[1]?.split('?')[0];
          if (videoId) {
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
          }
        }
        // Vimeo
        else if (url.includes('vimeo.com/')) {
          const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
          if (videoId) {
            embedUrl = `https://player.vimeo.com/video/${videoId}`;
          }
        }
        
        // Inserir vídeo usando o blot customizado
        quill.insertEmbed(range.index, 'video', {
          url: embedUrl,
          width: width,
          align: align
        });
        
        // Mover cursor para depois do vídeo
        quill.setSelection(range.index + 1);
        
        // Inserir linha em branco após o vídeo
        quill.insertText(range.index + 1, '\n');
      }
    }
  };

  // Handler para editar vídeo existente
  const editVideoHandler = async () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    
    const range = quill.getSelection();
    if (!range) {
      await Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: 'Clique em um vídeo ou clique duas vezes nele para editá-lo',
        confirmButtonColor: '#9333ea'
      });
      return;
    }
    
    // Salvar posição do scroll
    const editor = quill.root;
    const scrollTop = editor.scrollTop;
    
    // Procurar vídeo na posição do cursor
    const [blot] = quill.getLeaf(range.index);
    let videoBlot = null;
    
    // Verificar se é um VideoBlot ou se está dentro de um
    if (blot && blot.parent) {
      let current = blot;
      while (current && current.statics && current.statics.blotName !== 'video') {
        current = current.parent;
      }
      if (current && current.statics && current.statics.blotName === 'video') {
        videoBlot = current;
      }
    }
    
    // Também verificar no DOM
    const videoWrapper = editor.querySelector('.video-wrapper');
    
    if (!videoBlot && !videoWrapper) {
      await Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: 'Clique em um vídeo ou clique duas vezes nele para editá-lo',
        confirmButtonColor: '#9333ea'
      });
      return;
    }
    
    // Obter valores atuais
    let currentWidth = '640px';
    let currentAlign = 'center';
    let currentUrl = '';
    let videoIndex = range.index;
    
    if (videoBlot) {
      const value = videoBlot.value();
      currentWidth = value.width || '640px';
      currentAlign = value.align || 'center';
      currentUrl = value.url || '';
      videoIndex = quill.getIndex(videoBlot);
    } else if (videoWrapper) {
      currentWidth = videoWrapper.dataset.width || '640px';
      currentAlign = videoWrapper.dataset.align || 'center';
      currentUrl = videoWrapper.dataset.url || '';
    }
    
    const { value: formValues } = await Swal.fire({
      title: 'Editar Vídeo',
      html: `
        <div style="text-align: left;">
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Largura:</label>
          <select id="swal-edit-width" class="swal2-input" style="width: 90%; margin: 0 0 15px 0;">
            <option value="100%" ${currentWidth === '100%' ? 'selected' : ''}>100% (Largura total)</option>
            <option value="80%" ${currentWidth === '80%' ? 'selected' : ''}>80%</option>
            <option value="640px" ${currentWidth === '640px' ? 'selected' : ''}>640px (Padrão)</option>
            <option value="560px" ${currentWidth === '560px' ? 'selected' : ''}>560px</option>
            <option value="480px" ${currentWidth === '480px' ? 'selected' : ''}>480px</option>
            <option value="400px" ${currentWidth === '400px' ? 'selected' : ''}>400px</option>
          </select>
          
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Alinhamento:</label>
          <select id="swal-edit-align" class="swal2-input" style="width: 90%; margin: 0;">
            <option value="center" ${currentAlign === 'center' ? 'selected' : ''}>Centro</option>
            <option value="left" ${currentAlign === 'left' ? 'selected' : ''}>Esquerda</option>
            <option value="right" ${currentAlign === 'right' ? 'selected' : ''}>Direita</option>
          </select>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Aplicar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#9333ea',
      preConfirm: () => {
        const width = document.getElementById('swal-edit-width').value;
        const align = document.getElementById('swal-edit-align').value;
        return { width, align };
      }
    });
    
    if (formValues) {
      const { width, align } = formValues;
      
      // Remover vídeo antigo e inserir novo com novos parâmetros
      if (videoBlot) {
        quill.deleteText(videoIndex, 1);
        quill.insertEmbed(videoIndex, 'video', {
          url: currentUrl,
          width: width,
          align: align
        });
        
        // Restaurar posição do scroll e cursor
        setTimeout(() => {
          editor.scrollTop = scrollTop;
          quill.setSelection(videoIndex + 1, 0, 'silent');
        }, 100);
      } else if (videoWrapper) {
        // Atualizar diretamente no DOM
        const height = width.includes('%') ? '360px' : `${parseInt(width) * 9 / 16}px`;
        
        videoWrapper.style.width = width;
        videoWrapper.dataset.width = width;
        videoWrapper.dataset.align = align;
        
        const iframe = videoWrapper.querySelector('iframe');
        if (iframe) {
          iframe.style.height = height;
        }
        
        // Aplicar alinhamento
        if (align === 'left') {
          videoWrapper.style.marginLeft = '0';
          videoWrapper.style.marginRight = 'auto';
        } else if (align === 'right') {
          videoWrapper.style.marginLeft = 'auto';
          videoWrapper.style.marginRight = '0';
        } else {
          videoWrapper.style.marginLeft = 'auto';
          videoWrapper.style.marginRight = 'auto';
        }
        
        quill.update('silent');
        
        // Restaurar posição do scroll e cursor
        editor.scrollTop = scrollTop;
        quill.setSelection(range.index, range.length, 'silent');
      }
      
      await Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Vídeo atualizado com sucesso',
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  // Handlers para alinhamento de imagens
  const alignImageLeft = () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    
    const range = quill.getSelection();
    if (!range) return;
    
    const editor = quill.root;
    const savedScroll = editor.scrollTop;
    
    const [line] = quill.getLine(range.index);
    if (line && line.domNode) {
      const img = line.domNode.querySelector('img');
      
      if (img) {
        line.domNode.classList.remove('ql-align-center', 'ql-align-right');
        line.domNode.classList.add('ql-align-left');
        
        img.style.display = 'block';
        img.style.marginLeft = '0';
        img.style.marginRight = 'auto';
        
        setTimeout(() => {
          editor.scrollTop = savedScroll;
        }, 0);
      }
    }
  };

  const alignImageCenter = () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    
    const range = quill.getSelection();
    if (!range) return;
    
    const editor = quill.root;
    const savedScroll = editor.scrollTop;
    
    const [line] = quill.getLine(range.index);
    if (line && line.domNode) {
      const img = line.domNode.querySelector('img');
      
      if (img) {
        line.domNode.classList.remove('ql-align-left', 'ql-align-right');
        line.domNode.classList.add('ql-align-center');
        
        img.style.display = 'block';
        img.style.marginLeft = 'auto';
        img.style.marginRight = 'auto';
        
        setTimeout(() => {
          editor.scrollTop = savedScroll;
        }, 0);
      }
    }
  };

  const alignImageRight = () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    
    const range = quill.getSelection();
    if (!range) return;
    
    const editor = quill.root;
    const savedScroll = editor.scrollTop;
    
    const [line] = quill.getLine(range.index);
    if (line && line.domNode) {
      const img = line.domNode.querySelector('img');
      
      if (img) {
        line.domNode.classList.remove('ql-align-left', 'ql-align-center');
        line.domNode.classList.add('ql-align-right');
        
        img.style.display = 'block';
        img.style.marginLeft = 'auto';
        img.style.marginRight = '0';
        
        setTimeout(() => {
          editor.scrollTop = savedScroll;
        }, 0);
      }
    }
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'script': 'sub'}, { 'script': 'super' }],
          ['blockquote', 'code-block'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }],
          [{ 'direction': 'rtl' }],
          [{ 'align': [] }],
          ['link', 'image', 'video'],
          ['clean']
        ],
        handlers: {
          image: imageHandler,
          link: linkHandler,
          video: videoHandler
        }
      },
      imageResize: {
        parchment: Quill.import('parchment'),
        modules: ['Resize', 'DisplaySize']
      },
      clipboard: {
        matchVisual: false,
      }
    }),
    []
  );

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'blockquote', 'code-block',
    'list', 'bullet', 'indent',
    'link', 'image', 'video', 'herobox',
    'align', 'direction',
    'clean',
    'width', 'height', 'style',
    'table', 'table-cell-line', 'table-cell', 'table-row', 'table-body', 'table-col', 'table-colgroup'
  ];

  // Renderiza um placeholder enquanto o componente não estiver montado
  if (!isMounted) {
    return (
      <div className={`bg-white rounded-lg border border-gray-300 p-4 ${className}`}>
        <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className={`quill-scroll-wrapper ${className}`}>
      <style jsx global>{`
        /* Wrapper externo com scroll e contexto para sticky */
        .quill-scroll-wrapper {
          max-height: 600px;
          overflow-y: auto;
          overflow-x: hidden;
          border-radius: 0.5rem;
          border: 1px solid #d1d5db;
          position: relative;
          background: white;
        }

        /* Barra de ferramentas STICKY - gruda no topo ao scrollar */
        .quill-scroll-wrapper .ql-toolbar.ql-snow {
          position: -webkit-sticky;
          position: sticky;
          top: 0;
          z-index: 100;
          background: white;
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border-left: none;
          border-right: none;
          border-top: none;
          margin: 0;
        }

        /* Container do editor */
        .quill-scroll-wrapper .ql-container.ql-snow {
          min-height: 400px;
          max-height: none !important;
          overflow: visible !important;
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          border: none;
        }

        /* Editor - sem scroll interno */
        .quill-scroll-wrapper .ql-editor {
          min-height: 400px;
          max-height: none !important;
          overflow: visible !important;
          padding: 15px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 16px;
          line-height: 1.6;
          color: #374151;
        }

        /* Títulos no editor - Pré-visualização visual */
        .quill-scroll-wrapper .ql-editor h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 2.5rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1.5rem;
          color: #111827;
          line-height: 1.2;
        }

        .quill-scroll-wrapper .ql-editor h2 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 2rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          color: #111827;
          line-height: 1.3;
        }

        .quill-scroll-wrapper .ql-editor h3 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
          color: #111827;
          line-height: 1.4;
        }

        .quill-scroll-wrapper .ql-editor h4 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: #111827;
        }

        .quill-scroll-wrapper .ql-editor h5 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.125rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: #111827;
        }

        .quill-scroll-wrapper .ql-editor h6 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: #111827;
        }

        /* Parágrafos */
        .quill-scroll-wrapper .ql-editor p {
          margin-bottom: 1rem;
          line-height: 1.75;
        }

        /* Links */
        .quill-scroll-wrapper .ql-editor a {
          color: #9333ea;
          text-decoration: underline;
          transition: color 0.2s;
        }

        .quill-scroll-wrapper .ql-editor a:hover {
          color: #7e22ce;
        }

        /* Listas */
        .quill-scroll-wrapper .ql-editor ul,
        .quill-scroll-wrapper .ql-editor ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }

        .quill-scroll-wrapper .ql-editor li {
          margin-bottom: 0.5rem;
          line-height: 1.75;
        }

        /* Citações */
        .quill-scroll-wrapper .ql-editor blockquote {
          border-left: 4px solid #9333ea;
          padding-left: 1.5rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #6b7280;
          background: #f9fafb;
          padding: 1rem 1.5rem;
          border-radius: 0.5rem;
        }

        /* Código */
        .quill-scroll-wrapper .ql-editor code {
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-family: 'Courier New', monospace;
          font-size: 0.875rem;
          color: #dc2626;
        }

        .quill-scroll-wrapper .ql-editor pre {
          background: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
        }

        .quill-scroll-wrapper .ql-editor pre code {
          background: transparent;
          color: #f9fafb;
          padding: 0;
        }

        /* Estilo do editor */
        .quill-editor {
          border-radius: 0.5rem;
          border: none;
        }

        /* Imagens redimensionáveis */
        .quill-editor img {
          cursor: pointer;
          max-width: 100%;
          height: auto;
        }

        /* Controles de redimensionamento */
        .quill-editor .ql-editor img {
          display: inline-block;
        }

        /* Vídeos customizados */
        .quill-editor .ql-editor .video-wrapper {
          position: relative;
          display: block;
          cursor: pointer;
          border: 2px solid transparent;
          transition: border-color 0.2s;
        }

        .quill-editor .ql-editor .video-wrapper:hover {
          border-color: #9333ea;
        }

        .quill-editor .ql-editor .video-wrapper iframe {
          width: 100%;
          display: block;
          pointer-events: none;
        }

        /* Alinhamento de imagens e vídeos - Forçar alinhamento correto */
        .quill-editor .ql-editor p.ql-align-center,
        .quill-editor .ql-editor .ql-align-center {
          text-align: center !important;
          display: block;
        }

        .quill-editor .ql-editor p.ql-align-center img,
        .quill-editor .ql-editor .ql-align-center img,
        .quill-editor .ql-editor p.ql-align-center iframe,
        .quill-editor .ql-editor .ql-align-center iframe {
          display: block !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }

        .quill-editor .ql-editor p.ql-align-right,
        .quill-editor .ql-editor .ql-align-right {
          text-align: right !important;
          display: block;
        }

        .quill-editor .ql-editor p.ql-align-right img,
        .quill-editor .ql-editor .ql-align-right img,
        .quill-editor .ql-editor p.ql-align-right iframe,
        .quill-editor .ql-editor .ql-align-right iframe {
          display: block !important;
          margin-left: auto !important;
          margin-right: 0 !important;
        }

        .quill-editor .ql-editor p.ql-align-left,
        .quill-editor .ql-editor .ql-align-left {
          text-align: left !important;
          display: block;
        }

        .quill-editor .ql-editor p.ql-align-left img,
        .quill-editor .ql-editor .ql-align-left img,
        .quill-editor .ql-editor p.ql-align-left iframe,
        .quill-editor .ql-editor .ql-align-left iframe {
          display: block !important;
          margin-left: 0 !important;
          margin-right: auto !important;
        }

        /* Imagens e vídeos sem alinhamento específico */
        .quill-editor .ql-editor p:not([class*="ql-align"]) img,
        .quill-editor .ql-editor p:not([class*="ql-align"]) iframe {
          display: block;
          margin-left: 0;
          margin-right: auto;
        }

        /* Estilo dos botões da toolbar */
        .quill-editor .ql-toolbar button:hover {
          color: #9333ea;
        }

        .quill-editor .ql-toolbar button.ql-active {
          color: #9333ea;
        }

        /* Placeholder */
        .quill-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: italic;
        }

        /* Botões customizados de alinhamento de imagem e componentes */
        .quill-editor .ql-toolbar button.ql-image-align-left,
        .quill-editor .ql-toolbar button.ql-image-align-center,
        .quill-editor .ql-toolbar button.ql-image-align-right,
        .quill-editor .ql-toolbar button.ql-edit-video,
        .quill-editor .ql-toolbar button.ql-insert-component,
        .quill-editor .ql-toolbar button.ql-insert-table {
          width: 28px;
          height: 24px;
          padding: 2px;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .quill-editor .ql-toolbar button.ql-insert-table svg {
          width: 18px;
          height: 18px;
        }

        .quill-editor .ql-toolbar button.ql-insert-table .ql-stroke {
          fill: none;
          stroke: #444;
          stroke-width: 1;
        }

        .quill-editor .ql-toolbar button.ql-insert-table .ql-fill {
          fill: #444;
          stroke: none;
        }

        .quill-editor .ql-toolbar button.ql-image-align-left:hover,
        .quill-editor .ql-toolbar button.ql-image-align-center:hover,
        .quill-editor .ql-toolbar button.ql-image-align-right:hover,
        .quill-editor .ql-toolbar button.ql-edit-video:hover,
        .quill-editor .ql-toolbar button.ql-insert-component:hover,
        .quill-editor .ql-toolbar button.ql-insert-table:hover {
          background: #f3f4f6;
        }

        .quill-editor .ql-toolbar button.ql-insert-table:hover .ql-stroke {
          stroke: #9333ea;
        }

        .quill-editor .ql-toolbar button.ql-insert-table:hover .ql-fill {
          fill: #9333ea;
        }

        .quill-editor .ql-toolbar button.ql-image-align-left:active,
        .quill-editor .ql-toolbar button.ql-image-align-center:active,
        .quill-editor .ql-toolbar button.ql-image-align-right:active,
        .quill-editor .ql-toolbar button.ql-edit-video:active,
        .quill-editor .ql-toolbar button.ql-insert-component:active,
        .quill-editor .ql-toolbar button.ql-insert-table:active {
          background: #e5e7eb;
        }

        /* Estilos para tabelas */
        .quill-editor .ql-editor table {
          border-collapse: collapse;
          width: 100%;
          margin: 20px 0;
        }

        .quill-editor .ql-editor table td,
        .quill-editor .ql-editor table th {
          border: 1px solid #ddd;
          padding: 8px 12px;
          min-width: 50px;
        }

        .quill-editor .ql-editor table th {
          background-color: #f3f4f6;
          font-weight: 600;
          text-align: left;
        }

        .quill-editor .ql-editor table tr:nth-child(even) {
          background-color: #f9fafb;
        }

        .quill-editor .ql-editor table tr:hover {
          background-color: #f3f4f6;
        }

        /* Animações para componentes */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .quill-editor .ql-editor .card-person-animate {
          animation: fadeInUp 0.6s ease-out;
        }

        .quill-editor .ql-editor .card-person-animate:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 12px rgba(0,0,0,0.15) !important;
        }

        /* Estilos para details/summary (accordion) */
        .quill-editor .ql-editor details summary {
          list-style: none;
        }

        .quill-editor .ql-editor details summary::-webkit-details-marker {
          display: none;
        }

        .quill-editor .ql-editor details summary::before {
          content: '▶';
          display: inline-block;
          margin-right: 8px;
          transition: transform 0.2s;
        }

        .quill-editor .ql-editor details[open] summary::before {
          transform: rotate(90deg);
        }

        /* Estilos para Grid de Cards - Forçar layout em colunas */
        .quill-editor .ql-editor .card-grid-container {
          display: grid !important;
          gap: 20px !important;
          margin: 30px 0 !important;
          width: 100% !important;
        }

        .quill-editor .ql-editor .card-grid-container .grid-card-item {
          display: block !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }

        .quill-editor .ql-editor .card-grid-container .grid-card-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 12px rgba(0,0,0,0.15) !important;
        }

        /* Card de Pessoa - Pré-visualização visual */
        .quill-scroll-wrapper .ql-editor .card-person-animate {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          text-align: center;
          margin: 20px 0;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .quill-scroll-wrapper .ql-editor .card-person-animate:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 12px rgba(0,0,0,0.15);
        }

        /* Hero Box - Pré-visualização visual com gradiente */
        .quill-scroll-wrapper .ql-editor .hero-box-gradient {
          border-radius: 16px !important;
          padding: 40px !important;
          margin: 30px 0 !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2) !important;
          animation: fadeInUp 0.6s ease-out;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          min-height: 150px;
        }

        .quill-scroll-wrapper .ql-editor .hero-box-gradient:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.25) !important;
        }

        /* Gradientes específicos */
        .quill-scroll-wrapper .ql-editor .hero-box-purple-pink {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%) !important;
        }

        .quill-scroll-wrapper .ql-editor .hero-box-blue-purple {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #667eea 100%) !important;
        }

        .quill-scroll-wrapper .ql-editor .hero-box-green-blue {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 50%, #4facfe 100%) !important;
        }

        .quill-scroll-wrapper .ql-editor .hero-box-orange-red {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 50%, #fa709a 100%) !important;
        }

        .quill-scroll-wrapper .ql-editor .hero-box-purple-blue {
          background: linear-gradient(135deg, #a8edea 0%, #667eea 50%, #764ba2 100%) !important;
        }

        .quill-scroll-wrapper .ql-editor .hero-box-pink-orange {
          background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #ffecd2 100%) !important;
        }

        .quill-scroll-wrapper .ql-editor .hero-box-title {
          font-size: 2rem !important;
          font-weight: 700 !important;
          margin-bottom: 15px !important;
          margin-top: 0 !important;
          color: white !important;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
          font-family: 'Playfair Display', Georgia, serif !important;
        }

        .quill-scroll-wrapper .ql-editor .hero-box-desc {
          font-size: 1.125rem !important;
          line-height: 1.6 !important;
          color: rgba(255,255,255,0.95) !important;
          margin: 0 !important;
        }

        /* Caixas de Destaque - Pré-visualização visual */
        .quill-scroll-wrapper .ql-editor div[style*="border-left: 4px solid"] {
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }

        /* Call-to-Action - Pré-visualização visual */
        .quill-scroll-wrapper .ql-editor a[style*="display: inline-block"][style*="padding: 15px"] {
          display: inline-block;
          padding: 15px 40px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 18px;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .quill-scroll-wrapper .ql-editor a[style*="display: inline-block"][style*="padding: 15px"]:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }

        /* Timeline - Pré-visualização visual */
        .quill-scroll-wrapper .ql-editor div[style*="border-left: 3px solid #9333ea"] {
          position: relative;
        }

        /* Accordion - Pré-visualização visual */
        .quill-scroll-wrapper .ql-editor details {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 10px;
          transition: background 0.2s;
        }

        .quill-scroll-wrapper .ql-editor details:hover {
          background: #f9fafb;
        }

        .quill-scroll-wrapper .ql-editor details summary {
          font-weight: 600;
          color: #333;
          cursor: pointer;
          font-size: 16px;
          list-style: none;
        }

        .quill-scroll-wrapper .ql-editor details summary::-webkit-details-marker {
          display: none;
        }

        .quill-scroll-wrapper .ql-editor details summary::before {
          content: '▶';
          display: inline-block;
          margin-right: 8px;
          transition: transform 0.2s;
          color: #9333ea;
        }

        .quill-scroll-wrapper .ql-editor details[open] summary::before {
          transform: rotate(90deg);
        }

        .quill-scroll-wrapper .ql-editor details p {
          margin-top: 15px;
          color: #666;
          line-height: 1.6;
        }

        /* Estilos do quill-table-ui */
        .quill-editor .ql-table-tooltip {
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          padding: 8px;
          z-index: 1000;
        }

        .quill-editor .ql-table-tooltip button {
          padding: 4px 8px;
          margin: 2px;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
          border-radius: 3px;
          font-size: 12px;
        }

        .quill-editor .ql-table-tooltip button:hover {
          background: #f3f4f6;
          color: #9333ea;
        }
      `}</style>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={content}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="quill-editor"
      />
    </div>
  );
};

export default QuillEditor;
