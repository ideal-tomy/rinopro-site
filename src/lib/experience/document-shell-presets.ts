import type { DocumentShellPresetDefinition } from "@/lib/experience/document-shell-preset-types";
import { loanDocumentPreset } from "@/lib/experience/loan-plan-draft-mock";
import {
  bulletMessPreset,
  execMeetingPreset,
  presentationOutlinePreset,
  rfpRequirementsPreset,
} from "@/lib/experience/document-shell-mocks-wave1";
import {
  nonprofitThanksPreset,
  orderFormPreset,
  quoteDraftPreset,
  webinarInvitePreset,
} from "@/lib/experience/document-shell-mocks-wave2";
import {
  contractAmendmentPreset,
  jobOfferPreset,
  privacyNoticePreset,
  releaseNotePreset,
} from "@/lib/experience/document-shell-mocks-wave3";
import {
  onboardingChecklistPreset,
  subsidyChecklistPreset,
} from "@/lib/experience/document-shell-mocks-wave4";

/** 書類たたき台シェル: slug → プリセット（Runner がディスパッチ） */
export const DOCUMENT_SHELL_PRESET_BY_SLUG: Record<
  string,
  DocumentShellPresetDefinition
> = {
  "loan-interview-business-outline": loanDocumentPreset,
  "bullet-mess-to-meeting-agenda": bulletMessPreset,
  "exec-meeting-notes-to-summary": execMeetingPreset,
  "presentation-outline": presentationOutlinePreset,
  "rfp-requirements-extract": rfpRequirementsPreset,
  "order-form-generator": orderFormPreset,
  "quote-draft-generator": quoteDraftPreset,
  "webinar-invite-email-draft": webinarInvitePreset,
  "nonprofit-donor-thanks-letter-draft": nonprofitThanksPreset,
  "contract-amendment-draft": contractAmendmentPreset,
  "release-note-draft-from-ship-list": releaseNotePreset,
  "job-offer-draft-from-terms": jobOfferPreset,
  "privacy-notice-update-draft": privacyNoticePreset,
  "subsidy-application-topic-checklist": subsidyChecklistPreset,
  "onboarding-checklist-from-role": onboardingChecklistPreset,
};

export function getDocumentShellPreset(
  slug: string
): DocumentShellPresetDefinition | undefined {
  return DOCUMENT_SHELL_PRESET_BY_SLUG[slug];
}
