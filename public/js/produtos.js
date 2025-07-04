$(document).ready(function () {
 const API_URL = 'http://localhost:8000/api/produtos';
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Você precisa estar logado!');
    window.location.href = 'login.html';
    return;
  }

  carregarProdutos();

  $('#filtro-form').submit(function (e) {
    e.preventDefault();

    const status = $('#filtro-status').val();
    const garantia = $('#filtro-garantia').val();

    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (garantia) params.append('tempo_garantia', garantia);

    carregarProdutos(params.toString());
  });

function carregarProdutos(query = '') {
  $.ajax({
    url: API_URL + (query ? `?${query}` : ''),
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    },
    success: function (dados) {
      const linhas = dados.map(produto => `
        <tr>
          <td>${produto.codigo}</td>
          <td>${produto.descricao}</td>
          <td>${produto.status}</td>
          <td>${produto.tempo_garantia} meses</td>
          <td>
            <button class="btn btn-warning btn-sm btn-editar" data-produto='${JSON.stringify(produto)}'>Editar</button>
            <button class="btn btn-danger btn-sm btn-excluir" data-id="${produto.id}">Excluir</button>
          </td>
        </tr>
      `);
      $('#produtos-table').html(linhas.join(''));
    },
    error: () => {
      alert('Erro ao carregar produtos');
    }
  });
}



  $('#produto-form').submit(function (e) {
    e.preventDefault();

    const id = $('#produto-id').val();
    const codigo = $('#codigo').val().trim();
    const descricao = $('#descricao').val().trim();
    const status = $('#status').val();
    const tempo_garantia = parseInt($('#garantia').val(), 10);

    if (!codigo || !descricao || !status || isNaN(tempo_garantia)) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    const dados = { id, codigo, descricao, status, tempo_garantia };
    const method = id ? 'PUT' : 'POST';

    $.ajax({
      url: API_URL,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      data: JSON.stringify(dados),
      success: () => {
        alert('Produto salvo com sucesso!');
        $('#produto-form')[0].reset();
        $('#produto-id').val('');
        carregarProdutos();
      },
      error: (xhr) => {
        const msg = xhr.responseJSON?.erro || 'Erro ao salvar produto';
        alert(msg);
      }
    });
  });

  $(document).on('click', '.btn-editar', function () {
    const produto = $(this).data('produto');

    $('#produto-id').val(produto.id);
    $('#codigo').val(produto.codigo);
    $('#descricao').val(produto.descricao);
    $('#status').val(produto.status);
    $('#garantia').val(produto.tempo_garantia);
  });

  $(document).on('click', '.btn-excluir', function () {
    const id = $(this).data('id');

    if (!confirm('Deseja excluir este produto?')) return;

    $.ajax({
      url: `${API_URL}?id=${id}`,
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      success: () => {
        alert('Produto excluído com sucesso!');
        carregarProdutos();
      },
      error: (xhr) => {
        const msg = xhr.responseJSON?.erro || 'Erro ao excluir produto';
        alert(msg);
      }
    });
  });
});
