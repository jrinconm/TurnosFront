<!-- Aqui template, donde ira el HTML que Vue renderizara -->
<template>
  <div>
    <q-table
      title="Gestión de días"
      :data="data"
      row-key="id"
      binary-state-sort
      :columns="columns"
      style="height: 85vh"
      virtual-scroll
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
    >
    </q-table>
  </div>
</template>
<!-- Aqui script, donde irá el Javascript (métodos, funciones, etc) -->
<script>
/*
      <template v-slot:top-right>
        <q-btn
          align="right"
          dense
          color="secondary"
          label="Añadir un item"
          @click="show_dialog = true"
          no-caps
        ></q-btn>
        <div class="q-pa-sm q-gutter-sm">
          <q-dialog v-model="show_dialog">
            <q-card>
              <q-card-section>
                <div class="text-h6">Añadir un item</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <q-input v-model="editedItem.name" label="Nombre"></q-input>
                </div>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn
                  flat
                  label="OK"
                  color="primary"
                  v-close-popup
                  @click="addRow"
                ></q-btn>
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="(column, key) in columnasvisibles" v-bind:key="key">
            <q-popup-edit
              v-if="
                column.name !== 'id' &&
                  column.name !== 'dia' &&
                  column.name !== 'usuario'
              "
              v-model="props.row[column.name]"
            >
              <q-input v-model="props.row[column.name]" dense autofocus counter>
                <template v-slot:append>
                  <q-icon name="edit" />
                </template>
              </q-input>
            </q-popup-edit>
            {{ props.row[column.name] }}
            {{ key }}
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn
              class="q-ma-sm"
              color="blue"
              label="Actualizar"
              @click="actualizar(props.row)"
              size="sm"
              no-caps
            ></q-btn>
            <q-btn
              color="red"
              label="Borrar"
              @click="deleteItem(props.row)"
              size="sm"
              no-caps
            ></q-btn>
          </q-td>
        </q-tr>
      </template>
*/

import { api } from "boot/axios";
export default {
  name: "editortablas",
  data() {
    return {
      data: [],
      tabla: "DiaPresencial",
      show_dialog: false,
      editedIndex: -1,
      editedItem: {
        name: ""
      },
      defaultItem: {
        name: ""
      },
      pagination: {
        rowsPerPage: 0
      },
      //visibleColumns: ["descripcion", "actions"],
      columns: [
        {
          name: "id",
          required: true,
          label: "ID",
          align: "left",
          field: row => row.id,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "dia",
          required: true,
          label: "Dia",
          align: "left",
          field: row => row.dia,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "estado",
          required: true,
          label: "Estado",
          align: "left",
          field: row => row.estado,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "usuario",
          required: true,
          label: "Usuario",
          align: "left",
          sortable: true,
          field: row => row.Usuario.username,
          format: val => `${val}`
        }
      ]
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
    }, // store the username in localstorage
    columnasvisibles: function() {
      let ver = this.columns.filter(function(columna) {
        return columna.name != "usuario";
      });
      console.log(ver);
      return ver;
    },
    nombres: function() {
      //Obtengo los nombres de las tablas
      let vm = this;
      let nombres = [];
      this.data.forEach(element => {
        console.log(element.UsuarioId + " ->" + element.Usuario.username);
        vm.$set(nombres, element.UsuarioId, element.Usuario.username);
      });
      return nombres;
    }
  },
  mounted() {
    this.obtendatos();
  },
  methods: {
    obtendatos() {
      api
        .get("/api/" + this.tabla + "/", {
          headers: { "x-access-token": this.JWTToken }
        })
        .then(response => {
          this.data = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    addRow() {
      if (this.editedIndex > -1) {
        Object.assign(this.data[this.editedIndex], this.editedItem);
      } else {
        this.data.push(this.editedItem);
      }
      this.close();
    },
    deleteItem(item) {
      const id = item.id;
      confirm("Are you sure you want to delete this item?") &&
        this.borraDatoTabla(id);
    },
    borraDatoTabla(id) {
      api
        .delete("/api/" + this.tabla.tabla + "/id?id=" + id, {
          headers: { "x-access-token": this.JWTToken }
        })
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.log(error);
        });
      this.obtendatos();
    },
    editItem(item) {
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.show_dialog = true;
    },
    actualizar(item) {
      let body = { descripcion: item.descripcion };
      api
        .put("/api/" + this.tabla.tabla + "/id?id=" + item.id, body, {
          headers: { "x-access-token": this.JWTToken }
        })
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    close() {
      this.show_dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    }
  }
};
</script>
