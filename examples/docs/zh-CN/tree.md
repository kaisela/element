<style>
  .demo-tree {
    .leaf {
      width: 20px;
      background: #ddd;
    }

    .folder {
      width: 20px;
      background: #888;
    }

    .buttons {
      margin-top: 20px;
    }
    .source {
      height: 304px;
    }
    .filter-tree {
      margin-top: 20px;
    }
  }
</style>

<script>
  const data = [{
    label: '一级 1',
    id:1,
    children: [{
      label: '二级 1-1',
      id:4,
      children: [{
        label: '三级 1-1-1',
        id:5,
      }]
    }]
  }, {
    label: '一级 2',
    id:2,
    children: [{
      label: '二级 2-1',
      id:6,
      children: [{
        label: '三级 2-1-1',
        id:7,
      }]
    }, {
      label: '二级 2-2',
      id:8,
      children: [{
        label: '三级 2-2-1',
        id:9,
      }]
    }]
  }, {
    label: '一级 3',
    id:3,
    children: [{
      label: '二级 3-1',
      id:10,
      children: [{
        label: '三级 3-1-1',
        id:11
      }]
    }, {
      label: '二级 3-2',
      id:12,
      children: [{
        label: '三级 3-2-1',
        id:13
      }]
    }]
  }];

  const data2 = [{id: 0,
                      label: '全部',
                      children:[{
                                   id: 1,
                                   label: '一级 1',
                                   children: [{
                                     id: 4,
                                     label: '二级 1-1',
                                     children: [{
                                       id: 9,
                                       label: '三级 1-1-1'
                                     }, {
                                       id: 10,
                                       label: '三级 1-1-2'
                                     }]
                                   }]
                                 }, {
                                   id: 2,
                                   label: '一级 2',
                                   children: [{
                                     id: 5,
                                     label: '二级 2-1'
                                   }, {
                                     id: 6,
                                     label: '二级 2-2'
                                   }]
                                 }, {
                                   id: 3,
                                   label: '一级 3',
                                   children: [{
                                     id: 7,
                                     label: '二级 3-1'
                                   }, {
                                     id: 8,
                                     label: '二级 3-2'
                                   }]
                                 }]}];

  let id = 1000;

  const regions = [];

  let count = 1;

  const props = {
    label: 'name',
    children: 'zones'
  };

  const defaultProps = {
    children: 'children',
    label: 'label'
  };

  export default {
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },

    methods: {
      handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
      },
      handleNodeClick(data) {
        console.log(data);
      },
      loadNode(node, resolve, isMore) {
        if (node.level === 0) {
        return resolve([{
                                                        'name': '全部',
                                                        'selected': 3,
                                                      }]);}
        
        if (node.level === 1) {
          return resolve([{
                                                'name': 'Aegion1',
                                                'selected': 2,
                                                'categroy': '行业',
                                                'aggName': 'A',
                                                
                                              }, 
                                              {
                                                                      'name': 'Begion2',
                                                                      'selected': 3,
                                                                      'aggName': 'B',
                                                                    }

       ]);
        }
        if (node.level === 2 && node.data.name === 'Aegion1') {
                  return resolve([{
                                                        'name': 'Cnode1',
                                                        'selected': 1,
                                                        'categroy': '品牌',
                                                        'aggName': 'C',
                                                        'isLeaf': true
                                                      }, {
                                                        'name': 'Znode2',
                                                        'selected': 0,
                                                        'aggName': 'Z',
                                                        'iseaf': true
                                                      }]);
                }else if(node.data.name === 'Begion2'){
                return resolve([]);
                }
                
        
        
      },
      getCheckedNodes() {
        console.log(this.$refs.tree.getCheckedNodes());
      },
      getCheckedKeys() {
        console.log(this.$refs.tree.getCheckedKeys());
      },
      setCheckedNodes() {
        this.$refs.tree1.resetData([
          {
            id: 5,
            label: '二级 2-1'
          },
          {
            id: 9,
            label: '三级 1-1-1'
          }
        ]);
      },
      setCheckedKeys() {
        this.$refs.tree.setCheckedKeys([3]);
      },
      resetChecked() {
        this.$refs.tree.setCheckedKeys([]);
      },
      append(store, data) {
        store.append({ id: id++, label: 'testtest', children: [] }, data);
      },

      remove(store, data) {
        store.remove(data);
      },
      showTree(){
        this.show = true;
        let that = this;
        setTimeout(function(){
          that.$refs.tree1.setElHeight();
        },20);
        
      },
      showTree1(){
              this.show1 = true;
              let that = this;
              setTimeout(function(){
                that.$refs.tree2.setElHeight();
              },20);
              
            },
      renderContent(h, { node, data, store }) {
        return (
          <span style="white-space: normal">
            <span>
              <span>{node.label}</span>
            </span>
            <span style="float: right; margin-right: 20px">
              <el-button size="mini" on-click={ () => this.append(store, data) }>Append</el-button>
              <el-button size="mini" on-click={ () => this.remove(store, data) }>Delete</el-button>
            </span>
          </span>);
      },

      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      }
    },

    data() {
      return {
        data,
        data2,
        regions,
        defaultProps,
        props,
        show:true,
        show1:false,
        defaultCheckedKeys: [5],
        defaultExpandedKeys: [2, 3],
        filterText: ''
      };
    }
  };
