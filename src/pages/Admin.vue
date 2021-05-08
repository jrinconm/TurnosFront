<!-- Aqui template, donde ira el HTML que Vue renderizara -->
<template>
  <<<<<<< HEAD
  <div class="row">
    <div
      class="col-sm-4 col-xs-12 q-pa-sm q-mt-xl"
      v-for="(tabla, key) in datos"
      v-bind:key="key"
    >
      <editortablas v-bind:tabla="tabla"></editortablas>
    </div>
    ======= >>>>>>> c89011453e761eb49a2374784f12ddcef0095be0
  </div>
</template>
<!-- Aqui script, donde irá el Javascript (métodos, funciones, etc) -->
<script>
import editortablas from "../components/EditorTablas.vue";
export default {
  name: "Administracion",
<<<<<<< HEAD
  components: {
    editortablas
  },
  data() {
    return {
      datos: [
        { nombre: "Departamentos", tabla: "departamento" },
        { nombre: "Estados", tabla: "estadodia" },
        { nombre: "Roles", tabla: "rol" }
      ]
    };
  }
};
</script>
======= >>>>>>> c89011453e761eb49a2374784f12ddcef0095be0
