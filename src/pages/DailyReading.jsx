import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "../i18n";
import hero from "../assets/daily-reading/hero.webp";
import systemWhite from "../assets/daily-reading/system-white.webp";
import exchangeCoffee from "../assets/daily-reading/exchange-coffee.webp";
import exchangeBook from "../assets/daily-reading/exchange-book.webp";
import exchangeVegetable from "../assets/daily-reading/exchange-vegetable.webp";
import exchangePlant from "../assets/daily-reading/exchange-plant.webp";
import fortyTwoDays from "../assets/daily-reading/forty-two-days.webp";
import themeCommute from "../assets/daily-reading/theme-commute.webp";
import themeMidday from "../assets/daily-reading/theme-midday.webp";
import themeEvening from "../assets/daily-reading/theme-evening.webp";
import schedule from "../assets/daily-reading/schedule.webp";
import closingMark from "../assets/daily-reading/closing-mark.webp";

const copy = {
  zh: {
    role: "视觉设计与落地执行",
    exchange: [
      { title: "以书换咖", en: "Books for coffee" },
      { title: "以书换书", en: "Books for books" },
      { title: "以书换蔬", en: "Books for vegetables" },
      { title: "以书换植", en: "Books for plants" },
    ],
    themes: ["元气满满通勤路", "午间充电10分钟", "下班放松小剧场"],
    heroAlt: "天安云谷日常读书节横版主视觉",
    systemAlt: "日常读书节白底主视觉版本",
    durationAlt: "日常读书节42天活动周期海报",
    scheduleAlt: "日常读书节完整活动日历",
    closingAlt: "日常读书节书本与手势图形标记",
    days: "天",
    ending: "阅读即日常。",
  },
  en: {
    role: "Visual Design and Production Delivery",
    exchange: [
      { title: "Coffee", en: "Books for coffee" },
      { title: "Books", en: "Books for books" },
      { title: "Vegetables", en: "Books for vegetables" },
      { title: "Plants", en: "Books for plants" },
    ],
    themes: ["Energetic commute", "10-minute midday charge", "Evening unwind mini-play"],
    heroAlt: "Landscape key visual for the Daily Reading Festival",
    systemAlt: "White-background version of the Daily Reading Festival key visual",
    durationAlt: "Poster showing the 42-day festival duration",
    scheduleAlt: "Full Daily Reading Festival programme calendar",
    closingAlt: "Book and hand gesture graphic mark",
    days: "days",
    ending: "Reading is daily life.",
  },
};

const exchangeImages = [exchangeCoffee, exchangeBook, exchangeVegetable, exchangePlant];
const themeImages = [themeCommute, themeMidday, themeEvening];

function Reveal({ children, className = "", delay = 0, as = "div" }) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as] || motion.div;

  return (
    <Component
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.68, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  );
}

export default function DailyReading({ projectT }) {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const pageCopy = copy[lang] || copy.zh;
  const sections = projectT?.detail?.sections || [];
  const meta = projectT?.detail?.meta || [];

  return (
    <main className="daily-reading-page">
      <section className="daily-reading-hero daily-reading-shell" aria-labelledby="daily-reading-title">
        <motion.figure
          className="daily-reading-hero-media"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src={hero} alt={pageCopy.heroAlt} width="2800" height="1484" fetchPriority="high" />
        </motion.figure>
      </section>

      <section className="daily-reading-intro daily-reading-shell">
        <Reveal className="daily-reading-intro-copy">
          <p className="daily-reading-kicker">{pageCopy.role}</p>
          <h1 id="daily-reading-title">{projectT?.title || "天安云谷（日常）读书节"}</h1>
          <p className="daily-reading-lead">{projectT?.desc}</p>
        </Reveal>
        <Reveal as="dl" className="daily-reading-facts" delay={0.08}>
          {meta.map((item) => (
            <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>
          ))}
        </Reveal>
      </section>

      <section className="daily-reading-system daily-reading-shell">
        <Reveal className="daily-reading-section-copy">
          <span>{sections[0]?.label}</span>
          <h2>{sections[0]?.title}</h2>
          <p>{sections[0]?.body}</p>
        </Reveal>
        <Reveal as="figure" className="daily-reading-system-image">
          <img src={systemWhite} alt={pageCopy.systemAlt} width="2400" height="1271" loading="lazy" />
        </Reveal>
      </section>

      <section className="daily-reading-exchanges daily-reading-shell">
        <Reveal className="daily-reading-section-copy daily-reading-section-copy-narrow">
          <span>{sections[1]?.label}</span>
          <h2>{sections[1]?.title}</h2>
          <p>{sections[1]?.body}</p>
        </Reveal>
        <div className="daily-reading-exchange-grid">
          {exchangeImages.map((src, index) => (
            <Reveal as="figure" className="daily-reading-poster" delay={(index % 2) * 0.07} key={pageCopy.exchange[index].title}>
              <div className="daily-reading-image-window">
                <img src={src} alt={`${projectT?.title || "日常读书节"} ${pageCopy.exchange[index].title}`} width="1060" height="1800" loading="lazy" />
              </div>
              <figcaption>
                <strong>{pageCopy.exchange[index].title}</strong>
                <span>{pageCopy.exchange[index].en}</span>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="daily-reading-duration daily-reading-shell">
        <Reveal className="daily-reading-duration-copy">
          <div className="daily-reading-number"><strong>42</strong><span>{pageCopy.days}</span></div>
          <h2>{sections[2]?.title}</h2>
          <p>{sections[2]?.body}</p>
        </Reveal>
        <Reveal as="figure" className="daily-reading-duration-image" delay={0.08}>
          <img src={fortyTwoDays} alt={pageCopy.durationAlt} width="1392" height="3200" loading="lazy" />
        </Reveal>
      </section>

      <section className="daily-reading-themes daily-reading-shell">
        <Reveal className="daily-reading-section-copy">
          <span>{sections[3]?.label}</span>
          <h2>{sections[3]?.title}</h2>
          <p>{sections[3]?.body}</p>
        </Reveal>
        <div className="daily-reading-theme-grid">
          {themeImages.map((src, index) => (
            <Reveal as="figure" className="daily-reading-theme-poster" delay={index * 0.06} key={pageCopy.themes[index]}>
              <img src={src} alt={`${projectT?.title || "日常读书节"} ${pageCopy.themes[index]}`} width="1060" height="1800" loading="lazy" />
              <figcaption>{pageCopy.themes[index]}</figcaption>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="daily-reading-schedule daily-reading-shell">
        <Reveal className="daily-reading-schedule-heading">
          <span>{sections[4]?.label}</span>
          <h2>{sections[4]?.title}</h2>
          <p>{sections[4]?.body}</p>
        </Reveal>
        <Reveal as="figure" className="daily-reading-schedule-image">
          <img src={schedule} alt={pageCopy.scheduleAlt} width="1392" height="3200" loading="lazy" />
        </Reveal>
      </section>

      <section className="daily-reading-closing daily-reading-shell">
        <Reveal as="figure" className="daily-reading-closing-image">
          <img src={closingMark} alt={pageCopy.closingAlt} width="2600" height="2257" loading="lazy" />
        </Reveal>
        <Reveal className="daily-reading-closing-copy" delay={0.08}>
          <h2>{pageCopy.ending}</h2>
        </Reveal>
      </section>
    </main>
  );
}
