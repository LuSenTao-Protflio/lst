import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LightRays from "./components/LightRays";

const portfolioImages = import.meta.glob("../assets/portfolio-pages/*.{jpg,png,jpeg}", {
  eager: true,
  import: "default",
});
const eventImages = import.meta.glob("../assets/event-kv/*.{jpg,png,jpeg}", {
  eager: true,
  import: "default",
});
const getAsset = (collection, name) => collection[`../assets/${name}`];
const portfolioAsset = (name) => getAsset(portfolioImages, `portfolio-pages/${name}`);
const eventAsset = (name) => getAsset(eventImages, `event-kv/${name}`);

const brandAsset = (name) => `/brand/${name}`;

const projects = [
  {
    id: "whelk",
    order: "01",
    type: "Branding · Packaging · Fashion",
    name: "WHELK 弧螺实验室",
    en: "WHELK Vintage Boutique",
    preview: portfolioAsset("5.jpg"),
    intro: "围绕古着品牌「在时间的深海里搜捕遗失的副本」的核心理念，构建从Logo标识到Pop Shop物料、服装系列Maison Gesteau 2024–2025的完整品牌全案。以触觉拾荒为方法论，将潮汐磨损、铜器氧化层等时间痕迹转化为视觉语言。",
    feature: brandAsset("whelk-vi-cover.png"),
    gallery: [
      { src: brandAsset("whelk-logo-grid.png"), alt: "WHELK 标志标准制图", wide: false },
      { src: brandAsset("whelk-neon.png"), alt: "WHELK 霓虹灯牌", wide: false },
      { src: portfolioAsset("5.jpg"), alt: "WHELK 项目页 1", wide: true },
      { src: portfolioAsset("6.jpg"), alt: "WHELK 项目页 2", wide: false },
      { src: portfolioAsset("7.jpg"), alt: "WHELK 项目页 3", wide: false },
    ],
    tags: ["Logo 标识", "Pop Shop 物料", "服装系列", "品牌 VI 手册", "TAIPEI · SHANGHAI · TOKYO"],
  },
  {
    id: "woof",
    order: "02",
    type: "UI/UX Design · Product Design",
    name: "WOOF-WOOF",
    en: "Pet Owner Social Platform",
    preview: portfolioAsset("13.jpg"),
    intro: "基于遛狗场景的宠物主人同城社交平台。聚焦25–30岁一线城市养宠核心群体，通过遛狗地图整合实时路线共享、排泄点标记与宠物友好空间导航，结合定制化虚拟形象与「孤独模式」沉浸体验，构建从云端互动到真实地理空间的场景化服务生态。",
    feature: portfolioAsset("14.jpg"),
    gallery: [
      { src: portfolioAsset("13.jpg"), alt: "WOOF-WOOF 项目页 1", wide: true },
      { src: portfolioAsset("15.jpg"), alt: "WOOF-WOOF 项目页 2", wide: false },
      { src: portfolioAsset("16.jpg"), alt: "WOOF-WOOF 项目页 3", wide: false },
      { src: portfolioAsset("17.jpg"), alt: "WOOF-WOOF 项目页 4", wide: false },
      { src: portfolioAsset("18.jpg"), alt: "WOOF-WOOF 项目页 5", wide: true },
    ],
    tags: ["遛狗地图", "宠物友好导航", "虚拟形象 DIY", "孤独模式", "Figma 原型", "动态分享"],
  },
  {
    id: "memory",
    order: "03",
    type: "Publication Design · Visual Narrative",
    name: "记忆的回流",
    en: "Backflow of Memory",
    preview: portfolioAsset("21.jpg"),
    intro: "基于阿尔兹海默症的共情叙事出版物设计。通过桌面研究、深度访谈与参与式观察，提取12个「记忆锚点」，转译为主题海报、42款邮折系统与叙事物件。以叠化、透明、碎片化图像表达患者感知混乱——不是单纯的怀旧叙事，而是关于遗忘、照护与共情的视觉实践。",
    feature: portfolioAsset("22.jpg"),
    gallery: [
      { src: portfolioAsset("21.jpg"), alt: "出版物项目页 1", wide: true },
      { src: portfolioAsset("23.jpg"), alt: "出版物项目页 2", wide: false },
      { src: portfolioAsset("24.jpg"), alt: "出版物项目页 3", wide: false },
      { src: portfolioAsset("25.jpg"), alt: "出版物项目页 4", wide: false },
      { src: portfolioAsset("26.jpg"), alt: "出版物项目页 5", wide: true },
    ],
    tags: ["12 记忆锚点", "42 款邮折", "系列海报", "硫酸纸标本", "信息设计", "世界阿尔兹海默病日"],
  },
  {
    id: "friday",
    order: "04",
    type: "Event Design · Spatial Graphics",
    name: "FRIDAY 2026 缘起·热爱",
    en: "Fanshu Annual Gala",
    preview: portfolioAsset("30.jpg"),
    intro: "帆书深圳书友年会全案主视觉及空间物料设计。在帆书线下品牌升级背景下，为350位核心书友策划跨界视听盛典，融合乐队演出与嘉宾分享。全套物料含打卡墙6m×3.5m、H5邀请函、珠光纸门票、帆布袋等，以高饱和视觉语言激活书友社群。",
    feature: brandAsset("event-kv-extend.jpg"),
    eventInsert: {
      eyebrow: "Annual Meeting Key Visual",
      title: "缘起 · 热爱",
      copy: "以暖红色调与颗粒化光斑建立年会主视觉氛围，向流程页、竖版物料与延展触点推进，保持信息层级与情绪感受的统一。书店矩阵覆盖福田·景田、龙岗·坂田、南山·粤海。",
      hero: eventAsset("event-kv-cover.png"),
      overview: eventAsset("event-kv-overview.png"),
    },
    gallery: [
      { src: portfolioAsset("30.jpg"), alt: "年会项目页 1", wide: true },
      { src: portfolioAsset("31.jpg"), alt: "年会项目页 2", wide: false },
      { src: portfolioAsset("32.jpg"), alt: "年会项目页 3", wide: false },
      { src: portfolioAsset("33.jpg"), alt: "年会项目页 4", wide: false },
    ],
    tags: ["主视觉桁架", "H5 邀请函", "门票设计", "帆布袋", "书店矩阵", "300-400人规模"],
  },
  {
    id: "storyteller",
    order: "05",
    type: "Event Visual System · Shenzhen Reading Month",
    name: "有请讲书人",
    en: "Storyteller · Reading Month",
    preview: portfolioAsset("36.jpg"),
    intro: "第26届深圳读书月「有请讲书人」阅读分享活动全链路视觉系统。建立具有识别度与传播性的视觉体系，覆盖KV主视觉、户外导视、工作证件及电子邀请函。色彩系统：#EED795 / #D58346 / #6887BE，体现阅读的温度与深度。",
    feature: portfolioAsset("37.jpg"),
    gallery: [
      { src: portfolioAsset("36.jpg"), alt: "讲书人项目页 1", wide: true },
      { src: portfolioAsset("38.jpg"), alt: "讲书人项目页 2", wide: false },
      { src: portfolioAsset("39.jpg"), alt: "讲书人项目页 3", wide: false },
      { src: portfolioAsset("40.jpg"), alt: "讲书人项目页 4", wide: false },
    ],
    tags: ["KV 主视觉", "导视系统", "工作证设计", "横竖版延展规范", "#EED795", "张海山锐线体"],
  },
  {
    id: "speech",
    order: "06",
    type: "Key Visual · Poster Design",
    name: "非凡大咖演讲",
    en: "Extraordinary Speech",
    preview: portfolioAsset("44.jpg"),
    intro: "「松弛的力量 幸福的勇气」——开卷即非凡·2025深圳站。以深海灯塔意象构建宁静与启发并存的视觉氛围，通过克制而有力的构图传达知识的深远与阅读带来的内心笃定。",
    feature: portfolioAsset("43.jpg"),
    gallery: [
      { src: portfolioAsset("44.jpg"), alt: "非凡大咖 项目页 1", wide: true },
      { src: portfolioAsset("45.jpg"), alt: "非凡大咖 项目页 2", wide: false },
    ],
    tags: ["KV 海报", "深海灯塔", "活动视觉", "帆书"],
  },
  {
    id: "bookstore",
    order: "07",
    type: "Poster · Illustration · Display",
    name: "书店日常活动",
    en: "Bookstore Daily Events",
    preview: portfolioAsset("46.jpg"),
    intro: "2024世界读书日「给生活松松绑」插画海报——以书本打开为场景入口，融入草地、风车、风筝元素，传递阅读的轻盈感。年度书单展架系统涵盖热度榜、新鲜引力榜、典藏之作榜，线下A架完整呈现。",
    feature: portfolioAsset("47.jpg"),
    gallery: [
      { src: portfolioAsset("46.jpg"), alt: "书店活动 项目页 1", wide: true },
      { src: portfolioAsset("47.jpg"), alt: "书店活动 项目页 2", wide: false },
      { src: portfolioAsset("48.jpg"), alt: "书店活动 项目页 3", wide: false },
    ],
    tags: ["世界读书日", "插画海报", "年度书单展架", "A 架应用", "Slogan: 给生活松松绑"],
  },
  {
    id: "nancheng",
    order: "08",
    type: "UI Design · AR Navigation",
    name: "南头古城漫游",
    en: "Nantou Ancient City AR Tour",
    preview: portfolioAsset("49.jpg"),
    intro: "古城小巷路线指引与AR实景导航界面设计。支持民宿、餐饮、非餐饮分类筛选，实时路径指引与空间信息呈现，将古城漫游体验数字化——25 meters Walking straight。",
    feature: portfolioAsset("50.jpg"),
    gallery: [
      { src: portfolioAsset("49.jpg"), alt: "南头古城 项目页 1", wide: true },
      { src: portfolioAsset("50.jpg"), alt: "南头古城 项目页 2", wide: false },
      { src: portfolioAsset("51.jpg"), alt: "南头古城 项目页 3", wide: false },
    ],
    tags: ["路线指引", "AR 导航", "分类筛选", "UI 界面"],
  },
];

