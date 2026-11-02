# 🧪 Teste do Sistema de Mapas

## Como Testar a Implementação

### 1️⃣ Iniciar os Servidores

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

### 2️⃣ Testar no Admin

#### Acessar o Admin
1. Abra: `http://localhost:3001/admin/login`
2. Login: `admin@igrejamir.com`
3. Senha: `Admin123`

#### Criar Evento com Localização
1. Vá para **Gestão de Eventos**
2. Clique em **Novo Evento**
3. Preencha os dados:
   - **Título:** Culto de Celebração
   - **Descrição:** Culto especial de celebração
   - **Data Início:** Escolha uma data futura
   - **Horário Início:** 19:00
   - **Local:** Igreja MIR - Sede Central

4. **Adicionar Localização:**
   - Clique em "Adicionar Localização"
   - O mapa será exibido

5. **Opção A - Buscar Endereço:**
   - Digite: "Avenida Paulista, 1000, São Paulo"
   - Clique em "Buscar"
   - Aguarde o mapa centralizar
   - Verifique o card verde com o endereço

6. **Opção B - Clicar no Mapa:**
   - Navegue pelo mapa (arraste)
   - Dê zoom (roda do mouse)
   - Clique no local desejado
   - Aguarde o endereço aparecer

7. **Salvar:**
   - Clique em "Criar Evento"
   - Aguarde confirmação

#### Editar Evento Existente
1. Na lista de eventos, clique em **Editar**
2. O mapa deve aparecer com a localização salva
3. Teste mover o marcador clicando em outro local
4. Salve as alterações

---

### 3️⃣ Testar no Site Público

#### Acessar Página de Eventos
1. Abra: `http://localhost:3001/eventos`
2. Verifique se os eventos aparecem
3. Clique em um evento com localização

#### Verificar Mapa na Página de Detalhes
1. Role até a seção **"Como Chegar"**
2. Verifique se o mapa carrega
3. Verifique se o marcador está correto
4. Clique no marcador para ver o popup

#### Testar Navegação
1. Clique em **"Abrir no Google Maps"**
   - Deve abrir o Google Maps em nova aba
   - Localização deve estar correta

2. Clique em **"Abrir no Waze"**
   - Deve abrir o Waze (ou site do Waze)
   - Localização deve estar correta

---

### 4️⃣ Testar Evento de Exemplo

Um evento de teste já foi criado:

**URL:** `http://localhost:3001/eventos/conferencia-de-fe-2026`

**Verificar:**
- ✅ Mapa carrega corretamente
- ✅ Marcador na Av. Paulista, 1000
- ✅ Popup com informações
- ✅ Botões de navegação funcionam
- ✅ Endereço exibido corretamente

---

### 5️⃣ Testes de Responsividade

#### Desktop
1. Abra em tela cheia
2. Verifique layout do mapa
3. Teste navegação e zoom

#### Tablet
1. Redimensione para ~768px
2. Verifique se mapa se adapta
3. Teste touch gestures

#### Mobile
1. Redimensione para ~375px
2. Verifique se botões ficam empilhados
3. Teste pinch to zoom

---

### 6️⃣ Testes de Funcionalidade

#### Busca de Endereço
- [ ] Busca endereço completo
- [ ] Busca endereço parcial
- [ ] Busca ponto de referência
- [ ] Exibe erro para endereço inválido
- [ ] Loading state funciona

#### Seleção no Mapa
- [ ] Clique adiciona marcador
- [ ] Clique move marcador existente
- [ ] Busca endereço automaticamente
- [ ] Exibe coordenadas corretas

#### Navegação
- [ ] Arraste move o mapa
- [ ] Zoom com roda do mouse
- [ ] Zoom com botões +/-
- [ ] Pinch to zoom (mobile)

#### Salvamento
- [ ] Localização salva no banco
- [ ] Localização carrega ao editar
- [ ] Localização exibe no site público
- [ ] Pode remover localização

---

### 7️⃣ Testes de Integração

#### Criar Evento Completo
```javascript
{
  titulo: "Teste de Integração",
  descricao: "Evento de teste",
  dataInicio: "2026-03-20",
  horarioInicio: "19:00",
  local: "Local de Teste",
  localizacao: {
    latitude: -23.5505,
    longitude: -46.6333,
    endereco: "Av. Paulista, 1000"
  },
  organizador: "Teste",
  destaque: true,
  status: "ativo"
}
```

**Verificar:**
1. Evento aparece na lista admin
2. Badge "Destaque" aparece
3. Localização salva corretamente
4. Evento aparece no site público
5. Mapa exibe na página de detalhes

---

### 8️⃣ Testes de Performance

#### Tempo de Carregamento
- [ ] Mapa carrega em < 2 segundos
- [ ] Busca responde em < 1 segundo
- [ ] Página não trava durante busca
- [ ] Transições são suaves

#### Recursos
- [ ] Mapa é destruído ao fechar modal
- [ ] Sem memory leaks
- [ ] Console sem erros
- [ ] Network requests otimizadas

---

### 9️⃣ Testes de Erro

#### Cenários de Erro
1. **Sem Internet:**
   - Mapa deve mostrar erro
   - Busca deve falhar graciosamente

2. **Endereço Inválido:**
   - Exibir mensagem clara
   - Não travar a aplicação

3. **Coordenadas Inválidas:**
   - Validar antes de salvar
   - Exibir erro ao usuário

4. **API Indisponível:**
   - Fallback para modo manual
   - Mensagem de erro amigável

---

### 🔟 Checklist Final

#### Backend
- [x] Modelo Evento com campo localizacao
- [x] Endpoint GET /api/eventos/slug/:slug
- [x] Middleware de slug automático
- [x] Script de teste funcional

#### Frontend Admin
- [x] MapPicker carrega corretamente
- [x] Busca de endereço funciona
- [x] Clique no mapa funciona
- [x] Reverse geocoding funciona
- [x] Salvamento funciona
- [x] Edição carrega localização

#### Frontend Público
- [x] MapDisplay carrega corretamente
- [x] Marcador exibe corretamente
- [x] Popup funciona
- [x] Botão Google Maps funciona
- [x] Botão Waze funciona
- [x] Responsivo em todos os tamanhos

#### Documentação
- [x] IMPLEMENTACAO_MAPAS_EVENTOS.md
- [x] GUIA_USO_MAPAS.md
- [x] RESUMO_IMPLEMENTACAO_MAPAS.md
- [x] TESTE_SISTEMA_MAPAS.md

---

## 🐛 Problemas Conhecidos

### Nenhum problema conhecido no momento! 🎉

Se encontrar algum problema:
1. Verifique o console do navegador
2. Verifique os logs do backend
3. Confirme que o Leaflet foi instalado
4. Limpe o cache do navegador

---

## ✅ Resultado Esperado

Após todos os testes:
- ✅ Sistema funciona perfeitamente
- ✅ Sem erros no console
- ✅ Performance adequada
- ✅ UX intuitiva
- ✅ Responsivo em todos os dispositivos

---

## 📞 Suporte

Se precisar de ajuda:
1. Consulte a documentação
2. Verifique os logs
3. Teste em outro navegador
4. Reporte o problema com detalhes

---

**Boa sorte com os testes!** 🚀
