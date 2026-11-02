# Guia - Edição da Seção "Conheça Nosso Pastor"

## Acesso ao Painel Admin

Para editar a seção "Conheça Nosso Pastor" da landing page:

### URL de Acesso
```
http://localhost:3000/admin/pastor
```

### Credenciais
- Email: `admin@igrejamir.com`
- Senha: `Admin123`

---

## Funcionalidades Disponíveis

### 1. Título
- Campo de texto para o título principal
- Padrão: "Conheça Nosso Pastor"
- Cor personalizável

### 2. Texto Descritivo
- Área de texto grande para descrição do pastor
- Contador de caracteres
- Cor personalizável
- Suporta múltiplos parágrafos

### 3. Imagem de Fundo
- Upload de imagem (máximo 5MB)
- Formatos aceitos: JPG, PNG, GIF, WebP
- Recomendado: 1920x1080px
- Preview em tempo real

### 4. Cores Personalizáveis

#### Cor do Título
- Color picker visual
- Input de texto para código hex
- Padrão: #FFC107 (amarelo/dourado)

#### Cor do Texto
- Color picker visual
- Input de texto para código hex
- Padrão: #FFFFFF (branco)

#### Cor do Botão
- Color picker visual
- Input de texto para código hex
- Padrão: #FFC107 (amarelo/dourado)

