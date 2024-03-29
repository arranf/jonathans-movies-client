import store from "@/store";
import feathersClient from "./feathers-client";

const DAY_MS = 24 * 60 * 60 * 1000;

export const getCurrentPoll = () =>
  store.dispatch("poll/find", {
    query: {
      $sort: { endDateTime: -1 },
      $limit: 10,
    },
  });

export const getVotesForMostRecentPoll = (poll) =>
  store.dispatch("vote/find", {
    pageinate: false,
    query: {
      $limit: 1000,
      poll_id: poll._id,
    },
  });

export const getOptionsForPoll = (pollId) =>
  store.dispatch("option/find", {
    pageinate: false,
    query: {
      $limit: 100,
      poll_id: pollId,
    },
  });

export const getVotesForCurrentPoll = () => {
  const poll = store.getters["poll/getActivePoll"];
  if (poll && poll._id) {
    return store.dispatch("vote/find", {
      pageinate: false,
      query: {
        $limit: 1000,
        poll_id: poll._id,
      },
    });
  }
  return Promise.reject(new Error("Could not get current poll"));
};

export const getFilmSuggestions = (movieName, limit = 5) => {
  if (movieName && movieName.length > 0) {
    return store.dispatch("films/find", {
      query: {
        $limit: limit,
        $search: movieName,
      },
    });
  }
  return Promise.resolve();
};

export const getFilms = (skip = 0, limit = 50, sort = { canonical_name: 1 }) =>
  store.dispatch("films/find", {
    paginate: false,
    query: {
      $limit: limit,
      $sort: sort,
      $skip: skip,
    },
  });

export const addNomination = (film) => {
  const poll = store.getters["poll/getActivePoll"];
  const pollId = poll._id;
  const hasNominationsRemaining =
    store.getters["option/hasNominationsRemaining"];

  if (!hasNominationsRemaining) {
    return Promise.reject(new Error("Nomination used"));
  }

  if (!pollId) {
    return Promise.reject(new Error("Missing poll id"));
  }
  if (film && film.name && film._id) {
    return store.dispatch("option/create", {
      name: film.name,
      poll_id: pollId,
      film_id: film._id,
    });
  } else {
    return Promise.reject(new Error("Missing film information id"));
  }
};
export const stopPoll = () => {
  const poll = store.getters["poll/getActivePoll"];
  feathersClient
    .service("/poll-phase")
    .patch(poll._id, { changeType: "stopPoll" });
};

export const stopNominations = () => {
  const poll = store.getters["poll/getActivePoll"];
  feathersClient
    .service("/poll-phase")
    .patch(poll._id, { changeType: "stopNominations" });
};

export const discoverMovies = (seenIds) =>
  store.dispatch("films/find", {
    paginate: false,
    query: {
      discover: true,
      _id: {
        $nin: seenIds,
      },
    },
  });

/// Find movies that were added in the last month
export const getRecentlyAdded = () =>
  store.dispatch("films/find", {
    paginate: false,
    query: {
      createdAt: {
        $gte: new Date().getTime() - 30 * DAY_MS,
      },
    },
  });

export const getRecommendations = () =>
  feathersClient.service("/recommendations").get(store.state.auth.user._id);

export const discoverStreamingMovies = (page = 1, type = "popular") =>
  feathersClient.service("/films").find({
    paginate: false,
    query: {
      discover_streaming: true,
      type: type,
      page: page,
    },
  });

export const getResults = (pollId) =>
  feathersClient.service("/results").get(pollId);
