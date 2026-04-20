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
  /** Description SEO par défaut (utilisée si seo.description absent) */
  description: string;
  /** Chemin vers le logo (relatif à /public) */
  logo: string;
  /** URL de production */
  url?: string;
  /** Surcharges SEO spécifiques à la page d'accueil */
  seo?: {
    /** Titre <title> complet (remplace le format "Nom — Description" par défaut) */
    title?: string;
    /** Description meta — remplace global.description si présent */
    description?: string;
    /** Image Open Graph (chemin absolu ou relatif à /public) */
    image?: string;
    /** Mots-clés meta (injectés via <meta name="keywords">) */
    keywords?: string[];
  };
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
    address?: string | {
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
    };
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
  /**
   * Mode d'affichage du hero.
   * 'centered' (défaut) → texte centré, fond plein écran.
   * 'split'             → grille 2 colonnes (texte à gauche, image à droite).
   */
  layout?: 'centered' | 'split';
  /** Image de premier plan (colonne droite en mode split) */
  foregroundImage?: string;
  /** Texte alternatif de l'image de premier plan */
  foregroundImageAlt?: string;
  backgroundType?: 'solid' | 'gradient' | 'image' | 'video';
  /** URL image/vidéo si backgroundType = 'image' | 'video' */
  backgroundSrc?: string;
  /** Poster pour la vidéo de fond (préchargement) */
  backgroundVideoPoster?: string;
  /** Dégradé CSS personnalisé (ex: "from-blue-900 to-indigo-900") */
  gradient?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  textColor?: 'auto' | 'light' | 'dark';
  minHeight?: 'default' | 'screen' | 'large';
  align?: 'center' | 'left';
}

export interface LogoCloudConfig {
  title?: string;
  logos: Array<{ name: string; src: string; href?: string }>;
  variant?: 'default' | 'marquee' | 'grid';
  grayscale?: boolean;
  pauseOnHover?: boolean;
  speed?: 'slow' | 'normal' | 'fast';
  columns?: 2 | 3 | 4 | 5 | 6;
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
    /** Icône Lucide optionnelle (ex: "lucide:check") */
    icon?: string;
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
    /** Couleur d'accentuation — aligne sur le prop `accent` du composant */
    accent?: 'primary' | 'blue' | 'green' | 'purple' | 'orange';
    href?: string;
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
  variant?: 'default' | 'compact' | 'card';
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
    featured?: boolean;
  }>;
  showFilter?: boolean;
  variant?: 'grid' | 'compact' | 'detailed';
  columns?: 3 | 4 | 5 | 6;
  invertOnDark?: boolean;
  footerLink?: CTALink;
}

export interface FAQConfig {
  title?: string;
  subtitle?: string;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  /** FAQs organisées par catégories (alternatif au flat faqs) */
  categories?: Array<{
    name: string;
    faqs: Array<{ question: string; answer: string }>;
  }>;
  variant?: 'accordion' | 'simple';
}

export interface ComparisonTableConfig {
  title?: string;
  subtitle?: string;
  plans: string[];
  categories: Array<{
    name: string;
    features: Array<{
      name: string;
      values: (boolean | string)[];
      tooltip?: string;
    }>;
  }>;
  highlightedPlan?: number;
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
  /**
   * Ordre d'affichage des sections.
   * Clés valides : 'hero' | 'logoCloud' | 'features' | 'howItWorks' | 'featureHighlight'
   *              | 'bentoGrid' | 'integrations' | 'stats' | 'testimonials' | 'pricing'
   *              | 'faq' | 'comparisonTable' | 'cta' | 'newsletter'
   * Si absent, l'ordre par défaut défini dans index.astro est utilisé.
   */
  sectionOrder?: string[];
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
  comparisonTable?: ComparisonTableConfig;
  footer?: FooterConfig;
}
