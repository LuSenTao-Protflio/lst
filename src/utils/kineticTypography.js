const INFLUENCE_RADIUS = 290;

export function calculateGlyphVariation(distance) {
  const influence = Math.max(0, 1 - distance / INFLUENCE_RADIUS);

  return {
    weight: Math.round(420 + influence * 480),
    width: Math.round(88 + influence * 52),
    italic: Number((influence * 10).toFixed(2)),
  };
}
