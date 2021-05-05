export default function() {
  return {
    state: {
      token: localStorage.getItem("user-token") || "",
      status: ""
    }
  };
}
