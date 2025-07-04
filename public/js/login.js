$(document).ready(function () {
  $('#form-login').on('submit', function (e) {
    e.preventDefault();

    const email = $('#email').val().trim();
    const senha = $('#senha').val().trim();

    if (!email || !senha) {
      $('#mensagem').text('Por favor, preencha todos os campos.');
      return;
    }

    $.ajax({
      url: 'http://localhost:8000/api/login',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ email, senha }),
      success: function (res) {
        localStorage.setItem('token', res.token);
        window.location.href = 'clientes.html';
      },
      error: function (xhr) {
        const msg = xhr.responseJSON?.erro || 'Erro ao fazer login.';
        $('#mensagem').text(msg);
      }
    });
  });
});
