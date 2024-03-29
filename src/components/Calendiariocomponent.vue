<!-- Aqui template, donde ira el HTML que Vue renderizara -->
<template>
  <div class="text-center q-mt-xl q-mr-sm">
    <div class="row justify-center items-center">
      <q-toolbar class="text-primary row justify-between items-center q-ml-xl">
        <q-btn-group flat class="col-3">
          <q-btn dense flat label="Prev" @click="calendarPrev" />
          <q-separator vertical />
          <q-btn dense flat label="Next" @click="calendarNext" />
        </q-btn-group>
        <div class="col-4" style="text-align: center;">
          {{ title }}
        </div>
        <div v-show="imprimir">
          <q-btn
            v-if="imprimir"
            padding="xs"
            class="q-mr-xl"
            align="between"
            size="xs"
            dark-percentage
            color="white"
            text-color="grey-9"
            @click="$emit('downloadPdf')"
          >
            <q-icon
              v-if="imprimir"
              name="print"
              class="text-teal"
              style="font-size: 4.4em;"
            />
          </q-btn>
        </div>
      </q-toolbar>
    </div>
    <q-separator class="full-width" />
    <div class="row">
      <div class="sm col-sm-1 q-pa-sm q-mt-xl"></div>
      <div class="col-xs-12 col-sm-12 q-pa-sm q-mt-xl">
        <div class="text-center q-mx-xl q-mt-sm vistacalendario">
          <q-calendar
            ref="calendar"
            v-model="selectedDate"
            view="month"
            locale="es-es"
            animated
            :day-height="0"
            :weekdays="[1, 2, 3, 4, 5]"
            :disabled-weekdays="[0, 6]"
            transition-prev="slide-right"
            transition-next="slide-left"
            long-weekday-label
            show-work-weeks
            @click:day2="onClickDay2"
            @click:workweek2="onClickWorkweek2"
            @change="onChange"
          >
            <template #day="{ timestamp }">
              <template v-for="(event, index) in getEvents(timestamp.date)">
                <q-badge
                  :key="index"
                  align="middle"
                  style="width: 100%; cursor: pointer; height:24px"
                  :class="badgeClasses(event, 'day')"
                  :style="badgeStyles(event, 'day')"
                >
                  <q-icon
                    v-if="event.icon"
                    :name="event.icon"
                    class="q-mr-xs"
                  ></q-icon>
                  {{ event.title }}
                </q-badge>
              </template>
            </template>
          </q-calendar>
        </div>
      </div>
    </div>
  </div>
</template>
<!-- Aqui script, donde irá el Javascript (métodos, funciones, etc) -->
<script>
import QCalendar from "@quasar/quasar-ui-qcalendar"; // ui is aliased from '@quasar/quasar-ui-qcalendar'
import { api } from "boot/axios";
import { notifica, alerta } from "src/Includes/funciones";
const reRGBA = /^\s*rgb(a)?\s*\((\s*(\d+)\s*,\s*?){2}(\d+)\s*,?\s*([01]?\.?\d*?)?\s*\)\s*$/;

function removeItemFromArr(arr, item) {
  let i = arr
    .map(function(e) {
      return e.date;
    })
    .indexOf(item.date);
  if (i !== -1) {
    arr.splice(i, 1);
    return true;
  } else {
    return false;
  }
}
function textToRgb(color) {
  if (typeof color !== "string") {
    throw new TypeError("Expected a string");
  }

  const m = reRGBA.exec(color);
  if (m) {
    const rgb = {
      r: Math.min(255, parseInt(m[2], 10)),
      g: Math.min(255, parseInt(m[3], 10)),
      b: Math.min(255, parseInt(m[4], 10))
    };
    if (m[1]) {
      rgb.a = Math.min(1, parseFloat(m[5]));
    }
    return rgb;
  }
  return hexToRgb(color);
}

function hexToRgb(hex) {
  if (typeof hex !== "string") {
    throw new TypeError("Expected a string");
  }

  hex = hex.replace(/^#/, "");

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  } else if (hex.length === 4) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }

  const num = parseInt(hex, 16);

  return hex.length > 6
    ? {
        r: (num >> 24) & 255,
        g: (num >> 16) & 255,
        b: (num >> 8) & 255,
        a: Math.round((num & 255) / 2.55)
      }
    : { r: num >> 16, g: (num >> 8) & 255, b: num & 255 };
}

