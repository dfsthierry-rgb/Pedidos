# Guia de Implantação (Deployment)

O site está configurado para ser publicado automaticamente via **GitHub Actions**, mas você precisa configurar o seu serviço de hospedagem corretamente para ver o site publicado.

## Se você estiver usando GitHub Pages:

1. Vá para as **Settings** (Configurações) do seu repositório no GitHub.
2. No menu lateral esquerdo, clique em **Pages**.
3. Em **Build and deployment** > **Branch**:
   - Selecione a branch `gh-pages` (esta branch é criada automaticamente pelo script que adicionei).
   - Selecione a pasta `/(root)`.
4. Clique em **Save**.
5. Aguarde alguns minutos e o site estará disponível no link fornecido pelo GitHub.

## Se estiver usando Vercel, Netlify ou outro serviço:

Certifique-se de que as configurações de build são:

- **Build Command:** `npm run build`
- **Output Directory (ou Publish directory):** `dist`

## Por que a página ficou em branco?

O navegador não consegue ler arquivos `.tsx` (TypeScript) diretamente. Quando você tenta abrir o site apontando para a pasta raiz do projeto, ele tenta carregar o arquivo `src/main.tsx`, o que causa o erro de "MIME type".

Para o site funcionar, você deve sempre servir o conteúdo da pasta **`dist/`**, que contém os arquivos JavaScript (`.js`) e CSS (`.css`) já processados e prontos para o navegador.

---

### Verificação de Erros
Adicionei um script de diagnóstico que agora mostrará uma mensagem de erro clara caso o site continue sendo configurado de forma incorreta.
