"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { Laptop, UserRound } from "lucide-react";
import { aboutCopy } from "@/lib/content/site-copy";
import flip from "../services/services-page.module.css";
import { AboutSectionHeader } from "./AboutSectionHeader";
import { aboutReveal } from "./about-presentation";
import { useAboutTeamCardFlip } from "./useAboutTeamCardFlip";
import styles from "./about-page.module.css";

const { teamModel } = aboutCopy;
const roles = [
  {
    id: "strategy",
    ...teamModel.strategyLead,
    Icon: UserRound,
    coverSrc: "/images/about/about01.png",
  },
  {
    id: "engineering",
    ...teamModel.aiEngineeringLead,
    Icon: Laptop,
    coverSrc: "/images/about/abput02png.png",
  },
];

function TeamRoleCard({
  id,
  title,
  bullets,
  coverSrc,
}: (typeof roles)[number]) {
  const { display, stage } = useAboutTeamCardFlip(title);
  return (
    <div className={styles.mobileTeam} data-team-card={id}>
      <div
        className={flip.flipStage + " " + styles.teamFlipStage}
        ref={stage}
        role="button"
        tabIndex={display.mobile ? 0 : -1}
        aria-label={
          display.current === 0
            ? `${title}の担当内容を表示`
            : `${title}の表面に戻る`
        }
      >
        <div
          className={flip.flipInner + " " + styles.teamFlipInner}
          style={
            {
              "--team-rotation": `rotateY(${display.angle}deg)`,
              transition: display.reduced ? "none" : undefined,
            } as CSSProperties
          }
        >
          {[0, 1].map((side) => (
            <div
              key={side}
              className={
                flip.face +
                " " +
                (side === 1 ? flip.back + " " : "") +
                styles.teamFace +
                " " +
                (side === 0 ? styles.teamFaceFront : styles.teamBack)
              }
              aria-hidden={display.mobile && display.current !== side}
              inert={display.mobile && display.current !== side}
            >
              {side === 0 ? (
                <div className={styles.teamCover}>
                  <Image
                    src={coverSrc}
                    alt={title}
                    fill
                    className={styles.teamCoverImage}
                    sizes="(max-width: 899px) 100vw, 400px"
                    priority={id === "strategy"}
                  />
                </div>
              ) : (
                <div className={styles.teamFlipBackContent}>
                  <h3 className={styles.teamTitle + " " + styles.teamFlipBackTitle}>
                    {title}
                  </h3>
                  <ul className={styles.teamFlipBody}>
                    {bullets.map((body) => (
                      <li key={body}>{body}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <span className={flip.srOnly} role="status">{display.status}</span>
    </div>
  );
}

export function AboutTeamSection() {
  return (
    <section aria-labelledby="about-team-heading" data-scroll-reveal="group">
      <AboutSectionHeader id="about-team-heading" kicker={teamModel.kicker} title={teamModel.heading} />
      <p className={styles.teamIntro} {...aboutReveal(80)}>{teamModel.intro}</p>
      <ul className={styles.teamGrid}>
        {roles.map((role, index) => (
          <li key={role.id} className={styles.teamItem} {...aboutReveal(160 + index * 80)}>
            <div className={styles.desktopOnly}>
              <h3 className={styles.teamTitle + " " + styles.disclosureStatic}><span className={styles.icon} aria-hidden="true"><role.Icon /></span><span>{role.title}</span></h3>
              <ul className={styles.teamBullets}>{role.bullets.map(body => <li key={body}>{body}</li>)}</ul>
            </div>
            <TeamRoleCard {...role} />
          </li>
        ))}
      </ul>
      <p className={styles.teamFootnote} {...aboutReveal(240)}>{teamModel.footnote}</p>
    </section>
  );
}
