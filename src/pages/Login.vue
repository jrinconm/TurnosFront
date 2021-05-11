<template>
  <q-page
    class="gris window-height window-width row justify-center items-center"
  >
    <div class="column">
      <div class="row">
        <h5 class="text-h5 text-primary q-my-md">Turnos Teletrabajo</h5>
      </div>
      <div class="row">
        <q-card square bordered class="bg-primary q-pa-lg shadow-1">
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input
                square
                filled
                clearable
                v-model="email"
                type="email"
                label="usuario/email"
                class="gris"
              >
                <template v-slot:prepend>
                  <q-icon name="account_box" />
                </template>
              </q-input>
              <q-input
                square
                filled
                clearable
                v-model="password"
                type="password"
                label="contraseña"
                class="gris"
              >
                <template v-slot:prepend> <q-icon name="lock" /> </template
              ></q-input>
            </q-form>
          </q-card-section>
          <p v-if="error" class="error">Email o contraseña errónea.</p>
          <q-card-actions class="q-px-md">
            <q-btn
              unelevated
              color="secondary"
              size="lg"
              class="full-width"
              label="Login"
              @click="login"
            />
          </q-card-actions>

          <q-card-section class="text-center q-pa-none">
            <p class="text-grey-6">Darse de alta</p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      error: false
    };
  },
  methods: {
    login() {
      //const { email, password } = this;
      let body = { username: this.email, pass: this.password };
      this.$store.dispatch("auth/AUTH_REQUEST", body).then(() => {
        this.$router.push("/calendario");
      });
      /* 
      let body = { username: this.email, pass: this.password };
      api
        .post("/api/auth/signin", body)
        .then(response => {
          api.defaults.headers.common["x-access-token"] =
            response.data.accessToken;
        })
        .catch(error => {
          console.log(error);
        });*/
    }
  }
};
</script>

<style scoped>
.gris {
  background: #bbbbbb;
}
</style>
