import { useState, useMemo, useEffect } from "react";

const PHOTO = {
  carne:    "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80",
  porco:    "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&q=80",
  frango:   "https://images.unsplash.com/photo-1598103442097-8b74394b95c0?w=400&q=80",
  peixe:    "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80",
  vegano:   "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
  bolinho:  "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
  rabada:   "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80",
  costela:  "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80",
  dobradinha:"https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80",
  risoto:   "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=80",
  pastel:   "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
  panqueca: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80",
  angu:     "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80",
  escondidinho: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80",
  charuto:  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
  kafta:    "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&q=80",
  joelho:   "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80",
  lingua:   "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&q=80",
  fondue:   "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=80",
};

const REGION_COLOR = {
  "Barreiro":   "#7d3c98",
  "Centro-Sul": "#1a5276",
  "Leste":      "#c0392b",
  "Nordeste":   "#117a65",
  "Noroeste":   "#d35400",
  "Norte":      "#1e8449",
  "Oeste":      "#8e44ad",
  "Pampulha":   "#2471a3",
  "Venda Nova": "#a04000",
};

const BARS = [
  // BARREIRO
  {id:1,name:"Bar do Bartolomeu",region:"Barreiro",neighborhood:"Santa Helena",address:"Rua Arthur Luchesi, 356",dish:"Trio Mineiro-Bão Di Mais",desc:"Um trio irresistível que celebra a cozinha de Minas: carninha de panela, couve refogada e angu cremoso em perfeita harmonia.",photo:PHOTO.carne},
  {id:2,name:"Espetinho do Boi",region:"Barreiro",neighborhood:"Barreiro",address:"Rua São Paulo da Cruz, 357",dish:"Ora pro Boi",desc:"Cubos de carne bovina grelhados no espeto, servidos com ora-pro-nóbis refogado e farofa crocante.",photo:PHOTO.carne},
  {id:3,name:"Golden Grill",region:"Barreiro",neighborhood:"Milionários",address:"Rua Amílcar Cabral, 515",dish:"Coxa Supreme ao Alho Poró",desc:"Sobrecoxa empanada e dourada, servida sobre cama de alho-poró caramelizado e molho especial da casa.",photo:PHOTO.frango},
  {id:4,name:"Já Tô Inno",region:"Barreiro",neighborhood:"Barreiro",address:"Rua Benjamim Dias, 379",dish:"Trem de Minas",desc:"Clássico mineiro revisitado: costelinha, linguiça, couve e angu juntos num prato que é puro afeto.",photo:PHOTO.porco,champion:true},
  {id:5,name:"Leo da Quadra",region:"Barreiro",neighborhood:"Barreiro",address:"Rua Oliveira Lisboa, 107",dish:"Di Juei",desc:"Corte suíno suculento com mandioca cozida e couve crispy. Simplicidade e sabor de boteco raiz.",photo:PHOTO.porco},
  // CENTRO-SUL
  {id:6,name:"222",region:"Centro-Sul",neighborhood:"Cruzeiro",address:"Rua Francisco Deslandes, 222",dish:"Buraquim Quente",desc:"Minipães de sal com gergelim, recheados com carne de panela e finalizados com queijo canastra e couve crispy.",photo:PHOTO.carne},
  {id:7,name:"Azougue Fogo e Bar",region:"Centro-Sul",neighborhood:"Serra",address:"Rua do Ouro, 835",dish:"On co tô",desc:"Moelinha de frango escondida sob purê de alho-poró e crispy de cebola dourado. Petisco surpreendente.",photo:PHOTO.frango},
  {id:8,name:"Baiúca",region:"Centro-Sul",neighborhood:"Funcionários",address:"Rua Piauí, 1884",dish:"Pastel Pega no Poró",desc:"Pastel de alho-poró com queijo, acompanhado de farofa de couve, costelinha, gremolata e molho de goiaba.",photo:PHOTO.pastel},
  {id:9,name:"Bar Estabelecimento",region:"Centro-Sul",neighborhood:"Serra",address:"Rua Monte Alegre, 160",dish:"Com a Barriga no Fogão",desc:"Barriga de porco de panela cozida, fritas de mandioca e espinafre, farofa de couve e molho especial.",photo:PHOTO.porco},
  {id:10,name:"Bar Mania Mineira",region:"Centro-Sul",neighborhood:"Santo Agostinho",address:"Rua Paracatu, 1099",dish:"Joelho do Vovô Pig",desc:"Joelho de porco com milho assado, polenta cremosa e mostarda refogada. Prato que abraça e aquece.",photo:PHOTO.joelho},
  {id:11,name:"Beco Restaurante",region:"Centro-Sul",neighborhood:"Centro",address:"Rua dos Tamoios, 232",dish:"Verde que te quero rabo!",desc:"Rabada desfiada com cuscuz, vinagrete de alho-poró e creme verde de agrião. Tradição com frescor.",photo:PHOTO.rabada},
  {id:12,name:"Boi Major",region:"Centro-Sul",neighborhood:"São Pedro",address:"Rua Major Lopes, 7",dish:"Nascif Corrêa",desc:"Musseline de couve-flor, ragu de lombo, chucrute de repolho e gergelim, acompanhada de nachos.",photo:PHOTO.carne},
  {id:13,name:"Café Palhares",region:"Centro-Sul",neighborhood:"Centro",address:"Rua dos Tupinambás, 638",dish:"Picadim",desc:"Picadinho de carne bovina, acompanhado de sunomono de talo de couve, torradas e nuvem de queijo parmesão.",photo:PHOTO.carne,champion:true},
  {id:14,name:"Casa da Madrinha",region:"Centro-Sul",neighborhood:"Barro Preto",address:"Av. Barbacena, 212",dish:"Tesouro Escondido",desc:"Croquete de couve-flor, batata e ora-pro-nóbis com proteína de soja. Servido com molho de queijo e chips de batata-doce.",photo:PHOTO.bolinho},
  {id:15,name:"Dona Dora",region:"Centro-Sul",neighborhood:"Centro",address:"Rua Rio de Janeiro, 1205",dish:"Gira Gosto",desc:"Bolinho de espinafre recheado de costelinha e queijo. Acompanha molho de alho e geleia de abacaxi picante.",photo:PHOTO.bolinho},
  {id:16,name:"Espetinho São Pedro Quió",region:"Centro-Sul",neighborhood:"São Pedro",address:"Rua Cristina, 870",dish:"Vulcão Oásis Quió",desc:"Disco de carne recheada com creme de rúcula, guarnecido de polenta mole, molho e mostarda crocante.",photo:PHOTO.carne},
  {id:17,name:"Graffica Bar",region:"Centro-Sul",neighborhood:"Centro",address:"Av. Augusto de Lima, 233",dish:"Bolim com Nóbis",desc:"Bolinho de mandioca com linguiça, acompanhado de molho pesto de ora-pro-nóbis. Criatividade botequeira!",photo:PHOTO.bolinho},
  {id:18,name:"Mamute Bar",region:"Centro-Sul",neighborhood:"Cruzeiro",address:"Rua Brás Cubas, 116",dish:"Prova procê vê, criatura",desc:"Canudo de pastel recheado de rabada e requeijão de raspa com maionese de agrião. Cremoso e irresistível.",photo:PHOTO.pastel},
  {id:19,name:"Pé de Cana",region:"Centro-Sul",neighborhood:"Carmo",address:"Rua Flórida, 15",dish:"Porco na Lama",desc:"Lombo de panela com ora-pro-nóbis, batata e maionese de cebola picante. Sabor de quintal mineiro.",photo:PHOTO.porco},
  {id:20,name:"PoiZé Bar e Petisqueira",region:"Centro-Sul",neighborhood:"Cruzeiro",address:"Rua Pium-I, 686",dish:"Porco Escaldado Popeye",desc:"Cubos de pernil mergulhados num escaldado de farinha de fubá torrada e espinafre refogado.",photo:PHOTO.porco},
  {id:21,name:"Santuário Retrô",region:"Centro-Sul",neighborhood:"Minas Brasil",address:"Av. Padre Vieira, 150",dish:"Du Gibi",desc:"Petisco exclusivo do ex-campeão: sabores nostálgicos da cozinha mineira em releitura contemporânea e criativa.",photo:PHOTO.carne,champion:true},
  {id:22,name:"Via Deslandes",region:"Centro-Sul",neighborhood:"Anchieta",address:"Rua Francisco Deslandes, 10",dish:"Di Joelho",desc:"Joelho de porco defumado com chucrute, maionese de batata e chutney de abacaxi. Agridoce perfeito.",photo:PHOTO.joelho},
  {id:23,name:"Xambar",region:"Centro-Sul",neighborhood:"Centro",address:"Av. Augusto de Lima, 233",dish:"Esconde-Esconde",desc:"Escondidinho de alho-poró recheado com carne de boi desfiada, acompanhado por torradas crocantes.",photo:PHOTO.escondidinho},
  // LESTE
  {id:24,name:"Bar do Nelson",region:"Leste",neighborhood:"Santa Inês",address:"Rua Vicente Risola, 1000",dish:"Brasileirinho",desc:"Sobrecoxa de frango no molho de cebola queimada, acompanhada de angu na cama de mostarda.",photo:PHOTO.frango},
  {id:25,name:"Bar Du Du",region:"Leste",neighborhood:"Esplanada",address:"Rua 28 de Setembro, 229",dish:"Até quem não gosta come",desc:"Couve-flor empanada no queijo parmesão com geleia da casa. A verdura que conquista até os resistentes!",photo:PHOTO.vegano},
  {id:26,name:"Bar Du Magrelo",region:"Leste",neighborhood:"Horto",address:"Rua São Felipe, 21",dish:"Canela Suada",desc:"Ossobuco ao molho, com ora-pro-nóbis refogado no alho e na farinha de milho, cebola-roxa e cheiro-verde.",photo:PHOTO.carne},
  {id:27,name:"Bar e Restaurante do Branco",region:"Leste",neighborhood:"Sagrada Família",address:"Rua Pitangui, 3197",dish:"Bem-casados",desc:"Harmonioso casamento de carnes e verduras que traduz a essência da cozinha de boteco mineiro.",photo:PHOTO.carne},
  {id:28,name:"Bar Temático",region:"Leste",neighborhood:"Santa Tereza",address:"Rua Pirité, 187",dish:"O Segredo da Força do Lampião",desc:"Prato poderoso com carne nordestina encontrando as verduras mineiras: uma fusão de histórias e sabores.",photo:PHOTO.carne},
  {id:29,name:"Cantinho da Baiana",region:"Leste",neighborhood:"São Geraldo",address:"Rua Itaité, 422",dish:"Espírito de Porco",desc:"Corte suíno com molho baiano e toque de verduras frescas. Uma viagem de sabores no coração de BH.",photo:PHOTO.porco},
  {id:30,name:"Casa Mojubá",region:"Leste",neighborhood:"Santa Tereza",address:"Rua Mármore, 817",dish:"Sabor Ancestral",desc:"Charutinho de repolho-roxo recheado com ragu de pernil. Creme de abóbora com glass de bacon e crispy de couve.",photo:PHOTO.charuto},
  {id:31,name:"Cosmos",region:"Leste",neighborhood:"Santa Inês",address:"Rua Vicente Risola, 1305",dish:"Firmamento",desc:"Corte bovino ao molho escuro, acompanhado de purê de couve-flor e crispy de batata. Prato estelar!",photo:PHOTO.carne},
  {id:32,name:"Galpão Flor do Campo",region:"Leste",neighborhood:"Santa Efigênia",address:"Rua Cel. Otávio Diniz, 449",dish:"Espinafrou a Trouxinha",desc:"Trouxinha de espinafre recheada com carne e queijo, finalizada com molho especial da casa.",photo:PHOTO.vegano},
  {id:33,name:"Iracema Bar",region:"Leste",neighborhood:"Santa Tereza",address:"Rua Almandina, 56",dish:"Moela ao molho com Peixinho da Horta pra nadar!",desc:"Moela ao molho encorpado, acompanhada de almeirão refogado (o 'peixinho da horta') e farofa.",photo:PHOTO.frango},
  {id:34,name:"Köbes Emporium Bar",region:"Leste",neighborhood:"Santa Tereza",address:"Rua Prof. Raimundo Nonato, 31",dish:"Prosa Verde e Roxa",desc:"Combinação de vegetais verdes e roxos com proteína em prato que é pura poesia gastronômica.",photo:PHOTO.vegano},
  {id:35,name:"Koqueiros Bar",region:"Leste",neighborhood:"Sagrada Família",address:"Av. Silviano Brandão, 1293",dish:"Kostelinha Tropical",desc:"Costelinha suína com toque tropical de frutas e couve crispy. Sabor que surpreende em cada mordida.",photo:PHOTO.porco},
  {id:36,name:"Locomotivas Bar",region:"Leste",neighborhood:"Santa Inês",address:"Rua Carmésia, 568",dish:"Porkin do Popeye",desc:"Iscas de porco com purê de espinafre e molho especial. Popeye aprovaria cada garfada!",photo:PHOTO.porco},
  {id:37,name:"Oratório Bar",region:"Leste",neighborhood:"Santa Efigênia",address:"Av. Brasil, 161",dish:"Lambuzado",desc:"Costelinha caramelizada com ora-pro-nóbis e crispy de batata-doce. Petisco que deixa os dedos e a alma lambuzados.",photo:PHOTO.porco},
  {id:38,name:"Quitandas da Tia Nice Bar",region:"Leste",neighborhood:"Horto",address:"Rua Alabastro, 146",dish:"Tô Ki",desc:"Petisco criativo com mistura de quitandas mineiras, couve e proteína em apresentação que impressiona.",photo:PHOTO.bolinho},
  {id:39,name:"Santa Boemia",region:"Leste",neighborhood:"Santa Tereza",address:"Rua Mármore, 534",dish:"Mama mia!",desc:"Inspiração italiana com sotaque mineiro: ragu encorpado com verduras frescas sobre base caprichada.",photo:PHOTO.carne},
  // NORDESTE
  {id:40,name:"Bar Bendita Baderna",region:"Nordeste",neighborhood:"União",address:"Rua Silva Fortes, 47",dish:"Bendita Porpeta",desc:"Porpeta de cupim recheada com alho-poró e queijo canastra, ao molho de tomate da casa. Acompanha farofa com ora-pro-nóbis.",photo:PHOTO.carne},
  {id:41,name:"Bar da Gisa",region:"Nordeste",neighborhood:"Fernão Dias",address:"Rua Maria Ferreira da Silva, 367",dish:"Ajoelhou tem que rezar",desc:"Joelho de porco acompanhado de ora-pro-nóbis e polenta frita. Quem prova, ajoelha de satisfação!",photo:PHOTO.joelho},
  {id:42,name:"Bar do Peixinho",region:"Nordeste",neighborhood:"Cachoeirinha",address:"Av. Bernardo de Vasconcelos, 1824",dish:"Tilápia Roletera",desc:"Roletes de filé de tilápia empanado, recheados com mix de rúcula, muçarela e tomate seco. Acompanha molho especial.",photo:PHOTO.peixe},
  {id:43,name:"Camisola Bar",region:"Nordeste",neighborhood:"Cidade Nova",address:"Rua Luther King, 242",dish:"Frango Raiz",desc:"Sobrecoxa ensopada com ora-pro-nóbis e polenta. Receita que remete ao fogão a lenha da vovó.",photo:PHOTO.frango},
  {id:44,name:"Dona Ju Gastro Bar",region:"Nordeste",neighborhood:"Jardim Vitória",address:"Rua dos Borges, 1520",dish:"Coisa de Vó",desc:"Pescoço de boi marinado com couve-flor ao molho branco especial e fios de alho-poró frito.",photo:PHOTO.carne},
  {id:45,name:"Empório Lais",region:"Nordeste",neighborhood:"Cachoeirinha",address:"Rua Olavo Andrade, 195",dish:"Sonho de Salsa",desc:"Bombom salgado com o sabor e o frescor da salsa e molho de alho com beterraba. Uma surpresa deliciosa.",photo:PHOTO.bolinho},
  {id:46,name:"Recanto da Traíra",region:"Nordeste",neighborhood:"União",address:"Rua Alberto Cintra, 47",dish:"Uai, Traíra não Traí!",desc:"Traíra com purê de mandioca e crispy de couve, banana-da-terra e batata chips. Molho melado e de maracujá.",photo:PHOTO.peixe},
  {id:47,name:"Resenha da Naty",region:"Nordeste",neighborhood:"Cachoeirinha",address:"Rua Gonçalves Ledo, 288",dish:"Pode comer que não é pecado",desc:"Maçã de peito cozida com milho-verde e couve crispy com alho. Leveza com muito sabor.",photo:PHOTO.carne},
  {id:48,name:"Spetim",region:"Nordeste",neighborhood:"Silveira",address:"Rua Ilacir Pereira Lima, 518",dish:"Dona Farofa e Sr. Porquinho",desc:"Farofa de espinafre, agrião e alho-poró na manteiga, servida com costelinha caipira pururucada e vinagrete de abacaxi.",photo:PHOTO.porco},
  // NOROESTE
  {id:49,name:"Bar do Bem",region:"Noroeste",neighborhood:"Álvaro Camargos",address:"Rua Vicentina Coutinho Camargos, 100",dish:"Brasileirinho Raiz",desc:"Petisco simples e honesto: corte bovino com verduras da horta e temperos mineiros de raiz.",photo:PHOTO.carne},
  {id:50,name:"Bar do Momô",region:"Noroeste",neighborhood:"Padre Eustáquio",address:"Rua Cel. José Benjamim, 777",dish:"Esfera Suína do Momô",desc:"Bolinha de carne suína recheada com queijo e ervas frescas, servida com molho especial. Pequena e poderosa!",photo:PHOTO.bolinho},
  {id:51,name:"Boteco 86",region:"Noroeste",neighborhood:"Padre Eustáquio",address:"Rua Jacarina, 86",dish:"Trem de Minas",desc:"Clássico mineiro em versão botequeira: carnes, couve e mandioca como Minas manda fazer.",photo:PHOTO.carne},
  {id:52,name:"Cantina Arte Quintal",region:"Noroeste",neighborhood:"Caiçara",address:"Rua Realengo, 150",dish:"Porco Atolado na Lama",desc:"Lombo suíno atolado em mandioca cozida com ora-pro-nóbis e molho encorpado da casa.",photo:PHOTO.porco},
  {id:53,name:"Mulão",region:"Noroeste",neighborhood:"Caiçara",address:"Rua Marambaia, 291",dish:"Botox Mineiro",desc:"Costela bovina com couve-flor gratinada e molho especial. Prato que 'rejuvenesce' de tão bom!",photo:PHOTO.costela},
  {id:54,name:"Santuário Retrô Botequim",region:"Noroeste",neighborhood:"Minas Brasil",address:"Av. Padre Vieira, 150",dish:"Du Gibi",desc:"Ex-campeão de volta ao ringue com petisco nostálgico inspirado nas histórias em quadrinhos e nos sabores de sempre.",photo:PHOTO.carne,champion:true},
  {id:55,name:"Tanganica Art Bar",region:"Noroeste",neighborhood:"Coração Eucarístico",address:"Rua Pe. Demerval Gomes, 380",dish:"Trio Vegano",desc:"Mix vegano com linguiça de espinafre, pastel de ora-pro-nóbis, torresmo de milho e molho de alho. Ex-campeão 2019!",photo:PHOTO.vegano,champion:true},
  {id:56,name:"Toninho – Alto Forno",region:"Noroeste",neighborhood:"Santo André",address:"Rua Miracema, 100",dish:"Pé no Rabo (Homenagem ao Tonhão)",desc:"Homenagem afetiva: pé e rabo de porco ao molho com ora-pro-nóbis, receita que conta uma história de família.",photo:PHOTO.porco},
  // NORTE
  {id:57,name:"Bar do Tião",region:"Norte",neighborhood:"Planalto",address:"Av. Dr. Cristiano Guimarães, 2570",dish:"Tião Véio",desc:"Corte bovino ao molho com verduras da horta, no estilo rústico e saboroso do Tião de sempre.",photo:PHOTO.carne},
  {id:58,name:"Bar Stella",region:"Norte",neighborhood:"Guarani",address:"Av. Saramenha, 1599",dish:"Porco à Mineira",desc:"Lombo suíno ao molho mineiro com couve refogada e mandioca dourada. Clássico que nunca erra.",photo:PHOTO.porco},
  {id:59,name:"Chapa Mágica",region:"Norte",neighborhood:"Guarani",address:"Av. Waldomiro Lobo, 305",dish:"O Giro du Aio Poró!",desc:"Girassol de batatas assadas no azeite de ervas, frango desfiado com bacon, envolto em cream cheese e alho-poró, finalizado com queijo maçaricado.",photo:PHOTO.frango},
  {id:60,name:"Companhia do Dino",region:"Norte",neighborhood:"Floramar",address:"Av. Joaquim Clemente, 682",dish:"Pescoço do Dino",desc:"Pescoço de boi com farofa de alho e brócolis no vapor. Grande e saboroso como um dinossauro!",photo:PHOTO.carne},
  {id:61,name:"Garagge Vintage",region:"Norte",neighborhood:"Planalto",address:"Av. Dr. Cristiano Guimarães, 1258",dish:"Sereia do Bar",desc:"Peixe ao molho especial com verduras da horta, servido em apresentação que encanta os olhos e o paladar.",photo:PHOTO.peixe},
  {id:62,name:"Ivo Grill",region:"Norte",neighborhood:"Planalto",address:"Rua Prof. Tristão da Cunha, 183",dish:"IVOquei o Porco",desc:"Porco ao molho com ervas frescas e crispy de verduras. Um 'ivo' de sabor em cada garfada!",photo:PHOTO.porco},
  {id:63,name:"Parada Do Sabor",region:"Norte",neighborhood:"Planalto",address:"Av. Gen. Carlos Guedes, 346",dish:"Lanche do Popeye",desc:"Lanche caprichado com recheio de espinafre, frango e queijo. Popeye aprovaria com honras!",photo:PHOTO.frango},
  {id:64,name:"Queremos Frango",region:"Norte",neighborhood:"Floramar",address:"Av. Joaquim Clemente, 730",dish:"Sô Forte Uai",desc:"Frango robusto e saboroso com couve e mandioca. Prato forte que mostra toda a força do boteco mineiro.",photo:PHOTO.frango},
  {id:65,name:"Zé Bolacha",region:"Norte",neighborhood:"Vila Clóris",address:"Rua das Melancias, 35",dish:"Menu de Minas",desc:"Um cardápio inteiro em um prato: canjiquinha, pão de queijo, mix de carnes com alho-poró e pesto de espinafre.",photo:PHOTO.carne},
  // OESTE
  {id:66,name:"Bar Bambú",region:"Oeste",neighborhood:"Salgado Filho",address:"Rua Divisa Nova, 670",dish:"Tô com ragu na mão",desc:"Repolho ao creme com ragu de fraldinha. Petisco do ex-campeão 2018 que une tradição e inovação.",photo:PHOTO.carne,champion:true},
  {id:67,name:"Bar da Praça",region:"Oeste",neighborhood:"Calafate",address:"Rua Oeste, 517",dish:"Cadim de Nós",desc:"Bolinho de carne recheado com alho-poró, requeijão e queijo, com farofa de couve com torresmo e molho.",photo:PHOTO.bolinho},
  {id:68,name:"Bar da Silvânia",region:"Oeste",neighborhood:"Camargos",address:"Rua Soares Nogueira, 801",dish:"Tesouro caipira com encanto da horta",desc:"Corte suíno ao molho, creme de mandioca, farofa de couve com bacon e acelga. Tesouro do interior!",photo:PHOTO.porco},
  {id:69,name:"Bar do Kim",region:"Oeste",neighborhood:"Palmeiras",address:"Rua Júlio de Castilho, 1071",dish:"Fraldinha Suprema",desc:"Fraldinha com creme de espinafre, crispy de cebola e geleia de tomate. Prato que conquista pela apresentação e sabor.",photo:PHOTO.carne},
  {id:70,name:"Bar do Primo",region:"Oeste",neighborhood:"Nova Suíssa",address:"Av. Amazonas, 4649",dish:"Maçã de peito à moda do primo",desc:"Maçã de peito com batata-doce e mostarda. Receita de família passada de geração em geração.",photo:PHOTO.carne},
  {id:71,name:"Bar do Regis",region:"Oeste",neighborhood:"Jardim América",address:"Rua Gávea, 422",dish:"Leitão e Eva no Paraíso",desc:"Costelinha suína, polenta com queijo e ora-pro-nóbis. Um paraíso de sabores em cada mordida!",photo:PHOTO.porco},
  {id:72,name:"Bar dos Meninos",region:"Oeste",neighborhood:"Salgado Filho",address:"Rua Lindolfo Deodoro, 503",dish:"A Copa é Nossa",desc:"Copa lombo assado com escarola refogada no alho. Acompanha farofa de soja. Campeão de futebol e de sabor!",photo:PHOTO.porco},
  {id:73,name:"Bar e Restaurante Bom Sabor",region:"Oeste",neighborhood:"Nova Suíssa",address:"Rua Java, 386",dish:"Sabores da Roça",desc:"Suflê de milho-verde recheado com carne cozida, acompanhado de mostarda. Roça servida com elegância.",photo:PHOTO.carne},
  {id:74,name:"Bar Junto Juntinho",region:"Oeste",neighborhood:"Prado",address:"Rua Cura D'Ars, 542",dish:"Marinheiro Popeye",desc:"Panqueca de espinafre recheada com carne bovina e bacon, envolvida em molho e parmesão. Com banana-da-terra!",photo:PHOTO.panqueca},
  {id:75,name:"Barzim dos Amigos",region:"Oeste",neighborhood:"Jardim América",address:"Rua Lindolfo de Azevedo, 1263",dish:"Pé na Roça",desc:"Dobradinha com pé de porco, calabresa, feijão-branco e crispy de couve. Pé firme na tradição!",photo:PHOTO.dobradinha},
  {id:76,name:"Botequim Buritis",region:"Oeste",neighborhood:"Buritis",address:"Rua Vitório Magnavacca, 39",dish:"Boi Bumbá",desc:"Carne de boi cozida ao molho de alho-poró, batata e bacon. Festa de sabores em cada colherada!",photo:PHOTO.carne},
  {id:77,name:"Buteco Tô D'Boa",region:"Oeste",neighborhood:"Jardim Atlântico",address:"Av. Virgílio de Melo Franco, 400",dish:"Escondidão Tô D'Boa",desc:"Pernil cozido com molho, creme de batata com muçarela, couve agridoce. Escondido de bom que é!",photo:PHOTO.escondidinho},
  {id:78,name:"Buteco's Bar",region:"Oeste",neighborhood:"Jardim Atlântico",address:"Rua Ernesto Braga, 2",dish:"Nuhhh!!! de Rocha Véi",desc:"Escondidinho de carne de panela com agrião, coberto de purê de couve-flor e queijo gratinado.",photo:PHOTO.escondidinho},
  {id:79,name:"Butiquim 325",region:"Oeste",neighborhood:"Prado",address:"Av. Francisco Sá, 325",dish:"Quituti Árabe",desc:"Charuto de repolho recheado com arroz e carne moída. Acompanha disco de kafta grelhado e molho.",photo:PHOTO.charuto},
  {id:80,name:"Choperia América Norte Sul",region:"Oeste",neighborhood:"Estrela do Oriente",address:"Rua Chico Rei, 190",dish:"Fondue de Buteco",desc:"Trouxinhas de bacon e lombo recheado com ricota e espinafre, acompanhado de fondue de queijos e abacaxi.",photo:PHOTO.fondue},
  {id:81,name:"Chopp da Esquina",region:"Oeste",neighborhood:"Nova Granada",address:"Rua Garret, 263",dish:"O Sabor na Lata",desc:"Carne de lata suína, acompanhada de molho sugo com almeirão. Sabor de boteco guardado com carinho.",photo:PHOTO.porco},
  {id:82,name:"Comida & Prosa",region:"Oeste",neighborhood:"Prado",address:"Av. Francisco Sá, 306",dish:"Rabada Embriagada",desc:"Rabada ao vinho com agrião e batata. Uma rabada que bebeu bem e ficou mais gostosa ainda!",photo:PHOTO.rabada},
  {id:83,name:"Conectados Bar",region:"Oeste",neighborhood:"Prado",address:"Av. Francisco Sá, 280",dish:"Couve-flor à Cervejeira",desc:"Paleta cozida na cerveja preta com calabresa e champignon, acompanhada de purê de couve-flor cremoso.",photo:PHOTO.porco},
  {id:84,name:"Espettinho.com",region:"Oeste",neighborhood:"Buritis",address:"Rua Eli Seabra Filho, 510",dish:"Moela da Tia",desc:"Moela ao molho de tomate e alho-poró, acompanhada de minipães franceses e cheiro-verde.",photo:PHOTO.frango},
  {id:85,name:"Geraldin da Cida",region:"Oeste",neighborhood:"Grajaú",address:"Rua Contria, 1459",dish:"Costelinha do Papai",desc:"Costelinha suada, farofa de milho com bacon acompanhada de almeirão refogado. Carinho de pai no prato!",photo:PHOTO.porco},
  {id:86,name:"Pé de Goiaba",region:"Oeste",neighborhood:"Nova Suíssa",address:"Av. Amazonas, 4676",dish:"Atolacoxa",desc:"Coxinhas de frango com queijo ao molho de goiabada levemente apimentada. Acompanha creme de rúcula.",photo:PHOTO.frango},
  {id:87,name:"Prado Beer",region:"Oeste",neighborhood:"Prado",address:"Av. Francisco Sá, 590",dish:"Músculo do Popeye",desc:"Músculo com purê de batata ao molho pesto de espinafre. Acompanhado de melado de cana e vitamina do Popeye.",photo:PHOTO.carne},
  {id:88,name:"Quintal do Louzada",region:"Oeste",neighborhood:"Nova Suíssa",address:"Rua Gávea, 358",dish:"Charuteco Caipira",desc:"Charuto de couve recheado com ragu de linguiça, com bolacha de acelga e crispy de alho-poró. Acompanha cachaça da roça!",photo:PHOTO.charuto},
  {id:89,name:"Quioxque Botequim Carioca",region:"Oeste",neighborhood:"Buritis",address:"Rua Henrique Badaró Portugal, 157",dish:"Sou Marinheiro Popeye",desc:"Prexecas de espinafre sob molho pomodoro, gratinadas com queijo e acompanhadas de batatas, bacon e pimenta.",photo:PHOTO.vegano},
  {id:90,name:"Reforma Bar",region:"Oeste",neighborhood:"Nova Suíssa",address:"Rua Joaquim Nabuco, 577",dish:"Maria das Trouxas",desc:"Trouxas de couve recheadas com bacalhau ao molho branco. Encontro da cozinha mineira com o Atlântico.",photo:PHOTO.peixe},
  {id:91,name:"S.O.S Pub",region:"Oeste",neighborhood:"Vista Alegre",address:"Av. Padre José Maurício, 1126",dish:"Boi Enrolado",desc:"Costela de boi com arroz, enrolada no repolho sob molho e coberta com queijo gratinado.",photo:PHOTO.costela},
  {id:92,name:"Us Motoca",region:"Oeste",neighborhood:"Camargos",address:"Rua Blenda, 91",dish:"Risoto Mineiro",desc:"Risoto de canjica com couve, bacon, linguiça e costelinha com mostarda de jabuticaba, servido com crispy de alho-poró e chips de jiló.",photo:PHOTO.risoto,champion:true},
  // PAMPULHA
  {id:93,name:"Alexandre's Bar",region:"Pampulha",neighborhood:"Santa Rosa",address:"Rua David Alves do Vale, 68",dish:"Porco Amostarda",desc:"Costela suína no purê de moranga com tapenade de mostarda. Combinação que amostarda do bom!",photo:PHOTO.porco},
  {id:94,name:"Armazém Santa Amélia",region:"Pampulha",neighborhood:"Santa Amélia",address:"Rua da Sinfonia, 253",dish:"Chucrute de Mineiro",desc:"Vinagrete de repolho, costelão de boi ao molho, batatas-bravas, farofa de bacon e chutney de abacaxi.",photo:PHOTO.carne},
  {id:95,name:"Bar do Dedinho",region:"Pampulha",neighborhood:"Santa Amélia",address:"Av. Guarapari, 872",dish:"Kaftei Vossa Vontade",desc:"Kafta recheada com queijo, acompanha batata da mamãe, salada americana e molhos. Sua vontade, realizada!",photo:PHOTO.kafta},
  {id:96,name:"Bar Pompéu",region:"Pampulha",neighborhood:"Itapoã",address:"Rua São Miguel, 779",dish:"Porquinho Melado",desc:"Costelinha de porco ao melaço de rapadura, acompanhada de purê de batata com cenoura e alho-poró.",photo:PHOTO.porco},
  {id:97,name:"Barrigudinha Buteco",region:"Pampulha",neighborhood:"Alípio de Melo",address:"Av. dos Engenheiros, 1071",dish:"Flor de Minas",desc:"Sobrecoxa desossada e empanada com mix de verduras, acompanhada de molho. Delicada como uma flor!",photo:PHOTO.frango},
  {id:98,name:"Bazin Bar",region:"Pampulha",neighborhood:"Dona Clara",address:"Rua Min. Orozimbo Nonato, 1053",dish:"Conceição",desc:"Blend de carne recheado com queijo ao molho, gratinado, acompanhado de purê de canjica e pesto de couve.",photo:PHOTO.carne},
  {id:99,name:"Bella Bar e Restaurante",region:"Pampulha",neighborhood:"Alípio de Melo",address:"Rua dos Odontólogos, 422",dish:"Bello Murro",desc:"Batatinhas ao murro cobertas com pernil desfiado, repolho roxo e farofa de quiabo com calabresa e passas.",photo:PHOTO.porco},
  {id:100,name:"Buteco do Lili",region:"Pampulha",neighborhood:"Dona Clara",address:"Rua Líbero Badaró, 493",dish:"Sabores de Vó Maria",desc:"Costelinha ao molho com rapadura, acompanhada de canjiquinha cremosa e couve crispy. Abraço de vó!",photo:PHOTO.porco},
  {id:101,name:"Butiquim On Cê Tá?",region:"Pampulha",neighborhood:"Itapoã",address:"Av. Gen. Olímpio Mourão Filho, 754",dish:"Língua Dobrada",desc:"Língua com dobradinha bovina, pele suína e champignon. Acompanha purê de couve-flor cremoso.",photo:PHOTO.lingua},
  {id:102,name:"Cipoeiro Bar",region:"Pampulha",neighborhood:"Castelo",address:"Rua Des. José Satyro, 451",dish:"Linguiça Estourada Cipoeiro",desc:"Linguiça estourada com pimenta-biquinho, angu de milho-verde frito, ora-pro-nóbis e geleia de goiabada.",photo:PHOTO.porco},
  {id:103,name:"Deck Boi na Brasa",region:"Pampulha",neighborhood:"Manacás",address:"Rua Des. José Satyro, 302",dish:"Glu Glu à Baiana",desc:"Pescoço de peru à baiana, com temperos nordestinos encontrando as verduras mineiras em fusão única.",photo:PHOTO.frango},
  {id:104,name:"Espetinho Rei e Família",region:"Pampulha",neighborhood:"Santa Amélia",address:"Av. Guarapari, 1281",dish:"Musconóbis",desc:"Músculo acompanhado de polenta e ora-pro-nóbis. A realeza dos espetinhos com o nobre da horta!",photo:PHOTO.carne},
  {id:105,name:"Juzé Bar",region:"Pampulha",neighborhood:"Jardim Atlântico",address:"Rua Carlos Sá, 180",dish:"Charuto, Fumaça e Farofa",desc:"Charuto de repolho com carne moída no molho, manjericão e farofa de banana-da-terra. Puro teatro gastronômico!",photo:PHOTO.charuto},
  {id:106,name:"Magnífico Quintal",region:"Pampulha",neighborhood:"Santa Amélia",address:"Rua Dr. Jefferson de Oliveira, 56",dish:"Costela na sombra da couve",desc:"Costela assada ao barbecue de goiabada, farofa de couve com bacon finalizada no crispy de couve e aligot de batata.",photo:PHOTO.costela},
  {id:107,name:"Magrelo's Bar",region:"Pampulha",neighborhood:"Serrano",address:"Av. Serrana, 635",dish:"A Vaca no Vinho",desc:"Costela ao vinho com bambá de couve. Quando a vaca bebe vinho, o resultado é puro prazer!",photo:PHOTO.costela},
  {id:108,name:"Mineiros Beer",region:"Pampulha",neighborhood:"Castelo",address:"Rua Romualdo Lopes Cançado, 399",dish:"Talento Mineiro",desc:"Angu, carne de porco braseada e couve refogada no azeite e alho. O talento de Minas em um prato só.",photo:PHOTO.porco},
  {id:109,name:"Nubar",region:"Pampulha",neighborhood:"Alípio de Melo",address:"Av. Dos Engenheiros, 843",dish:"Trem bão de panela",desc:"Maçã de peito cozida com batata, cebola e linguiça, acompanhada de torradas e conserva de acelga.",photo:PHOTO.carne},
  {id:110,name:"Parada 10.95 Bar",region:"Pampulha",neighborhood:"Alípio de Melo",address:"Av. dos Engenheiros, 1095",dish:"Locro por Minas",desc:"Pé e orelha de porco, milho de canjica, galinha e ora-pro-nóbis. Um locro que virou mineiro de coração!",photo:PHOTO.porco},
  {id:111,name:"Planeta Lúpulo",region:"Pampulha",neighborhood:"Santa Amélia",address:"Av. Guarapari, 108",dish:"Catifunda",desc:"Charutos de couve recheados com carne suína, cobertos por molho. Acompanha farofa. Fundão de sabor!",photo:PHOTO.charuto},
  {id:112,name:"Rei da Picanha",region:"Pampulha",neighborhood:"Dona Clara",address:"Av. Sebastião de Brito, 400",dish:"De Picanha com a Vida",desc:"Picanha suína com chutney de tomate picante, batata rústica com pesto de couve e espinafre.",photo:PHOTO.carne},
  {id:113,name:"Rei do Peixe",region:"Pampulha",neighborhood:"Santa Branca",address:"Rua Ramalho Ortigão, 735",dish:"Polpetta do Rei",desc:"Almôndegas de tilápia ao molho de tomate e alho-poró, acompanhadas de torradas. Rei do mar na mesa do boteco!",photo:PHOTO.peixe},
  {id:114,name:"Sant'Esquina Butiquim",region:"Pampulha",neighborhood:"Santa Branca",address:"Rua Ramalho Ortigão, 650",dish:"Atoladinho de boi bebum",desc:"Ragu de lombinho bovino com aligot de mandioca e crispy de couve. Um boi que bebeu e ficou atolado de sabor!",photo:PHOTO.carne},
  {id:115,name:"Sô Bar",region:"Pampulha",neighborhood:"Castelo",address:"Av. Altamiro Avelino Soares, 426",dish:"Só Vem",desc:"Linguiça artesanal recheada com alho-poró, finalizada com queijo derretido. Só vem, que você não vai se arrepender!",photo:PHOTO.porco},
  {id:116,name:"Toca do Ogro",region:"Pampulha",neighborhood:"Pampulha",address:"Rua Prof. Nelson de Sena, 4",dish:"Trio da Roça",desc:"Sambiquira, torresmo e couve-flor à milanesa, acompanhados de creme de alho-poró. Trio poderoso!",photo:PHOTO.porco},
  {id:117,name:"Zoo Bar",region:"Pampulha",neighborhood:"Pampulha",address:"Av. Otacílio Negrão de Lima, 7844",dish:"Porcoró",desc:"Iscas de filé-mignon suíno, acompanhadas de batatas salteadas no creme de alho-poró e farofa.",photo:PHOTO.porco},
  // VENDA NOVA
  {id:118,name:"Andrade's Beer",region:"Venda Nova",neighborhood:"Maria Helena",address:"Rua Dona Geni, 32",dish:"Ossadinha Atolada",desc:"Pescoço de boi com mandioca cozida e agrião, acompanhado de paçoca de carne de sol e torresmo.",photo:PHOTO.carne},
  {id:119,name:"Avalanche Bar e Restaurante",region:"Venda Nova",neighborhood:"São João Batista",address:"Av. Dr. Álvaro Camargos, 1113",dish:"No Peito e na Raiz",desc:"Maçã de peito com couve, acompanhada de purê de mandioca. Força total com raízes bem fincadas em Minas.",photo:PHOTO.carne},
  {id:120,name:"Bar da Cintia",region:"Venda Nova",neighborhood:"São João Batista",address:"Rua Pastor Rui Franco, 257",dish:"Chuleta Descontraída",desc:"Chuleta empanada, molho bechamel com repolho, bacon crispy salpicado, acompanhada de um delicioso melaço agridoce.",photo:PHOTO.porco},
  {id:121,name:"Bar da Fia",region:"Venda Nova",neighborhood:"Santa Mônica",address:"Rua dos Astecas, 2722",dish:"Boca quente, coração mole",desc:"Pernil assado, acompanhado de tomate recheado com pimenta, geleia de maracujá e finalizado com queijo e couve crispy.",photo:PHOTO.porco},
  {id:122,name:"Bar da Lu",region:"Venda Nova",neighborhood:"São João Batista",address:"Rua Geralda Marinho, 41",dish:"Popeye Mineiro",desc:"Parmegiana de alcatra regada com molho, manjericão e muçarela. Acompanhada de molho bechamel de espinafre e torradas.",photo:PHOTO.carne},
  {id:123,name:"Bar do João",region:"Venda Nova",neighborhood:"São João Batista",address:"Rua Geralda Marinho, 117",dish:"Na Boca do Boi",desc:"Língua de boi ao molho de cerveja escura, com agrião e acompanhada de pães artesanais.",photo:PHOTO.lingua},
  {id:124,name:"Dona Suica",region:"Venda Nova",neighborhood:"São João Batista",address:"Av. João Samaham, 390",dish:"Poró de Gala e Costela na Panela",desc:"Costelinha suína servida com purê de batata ao alho-poró e queijo gratinado, acompanhada de barbecue mineiro.",photo:PHOTO.porco},
  {id:125,name:"Espetinho do Tilias",region:"Venda Nova",neighborhood:"Mantiqueira",address:"Praça Manoel Batista Baía, 235",dish:"Vaca Louca na Horta",desc:"Acém com osso, servido com purê de couve-flor, regado com pesto de alho-poró e finalizado com couve crispy. Acompanha torradas.",photo:PHOTO.carne},
  {id:126,name:"Nosso Spetim",region:"Venda Nova",neighborhood:"Santa Mônica",address:"Rua dos Astecas, 3219",dish:"Minas no Prato",desc:"Angu com suã ao molho com bacon e linguiça calabresa, alho-poró e queijo, acompanhado de mostarda refogada e torresmo.",photo:PHOTO.angu},
  {id:127,name:"O Fino do Alho",region:"Venda Nova",neighborhood:"Minascaixa",address:"Rua Capitão Sérgio Pires, 41",dish:"Osôbuco di Suá",desc:"Ossobuco suíno com ora-pro-nóbis na polenta com queijo coalho e cebola mais alho no vinagrete.",photo:PHOTO.porco},
  {id:128,name:"Seu Justino",region:"Venda Nova",neighborhood:"Maria Helena",address:"Rua Dona Conceição Martins, 63",dish:"Rolê do Justino",desc:"Bife de boi à rolê, purê de abóbora com espinafre, acompanhado com caldo da carne e queijo coalho grelhado.",photo:PHOTO.carne},
  {id:129,name:"Sunset Bar",region:"Venda Nova",neighborhood:"Santa Mônica",address:"Rua Érico Veríssimo, 2039",dish:"Costela Véia de Guerra",desc:"Costela de boi com mandioca cozida, almeirão refogado e acompanhada de farofa. Uma guerreira que nunca decepciona.",photo:PHOTO.costela},
];