function luminosity(color) {
  if (typeof color !== "string" && (!color || color.r === undefined)) {
    throw new TypeError("Expected a string or a {r, g, b} object as color");
  }

  const rgb = typeof color === "string" ? textToRgb(color) : color,
    r = rgb.r / 255,
    g = rgb.g / 255,
    b = rgb.b / 255,
    R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4),
    G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4),
    B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export default {
  name: "calendario-component",
  data() {
    return {
      selectedDate: "",
      usuariosDep: [],
      now: "",
      events: [],
      color: "",
      icono: "",
      usuario: "",
      mostrarimprimir: "",
      title: "",
      start: undefined
    };
  },
  props: ["imprimir"],
  computed: {
    JWTToken: function() {
      return localStorage.getItem("user-token");
    }, // store the token in localstorage
    id: function() {
      return localStorage.getItem("id");
    }, // store the id in localstorage
    username: function() {
      return localStorage.getItem("username");
    }, // store the username in localstorage
    rol: function() {
      return localStorage.getItem("rol");
    }, // store the username in localstorage
    departamento: function() {
      return localStorage.getItem("departamento");
    } // store the username in localstorage
  },
  mounted() {
    //Carga inicial de datos
    this.obtenconfig();
    this.obtendatos();
    this.obtenUsuariosArea();
  },
  beforeMount() {
    // set "now" a hoy
    this.selectedDate = QCalendar.today();
    const now = QCalendar.parseTimestamp(this.selectedDate);
    this.now = QCalendar.getDate(now);
  },
  methods: {
    calendarNext() {
      this.$refs.calendar.next();
    },
    obtenconfig() {
      let vm = this;
      // Obtengo la configuracion del usuario
      api
        .get("/api/user/id?id=" + this.id, {
          headers: { "x-access-token": this.JWTToken }
        })
        .then(response => {
          this.data = response.data;
          // Cambio color e icono de la configuracion
          this.data.color
            ? (this.color = this.data.color)
            : (this.color = "#0026ff");
          this.data.icono
            ? (this.icono = this.data.icono)
            : (this.icono = "work");
        })
        .catch(error => {
          notifica(vm, "negative", error.response.data.message);
          this.$store.dispatch("auth/AUTH_LOGOUT").then(() => {
            this.$router.push("/login");
          });
        });
    },
    onChange({ start }) {
      const date = new Date(start.date); // 2009-11-10
      this.title = date
        .toLocaleString("default", {
          month: "long"
        })
        .toUpperCase();
      //this.title = start;
    },
    obtendatos() {
      let vm = this;
      api
        // Obtengo todos los días del mismo departamento que del usuario
        .get("/api/diapresencial/usuariodep?id=" + this.id, {
          headers: { "x-access-token": this.JWTToken }
        })
        .then(response => {
          this.data = response.data;
          this.events.splice(0);
          this.data.forEach(element => {
            // ES2020 Operador, babel ya se encargará de transpilarlo
            element.Usuario.color ??= "#0026ff";
            element.Usuario.icono ??= "work";
            this.events.push(this.generaevento(element));
          });
        })
        .catch(error => {
          notifica(vm, "negative", error.response.data.message);
        });
    },
    calendarPrev() {
      this.$refs.calendar.prev();
    },
    generaevento(consulta) {
      let evento = {
        id: consulta.id,
        title: consulta.Usuario.username,
        details: "Trabajo presencial en sede",
        date: consulta.dia,
        bgcolor: consulta.Usuario.color,
        icon: consulta.Usuario.icono,
        estado: consulta.estado
      };
      return evento;
    },
    addEvento(fecha) {
      // Datos para los eventos
      let consulta = {
        dia: fecha,
        Usuario: {
          username: this.username,
          color: this.color,
          icon: this.icono
        }
      };
      let evento = this.generaevento(consulta);
      this.agregarDia(evento);
    },
    clickRolBase(data) {
      let vm = this;
      let fecha = data.scope.timestamp.date;
      if (fecha < QCalendar.today()) {
        alerta(vm, "No puedes cambiar el pasado, mejora el futuro");
      } else {
        // Por defecto añado el dia
        let aditar = true;
        // Recorro los eventos y miro si ya tengo marcado el dia
        for (let i = 0; i < this.events.length; ++i) {
          if (
            this.events[i].date == fecha &&
            this.events[i].title === this.username
          ) {
            if (this.events[i].estado === "Confirmado" && this.rol === "base") {
              alerta(vm, "Dia ya confirmado, no se puede modificar");
            } else {
              this.consultarModificarDia(this.events[i].id);
            }
            //Lo marcamos para no añadir
            aditar = false;
          }
        }
        // Si tenemos que aditar construyo el evento
        if (aditar) {
          this.addEvento(fecha);
        }
      }
    },
    asignarEventoGestor(fecha) {
      let vm = this;
      let dia = { date: fecha };

      let usadosconId = this.obtenUsuariosFecha(fecha);
      let usados = [];
      usadosconId.forEach(item => {
        usados.push(item[0][0]);
      });
      let items = [];
      this.usuariosDep.forEach(usuario => {
        if (!usados.includes(usuario.username)) {
          items.push({ label: usuario.username, value: usuario.id });
        }
      });
      if (items.length <= 0) {
        alerta(vm, "No quedan colaboradores por asignar");
      } else {
        this.$q
          .dialog({
            title: "Asignación de días",
            options: {
              type: "checkbox",
              model: [],
              items: items
            },
            cancel: true,
            persistent: true
          })
          .onOk(eleccion => {
            eleccion.forEach(usuario => {
              this.agregarDia(dia, usuario);
            });
          });
      }
    },
    eliminarEventoGestor(fecha) {
      let vm = this;
      let usadosconId = this.obtenUsuariosFecha(fecha);
      let items = [];
      usadosconId.forEach(usuario => {
        items.push({ label: usuario[0][0], value: usuario[1][0] });
      });
      if (items.length <= 0) {
        alerta(vm, "No hay colaboradores asignados");
      } else {
        this.$q
          .dialog({
            title: "Eliminación de días",
            options: {
              type: "checkbox",
              model: [],
              items: items
            },
            cancel: true,
            persistent: true
          })
          .onOk(eleccion => {
            eleccion.forEach(dia => {
              this.eliminarDia(dia);
            });
          });
      }
    },
    obtenUsuariosArea() {
      let vm = this;
      api
        // Obtengo todos los días del mismo departamento que del usuario
        .get("/api/user/dep?departamento=" + this.departamento, {
          headers: { "x-access-token": this.JWTToken }
        })
        .then(response => {
          this.usuariosDep = response.data;
        })
        .catch(error => {
          notifica(vm, "negative", error.response.data.message);
        });
    },
    obtenUsuariosFecha(dia) {
      let usuario = [];
      this.events.forEach(evento => {
        if (evento.date == dia) {
          usuario.push([[evento.title], [evento.id]]);
        }
      });
      return usuario;
    },
    eleccionesGestor(fecha, eleccion) {
      switch (eleccion) {
        case "Marcar":
          this.addEvento(fecha);
          break;
        case "Asignar":
          this.asignarEventoGestor(fecha);
          break;
        case "Eliminar":
          this.eliminarEventoGestor(fecha);
          break;
        default:
          break;
      }
    },
    clickRolGestor(data) {
      let vm = this;
      let fecha = data.scope.timestamp.date;
      let items = [
        {
          label: "Marcar día presencial propio",
          value: "Marcar",
          color: "positive"
        },
        {
          label: "Asignar día",
          value: "Asignar",
          color: "secondary"
        },
        {
          label: "Eliminar dia",
          value: "Eliminar",
          color: "negative"
        }
      ];

      this.$q
        .dialog({
          title: "Gestión día",
          options: {
            type: "radio",
            model: "optGestor",
            items: items
          },
          cancel: true,
          persistent: true
        })
        .onOk(eleccion => {
          this.eleccionesGestor(fecha, eleccion);
        });
    },
    onClickDay2(data) {
      let vm = this;
      // Si es un dia en el pasado no dejo aditar
      if (this.rol === "base") {
        this.clickRolBase(data);
      } else {
        this.clickRolGestor(data);
      }
    },
    consultarModificarDia(id) {
      let items = [
        {
          label: "Confimar día presencial",
          value: "Confirmado",
          color: "positive"
        },
        {
          label: "Solicitar cambio",
          value: "CambioPedido",
          color: "secondary"
        },
        {
          label: "Eliminar día presencial",
          color: "negative",
          value: false
        }
      ];
      this.$q
        .dialog({
          title: "Modificar dia",
          options: {
            type: "radio",
            model: "opt1",
            // inline: true
            items: items
          },
          cancel: true,
          persistent: true
        })
        .onOk(data => {
          if (data) {
            this.cambiarEstadoDia(id, data);
          } else {
            this.eliminarDia(id);
          }
        });
    },
    cambiarEstadoDia(id, estado) {
      let vm = this;
      let campo = {
        estado: estado
      };
      api
        .put("/api/diapresencial/id?id=" + id, campo, {
          headers: { "x-access-token": this.JWTToken }
        })
        .then(response => {
          notifica(vm, "positive", response.data.message);
          this.obtendatos();
        })
        .catch(error => {
          notifica(vm, "negative", error.response.data.message);
        });
    },
    eliminarDia(id) {
      let vm = this;
      api
        .delete("/api/diapresencial/id?id=" + id, {
          headers: { "x-access-token": this.JWTToken }
        })
        .then(response => {
          notifica(vm, "positive", response.data.message);
          this.obtendatos();
        })
        .catch(error => {
          notifica(vm, "negative", error.response.data.message);
        });
    },
    onClickWorkweek2(data) {},
    isCssColor(color) {
      return !!color && !!color.match(/^(#|(rgb|hsl)a?\()/);
    },
    badgeClasses(event, type) {
      const cssColor = this.isCssColor(event.bgcolor);
      const isHeader = type === "header";
      return {
        [`text-white bg-${event.bgcolor}`]: !cssColor,
        "full-width": !isHeader && (!event.side || event.side === "full"),
        "left-side": !isHeader && event.side === "left",
        "right-side": !isHeader && event.side === "right",
        provisional: !isHeader && event.estado === "Provisional",
        cambiando: !isHeader && event.estado === "CambioPedido",
        confirmado: !isHeader && event.estado === "Confirmado"
      };
    },
    agregarDia(dia, usuario = this.id) {
      let vm = this;
      // Obtenemos del click los datos
      let body = { dia: dia.date, usuario: usuario };
      api
        .post("/api/diapresencial/", body, {
          headers: { "x-access-token": this.JWTToken }
        })
        .then(response => {
          notifica(vm, "positive", response.data.message);
          this.obtendatos();
        })
        .catch(error => {
          notifica(vm, "negative", error.response.data.message);
        });
    },
    badgeStyles(event, type, timeStartPos, timeDurationHeight) {
      const s = {};
      if (this.isCssColor(event.bgcolor)) {
        s["background-color"] = event.bgcolor;
        s.color = luminosity(event.bgcolor) > 0.5 ? "black" : "white";
      }
      if (timeStartPos) {
        s.top = timeStartPos(event.time) + "px";
      }
      if (timeDurationHeight) {
        s.height = timeDurationHeight(event.duration) + "px";
      }
      s["align-items"] = "flex-start";
      return s;
    },
    //Recorre cada dia del calendario para pintar los eventos
    getEvents(dt) {
      const currentDate = QCalendar.parseTimestamp(dt);
      const events = [];
      for (let i = 0; i < this.events.length; ++i) {
        let added = false;
        if (this.events[i].date === dt) {
          if (this.events[i].date) {
            if (events.length > 0) {
              // check for overlapping times
              const startTime = QCalendar.parseTimestamp(
                this.events[i].date + " " + this.events[i].time
              );
              const endTime = QCalendar.addToDate(startTime, {
                minute: this.events[i].duration
              });
              for (let j = 0; j < events.length; ++j) {
                if (events[j].time) {
                  const startTime2 = QCalendar.parseTimestamp(
                    events[j].date + " " + events[j].time
                  );
                  const endTime2 = QCalendar.addToDate(startTime2, {
                    minute: events[j].duration
                  });
                  if (
                    QCalendar.isBetweenDates(startTime, startTime2, endTime2) ||
                    QCalendar.isBetweenDates(endTime, startTime2, endTime2)
                  ) {
                    events[j].side = "left";
                    this.events[i].side = "right";
                    events.push(this.events[i]);
                    added = true;
                    break;
                  }
                }
              }
            }
          }
          if (!added) {
            this.events[i].side = undefined;
            events.push(this.events[i]);
          }
        } else if (this.events[i].days) {
          // check for overlapping dates
          const startDate = QCalendar.parseTimestamp(this.events[i].dia.date);
          const endDate = QCalendar.addToDate(startDate, {
            day: this.events[i].dia.days
          });
          if (QCalendar.isBetweenDates(currentDate, startDate, endDate)) {
            events.push(this.events[i].dia);
          }
        }
      }
      return events;
    }
  }
};
</script>
<style lang="scss" scoped>
.vistacalendario {
  background: black;
}
.q-badge {
  margin-top: 0.3rem;
  margin: 0.2rem;
  font-size: 1rem;
}
.provisional {
  border: red 2px solid;
  animation: blink 1s infinite;
}
.confirmado {
  border: black 2px solid;
}
.cambiando {
  border: blue 2px solid;
  animation: blink 1s infinite;
}

@keyframes blink {
  50% {
    border-color: #fff;
  }
}
</style>
