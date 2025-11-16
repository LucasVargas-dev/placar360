import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🇧🇷 Starting Brazilian states and cities seeding...');

  // Brazilian states with regions
  const states = [
    // Região Norte
    { name: 'Acre', uf: 'AC', region: 'Norte' },
    { name: 'Amapá', uf: 'AP', region: 'Norte' },
    { name: 'Amazonas', uf: 'AM', region: 'Norte' },
    { name: 'Pará', uf: 'PA', region: 'Norte' },
    { name: 'Rondônia', uf: 'RO', region: 'Norte' },
    { name: 'Roraima', uf: 'RR', region: 'Norte' },
    { name: 'Tocantins', uf: 'TO', region: 'Norte' },

    // Região Nordeste
    { name: 'Alagoas', uf: 'AL', region: 'Nordeste' },
    { name: 'Bahia', uf: 'BA', region: 'Nordeste' },
    { name: 'Ceará', uf: 'CE', region: 'Nordeste' },
    { name: 'Maranhão', uf: 'MA', region: 'Nordeste' },
    { name: 'Paraíba', uf: 'PB', region: 'Nordeste' },
    { name: 'Pernambuco', uf: 'PE', region: 'Nordeste' },
    { name: 'Piauí', uf: 'PI', region: 'Nordeste' },
    { name: 'Rio Grande do Norte', uf: 'RN', region: 'Nordeste' },
    { name: 'Sergipe', uf: 'SE', region: 'Nordeste' },

    // Região Centro-Oeste
    { name: 'Distrito Federal', uf: 'DF', region: 'Centro-Oeste' },
    { name: 'Goiás', uf: 'GO', region: 'Centro-Oeste' },
    { name: 'Mato Grosso', uf: 'MT', region: 'Centro-Oeste' },
    { name: 'Mato Grosso do Sul', uf: 'MS', region: 'Centro-Oeste' },

    // Região Sudeste
    { name: 'Espírito Santo', uf: 'ES', region: 'Sudeste' },
    { name: 'Minas Gerais', uf: 'MG', region: 'Sudeste' },
    { name: 'Rio de Janeiro', uf: 'RJ', region: 'Sudeste' },
    { name: 'São Paulo', uf: 'SP', region: 'Sudeste' },

    // Região Sul
    { name: 'Paraná', uf: 'PR', region: 'Sul' },
    { name: 'Rio Grande do Sul', uf: 'RS', region: 'Sul' },
    { name: 'Santa Catarina', uf: 'SC', region: 'Sul' },
  ];

  console.log('🏛️ Creating states...');
  for (const stateData of states) {
    await prisma.state.upsert({
      where: { uf: stateData.uf },
      update: {},
      create: stateData,
    });
  }

  // Get all states for city creation
  const allStates = await prisma.state.findMany();

  // Major Brazilian cities by state
  const citiesData = [
    // São Paulo
    { name: 'São Paulo', stateUf: 'SP', ibgeCode: '3550308' },
    { name: 'Guarulhos', stateUf: 'SP', ibgeCode: '3518800' },
    { name: 'Campinas', stateUf: 'SP', ibgeCode: '3509502' },
    { name: 'São Bernardo do Campo', stateUf: 'SP', ibgeCode: '3548708' },
    { name: 'Santo André', stateUf: 'SP', ibgeCode: '3547809' },
    { name: 'Osasco', stateUf: 'SP', ibgeCode: '3534401' },
    { name: 'Ribeirão Preto', stateUf: 'SP', ibgeCode: '3543402' },
    { name: 'Sorocaba', stateUf: 'SP', ibgeCode: '3552205' },
    { name: 'Mauá', stateUf: 'SP', ibgeCode: '3529006' },
    { name: 'São José dos Campos', stateUf: 'SP', ibgeCode: '3550209' },

    // Rio de Janeiro
    { name: 'Rio de Janeiro', stateUf: 'RJ', ibgeCode: '3304557' },
    { name: 'São Gonçalo', stateUf: 'RJ', ibgeCode: '3304904' },
    { name: 'Duque de Caxias', stateUf: 'RJ', ibgeCode: '3301702' },
    { name: 'Nova Iguaçu', stateUf: 'RJ', ibgeCode: '3303500' },
    { name: 'Niterói', stateUf: 'RJ', ibgeCode: '3303302' },
    { name: 'Belford Roxo', stateUf: 'RJ', ibgeCode: '3300456' },
    { name: 'São João de Meriti', stateUf: 'RJ', ibgeCode: '3305109' },
    { name: 'Campos dos Goytacazes', stateUf: 'RJ', ibgeCode: '3301009' },
    { name: 'Petrópolis', stateUf: 'RJ', ibgeCode: '3303906' },
    { name: 'Volta Redonda', stateUf: 'RJ', ibgeCode: '3306305' },

    // Minas Gerais
    { name: 'Belo Horizonte', stateUf: 'MG', ibgeCode: '3106200' },
    { name: 'Uberlândia', stateUf: 'MG', ibgeCode: '3170206' },
    { name: 'Contagem', stateUf: 'MG', ibgeCode: '3118601' },
    { name: 'Juiz de Fora', stateUf: 'MG', ibgeCode: '3136702' },
    { name: 'Betim', stateUf: 'MG', ibgeCode: '3106705' },
    { name: 'Montes Claros', stateUf: 'MG', ibgeCode: '3143302' },
    { name: 'Ribeirão das Neves', stateUf: 'MG', ibgeCode: '3154606' },
    { name: 'Uberaba', stateUf: 'MG', ibgeCode: '3170107' },
    { name: 'Governador Valadares', stateUf: 'MG', ibgeCode: '3127701' },
    { name: 'Ipatinga', stateUf: 'MG', ibgeCode: '3131307' },

    // Bahia
    { name: 'Salvador', stateUf: 'BA', ibgeCode: '2927408' },
    { name: 'Feira de Santana', stateUf: 'BA', ibgeCode: '2910800' },
    { name: 'Vitória da Conquista', stateUf: 'BA', ibgeCode: '2933307' },
    { name: 'Camaçari', stateUf: 'BA', ibgeCode: '2910109' },
    { name: 'Juazeiro', stateUf: 'BA', ibgeCode: '2918407' },
    { name: 'Ilhéus', stateUf: 'BA', ibgeCode: '2913606' },
    { name: 'Itabuna', stateUf: 'BA', ibgeCode: '2914802' },
    { name: 'Lauro de Freitas', stateUf: 'BA', ibgeCode: '2919207' },
    { name: 'Jequié', stateUf: 'BA', ibgeCode: '2918001' },
    { name: 'Teixeira de Freitas', stateUf: 'BA', ibgeCode: '2931350' },

    // Paraná
    { name: 'Curitiba', stateUf: 'PR', ibgeCode: '4106902' },
    { name: 'Londrina', stateUf: 'PR', ibgeCode: '4113700' },
    { name: 'Maringá', stateUf: 'PR', ibgeCode: '4115200' },
    { name: 'Ponta Grossa', stateUf: 'PR', ibgeCode: '4119905' },
    { name: 'Cascavel', stateUf: 'PR', ibgeCode: '4104808' },
    { name: 'São José dos Pinhais', stateUf: 'PR', ibgeCode: '4125506' },
    { name: 'Foz do Iguaçu', stateUf: 'PR', ibgeCode: '4108304' },
    { name: 'Colombo', stateUf: 'PR', ibgeCode: '4105805' },
    { name: 'Guarapuava', stateUf: 'PR', ibgeCode: '4109401' },
    { name: 'Paranaguá', stateUf: 'PR', ibgeCode: '4118204' },

    // Rio Grande do Sul
    { name: 'Porto Alegre', stateUf: 'RS', ibgeCode: '4314902' },
    { name: 'Caxias do Sul', stateUf: 'RS', ibgeCode: '4305108' },
    { name: 'Pelotas', stateUf: 'RS', ibgeCode: '4314407' },
    { name: 'Canoas', stateUf: 'RS', ibgeCode: '4304606' },
    { name: 'Santa Maria', stateUf: 'RS', ibgeCode: '4316907' },
    { name: 'Gravataí', stateUf: 'RS', ibgeCode: '4309209' },
    { name: 'Viamão', stateUf: 'RS', ibgeCode: '4323002' },
    { name: 'Novo Hamburgo', stateUf: 'RS', ibgeCode: '4313409' },
    { name: 'São Leopoldo', stateUf: 'RS', ibgeCode: '4318705' },
    { name: 'Rio Grande', stateUf: 'RS', ibgeCode: '4315602' },

    // Pernambuco
    { name: 'Recife', stateUf: 'PE', ibgeCode: '2611606' },
    { name: 'Jaboatão dos Guararapes', stateUf: 'PE', ibgeCode: '2607901' },
    { name: 'Olinda', stateUf: 'PE', ibgeCode: '2609600' },
    { name: 'Caruaru', stateUf: 'PE', ibgeCode: '2604106' },
    { name: 'Petrolina', stateUf: 'PE', ibgeCode: '2611101' },
    { name: 'Paulista', stateUf: 'PE', ibgeCode: '2610707' },
    { name: 'Cabo de Santo Agostinho', stateUf: 'PE', ibgeCode: '2602902' },
    { name: 'Camaragibe', stateUf: 'PE', ibgeCode: '2603454' },
    { name: 'Garanhuns', stateUf: 'PE', ibgeCode: '2606002' },
    { name: 'Vitória de Santo Antão', stateUf: 'PE', ibgeCode: '2616407' },

    // Ceará
    { name: 'Fortaleza', stateUf: 'CE', ibgeCode: '2304400' },
    { name: 'Caucaia', stateUf: 'CE', ibgeCode: '2303709' },
    { name: 'Juazeiro do Norte', stateUf: 'CE', ibgeCode: '2307650' },
    { name: 'Maracanaú', stateUf: 'CE', ibgeCode: '2307700' },
    { name: 'Sobral', stateUf: 'CE', ibgeCode: '2312908' },
    { name: 'Crato', stateUf: 'CE', ibgeCode: '2304202' },
    { name: 'Itapipoca', stateUf: 'CE', ibgeCode: '2306405' },
    { name: 'Maranguape', stateUf: 'CE', ibgeCode: '2307700' },
    { name: 'Iguatu', stateUf: 'CE', ibgeCode: '2305506' },
    { name: 'Quixadá', stateUf: 'CE', ibgeCode: '2311306' },

    // Pará
    { name: 'Belém', stateUf: 'PA', ibgeCode: '1501402' },
    { name: 'Ananindeua', stateUf: 'PA', ibgeCode: '1500800' },
    { name: 'Santarém', stateUf: 'PA', ibgeCode: '1506807' },
    { name: 'Marabá', stateUf: 'PA', ibgeCode: '1504208' },
    { name: 'Parauapebas', stateUf: 'PA', ibgeCode: '1505494' },
    { name: 'Castanhal', stateUf: 'PA', ibgeCode: '1502400' },
    { name: 'Abaetetuba', stateUf: 'PA', ibgeCode: '1500107' },
    { name: 'Itaituba', stateUf: 'PA', ibgeCode: '1503606' },
    { name: 'Bragança', stateUf: 'PA', ibgeCode: '1501709' },
    { name: 'Altamira', stateUf: 'PA', ibgeCode: '1500602' },

    // Goiás
    { name: 'Goiânia', stateUf: 'GO', ibgeCode: '5208707' },
    { name: 'Aparecida de Goiânia', stateUf: 'GO', ibgeCode: '5201405' },
    { name: 'Anápolis', stateUf: 'GO', ibgeCode: '5201108' },
    { name: 'Rio Verde', stateUf: 'GO', ibgeCode: '5218805' },
    { name: 'Luziânia', stateUf: 'GO', ibgeCode: '5212501' },
    { name: 'Águas Lindas de Goiás', stateUf: 'GO', ibgeCode: '5200258' },
    { name: 'Valparaíso de Goiás', stateUf: 'GO', ibgeCode: '5221858' },
    { name: 'Trindade', stateUf: 'GO', ibgeCode: '5221403' },
    { name: 'Formosa', stateUf: 'GO', ibgeCode: '5208004' },
    { name: 'Novo Gama', stateUf: 'GO', ibgeCode: '5215231' },

    // Maranhão
    { name: 'São Luís', stateUf: 'MA', ibgeCode: '2111300' },
    { name: 'Imperatriz', stateUf: 'MA', ibgeCode: '2105302' },
    { name: 'São José de Ribamar', stateUf: 'MA', ibgeCode: '2111201' },
    { name: 'Timon', stateUf: 'MA', ibgeCode: '2112209' },
    { name: 'Caxias', stateUf: 'MA', ibgeCode: '2103000' },
    { name: 'Codó', stateUf: 'MA', ibgeCode: '2103307' },
    { name: 'Paço do Lumiar', stateUf: 'MA', ibgeCode: '2107506' },
    { name: 'Açailândia', stateUf: 'MA', ibgeCode: '2100055' },
    { name: 'Bacabal', stateUf: 'MA', ibgeCode: '2101202' },
    { name: 'Balsas', stateUf: 'MA', ibgeCode: '2101400' },

    // Espírito Santo
    { name: 'Vitória', stateUf: 'ES', ibgeCode: '3205309' },
    { name: 'Vila Velha', stateUf: 'ES', ibgeCode: '3205200' },
    { name: 'Cariacica', stateUf: 'ES', ibgeCode: '3201308' },
    { name: 'Serra', stateUf: 'ES', ibgeCode: '3205002' },
    { name: 'Cachoeiro de Itapemirim', stateUf: 'ES', ibgeCode: '3201209' },
    { name: 'Linhares', stateUf: 'ES', ibgeCode: '3203205' },
    { name: 'São Mateus', stateUf: 'ES', ibgeCode: '3204906' },
    { name: 'Colatina', stateUf: 'ES', ibgeCode: '3201506' },
    { name: 'Guarapari', stateUf: 'ES', ibgeCode: '3202405' },
    { name: 'Aracruz', stateUf: 'ES', ibgeCode: '3200607' },

    // Santa Catarina
    { name: 'Florianópolis', stateUf: 'SC', ibgeCode: '4205407' },
    { name: 'Joinville', stateUf: 'SC', ibgeCode: '4209102' },
    { name: 'Blumenau', stateUf: 'SC', ibgeCode: '4202404' },
    { name: 'São José', stateUf: 'SC', ibgeCode: '4216602' },
    { name: 'Criciúma', stateUf: 'SC', ibgeCode: '4204608' },
    { name: 'Chapecó', stateUf: 'SC', ibgeCode: '4204202' },
    { name: 'Itajaí', stateUf: 'SC', ibgeCode: '4208203' },
    { name: 'Lages', stateUf: 'SC', ibgeCode: '4209102' },
    { name: 'Jaraguá do Sul', stateUf: 'SC', ibgeCode: '4208906' },
    { name: 'Palhoça', stateUf: 'SC', ibgeCode: '4211900' },

    // Mato Grosso
    { name: 'Cuiabá', stateUf: 'MT', ibgeCode: '5103403' },
    { name: 'Várzea Grande', stateUf: 'MT', ibgeCode: '5108402' },
    { name: 'Rondonópolis', stateUf: 'MT', ibgeCode: '5107602' },
    { name: 'Sinop', stateUf: 'MT', ibgeCode: '5107909' },
    { name: 'Tangará da Serra', stateUf: 'MT', ibgeCode: '5107958' },
    { name: 'Cáceres', stateUf: 'MT', ibgeCode: '5102504' },
    { name: 'Sorriso', stateUf: 'MT', ibgeCode: '5107925' },
    { name: 'Lucas do Rio Verde', stateUf: 'MT', ibgeCode: '5105259' },
    { name: 'Barra do Garças', stateUf: 'MT', ibgeCode: '5101704' },
    { name: 'Primavera do Leste', stateUf: 'MT', ibgeCode: '5107040' },

    // Mato Grosso do Sul
    { name: 'Campo Grande', stateUf: 'MS', ibgeCode: '5002704' },
    { name: 'Dourados', stateUf: 'MS', ibgeCode: '5003702' },
    { name: 'Três Lagoas', stateUf: 'MS', ibgeCode: '5008305' },
    { name: 'Corumbá', stateUf: 'MS', ibgeCode: '5003207' },
    { name: 'Ponta Porã', stateUf: 'MS', ibgeCode: '5006606' },
    { name: 'Naviraí', stateUf: 'MS', ibgeCode: '5006002' },
    { name: 'Nova Andradina', stateUf: 'MS', ibgeCode: '5006200' },
    { name: 'Aquidauana', stateUf: 'MS', ibgeCode: '5001102' },
    { name: 'Paranaíba', stateUf: 'MS', ibgeCode: '5006309' },
    { name: 'Maracaju', stateUf: 'MS', ibgeCode: '5005400' },

    // Distrito Federal
    { name: 'Brasília', stateUf: 'DF', ibgeCode: '5300108' },
  ];

  console.log('🏙️ Creating cities...');
  for (const cityData of citiesData) {
    const state = allStates.find(s => s.uf === cityData.stateUf);
    if (state) {
      await prisma.city.upsert({
        where: {
          name_stateId: {
            name: cityData.name,
            stateId: state.id,
          },
        },
        update: {},
        create: {
          name: cityData.name,
          stateId: state.id,
          ibgeCode: cityData.ibgeCode,
        },
      });
    }
  }

  console.log('✅ Brazilian states and cities seeding completed successfully!');
  console.log(`📊 Created ${states.length} states and ${citiesData.length} cities`);
}

main()
  .catch((e) => {
    console.error('❌ Error during Brazilian seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
