<!-- Aqui template, donde ira el HTML que Vue renderizara -->
<template>
  <div>
    <div class="row q-pa-sm q-ma-md-md q-pa-md-md">
      <div class="col-sm-7 col-xs-12 q-ma-md-md q-pa-md-md ">
        <gestorusuario></gestorusuario>
      </div>
      <div class="col-sm-4 col-xs-12 q-ma-md-md q-pa-md-md">
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
