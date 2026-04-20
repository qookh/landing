/**
 * Site Configuration
 *
 * Technical settings with optional environment variable overrides.
 * All defaults come from src/data/config.json (single source of truth).
 */

import configJson from '../data/config.json';

const g = configJson.global;

export const name = (import.meta.env.SITE_NAME as string | undefined) ?? g.name;
export const description = (import.meta.env.SITE_DESCRIPTION as string | undefined) ?? g.description;
export const url = (import.meta.env.SITE_URL as string | undefined) ?? g.url;
export const author = (import.meta.env.SITE_AUTHOR as string | undefined) ?? g.name;
export const logo = g.logo;
export const ogImage = g.ogImage;
