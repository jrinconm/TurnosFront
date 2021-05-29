<!-- Aqui template, donde ira el HTML que Vue renderizara -->
<template>
  <div class="graficos">
    <q-separator />
    <div class="row q-pa-sm q-ma-md-lg">
      <div class="col-sm-4 col-xs-12 q-mx-md-xl q-px-md-xl">
        <h6 class="centrado">Dias por usuario</h6>
        <apexchart :options="options" :series="series"></apexchart>
      </div>

      <q-separator vertical />

      <div class="col-sm-4 col-xs-12 q-mx-md-xl q-px-md-xl">
        <h6 class="centrado">Usuario por días</h6>
        <apexchart :options="optionsb" :series="seriesb"></apexchart>
      </div>
    </div>
    <q-separator />
    <div class="row q-pa-sm q-ma-md-lg ">
      <div class="col-sm-4 col-xs-12 q-mx-md-xl q-px-md-xl">
        <h6 class="centrado">Total días</h6>
        <apexchart
          type="donut"
          :options="options2"
          :series="series2"
        ></apexchart>
      </div>
      <q-separator vertical />
      <div class="col-sm-4 col-xs-12 q-mx-md-xl q-px-md-xl">
        <h6 class="centrado">Porcentaje ocupación diaria</h6>
        <apexchart :options="options3" :series="series3"></apexchart>
      </div>
    </div>

    <div></div>
  </div>
</template>
<!-- Aqui script, donde irá el Javascript (métodos, funciones, etc) -->
<script>
import QCalendar from "@quasar/quasar-ui-qcalendar"; // ui is aliased from '@quasar/quasar-ui-qcalendar'
import { api } from "boot/axios";
import Vue from "vue";
import VueApexCharts from "vue-apexcharts";

Vue.use(VueApexCharts);
Vue.component("apexchart", VueApexCharts);
/* const CURRENT_DAY = new Date();
function getCurrentDay(day) {
  const newDay = new Date(CURRENT_DAY);
  newDay.setDate(day);
  const tm = QCalendar.parseDate(newDay);
  return tm.date;
}*/
export default {
  name: "Informes",
  data() {
    return {
      selectedDate: "",
      now: "",
      events: [],
      datos: { presencial: 12, nopresencial: 30 },
      options2: {
        chart: {
          type: "donut"
        },
        labels: ["Pepe", "Jose", "Josep"]
      },
      series2: [8, 12, 10],
      options3: {
        chart: {
          type: "donut"
        },
        labels: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"]
      },
      series3: [6, 6, 6, 6, 6],
      series: [
        {
          name: "Pepe",
          data: [0, 4, 0, 4, 0]
        },
        {
          name: "Jose",
          data: [4, 0, 4, 0, 4]
        },
        {
          name: "Josep",
          data: [2, 2, 2, 2, 2]
        }
      ],
      optionsb: {
        chart: {
          type: "bar",
          height: 350,
          toolbar: { tools: { download: false } }
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded"
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"]
        },
        xaxis: {
          categories: ["Pepe", "Jose", "Josep"]
        },
        yaxis: {
          title: {
            text: "Dias"
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return val + " días";
            }
          }
        }
      },
      seriesb: [
        {
          name: "Lunes",
          data: [0, 4, 2]
        },
        {
          name: "Martes",
          data: [4, 0, 2]
        },
        {
          name: "Miércoles",
          data: [0, 4, 2]
        },
        {
          name: "Jueves",
          data: [4, 0, 2]
        },
        {
          name: "Viernes",
          data: [0, 4, 2]
        }
      ],
      options: {
        chart: {
          type: "bar",
          height: 350,
          toolbar: { tools: { download: true } }
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded"
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"]
        },
        xaxis: {
          categories: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"]
        },
        yaxis: {
          title: {
            text: "Dias"
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return val + " días";
            }
          }
        }
      }
    };
  },
  /*options: {
        chart: {
          id: "vuechart-example"
        },
        xaxis: {
          categories: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"]
        }
      },
      series: [
        {
          name: "series-1",
          data: [30, 40, 45, 50, 49]
        }
      ]
    };
  },*/
  computed: {
    usuario: function() {
      return jrincon;
    },
    appChart: function() {
      let hoy = QCalendar.today();
      let estemes = hoy.substring(5, 7);
      let objeto = {
        labels: [],
        hoverBackgroundColor: "red",
        hoverBorderWidth: 10,
        datasets: [
          {
            label: "Data One",
            backgroundColor: ["#41B883", "#E46651", "#00D8FF"],
            data: []
          }
        ]
      };
      this.events.forEach(element => {
        // Solo miro este mes
        if (element.dia.date.substring(5, 7) === estemes) {
          objeto.labels.push(element.dia.title);
        }
      });
      // Elimino duplicados
      for (var i = objeto.labels.length - 1; i >= 0; i--) {
        if (objeto.labels.indexOf(objeto.labels[i]) !== i)
          objeto.labels.splice(i, 1);
      }
      objeto.labels.forEach(element => {
        let cuenta = 0;
        this.events.forEach(dia => {
          if (element === dia.dia.title) {
            cuenta++;
            console.log(element);
            console.log(dia.title);
          }
        });
        objeto.datasets[0].data.push(cuenta);
      });
      /*
        // Cuento las repeticiones

          this.events.forEach(element => {
        // Solo miro este mes
        if(element.dia.date.substring(5,7)===estemes){
          objeto.labels.push(element.dia.title);
        }
      });*/
      return objeto;
    }
  },
  methods: {
    /* getWeekDays() {
      {
        var baseDate = new Date(Date.UTC(2017, 0, 2)); // just a Monday
        var weekDays = [];
        for (i = 0; i < 7; i++) {
          weekDays.push(
            baseDate.toLocaleDateString(locale, { weekday: "long" })
          );
          baseDate.setDate(baseDate.getDate() + 1);
        }
        return weekDays;
      }

      var weekDays = getWeekDays("nl-NL");
    },*/
    fillData() {
      /*
      let cantidad = {};
      this.events.forEach(element => {
        this.cantidad++;
      });
      this.datacollection = {
        labels: [
          this.events.forEach(element => {
            return element.idTarea.title;
          })
        ]
      };
      this.events.forEach(element => {
        console.log(element);
      });
      //this.datacollection = this.appChart;
      this.appChart = this.datacollection;*/
    },
    obtendatos() {
      api
        // Obtengo todos los días trabajados del usuario
        // No obtengo solo el mes, porque no van a ser demasiados.
        // Como mucho 365 al año!
        .get("/api/diapresencial/name?usuario=" + this.id, {
          headers: { "x-access-token": this.JWTToken }
        })
        .then(response => {
          response.forEach(element => {
            // ES2020 Operador, babel ya se encargará de transpilarlo
            console.log(element);
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    diasMes: function(timestamp) {
      // Formato es YYYY-MM-DD
      let year = timestamp.substring(0, 3);
      let month = timestamp.substring(5, 6);
      let dias = QCalendar.daysInMonth(year, month);
      return dias;
    }
  },
  mounted() {
    this.fillData();
  },
  beforeDestroy() {}
};
</script>
<style scoped>
.centrado {
  text-align: center;
}
</style>
