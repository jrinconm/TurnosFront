<template>
  <div class="q-pa-md">
    <q-table
      title="Editor de departamentos"
      :data="data"
      :columns="columns"
      row-key="name"
      binary-state-sort
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
          <q-td key="desc" :props="props">
            {{ props.row.name }}
            <q-popup-edit v-model="props.row.name">
              <q-input v-model="props.row.name" dense autofocus counter />
            </q-popup-edit>
          </q-td>
          <q-td key="calories" :props="props">
            {{ props.row.calories }}
            <q-popup-edit
              v-model="props.row.calories"
              title="Update calories"
              buttons
            >
              <q-input
                type="number"
                v-model="props.row.calories"
                dense
                autofocus
              />
            </q-popup-edit>
          </q-td>
          <q-td key="fat" :props="props">
            <div class="text-pre-wrap">{{ props.row.fat }}</div>
            <q-popup-edit v-model="props.row.fat">
              <q-input
                type="textarea"
                v-model="props.row.fat"
                dense
                autofocus
              />
            </q-popup-edit>
          </q-td>
          <q-td key="carbs" :props="props">
            {{ props.row.carbs }}
            <q-popup-edit
              v-model="props.row.carbs"
              title="Update carbs"
              buttons
              persistent
            >
              <q-input
                type="number"
                v-model="props.row.carbs"
                dense
                autofocus
                hint="Use buttons to close"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="protein" :props="props">{{ props.row.protein }}</q-td>
          <q-td key="sodium" :props="props">{{ props.row.sodium }}</q-td>
          <q-td key="calcium" :props="props">{{ props.row.calcium }}</q-td>
          <q-td key="iron" :props="props">{{ props.row.iron }}</q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show_dialog: false,
      editedItem: {
        username: "",
        email: "",
        rol: "base",
        departamento: "administración"
      },
      columns: [
        {
          name: "Departamento",
          required: true,
          label: "Departamento",
          align: "left",
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        }
      ],
      data: []
    };
  },
  methods: {
    addRow() {}
  }
};
</script>
