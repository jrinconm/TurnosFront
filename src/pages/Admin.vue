<!-- Aqui template, donde ira el HTML que Vue renderizara -->
<template>
  <div>
    <div class="row q-pa-sm q-ma-md-sm q-pa-md-sm">
      <div class="col-sm-12 col-xs-12 q-ma-md-sm q-pa-md-sm ">
        <gestorusuario></gestorusuario>
      </div>
      <div class="col-sm-4 col-xs-12 q-ma-md-xs q-pa-md-xs">
        <editordias></editordias>
      </div>
      <!-- <div class="col-sm-3 col-xs-12 q-ma-md-xs q-pa-md-xs">
        <editor-roles></editor-roles>
      </div>
      <div class="col-sm-4 col-xs-12 q-ma-md-xs q-pa-md-xs">
        <editor-departamentos></editor-departamentos>
      </div> -->
    </div>
  </div>
</template>
<!-- Aqui script, donde irá el Javascript (métodos, funciones, etc) -->
<script>
import editordias from "../components/EditorDiaPresencial.vue";
import gestorusuario from "../components/Usuariocomponent.vue";
//import editorRoles from "../components/EditorRoles.vue";
//import editorDepartamentos from "../components/EditorDepartamentos.vue";
export default {
  name: "Administracion",
  components: {
    editordias,
    gestorusuario
    //    editorRoles,
    //    editorDepartamentos
  },
  beforeMount() {
    //Por si algun listo quiere entrar a fuego
    let rol = localStorage.getItem("rol");
    if (rol != "admin") {
      this.$store.dispatch("auth/AUTH_LOGOUT").then(() => {
        this.$router.push("/login");
      });
    }
  }
};
</script>
