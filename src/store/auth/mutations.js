/*
export function someMutation (state) {
}
*/
export const AUTH_REQUEST = state => {
  state.status = "loading";
};
export const AUTH_SUCCESS = state => {
  state.status = "success";
};
export const AUTH_ERROR = state => {
  state.status = "error";
};
