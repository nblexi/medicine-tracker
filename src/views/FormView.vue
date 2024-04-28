<template>
  <div class='mx-auto w-50 container'>
    <List :key="listKey" :updateList='forceRerender'/>
    <Form :key="formKey" :updateForm='forceFormRerender' :updateList='forceRerender'/>
  </div>
</template>

<script>
import Form from '@/components/Form.vue'
import List from '@/components/List.vue'
import { ref } from "vue";

export default {
  name: 'FormView',
  components: {
    Form,
    List
  },
  data() {
    return {
      listKey: 0,
      formKey: 0
    };
  },
  methods: {
    forceFormRerender() {
      this.formKey += 1;
    },
    forceRerender() {
      this.listKey += 1;
    }
  }

}
</script>
