<template>
  <div>
    <button @click="addElement">添加元素</button>
    <button @click="removeElement">删除元素</button>
    <ul>
      <li v-for="(item, index) in elements" :key="index">{{ item }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      elements: ['初始元素 1', '初始元素 2']
    };
  },
  methods: {
    addElement() {
      this.elements.push('新添加元素');
    },
    removeElement() {
      this.elements.pop();
    }
  }
};
</script>