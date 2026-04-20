/**
 * Types des configurations de pages individuelles.
 *
 * Chaque page (hors index.astro) importe son propre fichier JSON depuis
 * src/data/pages/<nom-page>.json et le caste vers l'interface correspondante.
 *
 * Primitives partagées réutilisables entre toutes les pages.
 */

// ---------------------------------------------------------------------------
// Primitives partagées
// ---------------------------------------------------------------------------

/** SEO spécifique à une page */
export interface PageSEO {
  /** Titre complet de la balise <title> */
  title?: string;
  /** Meta description */
  description?: string;
  /** Image Open Graph */
  image?: string;
  /** Mots-clés meta */
  keywords?: string[];
}

/** En-tête de page réutilisable (PageHeader.astro) */
export interface PageHeaderConfig {
  title: string;
  subtitle?: string;
  /** Paragraphes de contenu inline (en plus du subtitle) */
  paragraphs?: string[];
  align?: 'center' | 'left';
  size?: 'default' | 'large';
  maxWidth?: 'sm' | 'md' | 'lg' | 'full';
}

/** Bloc CTA de fin de section */
export interface CTABlockConfig {
  title: string;
  description?: string;
  action?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
}

/** Item de valeur / bénéfice (ValuesSection.astro) */
export interface ValueItem {
  icon?: string;
  title: string;
  description: string;
}

/** Membre d'équipe (TeamSection.astro) */
export interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  avatar?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

/** Métrique d'un cas client */
export interface CaseMetric {
  value: string;
  label: string;
}

/** Cas client complet (CaseStudyCard.astro) */
export interface CaseStudyItem {
  company: string;
  logo?: string;
  industry?: string;
  quote: string;
  author: string;
  role: string;
  avatar?: string;
  metrics?: CaseMetric[];
  href?: string;
  featured?: boolean;
}

/** Item de grille bento */
export interface BentoItem {
  size?: 'small' | 'medium' | 'large';
  title: string;
  description: string;
  icon?: string;
  image?: string;
  accent?: 'primary' | 'blue' | 'green' | 'purple' | 'orange';
  href?: string;
}

/** Feature mise en avant (FeatureHighlight.astro) */
export interface FeatureHighlightItem {
  badge?: string;
  title: string;
  description: string;
  highlights?: string[];
  image?: string;
  icon?: string;
  cta?: { label: string; href: string };
}

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

/** src/data/pages/about.json */
export interface AboutPageConfig {
  seo?: PageSEO;
  header: PageHeaderConfig;
  stats?: {
    stats: Array<{ value: string; label: string; description?: string }>;
    columns?: 2 | 3 | 4;
  };
  video?: {
    title?: string;
    subtitle?: string;
    videoId?: string;
    provider?: 'youtube' | 'vimeo' | 'self-hosted';
    videoUrl?: string;
    thumbnail?: string;
    aspectRatio?: '16:9' | '4:3' | '1:1' | '9:16';
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    lazyLoad?: boolean;
  };
  values?: {
    title?: string;
    subtitle?: string;
    items: ValueItem[];
    variant?: 'card' | 'with-icon' | 'simple';
    columns?: 2 | 3 | 4;
  };
  team?: {
    title?: string;
    subtitle?: string;
    members: TeamMember[];
    columns?: 2 | 3 | 4;
  };
  content?: {
    title: string;
    subtitle?: string;
    paragraphs?: string[];
    align?: 'left' | 'center';
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  };
  cta?: CTABlockConfig;
}

/** src/data/pages/customers.json */
export interface CustomersPageConfig {
  seo?: PageSEO;
  header: PageHeaderConfig;
  stats?: {
    stats: Array<{ value: string; label: string; description?: string }>;
    columns?: 2 | 3 | 4;
  };
  featuredCases?: {
    title?: string;
    subtitle?: string;
    cases: CaseStudyItem[];
  };
  gridCases?: {
    title?: string;
    subtitle?: string;
    cases: CaseStudyItem[];
  };
  logoCloud?: {
    title?: string;
    logos: Array<{ name: string; src: string; href?: string }>;
    grayscale?: boolean;
    variant?: 'default' | 'marquee' | 'grid';
  };
  cta?: CTABlockConfig;
}

