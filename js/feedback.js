/**
 * feedback.js – Envio de feedback via backend Node.js
 * THINK Corporation
 *
 * Fluxo:
 *  1. Usuário preenche nome, e-mail e mensagem
 *  2. Clique em "Enviar Feedback" valida os campos
 *  3. POST para /api/feedback (server.js)
 *  4. Backend encaminha via WhatsApp Cloud API
 *  5. Toast Bootstrap exibe confirmação (sem abrir WhatsApp Web)
 */

(function () {
  'use strict';

  // ── Endpoint do backend ──
  // Em produção, substitua pela URL real do servidor.
  const API_URL = '/api/feedback';

  // ── Utilitários de DOM ──
  const $ = (id) => document.getElementById(id);

  /**
   * Valida um e-mail simples.
   * @param {string} email
   * @returns {boolean}
   */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  /**
   * Exibe o toast Bootstrap com uma mensagem personalizada.
   * @param {string} message
   * @param {'success'|'error'} type
   */
  function showToast(message, type = 'success') {
    const toastEl = $('feedbackToast');
    const toastMsg = $('toastMessage');

    if (!toastEl || !toastMsg) return;

    toastMsg.textContent = message;

    // Muda cor do ícone conforme tipo
    const icon = toastEl.querySelector('.bi');
    if (icon) {
      icon.className = type === 'success'
        ? 'bi bi-check-circle-fill text-success me-2'
        : 'bi bi-exclamation-circle-fill text-danger me-2';
    }

    const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 4500 });
    toast.show();
  }

  /**
   * Marca um campo como inválido com feedback visual.
   * @param {HTMLElement} el
   * @param {string} msg
   */
  function setInvalid(el, msg) {
    el.classList.add('is-invalid');
    let fb = el.nextElementSibling;
    if (!fb || !fb.classList.contains('invalid-feedback')) {
      fb = document.createElement('div');
      fb.className = 'invalid-feedback';
      el.parentNode.insertBefore(fb, el.nextSibling);
    }
    fb.textContent = msg;
  }

  /** Remove marcações de inválido de todos os campos. */
  function clearValidation() {
    ['feedbackNome', 'feedbackEmail', 'feedbackMensagem'].forEach((id) => {
      const el = $(id);
      if (el) el.classList.remove('is-invalid');
    });
  }

  /**
   * Alterna estado de loading no botão.
   * @param {boolean} loading
   */
  function setLoading(loading) {
    const text = $('feedbackBtnText');
    const spin = $('feedbackBtnLoading');
    const btn  = $('btnEnviarFeedback');

    if (!text || !spin || !btn) return;

    btn.disabled = loading;
    text.classList.toggle('d-none', loading);
    spin.classList.toggle('d-none', !loading);
  }

  /**
   * Envia o feedback ao backend.
   */
  async function sendFeedback() {
    clearValidation();

    const nome     = $('feedbackNome');
    const email    = $('feedbackEmail');
    const mensagem = $('feedbackMensagem');

    // ── Validação ──
    let valid = true;

    if (!nome.value.trim()) {
      setInvalid(nome, 'Por favor, informe seu nome.');
      valid = false;
    }

    if (!email.value.trim() || !isValidEmail(email.value)) {
      setInvalid(email, 'Informe um e-mail válido.');
      valid = false;
    }

    if (!mensagem.value.trim() || mensagem.value.trim().length < 10) {
      setInvalid(mensagem, 'A mensagem deve ter ao menos 10 caracteres.');
      valid = false;
    }

    if (!valid) return;

    // ── Envio ──
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome:     nome.value.trim(),
          email:    email.value.trim(),
          mensagem: mensagem.value.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast('Feedback enviado com sucesso. Obrigado! 🚀', 'success');
        // Limpa o formulário
        nome.value     = '';
        email.value    = '';
        mensagem.value = '';
      } else {
        showToast(data.message || 'Erro ao enviar. Tente novamente.', 'error');
      }
    } catch (err) {
      console.error('[THINK] Erro ao enviar feedback:', err);
      showToast('Não foi possível conectar ao servidor. Tente mais tarde.', 'error');
    } finally {
      setLoading(false);
    }
  }

  // ── Registra evento ao carregar o DOM ──
  document.addEventListener('DOMContentLoaded', function () {
    const btn = $('btnEnviarFeedback');
    if (btn) btn.addEventListener('click', sendFeedback);

    // Também permite envio com Enter no campo de mensagem (Ctrl+Enter)
    const msgArea = $('feedbackMensagem');
    if (msgArea) {
      msgArea.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          sendFeedback();
        }
      });
    }
  });
})();
