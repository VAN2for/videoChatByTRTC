<script setup lang="ts">
import {  onMounted } from "vue";
// import { io, Socket } from "socket.io-client";
import TRTC from "trtc-sdk-v5";
import { genTestUserSig } from "./debug/GenerateTestUserSig-es";


const sdkAppId=20009280;
const userId=`user_${Math.floor(Math.random() * 100000000)}`;
const sdkSecretKey='304be4b653f1d54a6ab7199bb6d8b3ca7ccc4e4f488154492d8bb9934ec7c898';
let userSig:any;

const trtc=TRTC.create();

onMounted(() => {
  userSig=genTestUserSig({sdkAppId,userId,sdkSecretKey}).userSig
  interface Parameter {
  userId: string;
  streamType: any;
  }
  trtc.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, ({ userId, streamType }:Parameter) => {
  // To play the video image, you need to place an HTMLElement in the DOM, 
  // which can be a div tag, assuming its id is `${userId}_${streamType}`
  // const view = `${userId}_${streamType}`;
  const view=document.getElementById('remotevideo')
  trtc.startRemoteVideo({ userId, streamType, view });
  });
});

// 获取本地音视频流
// const getLocalStream = async () => {
//   // 获取音视频流
//   const stream = await navigator.mediaDevices.getUserMedia({
//     video: true,
//     audio: true,
//   });
//   // 将媒体流设置到 video 标签上播放
//   localVideo.value!.srcObject = stream;
//   // 播放音视频流
//   localVideo.value!.play();
//   // 存储本地流
//   localStream.value = stream;

//   return stream;
// };

// 挂断视频
const hangUp = async() => {
  await trtc.exitRoom(); 
  // trtc.destroy();
};
/* eslint-disable */


const enterRoom = async () => {
  try {
    await trtc.enterRoom({ sdkAppId, userId, userSig, roomId: 8888 });
    console.log("enter room successfully");
  } catch (error) {
    console.error("failed to enter room " + error);
  }
};

async function  startAudio() {
  await trtc.startLocalAudio();
}
const startVideo = async () => {
  // To preview the camera image, you need to place an HTMLElement in the DOM, 
// which can be a div tag, assuming its id is local-video.

  const view = document.getElementById('localvideo');
  await trtc.startLocalVideo({ view });




};
// 状态重置

</script>

<template>
  <div class="flex items-center flex-col text-center p-12 h-screen">
    <div class="relative h-full mb-4">
      <div
        ref="localVideo"
        class="w-96 h-full bg-gray-200 mb-4 object-cover"
        id="localvideo"
      ></div>
      <div
        ref="remoteVideo"
        class="w-32 h-48 absolute bottom-0 right-0 object-cover"
        id="remotevideo"
      ></div>
    </div> 
    <div class="flex gap-2 mb-4">
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
        @click="hangUp"
      >
        挂断视频
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>