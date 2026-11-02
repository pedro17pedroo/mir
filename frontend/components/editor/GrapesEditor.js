'use client';
import { useEffect, useRef, useState } from 'react';
import 'grapesjs/dist/css/grapes.min.css';

const GrapesEditor = ({ value, onChange, templateTrigger, className = '' }) => {
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (editor && templateTrigger?.html !== undefined) {
      editor.setComponents(templateTrigger.html);
    }
  }, [editor, templateTrigger]);

  useEffect(() => {
    if (!isMounted || !editorRef.current) return;

    // Importar GrapesJS dinamicamente (client-side only)
    import('grapesjs').then((grapesjs) => {
      import('grapesjs-preset-webpage').then((presetWebpage) => {
        import('grapesjs-blocks-basic').then((blocksBasic) => {
          
          const editorInstance = grapesjs.default.init({
            container: editorRef.current,
            height: '100%',
            width: 'auto',
            storageManager: false,
            
            // Plugins
            plugins: [presetWebpage.default, blocksBasic.default],
            
            pluginsOpts: {
              'grapesjs-preset-webpage': {
                modalImportTitle: 'Importar',
                modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">Cole aqui seu HTML/CSS</div>',
                modalImportContent: (editor) => {
                  return editor.getHtml() + '<style>' + editor.getCss() + '</style>';
                },
                filestackOpts: null,
                aviaryOpts: false,
                blocksBasicOpts: {
                  blocks: ['column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video'],
                  flexGrid: 1,
                },
                customStyleManager: [],
              }
            },

            // Canvas
            canvas: {
              styles: [
                'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@700;800;900&display=swap',
              ],
              scripts: [],
            },

            // Seletor de dispositivos
            deviceManager: {
              devices: [
                {
                  name: 'Desktop',
                  width: '',
                },
                {
                  name: 'Tablet',
                  width: '768px',
                  widthMedia: '992px',
                },
                {
                  name: 'Mobile',
                  width: '320px',
                  widthMedia: '480px',
                },
              ],
            },

            // Configurações de rich text editor
            richTextEditor: {
              actions: ['bold', 'italic', 'underline', 'strikethrough', 'link'],
            },

            // Upload local de imagens diretamente do computador (com compressão automática em Canvas)
            assetManager: {
              upload: false,
              uploadText: 'Arraste imagens para aqui ou clique para escolher do computador',
              addBtnText: 'Adicionar Imagem',
              uploadFile: (e) => {
                const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
                if (!files || !files.length) return;

                Array.from(files).forEach((file) => {
                  if (!file.type.startsWith('image/')) return;
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                      const canvas = document.createElement('canvas');
                      let width = img.width;
                      let height = img.height;
                      const maxW = 1400;
                      if (width > maxW) {
                        height = Math.round((height * maxW) / width);
                        width = maxW;
                      }
                      canvas.width = width;
                      canvas.height = height;
                      const ctx = canvas.getContext('2d');
                      ctx.drawImage(img, 0, 0, width, height);
                      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
                      editorInstance.AssetManager.add({
                        src: dataUrl,
                        name: file.name,
                        width,
                        height,
                      });
                    };
                    img.src = event.target.result;
                  };
                  reader.readAsDataURL(file);
                });
              },
            },
          });

          // Adicionar blocos customizados para igreja
          editorInstance.BlockManager.add('hero-section', {
            label: '🎨 Hero Section',
            category: 'Igreja',
            content: `
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); padding: 60px 20px; text-align: center; border-radius: 16px; margin: 20px 0;">
                <h1 style="color: white; font-size: 3rem; margin-bottom: 20px; font-family: 'Playfair Display', serif;">Título Principal</h1>
                <p style="color: rgba(255,255,255,0.95); font-size: 1.25rem; max-width: 600px; margin: 0 auto;">Descrição ou subtítulo da seção</p>
              </div>
            `,
          });

          editorInstance.BlockManager.add('card-person', {
            label: '👤 Card Pessoa',
            category: 'Igreja',
            content: `
              <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; margin: 20px 0;">
                <div style="font-size: 48px; margin-bottom: 20px;">👤</div>
                <h3 style="font-size: 24px; margin-bottom: 10px; color: #333; font-weight: 700;">Nome da Pessoa</h3>
                <p style="color: #9333ea; font-weight: 600; margin-bottom: 15px;">Cargo ou Função</p>
                <p style="color: #666; line-height: 1.6;">Breve descrição sobre a pessoa.</p>
              </div>
            `,
          });

          editorInstance.BlockManager.add('grid-cards', {
            label: '📦 Grid 3 Cards',
            category: 'Igreja',
            content: `
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 30px 0;">
                <div style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center;">
                  <div style="font-size: 40px; margin-bottom: 15px;">📦</div>
                  <h4 style="font-size: 20px; margin-bottom: 10px; color: #333; font-weight: 600;">Card 1</h4>
                  <p style="color: #666; line-height: 1.6;">Descrição do card</p>
                </div>
                <div style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center;">
                  <div style="font-size: 40px; margin-bottom: 15px;">📦</div>
                  <h4 style="font-size: 20px; margin-bottom: 10px; color: #333; font-weight: 600;">Card 2</h4>
                  <p style="color: #666; line-height: 1.6;">Descrição do card</p>
                </div>
                <div style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center;">
                  <div style="font-size: 40px; margin-bottom: 15px;">📦</div>
                  <h4 style="font-size: 20px; margin-bottom: 10px; color: #333; font-weight: 600;">Card 3</h4>
                  <p style="color: #666; line-height: 1.6;">Descrição do card</p>
                </div>
              </div>
            `,
          });

          editorInstance.BlockManager.add('cta-button', {
            label: '🎯 Botão CTA',
            category: 'Igreja',
            content: `
              <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="display: inline-block; background: #9333ea; color: white; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 18px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Clique Aqui</a>
              </div>
            `,
          });

          editorInstance.BlockManager.add('bible-verse', {
            label: '📖 Versículo Bíblico',
            category: 'Igreja',
            content: `
              <div style="background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%); border-left: 6px solid #9333ea; border-radius: 16px; padding: 36px 32px; margin: 30px 0; text-align: center;">
                <p style="font-family: 'Playfair Display', serif; font-size: 1.5rem; font-style: italic; color: #3b0764; line-height: 1.6; margin-bottom: 14px;">
                  &ldquo;Porque Deus amou o mundo de tal maneira que deu o seu Filho unigénito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.&rdquo;
                </p>
                <span style="display: inline-block; font-weight: 700; color: #9333ea; letter-spacing: 0.08em; text-transform: uppercase; font-size: 0.875rem;">
                  João 3:16
                </span>
              </div>
            `,
          });

          editorInstance.BlockManager.add('two-col-feature', {
            label: '🖼️ Imagem + Texto',
            category: 'Igreja',
            content: `
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 36px; align-items: center; margin: 40px 0;">
                <div>
                  <img src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&auto=format&fit=crop&q=80" alt="Igreja" style="width: 100%; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.12); object-fit: cover; max-height: 380px;" />
                </div>
                <div>
                  <span style="display: inline-block; background: #f3e8ff; color: #7e22ce; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 9999px; margin-bottom: 12px; text-transform: uppercase;">Nossa Missão</span>
                  <h2 style="font-size: 2rem; font-weight: 700; color: #1f2937; margin-bottom: 16px;">Uma Igreja Família para Você</h2>
                  <p style="color: #4b5563; line-height: 1.75; margin-bottom: 20px;">
                    Somos uma comunidade apaixonada por Jesus, dedicada a acolher pessoas, ensinar a Palavra de Deus e servir com excelência e amor.
                  </p>
                  <a href="/sou-novo" style="display: inline-block; background: #9333ea; color: white; padding: 12px 28px; border-radius: 9999px; text-decoration: none; font-weight: 600;">Saiba Mais</a>
                </div>
              </div>
            `,
          });

          editorInstance.BlockManager.add('service-times', {
            label: '⏰ Horários dos Cultos',
            category: 'Igreja',
            content: `
              <div style="background: #1f2937; color: white; border-radius: 20px; padding: 40px 30px; margin: 36px 0; text-align: center;">
                <h3 style="font-size: 28px; font-weight: 700; margin-bottom: 8px; color: #ffffff;">Nossos Cultos e Reuniões</h3>
                <p style="color: #d1d5db; margin-bottom: 28px;">Venha celebrar connosco presencialmente ou online</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px;">
                  <div style="background: rgba(255,255,255,0.08); padding: 24px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.12);">
                    <div style="color: #c084fc; font-weight: 700; font-size: 14px; text-transform: uppercase; margin-bottom: 6px;">Domingo</div>
                    <div style="font-size: 22px; font-weight: 700; margin-bottom: 6px;">Culto de Celebração</div>
                    <div style="color: #e5e7eb; font-size: 15px;">10h00 & 18h00</div>
                  </div>
                  <div style="background: rgba(255,255,255,0.08); padding: 24px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.12);">
                    <div style="color: #c084fc; font-weight: 700; font-size: 14px; text-transform: uppercase; margin-bottom: 6px;">Quarta-feira</div>
                    <div style="font-size: 22px; font-weight: 700; margin-bottom: 6px;">Estudo Bíblico</div>
                    <div style="color: #e5e7eb; font-size: 15px;">19h30</div>
                  </div>
                  <div style="background: rgba(255,255,255,0.08); padding: 24px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.12);">
                    <div style="color: #c084fc; font-weight: 700; font-size: 14px; text-transform: uppercase; margin-bottom: 6px;">Sábado</div>
                    <div style="font-size: 22px; font-weight: 700; margin-bottom: 6px;">Rede de Jovens</div>
                    <div style="color: #e5e7eb; font-size: 15px;">18h30</div>
                  </div>
                </div>
              </div>
            `,
          });

          editorInstance.BlockManager.add('photo-gallery-4', {
            label: '📸 Galeria 4 Fotos',
            category: 'Igreja',
            content: `
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 30px 0;">
                <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&auto=format&fit=crop&q=80" alt="Foto 1" style="width: 100%; height: 220px; object-fit: cover; border-radius: 12px;" />
                <img src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600&auto=format&fit=crop&q=80" alt="Foto 2" style="width: 100%; height: 220px; object-fit: cover; border-radius: 12px;" />
                <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80" alt="Foto 3" style="width: 100%; height: 220px; object-fit: cover; border-radius: 12px;" />
                <img src="https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&auto=format&fit=crop&q=80" alt="Foto 4" style="width: 100%; height: 220px; object-fit: cover; border-radius: 12px;" />
              </div>
            `,
          });

          // Carregar conteúdo inicial
          if (value) {
            editorInstance.setComponents(value);
          }

          // Atualizar onChange quando o conteúdo mudar
          editorInstance.on('update', () => {
            const html = editorInstance.getHtml();
            const css = editorInstance.getCss();
            const fullContent = html + (css ? `<style>${css}</style>` : '');
            
            if (onChange) {
              onChange(fullContent);
            }
          });

          setEditor(editorInstance);
        });
      });
    });

    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [isMounted]);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grapesjs-editor h-full ${className}`}>
      <style jsx global>{`
        .grapesjs-editor {
          border: 1px solid #e5e7eb;
          border-radius: 0;
          overflow: hidden;
          height: 100%;
        }

        .grapesjs-editor > div {
          height: 100% !important;
        }

        /* Customizar cores do GrapesJS */
        .gjs-one-bg {
          background-color: #1f2937;
        }

        .gjs-two-color {
          color: #9333ea;
        }

        .gjs-three-bg {
          background-color: #9333ea;
          color: white;
        }

        .gjs-four-color,
        .gjs-four-color-h:hover {
          color: #9333ea;
        }

        /* Painel de blocos */
        .gjs-block {
          min-height: 80px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .gjs-block:hover {
          border-color: #9333ea;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(147, 51, 234, 0.1);
        }

        /* Canvas */
        .gjs-cv-canvas {
          background-color: #f9fafb;
          height: 100%;
        }

        /* Toolbar */
        .gjs-toolbar {
          background-color: #9333ea !important;
        }

        .gjs-toolbar-item {
          color: white !important;
        }

        /* Frame */
        .gjs-frame {
          height: 100%;
        }
      `}</style>
      
      <div ref={editorRef} style={{ height: '100%' }}></div>
    </div>
  );
};

export default GrapesEditor;
