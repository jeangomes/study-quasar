<template>
    <q-page class="flex flex-center">
        <q-list hidden>
            <q-collapsible icon="explore" label="First B">
                <div>
                    Content
                </div>
            </q-collapsible>
            <q-collapsible icon="perm_identity" label="Second">
                <div>
                    Content
                </div>
            </q-collapsible>
            <q-collapsible v-bind:label="item.nome" v-for="item in tec" :key="item.id">
                <div>
                    {{ item.nome }}
                </div>
            </q-collapsible>
        </q-list>
        <img alt="Quasar logo" src="~assets/quasar-logo-full.svg">
        <q-btn
                color="primary"
                @click="loadData"
                label="Get Produtos"
        />

        <ul id="example-1">
            <li v-for="item in tec" :key="item.id">
                {{ item.nome }}
            </li>
        </ul>
    </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      drawerState: true,
      tec: []
    }
  },
  methods: {
    loadData () {
      this.$axios.get('/api/products')
        .then((response) => {
          this.tec = response.data
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Loading failed',
            icon: 'report_problem'
          })
        })
    }
  }
}
</script>
