export interface CaseStudy {
  _id: string;
  title: string;
  slug?: { current: string };
  industry?: string;
  description?: string;
  image?: { url: string };
}

export interface DemoItem {
  _id: string;
  title: string;
  slug?: { current: string };
  description?: string;
  image?: { url: string };
}

export interface TeamMember {
  _id: string;
  name: string;
  role?: string;
  bio?: string;
  image?: { url: string };
}
