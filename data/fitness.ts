// My training numbers, shown in the Health & fitness card.

export const fitness = {
  /** Bench press personal best, in kg */
  benchPB: 100,
  /** 5K run personal best */
  fiveKPB: "25 min",
  workoutsPerWeek: "3–4",
};

/**
 * A deliberately simple, very rough model of how much adults around the world
 * could bench press for one rep. There's no official worldwide data, so it
 * assumes most adults don't lift: each group gets a typical ("median") bench,
 * with a log-normal spread around it. Tweak these if you find better figures.
 */
export const benchModel = [
  { group: "adult men", share: 0.5, medianKg: 50, spread: 0.37 },
  { group: "adult women", share: 0.5, medianKg: 22, spread: 0.37 },
];

// Standard normal cumulative distribution (Abramowitz & Stegun 7.1.26)
function normalCdf(z: number) {
  const x = Math.abs(z) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * x);
  const tail =
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
    t *
    Math.exp(-x * x);
  return z >= 0 ? 1 - tail / 2 : tail / 2;
}

/** Estimated share of adults worldwide (0 to 1) who could bench at least `kg` */
export function shareWhoCanBench(kg: number) {
  return benchModel.reduce(
    (sum, g) => sum + g.share * normalCdf(-Math.log(kg / g.medianKg) / g.spread),
    0,
  );
}
