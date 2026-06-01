/**
 * server.js – Backend Node.js + Express
 * THINK Corporation
 *
 * Funcionalidade:
 *  - Serve os arquivos estáticos do site (pasta raiz)
 *  - Recebe POST /api/feedback
 *  - Encaminha mensagem via WhatsApp Cloud API
 *  - Sem abrir WhatsApp Web no navegador do cliente
 *
 * Instalação:
 *   npm install express dotenv node-fetch cors helmet express-rate-limit
 *
 * Execução:
 *   node server.js
 *   (ou com nodemon: npx nodemon server.js)
 */

'use strict';

// ── Carrega variáveis de ambiente ──
require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');
const path       = require('path');

// node-fetch v3 é ESM; use a v2 com CommonJS:
// npm install node-fetch@2
const fetch = require('node-fetch');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ────────────────────────────────────────────────
   MIDDLEWARES DE SEGURANÇA
──────────────────────────────────────────────── */

// Cabeçalhos de segurança HTTP
app.use(
  helmet({
    contentSecurityPolicy: false, // desativa CSP para facilitar desenvolvimento local
  })
);

// CORS: ajuste a origem para produção
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || '*',
    methods: ['GET', 'POST'],
  })
);

// Body parser JSON (máx 50 KB)
app.use(express.json({ limit: '50kb' }));

// Rate limiting: máx 10 requisições por IP a cada 10 minutos na rota /api/feedback
const feedbackLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Muitas requisições. Aguarde alguns minutos.' },
});

/* ────────────────────────────────────────────────
   ARQUIVOS ESTÁTICOS (o próprio site)
──────────────────────────────────────────────── */
app.use(express.static(path.join(__dirname)));

/* ────────────────────────────────────────────────
   ROTA: POST /api/feedback
──────────────────────────────────────────────── */
app.post('/api/feedback', feedbackLimiter, async (req, res) => {
  const { nome, email, mensagem } = req.body;

  // ── Validação básica no servidor ──
  if (!nome || !email || !mensagem) {
    return res.status(400).json({
      success: false,
      message: 'Campos nome, email e mensagem são obrigatórios.',
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'E-mail inválido.',
    });
  }

  if (mensagem.length < 10 || mensagem.length > 2000) {
    return res.status(400).json({
      success: false,
      message: 'Mensagem deve ter entre 10 e 2000 caracteres.',
    });
  }

  // ── Variáveis de ambiente ──
  const token       = process.env.WHATSAPP_TOKEN;
  const phoneId     = process.env.WHATSAPP_PHONE_ID;
  const destination = process.env.WHATSAPP_DESTINATION;

  if (!token || !phoneId || !destination) {
    console.error('[THINK] Variáveis de ambiente WhatsApp não configuradas.');
    // Retorna sucesso para não expor configuração ao cliente
    return res.json({ success: true });
  }

  // ── Monta mensagem para WhatsApp ──
  const msgText =
    `🔔 *NOVO FEEDBACK – THINK Corporation*\n\n` +
    `👤 *Nome:* ${nome}\n` +
    `📧 *Email:* ${email}\n` +
    `💬 *Mensagem:*\n${mensagem}\n\n` +
    `_Enviado em: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}_`;

  // ── Payload WhatsApp Cloud API ──
  const payload = {
    messaging_product: 'whatsapp',
    to: destination,
    type: 'text',
    text: { body: msgText },
  };

  try {
    const waRes = await fetch(
      `https://graph.facebook.com/v19.0/${phoneId}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const waData = await waRes.json();

    if (!waRes.ok) {
      console.error('[THINK] Erro na API WhatsApp:', JSON.stringify(waData, null, 2));
      // Retornamos sucesso ao frontend (não expor erro interno)
      return res.json({ success: true });
    }

    console.info('[THINK] Feedback enviado para WhatsApp:', waData.messages?.[0]?.id);
    return res.json({ success: true });

  } catch (err) {
    console.error('[THINK] Exceção ao enviar para WhatsApp:', err.message);
    // Mesmo com falha no WA, retornamos sucesso para o usuário
    return res.json({ success: true });
  }
});

/* ────────────────────────────────────────────────
   ROTA: SPA fallback – retorna index.html
──────────────────────────────────────────────── */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/* ────────────────────────────────────────────────
   INICIALIZAÇÃO
──────────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`\n🚀 THINK Corporation – Servidor rodando em http://localhost:${PORT}`);
  console.log(`   Ambiente: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app; // permite testes unitários
