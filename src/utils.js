import humanizeDuration from "humanize-duration";
import store from "@/store";
import constants from "./constants";

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

export function round(value, precision) {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

const shuffle = function (a) {
  for (let i = a.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [a[i - 1], a[j]] = [a[j], a[i - 1]];
  }
};

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

export const getUniqueColors = (count, colorRange = "800") => {
  let array = JSON.parse(JSON.stringify(constants.colors[colorRange]));

  while (count > array.length) {
    array = array.concat(
      JSON.parse(JSON.stringify(constants.colors[colorRange]))
    );
  }
  shuffle(array);
  if (count < array.length) {
    array = array.slice(0, count);
  }
  return array;
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