const infoColumns = [
  {
    title: "Education",
    lines: [
      "深圳大学 / 视觉传达设计",
      "GPA 3.92 / 4.5（专业前列）",
      "主修：版式设计、出版物设计、插画设计、字体设计、品牌营销与策划",
    ],
  },
  {
    title: "Experience",
    lines: [
      "帆书深圳运营中心 / 品牌视觉设计师",
      "紫鸟信息科技 / AIGC 视觉设计师",
      "麦高创想家 / 视觉执行设计师",
    ],
  },
  {
    title: "Tools",
    lines: ["Adobe Ps / Ai / Id / Spline / Blender / C4D / Midjourney / Figma / Codex"],
  },
  {
    title: "Focus",
    lines: ["品牌全案 / 活动主视觉 / 出版物设计 / UI/UX / 线下物料延展 / AIGC 视觉探索"],
  },
  {
    title: "Contact",
    lines: ["15875591020", "sentaolu371@gmail.com", "深圳市南山区"],
  },
  {
    title: "Awards",
    lines: ["华为智能基座社团 宣传部部长", "智慧化口腔医疗平台比赛 广告银奖"],
  },
];

function App() {
  const [theme, setTheme] = useState("night");
  const prefersReducedMotion = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  const canUseFancyCursor = useMemo(
    () => !prefersReducedMotion && window.matchMedia("(pointer: fine)").matches,
    [prefersReducedMotion],
  );
  const [preview, setPreview] = useState(projects[0]);
  const [activeId, setActiveId] = useState(projects[0].id);
  const sectionRefs = useRef({});

  useEffect(() => {
    document.body.dataset.theme = theme;
    return () => { delete document.body.dataset.theme; };
  }, [theme]);

  useEffect(() => {
    if (canUseFancyCursor) {
      document.body.classList.add("has-fancy-cursor");
      return () => document.body.classList.remove("has-fancy-cursor");
    }
    document.body.classList.remove("has-fancy-cursor");
    return undefined;
  }, [canUseFancyCursor]);

  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    const sections = projects.map((p) => sectionRefs.current[p.id]).filter(Boolean);
    if (!sections.length) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (!visible.length) return;
        const nextId = visible[0].target.id;
        const nextProject = projects.find((p) => p.id === nextId);
        if (!nextProject) return;
        setActiveId(nextId);
        setPreview(nextProject);
      },
      { threshold: [0.2, 0.4, 0.6], rootMargin: "-18% 0px -45% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="返回顶部">
          <span className="brand-cn">卢森涛</span>
          <span className="brand-en">Luoison</span>
        </a>
        <div className="topbar-actions">
          <nav className="nav">
            <a href="#work">Work</a>
            <a href="#info">Info</a>
          </nav>
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme((c) => (c === "night" ? "day" : "night"))}
            aria-label={theme === "night" ? "切换到白天模式" : "切换到黑夜模式"}
          >
            <span className={theme === "night" ? "is-active" : ""}>Night</span>
            <span className={theme === "day" ? "is-active" : ""}>Day</span>
          </button>
        </div>
      </header>

      <main id="top">
        {/* ── Hero ── */}
        <section className="hero">
          <LightRays
            className="hero-plasma-surface"
            raysOrigin="top-center"
            raysColor={theme === "night" ? "#ffffff" : "#f8f3ea"}
            raysSpeed={theme === "night" ? 1.7 : 1.35}
            lightSpread={theme === "night" ? 2.6 : 2.9}
            rayLength={theme === "night" ? 4.9 : 4.2}
            pulsating
            fadeDistance={theme === "night" ? 2 : 1.8}
            saturation={theme === "night" ? 1.3 : 1.05}
            followMouse
            mouseInfluence={theme === "night" ? 0.25 : 0.2}
            noiseAmount={theme === "night" ? 0.6 : 0.18}
            distortion={0}
          >
            <motion.div
              className="hero-copy"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <div className="hero-heading">
                <p className="eyebrow">Visual Communication Design · 2026</p>
                <h1>卢森涛<br />Graphic Design<br />Portfolio</h1>
              </div>
              <div className="hero-meta">
                <p>品牌设计 · UI 设计 · 出版物设计 · 活动视觉</p>
                <p>深圳大学视觉传达设计 / 2022.06 — 2026.06</p>
                <p>热衷于探索设计在物理空间中的多种可能</p>
              </div>
            </motion.div>
          </LightRays>
        </section>

        {/* ── Stats Bar ── */}
        <motion.div
          className="stats-bar"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          {[
            { num: "3.92", label: "GPA" },
            { num: "8", label: "Projects" },
            { num: "3", label: "Internships" },
            { num: "48", label: "Pages" },
          ].map((s, i) => (
            <div key={s.label} className="stat-item">
              <span className="stat-num">{s.num}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </motion.div>

        {/* ── Work Index ── */}
        <section className="work-index" id="work">
          <div className="section-label">
            <span>Selected Projects</span>
            <span>2022 – 2026</span>
          </div>
          <div className="work-layout">
            <div className="project-list">
              {projects.map((project, i) => (
                <motion.a
                  key={project.id}
                  className={`project-row${activeId === project.id ? " is-active" : ""}`}
                  href={`#${project.id}`}
                  onMouseEnter={() => setPreview(project)}
                  onFocus={() => setPreview(project)}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 0.61, 0.36, 1] }}
                >
                  <div className="project-row-main">
                    <h2>{project.name}</h2>
                    <p>{project.type}</p>
                  </div>
                  <span className="project-year">{project.order}</span>
                </motion.a>
              ))}
            </div>

            <aside className="work-preview" aria-live="polite">
              <motion.div
                className="work-preview-media"
                key={preview.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
              >
                <img src={preview.preview} alt={`${preview.name} 预览`} loading="eager" />
              </motion.div>
              <div className="work-preview-meta">
                <div>
                  <p className="eyebrow">{preview.type.split(" · ")[0]}</p>
                  <p className="work-preview-name">{preview.name}</p>
                </div>
                <p className="work-preview-note">{preview.order} / {projects.length}</p>
              </div>
            </aside>
          </div>
        </section>

        {/* ── Project Details ── */}
        <AnimatePresence>
          {projects.map((project) => (
            <motion.section
              key={project.id}
              className="project-detail"
              id={project.id}
              ref={(node) => { sectionRefs.current[project.id] = node; }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                className="detail-head"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div>
                  <p className="eyebrow">{project.order} / {project.type}</p>
                  <h2>{project.name}</h2>
                  <p className="detail-en">{project.en}</p>
                </div>
                <p>{project.intro}</p>
              </motion.div>

              {project.tags && (
                <motion.div
                  className="detail-tags"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </motion.div>
              )}

              <motion.div
                className="detail-feature"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                <img src={project.feature} alt={`${project.name} 章节封面`} loading="lazy" />
              </motion.div>

              {project.eventInsert ? (
                <div className="event-insert">
                  <motion.div
                    className="event-insert-copy"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <p className="eyebrow">{project.eventInsert.eyebrow}</p>
                    <h3>{project.eventInsert.title}</h3>
                    <p>{project.eventInsert.copy}</p>
                  </motion.div>
                  <motion.figure
                    className="event-insert-hero"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <img src={project.eventInsert.hero} alt="年会主 KV" loading="lazy" />
                  </motion.figure>
                  <motion.figure
                    className="event-insert-tall"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <img src={project.eventInsert.overview} alt="年会 KV 延展总览" loading="lazy" />
                  </motion.figure>
                </div>
              ) : null}

              <div className="detail-gallery">
                {project.gallery.map((item, i) => (
                  <motion.figure
                    key={item.src}
                    className={`gallery-item${item.wide ? " wide" : ""}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                    whileHover={{ y: -4 }}
                  >
                    <img src={item.src} alt={item.alt} loading="lazy" />
                  </motion.figure>
                ))}
              </div>
            </motion.section>
          ))}
        </AnimatePresence>

        {/* ── Info ── */}
        <section className="info" id="info">
          <div className="section-label">
            <span>Info</span>
            <span>Shenzhen / Guangzhou</span>
          </div>
          <motion.div
            className="info-grid"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {infoColumns.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <p className="eyebrow">{item.title}</p>
                <p>
                  {item.lines.map((line, idx) => (
                    <FragmentLine key={`${item.title}-${idx}`} line={line} />
                  ))}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>
    </div>
  );
}

function FragmentLine({ line }) {
  return <>{line}<br /></>;
}

export default App;
