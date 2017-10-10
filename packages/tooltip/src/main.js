import Popper from 'my-element-ui/src/utils/vue-popper';
import debounce from 'throttle-debounce/debounce';
import { getFirstComponentChild } from 'my-element-ui/src/utils/vdom';
import { getStyle, getText } from 'my-element-ui/src/utils/dom';
import { getByteLen } from 'my-element-ui/src/utils/util';
import Vue from 'vue';

export default {
  name: 'ElTooltip',

  mixins: [Popper],

  props: {
    openDelay: {
      type: Number,
      default: 0
    },
    disabled: Boolean,
    manual: Boolean,
    effect: {
      type: String,
      default: 'dark'
    },
    popperClass: String,
    content: String,
    visibleArrow: {
      default: true
    },
    transition: {
      type: String,
      default: 'el-fade-in-linear'
    },
    popperOptions: {
      default() {
        return {
          boundariesPadding: 10,
          gpuAcceleration: false
        };
      }
    },
    enterable: {
      type: Boolean,
      default: true
    }
  },

  beforeCreate() {
    if (this.$isServer) return;

    this.popperVM = new Vue({
      data: { node: '' },
      render(h) {
        return this.node;
      }
    }).$mount();

    this.debounceClose = debounce(200, () => this.handleClosePopper());
  },

  render(h) {
    if (this.popperVM) {
      this.popperVM.node = (
        <transition
          name={ this.transition }
          onAfterLeave={ this.doDestroy }>
          <div
            onMouseleave={ () => { this.setExpectedState(false); this.debounceClose(); } }
            onMouseenter= { () => { this.setExpectedState(true); } }
            ref="popper"
            v-show={!this.disabled && this.showPopper}
            class={
              ['el-tooltip__popper', 'is-' + this.effect, this.popperClass]
            }>
            <div style="max-width: 720px;">
              { this.$slots.content || this.content }
            </div>
          </div>
        </transition>);
    }

    if (!this.$slots.default || !this.$slots.default.length) return this.$slots.default;

    const vnode = getFirstComponentChild(this.$slots.default);
    if (!vnode) return vnode;
    const data = vnode.data = vnode.data || {};
    const on = vnode.data.on = vnode.data.on || {};
    on.mouseenter = this.addEventHandle(on.mouseenter, () => {
      if (!this.isShow()) {return;}
      this.setExpectedState(true);
      this.handleShowPopper();
    });
    on.mouseleave = this.addEventHandle(on.mouseleave, () => {
      if (!this.isShow()) {return;}
      this.setExpectedState(false);
      this.debounceClose();
    });
    data.staticClass = this.concatClass(data.staticClass, 'el-tooltip');

    return vnode;
  },

  mounted() {
    this.referenceElm = this.$el;
  },

  methods: {
    addEventHandle(old, fn) {
      return old ? Array.isArray(old) ? old.concat(fn) : [old, fn] : fn;
    },

    concatClass(a, b) {
      if (a && a.indexOf(b) > -1) return a;
      return a ? b ? (a + ' ' + b) : a : (b || '');
    },

    handleShowPopper() {
      if (!this.expectedState || this.manual) return;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.showPopper = true;
      }, this.openDelay);
    },

    handleClosePopper() {
      if (this.enterable && this.expectedState || this.manual) return;
      clearTimeout(this.timeout);
      this.showPopper = false;
    },
    isShow() {
      let contentWidth = parseInt(getStyle(this.$el, 'width'), 10);
      let fontWidth = parseInt(getStyle(this.$el, 'font-size'), 10);
      let len = getByteLen(getText(this.$el));
      let paddingWidth = parseInt(getStyle(this.$el, 'padding-left'), 10) + parseInt(getStyle(this.$el, 'padding-right'), 10);
      if (fontWidth * Math.ceil(len / 2) > contentWidth - paddingWidth) {
        return true;
      } else {
        return false;
      }
    },
    setExpectedState(expectedState) {
      this.expectedState = expectedState;
    }
  }
};
