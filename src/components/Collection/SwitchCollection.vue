<template>
  <div class="mb-3">
    <!-- <h2 class="display-2 mt-4 pb-3">Switch Collection</h2> -->

    <v-card>
      <v-card-title class="font-weight-regular justify-space-between">
        <span>Current Collection: {{ currentCollection }}</span>
      </v-card-title>

      <v-card-text>
        <v-btn block color="primary" @click="save">
          Switch collection to {{ alternativeCollection }}
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { JONATHAN_COLLECTION, ARRAN_COLLECTION } from "@/constants";
import router from "@/router";

export default {
  name: "SwitchCollection",
  methods: {
    ...mapActions("snackbar", { setSnackbarText: "setText" }),
    ...mapActions("collection", {
      getCurrentCollection: "getCurrent",
      changeCollection: "changeCurrent",
    }),
    ...mapActions("loading", ["setLoaded"]),
    save() {
      const switchingTo = this.alternativeCollection.slice(
        0,
        this.alternativeCollection.length
      );
      this.changeCollection();
      this.setSnackbarText(`Switched to ${switchingTo}'s collection`);
      router.push("/home");
    },
  },
  computed: {
    ...mapState("collection", { currentCollection: "current" }),
    alternativeCollection() {
      // TODO: Remove hardcoded collections
      return this.currentCollection === JONATHAN_COLLECTION
        ? ARRAN_COLLECTION
        : JONATHAN_COLLECTION;
    },
  },
  async created() {
    await this.getCurrentCollection();
    await this.setLoaded("Collection");
  },
};
</script>
