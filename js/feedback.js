document.addEventListener("DOMContentLoaded", function () {
  // CONFIGURAÇÃO: Insira o número de WhatsApp da empresa aqui (com DDD, apenas números)
  // Exemplo: 5511999999999 (55 = Brasil, 11 = SP, 99999-9999 = Número)
  const WHATSAPP_NUMERO = "5511999999999"; 

  // Elementos do formulário
  const btnEnviar = document.getElementById("btnEnviarFeedback");
  const btnText = document.getElementById("feedbackBtnText");
  const btnLoading = document.getElementById("feedbackBtnLoading");
  
  const inputNome = document.getElementById("feedbackNome");
  const inputEmail = document.getElementById("feedbackEmail");
  const inputMensagem = document.getElementById("feedbackMensagem");

  // Elemento do Toast (Bootstrap)
  const toastElement = document.getElementById("feedbackToast");
  const toast = bootstrap.Toast.getOrCreateInstance(toastElement);

  // Evento de clique no botão de enviar
  btnEnviar.addEventListener("click", function () {
    // 1. Validação simples dos campos obrigatórios
    if (!inputNome.value.trim() || !inputEmail.value.trim() || !inputMensagem.value.trim()) {
      alert("Por favor, preencha todos os campos antes de enviar.");
      return;
    }

    // 2. Ativar o estado de "Enviando..." no botão
    btnEnviar.disabled = true;
    btnText.classList.add("d-none");
    btnLoading.classList.remove("d-none");

    // 3. Capturar e formatar os dados para a mensagem do WhatsApp
    const nome = inputNome.value.trim();
    const email = inputEmail.value.trim();
    const mensagem = inputMensagem.value.trim();

    // Texto formatado com quebras de linha e emojis para ficar organizado
    const textoMensagem = `Olá! Gostaria de deixar um Feedback:

*Nome:* ${nome}
*E-mail:* ${email}

*Mensagem:*
${mensagem}`;

    // Codifica o texto para o formato aceito em URLs
    const textoCodificado = encodeURIComponent(textoMensagem);
    
    // Cria o link final da API do WhatsApp
    const urlWhatsapp = `https://wa.me/${WHATSAPP_NUMERO}?text=${textoCodificado}`;

    // 4. Simulando um pequeno delay para efeito visual e exibição do Toast
    setTimeout(() => {
      // Exibe o Toast de sucesso na tela
      toast.show();

      // Abre o WhatsApp em uma nova aba
      window.open(urlWhatsapp, "_blank");

      // 5. Limpa o formulário após o envio
      inputNome.value = "";
      inputEmail.value = "";
      inputMensagem.value = "";

      // Restaura o botão ao estado original
      btnEnviar.disabled = false;
      btnText.classList.remove("d-none");
      btnLoading.classList.add("d-none");
    }, 1200); 
  });
});
