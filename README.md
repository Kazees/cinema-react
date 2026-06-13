# Sistema CineWeb - Gestão de Cinema

Sistema completo de gerenciamento de cinema desenvolvido com **React + TypeScript + Zod + json-server**

## 🎯 Sobre o Projeto

O CineWeb é um sistema administrativo para gerenciar operações diárias de uma rede de cinemas, permitindo:
- Cadastro e gerenciamento de filmes
- Cadastro e gerenciamento de salas
- Agendamento de sessões
- Venda de ingressos (Inteira/Meia)

## 🚀 Tecnologias Utilizadas (Stack Completa)

### Core
- ✅ **React 19** - Biblioteca para construção de interfaces
- ✅ **Vite** - Build tool e dev server
- ✅ **TypeScript** - Superset JavaScript com tipagem estática

### Roteamento
- ✅ **react-router-dom** - Navegação SPA (Single Page Application)

### UI/UX
- ✅ **Bootstrap 5** - Framework CSS para estilização
- ✅ **bootstrap-icons** - Ícones para ações e interface

### Validação
- ✅ **Zod** - Validação de esquemas e formulários com TypeScript

### Backend Simulado
- ✅ **json-server** - API REST fake rodando na porta 3000

## 🔧 Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passo a Passo

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o json-server (Terminal 1):**
   ```bash
   npm run server
   ```
   O servidor rodará em `http://localhost:3000`

3. **Inicie o frontend (Terminal 2):**
   ```bash
   npm run dev
   ```
   O app rodará em `http://localhost:5173`

4. **Acesse no navegador:**
   ```
   http://localhost:5173
   ```


# 🐳 Como Executar com Docker

## Pré-requisitos
- Docker Desktop instalado
- Docker Compose instalado

## Execução

### 1. Construir e iniciar (PRIMEIRA VEZ):
```bash
docker-compose up --build -d
```

### 2. Iniciar (PRÓXIMAS VEZES):
```bash
docker-compose up -d
```

### 3. Acessar:
```
Frontend: http://localhost:5173
Backend API: http://localhost:3000
```

### 4. Parar:
```
Ctrl+C no terminal
```

ou

```bash
docker-compose down
```

---

### Rebuild completo:
```bash
docker-compose down
docker-compose up --build
```

### Limpar tudo:
```bash
docker-compose down
docker system prune -a
docker-compose up --build
```

## 📋 Funcionalidades Implementadas

### ✅ Módulo de Filmes (/filmes)
- **Listagem** em cards responsivos
- **Cadastro** com formulário completo validado com Zod
- **Edição** de filmes cadastrados
- **Exclusão** com confirmação

### ✅ Módulo de Salas (/salas)
- **Cadastro** com número e capacidade
- **Edição** de salas
- **Exclusão** com confirmação

### ✅ Módulo de Sessões (/sessoes)
- **Agendamento** com dropdowns de Filmes e Salas
- **Validação** de data não retroativa
- **Visualização** com cruzamento de dados
- **Edição** e **Exclusão**

### ✅ Listagem de Sessões (/listar-sessoes)
- Visualização de todas as sessões
- **Botão "Vender Ingresso"**
- Modal com opções **Inteira/Meia**
- Cálculo automático do valor final

## ✅ Regras de Negócio (Validação Zod)

### Filmes
- ✅ Título é obrigatório
- ✅ Duração > 0
- ✅ Sinopse mínimo 10 caracteres

### Sessões
- ✅ Filme obrigatório
- ✅ Sala obrigatória
- ✅ Data não retroativa

## 📝 Scripts

```bash
npm run dev      # Frontend
npm run server   # json-server
npm run build    # Build
```

---