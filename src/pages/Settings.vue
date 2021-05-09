<!-- Aqui template, donde ira el HTML que Vue renderizara -->
<template>
  <div class="fixed-center text-center">
    <div class="col-sm-6 col-xs-12 q-pa-sm q-mt-xl">
      <q-input
        filled
        v-model="secondcolor"
        :rules="['anyColor']"
        hint="Elige tu color"
        class="my-input"
      >
        <template v-slot:append>
          <q-icon name="colorize" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-color v-model="secondcolor" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <div class="col-sm-6 col-xs-12 q-pa-sm q-mt-xl">
      <selector-icono></selector-icono>
    </div>
  </div>
</template>
<!-- Aqui script, donde irá el Javascript (métodos, funciones, etc) -->
<script>
import SelectorIcono from "../components/SelectorIcono.vue";
export default {
  name: "Config",
  components: {
    SelectorIcono
  },
  data() {
    return {
      color: "#FF00FF",
      secondcolor: "#027be3"
    };
  }
};
</script>
