<template>
  <div class='container w-100'>
    <Table :key="tableKey" :updateTable='forceRerender'/>
  </div>
</template>

<script>
import Table from '@/components/Table.vue'

export default {
  name: 'TableView',
  components: {
    Table
  },
  data() {
    return {
      tableKey: 0,
    };
  },
  methods: {
    forceRerender() {
      this.tableKey += 1;
    }
  }

}
</script>
