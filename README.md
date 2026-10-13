# Gestor Comercial

Mini ERP com tres modulos: **pedidos de venda**, **ordens de servico** e **notas fiscais**.
Projeto proprio, com identidade propria. Nasceu de um estudo da experiencia do Tiny/Olist
ERP, mas **nao reproduz marca, logo ou telas de terceiros**.

## Origem dos campos (documentacao publica)

- **Pedidos de venda** e **notas fiscais**: os nomes e a estrutura dos campos seguem a
  **API publica v2 do Tiny/Olist** (`api-docs`). Foram extraidos das paginas oficiais.
- **Ordens de servico**: a API publica **nao** expoe esse recurso e a central de ajuda nao
  e extraivel de forma automatica. O modelo aqui e **proprio**, no padrao de ERPs de
  assistencia/bancada (equipamento, defeito, diagnostico, solucao, servicos e pecas).

### Situacoes (status)

Confirmadas na documentacao da API:
- Pedido: `Em aberto`, `Aprovado`, `Atendido` (a situacao trafega como texto).
- Nota fiscal: codigo `1 = Pendente`.

As demais situacoes (ex.: `Faturado`, `Enviado`, `Entregue` no pedido; `Autorizada`,
`Cancelada`, `Rejeitada` na nota) seguem o conjunto padrao do produto e sao um **ponto de
partida** — convem confirmar numa conta real antes de criar regra de negocio que dependa
delas. Veja `src/lib/domain.ts`.

## Stack

Next.js 15 (App Router) · React 19 · Prisma + SQLite · Tailwind CSS v4 · TypeScript.

O SQLite deixa o projeto rodavel em qualquer maquina sem um banco externo.

## Como rodar

```bash
npm install
npm run setup   # prisma generate + db push + seed (cria o dev.db com dados de exemplo)
npm run dev     # http://localhost:3000
```

Scripts uteis:

| Script | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de producao |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:seed` | Recria os dados de exemplo |

## Estrutura

```
prisma/schema.prisma        modelos: Cliente, Pedido(+Item), OrdemServico(+Item), NotaFiscal(+Item)
prisma/seed.ts              dados de exemplo
src/app/pedidos/            lista, detalhe, novo + server action
src/app/ordens-servico/     lista, detalhe, novo + server action
src/app/notas-fiscais/      lista, detalhe, novo + server action
src/lib/domain.ts           situacoes, cores e tabelas (frete por conta)
src/components/             UI (nav, tabela, campos, editor de itens)
```

## Funcionalidades

Cada modulo (pedidos, ordens de servico, notas fiscais) tem:

- **Lista** com busca e filtro por situacao.
- **Detalhe** com todos os campos, itens e totais.
- **Cadastro** e **edicao** de registros, com editor de itens.
- **Troca de situacao com historico**: um painel no detalhe registra cada
  mudanca de situacao (de -> para), com observacao e data, numa linha do tempo.
  O historico fica na tabela `HistoricoSituacao` (campos `entidade`/`entidadeId`).
  Na edicao, a situacao fica travada: a mudanca passa sempre pelo painel, para
  manter o historico consistente.

## Escopo (proximos passos)

Ainda nao inclui: exclusao de registros, autenticacao, emissao fiscal real
(integracao SEFAZ), relatorios e integracoes de e-commerce.
