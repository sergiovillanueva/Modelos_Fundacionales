/**
 * Cutting a photo by distance with a relative depth map: keep what is nearer than a cut.
 * The map stores closeness from 0 (far) to 255 (near), as Depth Anything shows it.
 */

/** Which pixels survive a cut: those at least as near as the threshold. */
export function keepNearer(closeness, threshold) {
  const keep = new Uint8Array(closeness.length);
  let kept = 0;
  for (let index = 0; index < closeness.length; index += 1) {
    if (closeness[index] >= threshold) {
      keep[index] = 1;
      kept += 1;
    }
  }
  return {keep, kept, share: closeness.length ? kept / closeness.length : 0};
}
