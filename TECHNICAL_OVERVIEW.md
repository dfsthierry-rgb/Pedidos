# Visão Geral Técnica - BeeMesh (Pedidos Especiais)

Este documento fornece uma explicação detalhada das funcionalidades e configurações técnicas do sistema de Pedidos Especiais da BeeMesh, destinado a desenvolvedores que atuarão na manutenção ou evolução do projeto.

## 1. Objetivo da Aplicação
A aplicação é um protótipo funcional para a gestão de **Pedidos Especiais de Telas** na área comercial da BeeMesh. Ela permite o acompanhamento completo do ciclo de vida de uma solicitação, desde a criação até a entrega final ou cancelamento, com foco em rastreabilidade de tempos e alertas de produtividade.

---

## 2. Stack Tecnológica
- **Framework:** React 19 (Hooks: `useState`, `useMemo`, `useEffect`).
- **Build Tool:** Vite 6.
- **Estilização:** Tailwind CSS v4 (utilizando variáveis de tema `@theme` no CSS).
- **Ícones:** Lucide React.
- **Animações:** Motion (antigo Framer Motion).
- **Linguagem:** TypeScript (com verificação rigorosa de tipos).

---

## 3. Lógica de Negócio (Core Business Logic)

### 3.1. Fluxos de Produção
O sistema distingue dois tipos principais de produção, cada um com seu próprio workflow de status:
- **Interna:** Processada nas máquinas próprias da empresa.
  - *Status:* Aguardando Máquina -> Em Produção -> Finalizado.
- **Externa (Importação):** Envolve compras e logística internacional.
  - *Status:* Em Cotação -> Comprado -> Em Produção -> Em Trânsito -> Chegando -> Entregue.

### 3.2. Gestão de Status e SLA
- **Atrasos (SLA):** O sistema monitora se um pedido está estagnado. Se o `statusUpdatedAt` (ou `lastUpdate`) for superior a **2 dias**, o pedido é marcado com a flag `isDelayed`, exibindo um alerta visual de "Necessita Ação".
- **Status de Análise:** Independente do status de produção, existe o `analysisStatus` (Não Analisado, Analisado, Solicitada Produção, Solicitada Importação, Cancelado).
- **Responsáveis:** A atribuição de usuários é dinâmica baseada no tipo de produção (`INTERNAL_USERS` vs `EXTERNAL_USERS`).

### 3.3. Cálculos de Tempo (Time Tracking)
O sistema calcula e exibe três métricas temporais críticas:
1. **Total:** Tempo decorrido desde a criação da solicitação (`createdAt`).
2. **No Status Atual:** Tempo decorrido desde a última mudança de status (`statusUpdatedAt`).
3. **Tempo de Ação:** Tempo decorrido desde que um responsável iniciou a ação (`actionStartedAt`).

### 3.4. Validações de Datas
- A **Data Prevista de Entrega** é obrigatória ao iniciar a análise ou alterar status.
- Validação impede que a data prevista seja anterior ao dia atual.

---

## 4. Configurações Técnicas e Infraestrutura

### 4.1. Vite e Variáveis de Ambiente
- **Base Path:** Configurado como `base: "./"` em `vite.config.ts`. Isso é crucial para que o projeto funcione corretamente em subpastas ou ambientes como GitHub Pages, garantindo que os caminhos dos assets sejam relativos.
- **API Keys:** O `GEMINI_API_KEY` é injetado via `define` no Vite, garantindo que a chave esteja disponível no cliente de forma segura durante o build.

### 4.2. Tema e Estilização (Tailwind CSS 4)
- O projeto utiliza a nova engine do Tailwind 4.
- **Dark Mode:** Implementado via classe `.dark` no elemento raiz (`document.documentElement`).
- **Variáveis CSS:** Cores de fundo, bordas e textos são definidas como variáveis CSS (`--bg-main`, `--bg-card`, etc.) dentro do bloco `@theme`, permitindo a troca dinâmica de temas com transições suaves.

### 4.3. Tratamento de Erros
- **Global:** Existe um listener `window.onerror` no `index.html` com lógica de diagnóstico para erros de tipo MIME (comum quando se tenta servir arquivos `.tsx` sem build).
- **React ErrorBoundary:** Um componente `ErrorBoundary` envolve a aplicação principal em `App.tsx` para capturar erros de renderização e exibir uma mensagem amigável sem derrubar o navegador.

---

## 5. Deployment e CI/CD

### 5.1. GitHub Actions
O arquivo `.github/workflows/deploy.yml` automatiza o processo:
1. Trigger em cada `push` na branch `main`.
2. Executa `npm install` e `npm run build`.
3. Faz o deploy da pasta **`dist/`** para a branch **`gh-pages`**.

### 5.2. Observação Importante sobre Publicação
O navegador não interpreta arquivos `.tsx`. Portanto, a aplicação **deve** ser servida a partir da pasta `dist/` gerada pelo comando de build. Tentar rodar o `index.html` da raiz diretamente resultará em erros de carregamento de módulo.

---

## 6. Estrutura de Dados (Order Interface)
A interface `Order` em `src/App.tsx` é o contrato central de dados, contendo campos para SKU, especificações técnicas (malha, fio, abertura), dados do cliente (CNPJ/CPF) e métricas de consumo/estoque.
