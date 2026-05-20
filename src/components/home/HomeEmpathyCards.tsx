import { HomeLandingSectionHeading } from "@/components/home/HomeLandingSectionHeading";

export function HomeEmpathyCards() {
  return (
    <section
      id="about"
      className="py-20 md:py-[120px] scroll-mt-32"
      aria-labelledby="home-empathy-heading"
    >
      <HomeLandingSectionHeading
        id="home-empathy-heading"
        index="02"
        kicker="ABOUT NAME / MISSION"
        title="AXEON という名前に込めた、二つの意味。"
      />

      <article className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/top_about.jpg')" }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/60 backdrop-blur-[1px]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-4xl px-6 py-14 text-center md:px-12 md:py-20">
          <div className="space-y-6 text-[16px] leading-[1.9] text-white md:text-[17px]">
            <p className="font-semibold text-white">
              AXEONという名前には、二つの読み方があります。
            </p>
            <p>
              英語で読めば、Axis × On（アクシス・オン）。
              <br className="md:hidden" />
              軸を持ち、前へ進む。
              <br className="md:hidden" />
              環境が揺れても、流行が変わっても、
              <br className="md:hidden" />
              意思決定の中心を見失わずに
              <br className="md:hidden" />
              進み続けるための言葉です。
            </p>
            <p>
              日本語で読めば、軸 × 恩（じく・おん）。
              <br className="md:hidden" />
              私たちは、社会や人から多くの機会を受け取り、
              <br className="md:hidden" />
              育てられてきました。
              <br className="md:hidden" />
              だからこそ、その恩を次の世代へ返していく。
              <br className="md:hidden" />
              この恩送りの循環を、事業を通じて実装することが、
              <br className="md:hidden" />
              私たちの使命です。
            </p>
            <p>
              私たちが目指すのは、
              <br className="md:hidden" />
              AIで人の仕事を奪う未来ではありません。
              <br className="md:hidden" />
              定型業務、転記、検索、要約、整理をAIに任せ、
              <br className="md:hidden" />
              創造、判断、関係構築、本質的な議論へ、
              <br className="md:hidden" />
              人の時間を返していくこと。
            </p>
            <p>
              AXEONは、企業の軸を共につくるパートナーとして、
              <br className="md:hidden" />
              戦略と実装を同じテーブルに置き、
              理想を現場で動く仕組みに変えていきます。
            </p>
            <p className="pt-2 text-[18px] font-semibold text-white md:text-[20px]">
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
