<!-- Aqui template, donde ira el HTML que Vue renderizara -->
<template>
  <div class="salida fixed-center text-center">
    <q-btn
      rounded
      size="xl"
      class="q-px-xl q-py-xs q-ma-xl"
      color="blue"
      label="Permanecer"
      @click="permanecer"
    />
    <q-btn
      rounded
      size="xl"
      class="q-px-xl q-py-xs q-ma-xl"
      color="red"
      label="Salir"
      @click="salidaUsuario"
    />
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
      this.$store.dispatch("auth/AUTH_LOGOUT").then(() => {
        this.$router.push("/login");
      });
    },
    permanecer() {
      this.$router.push("/calendario");
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
