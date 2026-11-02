#!/bin/bash

# Script de inicialização do projeto Igreja MIR CMS
# Autor: Kiro AI
# Data: 27/01/2026

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          🚀 Igreja MIR CMS - Inicialização                  ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar MongoDB
echo -e "${YELLOW}📊 Verificando MongoDB...${NC}"
if pgrep -x "mongod" > /dev/null; then
    echo -e "${GREEN}✅ MongoDB está rodando${NC}"
else
    echo -e "${RED}❌ MongoDB não está rodando${NC}"
    echo -e "${YELLOW}Tentando iniciar MongoDB...${NC}"
    
    # Tentar iniciar MongoDB (macOS)
    if command -v brew &> /dev/null; then
        brew services start mongodb-community
        sleep 2
        if pgrep -x "mongod" > /dev/null; then
            echo -e "${GREEN}✅ MongoDB iniciado com sucesso${NC}"
        else
            echo -e "${RED}❌ Falha ao iniciar MongoDB${NC}"
            echo -e "${YELLOW}Por favor, inicie o MongoDB manualmente:${NC}"
            echo "  brew services start mongodb-community"
            exit 1
        fi
    else
        echo -e "${RED}❌ Por favor, inicie o MongoDB manualmente${NC}"
        exit 1
    fi
fi

echo ""

# Verificar se as dependências estão instaladas
echo -e "${YELLOW}📦 Verificando dependências...${NC}"

if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}Instalando dependências do backend...${NC}"
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}Instalando dependências do frontend...${NC}"
    cd frontend && npm install && cd ..
fi

echo -e "${GREEN}✅ Dependências verificadas${NC}"
echo ""

# Verificar se o seed foi executado
echo -e "${YELLOW}🌱 Verificando seed...${NC}"
if mongosh igreja_cms --quiet --eval "db.users.countDocuments()" | grep -q "0"; then
    echo -e "${YELLOW}Executando seed...${NC}"
    cd backend && node scripts/seedCompleto.js && cd ..
else
    echo -e "${GREEN}✅ Seed já foi executado${NC}"
fi

echo ""

# Verificar portas
echo -e "${YELLOW}🔍 Verificando portas...${NC}"

if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${RED}❌ Porta 5000 já está em uso${NC}"
    echo -e "${YELLOW}Deseja matar o processo? (s/n)${NC}"
    read -r response
    if [[ "$response" =~ ^([sS][iI][mM]|[sS])$ ]]; then
        kill -9 $(lsof -t -i:5000)
        echo -e "${GREEN}✅ Processo na porta 5000 encerrado${NC}"
    fi
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${RED}❌ Porta 3000 já está em uso${NC}"
    echo -e "${YELLOW}Deseja matar o processo? (s/n)${NC}"
    read -r response
    if [[ "$response" =~ ^([sS][iI][mM]|[sS])$ ]]; then
        kill -9 $(lsof -t -i:3000)
        echo -e "${GREEN}✅ Processo na porta 3000 encerrado${NC}"
    fi
fi

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                  🎉 Tudo Pronto!                            ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Para iniciar o projeto, abra 2 terminais:${NC}"
echo ""
echo -e "${YELLOW}Terminal 1 - Backend:${NC}"
echo "  cd backend && npm start"
echo ""
echo -e "${YELLOW}Terminal 2 - Frontend:${NC}"
echo "  cd frontend && npm run dev"
echo ""
echo -e "${GREEN}Depois acesse:${NC}"
echo -e "  🌐 Site: ${BLUE}http://localhost:3000${NC}"
echo -e "  👨‍💼 Admin: ${BLUE}http://localhost:3000/admin${NC}"
echo ""
echo -e "${GREEN}Credenciais do Admin:${NC}"
echo "  📧 Email: admin@igrejamir.com"
echo "  🔑 Senha: Admin123"
echo ""
echo -e "${YELLOW}Pressione qualquer tecla para continuar...${NC}"
read -n 1 -s
