import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://personal-website-beta-eight-51.vercel.app/", // replace this with your deployed domain
  author: "Gopal Krishnan",
  profile: "https://gopalsmusings.wordpress.com",
  desc: "Just a bunch of thoughts, musings with a hint of coffee thrown in.",
  title: "Personal Website",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 3,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: false,
};

export const LOCALE = {
  lang: "en", // html lang code. Set this empty and default will be "en"
  langTag: ["en-EN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/ingeniumed",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://au.linkedin.com/in/ingeniumed",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
];
