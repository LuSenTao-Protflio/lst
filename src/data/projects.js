const portfolioImages = import.meta.glob("../../assets/portfolio-pages/*.{webp,jpg,png,jpeg}", {
  eager: true,
  import: "default",
});
const getP = (name) => portfolioImages[`../../assets/portfolio-pages/${name}`];
const dailyReadingImages = import.meta.glob("../assets/daily-reading/*.{webp,jpg,png,jpeg}", {
  eager: true,
  import: "default",
});
const getD = (name) => dailyReadingImages[`../assets/daily-reading/${name}`];
const whelkImages = import.meta.glob("../assets/whelk/*.{webp,jpg,png,jpeg}", {
  eager: true,
  import: "default",
});
const getW = (name) => whelkImages[`../assets/whelk/${name}`];
const woofImages = import.meta.glob("../assets/woof/*.{webp,jpg,png,jpeg}", {
  eager: true,
  import: "default",
});
const getWoof = (name) => woofImages[`../assets/woof/${name}`];

const projects = [
  {
    id: "whelk",
    num: "01",
    tags: ["Branding", "Packaging", "Fashion"],
    title: "WHELK 弧锂实验室 — 品牌视觉设计",
    en: "WHELK Arc Lithium Lab — Brand Visual Design",
    desc: "围绕古着品牌「在时间的深海里搜捕遗失的副本」的核心理念，构建从Logo标识到Pop Shop物料、服装系列Maison Gesteau 2024–2025的完整品牌全案。以触觉拾荒为方法论，将潮汐磨损、铜器氧化层等时间痕迹转化为视觉语言。",
    hero: getP("07.webp"),
    images: [
      getP("05.webp"), getP("06.webp"), getP("07.webp"), getP("08.webp"),
      getP("09.webp"), getP("10.webp"), getP("11.webp"), getP("12.webp"),
    ],
    previewImages: [
      getP("05.webp"),
      getP("06.webp"),
      getW("whelk-main-preview.webp"),
    ],
    storyLayout: [
      { sectionIndex: 0, layout: "wide", images: [getP("05.webp")] },
      { sectionIndex: 1, layout: "pair", images: [getP("06.webp"), getP("08.webp")] },
      { layout: "asymmetric", images: [getW("wash-label.webp"), getW("rug.webp")] },
      { sectionIndex: 2, layout: "wide", images: [getP("09.webp")] },
      { layout: "portrait", align: "left", images: [getW("fabric-bag.webp")] },
      { layout: "wide", images: [getP("10.webp")] },
      { layout: "portrait", align: "right", images: [getW("charm.webp")] },
      { layout: "pair", images: [getP("11.webp"), getP("12.webp")] },
      { layout: "wide", images: [getW("mugs.webp")] },
    ],
    narrative: {},
  },
  {
    id: "daily-reading",
    num: "02",
    tags: ["Event Design", "Visual System", "Campaign"],
    title: "天安云谷（日常）读书节",
    en: "Daily Reading Festival",
    desc: "以「阅读即日常」为核心，为天安云谷社区读书文化节建立持续42天的视觉系统。明亮黄色、模块化信息框与线性书本图形贯穿四类互动活动、主题书单、活动日历和传播海报。",
    hero: getD("hero.webp"),
    images: [
      getD("hero.webp"), getD("exchange-coffee.webp"),
      getD("exchange-vegetable.webp"), getD("system-white.webp"),
      getD("exchange-book.webp"), getD("exchange-plant.webp"),
      getD("forty-two-days.webp"), getD("theme-commute.webp"),
      getD("theme-midday.webp"), getD("theme-evening.webp"),
      getD("schedule.webp"), getD("closing-mark.webp"),
    ],
    previewImages: [
      getD("hero.webp"),
      getD("daily-preview-illustration.webp"),
      getD("daily-preview-system.webp"),
    ],
    narrative: {},
  },
  {
    id: "woof",
    num: "03",
    tags: ["UI/UX", "Product Design"],
    title: "WOOF-WOOF 宠物友好社交APP",
    en: "WOOF-WOOF — Pet-Friendly Social App",
    desc: "基于遛狗场景的宠物主人同城社交平台。聚焦25–30岁一线城市养宠核心群体，通过遛狗地图整合实时路线共享、排泄点标记与宠物友好空间导航，结合定制化虚拟形象与「孤独模式」沉浸体验。",
    hero: getP("14.webp"),
    images: [
      getP("14.webp"), getP("15.webp"),
      getP("16.webp"), getP("17.webp"), getP("18.webp"), getP("19.webp"),
    ],
    detailImages: [
      getWoof("research-demographics.webp"),
      getWoof("research-interviews.webp"),
      getWoof("research-functions.webp"),
      getWoof("research-feature-system.webp"),
      getWoof("research-moodboard.webp"),
      getP("14.webp"), getP("15.webp"), getP("16.webp"),
      getP("17.webp"), getP("18.webp"), getP("19.webp"),
    ],
    detailImageAlts: [
      "WOOF-WOOF pet-owner demographic research",
      "WOOF-WOOF interview findings and synthesis",
      "WOOF-WOOF provisional application functions",
      "WOOF-WOOF foundational feature system",
      "WOOF-WOOF visual research and moodboard",
      "WOOF-WOOF product visual 1",
      "WOOF-WOOF product visual 2",
      "WOOF-WOOF product visual 3",
      "WOOF-WOOF product visual 4",
      "WOOF-WOOF product visual 5",
      "WOOF-WOOF product visual 6",
    ],
    narrative: {},
  },
  {
    id: "memory",
    num: "04",
    tags: ["Publication", "Visual Narrative"],
    title: "阿尔兹海默症·记忆的回流",
    en: "Backflow of Memory — Alzheimer's Publication",
    desc: "基于阿尔兹海默症的共情叙事出版物设计。通过桌面研究、深度访谈与参与式观察，提取12个「记忆锚点」，转译为主题海报、42款邮折系统与叙事物件。以叠化、透明、碎片化图像表达患者感知混乱。",
    hero: getP("22.webp"),
    images: [
      getP("22.webp"), getP("23.webp"),
      getP("24.webp"), getP("25.webp"), getP("26.webp"),
      getP("27.webp"), getP("28.webp"), getP("29.webp"),
    ],
    narrative: {},
  },
  {
    id: "gala",
    num: "05",
    tags: ["Event Design", "Key Visual", "Spatial Graphics"],
    title: "FRIDAY 缘起·热爱 — 帆书年会视觉",
    en: "FRIDAY Origin & Passion — Fanshu Annual Gala Visual",
    desc: "帆书深圳书友年会「FRIDAY 缘起·热爱」全案主视觉，融合乐队演出与嘉宾分享的跨界视听盛典，覆盖KV、导视、物料、H5等完整触点体系。",
    hero: getP("31.webp"),
    images: [
      getP("31.webp"), getP("32.webp"), getP("33.webp"),
      getP("34.webp"), getP("35.webp"),
    ],
    narrative: {},
  },
  {
    id: "storyteller",
    num: "06",
    tags: ["Event Design", "Key Visual", "Branding"],
    title: "有请讲书人 — 读书月活动视觉",
    en: "The Storyteller — Reading Month Event Visual",
    desc: "深圳读书月「有请讲书人」阅读分享活动全链路视觉体系，从KV主视觉到现场导视、物料延展与线上宣发，传递阅读与表达的品牌精神。",
    hero: getP("38.webp"),
    images: [
      getP("37.webp"), getP("38.webp"), getP("39.webp"), getP("40.webp"),
      getP("41.webp"), getP("42.webp"), getP("43.webp"),
    ],
    narrative: {},
  },
  {
    id: "misc",
    num: "07",
    tags: ["Poster", "Key Visual", "UI Design", "AR"],
    title: "杂项",
    en: "Miscellaneous",
    desc: "「非凡大咖」松弛的力量主题KV海报；世界读书日插画海报「给生活松松绑」及年度书单展架系统；南头古城AR实景导航界面设计。跨越演讲视觉、书店物料与数字交互的多元设计实践。",
    hero: getP("45.webp"),
    images: [
      getP("45.webp"), getP("46.webp"),
      getP("47.webp"), getP("48.webp"),
    ],
    narrative: {},
  },
];

export default projects;
