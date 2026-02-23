export const SITE = {
  website: "https://gkrishnan.blog/",
  author: "Gopal Krishnan",
  profile: "https://github.com/ingeniumed",
  desc: "Gopal Krishnan — developer, dad, and coffee enthusiast. Writing about software, parenting, and books.",
  title: "Gopal Krishnan — Developer, Dad, Coffee Enthusiast",
  ogImage: "og.png",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 6,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: false,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/ingeniumed/personal-website/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Australia/Sydney", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
