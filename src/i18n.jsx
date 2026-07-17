import { createContext, useContext, useState, useCallback, useEffect } from "react";

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
        detail: {
          meta: [{ label: "项目类型", value: "品牌识别 · 包装 · 时尚视觉" }, { label: "个人职责", value: "品牌概念 · 视觉识别 · 包装与应用" }, { label: "项目时间", value: "2024–2025" }],
          sections: [
            { label: "项目背景", title: "为古着品牌建立一套关于时间痕迹的视觉系统", body: "WHELK 围绕「在时间的深海里搜捕遗失的副本」展开，从品牌标识延伸到 Pop Shop、包装与服装系列，使不同触点共享同一套叙事。" },
            { label: "设计策略", title: "把磨损、氧化与潮汐痕迹转译成品牌语言", body: "设计从旧物表面的褪色、铜器氧化层和潮汐侵蚀中提取质感，通过克制的字体、材料肌理和图像处理建立时间感。" },
            { label: "视觉落地", title: "从识别系统延伸到包装、空间与服装应用", body: "视觉系统覆盖主标识、海报、包装、快闪物料及 Maison Gesteau 2024–2025 系列，在不同介质中保持统一的识别节奏。" },
          ], back: "返回全部项目", nextLabel: "下一个项目", nextId: "daily-reading", nextTitle: "天安云谷（日常）读书节",
        },
      },
      woof: {
        title: "WOOF-WOOF 宠物友好社交APP",
        en: "WOOF-WOOF — Pet-Friendly Social App",
        desc: "基于遛狗场景的宠物主人同城社交平台。聚焦25–30岁一线城市养宠核心群体，通过遛狗地图整合实时路线共享、排泄点标记与宠物友好空间导航，结合定制化虚拟形象与「孤独模式」沉浸体验。",
        detail: {
          meta: [
            { label: "项目类型", value: "UI/UX · 产品视觉" },
            { label: "个人职责", value: "用户场景梳理 · 信息架构 · UI设计 · 视觉呈现" },
            { label: "项目时间", value: "2024" },
          ],
          sections: [
            { label: "项目背景", title: "让遛狗成为人与城市重新连接的入口", body: "WOOF-WOOF 从日常遛狗场景出发，将路线记录、宠物友好地点与轻量社交整合在同一套移动体验中。设计重点不是增加功能数量，而是让地图信息、宠物状态与行动入口保持清晰。" },
            { label: "核心体验", title: "以地图组织路线、地点与即时行动", body: "主界面以地图为核心，通过路线、地点标记和宠物状态形成连续使用路径。高饱和绿色负责行动提示，暖橙用于品牌识别和重点反馈。" },
            { label: "视觉系统", title: "在工具感与宠物陪伴感之间保持平衡", body: "圆角容器、地图图钉和宠物角色共同降低导航产品的距离感；界面层级保持克制，使用户在户外移动场景中仍能快速读取。" },
          ],
          back: "返回全部项目",
          nextLabel: "下一个项目",
          nextId: "memory",
          nextTitle: "阿尔兹海默症·记忆的回流",
        },
      },
      memory: {
        title: "阿尔兹海默症·记忆的回流",
        en: "Backflow of Memory — Alzheimer's Publication",
        desc: "基于阿尔兹海默症的共情叙事出版物设计。通过桌面研究、深度访谈与参与式观察，提取12个「记忆锚点」，转译为主题海报、42款邮折系统与叙事物件。以叠化、透明、碎片化图像表达患者感知混乱。",
        detail: {
          meta: [{ label: "项目类型", value: "出版物 · 视觉叙事" }, { label: "个人职责", value: "研究整理 · 编辑设计 · 视觉系统" }, { label: "项目时间", value: "2024" }],
          sections: [
            { label: "项目背景", title: "从记忆与感知出发构建共情叙事", body: "项目关注阿尔兹海默症患者与照护者的日常经验，通过资料整理、访谈与观察建立出版物的内容线索。" },
            { label: "设计策略", title: "以记忆锚点组织碎片化的阅读路径", body: "十二个记忆锚点连接文字、图像与物件；透明、叠化和局部缺失模拟记忆的不稳定状态，同时维持基本的阅读秩序。" },
            { label: "视觉落地", title: "将研究转译为海报、邮折与叙事物件", body: "主题海报、四十二款邮折系统和相关物件共同组成可被翻阅与触摸的记忆档案，让信息通过不同尺度持续展开。" },
          ], back: "返回全部项目", nextLabel: "下一个项目", nextId: "gala", nextTitle: "FRIDAY 缘起·热爱 — 帆书年会视觉",
        },
      },
      "daily-reading": {
        title: "天安云谷（日常）读书节",
        en: "Daily Reading Festival",
        desc: "以「阅读即日常」为核心，为天安云谷社区读书文化节建立持续42天的视觉系统。明亮黄色、模块化信息框与线性书本图形贯穿四类互动活动、主题书单、活动日历和传播海报。",
        detail: {
          meta: [
            { label: "项目类型", value: "活动视觉 · 主视觉 · 系列延展" },
            { label: "个人职责", value: "视觉设计 · 版式系统 · 落地执行" },
            { label: "项目时间", value: "2025.06.20 - 07.31" },
          ],
          sections: [
            { label: "视觉系统", title: "阅读即日常", body: "明亮黄色建立统一场域，黑白信息框组织中英文标题、日期和活动说明。粉、蓝、绿三组辅助色进入书本、手势与生活物件，让多种内容保持清晰识别。" },
            { label: "互动活动", title: "一本书，交换一种日常", body: "以书换咖、换书、换蔬与换植四套主题海报共享同一信息结构，再通过不同生活物件形成独立记忆点。" },
            { label: "活动周期", title: "42天超长节日续航", body: "项目从6月20日持续至7月31日，系列视觉同时容纳每日活动、主题兑换和社区内容，并在长期传播中维持一致识别。" },
            { label: "主题内容", title: "阅读进入一天的不同时间", body: "主题书单把视觉系统延伸至通勤、午间和下班后的具体场景，让阅读与社区日常产生更直接的联系。" },
            { label: "信息设计", title: "复杂信息，也保持同一种语言", body: "完整活动日历将42天内容收拢进统一网格，颜色对应不同兑换主题，使密集信息仍然能够快速检索。" },
          ],
          back: "返回全部项目",
          nextLabel: "下一个项目",
          nextId: "woof",
          nextTitle: "WOOF-WOOF 宠物友好社交APP",
        },
      },
      gala: {
        title: "FRIDAY 缘起·热爱 — 帆书年会视觉",
        en: "FRIDAY Origin & Passion — Fanshu Annual Gala Visual",
        desc: "帆书深圳书友年会「FRIDAY 缘起·热爱」全案主视觉，融合乐队演出与嘉宾分享的跨界视听盛典，覆盖KV、导视、物料、H5等完整触点体系。",
        detail: {
          meta: [{ label: "项目类型", value: "活动视觉 · 主视觉 · 空间图形" }, { label: "个人职责", value: "主视觉 · 物料延展 · 落地执行" }, { label: "项目时间", value: "2025–2026" }],
          sections: [
            { label: "项目背景", title: "为帆书深圳书友年会建立完整活动识别", body: "FRIDAY「缘起·热爱」结合乐队演出与嘉宾分享，需要一套能够同时服务线上传播、现场空间与书友互动的视觉系统。" },
            { label: "设计策略", title: "以统一节奏连接舞台、传播与现场触点", body: "主视觉围绕相聚与热爱展开，通过稳定的色彩、字体和图形关系建立活动识别，并根据横版、竖版和空间尺寸制定延展规则。" },
            { label: "视觉落地", title: "从 KV 延展到邀请函、打卡墙与导视物料", body: "项目覆盖主海报、邀请函、打卡墙、现场导视及传播物料，在多种尺寸和制作条件下保持品牌一致性。" },
          ], back: "返回全部项目", nextLabel: "下一个项目", nextId: "storyteller", nextTitle: "有请讲书人 — 读书月活动视觉",
        },
      },
      storyteller: {
        title: "有请讲书人 — 读书月活动视觉",
        en: "The Storyteller — Reading Month Event Visual",
        desc: "深圳读书月「有请讲书人」阅读分享活动全链路视觉体系，从KV主视觉到现场导视、物料延展与线上宣发，传递阅读与表达的品牌精神。",
        detail: {
          meta: [{ label: "项目类型", value: "活动视觉 · 主视觉 · 品牌延展" }, { label: "个人职责", value: "主视觉 · 规范建立 · 物料延展" }, { label: "项目时间", value: "2025" }],
          sections: [
            { label: "项目背景", title: "为深圳读书月讲书人活动建立统一视觉", body: "「有请讲书人」连接阅读、表达与公众分享，视觉需要覆盖报名传播、比赛流程和现场空间等不同阶段。" },
            { label: "设计策略", title: "用一致的版式语言串联线上与线下体验", body: "设计建立横版与竖版适配规范，通过统一的标题层级、色彩和图形元素，让海报、证件与现场导视形成连续识别。" },
            { label: "视觉落地", title: "覆盖主海报、邀请函、证件与现场导视", body: "从主视觉到不同尺寸的传播物料与现场触点，设计在保证信息清晰的同时强化阅读分享活动的品牌气质。" },
          ], back: "返回全部项目", nextLabel: "下一个项目", nextId: "misc", nextTitle: "杂项",
        },
      },
      misc: {
        title: "杂项",
        en: "Miscellaneous",
        desc: "「非凡大咖」松弛的力量主题KV海报；世界读书日插画海报「给生活松松绑」及年度书单展架系统；南头古城AR实景导航界面设计。跨越演讲视觉、书店物料与数字交互的多元设计实践。",
        detail: {
          meta: [{ label: "项目类型", value: "视觉设计 · UI设计 · AR" }, { label: "个人职责", value: "视觉设计 · 版式设计 · UI界面" }, { label: "项目时间", value: "2024–2025" }],
          sections: [
            { label: "项目背景", title: "面向不同传播场景的多元设计实践", body: "本组项目包含演讲活动视觉、书店日常运营物料和南头古城 AR 导航界面，呈现我在平面与数字触点之间的执行能力。" },
            { label: "设计策略", title: "根据媒介与观看距离重新组织信息层级", body: "海报强调远距离识别，展架兼顾书目信息与空间陈列，移动界面则优先处理路径、定位和即时操作。" },
            { label: "视觉落地", title: "从主题海报、书单展架到移动导航界面", body: "不同项目使用各自的视觉语言，但都围绕清晰的信息结构与真实使用场景展开，形成跨媒介的设计实践记录。" },
          ], back: "返回全部项目", nextLabel: "下一个项目", nextId: "whelk", nextTitle: "WHELK 弧锂实验室 — 品牌视觉设计",
        },
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
      col1Heading: "求职联系",
      col1Email: "sentaolu371@gmail.com",
      col1Phone: "电话 / 微信同号：15875591020",
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
        detail: {
          meta: [{ label: "Project type", value: "Brand Identity · Packaging · Fashion Visual" }, { label: "Role", value: "Brand Concept · Visual Identity · Packaging & Applications" }, { label: "Year", value: "2024–2025" }],
          sections: [
            { label: "Context", title: "A visual system built around the traces left by time", body: "WHELK develops the idea of hunting for lost copies in the deep sea of time across identity, Pop Shop materials, packaging, and a fashion collection." },
            { label: "Design strategy", title: "Translating wear, oxidation, and tidal traces into identity", body: "Faded surfaces, oxidised copper, and tidal erosion inform a restrained system of typography, material texture, and image treatment." },
            { label: "Applications", title: "Extending the identity across packaging, space, and garments", body: "The system covers the core mark, posters, packaging, pop-up applications, and Maison Gesteau 2024–2025 while maintaining one recognisable rhythm." },
          ], back: "Back to all projects", nextLabel: "Next project", nextId: "daily-reading", nextTitle: "Daily Reading Festival",
        },
      },
      woof: {
        title: "WOOF-WOOF — Pet-Friendly Social App",
        en: "WOOF-WOOF — Pet-Friendly Social App",
        desc: "A location-based social platform for pet owners centered on dog-walking scenarios. Targeting urban pet owners aged 25–30, it integrates real-time route sharing, waste spot marking, and pet-friendly space navigation, paired with customizable avatars and an immersive \"lonely mode\".",
        detail: {
          meta: [
            { label: "Project type", value: "UI/UX · Product Visual" },
            { label: "Role", value: "Scenario Mapping · Information Architecture · UI Design · Visual Presentation" },
            { label: "Year", value: "2024" },
          ],
          sections: [
            { label: "Context", title: "Turning a daily walk into a way to reconnect with the city", body: "WOOF-WOOF begins with the everyday dog-walking journey and brings route tracking, pet-friendly places, and lightweight social interaction into one mobile experience. The design prioritises clarity across map information, pet status, and immediate actions." },
            { label: "Core experience", title: "A map-led system for routes, places, and action", body: "The map anchors the experience, connecting walking routes, place markers, and pet status into a continuous flow. Vivid green signals action while warm orange carries brand recognition and priority feedback." },
            { label: "Visual system", title: "Balancing utility with a sense of companionship", body: "Rounded containers, map pins, and pet characters soften the functional navigation layer. A restrained hierarchy keeps the interface readable while the user is moving outdoors." },
          ],
          back: "Back to all projects",
          nextLabel: "Next project",
          nextId: "memory",
          nextTitle: "Backflow of Memory",
        },
      },
      memory: {
        title: "Backflow of Memory — Alzheimer's Publication",
        en: "Backflow of Memory — Alzheimer's Publication",
        desc: "An empathetic narrative publication on Alzheimer's disease. Through desk research, in-depth interviews, and participatory observation, 12 \"memory anchors\" are extracted and translated into thematic posters, a 42-piece postal fold system, and narrative objects. Layering, transparency, and fragmented imagery express the patient's perceptual confusion.",
        detail: {
          meta: [{ label: "Project type", value: "Publication · Visual Narrative" }, { label: "Role", value: "Research Synthesis · Editorial Design · Visual System" }, { label: "Year", value: "2024" }],
          sections: [
            { label: "Context", title: "An empathetic narrative built from memory and perception", body: "The project considers the everyday experiences of people living with Alzheimer's and their carers, using research, interviews, and observation to establish the publication's narrative material." },
            { label: "Design strategy", title: "Memory anchors organise a fragmented reading path", body: "Twelve anchors connect text, image, and objects. Transparency, layering, and partial absence suggest unstable memory while retaining enough structure to guide the reader." },
            { label: "Applications", title: "Research translated into posters, postal folds, and objects", body: "Thematic posters, a forty-two-piece postal fold system, and narrative objects form a tactile archive that unfolds across multiple scales." },
          ], back: "Back to all projects", nextLabel: "Next project", nextId: "gala", nextTitle: "FRIDAY Origin & Passion — Fanshu Annual Gala Visual",
        },
      },
      "daily-reading": {
        title: "Daily Reading Festival",
        en: "Daily Reading Festival",
        desc: "A 42-day visual system built around the idea that reading belongs in everyday community life. Bright yellow, modular information frames, and linear book graphics connect four exchange activities, themed reading lists, the programme calendar, and campaign posters.",
        detail: {
          meta: [
            { label: "Project type", value: "Event Visual · Key Visual · Campaign System" },
            { label: "Role", value: "Visual Design · Layout System · Production Delivery" },
            { label: "Period", value: "20 Jun - 31 Jul 2025" },
          ],
          sections: [
            { label: "Visual system", title: "Reading is daily life", body: "Bright yellow creates a shared field while black-and-white information frames organise bilingual titles, dates, and event details. Pink, blue, and green enter the books, gestures, and everyday objects to keep each content family distinct." },
            { label: "Exchange activities", title: "One book exchanged for one everyday surprise", body: "Four posters for coffee, books, vegetables, and plants share one information structure, with a different everyday object giving each activity its own memory point." },
            { label: "Campaign duration", title: "A festival sustained across 42 days", body: "Running from 20 June to 31 July, the system holds daily events, themed exchanges, and community content while retaining a consistent identity over a long campaign." },
            { label: "Themed content", title: "Reading enters different moments of the day", body: "The themed reading lists extend the system into the commute, midday break, and evening, connecting reading more directly with everyday community life." },
            { label: "Information design", title: "Complex information in one visual language", body: "The full programme calendar gathers 42 days into a single grid, with colour coding for each exchange theme so dense information remains easy to scan." },
          ],
          back: "Back to all projects",
          nextLabel: "Next project",
          nextId: "woof",
          nextTitle: "WOOF-WOOF — Pet-Friendly Social App",
        },
      },
      gala: {
        title: "FRIDAY Origin & Passion — Fanshu Annual Gala",
        en: "FRIDAY Origin & Passion — Fanshu Annual Gala Visual",
        desc: "The key visual for Fanshu Shenzhen's annual gala \"FRIDAY Origin & Passion\"—a cross-disciplinary audiovisual spectacle blending live band performance and guest talks. The system covers KV, signage, materials, and H5 touchpoints.",
        detail: {
          meta: [{ label: "Project type", value: "Event Design · Key Visual · Spatial Graphics" }, { label: "Role", value: "Key Visual · Applications · Production Delivery" }, { label: "Year", value: "2025–2026" }],
          sections: [
            { label: "Context", title: "A complete event identity for the Fanshu Shenzhen annual gala", body: "FRIDAY Origin & Passion combines live music and guest talks, requiring one system for online communication, spatial graphics, and audience interaction." },
            { label: "Design strategy", title: "One visual rhythm across stage, communication, and space", body: "A stable relationship between colour, typography, and graphic elements builds recognition, supported by adaptable rules for landscape, portrait, and spatial formats." },
            { label: "Applications", title: "From key visual to invitations, photo walls, and signage", body: "The project extends across posters, invitations, photo walls, wayfinding, and campaign materials while retaining consistency through production constraints." },
          ], back: "Back to all projects", nextLabel: "Next project", nextId: "storyteller", nextTitle: "The Storyteller — Reading Month Event Visual",
        },
      },
      storyteller: {
        title: "The Storyteller — Reading Month Event Visual",
        en: "The Storyteller — Reading Month Event Visual",
        desc: "The full visual system for Shenzhen Reading Month's \"The Storyteller\" series—from KV and on-site signage to material extensions and online promotion—conveying the brand spirit of reading and expression.",
        detail: {
          meta: [{ label: "Project type", value: "Event Design · Key Visual · Brand Applications" }, { label: "Role", value: "Key Visual · Guidelines · Applications" }, { label: "Year", value: "2025" }],
          sections: [
            { label: "Context", title: "A unified identity for a Shenzhen Reading Month programme", body: "The Storyteller connects reading, expression, and public sharing across campaign communication, competition stages, and the event space." },
            { label: "Design strategy", title: "A consistent layout language connects online and on-site moments", body: "Landscape and portrait rules, title hierarchy, colour, and graphic elements allow posters, credentials, and signage to read as one continuous identity." },
            { label: "Applications", title: "Posters, invitations, credentials, and on-site signage", body: "The system scales from the key visual into communication materials and spatial touchpoints while keeping information clear and recognisable." },
          ], back: "Back to all projects", nextLabel: "Next project", nextId: "misc", nextTitle: "Miscellaneous",
        },
      },
      misc: {
        title: "Miscellaneous",
        en: "Miscellaneous",
        desc: "KV poster for \"Relaxed Power\" keynote; World Book Day illustration poster \"Unbind Life\" and annual book list display system; Nantou Ancient Town AR navigation UI design. Diverse practices spanning keynote visuals, bookstore materials, and digital interaction.",
        detail: {
          meta: [{ label: "Project type", value: "Visual Design · UI Design · AR" }, { label: "Role", value: "Visual Design · Layout Design · UI Interface" }, { label: "Year", value: "2024–2025" }],
          sections: [
            { label: "Context", title: "A set of practices shaped by different communication contexts", body: "This selection combines keynote visuals, bookstore operations, and a Nantou Ancient Town AR interface, showing execution across print and digital touchpoints." },
            { label: "Design strategy", title: "Information hierarchy responds to medium and viewing distance", body: "Posters prioritise distance recognition, displays balance book information with spatial presentation, and mobile screens focus on routes, location, and immediate action." },
            { label: "Applications", title: "From campaign posters and displays to mobile navigation", body: "Each project uses its own visual language while sharing an emphasis on clear structure and the realities of its use context." },
          ], back: "Back to all projects", nextLabel: "Next project", nextId: "whelk", nextTitle: "WHELK Arc Lithium Lab — Brand Visual Design",
        },
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
      col1Heading: "Career Contact",
      col1Email: "sentaolu371@gmail.com",
      col1Phone: "Phone / WeChat: 15875591020",
      col2Heading: "About Me",
      col2Desc: "I am a recent graduate in Visual Communication Design, currently based in Shenzhen. During my studies, I built a solid foundation in brand identity, typography, and UI design. Through internships at Fanshu, Ziniao Tech, and Maigao Imagination, I translated design thinking into real commercial outcomes. I specialize in using visual language to construct brand narratives and continuously explore AIGC-assisted design. I look forward to joining a team that values both creativity and execution—where design solves real problems.",
    },
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("zh");

  useEffect(() => {
    document.documentElement.dataset.lang = lang;
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);

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
