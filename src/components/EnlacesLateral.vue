<template>
  <q-list>
    <q-img
      src="../assets/Loginicon.svg"
      spinner-color="white"
      style="height: 150px; max-width: 150px"
      class="q-ma-md q-ml-xl"
    />
    <q-separator inset />
    <q-item to="" exact>
      <q-item-section avatar> </q-item-section>

      <q-item-section>
        {{ nombre }}
      </q-item-section>
    </q-item>

    <q-separator inset />
    <q-item to="/calendario" exact>
      <q-item-section avatar>
        <q-icon name="calendar_today" />
      </q-item-section>

      <q-item-section>
        Calendario
      </q-item-section>
    </q-item>

    <q-item to="/informes" exact v-if="rol === 'gestor' || rol === 'admin'">
      <q-item-section avatar>
        <q-icon name="print" />
      </q-item-section>

      <q-item-section>
        Informes
      </q-item-section>
    </q-item>

    <q-item to="/settings" exact>
      <q-item-section avatar>
        <q-icon name="settings" />
      </q-item-section>

      <q-item-section>
        Configuración personal
      </q-item-section>
    </q-item>

    <q-item to="/admin" exact v-if="rol === 'admin'">
      <q-item-section avatar>
        <q-icon name="admin_panel_settings" />
      </q-item-section>

      <q-item-section>
        Panel administrador
      </q-item-section>
    </q-item>

    <q-item to="/salir" exact>
      <q-item-section avatar>
        <q-icon name="exit_to_app" />
      </q-item-section>

      <q-item-section>
        Logout
      </q-item-section>
    </q-item>
  </q-list>
</template>
<script>
export default {
  name: "EnlacesLateral",
  data: function() {
    return {
      photoUrl: null
    };
  },
  computed: {
    rol: function() {
      return localStorage.getItem("rol");
    },
    nombre: function() {
      return localStorage.getItem("username");
    } // store the token in localstorage
  }
};
</script>
