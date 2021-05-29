function notifica(vm, estado, mensaje) {
  vm.$q.notify({
    type: estado,
    position: "top",
    message: mensaje
  });
}
function alerta(vm, mensaje) {
  vm.$q.dialog({
    title: "Alert",
    message: mensaje
  });
}

export { notifica, alerta };
