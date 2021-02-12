<template>
  <a-form-model :model="form">
    <a-form-model-item label="Activity name">
      <a-input v-model="form.name" />
    </a-form-model-item>
  </a-form-model>
</template>

<script>
export default {
  name: 'bbq-form',
  data() {
    return {
      form: {
        name: ""
      }
    }
  },
  props: {
    
  },
  methods: {
  
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>