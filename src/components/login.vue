<template>
  <div class="parent">
    <h1 style="font-weight: 700; font-family:Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;  font-style: italic; font-size: larger;" >欢迎来到通信小屋</h1>
    <div class=" containerlogin  gap-4 mb-4">
      <el-form  label-width="auto" style="max-width: 600px">
    <el-form-item label="用户名">
           <el-input
         v-model="inputuserId"
         style="width: 240px"
         placeholder="初始化你的用户名"
         clearable
         />
    </el-form-item>

    <el-form-item label="房间号或用户名">
           <el-input
         v-model="inputroomId"
         style="width: 240px"
         placeholder="创建数字房间号或会话用户名"
         clearable
         />
    </el-form-item>
  </el-form>



</div>
<div style="text-align: center;">
  <button class="rounded-md  px-4 py-2 text-sm font-semibold text-white mr-5 "  
        :style="{ backgroundColor:(!inputuserId ||!inputroomId)?'gray' :'indigo' }" @click="handleClick">
        文字聊天
  <RouterLink 
    :to="{ 
      path: '/videoChatByTRTC/Chat', 
      query: { 
        roomId: inputroomId,
        userId:inputuserId
      } 
    }" 
    class="button"
    v-if="inputuserId &&inputroomId"
    >
    进入房间
    
  </RouterLink>
</button>
<button class="rounded-md  px-4 py-2 text-sm font-semibold text-white" 
        :style="{ backgroundColor:(!inputuserId ||!inputroomId)? 'gray' :'indigo'  }" @click="handleClick">
        视频
  <RouterLink 
    :to="{ 
      path: '/videoChatByTRTC/VideoChat', 
      query: { 
        roomId: inputroomId,
        userId:inputuserId
      } 
    }" 
    class="button"
    v-if="inputuserId &&inputroomId">
    进入房间

    
  </RouterLink>
</button>

</div>
  </div>

</template>
  
<script setup lang="ts" name="login">
    import { ref } from 'vue'
    import { RouterLink } from 'vue-router';

  const inputuserId = ref('')
  const inputroomId=ref('')
  function handleClick(){
    console.log(`${inputroomId.value}` + `${inputuserId.value}`)
    console.log(!(!inputuserId ||!inputroomId))
  }
</script>

<style>
.containerlogin {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 5rem;
}
.parent{
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  border: 0.3rem solid rgb(87, 62, 114);
  border-radius: 5px;
  padding: 2rem;
}

</style>