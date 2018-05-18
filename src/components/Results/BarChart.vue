<template>
  <div class="graph-cont">
    <div v-for="option in data" :key="option.name" class="bar" :id="option.name" :style="{'--width': calcPercentage(option) }"> <span><strong>{{option.name}}</strong> ({{option.votes}})</span></div>
  </div>
</template>

<script>
export default {
  name: 'BarChart',
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  computed: {
    totalVotes () {
      return this.data.reduce((acc, val) => { return acc + val.votes }, {votes: 0})
    }
  },
  methods: {
    calcPercentage (option) {
      if (option.votes === 0) {
        return '0%'
      } else if (option.votes === 100) {
        return '100%'
      } else {
        return Math.ceil((option.votes / this.totalVotes) * 100) + '%'
      }
    }
  }
}
</script>

<style>
 /* https://codepen.io/jedtrow/pen/YPrqKY */
.graph-cont{
  width: calc(100% - 40px);
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.bar{
  height: 30px;
  max-width: 800px;
  margin: 0 auto 10px auto;
  position: relative;
}

span {
  line-height: 30px;
  font-size: 16px;
  color: white;
  padding: 0 0 0 10px;
  position: relative;
  z-index: 999
}
.bar::before{
  content: '';
  width: 100%;
  position: absolute;
  left: 0;
  height: 30px;
  top: 0;
  background: #ecf0f1;
  z-index: 991;
}
.bar::after{
  content: '';
  background: #2ecc71;
  height: 30px;
  transition: 0.7s;
  display: block;
  width: 100%;
  -webkit-animation: bar-before 1 1.8s;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 992;
  max-width: var(--width);
}

@-webkit-keyframes bar-before{
  0%{
    width: 0px;
  }
  100%{
    width: 100%;
  }
}
</style>