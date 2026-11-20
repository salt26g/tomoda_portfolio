import type { CSSProperties } from "react";
import styles from "./AboutSection.module.css";
import { myFont } from "@/fonts";

const HOBBIES = [
  { title: "バドミントン", icon: "/img/top/bad_icon.webp", w: 46, h: 50, chars: 9, text: "社会人サークルで区の社会人大会にも出場しています。" },
  { title: "ゲーム", icon: "/img/top/game_icon.webp", w: 58, h: 37, chars: 10, text: "RPGが特に好きで、最近はゲーム実況もよく見ています。" },
  { title: "食・お酒", icon: "/img/top/gourmet_icon.webp", w: 34, h: 48, chars: 11, text: "定期的に美味しいご飯とお酒を求めてお店巡りをしています。" },
  { title: "散歩", icon: "/img/top/walk_icon.webp", w: 56, h: 37, chars: 9, text: "仕事帰りの荒川の河川敷が一番の散歩コースです。" },
] as const;

const CAREER =
  "高校でデザインを学び、卒業後は旅行会社に入社し、自社ECサイトの運営・制作業務を約4年半経験。その後は事務職を経て、2022年よりECサイトのWebデザイナーとして、商品LPや販促ページのデザイン・コーディングを担当しております。また2019年からは副業でもWebサイトやロゴ、パンフレットなど幅広い制作活動を継続しています。";

const SECTIONS = [
  {
    title: "デザインへのこだわり",
    text: "私は全てのデザインにおいて、自分の主観ではなく、相手が満足できる仕上がりを重視しています。その為なら何度でも修正や再提案を重ね、見る人に依頼者の意図が伝わるデザインを追求しています。",
  },
  {
    title: "私のできること",
    text: "企画・構成からデザイン、コーディングまで一貫して対応できることが強みです。また幅広いデザイン経験を活かし、目的やターゲットに合わせた多様な表現も得意です。新しい知識や技術も積極的に学び、常に柔軟な発想と実践力の向上を心がけています。",
  },
] as const;

const SKILLS = [
  { name: "Photoshop", rating: 4.5, text: "実務使用歴約7年。WEBサイト、商品LPなどのデザイン作業に頻繁に使用しています。" },
  { name: "Illustrator", rating: 4.5, text: "実務使用歴約7年。印刷物、ロゴ、アイコンなどのデザイン作業に頻繁に使用しています。" },
  { name: "Figma", rating: 1, text: "現在勉強途中です。実務で使用したことはまだありませんが、基本操作の知識は保有しています。" },
  { name: "HTML5/CSS", rating: 5, text: "実務使用歴約9年。手打ち可能ですが、現在は作業の多くを生成AIと進めています。" },
  { name: "JavaScript/jQuery", rating: 4, text: "実務使用歴約9年。スライダーなどの動きは自分で実装できますが、現在は作業の多くを生成AIと進めています。" },
  { name: "PHP", rating: 1.5, text: "実務使用歴1年未満。既存コードの読解や、テキスト・パーツの更新や軽微な修正が可能です。" },
  { name: "Google Analytics", rating: 2, text: "実務使用歴2年。計測タグの設置、基本数値のPVや流入元などの確認ができます。" },
  { name: "Git/GitHub", rating: 2, text: "実務使用歴1年。個人制作でのバージョン管理push/pull/ブランチ作成などの基本操作が可能です。" },
  { name: "生成AIツール", rating: 3, text: "実務使用歴1年。コード作成や、構成・ライティング案など業務効率化に活用しています。" },
] as const;

function Lines({ text }: { text: string }) {
  const sentences = text.match(/[^。]+。?/g) ?? [];
  return (
    <>
      {sentences.map((sentence, i) => (
        <span key={i} className={styles.line}>
          {sentence}
        </span>
      ))}
    </>
  );
}

const STAR = "12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26";
const STAR_SIZE = 26;
const STAR_GAP = 5;

function Stars({ value }: { value: number }) {
  const width = STAR_SIZE * 5 + STAR_GAP * 4;
  return (
    <svg
      className={styles.stars}
      width={width}
      height={STAR_SIZE}
      viewBox={`0 0 ${width} ${STAR_SIZE}`}
      role="img"
      aria-label={`5段階中${value}`}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const filled = Math.min(1, Math.max(0, value - i));
        return (
          <svg
            key={i}
            x={i * (STAR_SIZE + STAR_GAP)}
            y={0}
            width={STAR_SIZE}
            height={STAR_SIZE}
            viewBox="0 0 24 24"
          >
            {filled > 0 && (
              <svg width={24 * filled} height={24} viewBox={`0 0 ${24 * filled} 24`}>
                <polygon points={STAR} fill="currentColor" />
              </svg>
            )}
            <polygon
              points={STAR}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        );
      })}
    </svg>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className={`${styles.about} ${myFont.variable}`}>
      <h2 className={styles.title}>ABOUT</h2>

      <div id="profile" className={styles.profile}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.avatar}
          src="/img/top/me_icon.webp"
          alt="友田 知怜"
          width={168}
          height={168}
          loading="lazy"
          decoding="async"
        />
        <div>
          <p className={styles.name}>
            友田 知怜<span className={styles.nameEn}>Chisato Tomoda</span>
          </p>
          <dl className={styles.facts}>
            <div>
              <dt>生年月日</dt>
              <dd>1996.6.26</dd>
            </div>
            <div>
              <dt>出身地</dt>
              <dd>東京都三鷹市</dd>
            </div>
          </dl>
        </div>
      </div>

      <ul className={styles.hobbies}>
        {HOBBIES.map((h) => (
          <li key={h.title} className={styles.hobby}>
            <span className={styles.icon}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={h.icon} width={h.w} height={h.h} alt="" />
            </span>
            <h3 className={styles.hobbyTitle}>{h.title}</h3>
            <p className={styles.hobbyText} style={{ "--chars": h.chars } as CSSProperties}>
              <Lines text={h.text} />
            </p>
          </li>
        ))}
      </ul>

      <div className={styles.body}>
        <p className={styles.text}>
          <Lines text={CAREER} />
        </p>
        <hr className={styles.rule} />
        {SECTIONS.map((s) => (
          <div key={s.title} className={styles.block}>
            <h3 className={styles.sub}>{s.title}</h3>
            <p className={styles.text}>
              <Lines text={s.text} />
            </p>
          </div>
        ))}
      </div>

      <div id="skill" className={styles.skill}>
        <h3 className={styles.skillTitle}>SKILL</h3>
        <ul className={styles.skillGrid}>
          {SKILLS.map((s) => (
            <li key={s.name} className={styles.skillCard}>
              <h4 className={styles.skillName}>{s.name}</h4>
              <Stars value={s.rating} />
              <p className={styles.skillText}>
                <Lines text={s.text} />
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
