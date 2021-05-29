<!-- Aqui template, donde ira el HTML que Vue renderizara -->
<template>
  <div>
    <div class="row q-pa-sm q-ma-md-xl q-pa-md-xl">
      <div class="col-sm-8 col-xs-12">
        <gestorusuario></gestorusuario>
      </div>
    </div>
    <div class="row q-pa-md-sx q-ma-md-xl ">
      <div class="col-sm-4 col-xs-12">
        <editordias></editordias>
      </div>
    </div>
  </div>
</template>
<!-- Aqui script, donde irá el Javascript (métodos, funciones, etc) -->
<script>
import editordias from "../components/EditorDiaPresencial.vue";
import gestorusuario from "../components/Usuariocomponent.vue";
export default {
  name: "Administracion",
  components: {
    editordias,
    gestorusuario
  }
};
</script>
