# Sistema de Ordens de Serviço – Front-End

Este é o front-end da aplicação de gerenciamento de **ordens de serviço**, desenvolvida com HTML, Bootstrap e jQuery. A aplicação se conecta a uma API RESTful (back-end em PHP) para realizar operações como cadastro, listagem, edição e exclusão de clientes, produtos e ordens de serviço.

## Visão Geral

O sistema conta com as seguintes funcionalidades:
- Login com autenticação via JWT
- CRUD de Clientes
- CRUD de Produtos
- CRUD de Ordens de Serviço
- Visualização de logs de alterações
- Controle de acesso (redirecionamento para login se não autenticado)
- Navegação entre páginas via Navbar

---

## Estrutura de Diretórios

/
├── index.html # Página inicial
├── login.html # Tela de login
├── clientes.html # CRUD de clientes
├── produtos.html # CRUD de produtos
├── ordens.html # CRUD de ordens de serviço + logs
├── navbar.html # Navbar incluída dinamicamente nas páginas
├── main.js # Lógica de autenticação, logout, navbar
├── clientes.js # Lógica específica para clientes
├── produtos.js # Lógica específica para produtos
├── ordens.js # Lógica específica para ordens
├── assets/ # Imagens e estilos (opcional)
└── README.md


---

## Tecnologias Utilizadas

- HTML5 + CSS3
- [Bootstrap 5](https://getbootstrap.com/)
- [jQuery 3.7.1](https://jquery.com/)
- LocalStorage para persistência do token
- Requisições `AJAX` para a API REST

---

## Como rodar o front-end

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/nome-do-repositorio.git

2. Abra o arquivo index.html ou outro HTML diretamente no navegador (ou utilize uma extensão como "Live Server" no VS Code).

3. Certifique-se de que o back-end está rodando em http://localhost:8000, pois todas as requisições são feitas para essa URL via AJAX.


## Autenticação

Para conseguir se autenticar utilize o usuário que foi inserido para testes no schema da API:
```bash
  email: teste@email.com
  senha: 123456
```

A autenticação é feita por JWT.

O token é armazenado no localStorage após o login.

Caso o token não esteja presente, o usuário é redirecionado para login.html.


##  Funcionalidades por página


|Página|Função|
|---|---|
|`login.html`|Login do usuário e armazenamento do token|
|`index.html`|Página inicial ou dashboard|
|`clientes.html`|Cadastro, edição, listagem e exclusão|
|`produtos.html`|Cadastro, edição, listagem e exclusão|
|`ordens.html`|CRUD + visualização de logs por ordem|


##  Autor
Desenvolvido por Luis Modesto - luisgmodesto12@gmail.com
