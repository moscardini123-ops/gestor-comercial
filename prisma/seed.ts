import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.pedidoItem.deleteMany();
  await prisma.ordemServicoItem.deleteMany();
  await prisma.notaFiscalItem.deleteMany();
  await prisma.historicoSituacao.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.ordemServico.deleteMany();
  await prisma.notaFiscal.deleteMany();
  await prisma.cliente.deleteMany();

  const maria = await prisma.cliente.create({ data: { nome: "Maria Silva", tipoPessoa: "F", cpfCnpj: "123.456.789-00", email: "maria@exemplo.com", cidade: "Rio de Janeiro", uf: "RJ" } });
  const acme = await prisma.cliente.create({ data: { nome: "Acme Comercio LTDA", nomeFantasia: "Acme", tipoPessoa: "J", cpfCnpj: "12.345.678/0001-90", email: "compras@acme.com", cidade: "Sao Paulo", uf: "SP" } });

  const p1 = await prisma.pedido.create({
    data: {
      numero: 1001, situacao: "Aprovado", clienteId: maria.id, condicaoPagamento: "A vista",
      fretePorConta: "R", formaEnvio: "Correios PAC", codigoRastreamento: "AA123456789BR", vendedor: "Joao",
      valorFrete: 25, valorDesconto: 0, totalProdutos: 300, totalPedido: 325,
      itens: { create: [
        { descricao: "Camiseta algodao", unidade: "UN", quantidade: 3, valorUnitario: 60 },
        { descricao: "Bone", unidade: "UN", quantidade: 2, valorUnitario: 60 },
      ] },
    },
  });
  await prisma.historicoSituacao.createMany({ data: [
    { entidade: "pedido", entidadeId: p1.id, de: null, para: "Em aberto", observacao: "Pedido criado" },
    { entidade: "pedido", entidadeId: p1.id, de: "Em aberto", para: "Aprovado", observacao: "Pagamento confirmado" },
  ] });

  const p2 = await prisma.pedido.create({
    data: {
      numero: 1002, situacao: "Em aberto", clienteId: acme.id, condicaoPagamento: "30/60 dias",
      fretePorConta: "D", vendedor: "Ana", valorFrete: 0, totalProdutos: 1200, totalPedido: 1200,
      itens: { create: [{ descricao: "Monitor 24\"", unidade: "UN", quantidade: 4, valorUnitario: 300 }] },
    },
  });
  await prisma.historicoSituacao.create({ data: { entidade: "pedido", entidadeId: p2.id, de: null, para: "Em aberto", observacao: "Pedido criado" } });

  const os1 = await prisma.ordemServico.create({
    data: {
      numero: 501, situacao: "Em andamento", clienteId: maria.id, equipamento: "Notebook Dell Inspiron",
      numeroSerie: "SN-48213", defeitoRelatado: "Nao liga", diagnostico: "Fonte queimada", tecnico: "Carlos",
      valorServicos: 120, valorPecas: 180, valorTotal: 300,
      itens: { create: [
        { tipo: "servico", descricao: "Mao de obra", quantidade: 1, valorUnitario: 120 },
        { tipo: "peca", descricao: "Fonte 65W", quantidade: 1, valorUnitario: 180 },
      ] },
    },
  });
  await prisma.historicoSituacao.createMany({ data: [
    { entidade: "ordem", entidadeId: os1.id, de: null, para: "Aberta", observacao: "Ordem criada" },
    { entidade: "ordem", entidadeId: os1.id, de: "Aberta", para: "Em andamento", observacao: "Diagnostico iniciado" },
  ] });

  const nf1 = await prisma.notaFiscal.create({
    data: {
      numero: 101, serie: 1, tipoNota: "S", naturezaOperacao: "Venda de mercadoria", situacao: 3,
      descricaoSituacao: "Autorizada", clienteId: acme.id, vendedor: "Ana",
      chaveAcesso: "3526 1012 3456 7800 0190 5500 1000 0001 0110 0000 0017",
      valorProdutos: 1200, valorFrete: 0, valorNota: 1200,
      itens: { create: [{ descricao: "Monitor 24\"", unidade: "UN", ncm: "85285210", cfop: "5102", quantidade: 4, valorUnitario: 300, valorTotal: 1200 }] },
    },
  });
  await prisma.historicoSituacao.createMany({ data: [
    { entidade: "nota", entidadeId: nf1.id, de: null, para: "Pendente", observacao: "Nota criada" },
    { entidade: "nota", entidadeId: nf1.id, de: "Pendente", para: "Autorizada", observacao: "Autorizada pela SEFAZ" },
  ] });

  console.log("Seed concluido: 2 clientes, 2 pedidos, 1 ordem de servico, 1 nota fiscal, com historico.");
}

main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
