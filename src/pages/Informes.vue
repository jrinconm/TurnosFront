<!-- Aqui template, donde ira el HTML que Vue renderizara -->
<template>
  <div class="graficos">
    <q-separator />
    <div class="row q-pa-sm q-ma-md-lg">
      <div class="col-sm-4 col-xs-12 q-mx-md-xl q-px-md-xl">
        <h6 class="centrado">Dias por usuario</h6>
        <apexchart
          :options="opcionesDiasUsuarios"
          :series="valoresDiasUsuarios"
        ></apexchart>
      </div>
      <q-separator vertical />

      <div class="col-sm-4 col-xs-12 q-mx-md-xl q-px-md-xl">
        <h6 class="centrado">Usuario por días</h6>
        <apexchart
          :options="opcionesUsuariosDias"
          :series="valoresUsuariosDias"
        ></apexchart>
      </div>
    </div>
    <q-separator />
    <div class="row q-pa-sm q-ma-md-lg ">
      <div class="col-sm-4 col-xs-12 q-mx-md-xl q-px-md-xl">
        <h6 class="centrado">Total días</h6>
        <apexchart
          type="donut"
          :options="opcionesTotalDias"
          :series="valoresTotalDias"
        ></apexchart>
      </div>
      <q-separator vertical />
      <div class="col-sm-4 col-xs-12 q-mx-md-xl q-px-md-xl">
        <h6 class="centrado">Porcentaje ocupación diaria</h6>
        <apexchart
          :options="opcionesOcupacion"
          :series="valoresOcupacion"
        ></apexchart>
      </div>
    </div>
  </div>
</template>
<!-- Aqui script, donde irá el Javascript (métodos, funciones, etc) -->
<script>
import QCalendar from "@quasar/quasar-ui-qcalendar"; // ui is aliased from '@quasar/quasar-ui-qcalendar'
import { api } from "boot/axios";
import {
  configUsuarioDias,
  configDiasUsuario,
  objDiasSemana,
  arrDiasSemana
} from "../Includes/opcionesgraficos";
import Vue from "vue";
import VueApexCharts from "vue-apexcharts";

Vue.use(VueApexCharts);
Vue.component("apexchart", VueApexCharts);
export default {
  name: "Informes",
  data() {
    return {
      consulta: "",
      usuarios: [],
      fechas: []
    };
  },
  computed: {
    JWTToken: function() {
      return localStorage.getItem("user-token");
    }, // store the token in localstorage
    hoy: function() {
      return new Date();
    },
    departamento: function() {
      return localStorage.getItem("departamento");
    },
    mes: function() {
      return this.hoy.getMonth() + 1;
    },
    anyo: function() {
      return this.hoy.getFullYear();
    },
    opcionesUsuariosDias: function() {
      return this.generaOpcionesUsuariosDias();
    },
    valoresUsuariosDias: function() {
      return this.generaValoresUsuariosDias();
    },
    opcionesDiasUsuarios: function() {
      return this.generaOpcionesDiasUsuarios();
    },
    valoresDiasUsuarios: function() {
      return this.generaValoresDiasUsuarios();
    },
    opcionesTotalDias: function() {
      return this.generaOpcionesTotalDias();
    },
    valoresTotalDias: function() {
      return this.generaValoresTotalDias();
    },
    opcionesOcupacion: function() {
      return this.generaOpcionesOcupacion();
    },
    valoresOcupacion: function() {
      return this.generaValoresOcupacion();
    }
  },
  methods: {
    generatotal() {
      this.fechas.splice(0);
      this.usuarios.splice(0);
      api
        // Obtengo todos los usuarios del mismo departamento que del usuario
        .get("/api/user/dep?departamento=" + this.departamento, {
          headers: { "x-access-token": this.JWTToken }
        })
        .then(response => {
          let consulta = response.data;
          consulta.forEach(usuario => {
            // Saco los días por usuario
            this.usuarios.push(usuario);
            this.obtenDatosMesyUsuario(usuario.id);
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    // // Obtengo todos los días del mismo departamento del usuario con id => id
    obtenDatosMesyUsuario(id) {
      api
        .get(
          "/api/diapresencial/mesynombre?mes=" +
            this.mes +
            "&anyo=" +
            this.anyo +
            "&usuario=" +
            id,
          {
            headers: { "x-access-token": this.JWTToken }
          }
        )
        .then(response => {
          response.data.forEach(dia => {
            this.fechas.push(dia);
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
    },
    generaOpcionesUsuariosDias: function() {
      let options = { ...configUsuarioDias };
      options.xaxis = {
        categories: this.obtenNombres()
      };
      return options;
      // Genero los datos
    },
    generaValoresUsuariosDias: function() {
      let valores = [...objDiasSemana];
      valores.forEach((dia, indice) => {
        valores[indice].data = [];
      });
      this.usuarios.forEach(usuario => {
        let dias = this.diasUsuario(usuario.id);
        for (let x = 0; x < 5; x++) {
          valores[x].data.push(this.cuentaDiasSemana(x + 1, dias));
        }
      });
      return valores;
    },
    generaOpcionesDiasUsuarios: function() {
      let options = { ...configDiasUsuario };
      return options;
    },
    generaValoresDiasUsuarios: function() {
      let datos = [];
      this.usuarios.forEach(usuario => {
        let objeto = {};
        objeto.name = usuario.nombre;
        objeto.data = [];
        let dias = this.diasUsuario(usuario.id);
        for (let x = 0; x < 5; x++) {
          objeto.data.push(this.cuentaDiasSemana(x + 1, dias));
        }
        datos.push(objeto);
      });
      return datos;
    },
    generaOpcionesTotalDias: function() {
      let options = {
        chart: {
          type: "donut"
        },
        labels: this.obtenNombres()
      };
      return options;
    },
    generaValoresTotalDias: function() {
      let dias = [];
      this.usuarios.forEach(usuario => {
        dias.push(this.diasUsuario(usuario.id).length);
      });
      return dias;
    },
    generaOpcionesOcupacion: function() {
      let options = {
        chart: {
          type: "donut"
        },
        labels: arrDiasSemana
      };

      return options;
    },
    generaValoresOcupacion: function() {
      let objeto = [];
      for (let x = 0; x < 5; x++) {
        objeto.push(this.cuentaDiasSemana(x + 1, this.fechas));
      }
      return objeto;
    },

    obtenNombres: function() {
      let nombre = [];
      this.usuarios.forEach(usuario => nombre.push(usuario.nombre));
      return nombre;
    },
    diasUsuario: function(usuario) {
      let dias = [];
      this.fechas.forEach(dia => {
        if (dia.UsuarioId == usuario) {
          dias.push(dia);
        }
      });
      return dias;
    },
    cuentaDiasSemana: function(diaSem, dias) {
      //Diasem 0 para el domingo
      let cuenta = 0;
      dias.forEach(dia => {
        let date = new Date(dia.dia);
        if (date.getDay() == diaSem) {
          cuenta++;
        }
      });
      return cuenta;
    }
  },
  mounted() {
    this.generatotal();
    this.generaValoresUsuariosDias();
  }
};
</script>
<style scoped>
.centrado {
  text-align: center;
}
</style>
