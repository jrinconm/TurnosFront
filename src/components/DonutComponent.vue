<template>
  <div class="contenedor-donut">
    <doughnut-chart
      :styles="myStyles"
      :chart-data="chartData"
      :options="options"
      class="donut"
    />
  </div>
</template>

<script>
import DoughnutChart from "./DoughnutChart.vue";
export default {
  name: "DonutComponent",
  components: {
    DoughnutChart
  },
  props: {
    datos: { required: true, type: Object }
  },
  data() {
    return {
      options: {
        legend: {
          display: true
        },
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  computed: {
    chartData: function() {
      return {
        labels: ["Presencial ", "Teletrabajo "],
        datasets: [
          {
            borderWidth: 1,
            borderColor: ["#855085", "#508550"],
            backgroundColor: ["#85508533", "#50855033"],
            data: [this.datos.presencial, this.datos.nopresencial]
          }
        ]
      };
    },
    myStyles() {
      return { height: "13rem" };
    }
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.contenedor-donut {
  align-items: center;
  justify-content: center;
}
</style>
