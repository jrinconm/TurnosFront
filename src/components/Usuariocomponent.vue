<!-- Aqui template, donde ira el HTML que Vue renderizara -->
<template>
  <div class="">
    <q-table
      title="Gestion de usuarios"
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
                  <q-input
                    v-model="editedItem.username"
                    label="Usuario"
                  ></q-input>
                </div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <q-input v-model="editedItem.email" label="Correo"></q-input>
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
          <q-td v-for="(column, key) in columnas" v-bind:key="key">
            <q-popup-edit
              v-if="column.name != 'id' && column.name != 'rol'"
              v-model="props.row[column.name]"
            >
              <q-input v-model="props.row[column.name]" dense autofocus counter>
                <template v-slot:append>
                  <q-icon name="edit" />
                </template>
              </q-input>
            </q-popup-edit>
            <q-popup-edit
              v-if="column.name === 'rol'"
              v-model="props.row[column.name]"
              :validate="compruebarol"
              @hide="compruebarol"
              buttons
              label-set="Aceptar"
              label-cancel="Cancelar"
            >
              <q-input
                v-model="props.row[column.name]"
                dense
                autofocus
                counter
                :error="errorRol"
                :error-message="errorMessageRol"
              >
                <template v-slot:append>
                  <q-icon name="edit" />
                </template>
              </q-input>
            </q-popup-edit>
            {{ props.row[column.name] }}
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn
              class="q-ma-xs"
              color="blue"
              label="Actualizar"
              @click="actualizar(props.row)"
              size="sm"
              no-caps
            ></q-btn>
            <q-btn
              class="q-ma-xs"
              color="red"
              label="Borrar"
              @click="deleteItem(props.row)"
              size="sm"
              no-caps
            ></q-btn>
            <q-btn
              class="q-ma-xs"
              color="green"
              label="Reset password"
              @click="resetpass(props.row)"
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
import { notifica } from "src/Includes/funciones";
export default {
  name: "gestorusuario",
  data() {
    return {
      data: [],
      show_dialog: false,
      editedIndex: -1,
      editedItem: {
        username: "",
        email: "",
        rol: "base",
        departamento: "administración"
      },
      defaultItem: {
        username: "",
        email: "",
        rol: "base"
      },
      errorRol: false,
      errorMessageRol: "",
      //visibleColumns: ["descripcion", "actions"],
      columns: [
        {
          name: "id",
          required: true,
          label: "ID",
          align: "left",
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "username",
          required: true,
          label: "Username",
          align: "left",
          field: row => row.username,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "nombre",
          required: true,
          label: "Nombre",
          align: "left",
          field: row => row.nombre,
          format: val => `${val}`,
          sortable: true
        },

        {
          name: "email",
          required: true,
          label: "Email",
          align: "left",
          field: row => row.email,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "rol",
          required: true,
          label: "Rol",
          align: "left",
          field: row => row.rol,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "departamento",
          required: true,
          label: "Departamento",
          align: "left",
          field: row => row.departamento,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "icono",
          required: true,
          label: "Icono",
          align: "left",
          field: row => row.icono,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "color",
          required: true,
          label: "Color",
          align: "left",
          field: row => row.color,
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
    }, // store the username in localstorage
    columnas: function() {
      let nuevascol = [...this.columns];
      nuevascol.pop();
      return nuevascol;
    }
  },
  mounted() {
    this.obtendatos();
  },
  methods: {
    compruebarol(val) {
      if (val != "base" && val != "admin" && val != "gestor") {
        this.errorRol = true;
        this.errorMessageRol = "Rol debe ser base, gestor o admin!";
        return false;
      }
      this.errorRol = false;
      this.errorMessageRol = "";
      return true;
    },
    obtendatos() {
      api
        .get("/api/user/", {
          headers: { "x-access-token": this.JWTToken }
        })
        .then(response => {
          this.data = response.data;
        })
        .catch(error => {
          notifica(vm, "negative", error);
        });
    },
    addRow() {
      if (this.editedIndex > -1) {
        Object.assign(this.data[this.editedIndex], this.editedItem);
      } else {
        let body = {
          //rol: this.editedItem.rol,
          username: this.editedItem.username,
          email: this.editedItem.email,
          departamento: this.editedItem.departamento
        };
        api
          .post("/api/user/", body, {
            headers: { "x-access-token": this.JWTToken }
          })
          .then(response => {
            notifica(vm, "positive", response.data.message);
            this.obtendatos();
          })
          .catch(error => {
            notifica(vm, "negative", error);
          });

        console.log(body);
        //this.data.push(this.editedItem);
      }
      this.close();
    },
    deleteItem(item) {
      const id = item.id;
      this.$q
        .dialog({
          title: "Confirmar borrado",
          message: "Seguro que quieres borrar esta linea?",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.borraDatoTabla(id);
        })
        .onCancel(() => {
          return false;
        });
    },
    borraDatoTabla(id) {
      api
        .delete("/api/user/id?id=" + id, {
          headers: { "x-access-token": this.JWTToken }
        })
        .then(response => {
          notifica(vm, "positive", response.data.message);
          this.obtendatos();
        })
        .catch(error => {
          notifica(vm, "negative", error);
        });
      this.obtendatos();
    },
    editItem(item) {
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.show_dialog = true;
    },
    resetpass(item) {
      let id = item.id;
      this.$q
        .dialog({
          title: "Reset contraseña",
          message: "Introduzca nueva contraseña",
          prompt: {
            model: "",
            isValid: val => val.length > 3, // << here is the magic
            type: "text" // optional
          },
          cancel: true,
          persistent: true
        })
        .onOk(data => {
          this.actualizacampo(id, { password: data });
        });
    },
    actualizacampo(id, campo) {
      api
        .put("/api/user/id?id=" + id, campo, {
          headers: { "x-access-token": this.JWTToken }
        })
        .then(response => {
          notifica(vm, "positive", response.data.message);
          this.obtendatos();
        })
        .catch(error => {
          notifica(vm, "negative", error);
        });
    },
    actualizar(item) {
      let body = { ...item };
      // Elimino lo que no necesito actualizar
      delete body.id;
      delete body.createdAt;
      delete body.updatedAt;
      api
        .put("/api/user/id?id=" + item.id, body, {
          headers: { "x-access-token": this.JWTToken }
        })
        .then(response => {
          notifica(vm, "positive", response.data.message);
          this.obtendatos();
        })
        .catch(error => {
          notifica(vm, "negative", error);
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
