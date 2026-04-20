/**
 * Navigation Configuration
 *
 * @description
 * Centralized navigation configuration for header and footer.
 * All navigation items are defined here for consistency and easy maintenance.
 *
 * Items with a `feature` property will only be shown if that feature is enabled
 * in the site config's feature flags.
 */

import type { Navigation } from '../lib/types';

export const navigation: Navigation = {
  /**
   * Header Navigation
   * - main: Primary navigation links
   * - cta: Call-to-action buttons on the right
   */
  header: {
    main: [
      { label: 'Services', href: '/features' },
//      { label: 'Pricing', href: '/pricing' },
      { label: 'Nos clients', href: '/customers' },
      { label: 'A propos', href: '/about' },
      { label: 'Contact', href: '/contact' },      
//      { label: 'Blog', href: '/blog', feature: 'blog' },
    ],
    cta: [
//      { label: 'Login', href: '/login', variant: 'ghost' },
      { label: 'Nous contacter', href: '/', variant: 'primary' },
    ],
  },

  /**
   * Footer Navigation
   * Organized into 5 columns: Product, Solutions, Resources, Company, Legal
   */
  footer: {
    services: [
      { label: 'Nos services', href: '/features' },
      { label: 'Customers', href: '/customers' },
      { label: 'FAQ', href: '/faq' },
    ],
    resources: [
      { label: 'Blog', href: '/blog', feature: 'blog' },
    ],
    company: [
      { label: 'A propros', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Témoignages', href: '/testimonials', feature: 'testimonials' },
    ],
    legal: [
      { label: 'Confidentialité', href: '/privacy' },
      { label: 'Termes', href: '/terms' },
    ],
  },
};
