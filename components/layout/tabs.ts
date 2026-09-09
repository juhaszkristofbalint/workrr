import {
  BriefcaseIcon,
  BriefcaseIconFilled,
  CalendarIcon,
  CalendarIconFilled,
  ChatIcon,
  ChatIconFilled,
  HomeIcon,
  HomeIconFilled,
  PersonIcon,
  PersonIconFilled,
  SearchIcon,
  SearchIconFilled,
} from "@/components/icons";
import type { TabItem } from "@/components/layout/mobile-tab-bar";

export const customerTabs = [
  { href: "/customer", labelKey: "tabs.home", Icon: HomeIcon, IconActive: HomeIconFilled },
  {
    href: "/customer/search",
    labelKey: "tabs.search",
    Icon: SearchIcon,
    IconActive: SearchIconFilled,
  },
  {
    href: "/customer/jobs",
    labelKey: "tabs.jobs",
    Icon: BriefcaseIcon,
    IconActive: BriefcaseIconFilled,
  },
  {
    href: "/customer/messages",
    labelKey: "tabs.chat",
    Icon: ChatIcon,
    IconActive: ChatIconFilled,
  },
  {
    href: "/customer/profile",
    labelKey: "tabs.profile",
    Icon: PersonIcon,
    IconActive: PersonIconFilled,
  },
] as const satisfies readonly TabItem[];

export const professionalTabs = [
  { href: "/pro", labelKey: "tabs.home", Icon: HomeIcon, IconActive: HomeIconFilled },
  {
    href: "/pro/requests",
    labelKey: "tabs.jobs",
    Icon: BriefcaseIcon,
    IconActive: BriefcaseIconFilled,
  },
  {
    href: "/pro/schedule",
    labelKey: "tabs.schedule",
    Icon: CalendarIcon,
    IconActive: CalendarIconFilled,
  },
  {
    href: "/pro/messages",
    labelKey: "tabs.chat",
    Icon: ChatIcon,
    IconActive: ChatIconFilled,
  },
  {
    href: "/pro/profile",
    labelKey: "tabs.profile",
    Icon: PersonIcon,
    IconActive: PersonIconFilled,
  },
] as const satisfies readonly TabItem[];
