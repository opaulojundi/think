document.addEventListener("DOMContentLoaded", function () {
  // CONFIGURAÇÃO: Insira o número de WhatsApp da empresa aqui
  const WHATSAPP_NUMERO = "5511977939054"; 

  const btnEnviar = document.getElementById("btnEnviarFeedback");
  const btnText = document.getElementById("feedbackBtnText");
  const btnLoading = document.getElementById("feedbackBtnLoading");
  
  const inputNome = document.getElementById("feedbackNome");
  const inputEmail = document.getElementById("feedbackEmail");
  const inputMensagem = document.getElementById("feedbackMensagem");
  const toastElement = document.getElementById("feedbackToast");

  // Verifica se o botão realmente existe na página antes de aplicar o evento
  if (btnEnviar) {
    btnEnviar.addEventListener("click", function (event) {
      // Evita qualquer comportamento padrão de recarregar a página
      event.preventDefault();

      // 1. Validação dos campos
      if (!inputNome.value.trim() || !inputEmail.value.trim() || !inputMensagem.value.trim()) {
        alert("Por favor, preencha todos os campos antes de enviar.");
        return;
      }

      // 2. Efeito de carregamento no botão
      btnEnviar.disabled = true;
      btnText.classList.add("d-none");
      btnLoading.classList.remove("d-none");

      // 3. Formatação da mensagem
      const nome = inputNome.value.trim();
      const email = inputEmail.value.trim();
      const mensagem = inputMensagem.value.trim();

      const textoMensagem = `Olá! Gostaria de deixar um Feedback:\n\n*Nome:* ${nome}\n*E-mail:* ${email}\n\n*Mensagem:*\n${mensagem}`;
      const textoCodificado = encodeURIComponent(textoMensagem);
      const urlWhatsapp = `https://wa.me/${WHATSAPP_NUMERO}?text=${textoCodificado}`;

      // 4. Disparar o Toast com segurança (verifica se o Bootstrap está carregado)
      if (toastElement && typeof bootstrap !== "undefined") {
        try {
          const toast = bootstrap.Toast.getOrCreateInstance(toastElement);
          toast.show();
        } catch (e) {
          console.warn("Aviso: O Toast do Bootstrap não pôde ser exibido.", e);
        }
      }

      // 5. Redirecionar para o WhatsApp e resetar o formulário
      setTimeout(() => {
        window.open(urlWhatsapp, "_blank");

        // Limpa os campos
        inputNome.value = "";
        inputEmail.value = "";
        inputMensagem.value = "";

        // Restaura o botão
        btnEnviar.disabled = false;
        btnText.classList.remove("d-none");
        btnLoading.classList.add("d-none");
      }, 800); 
    });
  }
});
