import type { CaseStudy, DemoItem, TeamMember } from "./types";

export const caseStudiesQuery = `*[_type == "caseStudy"] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  industry,
  description,
  "image": image { "url": asset->url }
}`;

export const demoItemsQuery = `*[_type == "demoItem"] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  description,
  "image": image { "url": asset->url }
}`;

export const teamMembersQuery = `*[_type == "teamMember"] | order(order asc) {
  _id,
  name,
  role,
  bio,
  "image": image { "url": asset->url }
}`;
