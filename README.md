# DevConnect - Rede Social para Desenvolvedores

DevConnect é um aplicativo Android inspirado no LinkedIn, especificamente projetado para desenvolvedores compartilharem seus projetos, conectarem-se com outros profissionais e construírem sua presença online na comunidade de desenvolvimento.

## 📱 Funcionalidades

### Funcionalidades Principais
- **Autenticação Segura**: Sistema de login e cadastro com hash de senhas
- **Dashboard de Projetos**: Visualização de projetos recentes e populares
- **Criação de Projetos**: Interface intuitiva para compartilhar projetos com a comunidade
- **Sistema Premium**: Planos de assinatura com recursos exclusivos

### Funcionalidades Premium
- ✨ **Projetos Ilimitados**: Crie quantos projetos quiser
- 📊 **Analytics Avançados**: Estatísticas detalhadas dos seus projetos
- 🎯 **Suporte Prioritário**: Atendimento preferencial
- 🎨 **Conteúdo Exclusivo**: Acesso a recursos premium
- 🚫 **Experiência sem Anúncios**: Interface limpa e focada

## 🏗️ Arquitetura

### Estrutura do Projeto
```
app/src/main/java/com/devconnect/
├── activities/          # Activities principais
│   ├── LoginActivity.kt
│   ├── RegisterActivity.kt
│   ├── MainActivity.kt
│   ├── CreateProjectActivity.kt
│   └── PremiumActivity.kt
├── adapters/           # Adapters para RecyclerViews
│   ├── ProjectAdapter.kt
│   ├── TechTagAdapter.kt
│   ├── TechSuggestionAdapter.kt
│   └── SelectedTechAdapter.kt
├── database/           # Banco de dados Room
│   ├── AppDatabase.kt
│   ├── UserDao.kt
│   ├── ProjectDao.kt
│   └── Converters.kt
├── managers/           # Gerenciadores de negócio
│   ├── AuthManager.kt
│   └── ProjectManager.kt
├── models/             # Modelos de dados
│   ├── User.kt
│   └── Project.kt
└── utils/              # Utilitários
    ├── ValidationUtils.kt
    └── SecurityUtils.kt
```

### Tecnologias Utilizadas
- **Kotlin**: Linguagem principal
- **Room Database**: Persistência local
- **Material Design**: Interface moderna
- **ViewBinding**: Binding de views
- **Coroutines**: Programação assíncrona
- **Gson**: Serialização JSON

## 🎨 Design

### Paleta de Cores
- **Primary Blue**: #1DA1F2 (Azul principal)
- **Primary Cyan**: #00D4FF (Ciano)
- **Premium Gold**: #FFD700 (Dourado premium)
- **Background**: #FFFFFF (Branco)
- **Text Primary**: #1C1C1E (Texto principal)

### Componentes UI
- **Gradientes**: Botões com gradientes azul-ciano
- **Cards**: Design Material com elevação
- **Tabs**: Navegação entre Recentes e Populares
- **FAB**: Botão flutuante para criar projetos
- **Tech Tags**: Chips para tecnologias

## 📊 Banco de Dados

### Entidades

#### User
```kotlin
@Entity(tableName = "users")
data class User(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val username: String,
    val fullName: String?,
    val email: String,
    val passwordHash: String,
    val profileImageUrl: String? = null,
    val isPremium: Boolean = false,
    val premiumExpiryDate: Long? = null,
    val createdAt: Long = System.currentTimeMillis()
)
```

#### Project
```kotlin
@Entity(tableName = "projects")
data class Project(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val title: String,
    val description: String,
    val imageUrl: String? = null,
    val repositoryUrl: String? = null,
    val demoUrl: String? = null,
    val technologies: List<String>,
    val authorId: Long,
    val authorName: String,
    val authorImageUrl: String? = null,
    val createdAt: Long = System.currentTimeMillis(),
    val likeCount: Int = 0,
    val viewCount: Int = 0,
    val shareCount: Int = 0,
    val isLiked: Boolean = false,
    val isPremiumContent: Boolean = false
)
```

## 🔐 Segurança

### Autenticação
- **Hash de Senhas**: SHA-256 com salt aleatório
- **Validação**: Email, senha e username
- **Sessão**: SharedPreferences para manter login

### Validações
- **Email**: Formato válido
- **Senha**: Mínimo 6 caracteres
- **Username**: 3-20 caracteres alfanuméricos
- **URLs**: Validação de formato

## 🚀 Como Executar

### Pré-requisitos
- Android Studio Arctic Fox ou superior
- SDK Android 21+ (Android 5.0)
- Kotlin 1.8+

### Passos
1. Clone o repositório:
```bash
git clone https://github.com/testetestevictin-lang/DevConnect.git
```

2. Abra o projeto no Android Studio

3. Sincronize as dependências do Gradle

4. Execute o app em um dispositivo ou emulador

## 📱 Telas

### 1. Login
- Campo de email e senha
- Validação em tempo real
- Link para cadastro
- Design com gradiente

### 2. Cadastro
- Username, nome completo, email e senha
- Validação de campos únicos
- Criação de conta automática

### 3. Dashboard Principal
- Tabs: Recentes e Populares
- Lista de projetos com cards
- Empty state quando não há projetos
- FAB para criar novo projeto

### 4. Criar Projeto
- Formulário completo
- Seleção de tecnologias
- Sugestões de techs
- Validação de campos

### 5. Premium
- Lista de benefícios
- Plano mensal R$ 19,90
- Botão de assinatura
- Design premium com gradiente

## 🎯 Funcionalidades Premium

### Limitações Gratuitas
- Máximo 3 projetos
- Funcionalidades básicas
- Anúncios (futuro)

### Benefícios Premium
- Projetos ilimitados
- Analytics detalhados
- Suporte prioritário
- Conteúdo exclusivo
- Interface sem anúncios

## 🔄 Fluxo de Navegação

```
LoginActivity → RegisterActivity
     ↓
MainActivity (Dashboard)
     ↓
CreateProjectActivity ← PremiumActivity
```

## 📝 Próximos Passos

- [ ] Implementar Google Play Billing
- [ ] Adicionar tela de detalhes do projeto
- [ ] Sistema de likes e compartilhamento
- [ ] Notificações push
- [ ] Chat entre desenvolvedores
- [ ] Sistema de seguir usuários
- [ ] Feed personalizado
- [ ] Busca avançada
- [ ] Integração com GitHub API
- [ ] Modo escuro

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ para a comunidade de desenvolvedores.

---

**DevConnect** - Conectando desenvolvedores, um projeto por vez! 🚀