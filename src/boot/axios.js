import Vue from "vue";
import axios from "axios";

Vue.prototype.$axios = axios;

//const api = axios.create({ baseURL: "http://jrincon.eu:8080" });
const api = axios.create({ baseURL: "http://localhost:8080" });
Vue.prototype.$api = api;
// ^ ^ ^ this will allow you to use this.$api
//       so you can easily perform requests against your app's API

export { axios, api };
