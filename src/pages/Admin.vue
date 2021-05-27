<!-- Aqui template, donde ira el HTML que Vue renderizara -->
<template>
  <div class="row">
    <div
      class="col-sm-4 col-xs-12 q-pa-sm q-mt-xl"
      v-for="(tabla, key) in datos"
      v-bind:key="key"
    >
      <editortablas v-bind:tabla="tabla"></editortablas>
    </div>
    <div class="col-sm-11 col-xs-12 q-pa-sm q-ma-xl">
      <gestorusuario></gestorusuario>
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
      datos: [
        { nombre: "Departamentos", tabla: "departamento" },
        { nombre: "Estados", tabla: "estadodia" }
      ]
    };
  }
};
</script>
