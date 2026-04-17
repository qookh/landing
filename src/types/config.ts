/**
 * SiteConfig — Interface centralisée de configuration
 *
 * Chaque section est optionnelle : omettre une clé désactive le bloc correspondant.
 * Les noms de champs sont alignés sur les interfaces des composants Astro existants.
 * Fichier de données : src/data/config.json
 */

// ---------------------------------------------------------------------------
// Primitives réutilisables
// ---------------------------------------------------------------------------

/** Lien avec libellé — aligne sur { label, href } des composants */
export interface CTALink {
  label: string;
  href: string;
}

export interface NavLink {
  label: string;
  href: string;
}

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

export interface GlobalConfig {
  /** Nom affiché dans le header, footer et balises meta */
  name: string;
  /** Accroche courte (sous le nom dans le footer) */
  tagline?: string;
  /** Description SEO */
  description: string;
  /** Chemin vers le logo (relatif à /public) */
  logo: string;
  /** URL de production */
  url?: string;
  social?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

export interface AnnouncementConfig {
  enabled: boolean;
  /** ID unique — changer pour réinitialiser le dismiss utilisateur */
  id: string;
  text: string;
  href?: string;
  linkText?: string;
  variant?: 'primary' | 'secondary' | 'gradient';
  dismissible?: boolean;
}

export interface HeroConfig {
  title: string;
  subtitle?: string;
  /** Badge flottant au-dessus du titre (ex: "⚡ Disponible 24h/24") */
  badge?: string;
  primaryCTA?: CTALink;
  secondaryCTA?: CTALink;
  backgroundType?: 'solid' | 'gradient' | 'image' | 'video';
  /** URL image/vidéo si backgroundType = 'image' | 'video' */
  backgroundSrc?: string;
  overlay?: boolean;
  align?: 'center' | 'left';
}

export interface LogoCloudConfig {
  title?: string;
  logos: Array<{ name: string; src: string; href?: string }>;
  variant?: 'default' | 'marquee' | 'grid';
  grayscale?: boolean;
  pauseOnHover?: boolean;
  background?: 'default' | 'muted';
  logoSize?: 'sm' | 'md' | 'lg';
}

export interface FeaturesConfig {
  title?: string;
  subtitle?: string;
  features: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
  footerLink?: CTALink;
  background?: 'default' | 'muted' | 'accent';
}

export interface HowItWorksConfig {
  title?: string;
  subtitle?: string;
  steps: Array<{
    icon?: string;
    title: string;
    description: string;
    image?: string;
  }>;
  variant?: 'horizontal' | 'vertical' | 'alternating';
  showNumbers?: boolean;
}

export interface FeatureHighlightConfig {
  title?: string;
  subtitle?: string;
  features: Array<{
    badge?: string;
    title: string;
    description: string;
    highlights?: string[];
    image?: string;
    cta?: CTALink;
  }>;
  startImageLeft?: boolean;
}

export interface BentoGridConfig {
  title?: string;
  subtitle?: string;
  items: Array<{
    size?: 'small' | 'medium' | 'large';
    title: string;
    description: string;
    icon?: string;
    image?: string;
    accentColor?: string;
  }>;
}

export interface StatsConfig {
  title?: string;
  subtitle?: string;
  stats: Array<{
    /** Valeur principale, suffix inclus si souhaité (ex: "4800+", "98%") */
    value: string;
    label: string;
    description?: string;
  }>;
  columns?: 2 | 3 | 4;
}

export interface TestimonialsConfig {
  title?: string;
  subtitle?: string;
  testimonials: Array<{
    /** Prénom + nom — aligne sur le champ `author` du composant */
    author: string;
    role?: string;
    company?: string;
    avatar?: string;
    quote: string;
  }>;
  limit?: number;
  footerLink?: CTALink;
}

export interface PricingConfig {
  title?: string;
  subtitle?: string;
  plans: Array<{
    name: string;
    /** Prix mensuel en €/$ — null pour les plans sur devis */
    monthlyPrice: number | null;
    /** Texte affiché si monthlyPrice est null (ex: "Sur devis") */
    customPrice?: string;
    description: string;
    features: string[];
    cta: CTALink;
    /** Mettre en avant ce plan ("Most Popular") */
    highlighted?: boolean;
    badge?: string;
  }>;
  annualDiscount?: number;
  defaultPeriod?: 'monthly' | 'annual';
  footerLink?: CTALink;
  /** ID formulaire Tally (si intégration Tally) */
  tallyFormId?: string;
}

export interface CTAConfig {
  title: string;
  description?: string;
  action?: CTALink;
  secondaryAction?: CTALink;
  /** ID formulaire Tally (popup au clic) */
  tallyFormId?: string;
}

export interface NewsletterConfig {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  successMessage?: string;
  errorMessage?: string;
  privacyNote?: string;
  /** URL endpoint (vide = mode démo) */
  action?: string;
  tallyFormId?: string;
}

export interface IntegrationsConfig {
  title?: string;
  subtitle?: string;
  integrations: Array<{
    name: string;
    logo: string;
    category: string;
    description?: string;
    href?: string;
  }>;
  showFilter?: boolean;
  variant?: 'grid' | 'compact' | 'detailed';
  columns?: number;
}

export interface FAQConfig {
  title?: string;
  subtitle?: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  variant?: 'accordion' | 'simple';
}

export interface FooterConfig {
  description?: string;
  columns?: Array<{
    title: string;
    links: NavLink[];
  }>;
  legal?: {
    privacyUrl?: string;
    termsUrl?: string;
    copyright?: string;
  };
}

// ---------------------------------------------------------------------------
// Objet racine
// ---------------------------------------------------------------------------

/**
 * SiteConfig — objet unique qui alimente toutes les sections de la landing page.
 * Toutes les sections sont optionnelles : omettre une clé = bloc désactivé.
 *
 * @example
 * import config from '@/data/config.json';
 * import type { SiteConfig } from '@/types/config';
 * const cfg = config as SiteConfig;
 */
export interface SiteConfig {
  global?: GlobalConfig;
  announcement?: AnnouncementConfig;
  hero?: HeroConfig;
  logoCloud?: LogoCloudConfig;
  features?: FeaturesConfig;
  howItWorks?: HowItWorksConfig;
  featureHighlight?: FeatureHighlightConfig;
  bentoGrid?: BentoGridConfig;
  stats?: StatsConfig;
  testimonials?: TestimonialsConfig;
  pricing?: PricingConfig;
  cta?: CTAConfig;
  newsletter?: NewsletterConfig;
  integrations?: IntegrationsConfig;
  faq?: FAQConfig;
  footer?: FooterConfig;
}
