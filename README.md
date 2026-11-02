# MIR — Plataforma & Sistema de Gestão Eclesiástica (CMS)

Plataforma digital integrada e sistema de gestão administrativa para a Igreja **Ministério Internacional da Restauração (MIR)**.

---

## 🏛️ Visão Geral da Arquitetura

O sistema é composto por duas aplicações principais desacopladas:

1. **Frontend (`/frontend`)**:
   - Desenvolvido em **Next.js 13.4** (App Router), **React 18** e **Tailwind CSS**.
   - Gestão de estado global com **Zustand** (`useSiteStore`).
   - Portal público completo (Home dinâmica, Cultos Ao Vivo, Devocionais, Testemunhos, Eventos, Ministérios & Células, Cursos e Plataforma de Ensino).
   - Painel Administrativo moderno (`/admin`) para gestão integral de conteúdos, finanças, membros e personalização visual.

2. **Backend (`/backend`)**:
   - API RESTful em **Node.js** com **Express**.
   - Base de dados **MongoDB** com **Mongoose ODM**.
   - Autenticação e permissões baseadas em **JWT**.
   - Gestão de Tesouraria/Doações, Escalas de Culto, Visitantes, Inscrições em Eventos e Módulos Eclesiásticos.

---

## 🌿 Estrutura de Branches do Projeto

Este repositório segue o fluxo padrão de desenvolvimento e entrega contínua:

- `main`: Branch de **Produção** (código estável, auditado e pronto para lançamento).
- `qas`: Branch de **Homologação / Garantia de Qualidade (Quality Assurance & Staging)** para validação funcional e testes pré-produção.
- `dev`: Branch de **Desenvolvimento ativo** onde novas funcionalidades e melhorias são integradas.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 18+ instalado
- MongoDB em execução localmente ou URI MongoDB Atlas

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env   # Ajuste as variáveis conforme o seu ambiente
npm run dev            # Inicia na porta 5000
```

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env.local   # Ajuste NEXT_PUBLIC_API_URL
npm run dev                  # Inicia em http://localhost:3000
```

### 3. Inicialização Rápida
Também pode executar o script unificado na raiz:
```bash
chmod +x start.sh
./start.sh
```

---

## 🔒 Segurança e Boas Práticas
- Nenhuma chave de API, credencial ou segredo de produção está comitado neste repositório.
- Variáveis de ambiente sensíveis são geridas exclusivamente via ficheiros `.env` locais ignorados pelo `.gitignore`.