</script>

## Tree 树形控件

用清晰的层级结构展示信息，可展开或折叠。

### 可选择

适用于需要选择层级时使用。在下例中，由于在点击时才进行该层数据的获取，导致层级不可预知，如果没有下层数据，则点击后下拉按钮会消失。

::: demo
```html
<el-tree
  :data="regions"
  :props="props"
  :load="loadNode"
  lazy
  v-show="show"
  ref="tree1"
  show-checkbox
  @check-change="handleCheckChange">
</el-tree>

<script>
  export default {
    data() {
      return {
          
        regions: [{
                      'name': 'region1'
                    }, {
                      'name': 'region2'
                    }, {
                      'name': 'region3'
                    }, {
                      'name': 'region4'
                    }, {
                      'name': 'region5'
                    }, {
                      'name': 'region6'
                    }, {
                      'name': 'region7'
                    }, {
                      'name': 'region8'
                    }, {
                      'name': 'region9'
                    }, {
                      'name': 'region10'
                    }, {
                      'name': 'region11'
                    },{
                        'name': 'Begion2',
                        'selected': 2,
                        'aggName': 'B',
                      },{
                         'name': 'Begion2',
                         'selected': 2,
                         'aggName': 'B',
                       },{
                          'name': 'Begion2',
                          'selected': 2,
                          'aggName': 'B',
                        },{
                           'name': 'Begion2',
                           'selected': 2,
                           'aggName': 'B',
                         },{
                            'name': 'Begion2',
                            'selected': 2,
                            'aggName': 'B',
                          },{
                             'name': 'Begion2',
                             'selected': 2,
                             'aggName': 'B',
                           },{
                              'name': 'Begion2',
                              'selected': 2,
                              'aggName': 'B',
                            },{
                               'name': 'Begion2',
                               'selected': 2,
                               'aggName': 'B',
                             }],
        props: {
          label: 'name',
          children: 'zones'
        },
        count: 1
      };
    },
    methods: {
      handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
      },
      handleNodeClick(data) {
        console.log(data);
      },
      loadNode(node, resolve) {
          debugger;
        if (node.level === 0) {
          return resolve([{
                                                'name': 'region1'
                                              }, {
                                                'name': 'region2'
                                              }, {
                                                'name': 'region3'
                                              }, {
                                                'name': 'region4'
                                              }, {
                                                'name': 'region5'
                                              }, {
                                                'name': 'region6'
                                              }, {
                                                'name': 'region7'
                                              }, {
                                                'name': 'region8'
                                              }, {
                                                'name': 'region9'
                                              }, {
                                                'name': 'region10'
                                              }, {
                                                'name': 'region11'
                                              }]);
        }
        if (node.level > 3) return resolve([]);

        var hasChild;
        if (node.data.name === 'region1') {
          hasChild = true;
        } else if (node.data.name === 'region2') {
          hasChild = false;
        } else {
          hasChild = Math.random() > 0.5;
        }

        setTimeout(() => {
          var data;
          if (hasChild) {
            data = [{
              name: 'zone' + this.count++
            }, {
              name: 'zone' + this.count++
            }];
          } else {
            data = [];
          }

          resolve(data);
        }, 5000);
      }
    }
  };
</script>
```
:::







