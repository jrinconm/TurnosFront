<!-- Aqui template, donde ira el HTML que Vue renderizara -->
<template>
  <div class="text-center q-pa-sm q-ma-xl">
    <div class="row">
      <q-card class="infoactual q-pa-sm q-ma-xl">
        <q-card-section>
          Color actual:
          <q-badge color="info">
            {{ secondcolor }}
          </q-badge>
        </q-card-section>
        <q-card-section>
          Icono actual <q-icon color="info" :name="icono"
        /></q-card-section>
      </q-card>
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
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-color @change="actualizacolor" v-model="secondcolor" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>
    <div class="q-pa-sm q-mt-xl">
      <selector-icono
        :icono="icono"
        @cambio-icono="oncambioicono"
      ></selector-icono>
    </div>
  </div>
</template>
<!-- Aqui script, donde irá el Javascript (métodos, funciones, etc) -->
<script>
import { api } from "boot/axios";
import { colors } from "quasar";
const { setBrand } = colors;
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
      icono: "",
      cambios: false
    };
  },
  mounted() {
    this.cargadatos();
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
    } // store the username in localstorage
  },
  methods: {
    oncambioicono(icono) {
      this.icono = icono;
      localStorage.setItem("icono", icono); // store the username in localstorage
    },
    cambiacolor(color) {
      setBrand("info", color);
      this.secondcolor = color;
    },
    cargadatos: function() {
      api
        .get("/api/user/id?id=" + this.id, {
          headers: { "x-access-token": this.JWTToken }
        })
        .then(response => {
          this.data = response.data;
          this.data.color
            ? this.cambiacolor(this.data.color)
            : this.cambiacolor("#027be3");
          this.data.icono
            ? (this.icono = this.data.icono)
            : (this.icono = "work");
        })
        .catch(error => {
          console.log(error);
        });
    },
    actualizacolor() {
      this.cambiacolor(this.secondcolor);
      localStorage.setItem("color", this.secondcolor); // store the username in localstorage
      this.cambios = true;
    },
    actualizar: function() {
      // Obtenemos del click los datos
      let body = { dia: dia.date, usuario: this.id };
      api
        .post("/api/diapresencial/", body, {
          headers: { "x-access-token": this.JWTToken }
        })
        .then(response => {
          this.data = response.data;
          console.log(this.data);
        })
        .catch(error => {
          console.log(error);
        });
      this.obtendatos();
    }
  }
};
</script>
<style lang="sass" scoped>

.infoactual, .eligecolor
  width: 15vw
  body.screen--xs &
    color: #000
  body.screen--sm &
    color: #fff
@media (max-width: $breakpoint-xs-max)
  .infoactual
    width: 100vw
  .eligecolor
    width: 100vw
</style>
