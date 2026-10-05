import { HOME_BRAND_STORY_STYLES } from "./home-presentation";
/** AXEONの名前の由来と理念。既存のアンカー・見出しIDは維持する。 */
export function HomeBrandStorySection() {
  return (
    <section
      id="about"
      className="scroll-mt-32"
      aria-labelledby="home-empathy-heading"
    >
      <article className="relative w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/top/mission.jpg')" }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/60 backdrop-blur-[1px]"
          aria-hidden
        />
        <div className={HOME_BRAND_STORY_STYLES.container}>
          <h2
            id="home-empathy-heading"
            className={HOME_BRAND_STORY_STYLES.heading}
          >
            <span className="inline-block">AXEON という名前に込めた、</span>
            <br />
            <span className="inline-block">二つの意味。</span>
          </h2>
          <div
            className={HOME_BRAND_STORY_STYLES.underline}
            aria-hidden
          />
          <div className={HOME_BRAND_STORY_STYLES.body}>
            <p className="font-semibold text-white">
              AXEONという名前には、二つの読み方があります。
            </p>
            <p>
              英語で読めば、Axis On（アクシスオン）。
              <br />
              
              軸を持ち、前へ進む。
              
              環境が揺れても、流行が変わっても、
              
              意思決定の中心を見失わずに
              
              進み続けるための言葉です。
            </p>
            <p>
              日本語で読めば、軸 恩（じくおん）。
              <br />
              
              私たちは、社会や人から多くの機会を受け取り、
              
              育てられてきました。
              
              だからこそ、その恩を次の世代へ返していく。
              
              この恩送りの循環を、事業を通じて実装することが、
              
              私たちの使命です。
            </p>
            <p>
              私たちが目指すのは、
              
              AIで人の仕事を奪う未来ではありません。
              
              定型業務、転記、検索、要約、整理をAIに任せ、
              
              創造、判断、関係構築、本質的な議論へ、
              
              人の時間を返していくこと。
            </p>
            <p>
              AXEONは、企業の軸を共につくるパートナーとして、
              
              戦略と実装を同じテーブルに置き、
              理想を現場で動く仕組みに変えていきます。
            </p>
            <p className={HOME_BRAND_STORY_STYLES.closing}>
              日本の国力を上げる。
              <br />
              この言葉を、私たちは理念ではなく、実務で証明します。
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}

