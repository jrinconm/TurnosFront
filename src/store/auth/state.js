export default function() {
  return {
    state: {
      token: localStorage.getItem("user-token"),
      status: "",
      rol: localStorage.getItem("rol") || ""
    }
  };
}
