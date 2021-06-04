const baseBarras = {
  chart: {
    type: "bar",
    toolbar: { tools: { download: true } }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      endingShape: "rounded"
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"]
  },
  yaxis: {
    title: {
      text: "Dias"
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter: function(val) {
        return val + " días";
      }
    }
  }
};
const configUsuarioDias = {
  ...baseBarras
};
const arrDiasSemana = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];
const configDiasUsuario = {
  ...baseBarras,
  xaxis: {
    categories: arrDiasSemana
  }
};
const objDiasSemana = [
  { name: "Lunes" },
  { name: "Martes" },
  { name: "Miercoles" },
  { name: "Jueves" },
  { name: "Viernes" }
];
export { configUsuarioDias, configDiasUsuario, objDiasSemana, arrDiasSemana };
