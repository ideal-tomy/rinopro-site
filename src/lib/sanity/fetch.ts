import { sanityFetch } from "./client";
import {
  caseStudiesQuery,
  demoItemsQuery,
  teamMembersQuery,
} from "./queries";
import type { CaseStudy, DemoItem, TeamMember } from "./types";

export async function fetchCaseStudies(): Promise<CaseStudy[]> {
  try {
    return await sanityFetch<CaseStudy[]>(caseStudiesQuery);
  } catch {
    return [];
  }
}

export async function fetchDemoItems(): Promise<DemoItem[]> {
  try {
    return await sanityFetch<DemoItem[]>(demoItemsQuery);
  } catch {
    return [];
  }
}

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  try {
    return await sanityFetch<TeamMember[]>(teamMembersQuery);
  } catch {
    return [];
  }
}
