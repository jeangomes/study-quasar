<template>
    <div>
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
            <template slot="body" slot-scope="props">
            <q-tr :props="props">
                <q-td key="customer_id" :props="props">{{ props.row.customer_id }}</q-td>
                <q-td key="survey" :props="props">{{ props.row.survey_id }}</q-td>
                <q-td key="payment_id" :props="props">{{ props.row.payment_id }}</q-td>
                <q-td key="more" :props="props">
                    <q-checkbox color="primary" v-model="props.row.expand" checked-icon="remove" unchecked-icon="add" class="q-mr-md" />
                </q-td>
                <q-td key="customer_name" :props="props">{{ props.row.customer_name }}</q-td>
                <q-td key="amount" :props="props">{{ props.row.amount | toCurrency }}</q-td>
                <q-td key="created_at" :props="props">{{ props.row.created_at }}</q-td>
                <q-td key="image_url" :props="props">
                    <q-btn-dropdown
                            color="primary"
                            label="Ações"
                    >
                        <q-list link separator>
                            <q-item @click.native="showNotification">
                                <q-item-side icon="folder" inverted color="primary"/>
                                <q-item-main>
                                    <q-item-tile label>Orçamento</q-item-tile>
                                    <q-item-tile sublabel>{{ props.row.payment_id }}</q-item-tile>
                                </q-item-main>
                            </q-item>
                            <q-item>
                                <q-item-side icon="folder" inverted color="primary"/>
                                <q-item-main>
                                    <q-item-tile label>Ficha Cliente</q-item-tile>
                                    <q-item-tile sublabel>{{ props.row.customer_name }}</q-item-tile>
                                </q-item-main>
                            </q-item>
                            <q-item>
                                <q-item-side icon="assignment" inverted color="secondary"/>
                                <q-item-main>
                                    <q-item-tile label>Vacation</q-item-tile>
                                    <q-item-tile sublabel>February 22, 2016</q-item-tile>
                                </q-item-main>
                                <q-item-side right icon="info" color="amber"/>
                            </q-item>
                            <q-item
                                    :key=" props.row.payment_id"
                                    @click.native="modalOpen = true"
                                    v-ripple.mat
                            >
                                <q-item-side icon="open_in_new"/>
                                <q-item-main label="Upload"/>
                            </q-item>
                        </q-list>
                    </q-btn-dropdown>
                </q-td>
            </q-tr>
            <q-tr v-show="props.row.expand" :props="props">
                <q-td colspan="100%">
                    <div class="text-left">This is expand slot for row above: {{ props.row.boleto_file }}.</div>
                </q-td>
            </q-tr>
            </template>
            <template slot="top-right" slot-scope="props">
                <q-search hide-underline v-model="filter"/>
            </template>
        </q-table>
        <my-modal v-if="modalOpen" :myOpen="modalOpen" @up="ball" />
    </div>
</template>

<script>
import MyModal from 'components/MyModal'
export default {
  data () {
    return {
      modalOpen: false,
      filter: '',
      loading: false,
      serverPagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10 //  specifying this determines pagination is server-side
      },

      serverData: [],
      columns: [
        {
          name: 'customer_id',
          required: true,
          label: 'C',
          align: 'left',
          field: row => row.customer_id,
          sortable: true
        },
        {
          name: 'survey',
          required: true,
          label: 'V',
          align: 'left',
          field: 'survey_id',
          sortable: true
        },
        {
          name: 'payment_id',
          required: true,
          label: 'O',
          align: 'left',
          field: 'payment_id',
          sortable: true
        },
        {
          name: 'more',
          required: true,
          label: 'Mais',
          align: 'left',
          field: 'payment_id',
          sortable: false
        },
        {
          name: 'customer_name',
          required: true,
          label: 'Nome',
          align: 'left',
          field: row => row.customer_name,
          sortable: true
        },
        {
          name: 'amount',
          required: true,
          label: 'V. Total',
          align: 'left',
          field: 'amount',
          sortable: true
        },
        {
          name: 'created_at',
          required: true,
          label: 'Data',
          align: 'left',
          field: 'created_at',
          sortable: true
        },
        {
          name: 'image_url',
          required: true,
          label: 'Nome',
          align: 'left',
          field: row => row.customer_name,
          sortable: true
        }
      ]
    }
  },
  methods: {
    ball (value) {
      this.modalOpen = value
    },
    request ({pagination, filter}) {
      // we set QTable to "loading" state
      this.loading = true
      // we do the server data fetch, based on pagination and filter receive
      // (using Axios here, but can be anything; parameters vary based on backend implementation)
      // .get(`/data/${pagination.page}?sortBy=${pagination.sortBy}&descending=${pagination.descending}&filter=${filter}`)
      // console.log(pagination.sortBy, filter)
      if (pagination.sortBy === null) {
        pagination.sortBy = '-created_at'
      }
      this.$axios.get(`/api/payments/?page=${pagination.page}&sort=${pagination.descending ? '-' : ''}${pagination.sortBy}&filter=${filter}`)
        .then(({data}) => {
          // updating pagination to reflect in the UI
          this.serverPagination = pagination
          // console.log(data.data)
          // we also set (or update) rowsNumber
          this.serverPagination.rowsPerPage = data.meta.per_page
          this.serverPagination.rowsNumber = data.meta.total
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
  },
  components: { MyModal }
}
</script>
