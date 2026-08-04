/**
 * Platform definitions for every result card.
 *
 * Each profile describes what "a good frame" means for one destination. Adding
 * a new platform is a matter of appending one object here — the pipeline, the
 * UI grid and the export sizing all iterate over `PLATFORM_PROFILES`, so no
 * other file needs touching.
 *
 * Weights are *multipliers* over `BASE_WEIGHTS` in `scoreEngine.ts`, not
 * absolute values. A weight of 1.6 means "this metric matters 60% more here
 * than it does for a generic quality judgement".
 */

import type { CategoryId, PlatformProfile } from './types';

export const PLATFORM_PROFILES: readonly PlatformProfile[] = [
  {
    id: 'best-overall',
    icon: '🏆',
    label: 'Best Overall',
    blurb: 'The single strongest frame in the video on pure technical quality.',
    aspectRatio: 16 / 9,
    aspectLabel: '16:9',
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    // Deliberately neutral — this card is the unweighted quality benchmark that
    // every other category is implicitly measured against.
    weights: {},
    faceBonus: 2,
    aspectSensitivity: 0.15,
  },
  {
    id: 'youtube-thumbnail',
    icon: '▶',
    label: 'Best YouTube Thumbnail',
    blurb: 'High-contrast, sharp and readable when shrunk to a sidebar tile.',
    aspectRatio: 16 / 9,
    aspectLabel: '16:9',
    recommendedWidth: 1280,
    recommendedHeight: 720,
    // A YouTube thumbnail is judged at ~210px wide in the sidebar. Sharpness and
    // contrast survive that downscale; subtle composition does not. Faces are
    // the strongest known CTR driver on the platform, hence the largest bonus.
    weights: {
      sharpness: 1.5,
      contrast: 1.45,
      colorfulness: 1.35,
      faceArea: 1.6,
      motionBlur: 1.4,
      entropy: 1.2,
    },
    faceBonus: 9,
    aspectSensitivity: 0.2,
  },
  {
    id: 'instagram-post',
    icon: '📷',
    label: 'Best Instagram Post',
    blurb: 'Square-safe framing with vivid colour and a centred subject.',
    aspectRatio: 1,
    aspectLabel: '1:1',
    recommendedWidth: 1080,
    recommendedHeight: 1080,
    // The square crop is unforgiving: anything near the left or right edge is
    // gone. Centring is weighted hard for exactly that reason.
    weights: {
      colorfulness: 1.5,
      composition: 1.35,
      centerWeight: 1.5,
      exposure: 1.2,
      sharpness: 1.15,
    },
    faceBonus: 6,
    aspectSensitivity: 0.75,
  },
  {
    id: 'instagram-story',
    icon: '📖',
    label: 'Best Instagram Story',
    blurb: 'Vertical-friendly frame with the subject clear of UI overlays.',
    aspectRatio: 9 / 16,
    aspectLabel: '9:16',
    recommendedWidth: 1080,
    recommendedHeight: 1920,
    // Stories crop landscape footage brutally, so centring dominates. Brightness
    // is boosted because stories are consumed full-screen, often outdoors.
    weights: {
      centerWeight: 1.6,
      brightness: 1.25,
      colorfulness: 1.3,
      faceArea: 1.3,
      sharpness: 1.1,
    },
    faceBonus: 7,
    aspectSensitivity: 0.9,
  },
  {
    id: 'linkedin-post',
    icon: '💼',
    label: 'Best LinkedIn Post',
    blurb: 'Clean, well-exposed and professional — no motion artefacts.',
    aspectRatio: 1.91,
    aspectLabel: '1.91:1',
    recommendedWidth: 1200,
    recommendedHeight: 628,
    // LinkedIn rewards polish over spectacle. Exposure and sharpness carry the
    // weight; colourfulness is deliberately left at baseline because oversaturated
    // frames read as unprofessional in a business feed.
    weights: {
      exposure: 1.55,
      sharpness: 1.4,
      composition: 1.3,
      motionBlur: 1.5,
      contrast: 1.15,
    },
    faceBonus: 6,
    aspectSensitivity: 0.3,
  },
  {
    id: 'pinterest-pin',
    icon: '📌',
    label: 'Best Pinterest Pin',
    blurb: 'Tall, colour-rich and detailed — built for a scrolling grid.',
    aspectRatio: 2 / 3,
    aspectLabel: '2:3',
    recommendedWidth: 1000,
    recommendedHeight: 1500,
    // Pinterest is a visual discovery grid: colour and detail density are what
    // stop the scroll. Faces matter far less here than on any other platform.
    weights: {
      colorfulness: 1.6,
      entropy: 1.45,
      sharpness: 1.3,
      composition: 1.25,
    },
    faceBonus: 2,
    aspectSensitivity: 0.8,
  },
  {
    id: 'x-post',
    icon: '🐦',
    label: 'Best X Post',
    blurb: 'Reads instantly at small size in a fast-moving timeline.',
    aspectRatio: 16 / 9,
    aspectLabel: '16:9',
    recommendedWidth: 1600,
    recommendedHeight: 900,
    // Timeline images are small and scrolled past in under a second. Contrast
    // and sharpness are what survive; nuance does not.
    weights: {
      contrast: 1.45,
      sharpness: 1.35,
      colorfulness: 1.25,
      entropy: 1.2,
    },
    faceBonus: 5,
    aspectSensitivity: 0.25,
  },
  {
    id: 'tiktok-cover',
    icon: '🎵',
    label: 'Best TikTok Cover',
    blurb: 'Bright, punchy vertical frame with a strong central subject.',
    aspectRatio: 9 / 16,
    aspectLabel: '9:16',
    recommendedWidth: 1080,
    recommendedHeight: 1920,
    // Covers are seen as small vertical tiles on a profile grid. Brightness and
    // saturation do the heavy lifting at that size.
    weights: {
      brightness: 1.4,
      colorfulness: 1.5,
      centerWeight: 1.45,
      faceArea: 1.4,
      contrast: 1.2,
    },
    faceBonus: 8,
    aspectSensitivity: 0.9,
  },
  {
    id: 'whatsapp-status',
    icon: '🟢',
    label: 'Best WhatsApp Status',
    blurb: 'Vertical, well-lit and clear even after aggressive recompression.',
    aspectRatio: 9 / 16,
    aspectLabel: '9:16',
    recommendedWidth: 1080,
    recommendedHeight: 1920,
    // WhatsApp recompresses hard, so frames that are already soft or noisy fall
    // apart. Sharpness and exposure are up-weighted to survive that pass.
    weights: {
      sharpness: 1.35,
      exposure: 1.35,
      brightness: 1.25,
      centerWeight: 1.4,
    },
    faceBonus: 6,
    aspectSensitivity: 0.85,
  },
  {
    id: 'wallpaper',
    icon: '🖥',
    label: 'Wallpaper',
    blurb: 'Maximum resolution and detail, subject placed off-centre.',
    aspectRatio: 16 / 9,
    aspectLabel: '16:9',
    recommendedWidth: 2560,
    recommendedHeight: 1440,
    // The one category that actively prefers *no* face and rewards rule-of-thirds
    // placement, since desktop icons occupy the left third of a wallpaper.
    weights: {
      resolutionScore: 1.8,
      sharpness: 1.5,
      ruleOfThirds: 1.6,
      colorfulness: 1.3,
      entropy: 1.3,
    },
    faceBonus: 0,
    aspectSensitivity: 0.35,
  },
] as const;

/** Fast lookup by id, built once at module load. */
const PROFILE_MAP = new Map<CategoryId, PlatformProfile>(
  PLATFORM_PROFILES.map(profile => [profile.id, profile])
);

/** Retrieve a profile by id. Returns `undefined` for unknown ids. */
export const getProfile = (id: CategoryId): PlatformProfile | undefined => PROFILE_MAP.get(id);