#### Cor do Overlay
- Color picker para escolher a cor base
- Mostra código RGBA completo
- Padrão: Roxo (#6D28D9)

### 5. Transparência do Overlay
- Slider de 0% a 100%
- 0% = Totalmente transparente (mostra só a imagem)
- 100% = Totalmente opaco (cor sólida)
- Padrão: 85%
- Atualização em tempo real no preview

### 6. Botão (Opcional)

#### Texto do Botão
- Campo de texto
- Padrão: "Saiba Mais"
- Deixe vazio para não mostrar o botão

#### Link do Botão
- Campo URL
- Abre em nova aba
- Deixe vazio para não mostrar o botão

---

## Como Usar

### Passo 1: Acesse o Admin
1. Navegue para `http://localhost:3000/admin/pastor`
2. Faça login se necessário

### Passo 2: Edite o Conteúdo
1. **Título**: Digite o título desejado
2. **Texto**: Escreva a descrição do pastor
3. **Imagem**: Clique em "Escolher arquivo" e selecione uma imagem

### Passo 3: Personalize as Cores
1. **Cor do Título**: Clique no color picker ou digite o código hex
2. **Cor do Texto**: Escolha uma cor que contraste bem com o overlay
3. **Cor do Botão**: Escolha uma cor que se destaque
4. **Cor do Overlay**: Escolha a cor base do overlay

### Passo 4: Ajuste a Transparência
1. Use o slider para ajustar a transparência do overlay
2. Observe o preview em tempo real
3. Encontre o equilíbrio entre ver a imagem e ler o texto

### Passo 5: Configure o Botão (Opcional)
1. Digite o texto do botão (ex: "Conheça Mais", "Saiba Mais")
2. Cole o link de destino (ex: página sobre o pastor)
3. Deixe ambos vazios se não quiser mostrar o botão

### Passo 6: Visualize e Salve
1. Observe o preview à direita
2. Ajuste conforme necessário
3. Clique em "Salvar Alterações"
4. Aguarde a confirmação de sucesso

---

## Preview em Tempo Real

O painel inclui uma pré-visualização ao vivo que mostra:
- Como o título aparecerá
- Como o texto será exibido
- A imagem de fundo com overlay
- O botão (se configurado)
- Todas as cores aplicadas

### Dicas para o Preview
- Teste diferentes níveis de transparência
- Verifique se o texto está legível
- Confirme que as cores combinam bem
- Teste o contraste entre texto e fundo

---

## Exemplos de Configuração

### Exemplo 1: Overlay Escuro
```
Cor do Overlay: #1F2937 (cinza escuro)
Transparência: 80%
Cor do Título: #FFC107 (amarelo)
Cor do Texto: #FFFFFF (branco)
```
Resultado: Fundo escuro que destaca bem o texto claro

### Exemplo 2: Overlay Roxo Suave
```
Cor do Overlay: #9333EA (roxo)
Transparência: 70%
Cor do Título: #FCD34D (amarelo claro)
Cor do Texto: #F3F4F6 (cinza muito claro)
```
Resultado: Visual moderno com boa legibilidade

### Exemplo 3: Overlay Transparente
```
Cor do Overlay: #000000 (preto)
Transparência: 40%
Cor do Título: #FFFFFF (branco)
Cor do Texto: #F3F4F6 (cinza claro)
```
Resultado: Imagem mais visível com texto legível

### Exemplo 4: Overlay Opaco
```
Cor do Overlay: #6D28D9 (roxo)
Transparência: 95%
Cor do Título: #FFC107 (amarelo)
Cor do Texto: #FFFFFF (branco)
```
Resultado: Cor sólida com imagem quase invisível

---

## Dicas de Design

### Legibilidade
- Use transparência entre 70-90% para melhor legibilidade
- Cores claras de texto funcionam melhor em overlays escuros
- Cores escuras de texto funcionam melhor em overlays claros

### Contraste
- Teste o contraste entre título e fundo
- Teste o contraste entre texto e fundo
- Use ferramentas online de contraste se necessário

### Imagem de Fundo
- Use imagens de alta qualidade
- Evite imagens muito ocupadas (muitos detalhes)
- Imagens com áreas mais escuras funcionam melhor
- Considere usar imagens desfocadas para melhor legibilidade

### Cores
- Mantenha consistência com as cores do site
- O amarelo/dourado (#FFC107) é a cor de destaque do site
- Roxo (#9333EA) é a cor primária
- Rosa (#EC4899) é a cor secundária

---

## Solução de Problemas

### Texto não está legível
- Aumente a transparência do overlay (mais opaco)
- Escolha uma cor de overlay mais escura
- Use cores de texto mais claras

### Imagem não aparece
- Verifique se o upload foi concluído
- Confirme que a imagem tem menos de 5MB
- Tente fazer upload novamente
- Verifique o formato do arquivo

### Botão não aparece
- Certifique-se de preencher AMBOS os campos (texto e link)
- Verifique se salvou as alterações
- Recarregue a página

### Cores não aplicam
- Verifique se salvou as alterações
- Limpe o cache do navegador (Ctrl+Shift+R)
- Verifique se o código hex está correto (#RRGGBB)

---

## Campos do Banco de Dados

Para referência técnica, os campos salvos são:

```javascript
{
  titulo: String,           // Título da seção
  texto: String,            // Texto descritivo
  imagem: String,           // URL da imagem de fundo
  corTitulo: String,        // Cor do título (hex)
  corTexto: String,         // Cor do texto (hex)
  corBotao: String,         // Cor do botão (hex)
  textoBotao: String,       // Texto do botão
  linkBotao: String,        // URL do botão
  corFundo: String,         // Cor do overlay (rgba)
  transparencia: Number     // Nível de transparência (0-100)
}
```

---

## Integração com a Landing Page

A seção "Conheça Nosso Pastor" aparece automaticamente na landing page (home) do site.

### Localização
- Abaixo da seção de valores/missão
- Acima da seção de próximos eventos
- Visível em: `http://localhost:3000`

### Componente Frontend
- Arquivo: `frontend/components/SobreOPastor.js`
- Carrega dados automaticamente da API
- Atualiza em tempo real após salvar no admin

---

## Suporte

Se encontrar problemas:
1. Verifique o console do navegador (F12)
2. Confirme que está logado como admin
3. Verifique a conexão com o backend
4. Tente limpar o cache do navegador
5. Recarregue a página do admin

---

## Checklist de Publicação

Antes de publicar alterações:
- [ ] Título está correto e sem erros de digitação
- [ ] Texto está completo e revisado
- [ ] Imagem foi carregada e está visível
- [ ] Cores estão harmoniosas e legíveis
- [ ] Transparência permite ler o texto claramente
- [ ] Botão está configurado (se desejado)
- [ ] Preview está satisfatório
- [ ] Alterações foram salvas
- [ ] Landing page foi verificada
