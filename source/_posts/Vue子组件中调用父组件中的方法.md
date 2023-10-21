---
title: Vue子组件中调用父组件中的方法
cover: >-
  https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/u%3D702715071%2C3690882623%26fm%3D253%26fmt%3Dauto%26app%3D138%26f%3DJPEG
top_img: https://bu.dusays.com/2022/09/01/63103a65e883d.webp
keywords: 'Vue,前端,组件'
categories:
  - 前端开发
tags:
  - Vue
  - 前端
  - 组件
abbrlink: aec1e412
date: 2023-08-12 17:59:05
---

{% note simple %}在Vue中，子组件可以通过事件(Event)机制与父组件进行通信，从而调用父组件中的方法。以下是一种常见的方法：{% endnote %}



## 1 在父组件中定义方法

- 首先，在父组件中定义一个方法

```vue
<template>
  <div>
    <button @click="callParentMethod">调用父组件方法</button>
    <child-component @custom-event="handleCustomEvent"></child-component>
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue';

export default {
  components: {
    ChildComponent
  },
  methods: {
    callParentMethod() {
      console.log('父组件的方法被调用');
    },
    handleCustomEvent(payload) {
      console.log('自定义事件在父组件被触发，数据：', payload);
    }
  }
};
</script>
```



## 2 在子组件中触发事件

- 在子组件中，通过`$emit`方法触发一个自定义事件，从而与父组件通信

```vue
<template>
  <div>
    <button @click="callParentMethod">调用父组件方法</button>
  </div>
</template>

<script>
export default {
  methods: {
    callParentMethod() {
      this.$emit('custom-event', { data: '来自子组件的数据' });
    }
  }
};
</script>
```

- 在这个例子中，当子组件中的按钮被点击时，`callParentMethod`方法会调用`this.$emit('custom-event', ...)`，触发一个名为`custom-event`的自定义事件，并传递一个数据对象作为参数。



## 3 在父组件中监听事件

- 在父组件的模板中使用`@custom-event`来监听子组件发出的事件，并在相应的处理方法中调用父组件的方法

- 通过这种方式，子组件就能够调用父组件中的方法，实现了子组件与父组件之间的通信。记住，事件名`custom-event`应该在父组件中监听和子组件中触发时保持一致。









