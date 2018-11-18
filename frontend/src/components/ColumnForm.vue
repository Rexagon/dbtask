<!-- TEMPLATE BEGIN -->
<template>
  <div class="column editing">
    <div>
      <div class="header">
        <b-input-group>
          <b-input type="text" autocomplete="off" v-model="newName" @keyup.enter.native="save" ref="name"></b-input>
          <b-input-group-append>
            <b-btn variant="success" @click="save()" :disabled="processing || newName.length == 0">
              <icon name="plus" style="position: relative; top: -2px" />
            </b-btn>
          </b-input-group-append>
        </b-input-group>
      </div>
    </div>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Icon from 'vue-awesome/components/Icon';

import 'vue-awesome/icons/plus';

import { Column } from '@/models/column';
import state from '@/models/state';

@Component({
  components: {
    Icon
  }
})
export default class CColumnForm extends Vue {
  // Properties //
  ///////////////

  private newName: string = '';
  private processing: boolean = false;

  // Methods //
  ////////////

  public async save() {
    if (this.processing) {
      return;
    }

    this.processing = true;

    try {
      await state.columnManager.create(this.newName);
    } catch (err) {
      this.$notify({
        title: 'Невозможно создать колонку',
        type: 'error',
        duration: 1500
      });
    }

    this.processing = false;

    this.newName = '';
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
</style>
<!-- STYLE END -->