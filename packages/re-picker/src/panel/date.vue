<template>
    <transition name="el-zoom-in-top" @after-leave="$emit('dodestroy')">
        <div
                v-show="visible"
                :style="{
        width: width + 'px'
      }"
                class="el-re-picker el-picker-panel el-date-picker"
                :class="[{
        'has-sidebar': $slots.sidebar || shortcuts,
        'has-time': showTime
      }, popperClass]">
            <div class="el-picker-panel__body-wrapper">
                <slot name="sidebar" class="el-picker-panel__sidebar"></slot>
                <div class="el-picker-panel__sidebar" v-if="shortcuts">
                    <button
                            type="button"
                            class="el-picker-panel__shortcut"
                            v-for="shortcut in shortcuts"
                            @click="handleShortcutClick(shortcut)">{{ shortcut.text }}
                    </button>
                </div>
                <div class="el-picker-panel__body">
                    <div class="el-date-picker__time-header" v-if="showTime">
            <span class="el-date-picker__editor-wrap">
              <el-input
                      :placeholder="t('el.datepicker.selectDate')"
                      :value="visibleDate"
                      size="small"
                      @change.native="visibleDate = $event.target.value"/>
            </span>
                        <span class="el-date-picker__editor-wrap">
              <el-input
                      ref="input"
                      @focus="timePickerVisible = !timePickerVisible"
                      :placeholder="t('el.datepicker.selectTime')"
                      :value="visibleTime"
                      size="small"
                      @change.native="visibleTime = $event.target.value"/>
              <time-picker
                      ref="timepicker"
                      :date="date"
                      :picker-width="pickerWidth"
                      @pick="handleTimePick"
                      :visible="timePickerVisible"
                      @mounted="$refs.timepicker.format=timeFormat">
              </time-picker>
            </span>
                    </div>
                    <div class="el-date-picker__header" v-show="currentView !== 'time'">
                        <button
                                type="button"
                                @click="prevYear"
                                class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left">
                        </button>
                        <button
                                type="button"
                                @click="prevMonth"
                                v-show="currentView === 'date'"
                                class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-arrow-left">
                        </button>
                        <span
                                @click="showYearPicker"
                                class="el-date-picker__header-label">{{ yearLabel }}</span>
                        <span
                                @click="showMonthPicker"
                                v-show="currentView === 'date'"
                                class="el-date-picker__header-label"
                                :class="{ active: currentView === 'month' }">{{t(`el.datepicker.month${ month + 1 }`)}}</span>
                        <button
                                type="button"
                                @click="nextYear"
                                class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right">
                        </button>
                        <button
                                type="button"
                                @click="nextMonth"
                                v-show="currentView === 'date'"
                                class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-arrow-right">
                        </button>
                    </div>

                    <div class="el-picker-panel__content">
                        <date-table
                                v-show="currentView === 'date'"
                                @pick="handleDatePick"
                                @pick-child="chooseDate"
                                @changePanel="changeData"
                                :year="year"
                                :month="month"
                                :date="date"
                                :week="week"
                                :seedCount="seedCount"
                                :selection-mode="selectionMode"
                                :first-day-of-week="firstDayOfWeek"
                                :disabled-date="disabledDate">
                        </date-table>
                        <year-table
                                ref="yearTable"
                                :year="year"
                                :date="date"
                                v-show="currentView === 'year'"
                                @pick="handleYearPick"
                                :disabled-date="disabledDate">
                        </year-table>
                        <month-table
                                :month="month"
                                :date="date"
                                v-show="currentView === 'month'"
                                @pick="handleMonthPick"
                                :disabled-date="disabledDate">
                        </month-table>
                    </div>
                </div>
            </div>

            <div
                    class="el-picker-panel__footer"
                    v-show="footerVisible && currentView === 'date'">
                <a
                        href="JavaScript:"
                        class="el-picker-panel__link-btn"
                        @click="changeToNow">{{ t('el.datepicker.now') }}</a>
                <button
                        type="button"
                        class="el-picker-panel__btn"
                        @click="confirm">{{ t('el.datepicker.confirm') }}
                </button>
            </div>
        </div>
    </transition>
