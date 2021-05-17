<!-- Aqui template, donde ira el HTML que Vue renderizara -->
<template>
  <div class="donut">
    <donut-component :datos="datos" :castellanoactivo="true" />
  </div>
</template>
<!-- Aqui script, donde irá el Javascript (métodos, funciones, etc) -->
<script>
import QCalendar from "@quasar/quasar-ui-qcalendar"; // ui is aliased from '@quasar/quasar-ui-qcalendar'
import DonutComponent from "../components/DonutComponent.vue";
import { api } from "boot/axios";
/* const CURRENT_DAY = new Date();
function getCurrentDay(day) {
  const newDay = new Date(CURRENT_DAY);
  newDay.setDate(day);
  const tm = QCalendar.parseDate(newDay);
  return tm.date;
}*/
export default {
  components: {
    DonutComponent
  },
  name: "Informes",
  data() {
    return {
      selectedDate: "",
      now: "",
      events: [],
      datos: { presencial: 12, nopresencial: 30 }
    };
  },
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
.small {
  max-width: 600px;
  margin: 150px auto;
}
</style>
