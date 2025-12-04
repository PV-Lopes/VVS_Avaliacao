# User Generator – Testes Unitários e Funcionais

Este projeto consiste em uma aplicação simples que consome a API pública **JSONPlaceholder** para exibir uma lista de usuários fictícios.  
O foco principal é demonstrar **boas práticas de testes**, incluindo:

- Testes unitários com **Jest + JSDOM**
- Testes funcionais com **Selenium WebDriver**
- Integração Contínua com **GitHub Actions**

---

## Tecnologias Utilizadas
- **HTML / CSS / JavaScript**
- **Jest** (testes unitários)
- **JSDOM** para simulação de DOM
- **Selenium WebDriver** (testes funcionais)
- **ChromeDriver**
- **GitHub Actions** (CI/CD)

---

## Estrutura do Projeto

/project
│── index.html
│── script.js
│── style.css
│── package.json
│── jest.config.js
│── README.md
│
└── tests
│── jester.test.js
│── selenium.functional.test.js

## 🧪 Tipos de Testes

### ✔ Testes Unitários (Jest + JSDOM)
Verificam:
- Existência dos elementos
- Clique no botão
- Execução do fetch
- Limpeza da lista
- Renderização dos usuários

### ✔ Testes Funcionais (Selenium)
Verificam:
- Fluxo real de carregamento dos usuários
- Abertura do link em nova aba
- Lista não duplicar em duplo clique

---

## ⚙ Como Rodar o Projeto

### Celecione o arquivo
```bash
cd VVS_Avaliacao
```

### Instalar dependências
```bash
npm install
```

### Abra o servidor
```bash
npx http-server -p 8080
```

### Rodar testes unitários
```bash
npm test
```

### Rodar apenas os testes funcionais
```bash
npm run test:functional
```

### Rodar todos os testes
```bash
npm run test:all
```

### Como funciona o script

O botão Carregar Usuários dispara:

1. fetch() → JSONPlaceholder
2. Limpa a lista
3. Renderiza os usuários no DOM