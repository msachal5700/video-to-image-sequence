/**
 * Blog article: /blog/sprite-sheets-from-video
 *
 * Content about creating sprite sheets from video frames,
 * targeting developers and animators who need sprite sheets for games or UI.
 */

/**
 * Creates a sprite sheet from a set of video frames.
 *
 * @param frames Array of base64-encoded frame data URLs
 * @param columns Number of frames per row in the sprite sheet
 * @returns Promise resolving to the base64-encoded sprite sheet data URL
 */
async function createSpriteSheetFromFrames(
  frames: string[],
  columns: number = 8
): Promise<string> {
  // In a real implementation, this would use canvas to compose a sprite sheet
  // from the individual frame data URLs
  return '';
};

export { createSpriteSheetFromFrames };