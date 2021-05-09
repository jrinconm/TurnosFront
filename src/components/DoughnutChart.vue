<script>
import { Doughnut, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;
export default {
  extends: Doughnut,
  mixins: [reactiveProp],
  props: {
    //chartdata: { required: true, type: Object },
    options: { required: true, type: Object },
  },
  data() {
    return {};
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};
</script>
