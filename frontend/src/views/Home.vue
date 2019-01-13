<!-- TEMPLATE BEGIN -->
<template>
  <div class="home-page">
    <c-column v-for="column in columns" v-bind:key="column.id" :column="column"/>
    <c-column-form/>
    <c-column :column="archiveColumn" :immortal="true"/>

    <c-task-modal ref="task-modal"/>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
import { filter } from 'rxjs/operators';

import CColumn from '@/components/Column.vue';
import CTaskModal from '@/components/TaskModal.vue';
import CColumnForm from '@/components/ColumnForm.vue';

import { Column } from '@/models/column';
import { Event } from '@/models/event';
import { Task } from '@/models/task';
import state from '@/models/state';

@Component<HomePage>({
  components: {
    CColumn,
    CTaskModal,
    CColumnForm
  }
})
export default class HomePage extends Vue {
  // Properties //
  ///////////////

  public columns: Column[] = [];
  public archiveColumn: Column = new Column({ name: 'Архив' });

  // Component methods //
  //////////////////////

  public async created() {
    this.columns = state.columnManager.columns;

    this.$subscribeTo(state.columnManager.eventBus, (event) => {
      this.columns = state.columnManager.columns;
    });

    this.$subscribeTo(
      state.eventBus.pipe(filter((event) => event.type === 'show-task-modal')),
      (event: Event<Task>) =>
        (this.$refs['task-modal'] as Vue).$emit('show', event.data)
    );
  }

  public async mounted() {
    state.columnManager.fetchAll();
    state.taskManager.fetchAll();
    state.userManager.fetchAll();
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