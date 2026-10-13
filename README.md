# Gestor LBS

Gerencial no estilo do ERP da Olist/Tiny, **misturado com as funções do gerencial
próprio** (termo de garantia, OS de upgrade, garantias/SAC, fechamento). Projeto
próprio, com identidade própria — **não reproduz a marca da Olist/Tiny**.

## O que tem

Shell escuro com barra lateral por seções (Início, Cadastros, Vendas, Serviços,
Finanças), tudo em português.

- **Cadastros**
  - **Clientes e Fornecedores** — abas (cliente/fornecedor/transportador), lista,
    detalhe, cadastro e edição.
  - **Produtos** — SKU, GTIN, NCM, preço, custo, estoque, margem; abas por tipo.
  - **Vendedores** — equipe e comissão.
- **Vendas**
  - **Pedidos de Venda** — lista/filtro, detalhe, cadastro e edição, itens,
    troca de situação com histórico, e **impressão** no formato do documento.
  - **Notas Fiscais** — campos fiscais, situação por código, impressão de dados.
  - **Termos de Garantia** — modelos reutilizáveis, anexáveis a pedidos e ordens.
- **Serviços**
  - **Ordens de serviço** — reparo **e upgrade** (usado como parte do pagamento,
    diferença calculada), termo anexável e **impressão** com o termo.
  - **Garantias (SAC)** — acionamentos com protocolo, serial e status.
- **Finanças**
  - **Fechamento** — resultado por mês pelo modelo de contribuição
    `Σ(venda − custo variável) − custo fixo`, parâmetros ajustáveis.

### Documentos (impressão)

Pedido de Venda e Ordem de Serviço têm uma tela de **impressão A4** com cabeçalho
da empresa, cliente, itens, totais e o **Termo de Garantia** anexado — pronto para
"Imprimir / Salvar PDF" no navegador. A OS de upgrade imprime "serviços executados",
"considerações finais" (usado como parte do pagamento) e a "diferença paga".

## Procedência

- **Pedido** e **Nota Fiscal** seguem a nomenclatura da API pública v2 do Tiny/Olist.
- **Ordem de serviço / upgrade** e o **termo de garantia** vêm do gerencial próprio
  (o texto do termo é o da loja). A OS de upgrade espelha o fluxo "usado como parte
  do pagamento + diferença + termo".
- O **repositório do gerencial não foi alterado** em nada; serviu só de referência.
- Dados de cliente nos exemplos são **fictícios**. O cabeçalho da empresa usa os
  dados públicos da loja e é editável.

## Stack

Next.js 15 (App Router) · React 19 · Prisma + SQLite · Tailwind CSS v4 · TypeScript.

## Como rodar

```bash
npm install
npm run setup   # prisma generate + db push + seed (cria dev.db com exemplos)
npm run dev     # http://localhost:3000
```

## Estrutura

```
prisma/schema.prisma   Cliente, Pedido, OrdemServico, NotaFiscal, Produto,
                       Vendedor, Garantia, TermoGarantia, Empresa, HistoricoSituacao
src/app/<modulo>/      lista, detalhe, novo, editar, imprimir + server actions
src/components/         shell (Sidebar), UI, Folha (impressão), TextoFormatado
src/lib/                db, domain (situações), empresa, historico, format
```

## Próximos passos

Exclusão de registros, autenticação, emissão fiscal real (SEFAZ) e relatórios.
