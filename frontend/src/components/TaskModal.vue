<!-- TEMPLATE BEGIN -->
<template>
  <div class="task-modal">
    <b-modal v-model="isVisible" size="lg">
      <template slot="modal-title">Задание</template>

      <b-form @submit.prevent="save">
        <b-form-group label="Название">
          <b-form-input v-model="data.title"/>
        </b-form-group>
        <b-form-group label="Описание">
          <b-form-textarea
            v-autosize="data.description"
            v-model="data.description"
            ref="description"
          ></b-form-textarea>
        </b-form-group>
        <b-form-group label="Колонка">
          <b-form-select v-model="data.columnId" :options="columnOptions"/>
        </b-form-group>
        <b-form-group label="Ответственные">
          <div class="users-list">
            <div
              v-b-tooltip.hover
              :title="`${user.firstName} ${user.lastName}`"
              v-for="user in assignedUsers"
              :key="user.id"
            >
              <span class="text">@{{ user.login }}</span>
              <span class="delete" @click="removeAssigned(user.id)">
                <icon name="times"/>
              </span>
            </div>
            <b-input-group style="width: 200px" v-if="userOptions.length > 0">
              <b-form-select v-model="selectedUserId" :options="userOptions"/>
              <b-input-group-append>
                <b-btn variant="success" @click="addAssigned" :disabled="selectedUserId == null">
                  <icon name="plus" style="position: relative; top: -2px"/>
                </b-btn>
              </b-input-group-append>
            </b-input-group>
          </div>
        </b-form-group>
      </b-form>

      <template slot="modal-footer">
        <b-row class="w-100 m-0">
          <b-col cols="auto" class="order-3 p-0">
            <b-button variant="primary" :disabled="processing" @click="save">Сохранить</b-button>
          </b-col>
          <b-col cols="auto" class="order-2 m-0">
            <b-button variant="secondary" @click="isVisible = false" :disabled="processing">Отмена</b-button>
          </b-col>
          <b-col cols="auto" class="order-1 mr-auto pl-0">
            <b-button variant="outline-danger" @click="deleteTask" :disabled="processing">Удалить</b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEIGN -->
<script lang="ts">
import { Component, Watch, Prop, Vue } from 'vue-property-decorator';
import autosize from 'autosize';

import Icon from 'vue-awesome/components/Icon';
import CTaskUser from '@/components/TaskModal.vue';

import 'vue-awesome/icons/plus';
import 'vue-awesome/icons/times';

import { Task, ITaskData } from '@/models/task';
import { IUserData } from '@/models/user';
import { Column } from '@/models/column';
import state from '@/models/state';

@Component({
  components: {
    Icon,
    CTaskUser
  }
})
export default class TaskModal extends Vue {
  // Properties //
  ///////////////

  private data: ITaskData = new Task();
  private processing: boolean = false;
  private isVisible: boolean = false;
  private selectedUserId: number | null = null;

  private columnOptions: Array<{ value?: number; text: string }> = [];
  private userOptions: Array<{ value?: number; text: string }> = [];

  // Component methods //
  //////////////////////

  public created() {
    this.syncColumns();
    this.syncUsers();

    this.$subscribeTo(state.columnManager.eventBus, () => {
      this.syncColumns();
    });

    this.$subscribeTo(state.userManager.eventBus, () => {
      this.syncUsers();
    });

    this.$on('lock', (lock: boolean) => {
      this.processing = lock;
    });

    this.$on('show', (task?: ITaskData) => {
      this.data = Object.assign({}, task) || new Task();
      autosize((this.$refs.description as Vue).$el);

      if (this.data.id !== 0) {
        state.taskManager.fetchOne(this.data.id).then(() => {
          const index = state.taskManager.tasks.findIndex(
            (task) => task.id === this.data.id
          );
          if (index < 0) {
            return;
          }
          this.data.assignedUsers =
            state.taskManager.tasks[index].assignedUsers;

          this.syncUsers();
        });
      }

      this.selectedUserId = null;
      this.isVisible = true;
    });
  }

  @Watch('task', {
    immediate: true
  })
  public onTaskChanged(task?: Task) {
    if (task) {
      this.data = Object.assign({}, task);
    } else {
      this.data = new Task();
    }
  }

  public mounted() {
    this.syncColumns();
  }

  // Methods //
  ////////////

  public async save() {
    if (this.processing) {
      return;
    }

    this.processing = true;

    try {
      await state.taskManager.update(this.data);

      this.$notify({
        title: 'Задача сохранена',
        duration: 1500
      });
    } catch (err) {
      this.$notify({
        title: 'Невозможно сохранить задачу',
        duration: 1500,
        type: 'error'
      });
    }

    this.processing = false;
  }

  public async deleteTask() {
    if (
      this.processing ||
      !confirm('Вы действительно хотите удалить задачу?')
    ) {
      return;
    }

    this.processing = true;

    try {
      await state.taskManager.delete(this.data.id);

      this.$notify({
        title: 'Задача удалена',
        duration: 1500
      });

      this.isVisible = false;
    } catch (err) {
      this.$notify({
        title: 'Невозможно удалить задачу',
        duration: 1500,
        type: 'error'
      });
    }

    this.processing = false;
  }

  public addAssigned() {
    if (this.selectedUserId == null) {
      return;
    }

    if (this.data.assignedUsers == null) {
      this.data.assignedUsers = [];
    } else if (this.data.assignedUsers.includes(this.selectedUserId)) {
      return;
    }

    const index = state.userManager.users.findIndex(
      (user) => user.id === this.selectedUserId
    );
    if (index < 0) {
      return;
    }

    this.data.assignedUsers.push(state.userManager.users[index].id);
    this.selectedUserId = null;
    this.syncUsers();
  }

  public removeAssigned(id: number) {
    if (this.data.assignedUsers == null) {
      return;
    }

    const index = this.data.assignedUsers.findIndex((user) => user === id);
    if (index < 0) {
      return;
    }

    Vue.delete(this.data.assignedUsers, index);
    this.syncUsers();
  }

  public syncColumns() {
    this.columnOptions = [{ text: 'Архив' }].concat(
      state.columnManager.columns.map((column) => ({
        value: column.id,
        text: column.name
      }))
    );
  }

  public syncUsers() {
    this.userOptions = state.userManager.users
      .filter(
        (user) =>
          this.data.assignedUsers == null ||
          !this.data.assignedUsers.some((assigned) => assigned === user.id)
      )
      .map((user) => ({
        value: user.id,
        text: `@${user.login}`
      }));
  }

  // Computed //
  /////////////

  public get assignedUsers() {
    if (this.data.assignedUsers == null) {
      return [];
    }

    return this.data.assignedUsers.map((userId) => {
      const index = state.userManager.users.findIndex(
        (user) => user.id === userId
      );

      if (index < 0) {
        return null;
      }

      return state.userManager.users[index];
    });
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.task-modal {
  textarea {
    resize: none;
    @include no-scrollbar();
  }

  .users-list {
    display: flex;
    flex-wrap: wrap;

    & > div {
      background-color: #3c3c3c;
      border: 1px solid #3c3c3c;
      margin: 0px 5px 5px 0px;
      font-weight: bold;
      display: flex;
      flex-direction: row;

      span {
        height: 38px;

        &.text {
          padding: 0 1.75rem 0 0.75rem;
          line-height: 40px;
        }

        &.delete {
          width: 2em;
          line-height: 36px;
          text-align: center;
          color: var(--danger);

          &:hover {
            cursor: pointer;
            color: darken(#dc3545, 20);
          }
        }
      }
    }
  }
}
</style>
<!-- STYLE END -->
