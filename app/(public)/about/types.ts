// About page specific types
// These will eventually be CMS types

export interface TeamMember {
  name: string;
  role: string;
  image?: string; // url
  bio?: string;
  email?: string;
  socialLinks?: Array<{ label?: string; href?: string }>;
}

export interface CompanyStory {
  heading?: string;
  paragraphs?: string[];
  image?: string;
}