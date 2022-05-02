import humanizeDuration from "humanize-duration";
import store from "@/store";

let shortHumanizer = humanizeDuration.humanizer({
  language: "shortEn",
  languages: {
    shortEn: {
      h: function () {
        return "h";
      },
      m: function () {
        return "m";
      },
      s: function () {
        return "s";
      },
    },
  },
  units: ["h", "m", "s"],
  largest: 2,
  round: true,
});

export const humanizeTimeToNowPrecise = (dateTimeEpochms) => {
  const time = store.getters["time/getNow"];

  return shortHumanizer(dateTimeEpochms - time);
};

export const humanizeTimeToNowImprecise = (dateTimeEpochms) => {
  const time = store.getters["time/getNow"];
  return humanizeDuration(dateTimeEpochms - time, {
    units: ["mo", "w", "d", "h", "m"],
    largest: 1,
    round: true,
  });
};

export const selectRandom = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

export const getTmdbBackdropImage = (slug) => {
  return `https://image.tmdb.org/t/p/w1280${slug}`;
};

export const getTmdbBackdropSrcSet = (slug) => {
  if (!slug) {
    throw Error("Slug not valid");
  }
  return `https://image.tmdb.org/t/p/w780${slug} 780w,https://image.tmdb.org/t/p/w1280${slug} 1280w`;
};

export const getTmdbPosterImage = (slug) => {
  if (!slug) {
    throw Error("Slug not valid");
  }
  return `https://image.tmdb.org/t/p/w342/${slug}`;
};

export const getTmdbPosterSrcSet = (slug) => {
  if (!slug) {
    throw Error("Slug not valid");
  }
  return `https://image.tmdb.org/t/p/w154${slug} 154w,https://image.tmdb.org/t/p/w185${slug} 185w,https://image.tmdb.org/t/p/w342${slug} 342w,https://image.tmdb.org/t/p/w500${slug} 500w`;
};

export const getYearFromTmdbReleaseDate = (releaseDate) => {
  if (!releaseDate) {
    return "";
  }
  return new Date(releaseDate).getFullYear();
};

/**
 * Round half away from zero ('commercial' rounding)
 * Uses correction to offset floating-point inaccuracies.
 * Works symmetrically for positive and negative numbers.
 * From https://stackoverflow.com/a/48764436/6132345
 */
export function round(num, decimalPlaces = 0) {
  var p = Math.pow(10, decimalPlaces);
  var m = num * p * (1 + Number.EPSILON);
  return Math.round(m) / p;
}

export function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
