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
  socials: [
    {
      name: "github",
      url: "https://github.com/ingeniumed",
      linkTitle: "Gopal Krishnan on GitHub",
    },
    {
      name: "linkedin",
      url: "https://au.linkedin.com/in/ingeniumed",
      linkTitle: "Gopal Krishnan on LinkedIn",
    },
    {
      name: "wordpress",
      url: "https://profiles.wordpress.org/ingeniumed/",
      linkTitle: "Gopal Krishnan on WordPress.org",
    },
  ],
  shareLinks: [
    {
      name: "wordpress",
      url: "https://wordpress.com/press-this.php?u=",
      linkTitle: "Share this post on WordPress.com",
    },
    {
      name: "linkedin",
      url: "https://www.linkedin.com/sharing/share-offsite/?url=",
      linkTitle: "Share this post on LinkedIn",
    },
    {
      name: "mastadon",
      url: "https://mastodon.social/share?text=",
      linkTitle: "Share this post on Mastodon",
    },
    {
      name: "mail",
      url: "mailto:?subject=See%20this%20post&body=",
      linkTitle: "Share this post via email",
    },
  ],
};

export default config;
