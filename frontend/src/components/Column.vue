<!-- TEMPLATE BEGIN -->
<template>
  <div class="column" :class="{editing}">
    <div>
      <div class="header">
        <template v-if="editing == true">
          <b-input-group>
            <b-input
              type="text"
              autocomplete="off"
              v-model="newName"
              @keyup.enter.native="save"
              @keyup.escape.native="onBlur"
              v-on:blur.native="onBlur"
              ref="name"
            ></b-input>
            <b-input-group-append>
              <b-btn
                variant="success"
                @click="save()"
                :disabled="processing || newName.length == 0"
              >
                <icon name="check" style="position: relative; top: -2px"/>
              </b-btn>
            </b-input-group-append>
          </b-input-group>
        </template>
        <template v-else>
          <b-col mr="auto">{{ column.name }}</b-col>
          <b-col cols="auto" class="p-0" style="text-align: right" v-if="!immortal">
            <b-dropdown size="sm" no-caret variant="link">
              <template slot="button-content">
                <icon name="ellipsis-v" style="position: relative; top: -2px"/>
              </template>
              <b-dropdown-item @click="startEditing">Изменить</b-dropdown-item>
              <b-dropdown-item @click="deleteColumn">Удалить</b-dropdown-item>
            </b-dropdown>
          </b-col>
        </template>
      </div>

      <div class="tasks">
        <c-task v-for="task in tasks" v-bind:key="task.id" :task="task"/>
        <c-new-task ref="taskForm"/>
      </div>

      <div class="task-add" @click="$refs.taskForm.$emit('show', column.id)">
        <icon name="plus" style="position: relative; top: -2px"/>&nbsp;
        <span class="text">Добавить задание</span>
      </div>
    </div>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { map } from 'rxjs/operators';
import Icon from 'vue-awesome/components/Icon';

import CTask from '@/components/Task.vue';
import CNewTask from '@/components/NewTask.vue';

import 'vue-awesome/icons/check';
import 'vue-awesome/icons/ellipsis-v';

import { Column } from '@/models/column';
import { Task } from '@/models/task';
import state from '@/models/state';

@Component<CColumn>({
  components: {
    Icon,
    CTask,
    CNewTask
  }
})
export default class CColumn extends Vue {
  // Properties //
  ///////////////

  @Prop()
  public column!: Column;

  @Prop({
    default: false
  })
  public immortal!: boolean;

  private editing: boolean = false;
  private newName: string = '';
  private processing: boolean = false;

  private tasks: Task[] = [];

  // Component methods //
  //////////////////////

  public created() {
    this.syncTasks();
    this.$subscribeTo(state.taskManager.eventBus, () => {
      this.syncTasks();
    });
    this.$subscribeTo(state.columnManager.eventBus, () => {
      this.syncTasks();
    });
  }

  // Methods //
  ////////////

  public async save() {
    if (this.processing || this.immortal) {
      return;
    }

    this.processing = true;

    try {
      await state.columnManager.update({
        ...this.column,
        name: this.newName
      });
      this.editing = false;
    } catch (err) {
      this.$notify({
        title: 'Невозможно сохранить колонку',
        type: 'error',
        duration: 1500
      });
    }

    this.processing = false;

    this.newName = '';
  }

  public startEditing() {
    this.editing = true;
    this.newName = this.column.name;

    this.$nextTick(() => {
      const el = (this.$refs.name as Vue).$el;
      const input = el as HTMLInputElement;

      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    });
  }

  public async deleteColumn() {
    if (this.processing || this.immortal || this.column.id == null) {
      return;
    }

    this.processing = true;

    try {
      await state.columnManager.delete(this.column.id);
    } catch (err) {
      this.$notify({
        title: 'Невозможно удалить колонку',
        type: 'error',
        duration: 1500
      });
    }

    this.processing = false;
    this.editing = false;
  }

  public onBlur() {
    this.editing = false;
  }

  private syncTasks() {
    this.tasks = state.taskManager.tasks.filter(
      (task) => task.columnId == this.column.id
    );
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.column {
  width: 272px;
  margin: 0 4px;
  height: 100%;
  box-sizing: border-box;
  display: inline-block;
  vertical-align: top;
  white-space: nowrap;
  overflow-y: auto;
  @include scrollbar();

  & > div {
    border-radius: 3px;
    background-color: #2d2d2d;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    max-height: 100%;
    position: relative;
    white-space: normal;

    .header {
      display: flex;
      align-items: center;
      padding: 10px 8px 8px;
      min-height: 50px;
      font-size: 1.2em;

      .btn-link {
        color: inherit;
      }
    }

    .task-add {
      padding: 5px 20px;

      &:hover {
        cursor: pointer;

        .text {
          text-decoration: underline;
        }
      }
    }
  }

  &.editing {
    .header {
      padding: 0px 8px;
      font-size: 1em;
    }
  }

  .tasks {
    .task {
      margin: 10px 5px;
    }
  }
}
</style>
<!-- STYLE END -->