Use o prompt abaixo em uma IA geradora de código (ChatGPT, Claude, Gemini, Cursor, Windsurf, Bolt, Lovable, etc.) para criar o site completo da THINK Corporation baseado na identidade visual do PDF e da logo enviada.

---

# PROMPT

Crie um website institucional profissional para a empresa THINK Corporation.

## Tecnologias Obrigatórias

* HTML5
* CSS3
* JavaScript ES6+
* Bootstrap 5
* Bootstrap Icons
* AOS Animation
* VLibras (acessibilidade em Libras)
* Estrutura modular

### Arquivos

```
/index.html

/components
    header.html
    footer.html

/css
    style.css
    themes.css
    responsive.css

/js
    main.js
    theme.js
    feedback.js

/assets
    /img
```

---

# IDENTIDADE VISUAL

A empresa se chama:

THINK Corporation

A logo possui:

* Fonte futurista
* Design minimalista
* Símbolo de interrogação sobre o "I"
* Estilo tecnológico e moderno

### Conceito da marca

A interrogação representa:

* pensamento
* inovação
* questionamento
* busca por soluções

### Slogan

"Try How Imagining, Not Knowing."

Português:

"Tente imaginar como, sem saber."

---

# CORES OFICIAIS

Tema Claro

```css
--primary: #000000;
--secondary: #FFFFFF;
```

Tema Escuro

```css
--primary: #FFFFFF;
--secondary: #000000;
```

---

# REQUISITO DE TROCA DE TEMA

Criar botão no header:

🌙 / ☀️

Funcionalidades:

* alternar entre tema claro e escuro
* salvar preferência no LocalStorage
* transição suave
* alterar:

  * fundo
  * textos
  * cards
  * botões
  * navbar
  * footer

---

# ESTRUTURA DO SITE

## HEADER

Arquivo separado:

header.html

Contendo:

* Logo THINK
* Menu responsivo Bootstrap

Links:

* Home
* Sobre
* Serviços
* Missão
* Visão
* Valores
* Contato

Botão:

"Solicitar Orçamento"

Botão troca de tema

Navbar fixa

---

# HERO SECTION

Tela inteira (100vh)

Layout moderno.

Elementos:

Logo THINK

Título:

THINK Corporation

Subtítulo:

Tecnologia que transforma desafios em oportunidades.

Slogan:

"Try How Imagining, Not Knowing."

Botões:

* Conheça a Empresa
* Fale Conosco

Efeito:

* fade-in
* partículas leves em background
* animações suaves

---

# SOBRE A EMPRESA

Texto baseado no PDF:

"A THINK Corporation utiliza a tecnologia como motor de crescimento, criando soluções personalizadas que eliminam obstáculos e geram oportunidades. Com foco em qualidade, segurança e escalabilidade, desenvolvemos sistemas robustos que entregam valor real aos nossos clientes."

Adicionar:

* imagem ilustrativa tecnológica
* cards animados

---

# SERVIÇOS

Criar cards modernos:

### Desenvolvimento Web

Sites e sistemas personalizados.

### Sistemas Empresariais

ERP, CRM e automações.

### Banco de Dados

Modelagem e administração.

### Análise de Dados

Dashboards e BI.

### Consultoria Tecnológica

Estratégias digitais.

### Soluções Escaláveis

Arquiteturas modernas.

Cada card deve possuir:

* ícone Bootstrap
* hover animation
* sombra elegante

---

# NOSSA EQUIPE

Baseado no PDF:

### Paulo Jundi

Líder
Analista de Dados
Desenvolvedor Full Stack

### Felipe Tonetti

Back-End
DBA

### Gustavo Alboz

Front-End
UI/UX Designer

Criar cards com:

* avatar placeholder
* efeito hover
* redes sociais fictícias

---

# MISSÃO

Criar seção elegante com ícone.

Conteúdo:

* Desenvolver sistemas inteligentes, seguros e escaláveis
* Transformar desafios em oportunidades
* Impulsionar inovação e eficiência
* Oferecer soluções de qualidade
* Crescimento sustentável

---

# VISÃO

* Ser referência nacional em sistemas sob medida
* Excelência técnica
* Inovação contínua
* Liderança até 2030
* Transformação digital sustentável

---

# VALORES

Criar grid moderno.

Valores:

1. Inovação com Propósito
2. Excelência Técnica
3. Foco no Cliente
4. Transparência e Ética
5. Colaboração e Respeito
6. Evolução Contínua

Cada valor em um card animado.

---

# FEEDBACK DOS CLIENTES

Criar seção com:

* Nome
* E-mail
* Mensagem

Botão:

"Enviar Feedback"

---

# API WHATSAPP (SEM SAIR DO SITE)

Criar backend Node.js + Express.

Endpoint:

```javascript
POST /api/feedback
```

Recebe:

```json
{
  "nome": "",
  "email": "",
  "mensagem": ""
}
```

Utilizar:

### WhatsApp Cloud API

Variáveis:

```env
WHATSAPP_TOKEN=
WHATSAPP_PHONE_ID=
WHATSAPP_DESTINATION=
```

Ao receber o formulário:

Enviar mensagem para WhatsApp da empresa:

```text
NOVO FEEDBACK

Nome:
{{nome}}

Email:
{{email}}

Mensagem:
{{mensagem}}
```

Retornar:

```json
{
  "success": true
}
```

Exibir toast Bootstrap:

```text
Feedback enviado com sucesso.
```

Sem abrir WhatsApp Web.

Tudo pelo backend.

---

# CONTATO

Cards:

* WhatsApp
* Email
* Localização
* Atendimento

Mapa integrado.

---

# FOOTER

Arquivo separado:

footer.html

Contendo:

* Logo THINK
* Slogan
* Links rápidos
* Redes sociais
* Direitos autorais

---

# ACESSIBILIDADE

Integrar VLibras.

Adicionar antes do fechamento do body:

```html
<div vw class="enabled">
    <div vw-access-button class="active"></div>
    <div vw-plugin-wrapper>
        <div class="vw-plugin-top-wrapper"></div>
    </div>
</div>

<script src="https://vlibras.gov.br/app/vlibras-plugin.js"></script>

<script>
new window.VLibras.Widget('https://vlibras.gov.br/app');
</script>
```

---

# SEO

Adicionar:

* Meta Tags
* Open Graph
* Favicon
* Sitemap
* Robots.txt

---

# PERFORMANCE

Implementar:

* Lazy Loading
* Compressão de imagens
* Minificação sugerida
* Bootstrap CDN
* Fontes otimizadas

---

# RESPONSIVIDADE

Funcionar perfeitamente em:

* Desktop
* Notebook
* Tablet
* Smartphone

---

# RESULTADO ESPERADO

Gerar todo o código completo:

* index.html
* header.html
* footer.html
* style.css
* themes.css
* responsive.css
* main.js
* theme.js
* feedback.js
* server.js
* .env.example

Com comentários explicando cada parte do sistema.
