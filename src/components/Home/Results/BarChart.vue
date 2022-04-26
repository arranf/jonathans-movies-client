<template>
  <div class="graph-cont">
    <template v-for="option in data">
      <div
        :id="option.id"
        :key="option.name + 'bar'"
        class="bar"
        :style="{ '--width': option.percentage, '--color': option.color }"
      >
        <span class="bar-label"
          ><strong>{{ option.name }}</strong></span
        >
        <span class="bar-count" style="float: right">{{ option.votes }}</span>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "BarChart",
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style>
/* https://codepen.io/jedtrow/pen/YPrqKY */
.graph-cont {
  width: calc(100% - 40px);
  width: 100%;
  margin: 0 auto;
}

.bar {
  height: 3em;
  margin: 0 auto 10px auto;
  position: relative;
}

.bar-label {
  line-height: 3em;
  font-size: 16px;
  color: white;
  padding: 0 0 0 10px;
  position: relative;
  /* Make it honor width */
  display: inline-block;
  width: 90%;

  z-index: 1;

  /* Handle text overflow */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bar-count {
  line-height: 3em;
  font-size: 16px;
  color: white;
  margin-right: 15px;
  position: relative;
  z-index: 1;
}

.bar::before {
  content: "";
  width: 100%;
  position: absolute;
  left: 0;
  height: 3em;
  top: 0;
  background: #bdbdbd;
  z-index: 0;
}

.bar::after {
  content: "";
  background: var(--color);
  height: 3em;
  transition: 0.7s;
  display: block;
  width: 100%;
  animation: bar-before 1 1.8s;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  max-width: var(--width);
}

@keyframes bar-before {
  0% {
    width: 0px;
  }
  100% {
    width: 100%;
  }
}
</style>
