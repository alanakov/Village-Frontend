# Village — Testes E2E com Playwright

Suite completa de testes End-to-End para a plataforma **Aldeia Cultura Viva**, cobrindo autenticação, gestão de produtos no painel administrativo e o site público.

---

## 📁 Estrutura

```
e2e/
├── .auth/                    # Estado de autenticação salvo (gerado — não commitar)
├── data/
│   └── test-data.ts          # Dados de teste: credenciais, fixtures, rotas, timeouts
├── fixtures/
│   ├── images/               # Imagens PNG geradas para upload (gerado)
│   └── test.fixture.ts       # Fixture customizada com Page Objects + APIHelper
├── helpers/
│   ├── api.helper.ts         # Chamadas HTTP diretas ao backend (setup/teardown)
│   ├── image.helper.ts       # Criação de arquivos PNG de teste
│   └── wait.helper.ts        # Utilitários de espera (toast, skeleton, API)
├── pages/
│   ├── LoginPage.ts          # POM — /admin (login)
│   ├── ProductManagementPage.ts  # POM — /admin/products
│   └── PublicProductsPage.ts # POM — /produtos (público)
├── tests/
│   ├── auth/
│   │   ├── auth.setup.ts     # Setup global de autenticação (salva storageState)
│   │   └── login.spec.ts     # Testes de login / autenticação
│   ├── products/
│   │   └── product-management.spec.ts  # CRUD de produtos no admin
│   └── public/
│       └── public-products.spec.ts     # Site público — listagem de produtos
├── playwright.config.ts      # Configuração do Playwright
├── tsconfig.json
├── package.json
└── .github-ci.yml            # Pipeline GitHub Actions
```

---

## ⚙️ Pré-requisitos

| Ferramenta | Versão recomendada |
|------------|-------------------|
| Node.js    | ≥ 20              |
| npm        | ≥ 10              |
| Backend (NestJS) em execução | porta `8080` |
| Frontend (Vite)  em execução | porta `5173` |

---

## 🚀 Configuração e execução

### 1. Instalar dependências

```bash
cd e2e
npm install
npx playwright install --with-deps chromium
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` dentro da pasta `e2e/` (ou exporte as variáveis no shell):

```dotenv
BASE_URL=http://localhost:5173
API_URL=http://localhost:8080/api
UPLOADS_URL=http://localhost:8080/uploads

# Credenciais de um admin existente no banco de teste
TEST_ADMIN_EMAIL=admin@aldeia.com
TEST_ADMIN_PASSWORD=Admin@123
```

> **Dica:** As variáveis têm valores padrão que apontam para localhost — você não precisa criar o `.env` se estiver rodando localmente com as portas padrão.

### 3. Subir os serviços

```bash
# Terminal 1 — Backend
cd Village-Admin-Backend-develop/adminService
npm run start:dev

# Terminal 2 — Frontend
cd Village-Frontend-develop/frontend
npm run dev
```

### 4. Executar os testes

```bash
# Todos os testes (modo headless)
cd e2e
npm test

# Modo UI interativo (recomendado para desenvolvimento)
npm run test:ui

# Apenas testes de login
npm run test:auth

# Apenas testes de produto (admin)
npm run test:products

# Apenas site público
npm run test:public

# Modo headed (abre o navegador)
npm run test:headed

# Debug (pausa no primeiro erro)
npm run test:debug

# Ver relatório HTML do último run
npm run test:report
```

---

## 🏗️ Arquitetura e decisões técnicas

### Page Object Model (POM)

Cada página da aplicação tem um POM dedicado em `pages/`. Os seletores usam atributos semânticos (`id`, `role`, `aria-label`) e evitam classes CSS ou estrutura DOM frágil.

**Exemplo:**
```ts
// ✅ Robusto — baseado em semântica
this.submitButton = page.getByRole('button', { name: /entrar/i })

// ❌ Frágil — quebraria com refatoração de CSS
this.submitButton = page.locator('.btn-primary.w-full.mt-2')
```

### Fixture customizada

