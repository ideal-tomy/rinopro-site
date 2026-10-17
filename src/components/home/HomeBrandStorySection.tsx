import { HOME_BRAND_STORY_STYLES } from "./home-presentation";
import { headingAccentRuleClasses } from "@/lib/ui/heading-accent-rule-styles";
import { homeLandingCopy } from "@/lib/content/home-landing";
import { cn } from "@/lib/utils";

const { brandStory } = homeLandingCopy;

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
          <p className={HOME_BRAND_STORY_STYLES.kicker}>{brandStory.kicker}</p>
          <h2
            id="home-empathy-heading"
            className={cn(
              HOME_BRAND_STORY_STYLES.heading,
              headingAccentRuleClasses.onDarkInline,
              "md:mx-auto",
            )}
          >
            <span className="block">{brandStory.headingLines[0]}</span>
            <span className="block">{brandStory.headingLines[1]}</span>
          </h2>

          <div className={HOME_BRAND_STORY_STYLES.prose}>
            <p className={HOME_BRAND_STORY_STYLES.intro}>{brandStory.intro}</p>

            {brandStory.meanings.map((meaning) => (
              <div key={meaning.lead} className={HOME_BRAND_STORY_STYLES.meaningBlock}>
                <p className={HOME_BRAND_STORY_STYLES.meaningContext}>
                  {meaning.contextLabel}
                </p>
                <p className={HOME_BRAND_STORY_STYLES.meaningLead}>{meaning.lead}</p>
                {"body" in meaning ? (
                  <p className={HOME_BRAND_STORY_STYLES.meaningBody}>{meaning.body}</p>
                ) : (
                  <p className={HOME_BRAND_STORY_STYLES.meaningBody}>
                    {meaning.bodyBeforeEmphasis}
                    <span className={HOME_BRAND_STORY_STYLES.meaningEmphasis}>
                      {meaning.emphasis}
                    </span>
                    {meaning.bodyAfterEmphasis}
                  </p>
                )}
              </div>
            ))}

            <div className={HOME_BRAND_STORY_STYLES.sectionGap}>
              <p className={HOME_BRAND_STORY_STYLES.visionLead}>
                {brandStory.visionLead}
              </p>
              <p className={HOME_BRAND_STORY_STYLES.body}>{brandStory.visionBody}</p>
              <p className={HOME_BRAND_STORY_STYLES.body}>{brandStory.partner}</p>
            </div>

            <div className={HOME_BRAND_STORY_STYLES.closing}>
              {brandStory.closingLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
