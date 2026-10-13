import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const TERMO_UPGRADE = `**1. Cobertura da Garantia**

A Empresa oferece uma garantia de 12 meses, a contar da data de compra do produto. Durante este período, a empresa se compromete a reparar ou substituir, a seu critério, o produto que apresentar defeitos de fabricação ou de funcionamento, desde que sejam observadas as condições estabelecidas neste termo de garantia.

**2. Exclusões da Garantia**

Esta garantia não cobre os seguintes casos:

- Danos causados por mau uso, negligência, acidentes, quedas, choques ou qualquer outra ação não relacionada à fabricação do produto;
- Desgaste natural decorrente do uso regular do produto, como arranhões, descoloração, desgaste da pulseira ou outros sinais de uso;
- Danos causados por intervenção ou reparo realizado por terceiros não autorizados pela empresa;
- Danos causados por utilização inadequada, armazenamento impróprio, exposição a condições adversas (umidade, calor excessivo, frio extremo, entre outros);
- Substituição de baterias, a menos que o produto seja adquirido com bateria nova e a falha ocorra durante o período de garantia;
- Caso o produto tenha sido carregado na tomada — sendo permitido apenas o carregamento em entradas USB de computadores, televisões, rádios etc.;
- Em caso de botões travados, será verificado se há acúmulo de sal — caso positivo, o produto não será trocado;
- Em caso de falha no carregamento com uso de "plugues de borracha" — não recomendados, pois acumulam detritos e causam oxidação. Neste caso, a garantia será negada.

**Instruções de Uso/Cuidados (link da fabricante)**: https://www.garmin.com/pt-BR/watch-t-and-care/

- Utilize apenas película de vidro.
- Não use "plugs protetores" nem "capinhas protetoras" — acumulam detritos e prejudicam o aparelho a longo prazo.

**3. Acionamento da Garantia**

Ao identificar defeito dentro do período de garantia, o cliente deve contatar a empresa imediatamente, informando o problema com data da compra e descrição detalhada (fotos, vídeos e relato por escrito). O envio do produto é de responsabilidade do cliente, com método seguro e rastreável. A empresa fará análise técnica em até 30 dias úteis. Coberto o defeito, a empresa arca com reparo/substituição e o frete de retorno.

**4. Instruções de Cuidado**

O cliente reconhece ter recebido as instruções de cuidado da fabricante (www.garmin.com/pt-BR/watch-t-and-care/) e compromete-se a segui-las. O descumprimento pode invalidar a garantia quando os danos decorrerem de uso inadequado, conforme o item 2.

**5. Limitações da Garantia**

A responsabilidade limita-se ao reparo ou substituição do produto, conforme o item 1. A empresa não responde por danos indiretos, lucros cessantes ou perda de dados. Os direitos desta garantia são limitados ao comprador inicial; este termo é intransferível.`;

