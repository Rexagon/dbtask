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

import state from '@/models/state';
import { Column } from '@/models';

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
    this.$bus.$on('fetched-columns', (columns: Column[]) => {
      this.columns = columns;
    });

    await state.columnManager.fetchAll();
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
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
}
::-webkit-scrollbar-thumb {
  background: #e1e1e1;
  border: 0px none #ffffff;
  border-radius: 50px;
}
::-webkit-scrollbar-thumb:hover {
  background: #ffffff;
}
::-webkit-scrollbar-thumb:active {
  background: #000000;
}
::-webkit-scrollbar-track {
  background: #666666;
  border: 0px none #ffffff;
  border-radius: 0px;
}
::-webkit-scrollbar-track:hover {
  background: #666666;
}
::-webkit-scrollbar-track:active {
  background: #333333;
}
::-webkit-scrollbar-corner {
  background: transparent;
}
</style>
<!-- STYLE END -->