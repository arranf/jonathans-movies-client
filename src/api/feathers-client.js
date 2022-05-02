import feathers from "@feathersjs/client";
import io from "socket.io-client";
import store from "@/store"; // used for transition notification

const url = process.env.API_URL;

let socket;
try {
  socket = io(url, {
    transports: ["websocket"],
  });
  console.debug(`Socket created to: ${url}`);
} catch (e) {
  console.error(e);
  console.error(`Unable to create socket to server: ${url}`);
}

let feathersClient = feathers()
  .configure(feathers.socketio(socket))
  .configure(feathers.authentication({ storage: window.localStorage }));

feathersClient.service("/users");
feathersClient.service("/poll");
feathersClient.service("/option");
feathersClient.service("/vote");
feathersClient.service("/films");
feathersClient.service("/time");
feathersClient.service("/users-online");
feathersClient.service("/recommendations");
feathersClient.service("/streaming-films");
feathersClient.service("/results");
feathersClient.service("/poll-phase");

feathersClient.service("/poll").on("transition", (data) => {
  const poll = store.getters["poll/getActivePoll"];
  const numberOfVotes = store.getters["vote/votesRemaining"];
  const text =
    numberOfVotes == null
      ? "Voting has begun"
      : `Voting has begun! You have ${numberOfVotes} votes.`;
  // Avoid creating transition notifications when multiple polls in the background.
  if (poll && poll._id === data.poll_pollId) {
    store.dispatch("snackbar/setText", {
      text: text,
      isPersistent: true,
    });
  }
});

feathersClient.service("/collection").on("patched", (_data) => {
  // data.current contains the current string for the correct collection
  store.commit("films/clearAll");
});

export default feathersClient;
