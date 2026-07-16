const portfolioImages = import.meta.glob("../../assets/portfolio-pages/*.{jpg,png,jpeg}", {
  eager: true,
  import: "default",
});
const getP = (name) => portfolioImages[`../../assets/portfolio-pages/${name}`];
const keycapImages = import.meta.glob("../../assets/keycaps/*.{jpg,png,jpeg}", {
  eager: true,
  import: "default",
});
const getK = (name) => keycapImages[`../../assets/keycaps/${name}`];

const projects = [
  {
    id: "whelk",
    num: "01",
    tags: ["Branding", "Packaging", "Fashion"],
    title: "WHELK 弧锂实验室 — 品牌视觉设计",
    en: "WHELK Arc Lithium Lab — Brand Visual Design",
    desc: "围绕古着品牌「在时间的深海里搜捕遗失的副本」的核心理念，构建从Logo标识到Pop Shop物料、服装系列Maison Gesteau 2024–2025的完整品牌全案。以触觉拾荒为方法论，将潮汐磨损、铜器氧化层等时间痕迹转化为视觉语言。",
    hero: getP("07.jpg"),
    images: [
      getP("05.jpg"), getP("06.jpg"), getP("07.jpg"), getP("08.jpg"),
      getP("09.jpg"), getP("10.jpg"), getP("11.jpg"), getP("12.jpg"),
    ],
    narrative: {},
  },
  {
    id: "woof",
    num: "02",
    tags: ["UI/UX", "Product Design"],
    title: "WOOF-WOOF 宠物友好社交APP",
    en: "WOOF-WOOF — Pet-Friendly Social App",
    desc: "基于遛狗场景的宠物主人同城社交平台。聚焦25–30岁一线城市养宠核心群体，通过遛狗地图整合实时路线共享、排泄点标记与宠物友好空间导航，结合定制化虚拟形象与「孤独模式」沉浸体验。",
    hero: getP("14.jpg"),
    images: [
      getP("14.jpg"), getP("15.jpg"),
      getP("16.jpg"), getP("17.jpg"), getP("18.jpg"), getP("19.jpg"),
    ],
    narrative: {},
  },
  {
    id: "memory",
    num: "03",
    tags: ["Publication", "Visual Narrative"],
    title: "阿尔兹海默症·记忆的回流",
    en: "Backflow of Memory — Alzheimer's Publication",
    desc: "基于阿尔兹海默症的共情叙事出版物设计。通过桌面研究、深度访谈与参与式观察，提取12个「记忆锚点」，转译为主题海报、42款邮折系统与叙事物件。以叠化、透明、碎片化图像表达患者感知混乱。",
    hero: getP("22.jpg"),
    images: [
      getP("22.jpg"), getP("23.jpg"),
      getP("24.jpg"), getP("25.jpg"), getP("26.jpg"),
      getP("27.jpg"), getP("28.jpg"), getP("29.jpg"),
    ],
    narrative: {},
  },
  {
    id: "metakeys",
    num: "04",
    tags: ["Branding", "Product Design", "3D Visual"],
    title: "MetaKeys — 模块化键帽品牌设计",
    en: "MetaKeys — Modular Keycap Brand Design",
    desc: "围绕“键帽不止于按键”的品牌主张，构建模块化客制键帽的品牌概念与视觉系统。通过黑透键帽壳、可替换内容物与标准化底座形成产品逻辑，并延展至主海报、包装、挂绳、3D产品场景与传播物料。",
    hero: getK("keycaps-03-packaging.jpg"),
    images: [
      getK("keycaps-01-overview.jpg"), getK("keycaps-02-poster.jpg"),
      getK("keycaps-03-packaging.jpg"), getK("keycaps-04-lanyard.jpg"),
      getK("keycaps-05-system.jpg"), getK("keycaps-06-product.jpg"),
      getK("keycaps-07-application.jpg"), getK("keycaps-08-scene.jpg"),
      getK("keycaps-09-render.jpg"),
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
    hero: getP("31.jpg"),
    images: [
      getP("31.jpg"), getP("32.jpg"), getP("33.jpg"),
      getP("34.jpg"), getP("35.jpg"),
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
    hero: getP("38.jpg"),
    images: [
      getP("37.jpg"), getP("38.jpg"), getP("39.jpg"), getP("40.jpg"),
      getP("41.jpg"), getP("42.jpg"), getP("43.jpg"),
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
    hero: getP("45.jpg"),
    images: [
      getP("45.jpg"), getP("46.jpg"),
      getP("47.jpg"), getP("48.jpg"),
    ],
    narrative: {},
  },
];

export default projects;
