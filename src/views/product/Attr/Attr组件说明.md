Category组件:<br />封装: 由于Category组件多处复用, 所以将其封装为组件.<br />数据:  几处使用Category组件时所需数据都是一样的, 所以将category组件的数据存放在store中, 方便使用它的组件获取

所选"一级分类"选项发生变化时清空数据:  所选"二级分类"id  "三级分类"选项列表 所选"三级分类"id<br />所选"二级分类"选项发生变化时清空数据:  所选"三级分类"id

Attribute组件:<br />attribute组件有两个页面, 属性列表展示页面以及属性操作页面,:<br />首先加载属性列表展示页面, 监听`categoryStore.c3Id`,当`categoryStore.c3Id`值不为空时请求属性列表进行展示<br />当点击"添加属性"或者"编辑属性"按钮时切换为属性操作页面, 在属性操作界面点击"取消"按钮返回属性列表展示页面.<br />利用一个枚举变量(`scene`)配合v-if v-else来控制两个页面的切换.<br />当未选择"三级分类"选项时, 即`categoryStore.c3Id`为空字符串时"添加属性"按钮应处于禁用状态:

```vue
<el-button :disabled="!categoryStore.c3Id">添加属性</el-button>
```

当点击"添加属性"或者"编辑属性"按钮时切换为属性操作页面, 此时要将category组件中的三个选择器禁用:<br />将用来控制页面切换的枚举变量通过props传递给category组件, 用此变量来判断何时禁用三个选择器.

添加/修改属性界面;<br />添加/修改属性接口所需数据:

```tsx
//属性值对象的ts类型
export interface AttrValue {
  id?: number
  valueName: string
  attrId?: number
  flag?: boolean
}
//存储每一个属性值的数组类型
export type AttrValueList = AttrValue[]

//属性对象类型
export interface Attr {
  id?: number
  attrName: string
  categoryId: number | string
  categoryLevel: number
  attrValueList: AttrValueList
}

let attrParams = reactive<Attr>({
  attrName: "",//属性的名字
  attrValueList: [//属性值数组
  ],
  categoryId: '',//三级分类的ID
  categoryLevel: 3,//代表的是三级分类
})
```

如果是添加新属性, 则属性id和属性值id都不需要.<br />修改已有属性时, 新增的属性值对象中的id和atrId都不需要.<br />点击"添加属性值"按钮, 向attrValueList列表中添加属性值对象.

当"属性名称"为空时禁用"添加属性值"按钮: `:disabled="!attrParams.attrName"`<br />当属性值列表不为空且列表中第一个属性值不为空(正在输入时点保存)时"保存"按钮才可用:

```vue
:disabled="attrParams.attrValueList.length === 0 || attrParams.attrValueList[0].valueName === ''"
```

当属性值输入框失去焦点时进行校验:

- 属性值不能为空, 如果为空, 则从attrValueList中删除此属性, 并警告:"属性值不能为空"
- 属性值不能重复, 需要与已有的属性值进行比较, 如果为空, 则重新聚焦刚才的属性值输入框, 并警告: "属性值不能重复"

属性值展示与编辑状态的切换:<br />使用一个枚举状态量搭配v-if v-else来控制状态, 由于每个属性值都需要各自独立的状态变量, 所以向属性值对象上添加此状态量:<br />点击"添加属性值"按钮, 向attrValueList列表中添加属性值对象时,对象中直接包含一个flag字段:

```vue
attrParams.attrValueList.push({
        valueName: '',
        flag: true,//控制每一个属性值编辑模式与展示模式的切换
    });
```

点击"展示状态"的属性值表格时触发点击事件, 在点击事件监听函数中令所对应的属性值对象的flag为true:

> 当属性值对象中没有此属性时会追加此属性, 点击编辑属性按钮后已有属性值对象中都是没有flag字段的.

```vue
//属性值div点击事件
const toEdit = (row: AttrValue, $index: number) => {
    //将flag切换为true(如果没有则会追加此属性), 切换为编辑模式
    row.flag = true;
}
```

属性值输入框的聚焦:<br />要想聚焦输入框, 可以调用el-input组件提供的focus()方法, 但是需要先获取表格中的所有el-input组件实例组成的数组, 因为表格式按照数组主公的数据进行渲染的, 所以想要聚焦到哪个el-input要通过数组的索引来进行.<br />获取组件实例肯定需要使用ref, 但是由于表格的行并不是通过v-for渲染的, 所以无法直接获取表格中所有el-input组件实例组成的数组.<br />可以利用函数模板引用:

```vue
<el-input :ref="(vc) => inputArr[$index] = vc" v-if="row.flag"
  @blur="toLook(row, $index)" v-model="row.valueName"></el-input>
```

此函数的作用是在el-input组件变化是(包括出现, 消失)时将此组件实例添加到inputArr数组中, 此数组专门用于保存el-input组件实例.且必须使用函数形式,不能为`:ref="inputArr[$index]"`,使用组件引用时也必须在nextTick中.<br />有三处需要聚焦的地方:

- 当添加新属性时, 自动聚焦到新属性的输入框:

```vue
//添加属性值按钮的回调
const addAttrValue = () => {
    //点击添加属性值按钮的时候,向数组添加一个属性值对象
    attrParams.attrValueList.push({
        valueName: '',
        flag: true,//控制每一个属性值编辑模式与展示模式的切换
    });
    //获取最后el-input组件聚焦
    nextTick(() => {
        inputArr.value[attrParams.attrValueList.length - 1].focus();
    })
}
```

- 当属性值输入框失焦时判断如果与已有属性值重复, 则重新聚焦此输入框

```vue
//属性值表单元素失却焦点事件回调
const toLook = (row: AttrValue, $index: number) => {
  //非法情况2: 属性值不能重复
    let repeat = attrParams.attrValueList.find((item) => {
        //切记把当前失却焦点属性值对象从当前数组扣除判断
        if (item != row) {
            return item.valueName === row.valueName;
        }
    });

    if (repeat) {
        //重新聚焦到刚才的输入框
        inputArr.value[$index].focus();
        //提示信息
        ElMessage({
            type: 'error',
            message: '属性值不能重复'
        })
        return;
    }
}
```

- 点击"展示状态"的属性值表格使属性值变为编辑状态时自动聚焦输入框:

```vue
//属性值div点击事件
const toEdit = (row: AttrValue, $index: number) => {
    //将flag切换为true(如果没有则会追加此属性), 切换为编辑模式
    row.flag = true;
    //nextTick:响应式数据发生变化,获取更新的DOM(组件实例)
    nextTick(() => {
        inputArr.value[$index].focus();
    })

}
```

> 利用ref获取组件实例时需要使用nextTick()的情况: 当组件实例刚出现, 此时DOM还并未更新,组件实例的DOM并未挂载至DOM树, 此时获取组件实例值为undefined或null, nextTick()后DOM更新,就能获取到组件实例.
> undefined: const input = ref()
> null: const input = ref(null) 或者 组件挂载又卸载了

