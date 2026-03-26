"use client";

import { BeforeAfterDocumentShell } from "@/components/experience/shells/BeforeAfterDocumentShell";
import type { DocumentShellPresetDefinition } from "@/lib/experience/document-shell-preset-types";
import type { ExperiencePrototypeMeta } from "@/lib/experience/prototype-registry";
import { cn } from "@/lib/utils";

interface DocumentShellPresetExperienceProps {
  meta: ExperiencePrototypeMeta;
  preset: DocumentShellPresetDefinition;
  className?: string;
}

export function DocumentShellPresetExperience({
  meta,
  preset,
  className,
}: DocumentShellPresetExperienceProps) {
  return (
    <BeforeAfterDocumentShell
      meta={meta}
      className={cn(className)}
      sampleTexts={preset.samples}
      choiceSteps={preset.choiceSteps}
      buildMock={preset.build}
      leftPanelTitle={preset.leftPanelTitle}
      centerButtonLabel={preset.centerButtonLabel}
      rightPanelTitle={preset.rightPanelTitle}
    />
  );
}