`fixtures/test.fixture.ts` estende o `test` base do Playwright e injeta os Page Objects e o `APIHelper` em todos os testes. Elimina boilerplate e garante instâncias frescas por teste.

### Autenticação compartilhada (storageState)

`auth.setup.ts` faz login uma única vez e salva o estado do navegador (localStorage com o token JWT do Zustand) em `.auth/admin.json`. Todos os testes autenticados reutilizam esse estado — sem overhead de re-login.

### APIHelper para setup/teardown

Testes criam seus próprios dados via `APIHelper` (chamadas HTTP diretas) no `beforeAll` e os removem no `afterAll`. Isso mantém os testes **independentes** e o banco de dados limpo.

### Três projetos Playwright

| Projeto | Testes | Autenticação |
|---------|--------|-------------|
| `auth-setup` | `auth.setup.ts` | executa primeiro, gera o state |
| `authenticated` | `auth/`, `products/` | usa `storageState` |
| `public` | `public/` | sem autenticação |

---

## 📋 Cenários cobertos

### Login (`tests/auth/login.spec.ts`)
- ✅ Login bem-sucedido — API, token, redirecionamento, localStorage
- ✅ Credenciais inválidas — mensagem de erro, sem redirecionamento
- ✅ Email vazio — validação frontend (sem chamada à API)
- ✅ Senha vazia — validação frontend (sem chamada à API)
- ✅ Ambos os campos vazios — múltiplos erros
- ✅ Toggle de visibilidade da senha
- ✅ Link "Esqueceu a senha?" — navegação correta
- ✅ Link "Criar conta" — navegação correta
- ✅ Usuário já autenticado — redireciona para o dashboard
- ✅ Logout — limpa estado, redireciona para login
- ✅ Rota protegida sem autenticação — redireciona para login

### Produtos — Admin (`tests/products/product-management.spec.ts`)
- ✅ Listagem — carregamento, headers da tabela, chamada à API
- ✅ Criação — formulário completo, upload de imagem, persistência no backend
- ✅ Validação — imagem obrigatória
- ✅ Validação — campos obrigatórios vazios
- ✅ Validação — preço inválido (≤ 0)
- ✅ Edição — alteração de dados, chamada PUT, persistência
- ✅ Edição — troca de imagem com novo upload
- ✅ Busca — filtro por nome
- ✅ Exclusão — dialog de confirmação, DELETE API, remoção da UI
- ✅ Cancelar exclusão — produto permanece

### Site Público (`tests/public/public-products.spec.ts`)
- ✅ Carregamento sem autenticação
- ✅ Dados do produto corretos no card
- ✅ Imagem com `src` válido (sem undefined)
- ✅ Botão WhatsApp em cada card
- ✅ Busca por nome/descrição
- ✅ Filtro por categoria (pills)
- ✅ Botão "Limpar filtros" — reset de estado
- ✅ Resposta da API corresponde ao que é exibido
- ✅ Produto criado no admin aparece no site público (teste de integração)

---

## 🔮 Cenários futuros recomendados

### Alta prioridade
- **Recuperação de senha** — fluxo completo: solicitar código → redefinir senha (2 etapas, Redis, email)
- **Cadastro de admin** — validações de senha (requisitos de complexidade do backend), email único
- **Gestão de categorias** — CRUD completo com validação de nome
- **Rota /admin não encontrada** — comportamento do fallback `Navigate`

### Média prioridade
- **Dashboard** — exibição de estatísticas (números corretos vindos da API)
- **Analytics** — renderização de gráficos e dados
- **Gestão de conteúdo** — seções, cards, imagens e botões institucionais
- **Testes mobile** — viewport 375px, interação touch

### Baixa prioridade / Qualidade
- **Performance** — medir Core Web Vitals na página pública via `page.metrics()`
- **Acessibilidade** — `axe-core` ou `@axe-core/playwright` nos fluxos críticos
- **Cross-browser** — Firefox e WebKit no CI
- **Internacionalização** — validar formatação de moeda (R$) e datas
