<!-- TEMPLATE BEGIN -->
<template>
  <div class="home-page">
    <c-column v-for="column in columns" v-bind:key="column.id" :column="column" />
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import CColumn from '@/components/Column.vue';

import { Column } from '@/models/column';

@Component({
  components: {
    CColumn
  }
})
export default class HomePage extends Vue {
  // Properties //
  ///////////////

  public columns: Column[] = [];

  public async mounted() {
    this.columns = await this.$state.columnManager.fetchAll();
  }
}
</script>
<!-- SCRIPT END -->