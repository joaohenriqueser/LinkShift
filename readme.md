# 🚀 LinkShift: Encurtador de Links com Variantes A/B

**LinkShift** é uma aplicação *full-stack* que funciona como um encurtador de links e uma plataforma de testes A/B. Ele permite que usuários autenticados criem *shortlinks* que redirecionam para múltiplas URLs de destino (variantes) com base em pesos percentuais definidos.

O sistema utiliza um algoritmo de seleção ponderada (Roulette Wheel) para distribuir o tráfego proporcionalmente e rastreia cada clique para gerar relatórios de desempenho detalhados.

---

## ✨ Funcionalidades Principais (MVP)

* **Autenticação de Usuários:** Sistema completo de registro e login.
* **Multi-usuário com Ownership:** Usuários só podem ver e gerenciar os links que eles mesmos criaram (garantido por `Policies`).
* **CRUD de Shortlinks:** Gerenciamento completo (Criar, Ler, Editar, Deletar) de links.
* **Gerenciamento de Variantes (A/B):** Cada link pode ter N variantes de destino, com validação no backend para garantir que a soma dos pesos seja sempre 100%.
* **Slug Customizável:** Usuários podem definir um `slug` (ex: `/redir/minha-promo`) customizado, que é validado como único.
* **Redirecionamento Ponderado:** A rota pública `GET /redir/{slug}` usa um algoritmo "Roulette Wheel" para selecionar uma variante baseada no peso.
* **Rastreamento de Cliques Atômico:** A seleção da variante e o registro do clique no banco de dados são feitos em uma transação atômica (`DB::transaction`) para garantir a integridade dos dados.
* **Página de Relatório:** Uma página reativa que exibe:
    * O slug e o total de cliques.
    * Um seletor de data.
    * Uma tabela com dados por variante: URL, Peso (% Esperada), Cliques (no período) e % Final (Real).

---

## 🏛️ Arquitetura (Abordagem "Bridge")

Este projeto segue a arquitetura **Inertia.js como "Bridge"**, conforme solicitado na especificação.

### Backend (Laravel)
* **Controllers Magros (Thin Controllers):** Os controllers (`ShortlinkController`) são responsáveis apenas por receber a requisição e retornar a resposta.
* **Serviços (Fat Services):** Toda a lógica de negócio (criação no banco, o algoritmo "Roulette Wheel", a lógica de relatório) está encapsulada em *Services* (ex: `ShortlinkService`).
* **Validação (FormRequests):** Toda a validação de entrada, incluindo regras customizadas (como `SumOfWeightsIs100`), é feita por classes `FormRequest` dedicadas.
* **Segurança (Policies):** A autorização (garantir que um usuário não possa editar o link de outro) é centralizada no `ShortlinkPolicy`.

### Frontend (React)
* **Inertia.js:** Usado para o carregamento inicial das páginas (componentes React) e para "costurar" o Laravel ao React.
* **API (Axios):** Todas as ações de CRUD (Criar, Editar, Deletar, Buscar Relatório) são feitas usando `axios` (`api.post`, `api.put`, etc.) para *endpoints* de API JSON (`/api/...`).
* **Configuração de API:** Um cliente `axios` (`lib/api.ts`) é configurado para incluir automaticamente o token `XSRF-TOKEN` em todas as requisições, garantindo a proteção contra CSRF.

---

## 💻 Tecnologias Utilizadas

* **Backend:** PHP 8.2+ / **Laravel 12**
* **Frontend:** **React 19** / TypeScript / Vite / TailwindCSS
* **Ponte:** Inertia.js
* **Base de Dados:** MySQL
* **Autenticação:** Laravel Fortify + **Laravel Sanctum** (para a API)

---

## 🚀 Instalação e Configuração

Siga estes passos para rodar o projeto localmente:

1.  **Clone o repositório:**
    ```bash
    git clone [URL_DO_SEU_REPOSITÓRIO]
    cd linkshift
    ```

2.  **Instale as dependências do PHP (Backend):**
    ```bash
    composer install
    ```

3.  **Instale as dependências do Node (Frontend):**
    ```bash
    npm install
    ```

4.  **Configure o Ambiente:**
    ```bash
    cp .env.example .env
    ```

5.  **Gere a Chave do App:**
    ```bash
    php artisan key:generate
    ```

6.  **Configure seu arquivo `.env`:**
    * Configure suas credenciais do banco de dados MySQL (`DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`).
    * Mude o `APP_NAME` para `LinkShift`: `APP_NAME=LinkShift`

7.  **Crie o Banco de Dados:**
    * Acesse seu cliente MySQL (HeidiSQL, DBeaver, etc.) e crie o banco de dados que você especificou no `.env` (ex: `CREATE DATABASE linkshift;`).

8.  **Rode as Migrações:**
    * Este comando criará todas as tabelas (`users`, `shortlinks`, `shortlink_variants`, `shortlink_clicks`).
    ```bash
    php artisan migrate
    ```

9.  **Limpe o cache (Recomendado):**
    ```bash
    php artisan optimize:clear
    ```

10. **Rode os Servidores:**
    * Você precisará de **dois** terminais abertos.

    * **Terminal 1 (Backend):**
        ```bash
        php artisan serve
        ```

    * **Terminal 2 (Frontend):**
        ```bash
        npm run dev
        ```

11. **Acesse o App:**
    * Abra seu navegador e acesse a URL do servidor Artisan (geralmente `http://localhost:8000` ou `http://127.0.0.1:8000`).

---

## 🧪 Como Testar

1.  Acesse `http://localhost:8000` e **crie uma conta**.
2.  No Dashboard ("ShortLink"), clique em **"Criar Novo Shortlink"**.
3.  **Teste de Validação:** Tente salvar um link com peso `50`. Você deve receber a mensagem de erro "A soma de todos os pesos... deve ser exatamente 100."
4.  **Teste de Criação:** Crie um link com o slug `meu-teste` e duas variantes (ex: `google.com` - peso 80; `bing.com` - peso 20). Salve.
5.  **Teste da Roleta:** Em uma nova aba, acesse `http://localhost:8000/redir/meu-teste` várias vezes. Você deve ser redirecionado para o Google ~80% das vezes e para o Bing ~20% das vezes.
6.  **Teste do Relatório:** Volte ao Dashboard, clique em **"Relatório"** no link `meu-teste`. A tabela deve mostrar os cliques que você acabou de gerar.
7.  **Teste de Segurança (Multi-usuário):**
    * Em uma **janela anônima** (ou outro navegador), crie uma **segunda conta**.
    * O dashboard do Usuário B deve estar vazio.
    * Tente acessar a URL de edição do link do Usuário A (ex: `http://localhost:8000/shortlinks/meu-teste/edit`).
    * Você deve receber uma página de erro **403 | THIS ACTION IS UNAUTHORIZED**.
