/*
export function someAction (context) {
}
*/
import { api } from "boot/axios";
export function AUTH_REQUEST({ commit, dispatch }, user) {
  return new Promise((resolve, reject) => {
    // The Promise used for router redirect in login
    commit("AUTH_REQUEST");
    api
      .post("/api/auth/signin", user)
      .then(resp => {
        localStorage.setItem("user-token", resp.data.accessToken); // store the token in localstorage
        localStorage.setItem("id", resp.data.id); // store the id in localstorage
        localStorage.setItem("username", resp.data.username); // store the username in localstorage
        commit("AUTH_SUCCESS");
        // you have your token, now log in your user :)
        //dispatch("USER_REQUEST");
        resolve(resp);
      })
      .catch(err => {
        commit("AUTH_ERROR", err);
        localStorage.removeItem("user-token"); // if the request fails, remove any possible user token if possible
        reject(err);
      });
  });
}
