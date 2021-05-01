<template>
  <!-- Dejo solo la ventana del login -->
  <q-layout view="lHh Lpr lFf">
    <q-header elevated> </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script>
// No tiene nada mas que el login
export default {
  name: "MainLayout",
  data() {
    return {};
  }
};
</script>