const REGIONS = ["Todas",...Object.keys(REGION_COLOR)];

function HeartIcon({f}){return(<svg width="17" height="17" viewBox="0 0 24 24" fill={f?"#e74c3c":"none"} stroke={f?"#e74c3c":"#bbb"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>);}
function CheckCircle({d}){return(<svg width="17" height="17" viewBox="0 0 24 24" fill={d?"#27ae60":"none"} stroke={d?"#27ae60":"#bbb"} strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);}

export default function App(){
  const [visited,setVisited]=useState(()=>{try{return new Set(JSON.parse(localStorage.getItem("cdb26v")||"[]"))}catch{return new Set()}});
  const [favorites,setFavorites]=useState(()=>{try{return new Set(JSON.parse(localStorage.getItem("cdb26f")||"[]"))}catch{return new Set()}});
  const [fv,setFv]=useState(false);
  const [ff,setFf]=useState(false);
  const [fr,setFr]=useState("Todas");
  const [q,setQ]=useState("");
  const [exp,setExp]=useState(null);
  const [tab,setTab]=useState("bares");
  const [imgErr,setImgErr]=useState(new Set());

  useEffect(()=>{try{localStorage.setItem("cdb26v",JSON.stringify([...visited]))}catch{}},[visited]);
  useEffect(()=>{try{localStorage.setItem("cdb26f",JSON.stringify([...favorites]))}catch{}},[favorites]);

  const tv=(id)=>setVisited(s=>{const n=new Set(s);n.has(id)?n.delete(id):n.add(id);return n;});
  const tf=(id)=>setFavorites(s=>{const n=new Set(s);n.has(id)?n.delete(id):n.add(id);return n;});

  const filtered=useMemo(()=>BARS.filter(b=>{
    if(fv&&!visited.has(b.id))return false;
    if(ff&&!favorites.has(b.id))return false;
    if(fr!=="Todas"&&b.region!==fr)return false;
    if(q){const lq=q.toLowerCase();if(!b.name.toLowerCase().includes(lq)&&!b.dish.toLowerCase().includes(lq)&&!b.neighborhood.toLowerCase().includes(lq))return false;}
    return true;
  }),[fv,ff,fr,q,visited,favorites]);

  const grouped=useMemo(()=>{const g={};filtered.forEach(b=>{(g[b.region]=g[b.region]||[]).push(b)});return g;},[filtered]);
  const regionKeys=Object.keys(grouped).sort();

  return(
    <div style={{fontFamily:"Georgia,serif",background:"#f7f4ee",minHeight:"100vh"}}>
      <style>{`
        *{box-sizing:border-box}
        .bc{transition:box-shadow .2s,transform .2s}
        .bc:hover{box-shadow:0 8px 28px rgba(0,0,0,0.13)!important;transform:translateY(-2px)}
        .bi{transition:transform .4s}
        .bc:hover .bi{transform:scale(1.05)}
        button{cursor:pointer}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-thumb{background:#c5b899;border-radius:3px}
      `}</style>

      {/* HEADER */}
      <header style={{background:"linear-gradient(155deg,#152b1c 0%,#1e4030 50%,#162a1e 100%)"}}>
        {/* Instagram curator bar */}
        <div style={{background:"rgba(0,0,0,0.3)",padding:"0.5rem 1.5rem",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",fontSize:"0.78rem",fontFamily:"sans-serif",flexWrap:"wrap",textAlign:"center"}}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f4d03f" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          <span style={{color:"#ccc"}}>Curadoria realizada pelo perfil do Instagram</span>
          <a href="https://www.instagram.com/ParticipantesdiButeco" target="_blank" rel="noopener noreferrer" style={{color:"#f4d03f",fontWeight:700,textDecoration:"none",letterSpacing:"0.04em"}}>@ParticipantesdiButeco</a>
          <span style={{color:"#888"}}>— siga para dicas e novidades do concurso!</span>
        </div>

        <div style={{maxWidth:"1200px",margin:"0 auto",padding:"2.2rem 1.5rem 0"}}>
          <div style={{display:"flex",alignItems:"flex-end",gap:"2rem",flexWrap:"wrap"}}>
            <div style={{flex:1}}>
              <div style={{fontFamily:"sans-serif",fontSize:"0.68rem",letterSpacing:"0.3em",textTransform:"uppercase",color:"#80c994",marginBottom:"0.4rem"}}>Belo Horizonte · 10 Abr – 10 Mai 2026</div>
              <h1 style={{fontSize:"clamp(1.9rem,5vw,3.2rem)",fontWeight:700,margin:"0 0 0.2rem",lineHeight:1.05,color:"#fff",letterSpacing:"-0.01em"}}>Comida di Buteco</h1>
              <div style={{fontSize:"1rem",fontStyle:"italic",color:"#b0d8bc",fontWeight:300,marginBottom:"0.8rem"}}>26ª Edição · "Somos Todos Verduras"</div>
              <p style={{fontSize:"0.82rem",color:"#8ec9a0",margin:0,maxWidth:"460px",lineHeight:1.65,fontFamily:"sans-serif"}}>
                128 bares em disputa pelo melhor petisco de BH · Petiscos a R$ 40 · Couve, ora-pro-nóbis e taioba como protagonistas
              </p>
            </div>
            <div style={{display:"flex",gap:"0.7rem",flexShrink:0}}>
              {[{v:BARS.length,l:"Bares"},{v:visited.size,l:"Visitados"},{v:favorites.size,l:"Favoritos"}].map(s=>(
                <div key={s.l} style={{background:"rgba(255,255,255,0.1)",borderRadius:"12px",padding:"0.8rem 1rem",textAlign:"center",minWidth:"72px",backdropFilter:"blur(6px)"}}>
                  <div style={{fontSize:"1.5rem",fontWeight:700,color:"#fff",lineHeight:1}}>{s.v}</div>
                  <div style={{fontSize:"0.65rem",fontFamily:"sans-serif",color:"#80c994",textTransform:"uppercase",letterSpacing:"0.06em",marginTop:"2px"}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Tabs */}
          <div style={{display:"flex",marginTop:"1.5rem"}}>
            {[{k:"bares",l:"🍺  Bares & Pratos"},{k:"mapa",l:"🗺️  Mapa Interativo"}].map(t=>(
              <button key={t.k} onClick={()=>setTab(t.k)} style={{background:"none",border:"none",borderBottom:`3px solid ${tab===t.k?"#f4d03f":"transparent"}`,color:tab===t.k?"#fff":"rgba(255,255,255,0.5)",padding:"0.8rem 1.3rem",fontSize:"0.88rem",fontWeight:tab===t.k?700:400,fontFamily:"sans-serif",transition:"all .15s",letterSpacing:"0.01em"}}>
                {t.l}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MAP TAB */}
      {tab==="mapa"&&(
        <div style={{maxWidth:"1200px",margin:"2rem auto",padding:"0 1.5rem"}}>
          <div style={{background:"#fff",borderRadius:"16px",overflow:"hidden",boxShadow:"0 4px 24px rgba(0,0,0,0.1)",border:"1px solid #e8e0d0"}}>
            <div style={{background:"linear-gradient(90deg,#152b1c,#1e4030)",padding:"1.1rem 1.5rem",display:"flex",alignItems:"center",gap:"10px"}}>
              <span style={{fontSize:"1.3rem"}}>🗺️</span>
              <div>
                <div style={{color:"#fff",fontWeight:700,fontFamily:"sans-serif",fontSize:"1rem"}}>Mapa Personalizado — Comida di Buteco 2026 BH</div>
                <div style={{color:"#80c994",fontSize:"0.73rem",fontFamily:"sans-serif"}}>Todos os bares participantes marcados · Curadoria @ParticipantesdiButeco</div>
              </div>
            </div>
            <div style={{position:"relative",width:"100%",paddingBottom:"56.25%",background:"#f0ebe0"}}>
              <iframe
                src="https://www.google.com/maps/d/u/0/embed?mid=1NKgMtDTJSU2KAuiadQub73yXZ4nEJLU&ehbc=2E312F&noprof=1"
                style={{position:"absolute",inset:0,width:"100%",height:"100%",border:"none"}}
                title="Mapa Comida di Buteco 2026 BH"
                allowFullScreen
              />
            </div>
            <div style={{padding:"0.85rem 1.5rem",background:"#f9f6f0",borderTop:"1px solid #e8e0d0",display:"flex",alignItems:"center",gap:"8px"}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a472a" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              <span style={{fontSize:"0.78rem",color:"#666",fontFamily:"sans-serif"}}>
                Mapa criado por <a href="https://www.instagram.com/ParticipantesdiButeco" target="_blank" rel="noopener noreferrer" style={{color:"#1a472a",fontWeight:700,textDecoration:"none"}}>@ParticipantesdiButeco</a> · Siga para atualizações e dicas do concurso
              </span>
            </div>
          </div>
        </div>
      )}

      {/* BARS TAB */}
      {tab==="bares"&&(
        <>
          {/* Sticky filters */}
          <div style={{background:"#fff",borderBottom:"1px solid #e8e0d0",position:"sticky",top:0,zIndex:20,boxShadow:"0 2px 10px rgba(0,0,0,0.06)"}}>
            <div style={{maxWidth:"1200px",margin:"0 auto",padding:"0.8rem 1.5rem",display:"flex",gap:"0.55rem",alignItems:"center",flexWrap:"wrap"}}>
              <div style={{flex:"1 1 180px",position:"relative"}}>
                <span style={{position:"absolute",left:"9px",top:"50%",transform:"translateY(-50%)",fontSize:"13px",color:"#aaa"}}>🔍</span>
                <input type="text" placeholder="Bar, prato ou bairro..." value={q} onChange={e=>setQ(e.target.value)}
                  style={{width:"100%",padding:"0.48rem 0.75rem 0.48rem 1.9rem",border:"1.5px solid #ddd",borderRadius:"8px",fontSize:"0.83rem",background:"#faf8f3",color:"#333",outline:"none"}}/>
              </div>
              <select value={fr} onChange={e=>setFr(e.target.value)}
                style={{padding:"0.48rem 0.7rem",border:"1.5px solid #ddd",borderRadius:"8px",background:fr!=="Todas"?"#eafaf1":"#faf8f3",fontSize:"0.83rem",color:fr!=="Todas"?"#1a472a":"#555",outline:"none",fontWeight:fr!=="Todas"?700:400}}>
                {REGIONS.map(r=><option key={r}>{r}</option>)}
              </select>
              <button onClick={()=>setFv(v=>!v)} style={{padding:"0.45rem 0.9rem",borderRadius:"20px",border:`2px solid ${fv?"#27ae60":"#ddd"}`,background:fv?"#eafaf1":"#fff",color:fv?"#1a5c30":"#666",fontSize:"0.8rem",fontWeight:600,display:"flex",alignItems:"center",gap:"4px",fontFamily:"sans-serif"}}>
                <CheckCircle d={fv}/> Visitados
              </button>
              <button onClick={()=>setFf(v=>!v)} style={{padding:"0.45rem 0.9rem",borderRadius:"20px",border:`2px solid ${ff?"#e74c3c":"#ddd"}`,background:ff?"#fdf0ed":"#fff",color:ff?"#c0392b":"#666",fontSize:"0.8rem",fontWeight:600,display:"flex",alignItems:"center",gap:"4px",fontFamily:"sans-serif"}}>
                <HeartIcon f={ff}/> Favoritos
              </button>
              {(fv||ff||fr!=="Todas"||q)&&(
                <button onClick={()=>{setFv(false);setFf(false);setFr("Todas");setQ("")}} style={{padding:"0.45rem 0.85rem",borderRadius:"20px",border:"1px solid #ccc",background:"#fff",color:"#888",fontSize:"0.78rem",fontFamily:"sans-serif"}}>✕ Limpar</button>
              )}
              <div style={{marginLeft:"auto",fontSize:"0.75rem",color:"#aaa",fontFamily:"sans-serif",whiteSpace:"nowrap"}}>{filtered.length} / {BARS.length}</div>
            </div>
          </div>

          {/* Map CTA banner */}
          <div style={{maxWidth:"1200px",margin:"1.5rem auto 0",padding:"0 1.5rem"}}>
            <div onClick={()=>setTab("mapa")} style={{background:"linear-gradient(90deg,#152b1c,#1e4030)",borderRadius:"12px",padding:"0.85rem 1.4rem",display:"flex",alignItems:"center",gap:"12px",cursor:"pointer",boxShadow:"0 2px 12px rgba(20,60,32,0.2)"}}>
              <span style={{fontSize:"1.4rem"}}>🗺️</span>
              <div>
                <div style={{color:"#fff",fontWeight:700,fontFamily:"sans-serif",fontSize:"0.92rem"}}>Ver Mapa Interativo dos Bares</div>
                <div style={{color:"#80c994",fontSize:"0.73rem",fontFamily:"sans-serif"}}>Todos os bares marcados no mapa personalizado · Curadoria @ParticipantesdiButeco</div>
              </div>
              <span style={{marginLeft:"auto",color:"#f4d03f",fontSize:"1.2rem"}}>→</span>
            </div>
          </div>

          <main style={{maxWidth:"1200px",margin:"0 auto",padding:"1.5rem 1.5rem 3rem"}}>
            {filtered.length===0?(
              <div style={{textAlign:"center",padding:"5rem 2rem",color:"#888"}}>
                <div style={{fontSize:"3rem",marginBottom:"1rem"}}>🔍</div>
                <p style={{fontFamily:"sans-serif"}}>Nenhum bar encontrado com esses filtros.</p>
                <button onClick={()=>{setFv(false);setFf(false);setFr("Todas");setQ("")}} style={{marginTop:"1rem",padding:"0.5rem 1.5rem",background:"#1a472a",color:"#fff",border:"none",borderRadius:"8px",fontFamily:"sans-serif"}}>Limpar filtros</button>
              </div>
            ):(
              fr!=="Todas"?(
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(265px,1fr))",gap:"1.2rem"}}>
                  {filtered.map(b=><Card key={b.id} b={b} visited={visited} favorites={favorites} tv={tv} tf={tf} exp={exp} setExp={setExp} imgErr={imgErr} setImgErr={setImgErr}/>)}
                </div>
              ):(
                regionKeys.map(region=>(
                  <section key={region} style={{marginBottom:"2.5rem"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"1rem",paddingBottom:"0.5rem",borderBottom:`2px solid ${REGION_COLOR[region]}25`}}>
                      <div style={{width:"4px",height:"26px",background:REGION_COLOR[region],borderRadius:"2px"}}/>
                      <h2 style={{margin:0,fontSize:"1.1rem",fontWeight:700,color:REGION_COLOR[region],fontFamily:"sans-serif",letterSpacing:"0.01em"}}>{region}</h2>
                      <span style={{background:REGION_COLOR[region]+"18",color:REGION_COLOR[region],borderRadius:"20px",padding:"2px 10px",fontSize:"0.72rem",fontFamily:"sans-serif",fontWeight:700}}>{grouped[region].length} bares</span>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(265px,1fr))",gap:"1.1rem"}}>
                      {grouped[region].map(b=><Card key={b.id} b={b} visited={visited} favorites={favorites} tv={tv} tf={tf} exp={exp} setExp={setExp} imgErr={imgErr} setImgErr={setImgErr}/>)}
                    </div>
                  </section>
                ))
              )
            )}
          </main>
        </>
      )}

      <footer style={{background:"#152b1c",color:"#80c994",padding:"1.8rem 1.5rem",textAlign:"center"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"7px",marginBottom:"0.4rem"}}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f4d03f" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          <span style={{fontFamily:"sans-serif",fontSize:"0.83rem"}}>Curadoria: <a href="https://www.instagram.com/ParticipantesdiButeco" target="_blank" rel="noopener noreferrer" style={{color:"#f4d03f",fontWeight:700,textDecoration:"none"}}>@ParticipantesdiButeco</a></span>
        </div>
        <p style={{margin:0,fontSize:"0.73rem",opacity:0.5,fontFamily:"sans-serif"}}>Comida di Buteco 2026 · 26ª Edição · Belo Horizonte · 10 abr – 10 mai · Petiscos a R$ 40</p>
      </footer>
    </div>
  );
}

function Card({b,visited,favorites,tv,tf,exp,setExp,imgErr,setImgErr}){
  const isV=visited.has(b.id),isF=favorites.has(b.id),isE=exp===b.id;
  const rc=REGION_COLOR[b.region]||"#555";
  const hasErr=imgErr.has(b.id);
  return(
    <article className="bc" style={{background:"#fff",borderRadius:"14px",border:`2px solid ${isF?"#e74c3c":isV?"#27ae60":"#e8e0d0"}`,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.06)",position:"relative"}}>
      <div style={{height:"4px",background:rc}}/>
      <div style={{overflow:"hidden",height:"185px",position:"relative",background:rc+"11",cursor:"pointer"}} onClick={()=>setExp(isE?null:b.id)}>
        {!hasErr?(
          <img className="bi" src={b.photo} alt={b.dish} style={{width:"100%",height:"185px",objectFit:"cover",display:"block"}} onError={()=>setImgErr(s=>new Set([...s,b.id]))}/>
        ):(
          <div style={{height:"185px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2.8rem",background:`linear-gradient(135deg,${rc}18,${rc}33)`}}>🍽️</div>
        )}
        {b.champion&&<div style={{position:"absolute",top:8,right:8,background:"rgba(243,156,18,0.9)",borderRadius:"6px",padding:"3px 8px",fontSize:"0.65rem",fontFamily:"sans-serif",fontWeight:700,color:"#fff"}}>🏆 Ex-campeão</div>}
        {isV&&<div style={{position:"absolute",top:8,left:8,background:"rgba(39,174,96,0.9)",borderRadius:"6px",padding:"3px 8px",fontSize:"0.65rem",fontFamily:"sans-serif",fontWeight:700,color:"#fff"}}>✓ Visitado</div>}
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:"45px",background:"linear-gradient(transparent,rgba(0,0,0,0.3))",pointerEvents:"none"}}/>
      </div>
      <div style={{padding:"0.9rem 1rem 0.75rem"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div style={{flex:1,minWidth:0}}>
            <h3 style={{margin:"0 0 2px",fontSize:"0.93rem",fontWeight:700,color:"#1a2e1a",fontFamily:"sans-serif",lineHeight:1.2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.name}</h3>
            <div style={{fontSize:"0.68rem",color:"#aaa",fontFamily:"sans-serif"}}>{b.neighborhood} · <span style={{color:rc,fontWeight:600}}>{b.region}</span></div>
          </div>
          <div style={{display:"flex",gap:"2px",flexShrink:0,marginLeft:"6px"}}>
            <button onClick={()=>tf(b.id)} style={{background:"none",border:"none",padding:"4px",display:"flex"}}><HeartIcon f={isF}/></button>
            <button onClick={()=>tv(b.id)} style={{background:"none",border:"none",padding:"4px",display:"flex"}}><CheckCircle d={isV}/></button>
          </div>
        </div>
        <div style={{background:rc+"12",border:`1px solid ${rc}22`,borderRadius:"7px",padding:"0.42rem 0.7rem",margin:"0.55rem 0"}}>
          <div style={{fontSize:"0.58rem",fontFamily:"sans-serif",color:"#aaa",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"1px"}}>Petisco</div>
          <div style={{fontSize:"0.83rem",fontWeight:700,color:rc,fontFamily:"sans-serif",lineHeight:1.2}}>{b.dish}</div>
        </div>
        <p style={{fontSize:"0.76rem",color:"#555",lineHeight:1.55,margin:"0 0 0.4rem",fontWeight:300}}>
          {isE?b.desc:b.desc.slice(0,88)+(b.desc.length>88?"…":"")}
        </p>
        {isE&&<div style={{fontSize:"0.68rem",color:"#aaa",fontFamily:"sans-serif",display:"flex",gap:"4px",marginBottom:"0.35rem"}}><span>📍</span><span>{b.address} – {b.neighborhood}, BH</span></div>}
        <button onClick={()=>setExp(isE?null:b.id)} style={{background:"none",border:"none",color:rc,fontSize:"0.72rem",padding:"0",fontWeight:700,textDecoration:"underline",textUnderlineOffset:"2px",fontFamily:"sans-serif"}}>
          {isE?"Menos ↑":"Mais ↓"}
        </button>
      </div>
    </article>
  );
}
