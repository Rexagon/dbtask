<!-- TEMPLATE BEGIN -->
<template>
  <div class="task">
    <div @click="$refs.modal.$emit('show', task)">
      <h4>{{ task.title }}</h4>
      <div>
        <icon name="align-left" style="position: relative; top: -2px" />
      </div>
    </div>

    <c-task-modal ref="modal" />
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Icon from 'vue-awesome/components/Icon';

import CTaskModal from '@/components/TaskModal.vue';

import 'vue-awesome/icons/align-left';

import { Task } from '@/models/task';

@Component({
  components: {
    Icon,
    CTaskModal
  }
})
export default class CTask extends Vue {
  // Properties //
  ///////////////

  @Prop()
  public task!: Task;

  // Component methods //
  //////////////////////

  public mounted() {}
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.task {
  padding: 5px 10px;
  background-color: #444444;
  box-shadow: 2px 2px 0px 0px rgba(0, 0, 0, 0.1);
  cursor: pointer;

  &:hover {
    background-color: #555555;
  }
}
</style>
<!-- STYLE END -->