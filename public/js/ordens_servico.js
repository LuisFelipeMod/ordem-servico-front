$(document).ready(function () {
  const API_URL = "http://localhost:8000/api/ordens_servico";
  const PRODUTOS_API = "http://localhost:8000/api/produtos";
  const token = localStorage.getItem("token");

  console.log("Script ordens_servico.js carregado");

  if (!token) {
    alert("Você precisa estar logado!");
    window.location.href = "login.html";
    return;
  }

  function carregarProdutos() {
    $.ajax({
      url: PRODUTOS_API,
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      success: function (produtos) {
        $("#produto")
          .empty()
          .append('<option value="">Selecione um produto</option>');
        produtos.forEach((p) => {
          $("#produto").append(
            `<option value="${p.id}">${p.descricao} (Código: ${p.codigo})</option>`
          );
        });
      },
      error: () => alert("Erro ao carregar produtos"),
    });
  }

  function carregarOrdens() {
    $.ajax({
      url: API_URL,
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      success: function (ordens) {
        const linhas = ordens.map(
          (o) => `
          <tr>
            <td>${o.numero_ordem}</td>
            <td>${o.data_abertura}</td>
            <td>${o.nome_consumidor}</td>
            <td>${o.cpf_consumidor.replace(/\D/g, "")}</td>
            <td>${o.produto_descricao}</td>
            <td>
              <button class="btn btn-sm btn-warning btn-editar" data-ordem='${JSON.stringify(
                o
              )}'>Editar</button>
              <button class="btn btn-sm btn-danger btn-excluir" data-id="${
                o.id
              }">Excluir</button>
              <button class="btn btn-sm btn-info btn-logs" data-id="${
                o.id
              }">Logs</button>
            </td>
          </tr>
        `
        );
        $("#ordens-table tbody").html(linhas.join(""));
      },
      error: () => alert("Erro ao carregar ordens de serviço"),
    });
  }

  function limparFormulario() {
    $("#ordem-form")[0].reset();
    $("#ordem-id").val("");
  }

  $("#ordem-form").submit(function (e) {
    e.preventDefault();

    const id = $("#ordem-id").val();
    const dados = {
      numero_ordem: $("#numero_ordem").val().trim(),
      data_abertura: $("#data_abertura").val(),
      nome_consumidor: $("#nome_consumidor").val().trim(),
      cpf_consumidor: $("#cpf_consumidor").val().trim(),
      produto_id: $("#produto").val(),
    };

    if (
      !dados.numero_ordem ||
      !dados.data_abertura ||
      !dados.nome_consumidor ||
      !dados.cpf_consumidor ||
      !dados.produto_id
    ) {
      alert("Preencha todos os campos");
      return;
    }

    const method = id ? "PUT" : "POST";
    if (id) dados.id = id;

    $.ajax({
      url: API_URL,
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify(dados),
      success: () => {
        alert("Ordem salva com sucesso!");
        limparFormulario();
        carregarOrdens();
      },
      error: (xhr) => {
        alert(xhr.responseJSON?.erro || "Erro ao salvar ordem de serviço");
      },
    });
  });

  $(document)
    .off("click", ".btn-editar")
    .on("click", ".btn-editar", function () {
      const ordem = $(this).data("ordem");
      $("#ordem-id").val(ordem.id);
      $("#numero_ordem").val(ordem.numero_ordem);
      $("#data_abertura").val(ordem.data_abertura);
      $("#nome_consumidor").val(ordem.nome_consumidor);
      $("#cpf_consumidor").val(ordem.cpf_consumidor);
      $("#produto").val(ordem.produto_id);
    });

  $(document)
    .off("click", ".btn-excluir")
    .on("click", ".btn-excluir", function () {
      const id = $(this).data("id");
      if (!confirm("Deseja excluir esta ordem de serviço?")) return;

      $.ajax({
        url: `${API_URL}?id=${id}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        success: () => {
          alert("Ordem excluída com sucesso!");
          carregarOrdens();
        },
        error: (xhr) => {
          alert(xhr.responseJSON?.erro || "Erro ao excluir ordem");
        },
      });
    });

  $(document)
    .off("click", ".btn-logs")
    .on("click", ".btn-logs", function () {
        console.log("Botão logs clicado");

      const id = $(this).data("id");

      $.ajax({
        url: `${API_URL}/logs?id=${id}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        success: function (logs) {
          $("#logs-list").empty();
          if (logs.length === 0) {
            $("#logs-list").append(
              '<li class="list-group-item">Nenhum log encontrado.</li>'
            );
          } else {
            logs.forEach((log) => {
              $("#logs-list").append(
                `<li class="list-group-item">${log.data} - ${log.mensagem}</li>`
              );
            });
          }
        },
        error: () => alert("Erro ao carregar logs"),
      });
    });

  carregarProdutos();
  carregarOrdens();
});
