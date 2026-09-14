/**
 * Blog article: /blog/frame-extraction-for-machine-learning-datasets
 *
 * Content about extracting frames from videos for machine learning and AI training datasets.
 * Targets the informational side of the keyword set while the tool page
 * targets transactional intent, so the two do not compete for the same queries.
 */

/**
 * Extracts frames from a video at specified intervals for ML dataset creation.
 *
 * @param videoPath - Path to the video file
 * @param fps Frames per second to extract
 * @param maxFrames Maximum number of frames to extract (for dataset size control)
 * @returns Promise resolving to an array of base64-encoded frame data URLs
 */
async function extractFramesForMLDataset(
  videoPath: string,
  fps: number,
  maxFrames: number = 1000
): Promise<string[]> {
  // In a real implementation, this would use the Video to Image Sequence tool
  // to extract frames at the specified FPS, capped at maxFrames
  return [];
};

export { extractFramesForMLDataset };