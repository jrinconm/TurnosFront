<!-- Aqui template, donde ira el HTML que Vue renderizara -->
<template>
  <div class="q-pa-md">
    <div class="row flex flex-center q-mt-md">
      <q-select
        v-model="select"
        :options="options"
        class="q-ma-md"
        label="icon set"
        style="width:200px"
        clearable
      />
      <q-input
        v-model="value"
        label="icon name"
        class="q-ma-md"
        style="width:200px"
        clearable
        readonly
      >
        <template v-slot:append>
          <q-icon :name="value" />
        </template>
      </q-input>
      <q-input
        v-model="filter"
        label="filter"
        clearable
        class="q-ma-md"
        style="width:200px"
      />
    </div>
    <div class="row">
      <div class="q-ma-xl" style="width:90%;margin-left:8%">
        <q-icon-picker
          @input="cambioicono()"
          v-model="value"
          tooltips
          font-size="25px"
          color="grey-7"
          selected-color="white"
          pagination-color="red"
          selected-background-color="blue-4"
          :icon-set="select"
          :filter="filter"
          :pagination.sync="pagination"
          style="height: 300px"
        >
        </q-icon-picker>
      </div>
    </div>
  </div>
</template>
<!-- Aqui script, donde irá el Javascript (métodos, funciones, etc) -->
<script>
import { Component as QIconPicker } from "@quasar/quasar-ui-qiconpicker";

export default {
  name: "SelectorIcono",
  components: {
    QIconPicker
  },
  props: {
    icono: { required: true, type: String }
  },
  data() {
    return {
      options: [
        "ionicons-v4",
        "fontawesome-v5",
        "eva-icons",
        "themify",
        "line-awesome",
        "material-icons" // optional, you are not bound to it
      ],
      select: "fontawesome-v5",
      value: "",
      filter: "",
      pagination: {}
    };
  },
  computed: {
    JWTToken: function() {
      return localStorage.getItem("user-token");
    }, // store the token in localstorage
    id: function() {
      return localStorage.getItem("id");
    }, // store the id in localstorage
    username: function() {
      return localStorage.getItem("username");
    } // store the username in localstorage
  },
  mounted() {},
  methods: {
    cambioicono() {
      this.$emit("cambio-icono", this.value);
    }
  }
};
</script>
<style src="@quasar/quasar-ui-qiconpicker/dist/index.css"></style>
