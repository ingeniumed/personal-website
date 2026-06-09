import type { Config } from "@/types/config";

const config: Config = {
  site: {
    url: "https://gkrishnan.blog/",
    dir: "ltr",
    lang: "en",
    author: "Gopal Krishnan",
    profile: "https://github.com/ingeniumed",
    description:
      "Gopal Krishnan: developer, dad, and coffee enthusiast. Writing about software, parenting, and books.",
    title: "Gopal Krishnan | Developer, Dad, Coffee Enthusiast",
    ogImage: "og.png",
    timezone: "Australia/Sydney",
  },
  posts: {
    perIndex: 5,
    perPage: 6,
    showArchives: false,
    scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  },
  features: {
    dynamicOgImage: true,
  },
  socialLinks: [
    {
      name: "github",
      profileUrl: "https://github.com/ingeniumed",
      linkTitle: "GitHub",
    },
    {
      name: "linkedin",
      profileUrl: "https://au.linkedin.com/in/ingeniumed",
      shareUrl: "https://www.linkedin.com/sharing/share-offsite/?url=",
      linkTitle: "LinkedIn",
    },
    {
      name: "wordpress",
      profileUrl: "https://profiles.wordpress.org/ingeniumed/",
      shareUrl: "https://wordpress.com/press-this.php?u=",
      linkTitle: "WordPress",
    },
    {
      name: "mastadon",
      shareUrl: "https://mastodon.social/share?text=",
      linkTitle: "Mastodon",
    },
    {
      name: "mail",
      shareUrl: "mailto:?subject=See%20this%20post&body=",
      linkTitle: "Email",
    },
  ],
};

export default config;
