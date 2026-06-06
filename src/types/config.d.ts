interface SiteConfig {
  /** Deployed URL of the site, e.g. "https://example.com" */
  url: string;
  /** Text direction for the root html element */
  dir?: "ltr" | "rtl" | "auto";
  /** Language code for the root html element, e.g. "en" */
  lang?: string;
  /** Blog title shown in header and meta tags */
  title: string;
  /** Short description used in SEO meta and RSS feed */
  description: string;
  /** Default post author name */
  author: string;
  /** Author profile URL (used in structured data) */
  profile?: string;
  /** Fallback OG image filename in /public, e.g. "og.jpg" */
  ogImage?: string;
  /** IANA timezone for post dates, e.g. "Asia/Bangkok" */
  timezone?: string;
}

interface PostsConfig {
  /** Posts per page on paginated listing pages */
  perPage?: number;
  /** Posts shown on the index/home page */
  perIndex?: number;
  /** Whether archive pages are enabled */
  showArchives?: boolean;
  /**
   * Scheduled posts within this window (ms) of their pubDatetime
   * are shown as published. Defaults to 15 minutes.
   */
  scheduledPostMargin?: number;
}

interface FeaturesConfig {
  /**
   * Generate dynamic OG images per post and provide `/og.png` when the static
   * `public/{site.ogImage}` file is absent. When false, that file is required
   * for the default layout OG image (build fails if missing).
   */
  dynamicOgImage: boolean;
}

type SocialName = "github" | "linkedin" | "mail" | "mastadon" | "wordpress";

interface SocialConfig {
  /**
   * Must match an SVG filename in src/assets/icons/socials/.
   * e.g. "github" → src/assets/icons/socials/github.svg
   */
  name: SocialName;
  url: string;
  /**
   * Accessible label for the icon link (aria-label, title attribute).
   */
  linkTitle: string;
}

export interface Config {
  site: SiteConfig;
  posts?: PostsConfig;
  features?: FeaturesConfig;
  /** Social profile links shown in header/footer */
  socials: SocialConfig[];
  /** Share links shown on post detail pages */
  shareLinks: SocialConfig[];
}
