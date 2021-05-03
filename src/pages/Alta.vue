<!-- Aqui template, donde ira el HTML que Vue renderizara -->
<template>
  <div class="column q-pa-lg">
    <div class="row justify-center full-height full-width text-center">
      <q-card square class="shadow-24" style="width:300px;height:510px;">
        <q-card-section class="bg-deep-purple-7">
          <h4 class="text-h5 text-white q-my-md">Registro</h4>
          <div
            class="absolute-bottom-right q-pr-md"
            style="transform: translateY(50%);"
          >
            <q-btn fab icon="close" color="purple-4" />
          </div>
        </q-card-section>
        <q-card-section>
          <q-form class="q-px-sm q-pt-xl q-pb-lg">
            <q-input
              square
              clearable
              v-model="email"
              type="email"
              label="Email"
            >
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>
            <q-input
              square
              clearable
              v-model="username"
              type="username"
              label="Username"
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>
            <q-input
              square
              clearable
              v-model="password"
              type="password"
              label="Password"
            >
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
            </q-input>
          </q-form>
        </q-card-section>
        <q-card-actions class="q-px-lg">
          <q-btn
            @click="altaUsuario"
            unelevated
            size="lg"
            color="purple-4"
            class="full-width text-white"
            label="Registrate"
          />
        </q-card-actions>
        <q-card-section class="text-center q-pa-sm">
          <q-btn to="/login" label="Volver al login" outline color="grey" />
        </q-card-section>
      </q-card>
    </div>
  </div>
  <!--
  <div class="alta fixed-center text-center">
    <h3>Cuenta nueva</h3>
    <input type="text" v-model="email" placeholder="Correo" /><br />
    <input type="password" v-model="password" placeholder="Contraseña" /><br />
    <button @click="altaUsuario">Alta</button>
  </div>-->
</template>
<!-- Aqui script, donde irá el Javascript (métodos, funciones, etc) -->
<script>
export default {
  name: "alta",
  data() {
    return {
      email: "",
      password: "",
      username: ""
    };
  },
  methods: {
    altaUsuario: function() {
      let esto = this;
      esto.$auth.createUserWithEmailAndPassword(this.email, this.password).then(
        function(user) {
          alert("Cuenta creada");
          esto.$auth.currentUser
            .updateProfile({
              displayName: esto.username
            })
            .then(function() {
              // Update successful.
            })
            .catch(function(error) {
              // An error happened.
            });
          esto.$router.replace("/calendario");
        },
        function(err) {
          alert(err.message);
        }
      );
    }
  }
};
</script>
<style scoped>
.alta {
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
