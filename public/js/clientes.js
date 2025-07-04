$(document).ready(function () {
  const API_URL = 'http://localhost:8000/api/clientes';
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Você precisa estar logado!');
    window.location.href = 'login.html';
    return;
  }

  carregarClientes();

  $('#cliente-form').submit(function (e) {
    e.preventDefault();

    const id = $('#cliente-id').val();
    const nome = $('#nome').val().trim();
    const cpf = $('#cpf').val().trim();
    const endereco = $('#endereco').val().trim();

    if (!validarCPF(cpf)) {
      alert('CPF inválido!');
      return;
    }

    const dados = { nome, cpf, endereco };
    const method = id ? 'PUT' : 'POST';
    let url = API_URL;
    if (id) {
      url += `?id=${encodeURIComponent(id)}`;
    }

    $.ajax({
      url: url,
      method,
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: JSON.stringify(dados),
      success: () => {
        alert('Cliente salvo com sucesso!');
        $('#cliente-form')[0].reset();
        $('#cliente-id').val('');
        carregarClientes();
      },
      error: (xhr) => {
        const resposta = xhr.responseJSON?.erro || 'Erro ao salvar cliente';
        alert(resposta);
      }
    });
  });

  $(document).on('click', '.btn-excluir', function () {
    const cpf = $(this).data('cpf');
    if (!confirm('Deseja realmente excluir este cliente?')) return;

    $.ajax({
      url: API_URL + '?cpf=' + encodeURIComponent(cpf),
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      },
      success: () => {
        alert('Cliente excluído!');
        carregarClientes();
      },
      error: (xhr) => {
        alert(xhr.responseJSON?.erro || 'Erro ao excluir cliente');
      }
    });
  });

  $(document).on('click', '.btn-editar', function () {
    let clienteData = $(this).attr('data-cliente');
    try {
      const cliente = JSON.parse(clienteData);
      $('#cliente-id').val(cliente.id);
      $('#nome').val(cliente.nome);
      $('#cpf').val(cliente.cpf);
      $('#endereco').val(cliente.endereco);
    } catch (e) {
      alert('Erro ao carregar dados do cliente para edição');
      console.error(e);
    }
  });

  function carregarClientes() {
    $.ajax({
      url: API_URL,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      },
      success: function (dados) {
        if (!Array.isArray(dados)) {
          alert('Resposta inesperada ao carregar clientes');
          return;
        }
        const linhas = dados.map(cliente => `
          <tr>
            <td>${cliente.nome}</td>
            <td>${cliente.cpf}</td>
            <td>${cliente.endereco}</td>
            <td>
              <button 
                class="btn btn-sm btn-warning btn-editar" 
                data-cliente='${JSON.stringify(cliente).replace(/'/g, "&apos;")}'
              >Editar</button>
              <button class="btn btn-sm btn-danger btn-excluir" data-cpf="${cliente.cpf}">Excluir</button>
            </td>
          </tr>
        `);
        $('#clientes-table').html(linhas.join(''));
      },
      error: () => {
        alert('Erro ao carregar clientes');
      }
    });
  }

  function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    return resto === parseInt(cpf[10]);
  }
});
