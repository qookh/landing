import type { Navigation } from '../lib/types';

export const navigation: Navigation = {
  header: {
    main: [
      { label: 'Nos Services',  href: '/#features'    },
      { label: 'Tarifs',        href: '/#pricing'      },
      { label: 'Avis Clients',  href: '/#testimonials' },
      { label: 'FAQ',           href: '/#faq'          },
      { label: 'Contact',       href: '/contact'       },
    ],
    cta: [
      {
        label: 'Demander un devis',
        href: '/contact',
        variant: 'primary',
      },
    ],
  },

  footer: {
    services: [
      { label: 'Urgence 24h/24',              href: '/#features' },
      { label: 'Fuites & Dégâts des eaux',    href: '/#features' },
      { label: 'Chauffe-eau & Chaudières',    href: '/#features' },
      { label: 'Débouchage canalisations',    href: '/#features' },
      { label: 'Demander un devis',           href: '/contact'   },
    ],
    resources: [],
    company: [
      { label: 'Contact', href: '/contact' },
    ],
    legal: [
      { label: 'Confidentialité', href: '/privacy' },
      { label: 'Mentions légales', href: '/terms' },
    ],
  },
};
