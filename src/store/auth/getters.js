/*
export function someGetter (state) {
}
*/

export function isAuthenticated(state) {
  return !!state.token;
}

export function authStatus(state) {
  return state.status;
}
export function isAdmin(admin) {
  return !!admin.rol;
}