</template>

<script type="text/babel">
  import {
    formatDate,
    parseDate,
    getWeekNumber
  } from '../util';
  import Locale from 'my-element-ui/src/mixins/locale';
  import ElInput from 'my-element-ui/packages/input';
  import TimePicker from './time';
  import YearTable from '../basic/year-table';
  import MonthTable from '../basic/month-table';
  import DateTable from '../basic/date-table';
  import {
    newVue
  } from '../../newVue';
  export default {
    mixins: [Locale],

    watch: {
      showTime(val) {
        /* istanbul ignore if */
        if (!val) return;
        this.$nextTick(_ => {
          const inputElm = this.$refs.input.$el;
          if (inputElm) {
            this.pickerWidth = inputElm.getBoundingClientRect().width + 10;
          }
        });
      },

      value(newVal) {
        if (!newVal) return;
        newVal = new Date(newVal);
        if (!isNaN(newVal)) {
          if (typeof this.disabledDate === 'function' &&
            this.disabledDate(new Date(newVal))) {
            return;
          }
          this.date = newVal;
          this.year = newVal.getFullYear();
          this.month = newVal.getMonth();
          this.$emit('pick', newVal, false);
        }
      },

      timePickerVisible(val) {
        if (val) this.$nextTick(() => this.$refs.timepicker.ajustScrollTop());
      },

      selectionMode(newVal) {
        if (newVal === 'month') {
          /* istanbul ignore next */
          if (this.currentView !== 'year' || this.currentView !== 'month') {
            this.currentView = 'month';
          }
        } else if (newVal === 'week') {
          this.week = getWeekNumber(this.date);
        }
      },

      date(newVal) {
        this.year = newVal.getFullYear();
        this.month = newVal.getMonth();
        if (this.selectionMode === 'week') this.week = getWeekNumber(newVal);
      }
    },

    methods: {
      handleClear() {
        this.date = this.$options.defaultValue ? new Date(this.$options.defaultValue) : new Date();
        this.$emit('pick');
      },

      resetDate() {
        this.date = new Date(this.date);
      },

      showMonthPicker() {
        this.currentView = 'month';
      },

      showYearPicker() {
        this.currentView = 'year';
      },

      chooseDate() {
        this.$emit('pick', this.newDate);
      },

      // XXX: 没用到
      // handleLabelClick() {
      //   if (this.currentView === 'date') {
      //     this.showMonthPicker();
      //   } else if (this.currentView === 'month') {
      //     this.showYearPicker();;
      //   };
      // },

      prevMonth() {
        this.month--;
        if (this.month < 0) {
          this.month = 11;
          this.year--;
        }
        this.changeData();
      },

      nextMonth() {
        this.month++;
        if (this.month > 11) {
          this.month = 0;
          this.year++;
        }
        this.changeData();
      },

      nextYear() {
        if (this.currentView === 'year') {
          this.$refs.yearTable.nextTenYear();
        } else {
          this.year++;
          this.date.setFullYear(this.year);
          this.resetDate();
        }
        this.changeData();
      },

      prevYear() {
        if (this.currentView === 'year') {
          this.$refs.yearTable.prevTenYear();
        } else {
          this.year--;
          this.date.setFullYear(this.year);
          this.resetDate();
        }
        this.changeData();
      },
      addClass(cla, element) {
        if (!this.hasClass(cla, element)) {
          if (element.setAttribute) {
            element.setAttribute('class', element.getAttribute('class') + ' ' + cla);
          } else {
            element.className = element.className + ' ' + cla;
          }
        }
      },
      hasClass(cla, element) {
        if (element.className.trim().length === 0) return false;
        var allClass = element.className.trim().split(' ');
        return allClass.indexOf(cla) > -1;
      },
      changeData() {
        this.$nextTick(() => {
          let tds = document.getElementsByClassName('td');
          for (let j = 0; j < tds.length; j++) {
            tds[j].lastChild.innerHTML = 0;
            tds[j].classList.remove('unused');
          }
          let lengthWidth = this.resource.length;
          for (let i = 0; i < lengthWidth; i++) {
            if (document.getElementsByName(this.resource[i].date)) {
              let array = document.getElementsByName(this.resource[i].date);
              for (let k = 0; k < array.length; k++) {
                if (this.resource[i].available < this.seedCount) {
                  this.addClass('unused', array[k]);
                }
                array[k].lastChild.innerHTML = this.resource[i].available;
              }
            }
          }
        });
      },
      handleShortcutClick(shortcut) {
        if (shortcut.onClick) {
          shortcut.onClick(this);
        }
      },

      handleTimePick(picker, visible, first) {
        if (picker) {
          let oldDate = new Date(this.date.getTime());
          let hour = picker.getHours();
          let minute = picker.getMinutes();
          let second = picker.getSeconds();
          oldDate.setHours(hour);
          oldDate.setMinutes(minute);
          oldDate.setSeconds(second);
          this.date = new Date(oldDate.getTime());
        }

        if (!first) {
          this.timePickerVisible = visible;
        }
      },

      handleMonthPick(month) {
        this.month = month;
        const selectionMode = this.selectionMode;
        if (selectionMode !== 'month') {
          this.date.setMonth(month);
          this.currentView = 'date';
          this.resetDate();
        } else {
          this.date.setMonth(month);
          this.year && this.date.setFullYear(this.year);
          this.resetDate();
          const value = new Date(this.date.getFullYear(), month, 1);
          this.$emit('pick', value);
        }
      },

      handleDatePick(value) {
        if (this.selectionMode === 'day') {
          if (!this.showTime) {
            this.newDate = new Date(value.getTime());
          }
          this.date.setFullYear(value.getFullYear());
          this.date.setMonth(value.getMonth(), value.getDate());
        } else if (this.selectionMode === 'week') {
          this.week = value.week;
          this.$emit('pick', value.date);
        }

        this.resetDate();
      },

      handleYearPick(year, close = true) {
        this.year = year;
        if (!close) return;

        this.date.setFullYear(year);
        if (this.selectionMode === 'year') {
          this.$emit('pick', new Date(year, 0, 1));
        } else {
          this.currentView = 'month';
        }

        this.resetDate();
      },

      changeToNow() {
        this.date.setTime(+new Date());
        this.$emit('pick', new Date(this.date.getTime()));
        this.resetDate();
      },

      confirm() {
        this.date.setMilliseconds(0);
        this.$emit('pick', this.date);
      },

      resetView() {
        if (this.selectionMode === 'month') {
          this.currentView = 'month';
        } else if (this.selectionMode === 'year') {
          this.currentView = 'year';
        } else {
          this.currentView = 'date';
        }

        if (this.selectionMode !== 'week') {
          this.year = this.date.getFullYear();
          this.month = this.date.getMonth();
        }
        this.changeData();
      }
    },

    components: {
      TimePicker,
      YearTable,
      MonthTable,
      DateTable,
      ElInput
    },
    created() {
      // let dateList = JSON.stringify([{"date":"2017-11-10","seedCount":0,"available":20},{"date":"2017-11-11","seedCount":0,"available":20},{"date":"2017-11-12","seedCount":0,"available":20},{"date":"2017-11-13","seedCount":0,"available":20},{"date":"2017-11-14","seedCount":0,"available":20},{"date":"2017-11-15","seedCount":0,"available":20},{"date":"2017-11-16","seedCount":0,"available":20},{"date":"2017-11-17","seedCount":0,"available":20},{"date":"2017-10-28","seedCount":18,"available":2},{"date":"2017-11-18","seedCount":0,"available":20},{"date":"2017-10-29","seedCount":15,"available":5},{"date":"2017-11-19","seedCount":0,"available":20},{"date":"2017-10-30","seedCount":15,"available":5},{"date":"2017-11-20","seedCount":0,"available":20},{"date":"2017-10-31","seedCount":21,"available":-1},{"date":"2017-11-21","seedCount":0,"available":20},{"date":"2017-11-22","seedCount":0,"available":20},{"date":"2017-11-01","seedCount":15,"available":5},{"date":"2017-11-23","seedCount":0,"available":20},{"date":"2017-11-02","seedCount":12,"available":8},{"date":"2017-11-24","seedCount":0,"available":20},{"date":"2017-11-03","seedCount":12,"available":8},{"date":"2017-11-25","seedCount":0,"available":20},{"date":"2017-11-04","seedCount":12,"available":8},{"date":"2017-11-26","seedCount":0,"available":20},{"date":"2017-11-05","seedCount":12,"available":8},{"date":"2017-11-06","seedCount":9,"available":11},{"date":"2017-11-07","seedCount":0,"available":20},{"date":"2017-11-08","seedCount":0,"available":20},{"date":"2017-11-09","seedCount":0,"available":20}])
      // localStorage.setItem('dateList',dateList)
      // localStorage.setItem('seedCount',3)
      this.resource = JSON.parse(localStorage.getItem('dateList')); // 初始化的时候给数据;
      this.seedCount = parseInt(localStorage.getItem('seedCount'), 10);
    },
    mounted() {
      if (this.date && !this.year) {
        this.year = this.date.getFullYear();
        this.month = this.date.getMonth();
      }
      newVue.$on('test', (value) => {
        this.resource = value; // 确认已拿到时间和信源对应的数;
      });
      this.changeData();
    },

    data() {
      return {
        popperClass: '',
        pickerWidth: 0,
        date: this.$options.defaultValue ? new Date(this.$options.defaultValue) : new Date(),
        value: '',
        showTime: false,
        selectionMode: 'day',
        shortcuts: '',
        visible: false,
        currentView: 'date',
        disabledDate: '',
        firstDayOfWeek: 7,
        year: null,
        month: null,
        week: null,
        showWeekNumber: false,
        timePickerVisible: false,
        width: 0,
        format: '',
        resource: [],
        seedCount: 0,
        newDate: ''
      };
    },
    computed: {
      footerVisible() {
        return this.showTime;
      },

      visibleTime: {
        get() {
          return formatDate(this.date, this.timeFormat);
        },

        set(val) {
          if (val) {
            const date = parseDate(val, this.timeFormat);
            if (date) {
              date.setFullYear(this.date.getFullYear());
              date.setMonth(this.date.getMonth());
              date.setDate(this.date.getDate());
              this.date = date;
              this.$refs.timepicker.value = date;
              this.timePickerVisible = false;
            }
          }
        }
      },

      visibleDate: {
        get() {
          return formatDate(this.date);
        },

        set(val) {
          const date = parseDate(val, 'yyyy-MM-dd');
          if (!date) {
            return;
          }
          if (typeof this.disabledDate === 'function' && this.disabledDate(date)) {
            return;
          }
          date.setHours(this.date.getHours());
          date.setMinutes(this.date.getMinutes());
          date.setSeconds(this.date.getSeconds());
          this.date = date;
          this.resetView();
        }
      },

      yearLabel() {
        const year = this.year;
        if (!year) return '';
        const yearTranslation = this.t('el.datepicker.year');
        if (this.currentView === 'year') {
          const startYear = Math.floor(year / 10) * 10;
          if (yearTranslation) {
            return startYear + ' ' + yearTranslation + ' - ' + (startYear + 9) + ' ' + yearTranslation;
          }
          return startYear + ' - ' + (startYear + 9);
        }
        return this.year + ' ' + yearTranslation;
      },

      timeFormat() {
        if (this.format && this.format.indexOf('ss') === -1) {
          return 'HH:mm';
        } else {
          return 'HH:mm:ss';
        }
      }
    }
  };
</script>
