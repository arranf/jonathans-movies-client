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

feathersClient.service("/poll").on("transition", (_data) => {
  const numberOfVotes = store.getters["vote/votesRemaining"];
  const text =
    numberOfVotes == null
      ? "Voting has begun"
      : `Voting has begun! You have ${numberOfVotes} votes.`;
  store.dispatch("snackbar/setText", {
    text: text,
    isPersistent: true,
  });
});

feathersClient.service("/collection").on("patched", (_data) => {
  store.commit("films/clearAll");
  // data.current contains the current string for the correct collection
  // TODO: We should do things here like clear out films
});

export default feathersClient;
