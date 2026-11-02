# 🧪 Como Testar a Gestão de Hero/Banner

## 🚀 Servidores
- **Backend**: http://localhost:5000 ✅ RODANDO
- **Frontend**: http://localhost:3001 ✅ RODANDO

## 📝 Passo a Passo

### 1. Fazer Login no Admin
1. Acesse: http://localhost:3001/admin/login
2. Email: `admin@igrejamir.com`
3. Senha: `Admin123`
4. Clique em "Entrar"

### 2. Acessar Gestão de Tema
1. No menu lateral, clique em **"Tema"**
2. Você verá 2 tabs:
   - **Cores Gerais** (cores principais do site)
   - **Hero / Banner** (configurações do hero) ⭐

### 3. Testar Configurações do Hero

#### Tab: Hero / Banner
Você verá um **preview em tempo real** no topo da página.

#### A. Testar Gradiente
1. **Cor Inicial**: Clique no color picker e escolha uma cor (ex: azul #3b82f6)
2. **Cor Final**: Escolha outra cor (ex: verde #10b981)
3. **Direção**: Clique em diferentes direções:
   - Horizontal →
   - Vertical ↓
   - Diagonal ↘
4. ✅ **Verificar**: Preview atualiza instantaneamente

#### B. Testar Cores do Texto
1. **Cor do Título**: Mude para amarelo (#fbbf24)
2. **Cor do Subtítulo**: Mude para branco (#ffffff)
3. ✅ **Verificar**: Texto no preview muda de cor

#### C. Testar Curva Inferior
1. Clique em cada estilo de curva:
   - **Wave** (Onda) - curva suave
   - **Curve** (Curva) - curva simples
   - **Triangle** (Triângulo) - pico central
   - **Tilt** (Inclinado) - diagonal
   - **None** (Sem Curva) - sem curva
2. **Cor da Curva**: Mude para cinza (#f3f4f6)
3. ✅ **Verificar**: Curva no preview muda

#### D. Testar Altura
1. Clique em cada tamanho:
   - **Pequeno** (300px)
   - **Médio** (400px)
   - **Grande** (500px)
   - **Extra Grande** (600px)
2. ✅ **Verificar**: Altura do preview muda

#### E. Testar Overlay
1. Clique em cada tipo:
   - **Sem Overlay** - sem camada
   - **Gradiente** - gradiente escuro
   - **Escuro** - camada escura sólida
   - **Claro** - camada clara sólida
2. ✅ **Verificar**: Overlay no preview muda

### 4. Salvar Configurações
1. Após fazer as alterações desejadas
2. Clique no botão **"Salvar Tema"** (roxo, no final da página)
3. ✅ **Verificar**: Aparece mensagem de sucesso (SweetAlert2)

### 5. Verificar no Site Público

#### A. Home Page (Carousel)
1. Acesse: http://localhost:3001/
2. ✅ **Verificar**:
   - Hero usa o gradiente configurado
   - Cores do texto estão corretas
   - Curva inferior está visível
   - Altura está correta
   - Overlay está aplicado

#### B. Páginas Internas
1. Acesse qualquer página interna, por exemplo:
   - http://localhost:3001/sobre
   - http://localhost:3001/ministerios
   - http://localhost:3001/eventos
2. ✅ **Verificar**:
   - Hero de cada página usa as mesmas configurações
   - Título da página aparece com a cor configurada
   - Subtítulo (metaDescricao) usa a cor configurada
   - Curva inferior está visível
   - Altura está correta

### 6. Testar Responsividade
1. Abra as ferramentas de desenvolvedor (F12)
2. Ative o modo responsivo (Ctrl+Shift+M ou Cmd+Shift+M)
3. Teste em diferentes tamanhos:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1920px)
4. ✅ **Verificar**:
   - Hero se adapta bem
   - Curva não quebra
   - Texto permanece legível
   - Botões ficam acessíveis

## 🎨 Combinações Sugeridas para Testar

### Combinação 1: Azul Oceano
```
Gradiente Início: #0ea5e9 (azul claro)
Gradiente Fim: #0284c7 (azul escuro)
Direção: Vertical ↓
Título: #ffffff (branco)
Subtítulo: #e0f2fe (azul muito claro)
Curva: Wave
Cor Curva: #ffffff (branco)
Altura: Grande
Overlay: Gradiente
```

### Combinação 2: Pôr do Sol
```
Gradiente Início: #f59e0b (laranja)
Gradiente Fim: #dc2626 (vermelho)
Direção: Diagonal ↘
Título: #ffffff (branco)
Subtítulo: #fef3c7 (amarelo claro)
Curva: Curve
Cor Curva: #fffbeb (creme)
Altura: Extra Grande
Overlay: Escuro
```

### Combinação 3: Floresta
```
Gradiente Início: #10b981 (verde)
Gradiente Fim: #059669 (verde escuro)
Direção: Horizontal →
Título: #ffffff (branco)
Subtítulo: #d1fae5 (verde claro)
Curva: Triangle
Cor Curva: #f0fdf4 (verde muito claro)
Altura: Médio
Overlay: Sem Overlay
```

### Combinação 4: Roxo/Rosa (Padrão MIR)
```
Gradiente Início: #9333ea (roxo)
Gradiente Fim: #ec4899 (rosa)
Direção: Horizontal →
Título: #ffffff (branco)
Subtítulo: #f3f4f6 (cinza claro)
Curva: Wave
Cor Curva: #ffffff (branco)
Altura: Médio
Overlay: Gradiente
```

## 🐛 Possíveis Problemas e Soluções

### Problema: Preview não atualiza
**Solução**: Recarregue a página do admin (F5)

### Problema: Mudanças não aparecem no site
**Solução**: 
1. Certifique-se de clicar em "Salvar Tema"
2. Recarregue a página do site (F5)
3. Limpe o cache do navegador (Ctrl+Shift+R ou Cmd+Shift+R)

### Problema: Curva não aparece
**Solução**: 
1. Verifique se selecionou um estilo diferente de "None"
2. Verifique se a cor da curva não é igual ao fundo

### Problema: Cores não mudam
**Solução**:
1. Verifique se salvou as alterações
2. Verifique se o tema foi carregado (console do navegador)
3. Recarregue a página

## ✅ Checklist de Testes

- [ ] Login no admin funciona
- [ ] Página de Tema carrega
- [ ] Tab "Hero / Banner" abre
- [ ] Preview aparece no topo
- [ ] Mudança de gradiente atualiza preview
- [ ] Mudança de direção atualiza preview
- [ ] Mudança de cores de texto atualiza preview
- [ ] Mudança de curva atualiza preview
- [ ] Mudança de altura atualiza preview
- [ ] Mudança de overlay atualiza preview
- [ ] Botão "Salvar Tema" funciona
- [ ] Mensagem de sucesso aparece
- [ ] Home page usa configurações do tema
- [ ] Páginas internas usam configurações do tema
- [ ] Responsivo funciona em mobile
- [ ] Responsivo funciona em tablet
- [ ] Responsivo funciona em desktop

## 📊 Resultado Esperado

Após completar todos os testes, você deve ter:
- ✅ Interface de gestão funcionando perfeitamente
- ✅ Preview em tempo real respondendo a todas as mudanças
- ✅ Salvamento persistindo no banco de dados
- ✅ Site público refletindo as configurações
- ✅ Consistência visual em todas as páginas
- ✅ Responsividade em todos os dispositivos

## 🎉 Sucesso!

Se todos os testes passaram, o sistema de gestão de Hero/Banner está funcionando perfeitamente! 🚀

---

**Desenvolvido para**: Igreja MIR (Ministério Internacional Renascer)
**Data**: Fevereiro 2026
