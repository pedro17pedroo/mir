# Guia de Teste - Navbar Temática

## Como Testar a Nova Navbar

### 1. Acesse o Painel Admin
```
http://localhost:3000/admin/tema
```
Login: `admin@igrejamir.com` / `Admin123`

### 2. Navegue até a aba "Navbar/Menu"
Clique na aba com ícone de barras (FaBars)

---

## Testes Básicos

### Teste 1: Cores da Navbar
1. Altere a "Cor de Fundo" para uma cor diferente (ex: #1f2937 - cinza escuro)
2. Altere a "Cor do Texto" para branco (#ffffff)
3. Altere a "Cor do Texto (Hover)" para roxo (#9333ea)
4. Clique em "Salvar Tema"
5. Abra o site em outra aba: `http://localhost:3000`
6. ✅ Verifique se a navbar tem a cor de fundo cinza escuro
7. ✅ Verifique se o texto está branco
8. ✅ Passe o mouse sobre os menus e veja se ficam roxos

### Teste 2: Transparência
1. No admin, marque "Navbar Transparente (no topo)"
2. Marque "Opaca ao Rolar (scroll)"
3. Salve
4. Volte ao site
5. ✅ No topo da página, a navbar deve estar transparente com texto branco
6. ✅ Role a página para baixo
7. ✅ A navbar deve ficar opaca com as cores configuradas

### Teste 3: Borda
1. No admin, marque "Mostrar Borda Inferior"
2. Altere "Cor da Borda" para amarelo/dourado (#fbbf24)
3. Salve
4. Volte ao site
5. ✅ Deve aparecer uma borda amarela de 4px na parte inferior da navbar

### Teste 4: Altura
1. Teste cada opção de altura:
   - Compacta (navbar mais fina)
   - Normal (altura padrão)
   - Grande (navbar mais alta)
2. ✅ Verifique se o logo e menus se ajustam corretamente

### Teste 5: Posição
1. Teste cada posição:
   - **Fixa**: Navbar sempre visível no topo ao rolar
   - **Sticky**: Navbar fixa quando você rola para baixo
   - **Estática**: Navbar rola junto com a página
2. ✅ Role a página e observe o comportamento

### Teste 6: Efeito Blur
1. Marque "Efeito Blur no Fundo"
2. Salve
3. ✅ A navbar deve ter um efeito de vidro fosco (glassmorphism)

### Teste 7: Sombra
1. Marque "Mostrar Sombra"
2. Salve
3. ✅ Deve aparecer uma sombra sutil abaixo da navbar

---

## Testes de Dropdown

### Teste 8: Cores do Dropdown
1. Altere "Cor de Fundo" do dropdown para cinza claro (#f3f4f6)
2. Altere "Cor do Texto" para cinza escuro (#1f2937)
3. Altere "Cor do Texto (Hover)" para roxo (#9333ea)
4. Altere "Cor de Fundo (Hover)" para roxo claro (#f3e8ff)
5. Salve
6. No site, passe o mouse sobre um menu com submenus (ex: "Sobre")
7. ✅ O dropdown deve aparecer com fundo cinza claro
8. ✅ Passe o mouse sobre os itens e veja o hover roxo

### Teste 9: Borda e Sombra do Dropdown
1. Marque "Mostrar Sombra" no dropdown
2. Marque "Mostrar Borda"
3. Altere "Cor da Borda" para cinza (#e5e7eb)
4. Salve
5. ✅ O dropdown deve ter sombra e borda cinza

---

## Testes de Página Ativa

### Teste 10: Destaque de Página Ativa
1. Configure "Cor do Texto (Ativo)" para rosa (#ec4899)
2. Salve
3. Navegue para diferentes páginas do site
4. ✅ O menu da página atual deve estar em rosa
5. ✅ Se estiver em uma subpágina, o menu pai também deve estar destacado

---

## Testes Avançados

### Teste 11: Combinação Transparente + Blur
1. Marque "Navbar Transparente"
2. Marque "Opaca ao Rolar"
3. Marque "Efeito Blur"
4. Configure cor de fundo branca (#ffffff)
5. Salve
6. ✅ No topo: transparente com texto branco
7. ✅ Ao rolar: fundo branco semi-transparente com blur

### Teste 12: Navbar Escura Completa
1. Cor de Fundo: #1f2937 (cinza escuro)
2. Cor do Texto: #ffffff (branco)
3. Cor do Texto (Hover): #fbbf24 (amarelo)
4. Cor do Texto (Ativo): #ec4899 (rosa)
5. Borda: Ativada, cor #fbbf24 (amarelo)
6. Dropdown Cor de Fundo: #374151 (cinza médio)
7. Dropdown Cor do Texto: #ffffff (branco)
8. Salve
9. ✅ Deve ter uma navbar escura elegante com destaques coloridos

### Teste 13: Navbar Minimalista
1. Cor de Fundo: #ffffff (branco)
2. Cor do Texto: #6b7280 (cinza)
3. Cor do Texto (Hover): #1f2937 (cinza escuro)
4. Sombra: Desativada
5. Borda: Desativada
6. Altura: Compacta
7. Salve
8. ✅ Navbar limpa e minimalista

---

## Checklist de Validação Final

- [ ] Todas as cores são aplicadas corretamente
- [ ] Transparência funciona no topo
- [ ] Opacidade ao rolar funciona
- [ ] Borda aparece com a cor correta
- [ ] Altura muda conforme configuração
- [ ] Posição (fixed/sticky/static) funciona
- [ ] Blur aplica efeito glassmorphism
- [ ] Sombra aparece quando ativada
- [ ] Dropdown tem cores corretas
- [ ] Hover do dropdown funciona
- [ ] Página ativa é destacada
- [ ] Menu pai fica ativo quando submenu está ativo
- [ ] Transições são suaves
- [ ] Não há erros no console
- [ ] Funciona em diferentes páginas

---

## Problemas Conhecidos

Nenhum problema conhecido no momento.

---

## Suporte

Se encontrar algum problema:
1. Verifique o console do navegador (F12)
2. Confirme que salvou as alterações no admin
3. Recarregue a página (Ctrl+R ou Cmd+R)
4. Limpe o cache se necessário (Ctrl+Shift+R ou Cmd+Shift+R)
