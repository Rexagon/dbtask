<!-- TEMPLATE BEGIN -->
<template>
  <div class="home-page">
    <c-column v-for="column in columns" v-bind:key="column.id" :column="column" />
    <c-column-form />
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';

import CColumn from '@/components/Column.vue';
import CColumnForm from '@/components/ColumnForm.vue';

import { Column } from '@/models/column';
import state from '@/models/state';

@Component({
  components: {
    CColumn,
    CColumnForm
  }
})
export default class HomePage extends Vue {
  // Properties //
  ///////////////

  public columns: Column[] = [];

  // Component methods //
  //////////////////////

  public async mounted() {
    this.columns = state.columnManager.columns;

    this.$bus.$on('columns-changed', (columns: Column[]) => {
      this.columns = columns;
    });

    state.columnManager.fetchAll();
    state.taskManager.fetchAll();
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.home-page {
  height: 100%;

  user-select: none;
  white-space: nowrap;

  padding: 8px;

  overflow-x: auto;
  overflow-y: hidden;

  @include scrollbar();
}
</style>
<!-- STYLE END -->