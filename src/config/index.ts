/**
 * Configuration Index
 *
 * Source de vérité unique : src/data/config.json
 * Navigation et feature flags restent dans leurs fichiers TypeScript (données structurelles).
 * Contact, announcement, newsletter, branding → JSON uniquement.
 */

// Structural configs (menus, feature flags) stay in TypeScript
export * from './navigation';
export * from './features';
// Technical settings with env var overrides
export * from './site';

// Re-export types for convenience
export type {
  NavigationItem,
  NavigationCTA,
  HeaderNavigation,
  FooterNavigation,
  Navigation,
  SocialLinks,
  Address,
  ContactInfo,
  ContactMethod,
  ContactFAQ,
  LegalConfig,
  FeatureFlags,
  AnnouncementConfig,
  ContentStrings,
  SiteConfig,
} from '../lib/types';

import configJson from '../data/config.json';
import type {
  ContactInfo,
  ContactMethod,
  ContactFAQ,
  AnnouncementConfig,
  ContentStrings,
  SiteConfig,
  SocialLinks,
  LegalConfig,
} from '../lib/types';
import { name, description, url, author, logo, ogImage } from './site';
import { navigation } from './navigation';
import { features } from './features';

const g = configJson.global;

// ---------------------------------------------------------------------------
// Contact — source unique : src/data/config.json → global.contact
// Pour modifier le téléphone ou l'email : éditer config.json uniquement.
// ---------------------------------------------------------------------------
export const contact: ContactInfo = g.contact as unknown as ContactInfo;
export const contactMethods: ContactMethod[] = g.contactMethods as ContactMethod[];
export const contactFAQs: ContactFAQ[] = g.contactFAQs as ContactFAQ[];

// ---------------------------------------------------------------------------
// Announcement — source unique : src/data/config.json → announcement
// ---------------------------------------------------------------------------
export const announcement: AnnouncementConfig = configJson.announcement as AnnouncementConfig;

// ---------------------------------------------------------------------------
// Newsletter content — source unique : src/data/config.json → newsletter
// ---------------------------------------------------------------------------
export const content: ContentStrings = {
  newsletter: configJson.newsletter as ContentStrings['newsletter'],
};

// ---------------------------------------------------------------------------
// Merged siteConfig (backward compatibility)
// ---------------------------------------------------------------------------
export const siteConfig: SiteConfig = {
  name,
  description,
  url,
  author,
  logo,
  ogImage,
  social: g.social as SocialLinks,
  contact,
  legal: g.legal as LegalConfig,
  navigation,
  features,
  announcement,
  content,
};
