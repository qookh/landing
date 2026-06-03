/**
 * Feature Flags Configuration
 *
 * @description
 * Toggle features on/off to customize which sections are enabled.
 * These flags control navigation visibility and section rendering.
 */

import type { FeatureFlags } from '../lib/types';

/** Feature flags to enable/disable site sections */
export const features: FeatureFlags = {
  blog: false,
  docs: false,
  changelog: false,
  testimonials: false,
  roadmap: false,
};
