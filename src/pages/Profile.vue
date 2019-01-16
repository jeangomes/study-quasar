<template>
  <q-page padding>
    <!-- content -->
    A bolinha é azul
    <q-datetime v-model="myDate" format="DD/MM/YYYY" type="date" />
    Data acima
    <q-field
            icon="cloud"
            label="Your Gmail"
            helper="Helper"
            :error="mailHasError"
            error-label="We need a valid email"
            :count="10"
    >
      <q-input suffix="@gmail.com" type="number" v-model="name" />
    </q-field>
  </q-page>
</template>

<script>
export default {
  data: function () {
    return {
      myDate: '',
      name: 'Juxa',
      mailHasError: false
    }
  }
}
</script>

<style>
</style>
