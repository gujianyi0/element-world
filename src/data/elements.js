// 元素数据配置
// 每个元素的信息结构：
// - id: 用于路由
// - nameZh/nameEn: 中英文名
// - symbol: 化学符号
// - atomicNumber: 原子序数
// - modelFile: 3D模型文件名（放在 public/models/ 下，本地开发用）
// - modelUrl: 3D模型远程URL（Cloudflare R2，生产环境用）
// - modelFormat: 'fbx' | 'glb' | 'gltf'
// - thumbnailZh/thumbnailEn: 中英文缩略图（可选，若无则显示占位符）
// - basicInfo: 基本介绍
// - existence: 存在与作用
// - personality: 性格设定（拟人化）
// - funFact: 有趣小知识
// - commonForm: 常见存在形式
// - physicalProperties: 物理性质
// - color: 主题色（用于卡片背景）

const elements = [
  {
    id: 'silicon',
    nameZh: '硅',
    nameEn: 'Silicon',
    symbol: 'Si',
    atomicNumber: 14,
    modelFile: 'silicon.glb',
    modelFormat: 'glb',
    thumbnailZh: '/images/reference/gui.jpg',
    thumbnailEn: '/images/reference/gui_en.jpg',
    color: '#8e44ad',
    basicInfo: {
      zh: '硅是地壳中第二丰富的元素，仅次于氧。它是半导体工业的核心材料，也是现代电子设备的基础。硅的拟人化形象是一位聪慧的少女，代表着科技与自然的完美融合。',
      en: 'Silicon is the second most abundant element in the Earth\'s crust, after oxygen. It is the core material of the semiconductor industry and the foundation of modern electronic devices. Its anthropomorphized form is a clever girl representing the perfect fusion of technology and nature.',
    },
    existence: {
      zh: '硅广泛存在于地壳岩石中，主要以二氧化硅（石英、沙子）和硅酸盐矿物形式存在。它是玻璃、陶瓷、水泥等材料的主要成分，也是计算机芯片和太阳能电池的关键材料。',
      en: 'Silicon exists widely in the Earth\'s crust, mainly as silicon dioxide (quartz, sand) and silicate minerals. It is a major component of glass, ceramics, and cement, and is the key material for computer chips and solar cells.',
    },
    personality: {
      zh: '性格设定：聪慧、冷静、富有逻辑思维的少女。喜欢秩序与结构，擅长用理性分析问题。她像是团队中的"大脑"，总能找到最优解决方案。她的存在让混乱的世界变得井井有条。',
      en: 'Personality: A clever, calm, and logical girl. She loves order and structure, and excels at analyzing problems rationally. She is the "brain" of the team, always finding the optimal solution. Her presence brings order to a chaotic world.',
    },
    funFact: {
      zh: '硅谷（Silicon Valley）因硅而得名！虽然现在的科技公司大多不直接生产硅芯片，但这个地名永远记录了硅对信息时代的奠基作用。另外，美丽的蛋白石（Opal）其实是含水的二氧化硅。',
      en: 'Silicon Valley is named after silicon! Although most tech companies there no longer directly manufacture silicon chips, the name forever records silicon\'s foundational role in the information age. Also, beautiful opals are actually hydrated silicon dioxide.',
    },
    commonForm: {
      zh: '常见存在形式：石英晶体、沙子、玛瑙、蛋白石、硅藻土。日常可见于玻璃制品、陶瓷器皿、电脑芯片、太阳能板中。',
      en: 'Common forms: Quartz crystals, sand, agate, opal, diatomaceous earth. Found in everyday glassware, ceramics, computer chips, and solar panels.',
    },
    physicalProperties: {
      zh: '原子序数：14 | 原子量：28.085 | 熔点：1414°C | 沸点：3265°C | 密度：2.33 g/cm³ | 状态：固态 | 分类：类金属/半导体',
      en: 'Atomic Number: 14 | Atomic Weight: 28.085 | Melting Point: 1414°C | Boiling Point: 3265°C | Density: 2.33 g/cm³ | State: Solid | Category: Metalloid / Semiconductor',
    },
  },
  {
    id: 'copper',
    nameZh: '铜',
    nameEn: 'Copper',
    symbol: 'Cu',
    atomicNumber: 29,
    modelFile: 'copper.glb',
    modelFormat: 'glb',
    thumbnailZh: '/images/reference/tong.jpg',
    thumbnailEn: '/images/reference/tong_en.jpg',
    color: '#e67e22',
    basicInfo: {
      zh: '铜是人类最早使用的金属之一，距今已有超过一万年的历史。它独特的红橙色光泽使其在金属中脱颖而出。铜的拟人化形象是一位温暖而有活力的少女，承载着人类文明的古老记忆。',
      en: 'Copper is one of the earliest metals used by humans, with a history spanning over 10,000 years. Its distinctive reddish-orange luster makes it stand out among metals. Its anthropomorphized form is a warm and energetic girl carrying the ancient memories of human civilization.',
    },
    existence: {
      zh: '铜以自然铜、硫化物矿物（如黄铜矿）和氧化物矿物形式存在于地壳中。它是电线、管道、硬币和无数合金（如青铜、黄铜）的关键材料。人体也需要微量铜来维持健康。',
      en: 'Copper exists as native copper, sulfide minerals (like chalcopyrite), and oxide minerals in the Earth\'s crust. It is the key material for electrical wires, pipes, coins, and countless alloys (bronze, brass). The human body also needs trace copper for health.',
    },
    personality: {
      zh: '性格设定：温暖、热情、富有人情味的少女。她有着古老灵魂的智慧，却保持着少女的活力。她善于连接（导电！），无论是传递能量还是拉近人与人的距离。她是文明的见证者与传承者。',
      en: 'Personality: A warm, passionate, and humane girl. She has the wisdom of an ancient soul yet maintains a youthful energy. She excels at connecting (conducting!), whether transmitting energy or bringing people closer together. She is a witness and transmitter of civilization.',
    },
    funFact: {
      zh: '自由女神像是铜做的！她表面的绿色是因为铜长期暴露在空气中形成的铜绿（碱式碳酸铜）。这种绿色保护层反而保护了内部的铜不被继续腐蚀。另外，铜是唯一一种具有红色金属光泽的金属（金除外）。',
      en: 'The Statue of Liberty is made of copper! Her green surface is due to patina (basic copper carbonate) formed over long-term air exposure. This green protective layer actually protects the inner copper from further corrosion. Copper is the only metal with a reddish metallic luster (besides gold).',
    },
    commonForm: {
      zh: '常见存在形式：自然铜块、黄铜矿、孔雀石、蓝铜矿。日常可见于电线、水管、硬币、铜锅、青铜雕塑、电子元器件中。',
      en: 'Common forms: Native copper nuggets, chalcopyrite, malachite, azurite. Found in everyday electrical wires, water pipes, coins, copper pots, bronze sculptures, and electronic components.',
    },
    physicalProperties: {
      zh: '原子序数：29 | 原子量：63.546 | 熔点：1085°C | 沸点：2562°C | 密度：8.96 g/cm³ | 状态：固态 | 分类：过渡金属 | 导电性：极佳',
      en: 'Atomic Number: 29 | Atomic Weight: 63.546 | Melting Point: 1085°C | Boiling Point: 2562°C | Density: 8.96 g/cm³ | State: Solid | Category: Transition Metal | Conductivity: Excellent',
    },
  },
  {
    id: 'iron',
    nameZh: '铁',
    nameEn: 'Iron',
    symbol: 'Fe',
    atomicNumber: 26,
    modelFile: 'iron.glb',
    modelFormat: 'glb',
    thumbnailZh: '/images/reference/tie.png',
    thumbnailEn: '/images/reference/tie_en.jpg',
    color: '#7f8c8d',
    basicInfo: {
      zh: '铁是宇宙中丰度最高的元素之一，是恒星核聚变的终点。它构成了地球的内核，也是人类文明进入铁器时代的标志。铁的拟人化形象是一位坚强可靠的战士少女。',
      en: 'Iron is one of the most abundant elements in the universe and the endpoint of stellar fusion. It forms the Earth\'s core and marked humanity\'s entry into the Iron Age. Its anthropomorphized form is a strong and reliable warrior girl.',
    },
    existence: {
      zh: '铁是地壳中第四丰富的元素，主要以赤铁矿、磁铁矿等形式存在。它是钢铁的基础，用于建筑、交通工具、工具等几乎所有重工业领域。人体血液中的血红蛋白也依赖铁来运输氧气。',
      en: 'Iron is the fourth most abundant element in Earth\'s crust, mainly existing as hematite and magnetite. It is the basis of steel, used in construction, transportation, tools, and nearly all heavy industries. Hemoglobin in human blood also depends on iron to transport oxygen.',
    },
    personality: {
      zh: '性格设定：坚强、可靠、有保护欲的战士少女。她可能看起来有些粗犷，但内心温柔且忠诚。她是团队中的"盾"，永远站在最前面。她的意志如钢铁般不可动摇。',
      en: 'Personality: A strong, reliable, and protective warrior girl. She may seem rough around the edges, but she is gentle and loyal at heart. She is the "shield" of the team, always standing at the front. Her will is as unshakeable as steel.',
    },
    funFact: {
      zh: '铁是唯一能让恒星"死亡"的元素。当恒星核心聚变到铁时，核聚变不再释放能量，恒星便会坍缩。这意味着一颗恒星的核心变成了铁，它离超新星爆发就不远了。我们血液中的铁，很可能来自远古超新星爆发的残骸。',
      en: 'Iron is the element that "kills" stars. When a star\'s core fuses to iron, fusion no longer releases energy, causing the star to collapse. This means when a star\'s core becomes iron, a supernova is imminent. The iron in our blood likely comes from ancient supernova remnants.',
    },
    commonForm: {
      zh: '常见存在形式：赤铁矿、磁铁矿、黄铁矿（愚人金）、陨铁。日常可见于钢筋、汽车、铁锅、铁轨、各种工具和机械中。',
      en: 'Common forms: Hematite, magnetite, pyrite (fool\'s gold), meteoric iron. Found in steel rebar, cars, iron pans, railway tracks, and various tools and machinery.',
    },
    physicalProperties: {
      zh: '原子序数：26 | 原子量：55.845 | 熔点：1538°C | 沸点：2862°C | 密度：7.87 g/cm³ | 状态：固态 | 分类：过渡金属 | 特性：铁磁性',
      en: 'Atomic Number: 26 | Atomic Weight: 55.845 | Melting Point: 1538°C | Boiling Point: 2862°C | Density: 7.87 g/cm³ | State: Solid | Category: Transition Metal | Property: Ferromagnetic',
    },
  },
  {
    id: 'carbon',
    nameZh: '碳',
    nameEn: 'Carbon',
    symbol: 'C',
    atomicNumber: 6,
    modelFile: 'carbon.glb',
    modelFormat: 'glb',
    thumbnailZh: '/images/reference/tan.png',
    thumbnailEn: '/images/reference/tan_en.jpg',
    color: '#2c3e50',
    basicInfo: {
      zh: '碳是有机生命的基础元素，所有已知生命形式都以碳为骨架。从钻石到石墨，碳的表现形式千变万化。碳的拟人化形象是一位百变的多面少女，既是璀璨的钻石公主，也是低调的石墨学者。',
      en: 'Carbon is the fundamental element of organic life — all known life forms are carbon-based. From diamond to graphite, carbon\'s manifestations are incredibly diverse. Its anthropomorphized form is a versatile, multi-faceted girl — both a brilliant diamond princess and a humble graphite scholar.',
    },
    existence: {
      zh: '碳以多种形式存在：金刚石（钻石）、石墨、无定形碳、以及所有有机化合物中。大气中的二氧化碳是碳循环的重要部分。碳纤维、碳纳米管等新型碳材料正在改变科技世界。',
      en: 'Carbon exists in many forms: diamond, graphite, amorphous carbon, and all organic compounds. Atmospheric CO₂ is a key part of the carbon cycle. New carbon materials like carbon fiber and carbon nanotubes are changing the world of technology.',
    },
    personality: {
      zh: '性格设定：百变、适应力极强的少女。她可以是最耀眼夺目的钻石公主，也可以是最朴实低调的铅笔芯（石墨）。她极具创造力，因为碳链可以无限延伸组合——她是生命蓝图的绘制者。',
      en: 'Personality: A versatile and highly adaptable girl. She can be the most dazzling diamond princess or the most humble pencil lead (graphite). She is extremely creative, as carbon chains can extend and combine infinitely — she is the architect of life\'s blueprint.',
    },
    funFact: {
      zh: '钻石和铅笔芯是同一种元素！它们都是纯碳，区别只在于原子排列方式不同。另外，你的身体大约18%是碳原子。如果把一个成年人身体里的碳提取出来，大约可以做成9000支铅笔的笔芯。',
      en: 'Diamonds and pencil lead are the same element! Both are pure carbon, differing only in atomic arrangement. Also, about 18% of your body is carbon atoms. The carbon extracted from an adult human body could make about 9,000 pencil leads.',
    },
    commonForm: {
      zh: '常见存在形式：钻石、石墨、煤炭、石灰石（碳酸钙）、所有生物体中。日常可见于铅笔、钻石首饰、塑料制品、石油、天然气。',
      en: 'Common forms: Diamond, graphite, coal, limestone (calcium carbonate), all living organisms. Found in pencils, diamond jewelry, plastics, petroleum, and natural gas.',
    },
    physicalProperties: {
      zh: '原子序数：6 | 原子量：12.011 | 升华点：3642°C | 密度：2.26 g/cm³（石墨）/ 3.51 g/cm³（钻石）| 状态：固态 | 分类：非金属 | 同素异形体：钻石、石墨、石墨烯、碳纳米管、富勒烯',
      en: 'Atomic Number: 6 | Atomic Weight: 12.011 | Sublimation Point: 3642°C | Density: 2.26 g/cm³ (graphite) / 3.51 g/cm³ (diamond) | State: Solid | Category: Nonmetal | Allotropes: Diamond, graphite, graphene, carbon nanotubes, fullerenes',
    },
  },
  {
    id: 'gold',
    nameZh: '金',
    nameEn: 'Gold',
    symbol: 'Au',
    atomicNumber: 79,
    modelFile: 'gold.glb',
    modelFormat: 'glb',
    thumbnailZh: '/images/reference/jin.jpg',
    thumbnailEn: '/images/reference/jin_en.jpg',
    color: '#f39c12',
    basicInfo: {
      zh: '金是自古以来最受人类追捧的贵金属，象征着财富、权力与永恒。它永不生锈，是最稳定的元素之一。金的拟人化形象是一位高贵优雅的公主，闪耀着永恒的光辉。',
      en: 'Gold is the most sought-after precious metal since ancient times, symbolizing wealth, power, and eternity. It never rusts and is one of the most stable elements. Its anthropomorphized form is a noble and elegant princess radiating eternal brilliance.',
    },
    existence: {
      zh: '金主要以自然金（单质）形式存在于岩石中，也有少量以碲化物矿物形式存在。它广泛用于珠宝、货币储备、电子元器件和航天工业。金箔薄到可以透光。',
      en: 'Gold mainly exists as native gold (elemental) in rocks, with minor telluride minerals. It is widely used in jewelry, currency reserves, electronic components, and aerospace. Gold leaf can be beaten so thin that it becomes translucent.',
    },
    personality: {
      zh: '性格设定：高贵、优雅、沉稳的公主。她不轻易与其他物质反应（化学惰性），保持着独立高冷的形象。但她并非冷漠无情——在关键时刻，她总能展现出可靠的一面。她的美经得起时间的考验。',
      en: 'Personality: A noble, elegant, and composed princess. She does not easily react with other substances (chemical inertness), maintaining an aloof and independent image. But she is not cold-hearted — at crucial moments, she always shows her reliable side. Her beauty stands the test of time.',
    },
    funFact: {
      zh: '全世界的黄金如果能熔化成一个大立方体，边长只有约22米（一栋小楼大小）。地壳中的黄金含量极少，一吨地壳岩石中平均只含0.004克黄金。另外，黄金来自中子星碰撞——你的金戒指可能是两颗中子星合体的产物！',
      en: 'If all the world\'s gold were melted into a single cube, it would only be about 22 meters on each side (the size of a small building). Gold is extremely rare in the Earth\'s crust — on average, one ton of crustal rock contains only 0.004 grams of gold. Also, gold comes from neutron star collisions — your gold ring might be the product of two neutron stars merging!',
    },
    commonForm: {
      zh: '常见存在形式：自然金块、金砂、金矿石。日常可见于黄金首饰、金币、电子产品的镀金接口、金牙、航天器的镀金保护层。',
      en: 'Common forms: Native gold nuggets, gold dust, gold ore. Found in gold jewelry, coins, gold-plated electronic connectors, gold teeth, and gold protective coatings on spacecraft.',
    },
    physicalProperties: {
      zh: '原子序数：79 | 原子量：196.97 | 熔点：1064°C | 沸点：2856°C | 密度：19.32 g/cm³ | 状态：固态 | 分类：过渡金属/贵金属 | 特性：永不氧化、延展性极佳',
      en: 'Atomic Number: 79 | Atomic Weight: 196.97 | Melting Point: 1064°C | Boiling Point: 2856°C | Density: 19.32 g/cm³ | State: Solid | Category: Transition Metal / Precious Metal | Properties: Never oxidizes, extremely malleable',
    },
  },
  {
    id: 'hydrogen',
    nameZh: '氢',
    nameEn: 'Hydrogen',
    symbol: 'H',
    atomicNumber: 1,
    modelFile: 'hydrogen.glb',
    modelFormat: 'glb',
    thumbnailZh: '/images/reference/qing.jpg',
    thumbnailEn: '/images/reference/qing_en.jpg',
    color: '#85c1e9',
    basicInfo: {
      zh: '氢是宇宙中最丰富的元素，占宇宙可见物质的约75%。它是最轻、最简单的元素，只有一个质子和一个电子。氢的拟人化形象是一位纯真活泼的少女，作为元素周期表的001号，她是一切的开端。',
      en: 'Hydrogen is the most abundant element in the universe, making up about 75% of visible matter. It is the lightest and simplest element, with just one proton and one electron. Its anthropomorphized form is an innocent and lively girl — as No.001 on the periodic table, she is the beginning of everything.',
    },
    existence: {
      zh: '氢主要以水的形式存在于地球上，也存在于所有有机化合物中。在宇宙中，氢是恒星的主要燃料——太阳通过氢核聚变发光发热。氢气是最轻的气体，曾用于飞艇，现在用于火箭燃料和清洁能源。',
      en: 'Hydrogen exists on Earth primarily as water and in all organic compounds. In the universe, it is the main fuel of stars — the Sun shines through hydrogen fusion. Hydrogen gas is the lightest gas, once used in airships and now used in rocket fuel and clean energy.',
    },
    personality: {
      zh: '性格设定：纯真、好奇、充满活力的少女。她是元素家族中最小的妹妹，总是第一个冲出去尝试新事物。她单纯而热情，像星星之火可以燎原——一个氢原子可以引发巨大的能量。她梦想着成为清洁能源，为世界带来光明。',
      en: 'Personality: An innocent, curious, and energetic girl. She is the youngest sister in the element family, always the first to rush out and try new things. She is simple yet passionate — like a single spark that can start a prairie fire, one hydrogen atom can unleash enormous energy. She dreams of becoming clean energy, bringing light to the world.',
    },
    funFact: {
      zh: '你的身体里大约有62%是氢原子（按原子数量算）！氢是最古老的元素，大爆炸后几分钟就形成了。另外，木星的主要成分是氢——如果能点燃木星，它几乎可以变成一颗小恒星。不过别担心，木星上没有氧气，烧不起来。',
      en: 'About 62% of the atoms in your body are hydrogen! It is the oldest element, formed just minutes after the Big Bang. Jupiter is mostly made of hydrogen — if it could be ignited, it would almost become a small star. But don\'t worry, there\'s no oxygen on Jupiter to burn it.',
    },
    commonForm: {
      zh: '常见存在形式：水（H₂O）、氢气、有机化合物、酸。日常可见于水、天然气、塑料、汽油、化肥中。液氢是航天火箭的主要燃料。',
      en: 'Common forms: Water (H₂O), hydrogen gas, organic compounds, acids. Found in water, natural gas, plastics, gasoline, and fertilizers. Liquid hydrogen is the primary fuel for space rockets.',
    },
    physicalProperties: {
      zh: '原子序数：1 | 原子量：1.008 | 沸点：-252.9°C | 熔点：-259.1°C | 密度：0.00008988 g/cm³ | 状态：气态 | 分类：非金属 | 特性：最轻元素、宇宙最丰富元素',
      en: 'Atomic Number: 1 | Atomic Weight: 1.008 | Boiling Point: -252.9°C | Melting Point: -259.1°C | Density: 0.00008988 g/cm³ | State: Gas | Category: Nonmetal | Properties: Lightest element, most abundant element in universe',
    },
  },
  {
    id: 'helium',
    nameZh: '氦',
    nameEn: 'Helium',
    symbol: 'He',
    atomicNumber: 2,
    modelFile: 'helium.glb',
    modelFormat: 'glb',
    thumbnailZh: '/images/reference/hai.jpg',
    thumbnailEn: '/images/reference/hai_en.jpg',
    color: '#e8d5f5',
    basicInfo: {
      zh: '氦是宇宙中第二丰富的元素，仅次于氢。它是一种无色无味的惰性气体，永远不会与其他元素发生化学反应。氦的拟人化形象是一位轻盈飘逸的少女，如同她所代表的气体一样自由灵动。',
      en: 'Helium is the second most abundant element in the universe, after hydrogen. It is a colorless, odorless inert gas that never chemically reacts with other elements. Its anthropomorphized form is a light and ethereal girl, as free and agile as the gas she represents.',
    },
    existence: {
      zh: '氦主要存在于天然气田中，通过天然气提取获得。它也存在于恒星中——太阳就是巨大的氦工厂，通过氢核聚变持续产生氦。液氦是最冷的液体（-269°C），用于超导磁体和粒子加速器等尖端科学设备。',
      en: 'Helium is mainly found in natural gas fields and extracted from them. It also exists in stars — the Sun is a giant helium factory, continuously producing helium through hydrogen fusion. Liquid helium is the coldest liquid (-269°C), used in superconducting magnets and particle accelerators.',
    },
    personality: {
      zh: '性格设定：轻盈、自由、不受束缚的少女。她有着透明翅膀般的灵气，总是漂浮在空中俯瞰世界。她不爱与任何人起冲突（惰性气体嘛），保持着优雅的距离感。她的声音会让人的声带振动变快，所以说话会变成尖细的卡通音。',
      en: 'Personality: A light, free, and unconstrained girl. She has an aura like transparent wings, always floating above the world. She dislikes conflict with anyone (being an inert gas), maintaining an elegant sense of distance. Her voice makes vocal cords vibrate faster, turning speech into a high-pitched cartoon sound.',
    },
    funFact: {
      zh: '吸入氦气会让声音变成卡通音！因为氦的密度远低于空气，声带在氦气中振动更快。另外，氦是唯一一种在常压下即使降到绝对零度也不会凝固的元素——它永远是液体，除非施加高压。还有，太阳每秒将6亿吨氢转化为氦，释放出照亮地球的能量。',
      en: 'Inhaling helium makes your voice sound cartoonish! Because helium is much less dense than air, vocal cords vibrate faster in it. Also, helium is the only element that won\'t solidify at absolute zero under normal pressure — it stays liquid unless high pressure is applied. The Sun converts 600 million tons of hydrogen to helium every second.',
    },
    commonForm: {
      zh: '常见存在形式：天然气、液氦冷却剂、派对氦气球、飞艇。日常可见于生日气球、MRI医疗设备、半导体制造、火箭燃料加压系统中。',
      en: 'Common forms: Natural gas, liquid helium coolant, party helium balloons, airships. Found in birthday balloons, MRI medical equipment, semiconductor manufacturing, and rocket fuel pressurization systems.',
    },
    physicalProperties: {
      zh: '原子序数：2 | 原子量：4.0026 | 沸点：-268.9°C | 熔点：-272.2°C（高压下）| 密度：0.0001785 g/cm³ | 状态：气态 | 分类：稀有气体/惰性气体 | 特性：最冷的液体、化学性质最不活泼的元素',
      en: 'Atomic Number: 2 | Atomic Weight: 4.0026 | Boiling Point: -268.9°C | Melting Point: -272.2°C (under pressure) | Density: 0.0001785 g/cm³ | State: Gas | Category: Noble Gas / Inert Gas | Properties: Coldest liquid, most chemically inert element',
    },
  },
];

export default elements;

// 根据ID获取元素
export function getElementById(id) {
  return elements.find(el => el.id === id) || null;
}