### Attributes
| 参数                    | 说明                                       | 类型                          | 可选值  | 默认值   |
| --------------------- | ---------------------------------------- | --------------------------- | ---- | ----- |
| data                  | 展示数据                                     | array                       | —    | —     |
| empty-text            | 内容为空的时候展示的文本                             | String                      | —    | —     |
| node-key              | 每个树节点用来作为唯一标识的属性，整颗树应该是唯一的               | String                      | —    | —     |
| props                 | 配置选项，具体看下表                               | object                      | —    | —     |
| load                  | 加载子树数据的方法                                | function(node, resolve)     | —    | —     |
| render-content        | 树节点的内容区的渲染 Function                      | Function(h, { node }        | —    | —     |
| highlight-current     | 是否高亮当前选中节点，默认值是 false。                   | boolean                     | —    | false |
| current-node-key      | 当前选中节点的 key，只写属性                         | string, number              | —    | —     |
| default-expand-all    | 是否默认展开所有节点                               | boolean                     | —    | false |
| expand-on-click-node  | 是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。 | boolean                     | —    | true  |
| auto-expand-parent    | 展开子节点的时候是否自动展开父节点                        | boolean                     | —    | true  |
| default-expanded-keys | 默认展开的节点的 key 的数组                         | array                       | —    | —     |
| show-checkbox         | 节点是否可被选择                                 | boolean                     | —    | false |
| check-strictly        | 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false   | boolean                     | —    | false |
| default-checked-keys  | 默认勾选的节点的 key 的数组                         | array                       | —    | —     |
| filter-node-method    | 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏 | Function(value, data, node) | —    | —     |
| accordion             | 是否每次只打开一个同级树节点展开                         | boolean                     | —    | false |
| indent                | 相邻级节点间的水平缩进，单位为像素                        | number                     | —    | 16 |

### props
| 参数       | 说明                | 类型     | 可选值  | 默认值  |
| -------- | ----------------- | ------ | ---- | ---- |
| label    | 指定节点标签为节点对象的某个属性值 | string | —    | —    |
| children | 指定子树为节点对象的某个属性值   | string | —    | —    |

### 方法
`Tree` 拥有如下方法，返回目前被选中的节点数组：
| 方法名             | 说明                                       | 参数                                       |
| --------------- | ---------------------------------------- | ---------------------------------------- |
| filter          | 对树节点进行筛选操作                               | 接收一个任意类型的参数，该参数会在 filter-node-method 中作为第一个参数 |
| getCheckedNodes | 若节点可被选择（即 `show-checkbox` 为 `true`），则返回目前被选中的节点所组成的数组 | (leafOnly) 接收一个 boolean 类型的参数，若为 `true` 则仅返回被选中的叶子节点，默认值为 `false` |
| setCheckedNodes | 设置目前勾选的节点，使用此方法必须设置 node-key 属性          | (nodes) 接收勾选节点数据的数组                      |
| getCheckedKeys  | 若节点可被选择（即 `show-checkbox` 为 `true`），则返回目前被选中的节点所组成的数组 | (leafOnly) 接收一个 boolean 类型的参数，若为 `true` 则仅返回被选中的叶子节点的 keys，默认值为 `false` |
| setCheckedKeys  | 通过 keys 设置目前勾选的节点，使用此方法必须设置 node-key 属性  | (keys, leafOnly) 接收两个参数，1. 勾选节点的 key 的数组 2. boolean 类型的参数，若为 `true` 则仅设置叶子节点的选中状态，默认值为 `false` |
| setChecked      | 通过 key / data 设置某个节点的勾选状态，使用此方法必须设置 node-key 属性 | (key/data, checked, deep) 接收三个参数，1. 勾选节点的 key 或者 data 2. boolean 类型，节点是否选中  3. boolean 类型，是否设置子节点 ，默认为 false |

### Events
| 事件名称           | 说明             | 回调参数                                     |
| -------------- | -------------- | ---------------------------------------- |
| node-click     | 节点被点击时的回调      | 共三个参数，依次为：传递给 `data` 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。 |
| check-change   | 节点选中状态发生变化时的回调 | 共三个参数，依次为：传递给 `data` 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点 |
| current-change | 当前选中节点变化时触发的事件 | 共两个参数，依次为：当前节点的数据，当前节点的 Node 对象          |
| node-expand    | 节点被展开时触发的事件    | 共三个参数，依次为：传递给 `data` 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。 |
| node-collapse  | 节点被关闭时触发的事件    | 共三个参数，依次为：传递给 `data` 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。 |
