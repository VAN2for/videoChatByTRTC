<template>
    <div class="topClass">

    <div class="container">
        <div class="messageList text-center ">
            <div v-for="(item ,index) in textList" :key="index"   :class="{mine:item.from==userId,theirs:item.from!=userId} " >
                
                <div v-if="item.from==userId" class="wholeitem" >
                    {{ item.from }}
                    <div class="messageitem">
                        {{ item.value }}
                    </div>
                </div>
                <div v-else class="wholeitem">
                    {{ item.from }}
                    <div class="messageitem">
                        {{ item.value }}
                    </div>
                </div>
            </div>
        </div>
        <div class="inputbox">
            <el-input v-model="inputText" style="width: 240px" placeholder="Please input" />
            <el-button type="primary" round @click="handleSendText">发送</el-button>
        </div>
    </div>
  </div>

</template>

<script setup lang="ts" name="Chat">
// 如果您已集成 v2.x 的 SDK，想升级到 V3 并且想尽可能地少改动项目代码，可以继续沿用 TIM
// import TIM from '@tencentcloud/chat';
import TencentCloudChat from '@tencentcloud/chat';
import TIMUploadPlugin from 'tim-upload-plugin';
import { onMounted, reactive, ref } from 'vue';
import { ElMessage } from "element-plus";
import { useRoute } from 'vue-router';
import { genTestUserSig } from "../debug/GenerateTestUserSig-es";
// const userId=`user_${Math.floor(Math.random() * 100000000)}`;
const route = useRoute();
const userId=String(route.query.userId);
let roomId = String(route.query.roomId);

let inputText=ref("")
let textList=reactive<{ from: string; value: string }[]>([
   
])


let sdkAppId=1600085063
console.log(sdkAppId+"这是sdkAppId")
let sdkSecretKey='e7de5690dea59142e08f481af44f6573b5f1f551a58f91bd71cb2a9269a649f6'
let options = {
    SDKAppID: sdkAppId // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
};
// 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
let chat = TencentCloudChat.create(options); // SDK 实例通常用 chat 表示


chat.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用

// 注册腾讯云即时通信 IM 上传插件
chat.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin });

//登录
let promise = chat.login({userID: userId, userSig: genTestUserSig({sdkAppId,userId,sdkSecretKey}).userSig});
promise.then(function(imResponse) {
  console.log(imResponse.data); // 登录成功
  if (imResponse.data.repeatLogin === true) {
    // 标识账号已登录，本次登录操作为重复登录。
    console.log(imResponse.data.errorInfo);
  }
}).catch(function(imError) {
  console.warn('login error:', imError); // 登录失败的相关信息
});

chat.on(TencentCloudChat.EVENT.SDK_READY, ()=>{alert("chat准备好了")});
chat.on(TencentCloudChat.EVENT.SDK_NOT_READY, ()=>{alert("chat没准备好")});
onMounted(()=>{
    
})

//发送信息
function handleSendText() {

    let message = chat.createTextMessage({
        to: roomId,
        conversationType: TencentCloudChat.TYPES.CONV_C2C,
        payload: {
            text: inputText.value,
            from:userId
        },
    });
    // 发送消息
    let promise = chat.sendMessage(message);
    promise.then(function (imResponse) {
        // 发送成功
        console.log(imResponse+1600085063)
        ElMessage.success(`发送成功，消息为："${inputText.value}"`);
        textList.push({
            from: userId,
            value: inputText.value,
        });
        inputText.value=''
    }).catch(function (imError) {
        // 发送失败
        console.warn('sendMessage error:', imError);
    });
}

function onMessageReceived(event:any) {
      // console.log(event.data);
      event.data.forEach((msg:any) => {
        if (msg.type !== TencentCloudChat.TYPES.MSG_TEXT) return;
        textList.push({
          from: msg.from,
          value: msg.payload.text,
        });

      });
      console.log(textList);
    }
    chat.on(TencentCloudChat.EVENT.MESSAGE_RECEIVED, onMessageReceived);
</script>

<style>
.topClass{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
}
.container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-top: 5rem;
    width: auto;
    /* position:absolute; */
    /* left: 50%;
    top: 50%;
    transform: translateX(-50% -50%); */
    /* left: 50%;
      transform: translateX(-50%); */
    /* width: 100vw;
    height: 80vh; */
}
.messageList {
    background-color: rgb(229 231 235);
    width: 24rem;
    height: 40rem;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}

.inputbox {
    margin-top: 1rem;
    width: 24rem;
    display: flex;
    justify-content: space-between;
}
.messageitem{
    border: solid 1px rgb(74, 83, 100);
    background-color: antiquewhite;
    border-radius: 5px;
    box-shadow: antiquewhite;
    font-size: large;
   
}
.wholeitem {
    margin:0.2rem 0.5rem;
    
    display: flex;
    flex-direction: column;
    font-size: smaller;
    display: inline-block; /* 设置为 inline-block 使 div 根据内容自动调整宽度 */
    width: auto; /* 设置宽度为 auto 以根据内容自动调整大小 */
    min-width: 100px; /* 设置最小宽度，可以根据需要调整 */
}
.mine{
    /* align-self: flex-end; */
    display: flex;
    justify-content:end;
}
.theirs {
    display: flex;
    justify-content:start;
}
</style>