<template>
  <transition name="el-zoom-in-top" @after-leave="doDestroy">
    <div
      v-show="showPopper"
      class="el-autocomplete-suggestion"
      :class="{ 'is-loading': parent.loading }"
      :style="{ width: dropdownWidth }"
    >
      <el-scrollbar
        tag="ul"
        wrap-class="el-autocomplete-suggestion__wrap"
        view-class="el-autocomplete-suggestion__list"
      >
        <li v-if="parent.loading"><i class="el-icon-loading"></i></li>
        <li v-else-if='suggestions.length==0 && dropNone' class="no-data">查无数据</li>
        <template v-for="(item, index) in suggestions" v-else>
        <li
          v-if="!parent.customItem&&html"
          :class="{'highlighted': parent.highlightedIndex === index,'disabled':!item.openType?true:false}"
          class='contentLi'
          @click="select(item)"
        >
          <el-tooltip effect="dark" placement="bottom" :disabled="tooltipFlag">
            <div v-html="!item.openType?'暂不支持爬取，如有需求请联系客服人员':item[props.label]"
                 slot='content'></div>
            <span class="content"
               v-html='item[props.label]'
               @mouseenter.self='showTip($event,item)'
               @mouseout='hideTip'>
            </span>
          </el-tooltip>
          <!-- <div class="el-tooltip__popper is-dark" 
               v-if='(!parent.customItem)&&html&&(item.targId==id)'>
            <div v-html="!item.openType?'暂不支持爬取，如有需求请联系客服人员':item[props.label]"></div>
            <div x-arrow 
                 class='arrow'>
            </div>
          </div> -->
        </li>
          
          <li
            v-if="!parent.customItem&&!html"
            :class="{'highlighted': parent.highlightedIndex === index}"
            @click="select(item)"
          >
            {{item[props.label]}}
          </li>
          <component
            v-else
            :class="{'highlighted': parent.highlightedIndex === index}"
            @click="select(item)"
            :is="parent.customItem"
            :item="item"
            :index="index">
          </component>
        </template>
      </el-scrollbar>
    </div>
  </transition>
</template>
<script>
  import Popper from 'my-element-ui/src/utils/vue-popper';
  import Emitter from 'my-element-ui/src/mixins/emitter';
  import ElScrollbar from 'my-element-ui/packages/scrollbar';
  import ElTooltip from 'my-element-ui/packages/tooltip';

  export default {
    components: { 
      ElScrollbar,
      ElTooltip
   },
    mixins: [Popper, Emitter],

    componentName: 'ElAutocompleteSuggestions',

    data() {
      return {
        parent: this.$parent,
        dropdownWidth: '',
        tooltipFlag: true,
        id: null
      };
    },

    props: {
      props: Object,
      suggestions: Array,
      html: Boolean,
      dropNone: Boolean,
      options: {
        default() {
          return {
            forceAbsolute: true,
            gpuAcceleration: false
          };
        }
      }
    },

    methods: {
      select(item) {
        // if (item.openType) {
        //   if (item.openType === 1) {
        //     this.dispatch('ElAutocomplete', 'item-click', item);
        //   } 
        // } else {
        //   this.dispatch('ElAutocomplete', 'item-click', item);
        // }
        this.dispatch('ElAutocomplete', 'item-click', item);
      },
      showTip(event, item) {
        let liWidth = document.getElementsByClassName('contentLi')[0].offsetWidth;
        if (event.target.offsetWidth > liWidth || item.openType === 0) {
          this.tooltipFlag = false;
        } else {
          this.tooltipFlag = true;
        }
      },
      hideTip() {
        this.tooltipFlag = true;
      }
    },

    updated() {
      this.$nextTick(_ => {
        this.updatePopper();
      });
    },

    mounted() {
      this.popperElm = this.$el;
      this.referenceElm = this.$parent.$refs.input.$refs.input;
    },

    created() {
      this.$on('visible', (val, inputWidth) => {
        this.dropdownWidth = inputWidth + 'px';
        this.showPopper = val;
      });
    }
  };
</script>