/** src/data/pages/faq.json */
export interface FAQPageConfig {
  seo?: PageSEO;
  header: PageHeaderConfig;
  /** FAQs groupées par catégorie (mode catégories) */
  categories?: Array<{
    name: string;
    faqs: Array<{ question: string; answer: string }>;
  }>;
  /** FAQs en liste plate (alternatif aux catégories) */
  faqs?: Array<{ question: string; answer: string }>;
  variant?: 'accordion' | 'simple';
  cta?: CTABlockConfig;
}

/** src/data/pages/features.json */
export interface FeaturesPageConfig {
  seo?: PageSEO;
  header: PageHeaderConfig;
  highlight?: {
    title?: string;
    subtitle?: string;
    features: FeatureHighlightItem[];
  };
  /** Catégories de features affichées via ValuesSection */
  categories?: Array<{
    title?: string;
    subtitle?: string;
    items: ValueItem[];
    variant?: 'card' | 'with-icon' | 'simple';
    columns?: 2 | 3 | 4;
  }>;
  bentoGrid?: {
    title?: string;
    subtitle?: string;
    items: BentoItem[];
  };
  cta?: CTABlockConfig;
}

/** src/data/pages/testimonials.json */
export interface TestimonialsPageConfig {
  seo?: PageSEO;
  header: PageHeaderConfig;
  emptyMessage?: string;
  cta?: CTABlockConfig;
}

/** src/data/pages/contact.json */
export interface ContactPageConfig {
  seo?: PageSEO;
  header: PageHeaderConfig;
  formTitle: string;
  methodsTitle: string;
  officeTitle: string;
  faqsTitle: string;
  faqsLink?: { label: string; href: string };
}

/** Section de contenu légal (privacy/terms) */
export interface LegalSection {
  heading?: string;
  subheading?: string;
  /** Paragraphe principal */
  content?: string;
  /** Liste <ul> */
  items?: string[];
}

/** src/data/pages/privacy.json et terms.json */
export interface LegalPageConfig {
  seo?: PageSEO;
  title: string;
  lastUpdated: string;
  intro?: string;
  sections: LegalSection[];
  contactEmail: string;
  address: string;
}

/** Config d'une page d'erreur individuelle */
export interface ErrorConfig {
  layoutTitle: string;
  layoutDescription: string;
  code: number;
  title: string;
  message: string;
  showHomeButton?: boolean;
  showContactButton?: boolean;
}

/** src/data/pages/errors.json */
export interface ErrorsPageConfig {
  '403': ErrorConfig;
  '404': ErrorConfig;
  '500': ErrorConfig;
}

/** src/data/pages/pricing.json */
export interface PricingPageConfig {
  seo?: PageSEO;
  plans: Array<{
    name: string;
    /** null = plan sur devis */
    monthlyPrice: number | null;
    customPrice?: string;
    description: string;
    features: string[];
    cta: { label: string; href: string };
    highlighted?: boolean;
    badge?: string;
  }>;
  annualDiscount?: number;
  defaultPeriod?: 'monthly' | 'annual';
  guarantee?: {
    title: string;
    description: string;
    icon?: string;
  };
  badges?: Array<{ icon: string; label: string }>;
  comparison?: {
    title?: string;
    subtitle?: string;
    /** Noms des plans dans l'ordre des colonnes */
    plans: string[];
    categories: Array<{
      name: string;
      features: Array<{
        name: string;
        values: (boolean | string)[];
        tooltip?: string;
      }>;
    }>;
    /** Index 0-based du plan mis en avant */
    highlightedPlan?: number;
  };
  faqs?: Array<{ question: string; answer: string }>;
  faqTitle?: string;
  faqVariant?: 'accordion' | 'simple';
  cta?: CTABlockConfig;
}
