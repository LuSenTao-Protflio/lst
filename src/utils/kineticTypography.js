const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

export function calculateGlyphVariation(distance, maxDistance) {
  const influence = 1 - clamp(distance / maxDistance, 0, 1);

  return {
    weight: Math.round(100 + influence * 800),
    width: Math.round(25 + influence * 126),
    italic: Number(influence.toFixed(2)),
  };
}
