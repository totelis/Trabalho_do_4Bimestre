# Planejamento do Projeto: Plataforma de Streaming de Filmes

## 1. Visão Geral

O objetivo deste projeto é criar uma plataforma de streaming de filmes semelhante à Netflix, utilizando tecnologias web front-end (HTML, CSS, JavaScript) e um backend para gerenciar o banco de dados, autenticação de usuários, upload de filmes e sistema de assinaturas. Este documento detalha a arquitetura, a estrutura do banco de dados e as funcionalidades planejadas.

## 2. Arquitetura do Sistema

A plataforma será construída com uma arquitetura cliente-servidor:

- **Frontend (Cliente):** Uma aplicação de página única (SPA) desenvolvida com HTML, CSS e JavaScript. Será responsável pela interface do usuário, interação, e comunicação com o backend via API REST.
- **Backend (Servidor):** Um servidor (a ser definido, possivelmente Node.js com Express ou um backend em Python como Flask/Django) que irá expor uma API REST para o frontend. O backend cuidará de:
    - Autenticação e autorização de usuários.
    - Gerenciamento do banco de dados (usuários, filmes, assinaturas).
    - Processamento de uploads de filmes.
    - Lógica de negócios para os planos de assinatura.
    - Streaming dos arquivos de vídeo.

## 3. Estrutura de Páginas (Frontend)

O site terá as seguintes páginas principais:

- **Home/Landing Page:** Apresentação do serviço, com destaque para alguns filmes e um call-to-action para registro.
- **Catálogo de Filmes (Browse):** Página principal após o login, onde os usuários podem navegar e pesquisar por filmes.
- **Página de Detalhes do Filme:** Exibe informações sobre um filme específico (sinopse, elenco, ano) e o player de vídeo.
- **Login / Registro:** Formulários para autenticação e criação de novas contas.
- **Página de Planos de Assinatura:** Apresenta os três planos disponíveis e permite a seleção e pagamento.
- **Área do Usuário (Conta):** Onde o usuário pode gerenciar sua assinatura, dados cadastrais e ver o histórico.
- **Página de Upload (Admin):** Uma área restrita para administradores fazerem o upload de novos filmes.

## 4. Modelo do Banco de Dados

Propomos um banco de dados relacional (como PostgreSQL ou MySQL) com as seguintes tabelas principais:

| Tabela      | Colunas                                                                                             | Descrição                                                                         |
|-------------|-----------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|
| `usuarios`  | `id` (PK), `nome`, `email` (UNIQUE), `senha_hash`, `plano_id` (FK), `data_criacao`                    | Armazena as informações dos usuários cadastrados.                                 |
| `planos`    | `id` (PK), `nome` (ex: Básico, Padrão, Premium), `preco`, `qualidade_video`, `telas_simultaneas`      | Descreve os diferentes planos de assinatura disponíveis.                           |
| `filmes`    | `id` (PK), `titulo`, `sinopse`, `ano_lancamento`, `genero`, `url_poster`, `url_video`, `data_upload` | Contém os metadados de cada filme disponível na plataforma.                       |
| `assinaturas`| `id` (PK), `usuario_id` (FK), `plano_id` (FK), `data_inicio`, `data_fim`, `status_pagamento`        | Registra o histórico de assinaturas de cada usuário.                              |

## 5. Funcionalidades Detalhadas

- **Autenticação:** Sistema baseado em token (JWT - JSON Web Tokens) para proteger as rotas e garantir que apenas usuários autenticados acessem o conteúdo.
- **Pagamentos:** Integração com um gateway de pagamento (ex: Stripe, Mercado Pago) para processar as assinaturas. A API do gateway será chamada no backend para garantir a segurança.
- **Upload de Filmes:** Um formulário na área de admin permitirá o upload de arquivos de vídeo. O backend irá processar e armazenar o vídeo em um serviço de armazenamento de objetos (como AWS S3 ou similar) e salvar a URL no banco de dados.
- **Player de Vídeo:** Utilização da tag `<video>` do HTML5 com controles customizados via JavaScript para uma experiência de visualização aprimorada.

## 6. Próximos Passos

O próximo passo é iniciar o desenvolvimento do frontend, criando a estrutura HTML e o estilo CSS para as páginas definidas, começando pela Home e pela página de Catálogo.

