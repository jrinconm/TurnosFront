<!-- Aqui template, donde ira el HTML que Vue renderizara -->
<template>
  <div class="q-pa-md">
    <q-table
      :title="tabla.nombre"
      :data="data"
      row-key="name"
      binary-state-sort
      :columns="columns"
    >
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
          <q-td key="descripcion" :props="props">
            <q-badge
              outline
              color="primary"
              :label="props.row.descripcion"
              class="q-ma-sm q-pa-sm"
            />
            <q-popup-edit v-model="props.row.descripcion">
              <q-input
                v-model="props.row.descripcion"
                dense
                autofocus
                counter
              />
            </q-popup-edit>
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn
              class="q-ma-sm"
              color="blue"
              label="Actualizar"
              @click="editItem(props.row)"
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
    </q-table>
  </div>
</template>
<!-- Aqui script, donde irá el Javascript (métodos, funciones, etc) -->
<script>
import { api } from "boot/axios";
export default {
  name: "editortablas",
  props: ["tabla"],
  data() {
    return {
      data: [],
      show_dialog: false,
      editedIndex: -1,
      editedItem: {
        name: ""
      },
      defaultItem: {
        name: ""
      },
      //visibleColumns: ["descripcion", "actions"],
      columns: [
        {
          name: "descripcion",
          required: true,
          label: "DESCRIPCIÓN",
          align: "left",
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "actions",
          label: "Acciones",
          field: "actions"
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
    } // store the username in localstorage
  },
  mounted() {
    this.obtendatos();
  },
  methods: {
    obtendatos() {
      api
        .get("/api/" + this.tabla.tabla + "/", {
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
