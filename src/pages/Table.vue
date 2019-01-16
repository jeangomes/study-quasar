<template>
    <q-table
            ref="table"
            :data="serverData"
            :columns="columns"
            :filter="filter"
            row-key="name"
            :pagination.sync="serverPagination"
            :loading="loading"
            @request="request"
    >
        <q-tr slot="body" slot-scope="props" :props="props">
            <q-td key="customer_id" :props="props">{{ props.row.survey.customer.id_cliente }}</q-td>
            <q-td key="survey" :props="props">{{ props.row.id_vistoria }}</q-td>
            <q-td key="id_orcamento" :props="props">{{ props.row.id_orcamento }}</q-td>
            <q-td key="customer_name" :props="props">{{ props.row.survey.customer.razao_social }}</q-td>
            <q-td key="valor_total" :props="props">{{ props.row.valor_total | toCurrency }}</q-td>
            <q-td key="data_orcamento" :props="props">{{ props.row.data_orcamento | formatDate }}</q-td>
            <q-td key="image_url" :props="props">
                <q-btn-dropdown
                        color="primary"
                        label="Ações"
                >
                    <q-list link>
                        <q-item v-for="n in 2" :key="`1.${n}`"  @click.native="showNotification">
                            <q-item-side icon="folder" inverted color="primary" />
                            <q-item-main>
                                <q-item-tile label>{{ props.row.id_orcamento }}</q-item-tile>
                                <q-item-tile sublabel>February 22, 2016</q-item-tile>
                            </q-item-main>
                            <q-item-side right icon="info" color="amber" />
                        </q-item>
                        <q-item-separator inset />
                        <q-list-header inset>Files</q-list-header>
                        <q-item  @click.native="showNotification">
                            <q-item-side icon="assignment" inverted color="secondary" />
                            <q-item-main>
                                <q-item-tile label>Vacation</q-item-tile>
                                <q-item-tile sublabel>February 22, 2016</q-item-tile>
                            </q-item-main>
                            <q-item-side right icon="info" color="amber" />
                        </q-item>
                    </q-list>
                </q-btn-dropdown>
            </q-td>
        </q-tr>
        <template slot="top-right" slot-scope="props">
            <q-search hide-underline v-model="filter" />
        </template>
    </q-table>
</template>

<script>
export default {
  data () {
    return {
      filter: '',
      loading: false,
      serverPagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10 // specifying this determines pagination is server-side
      },

      serverData: [],
      columns: [
        {
          name: 'customer_id',
          required: true,
          label: 'C',
          align: 'left',
          field: row => row.survey.id_cliente,
          sortable: true
        },
        {
          name: 'survey',
          required: true,
          label: 'V',
          align: 'left',
          field: 'id_vistoria',
          sortable: true
        },
        {
          name: 'id_orcamento',
          required: true,
          label: 'O',
          align: 'left',
          field: 'id_orcamento',
          sortable: true
        },
        {
          name: 'customer_name',
          required: true,
          label: 'Nome',
          align: 'left',
          field: row => row.survey.customer.razao_social,
          sortable: true
        },
        {
          name: 'valor_total',
          required: true,
          label: 'V. Total',
          align: 'left',
          field: 'valor_total',
          sortable: true
        },
        {
          name: 'data_orcamento',
          required: true,
          label: 'Data',
          align: 'left',
          field: 'data_orcamento',
          sortable: true
        },
        {
          name: 'image_url',
          required: true,
          label: 'Nome',
          align: 'left',
          field: row => row.survey.customer.razao_social,
          sortable: true
        }
      ]
    }
  },
  methods: {
    request ({ pagination, filter }) {
      // we set QTable to "loading" state
      this.loading = true
      // we do the server data fetch, based on pagination and filter receive
      // (using Axios here, but can be anything; parameters vary based on backend implementation)
      // .get(`/data/${pagination.page}?sortBy=${pagination.sortBy}&descending=${pagination.descending}&filter=${filter}`)
      console.log(pagination.sortBy, filter)
      if (pagination.sortBy === null) {
        pagination.sortBy = 'id_orcamento'
      }
      this.$axios.get(`/api/payments/?page=${pagination.page}&sort=${pagination.descending ? '-' : ''}${pagination.sortBy}&filter=${filter}`)
        .then(({ data }) => {
          // updating pagination to reflect in the UI
          this.serverPagination = pagination
          // console.log(data.data)
          // we also set (or update) rowsNumber
          this.serverPagination.rowsPerPage = data.per_page
          this.serverPagination.rowsNumber = data.total
          // then we update the rows with the fetched ones
          this.serverData = data.data

          // finally we tell QTable to exit the "loading" state
          this.loading = false
        })
        .catch(error => {
          // there's an error... do SOMETHING
          console.log(error)
          // we tell QTable to exit the "loading" state
          this.loading = false
        })
    }
  },
  mounted () {
    // once mounted, we need to trigger the initial server data fetch
    this.request({
      pagination: this.serverPagination,
      filter: this.filter
    })
  }
}
</script>
