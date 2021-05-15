<template>
  <div class="text-center configuracion">
    <div class="row">
      <div class="col-md-4 col-xs-12">
        <div class="row">
          <div class="col-md-12">
            <q-card class="infoactual">
              <q-card-section>
                Color actual:
                <q-badge class="color" color="info">
                  {{ secondcolor }}
                </q-badge>
              </q-card-section>
              <q-card-section>
                Icono actual <q-icon class="icono" color="info" :name="icono"
              /></q-card-section>
            </q-card>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="q-pa-sm q-mt-xl eligecolor">
              <q-input
                filled
                readonly
                v-model="secondcolor"
                :rules="['anyColor']"
                hint="Elige tu color"
                class="my-input"
              >
                <template v-slot:append>
                  <q-icon name="colorize" class="cursor-pointer">
                    <q-popup-proxy
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-color
                        no-footer
                        :palette="paleta"
                        default-view="palette"
                        @change="actualizacolor"
                        v-model="secondcolor"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
        </div>
        <div class="row justify-start">
          <q-btn
            @click="actualizar"
            :loading="submitting"
            :disable="cambios"
            label="Guardar cambios"
            class="q-mt-md"
            color="teal"
          >
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </div>
      </div>
      <div class="col-md-8 col-xs-12">
        <div class="row">
          <div class="col-md-12">
            <div class="q-pa-sm q-mt-xl">
              <selector-icono
                :icono="icono"
                @cambio-icono="oncambioicono"
              ></selector-icono>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<!-- Aqui script, donde irá el Javascript (métodos, funciones, etc) -->
<script>
import { api } from "boot/axios";
import { colors } from "quasar";
const { setBrand } = colors;
var removeItemFromArr = (arr, item) => {
  var i = arr.indexOf(item);
  i !== -1 && arr.splice(i, 1);
};
import SelectorIcono from "../components/SelectorIcono.vue";
export default {
  name: "Config",
  components: {
    SelectorIcono
  },
  data() {
    return {
      color: "#FF00FF",
      data: {},
      secondcolor: "",
      coloresusados: [],
      icono: "",
      cambios: true,
      submitting: false
    };
  },
  mounted() {
    this.cargadatos();
    this.obtencoloresusados();
  },
  computed: {
    JWTToken: function() {
      return localStorage.getItem("user-token");
    }, // store the token in localstorage
    id: function() {
      return localStorage.getItem("id");
    }, // store the id in localstorage
    username: function() {
      return localStorage.getItem("username");
    }, // store the username in localstorage
    paleta: function() {
      let paleta = [
        "#f44336",
        "#e81e63",
        "#9c27b0",
        "#673ab7",
        "#3f51b5",
        "#2196f3",
        "#03a9f4",
        "#00bcd4",
        "#009688",
        "#4caf50",
        "#8bc34a",
        "#cddc39",
        "#ffeb3b",
        "#ffc107",
        "#ff9800",
        "#ff5722",
        "#795548",
        "#9e9e9e",
        "#607d8b"
      ];
      this.coloresusados.forEach(element => {
        removeItemFromArr(paleta, element);
      });
      return paleta;
    }
  },
  methods: {
    oncambioicono(icono) {
      this.icono = icono;
      localStorage.setItem("icono", icono); // store the username in localstorage
      this.cambios = false;
    },
    cambiacolor(color) {
      setBrand("info", color);
      this.secondcolor = color;
    },
    obtencoloresusados() {
      api
        .get("/api/user/", {
          headers: { "x-access-token": this.JWTToken }
        })
        .then(response => {
          let respuesta = response.data;
          this.coloresusados.splice(0);
          respuesta.forEach(element => {
            this.coloresusados.push(element.color);
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    cargadatos: function() {
      // Obtengo la configuracion del usuario
      api
        .get("/api/user/id?id=" + this.id, {
          headers: { "x-access-token": this.JWTToken }
        })
        .then(response => {
          this.data = response.data;
          // Cambio color e icono de la configuracion
          this.data.color
            ? this.cambiacolor(this.data.color)
            : this.cambiacolor("#0026ff");
          this.data.icono
            ? (this.icono = this.data.icono)
            : (this.icono = "work");
        })
        .catch(error => {
          console.log(error);
        });
      this.obtencoloresusados();
    },
    actualizacolor() {
      this.cambiacolor(this.secondcolor);
      localStorage.setItem("color", this.secondcolor); // store the username in localstorage
      this.cambios = false;
    },
    actualizar: function() {
      this.submitting = true;
      // Obtenemos del click los datos
      let body = { color: this.secondcolor, icono: this.icono };
      api
        .put("/api/user/id?id=" + this.id, body, {
          headers: { "x-access-token": this.JWTToken }
        })
        .then(response => {
          this.data = response.data;
          this.submitting = false;
          this.cambios = true;
        })
        .catch(error => {
          console.log(error);
        });
      this.cargadatos();
    }
  }
};
</script>
<style lang="sass" scoped>

.infoactual, .eligecolor
  padding: 2rem
  margin: 2rem
  font-size: 1rem
  .icono
    font-size: 3.5rem
  .color
    padding: 1rem
.configuracion
  margin: 2rem
@media (max-width: $breakpoint-xs-max)
  .infoactual,.eligecolor
    width: 90vw
    padding: 0.5rem
    margin: 0.5rem
  .configuracion
    margin: 1rem
</style>
