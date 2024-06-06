<script setup lang="ts" name="VideoChat">
import {  nextTick, onMounted , ref} from "vue";
// import { io, Socket } from "socket.io-client";
import TRTC from "trtc-sdk-v5";
import { genTestUserSig } from "../debug/GenerateTestUserSig-es";
import { useRoute } from 'vue-router';

const route = useRoute();
const roomIdT = Number(route.query.roomId);

const sdkAppId=20009280;
const userId=String(route.query.userId);
const sdkSecretKey='304be4b653f1d54a6ab7199bb6d8b3ca7ccc4e4f488154492d8bb9934ec7c898';
let userSig:any;
let remoteUsersViews=ref<string[]>([])
const trtc=TRTC.create();

onMounted(() => {
  alert(`房间号为${roomIdT}`)
  userSig=genTestUserSig({sdkAppId,userId,sdkSecretKey}).userSig
  trtc.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, async ({ userId, streamType }) => {
  // To play the video image, you need to place an HTMLElement in the DOM, 
  // which can be a div tag, assuming its id is `${userId}_${streamType}`
  // const view = `${userId}_${streamType}`;
  if(streamType==TRTC.TYPE.STREAM_TYPE_MAIN){
    // const view=`${userId}_main`
    if(!remoteUsersViews.value.includes(userId)){//如果远端不存在该用户名，那么远端需要加入数组以渲染
       remoteUsersViews.value.push(`${userId}`)
    }
    await nextTick();
    await trtc.startRemoteVideo({ userId, streamType, view:`${userId}` });
    for(let i of remoteUsersViews.value){
    console.log(i,"1111111111")

    }
  }
  });

  trtc.on(TRTC.EVENT.REMOTE_VIDEO_UNAVAILABLE, handleRemoteVideoUnavailable);
  function handleRemoteVideoUnavailable(event: any) {
  const { streamType } = event;
  trtc.stopRemoteVideo({ userId: event.userId, streamType });
  if (streamType === TRTC.TYPE.STREAM_TYPE_MAIN) {
    remoteUsersViews.value = remoteUsersViews.value.filter((userId: string) => userId !== `${event.userId}`);
    console.log("11111"+remoteUsersViews)
  } 
  }

});



// 挂断视频
const hangUp = async() => {
  await trtc.stopLocalVideo();
  await trtc.exitRoom(); 
  // trtc.destroy();
  // trtc.destroy();
  // trtc = null;
};
/* eslint-disable */


const enterRoom = async () => {
  try {
    await trtc.enterRoom({ sdkAppId, userId, userSig, roomId: roomIdT });
    // alert(`roomId:${roomIdT}`)
    console.log("enter room successfully");
  } catch (error) {
    console.error("failed to enter room " + error);
  }
};

async function  startAudio() {
  await trtc.startLocalAudio();
}

async function stopAudio() {
    await trtc.stopLocalAudio();
}


const startVideo = async () => {
  // To preview the camera image, you need to place an HTMLElement in the DOM, 
// which can be a div tag, assuming its id is local-video.

  const view = document.getElementById('localvideo');
  await trtc.startLocalVideo({ view });

};

async function stopVideo(){
    await trtc.stopLocalVideo()
}
// 状态重置

</script>

<template>
  <div class="flex items-center flex-col text-center p-12 h-screen">
    <div class="container1 h-full mb-4">
      <div
        ref="localVideo"
        class="w-96 h-full bg-gray-200 mb-4 object-cover"
        id="localvideo"
      >{{userId}}</div>
      <template v-for='userId in remoteUsersViews' :key='userId' >
      <!-- <div class='remote' :id='userId'></div> -->

      <div v-if="remoteUsersViews.includes(userId)"
        class="w-96 h-full bg-gray-200 mb-4 object-cover"
        :id="userId"
      >{{userId}}  在线：{{ remoteUsersViews.includes(userId) }}</div>
      </template>
    <!-- </template> -->

    </div> 
    <div class="flex gap-3 mb-1 mt-3">
      <button
        class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
        @click="enterRoom"
      >
        进入房间
      </button>
      <button
        class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
        @click="startAudio"
      >
        打开麦克风
      </button>
      <button
        class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
        @click="startVideo"
      >
        打开摄像头
      </button>
      <button
        class="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white"
        @click="stopAudio"
      >
        关闭麦克风
      </button>
      <button
        class="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white"
        @click="stopVideo"
      >
        关闭摄像头
      </button>
      <button
        class="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white"
        @click="hangUp"
      >
        挂断视频
      </button>
    </div>
  </div>
</template>

<style scoped>
.container1{
  width: 100%;
  display:flex;
  justify-content:space-evenly;
}
</style>