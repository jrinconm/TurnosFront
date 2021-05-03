<!-- Aqui template, donde ira el HTML que Vue renderizara -->
<template>
  <div class="salida fixed-center text-center">
    <h3>Salir</h3>
    <button @click="salidaUsuario">LOGOUT</button>
  </div>
</template>
<!-- Aqui script, donde irá el Javascript (métodos, funciones, etc) -->
<script>
export default {
  name: "salir",
  data() {
    return {};
  },
  methods: {
    salidaUsuario: function() {
      this.$auth.signOut().then(() => {
        this.$router.replace("/login");
      });
    }
  }
};
</script>
<style scoped>
.salida {
  margin-top: 40px;
}
input {
  margin: 10px 0;
  padding: 15px;
}
button {
  margin-top: 20px;
  cursor: pointer;
}
p {
  margin-top: 40px;
  font-size: 13px;
}
p a {
  text-decoration: underline;
  cursor: pointer;
}
</style>