async function main() {
  await prisma.pedidoItem.deleteMany();
  await prisma.ordemServicoItem.deleteMany();
  await prisma.notaFiscalItem.deleteMany();
  await prisma.historicoSituacao.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.ordemServico.deleteMany();
  await prisma.notaFiscal.deleteMany();
  await prisma.garantia.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.vendedor.deleteMany();
  await prisma.termoGarantia.deleteMany();
  await prisma.empresa.deleteMany();
  await prisma.cliente.deleteMany();

  await prisma.empresa.create({ data: {
    nome: "Light Bike Shop", cnpj: "40.890.016/0001-31", ie: "14.924.16-7",
    endereco: "Rua General Andrade Neves, 09 - São Lourenço", cidade: "Niterói", uf: "RJ",
    cep: "24.210-000", telefone: "(21) 98606-6681", site: "instagram.com/lightbikeshopb",
  } });

  const termo = await prisma.termoGarantia.create({ data: { nome: "Termo de garantia 12 meses (upgrade)", conteudo: TERMO_UPGRADE } });

  await prisma.vendedor.createMany({ data: [
    { nome: "João", email: "joao@lojaexemplo.com", comissaoPct: 3 },
    { nome: "Ana", email: "ana@lojaexemplo.com", comissaoPct: 2.5 },
  ] });

  await prisma.produto.createMany({ data: [
    { descricao: "Forerunner 165 Basic - Branca", sku: "F165BASIC-1", gtin: "753759326609", ncm: "8517.62.72", categoria: "Relógios", preco: 2111, custo: 1680, estoque: 3 },
    { descricao: "Forerunner 165 Music - Preta", sku: "F165MUSIC-PT", ncm: "8517.62.72", categoria: "Relógios", preco: 2499, custo: 1990, estoque: 2 },
    { descricao: "Forerunner 255 Music", sku: "F255MUSIC", categoria: "Relógios", preco: 2420, custo: 1950, estoque: 1 },
    { descricao: "Forerunner 55", sku: "F55", categoria: "Relógios", preco: 1050, custo: 820, estoque: 0 },
    { descricao: "Edge 1050", sku: "EDGE1050", categoria: "Ciclocomputadores", preco: 3999, custo: 3200, estoque: 1 },
    { descricao: "Pulseira silicone 22mm", sku: "PULS-22", categoria: "Acessórios", preco: 89, custo: 30, estoque: 20 },
  ] });

  const maria = await prisma.cliente.create({ data: { nome: "Maria Silva", tipoPessoa: "F", papel: "cliente", cpfCnpj: "123.456.789-00", email: "maria@exemplo.com", fone: "(21) 99999-0001", endereco: "Rua das Flores", numero: "100", bairro: "Centro", cidade: "Niterói", uf: "RJ", cep: "24000-000" } });
  const acme = await prisma.cliente.create({ data: { nome: "Acme Comércio LTDA", nomeFantasia: "Acme", tipoPessoa: "J", papel: "cliente", cpfCnpj: "12.345.678/0001-90", email: "compras@acme.com", cidade: "São Paulo", uf: "SP" } });
  await prisma.cliente.create({ data: { nome: "Distribuidora Pedal Forte", tipoPessoa: "J", papel: "fornecedor", cpfCnpj: "98.765.432/0001-10", cidade: "Curitiba", uf: "PR" } });

  const hoje = new Date();
  const mesPassado = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 15);

  const p1 = await prisma.pedido.create({ data: {
    numero: 1001, situacao: "Aprovado", clienteId: maria.id, dataPedido: mesPassado, condicaoPagamento: "PIX",
    fretePorConta: "R", formaEnvio: "SEDEX", codigoRastreamento: "AA123456789BR", vendedor: "João",
    valorFrete: 27, totalProdutos: 2111, totalPedido: 2138, pesoBruto: 0.8, pesoLiquido: 0.5, termoId: termo.id,
    obs: "Entrega em dias úteis.",
    itens: { create: [{ codigo: "F165BASIC-1", descricao: "Forerunner 165 Basic - Branca", unidade: "UN", quantidade: 1, valorUnitario: 2111 }] },
  } });
  await prisma.historicoSituacao.createMany({ data: [
    { entidade: "pedido", entidadeId: p1.id, de: null, para: "Em aberto", observacao: "Pedido criado" },
    { entidade: "pedido", entidadeId: p1.id, de: "Em aberto", para: "Aprovado", observacao: "Pagamento confirmado" },
  ] });

  const p2 = await prisma.pedido.create({ data: {
    numero: 1002, situacao: "Em aberto", clienteId: acme.id, condicaoPagamento: "30/60 dias", vendedor: "Ana",
    totalProdutos: 7998, totalPedido: 7998,
    itens: { create: [{ codigo: "EDGE1050", descricao: "Edge 1050", unidade: "UN", quantidade: 2, valorUnitario: 3999 }] },
  } });
  await prisma.historicoSituacao.create({ data: { entidade: "pedido", entidadeId: p2.id, de: null, para: "Em aberto", observacao: "Pedido criado" } });

  const osRep = await prisma.ordemServico.create({ data: {
    numero: 501, tipo: "reparo", situacao: "Em andamento", clienteId: maria.id, equipamento: "Forerunner 255 Music",
    numeroSerie: "7E2071786", defeitoRelatado: "Não carrega", diagnostico: "Oxidação no contato", tecnico: "Carlos",
    valorServicos: 120, valorPecas: 0, valorTotal: 120, termoId: termo.id,
    itens: { create: [{ tipo: "servico", descricao: "Limpeza e reparo do contato de carga", quantidade: 1, valorUnitario: 120 }] },
  } });
  await prisma.historicoSituacao.createMany({ data: [
    { entidade: "ordem", entidadeId: osRep.id, de: null, para: "Aberta", observacao: "Ordem criada" },
    { entidade: "ordem", entidadeId: osRep.id, de: "Aberta", para: "Em andamento", observacao: "Diagnóstico iniciado" },
  ] });

  const osUp = await prisma.ordemServico.create({ data: {
    numero: 502, tipo: "upgrade", situacao: "Concluida", clienteId: acme.id, equipamento: "Edge 1050",
    serialNovo: "89W065714", usadoRecebido: "Edge 540 usado", avaliacaoUsado: 1500, valorNovo: 3999,
    valorServicos: 0, valorPecas: 0, valorTotal: 3999, termoId: termo.id,
    obs: "Upgrade com troca; cliente levou o Edge 1050.",
    itens: { create: [{ tipo: "servico", descricao: "Edge 1050 (equipamento novo)", quantidade: 1, valorUnitario: 3999 }] },
  } });
  await prisma.historicoSituacao.createMany({ data: [
    { entidade: "ordem", entidadeId: osUp.id, de: null, para: "Aberta", observacao: "Upgrade iniciado" },
    { entidade: "ordem", entidadeId: osUp.id, de: "Aberta", para: "Concluida", observacao: "Entregue ao cliente" },
  ] });

  const nf = await prisma.notaFiscal.create({ data: {
    numero: 101, serie: 1, tipoNota: "S", naturezaOperacao: "Venda de mercadoria", situacao: 3, descricaoSituacao: "Autorizada",
    clienteId: maria.id, vendedor: "João", chaveAcesso: "3526 1012 3456 7800 0190 5500 1000 0001 0110 0000 0017",
    valorProdutos: 2111, valorFrete: 27, valorNota: 2138,
    itens: { create: [{ descricao: "Forerunner 165 Basic - Branca", unidade: "UN", ncm: "85176272", cfop: "5102", quantidade: 1, valorUnitario: 2111, valorTotal: 2111 }] },
  } });
  await prisma.historicoSituacao.createMany({ data: [
    { entidade: "nota", entidadeId: nf.id, de: null, para: "Pendente", observacao: "Nota criada" },
    { entidade: "nota", entidadeId: nf.id, de: "Pendente", para: "Autorizada", observacao: "Autorizada pela SEFAZ" },
  ] });

  await prisma.garantia.create({ data: {
    protocolo: `G${hoje.getFullYear()}-0001`, clienteNome: "Maria Silva", cpf: "123.456.789-00",
    modelo: "Forerunner 165", serial: "89T0313637", problema: "Tela com falha após atualização", status: "Em analise",
  } });

  console.log("Seed concluído: empresa, 1 termo, 6 produtos, 2 vendedores, 3 clientes, 2 pedidos, 2 OS (reparo+upgrade), 1 nota, 1 garantia.");
}

main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
