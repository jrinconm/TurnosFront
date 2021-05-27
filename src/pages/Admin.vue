<!-- Aqui template, donde ira el HTML que Vue renderizara -->
<template>
  <div>
    <div class="row q-pa-sm q-ma-md-xl q-pa-md-xl">
      <div class="col-sm-8 col-xs-12">
        <gestorusuario></gestorusuario>
      </div>
    </div>
    <div class="row q-pa-md-xl q-ma-md-xl ">
      <div
        class="col-sm-4 col-xs-12"
        v-for="(tabla, key) in datos"
        v-bind:key="key"
      >
        <editortablas v-bind:tabla="tabla"></editortablas>
      </div>
    </div>
  </div>
</template>
<!-- Aqui script, donde irá el Javascript (métodos, funciones, etc) -->
<script>
import editortablas from "../components/EditorTablas.vue";
import gestorusuario from "../components/Usuariocomponent.vue";
export default {
  name: "Administracion",
  components: {
    editortablas,
    gestorusuario
  },
  data() {
    return {
      datos: [{ nombre: "Estados", tabla: "estadodia" }]
    };
  }
};
</script>
