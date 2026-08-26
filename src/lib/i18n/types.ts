export const locales = ["so", "en", "ar"] as const;

export type Locale = (typeof locales)[number];

export const localeMeta: Record<
  Locale,
  { label: string; dir: "ltr" | "rtl"; htmlLang: string }
> = {
  so: { label: "SO", dir: "ltr", htmlLang: "so" },
  en: { label: "EN", dir: "ltr", htmlLang: "en" },
  ar: { label: "AR", dir: "rtl", htmlLang: "ar" },
};

export const defaultLocale: Locale = "so";

export const STORAGE_KEY = "hage-locale";

export type Dictionary = {
  nav: {
    home: string;
    about: string;
    whatWeDo: string;
    mission: string;
    activities: string;
    join: string;
    contact: string;
    cta: string;
    openMenu: string;
    closeMenu: string;
    skipToContent: string;
    themeToDark: string;
    themeToLight: string;
    logout: string;
  };
  hero: {
    badge: string;
    title: string;
    text: string;
    primary: string;
    secondary: string;
    imageAlt: string;
    floatQuote: string;
    floatLabel: string;
    floatCommunity: string;
  };
  about: {
    title: string;
    text: string;
    imageAlt: string;
    highlights: { title: string; text: string }[];
  };
  whatWeDo: {
    title: string;
    subtitle: string;
    items: { number: string; title: string; text: string }[];
  };
  whyHage: {
    title: string;
    quote: string;
    points: { title: string; text: string }[];
  };
  mission: {
    title: string;
    text: string;
    pillars: { title: string; text: string }[];
  };
  activities: {
    title: string;
    items: { title: string; text: string }[];
  };
  culture: {
    title: string;
    text: string;
    stats: { number: string; label: string }[];
  };
  community: {
    title: string;
    text: string;
    members: { role: string; imageAlt: string }[];
  };
  howToJoin: {
    title: string;
    steps: { number: string; title: string; text: string }[];
    cta: string;
  };
  cta: {
    title: string;
    text: string;
    primary: string;
    secondary: string;
  };
  contact: {
    title: string;
    text: string;
    email: string;
    phone: string;
    facebook: string;
    instagram: string;
    whatsapp: string;
    form: {
      name: string;
      email: string;
      subject: string;
      message: string;
      submit: string;
      sending: string;
      success: string;
      error: string;
      nameError: string;
      emailError: string;
      subjectError: string;
      messageError: string;
    };
  };
  footer: {
    description: string;
    explore: string;
    connect: string;
    follow: string;
    copyright: string;
    madeWith: string;
    backToTop: string;
    linkedin: string;
  };
  login: {
    title: string;
    subtitle: string;
    email: string;
    password: string;
    remember: string;
    submit: string;
    submitting: string;
    emailError: string;
    passwordError: string;
    showPassword: string;
    hidePassword: string;
    quote: string;
    quoteBy: string;
    imageAlt: string;
    roleError: string;
  };
  roles: {
    label: string;
    choose: string;
    admin: string;
    member: string;
    cashier: string;
    adminHint: string;
    memberHint: string;
    cashierHint: string;
  };
  admin: {
    title: string;
    subtitle: string;
    members: string;
    addMember: string;
    name: string;
    email: string;
    role: string;
    save: string;
    empty: string;
    nameError: string;
    emailError: string;
    overview: string;
    countMembers: string;
    countPayments: string;
  };
  cashier: {
    title: string;
    subtitle: string;
    collect: string;
    memberName: string;
    amount: string;
    method: string;
    save: string;
    empty: string;
    amountError: string;
    memberError: string;
    history: string;
    cash: string;
    transfer: string;
    mobile: string;
  };
};
