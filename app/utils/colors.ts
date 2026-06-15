export type ColorMap = { offset: number; color: [number, number, number] }[];

export const PALETTES: Record<string, ColorMap> = {
  rocket: [
    { offset: 0.0, color: [250, 235, 221] },
    { offset: 0.2, color: [243, 152, 62] },
    { offset: 0.4, color: [221, 81, 58] },
    { offset: 0.6, color: [142, 33, 107] },
    { offset: 0.8, color: [59, 25, 94] },
    { offset: 1.0, color: [3, 5, 26] },
  ],
  mako: [
    { offset: 0.0, color: [222, 245, 229] },
    { offset: 0.25, color: [84, 185, 160] },
    { offset: 0.5, color: [61, 101, 142] },
    { offset: 0.75, color: [48, 29, 76] },
    { offset: 1.0, color: [11, 4, 5] },
  ],
  viridis: [
    { offset: 0.0, color: [253, 231, 37] },
    { offset: 0.33, color: [53, 183, 121] },
    { offset: 0.66, color: [49, 104, 142] },
    { offset: 1.0, color: [68, 1, 84] },
  ],
};

export const getHeatmapColor = (value: number, paletteName: string): { bg: string; text: string } => {
  const palette = PALETTES[paletteName] || PALETTES.rocket;
  const clamped = Math.max(0, Math.min(1, value));

  let lower = palette[0];
  let upper = palette[palette.length - 1];

  for (let i = 0; i < palette.length - 1; i++) {
    if (clamped >= palette[i].offset && clamped <= palette[i + 1].offset) {
      lower = palette[i];
      upper = palette[i + 1];
      break;
    }
  }

  const range = upper.offset - lower.offset;
  const fraction = range === 0 ? 0 : (clamped - lower.offset) / range;

  const r = Math.round(lower.color[0] + fraction * (upper.color[0] - lower.color[0]));
  const g = Math.round(lower.color[1] + fraction * (upper.color[1] - lower.color[1]));
  const b = Math.round(lower.color[2] + fraction * (upper.color[2] - lower.color[2]));

  // Calculate relative luminance
  // If luminance is high, text should be black; if low, white.
  const luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
  const text = luminance > 0.5 ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.95)";

  return { bg: `rgb(${r}, ${g}, ${b})`, text };
};
