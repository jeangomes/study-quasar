<template>
    <q-modal v-model="opened" :content-css="{minWidth: '80vw', minHeight: '80vh'}" @hide="handleChange">
        <q-modal-layout>
            <q-toolbar slot="header">
                <q-btn
                        flat
                        round
                        dense
                        v-close-overlay
                        icon="keyboard_arrow_left"
                />
                <q-toolbar-title>
                    Header
                </q-toolbar-title>
            </q-toolbar>

            <q-toolbar slot="header">
                Opa lele
            </q-toolbar>

            <q-toolbar slot="footer">
                <q-toolbar-title>
                    Footer
                </q-toolbar-title>
            </q-toolbar>

            <div class="layout-padding">
                <h1>Modal</h1>
                <q-btn
                        color="primary"
                        v-close-overlay
                        label="Close"
                />

                <p>This is a Modal presenting a Layout.</p>
            </div>
        </q-modal-layout>
    </q-modal>
</template>

<script>
import { QModal } from 'quasar'

export default {
  props: ['myOpen', 'id'],
  data: function () {
    return {
      opened: this.myOpen
    }
  },
  methods: {
    handleChange (newVal) {
      this.opened = false
      this.$emit('up', this.opened)
    }
  },
  components: {
    QModal
  }
}
</script>
