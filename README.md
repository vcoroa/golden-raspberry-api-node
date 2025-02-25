# Golden Raspberry Awards API
API RESTful desenvolvida como parte de um **teste técnico em Node.js** para análise de produtores vencedores da categoria "Pior Filme" do Golden Raspberry Awards. O objetivo é processar um arquivo CSV com dados de filmes, identificar os produtores com o maior e o menor intervalo entre prêmios consecutivos e expor esses resultados via endpoint REST.

## Sobre o Projeto
Este projeto foi criado para atender aos requisitos de um teste técnico, que incluem:
- Ler um arquivo CSV ao iniciar a aplicação e carregar os dados em um banco de dados em memória (SQLite).
- Implementar uma API RESTful seguindo o **nível 2 de maturidade de Richardson** (uso de recursos e verbos HTTP).
- Calcular e retornar:
  - O produtor com o **maior intervalo** entre dois prêmios consecutivos.
  - O produtor com o **menor intervalo** entre dois prêmios consecutivos.
- Utilizar apenas **testes de integração** para validar os resultados.
- Disponibilizar o código em um repositório Git com instruções claras neste README.

## Pré-requisitos
- **Node.js**: Versão 18.x ou superior. Verifique com `node -v`.
- **Git**: Para clonar o repositório.
- **NPM**: Gerenciador de pacotes do Node.js (incluso na instalação do Node).

## Estrutura do Projeto
```text
golden-raspberry-api/
├── src/                    # Código-fonte da aplicação
│   ├── database.js         # Configuração do banco SQLite em memória
│   ├── loadData.js         # Lógica para carregar o CSV no banco
│   ├── routes.js           # Definição das rotas da API
│   └── server.js           # Inicialização do servidor Express
├── tests/                  # Testes de integração
│   └── routes.test.js      # Testes para o endpoint da API
├── movies.csv              # Arquivo CSV com os dados de entrada
├── package.json            # Configuração do projeto e dependências
└── README.md               # Este arquivo
```

### Arquivo CSV
O arquivo `movies.csv` contém os dados dos filmes indicados e vencedores do Golden Raspberry Awards, no formato:
```
year;title;studios;producers;winner
1980;Can't Stop the Music;Associated Film Distribution;Allan Carr;yes
...
```
- **Delimitador**: Ponto e vírgula (`;`).
- **Colunas**: `year` (ano), `title` (título), `studios` (estúdios), `producers` (produtores), `winner` (vencedor: "yes" ou vazio).

## Como Rodar

### 1. Clonar o Repositório
Clone o projeto do repositório Git:
```bash
git clone https://github.com/vcoroa/golden-raspberry-api-node
cd golden-raspberry-api-node
```

### 2. Instalar Dependências
Instale as dependências listadas no `package.json`:
```bash
npm install
```

### 3. Verificar o Arquivo CSV
Certifique-se de que o arquivo `movies.csv` está na raiz do projeto. Ele é carregado automaticamente ao iniciar a aplicação.

### 4. Iniciar a Aplicação
Rode o servidor:
```bash
npm start
```
O servidor será iniciado em `http://localhost:3000`. Você verá no console:
```
CSV data loaded into database
Server running on http://localhost:3000
```

## Testes
Os testes de integração foram implementados com **Jest** e **Supertest** para validar o comportamento do endpoint. Eles verificam:
- Status HTTP 200 na resposta.
- Estrutura correta do JSON retornado (campos `max` e `min` com `producer`, `interval`, `previousWin` e `followingWin`).
- Intervalos positivos.

### Executar os Testes
```bash
npm test
```
Exemplo de saída esperada:
```
PASS  tests/routes.test.js
Producer Intervals API
  ✓ should return max and min intervals for producers (50ms)
```

## Endpoints

### `GET /api/producers/intervals`
Retorna os produtores com o maior e menor intervalo entre prêmios consecutivos.
- **Método**: GET
- **URL**: `/api/producers/intervals`
- **Resposta**:
  ```json
  {
    "max": {
      "producer": "Nome do Produtor",
      "interval": 10,
      "previousWin": 1990,
      "followingWin": 2000
    },
    "min": {
      "producer": "Nome do Produtor",
      "interval": 1,
      "previousWin": 1990,
      "followingWin": 1991
    }
  }
  ```
- **Descrição**:
  - `max`: Produtor com o maior intervalo entre duas vitórias consecutivas.
  - `min`: Produtor com o menor intervalo entre duas vitórias consecutivas.
  - Os campos incluem o nome do produtor, o intervalo em anos, e os anos das vitórias (anterior e seguinte).

### Exemplo de Uso
```bash
curl http://localhost:3000/api/producers/intervals
```

## Requisitos Atendidos
- **Carregamento do CSV**: Os dados são lidos do `movies.csv` e inseridos no SQLite em memória ao iniciar o servidor.
- **Banco em Memória**: Uso do SQLite com `:memory:` elimina a necessidade de instalação externa.
- **Nível 2 de Richardson**: A API usa recursos REST (`/api/producers/intervals`) e o verbo GET.
- **Testes de Integração**: Apenas testes de integração foram implementados, conforme especificado.
- **Flexibilidade**: O código suporta diferentes conjuntos de dados CSV, desde que sigam o formato esperado.

## Notas Adicionais
- **Dependências**:
  - `express`: Framework para a API.
  - `sqlite3`: Banco de dados em memória.
  - `csv-parse`: Para processar o CSV.
  - `jest` e `supertest`: Para testes de integração.
- **Robustez**: O código lida com múltiplos produtores por filme (separados por "," ou "and") e ignora linhas malformadas ou vazias no CSV.
- **Debug**: Logs no console ajudam a verificar o carregamento do CSV e a resposta do endpoint.

## Problemas Comuns e Soluções
- **Erro "CsvError: Invalid Record Length"**: Verifique se o delimitador no `loadData.js` está configurado como `;` e se o CSV está bem formatado.
- **Porta 3000 ocupada**: Altere a porta em `src/server.js` (ex.: `app.listen(3001)`).
- **Testes falham**: Confirme que o `movies.csv` está presente e que os dados são carregados antes dos testes.

## Autor
Desenvolvido como parte de um teste técnico em Node.js. Para dúvidas ou sugestões, consulte o repositório ou entre em contato.