"use client";

import { useMemo, type CSSProperties } from "react";
import { Laptop, UserRound, RotateCw } from "lucide-react";
import { aboutCopy } from "@/lib/content/site-copy";
import { useServicesCardRotation } from "../services/useServicesCardRotation";
import flip from "../services/services-page.module.css";
import { AboutSectionHeader } from "./AboutSectionHeader";
import { aboutReveal } from "./about-presentation";
import styles from "./about-page.module.css";

const { teamModel } = aboutCopy;
const roles = [
  { id: "strategy", ...teamModel.strategyLead, Icon: UserRound },
  { id: "engineering", ...teamModel.aiEngineeringLead, Icon: Laptop },
];

/** Content wrapper around the existing services rotation hook and card styles. */
function TeamRoleCard({ id, title, bullets, Icon }: typeof roles[number]) {
  const labels = useMemo(() => [title, title + "の担当内容"] as const, [title]);
  const { display, selectSide, togglePlayback, stage } = useServicesCardRotation({ labels, mobileQuery: "(max-width: 899px)" });
  return (
    <div className={styles.mobileTeam} data-team-card={id}>
      <div className={flip.flipStage + " " + styles.teamFlipStage} ref={stage}>
        <div className={flip.flipInner + " " + styles.teamFlipInner} style={{ "--team-rotation": `rotateY(${display.angle}deg)`, transition: display.reduced ? "none" : undefined } as CSSProperties}>
          {[0, 1].map(side => (
            <div key={side} className={flip.face + " " + (side === 1 ? flip.back + " " : "") + styles.teamFace + " " + (side === 1 ? styles.teamBack : "")} aria-hidden={display.mobile && display.current !== side} inert={display.mobile && display.current !== side}>
              {side === 0 && <span className={styles.icon} aria-hidden="true"><Icon /></span>}
              <h3 className={styles.teamTitle}>{title}</h3>
              {side === 1 && <ul className={styles.teamFlipBody}>{bullets.map(body => <li key={body}>{body}</li>)}</ul>}
              <button type="button" className={styles.teamFlipAction} aria-label={side === 0 ? title + "の担当内容を表示" : title + "の表面に戻る"} onClick={() => selectSide.current(1 - side)}><RotateCw aria-hidden="true" /></button>
            </div>
          ))}
        </div>
      </div>
      <div className={flip.flipControls + " " + styles.teamFlipControls}>
        <span />
        {[0, 1].map(side => <button key={side} type="button" className={flip.sideDot} aria-label={side === 0 ? title + "の表面を表示" : title + "の担当内容を表示"} aria-pressed={display.current === side} onClick={() => selectSide.current(side)} />)}
        <button type="button" className={styles.teamPlayback} aria-label={display.paused ? title + "の自動回転を再開" : title + "の自動回転を停止"} onClick={() => togglePlayback.current()}>{display.paused ? "▶ 再生" : "Ⅱ 停止"}</button>
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
