import { createContext, useContext, useState, useCallback } from "react";

const translations = {
  zh: {
    // Nav
    nav: { work: "Work", info: "Info" },
    langBtn: "EN",

    // Hero
    hero: {
      eyebrow: "Visual Communication Design · 2026",
      name: "卢森涛",
      role: "Graphic Design",
      portfolio: "Portfolio",
      meta: "Branding · UI Design · Publication · Event Visual\n深圳大学视觉传达设计 / 2022.06 — 2026.06\n热衷于探索设计在物理空间中的多种可能",
    },

    // Info
    info: {
      education: { label: "Education", value: "深圳大学 / 视觉传达设计 · GPA 3.92/4.5 · 版式 · 出版物 · 插画 · 字体 · 品牌" },
      experience: { label: "Experience", value: "帆书深圳 / 品牌视觉 · 紫鸟科技 / AIGC视觉 · 麦高创想家 / 视觉执行" },
      tools: { label: "Tools", value: "Ps · Ai · Id · Figma · Spline · Blender · C4D · Midjourney · Codex" },
      contact: { label: "Contact", value: "15875591020 · sentaolu371@gmail.com · 深圳市南山区" },
    },

    // Directory
    directory: "Projects",

    // Project titles / en / desc
    projects: {
      whelk: {
        title: "WHELK 弧锂实验室 — 品牌视觉设计",
        en: "WHELK Arc Lithium Lab — Brand Visual Design",
        desc: "围绕古着品牌「在时间的深海里搜捕遗失的副本」的核心理念，构建从Logo标识到Pop Shop物料、服装系列Maison Gesteau 2024–2025的完整品牌全案。以触觉拾荒为方法论，将潮汐磨损、铜器氧化层等时间痕迹转化为视觉语言。",
      },
      woof: {
        title: "WOOF-WOOF 宠物友好社交APP",
        en: "WOOF-WOOF — Pet-Friendly Social App",
        desc: "基于遛狗场景的宠物主人同城社交平台。聚焦25–30岁一线城市养宠核心群体，通过遛狗地图整合实时路线共享、排泄点标记与宠物友好空间导航，结合定制化虚拟形象与「孤独模式」沉浸体验。",
      },
      memory: {
        title: "阿尔兹海默症·记忆的回流",
        en: "Backflow of Memory — Alzheimer's Publication",
        desc: "基于阿尔兹海默症的共情叙事出版物设计。通过桌面研究、深度访谈与参与式观察，提取12个「记忆锚点」，转译为主题海报、42款邮折系统与叙事物件。以叠化、透明、碎片化图像表达患者感知混乱。",
      },
      gala: {
        title: "FRIDAY 缘起·热爱 — 帆书年会视觉",
        en: "FRIDAY Origin & Passion — Fanshu Annual Gala Visual",
        desc: "帆书深圳书友年会「FRIDAY 缘起·热爱」全案主视觉，融合乐队演出与嘉宾分享的跨界视听盛典，覆盖KV、导视、物料、H5等完整触点体系。",
      },
      storyteller: {
        title: "有请讲书人 — 读书月活动视觉",
        en: "The Storyteller — Reading Month Event Visual",
        desc: "深圳读书月「有请讲书人」阅读分享活动全链路视觉体系，从KV主视觉到现场导视、物料延展与线上宣发，传递阅读与表达的品牌精神。",
      },
      misc: {
        title: "演讲物料、书店活动与其他实践",
        en: "Speech · Bookstore · Nantou AR Tour",
        desc: "「非凡大咖」松弛的力量主题KV海报；世界读书日插画海报「给生活松松绑」及年度书单展架系统；南头古城AR实景导航界面设计。跨越演讲视觉、书店物料与数字交互的多元设计实践。",
      },
    },

    // Narrative
    narrative: {
      title: "项目叙事",
      fields: [
        { key: "background", label: "背景", en: "Background" },
        { key: "role", label: "角色", en: "Role" },
        { key: "challenge", label: "挑战", en: "Challenge" },
        { key: "decision", label: "决策", en: "Decision" },
        { key: "outcome", label: "成果", en: "Outcome" },
      ],
    },

    // Detail page
    detail: {
      notFound: "项目未找到",
      notFoundDesc: "项目 \"{id}\" 不存在。",
      back: "← 返回作品目录",
    },

    // Footer
    footer: {
      col1Heading: "项目合作",
      col1Email: "sentaolu371@gmail.com",
      col1Btns: ["预约会议", "微信", "Telegram"],
      col2Heading: "关于我",
      col2Desc: "我是一名视觉传达设计专业应届毕业生，现居深圳。在校期间积累了扎实的品牌视觉、排版与UI设计功底，并在帆书、紫鸟科技、麦高创想家等企业的实习中，将设计能力落地为真实的商业项目。我擅长用视觉语言构建品牌叙事，对AIGC辅助设计有持续探索。期待加入一个重视创意与执行力的团队，用设计解决问题。",
    },
  },

  en: {
    nav: { work: "Work", info: "Info" },
    langBtn: "中",

    hero: {
      eyebrow: "Visual Communication Design · 2026",
      name: "Lusen Tao",
      role: "Graphic Design",
      portfolio: "Portfolio",
      meta: "Branding · UI Design · Publication · Event Visual\nShenzhen University / Visual Communication Design / 2022.06 — 2026.06\nPassionate about exploring the possibilities of design in physical space",
    },

    info: {
      education: { label: "Education", value: "Shenzhen University / Visual Communication Design · GPA 3.92/4.5 · Layout · Publication · Illustration · Typography · Branding" },
      experience: { label: "Experience", value: "Fanshu Shenzhen / Brand Visual · Ziniao Tech / AIGC Visual · Maigao Imagination / Visual Execution" },
      tools: { label: "Tools", value: "Ps · Ai · Id · Figma · Spline · Blender · C4D · Midjourney · Codex" },
      contact: { label: "Contact", value: "15875591020 · sentaolu371@gmail.com · Nanshan, Shenzhen" },
    },

    directory: "Projects",

    projects: {
      whelk: {
        title: "WHELK Arc Lithium Lab — Brand Visual Design",
        en: "WHELK Arc Lithium Lab — Brand Visual Design",
        desc: "A complete brand system for the vintage brand WHELK, built around the core concept of \"hunting for lost copies in the deep sea of time\". From logo identity to Pop Shop materials and the Maison Gesteau 2024–2025 collection, the visual language translates time traces—tidal wear, copper oxidation—into tactile storytelling.",
      },
      woof: {
        title: "WOOF-WOOF — Pet-Friendly Social App",
        en: "WOOF-WOOF — Pet-Friendly Social App",
        desc: "A location-based social platform for pet owners centered on dog-walking scenarios. Targeting urban pet owners aged 25–30, it integrates real-time route sharing, waste spot marking, and pet-friendly space navigation, paired with customizable avatars and an immersive \"lonely mode\".",
      },
      memory: {
        title: "Backflow of Memory — Alzheimer's Publication",
        en: "Backflow of Memory — Alzheimer's Publication",
        desc: "An empathetic narrative publication on Alzheimer's disease. Through desk research, in-depth interviews, and participatory observation, 12 \"memory anchors\" are extracted and translated into thematic posters, a 42-piece postal fold system, and narrative objects. Layering, transparency, and fragmented imagery express the patient's perceptual confusion.",
      },
      gala: {
        title: "FRIDAY Origin & Passion — Fanshu Annual Gala",
        en: "FRIDAY Origin & Passion — Fanshu Annual Gala Visual",
        desc: "The key visual for Fanshu Shenzhen's annual gala \"FRIDAY Origin & Passion\"—a cross-disciplinary audiovisual spectacle blending live band performance and guest talks. The system covers KV, signage, materials, and H5 touchpoints.",
      },
      storyteller: {
        title: "The Storyteller — Reading Month Event Visual",
        en: "The Storyteller — Reading Month Event Visual",
        desc: "The full visual system for Shenzhen Reading Month's \"The Storyteller\" series—from KV and on-site signage to material extensions and online promotion—conveying the brand spirit of reading and expression.",
      },
      misc: {
        title: "Speech, Bookstore & Other Practices",
        en: "Speech · Bookstore · Nantou AR Tour",
        desc: "KV poster for \"Relaxed Power\" keynote; World Book Day illustration poster \"Unbind Life\" and annual book list display system; Nantou Ancient Town AR navigation UI design. Diverse practices spanning keynote visuals, bookstore materials, and digital interaction.",
      },
    },

    narrative: {
      title: "Project Narrative",
      fields: [
        { key: "background", label: "Background", en: "Background" },
        { key: "role", label: "Role", en: "Role" },
        { key: "challenge", label: "Challenge", en: "Challenge" },
        { key: "decision", label: "Decision", en: "Decision" },
        { key: "outcome", label: "Outcome", en: "Outcome" },
      ],
    },

    detail: {
      notFound: "Project Not Found",
      notFoundDesc: "The project \"{id}\" does not exist.",
      back: "← Back to Projects",
    },

    footer: {
      col1Heading: "Project Collaboration",
      col1Email: "sentaolu371@gmail.com",
      col1Btns: ["Book a Meeting", "WeChat", "Telegram"],
      col2Heading: "About Me",
      col2Desc: "I am a recent graduate in Visual Communication Design, currently based in Shenzhen. During my studies, I built a solid foundation in brand identity, typography, and UI design. Through internships at Fanshu, Ziniao Tech, and Maigao Imagination, I translated design thinking into real commercial outcomes. I specialize in using visual language to construct brand narratives and continuously explore AIGC-assisted design. I look forward to joining a team that values both creativity and execution—where design solves real problems.",
    },
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("zh");

  const t = useCallback(
    (key) => {
      const keys = key.split(".");
      let result = translations[lang];
      for (const k of keys) {
        if (result == null) return key;
        result = result[k];
      }
      return result ?? key;
    },
    [lang]
  );

  const value = { lang, setLang, t };
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
