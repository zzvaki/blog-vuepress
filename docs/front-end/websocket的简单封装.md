---
title: websocket的简单封装
date: 2021-09-15 10:48:41
tags: 
- websocket 
- 组件封装
---

# websocket的简单封装

分享一下自己封装的一个websocket，可以实现在页面全局监听后端的更行推送通知，收到通知后执行涉及相关接口的方法。

## 主要逻辑

1. 在app.vue创建ws实例，接收数据后存入vuex。
2. 在需要实时更新数据的页面/组件创建监听，触发更新后执行相关代码。

## 上代码

websocket.js，创建ws实例。
``` js
import { isJson } from '@/libs/common';
import store from '@/store';
import moment from 'moment';
const { wsUrl = '' } = window.configOut || {};
// ws实时通讯

class WebSocketClass {
  constructor(ywUrl, callback) {
    this.ywUrl = ywUrl;
    this.callback = callback;
    this.instance = null; // ws实例
    this.HeartbeatTimer = null; // 心跳计时器
    this.HeartbeatTimestamp = null; // 心跳时间戳
    this.HeartbeatTimeout = 9 * 1000; // 心跳超时(毫秒)
    this.isConnected = false; // 是否已链接
    this.isReconnecting = false; // 是否正在建立连接

    // 建立连接
    this.connect();
    // 开始心跳
    this.startHeartbeat();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new WebSocketClass();
    }
    return this.instance;
  }

  connect() {
    // this.HeartbeatTimestamp = new Date().valueOf();
    const timeStamp = moment().format('-YYMMDDHHmmss');
    // 生成随机数标识websocket连接
    const url = wsUrl + '/websocket/' + this.ywUrl + timeStamp;
    this.ws = new WebSocket(url);
    this.ws.onopen = e => {
      // this.status = 'open';
      console.log('ws 连接成功', this.ws);
      this.isConnected = true;
      this.isReconnecting = false;
    };
    this.ws.onerror = () => {
      console.log('ws onerror');
      this.isConnected = false;
      this.isReconnecting = false;
    };

    this.ws.onclose = () => {
      console.log('ws onclose');
      this.isConnected = false;
      this.isReconnecting = false;
    };
  }
  startHeartbeat() {
    // console.log('startHeartbeat()');
    this.HeartbeatTimestamp = new Date().valueOf();
    if (this.HeartbeatTimer) {
      this.ws.close();
      clearInterval(this.HeartbeatTimer);
    }
    this.HeartbeatTimer = setInterval(() => {
      // 心跳没有回应时，断开连接。
      const currentTimestamp = new Date().valueOf();
      if (currentTimestamp - this.HeartbeatTimestamp > this.HeartbeatTimeout * 2 + 1000) {
        // ping超时，断开链接
        console.log('ws ping超时，主动断开链接');
        this.isConnected = false;
        this.close();
      }

      if (this.isConnected) {
        // 心跳
        // console.log('ws ping');
        this.getMessage('ping', res => {
          if (res === 'pang') {
            this.HeartbeatTimestamp = new Date().valueOf();
          }
        });
      } else {
        if (!this.isReconnecting) {
          this.isReconnecting = true;
          this.HeartbeatTimestamp = new Date().valueOf();
          console.log('ws 重新建立连接');
          // 重新建立连接
          this.connect();
        }
      }
    }, this.HeartbeatTimeout);
  }

  getMessage(params = '', callback = () => {}) {
    this.ws.onmessage = evt => {
      const data = evt.data;
      if (isJson(data)) {
        const dataObj = JSON.parse(data);
        console.log('ws JSON数据已接收', dataObj);
        store.commit('SET_UPDATE_API', {
          api: dataObj.api.split(','),
          data: dataObj.data,
          time: new Date().valueOf(),
        });
        callback(dataObj);
      } else if (data === 'pang') {
        console.log('ws', data);
        callback(data);
      } else {
        console.log('ws 数据已接收', data);
        callback(data);
      }
    };
    if (typeof params === 'object') {
      params = JSON.stringify(params);
    }
    if (this.ws.readyState === 1) {
      this.ws.send(params);
    }
    // try {
    //   this.ws.send(params);
    // } catch (error) {
    //   console.log('ws 断线重连...', error);
    //   this.connect();
    // }
    // if (this.status === 'open') {
    //   this.ws.send(params);
    // } else {
    //   setTimeout(() => {
    //     this.getMessage(...arguments);
    //   }, 100);
    // }
  }

  close() {
    if (this.ws.readyState === 1) {
      this.ws.send('close');
    }
    this.ws.close();
    console.log('ws close');
  }
}

export default WebSocketClass;
```

## 状态管理

在store保存中的状态管理，用于识别/确定ws推送更新

``` js
const app:{
  state:{

    // 需要被更新的接口请求
    updateApi: '',
    updateData: undefined,
    updateTime: undefined,
  },
  mutations:{
    SET_UPDATE_API(state, { api, time, data }) {
      state.updateApi = api;
      state.updateTime = time;
      state.updateData = data;
    },
  }
}
```

## 全局监听

这里watch了一下用户信息，用于在建立ws连接时留给后端的用户标识。

app.vue
``` js
  created() {
    this.$watch(
      () => {
        const myDeptCode =
          this.$store.getters.userInfo &&
          this.$store.getters.userInfo.dept &&
          this.$store.getters.userInfo.dept.deptCode;
        const myIdCard = this.$store.getters.userInfo && this.$store.getters.userInfo.idCard;
        if (myDeptCode && myIdCard) {
          return `${myDeptCode}-${myIdCard}`;
        } else {
          return '';
        }
      },
      val => {
        // console.log('watch:wsMark', val);
        if (window.ws) {
          window.ws.close();
          window.ws = null;
        }
        if (val) {
          if (!window.ws) {
            window.ws = new WebSocketClass(val);
          }
        }
      },
      {
        immediate: true,
      }
    );
  },
```