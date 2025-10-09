# CineFlix - Plataforma de Streaming de Filmes

Uma plataforma completa de streaming de filmes similar à Netflix, desenvolvida com HTML, CSS e JavaScript puro, incluindo sistema de autenticação, banco de dados local, upload de filmes, planos de assinatura e player de vídeo avançado.

## 🎯 Funcionalidades Principais

### 🔐 Sistema de Autenticação
- Cadastro e login de usuários
- Validação de formulários
- Gerenciamento de sessão com localStorage
- Área administrativa restrita

### 🎬 Catálogo de Filmes
- Exibição de filmes em grid responsivo
- Sistema de busca e filtros por gênero
- Detalhes completos dos filmes
- Avaliações e metadados

### 💳 Planos de Assinatura
- Três planos diferentes (Básico, Padrão, Premium)
- Sistema de pagamento simulado
- Cobrança mensal e anual com desconto
- Comparação detalhada de recursos

### 📹 Player de Vídeo Avançado
- Controles customizados e responsivos
- Suporte a legendas e múltiplas qualidades
- Picture-in-Picture e tela cheia
- Atalhos de teclado
- Salvamento automático do progresso

### 🛠️ Painel Administrativo
- Upload e gerenciamento de filmes
- Visualização de estatísticas
- Gerenciamento de usuários
- Dashboard com métricas

## 📁 Estrutura do Projeto

```
streaming-site/
├── index.html              # Página principal
├── plans.html              # Página de planos
├── admin.html              # Painel administrativo
├── player.html             # Player de vídeo
├── css/
│   ├── style.css           # Estilos principais
│   ├── admin.css           # Estilos do admin
│   ├── plans.css           # Estilos dos planos
│   └── player.css          # Estilos do player
├── js/
│   ├── app.js              # JavaScript principal
│   ├── admin.js            # Funcionalidades admin
│   ├── plans.js            # Sistema de planos
│   └── player.js           # Player de vídeo
├── images/                 # Imagens do site
├── videos/                 # Arquivos de vídeo
└── README.md              # Documentação
```

## 🚀 Como Usar

### 1. Configuração Inicial
1. Faça o download de todos os arquivos
2. Abra `index.html` em um navegador moderno
3. O banco de dados será inicializado automaticamente no localStorage

### 2. Funcionalidades Disponíveis

#### Para Usuários:
- **Cadastro/Login**: Crie uma conta ou faça login
- **Navegação**: Explore o catálogo de filmes
- **Busca**: Use a barra de pesquisa ou filtros
- **Assinatura**: Escolha um plano e simule o pagamento
- **Assistir**: Clique em um filme para abrir o player

#### Para Administradores:
- Acesse `admin.html` para o painel administrativo
- Adicione novos filmes com metadados completos
- Visualize estatísticas de usuários e receita
- Gerencie o catálogo de filmes

### 3. Dados de Demonstração
O sistema vem com dados pré-carregados:
- 6 filmes de exemplo
- 3 planos de assinatura
- Sistema de usuários funcional

## 💻 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Design responsivo com Flexbox e Grid
- **JavaScript ES6+**: Funcionalidades interativas
- **LocalStorage**: Persistência de dados local
- **Web APIs**: Fullscreen, Picture-in-Picture, etc.

## 🎨 Design e UX

### Características do Design:
- **Tema escuro** inspirado na Netflix
- **Responsivo** para desktop, tablet e mobile
- **Animações suaves** e micro-interações
- **Tipografia moderna** com fonte Inter
- **Esquema de cores** vermelho (#e50914) e tons de cinza

### Experiência do Usuário:
- Navegação intuitiva e familiar
- Feedback visual para todas as ações
- Loading states e tratamento de erros
- Atalhos de teclado no player
- Interface adaptável a diferentes dispositivos

## 🔧 Funcionalidades Técnicas

### Sistema de Autenticação:
```javascript
// Exemplo de login
function handleLogin(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    // Validação e criação de sessão
}
```

### Banco de Dados Local:
```javascript
// Estrutura dos dados
{
    users: [...],      // Usuários cadastrados
    movies: [...],     // Catálogo de filmes
    plans: [...],      // Planos de assinatura
    subscriptions: [...] // Assinaturas ativas
}
```

### Player de Vídeo:
- Controles customizados em HTML/CSS/JS
- Suporte a eventos de teclado
- Salvamento automático do progresso
- Múltiplas velocidades de reprodução

## 📱 Responsividade

O site é totalmente responsivo com breakpoints:
- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px

### Adaptações Mobile:
- Menu hambúrguer na navegação
- Controles de player otimizados para touch
- Layout em coluna única
- Botões maiores para melhor usabilidade

## 🔒 Segurança

**Nota**: Este é um projeto de demonstração. Em produção, implemente:
- Hash de senhas (bcrypt)
- Autenticação JWT
- Validação server-side
- HTTPS obrigatório
- Sanitização de inputs

## 🎯 Melhorias Futuras

### Funcionalidades Planejadas:
- [ ] Backend real com Node.js/Express
- [ ] Banco de dados PostgreSQL/MongoDB
- [ ] Upload real de arquivos de vídeo
- [ ] Sistema de comentários e avaliações
- [ ] Recomendações personalizadas
- [ ] Notificações push
- [ ] Modo offline com Service Workers
- [ ] Integração com APIs de pagamento reais

### Otimizações:
- [ ] Lazy loading de imagens
- [ ] Compressão de vídeos
- [ ] CDN para assets estáticos
- [ ] Cache inteligente
- [ ] Análise de performance

## 🐛 Problemas Conhecidos

1. **Vídeos de demonstração**: Usa vídeos de exemplo públicos
2. **Armazenamento local**: Dados perdidos ao limpar navegador
3. **Sem validação server-side**: Validação apenas no frontend
4. **Pagamentos simulados**: Sistema de pagamento é apenas demonstrativo

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se o navegador suporta localStorage
2. Certifique-se de que JavaScript está habilitado
3. Use um navegador moderno (Chrome, Firefox, Safari, Edge)

## 📄 Licença

Este projeto é para fins educacionais e de demonstração. Sinta-se livre para usar como base para seus próprios projetos.

---

**Desenvolvido com ❤️ usando tecnologias web modernas**
