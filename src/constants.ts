import type { Props } from "astro";
import github from "@/assets/icons/socials/github.svg";
import linkedin from "@/assets/icons/socials/linkedin.svg";
import mail from "@/assets/icons/socials/mail.svg";
import mastadon from "@/assets/icons/socials/mastadon.svg";
import telegram from "@/assets/icons/socials/telegram.svg";
import whatsapp from "@/assets/icons/socials/whatsapp.svg";
import wordpress from "@/assets/icons/socials/wordpress.svg";
import { SITE } from "@/config";

interface Social {
  name: string;
  href: string;
  linkTitle: string;
  icon: (_props: Props) => Element;
}

export const SOCIALS: Social[] = [
  {
    name: "GitHub",
    href: "https://github.com/ingeniumed",
    linkTitle: `${SITE.author} on GitHub`,
    icon: github,
  },
  {
    name: "LinkedIn",
    href: "https://au.linkedin.com/in/ingeniumed",
    linkTitle: `${SITE.author} on LinkedIn`,
    icon: linkedin,
  },
  {
    name: "WordPress",
    href: "https://profiles.wordpress.org/ingeniumed/",
    linkTitle: `${SITE.author} on WordPress.org`,
    icon: wordpress,
  },
] as const;

export const SHARE_LINKS: Social[] = [
  {
    name: "WordPress",
    href: "https://wordpress.com/press-this.php?u=",
    linkTitle: `Share this post on WordPress.com`,
    icon: wordpress,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/sharing/share-offsite/?url=",
    linkTitle: `Share this post on LinkedIn`,
    icon: linkedin,
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/?text=",
    linkTitle: `Share this post via WhatsApp`,
    icon: whatsapp,
  },
  {
    name: "Mastadon",
    href: "https://mastodon.social/share?text=",
    linkTitle: `Share this post on Mastodon`,
    icon: mastadon,
  },
  {
    name: "Telegram",
    href: "https://t.me/share/url?url=",
    linkTitle: `Share this post via Telegram`,
    icon: telegram,
  },
  {
    name: "Mail",
    href: "mailto:?subject=See%20this%20post&body=",
    linkTitle: `Share this post via email`,
    icon: mail,
  },
] as const;
