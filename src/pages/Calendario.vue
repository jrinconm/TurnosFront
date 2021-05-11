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
      </q-toolbar>
    </div>
    <q-separator class="full-width" />
    <div class="row">
      <div class="sm col-sm-1 q-pa-sm q-mt-xl"></div>
      <div class="col-xs-12 col-sm-10 q-pa-sm q-mt-xl">
        <div class="text-center q-mx-xl q-mt-sm vistacalendario">
          <q-calendar
            ref="calendar"
            v-model="selectedDate"
            view="month"
            locale="es-es"
            animated
            :weekdays="[1, 2, 3, 4, 5, 6, 0]"
            :disabled-weekdays="[0, 6]"
            transition-prev="slide-right"
            transition-next="slide-left"
            long-weekday-label
            show-work-weeks
            @click:day2="onClickDay2"
            @click:workweek2="onClickWorkweek2"
          >
            <template #day="{ timestamp }">
              <template v-for="(event, index) in getEvents(timestamp.date)">
                <q-badge
                  :key="index"
                  style="width: 100%; cursor: pointer; height: 16px; max-height: 16px"
                  :class="badgeClasses(event, 'day')"
                  :style="badgeStyles(event, 'day')"
                >
                  <q-icon
                    v-if="event.icon"
                    :name="event.icon"
                    class="q-mr-xs"
                  ></q-icon
                  ><span class="ellipsis">{{ event.title }}</span>
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
//const CURRENT_DAY = new Date();

/*function getCurrentDay(day) {
  const newDay = new Date(CURRENT_DAY);
  newDay.setDate(day);
  const tm = QCalendar.parseDate(newDay);
  return tm.date;
} */
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
  name: "Calendario",
  data() {
    return {
      selectedDate: "",
      now: "",
      events: [],
      color: "",
      icono: "",
      usuario: ""
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
  mounted() {
    this.obtenconfig();
    this.obtendatos();
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
          console.log(error);
        });
    },
    obtendatos() {
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
          console.log(error);
        });
    },
    calendarPrev() {
      this.$refs.calendar.prev();
    },
    generaevento(consulta) {
      let evento = {
        title: consulta.Usuario.username,
        details: "Trabajo presencial en sede",
        date: consulta.dia,
        bgcolor: consulta.Usuario.color,
        icon: consulta.Usuario.icono
      };
      return evento;
    },
    onClickDay2(data) {
      // Por defecto añado el dia
      let aditar = true;
      // Recorro los eventos y miro si ya tengo marcado el dia
      for (let i = 0; i < this.events.length; ++i) {
        if (
          this.events[i].date == data.scope.timestamp.date &&
          this.events[i].title === this.username
        ) {
          // Obtenemos el idTarea de la tarea y la eliminamos
          console.log("eliminar dia");
          console.log(data);
          //Lo marcamos para no añadir
          aditar = false;
        }
      }
      // Si tenemos que aditar construyo el evento
      if (aditar) {
        let consulta = {
          dia: data.scope.timestamp.date,
          Usuario: {
            username: this.usuario,
            color: this.color,
            icon: this.icon
          }
        };
        let evento = this.generaevento(consulta);
        this.agregarDia(evento);
      }
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
        "right-side": !isHeader && event.side === "right"
      };
    },
    agregarDia: function(dia) {
      // Obtenemos del click los datos
      let body = { dia: dia.date, usuario: this.id };
      api
        .post("/api/diapresencial/", body, {
          headers: { "x-access-token": this.JWTToken }
        })
        .then(response => {
          this.data = response.data;
          this.obtendatos();
        })
        .catch(error => {
          console.log(error);
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
<style scoped>
.vistacalendario {
  background: black;
}
</style>
