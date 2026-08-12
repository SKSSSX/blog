---
title: 一条 SSE 多 Topic 路由：告警、机库状态、语音与 TTS 如何分流
subtitle: 前端事件总线视角下的 SSE 设计
categories:
  - JavaScript
tags:
  - SSE
  - 前端架构
  - 实时推送
keywords: SSE, EventSource, Topic, 前端事件总线
copyright: true
date: 2025-08-17 20:50:00
top: false
---

很多文章讲 SSE，只讲「服务端怎么不缓冲」。但在复杂操控台里，SSE 到前端之后还有另一层问题：**一条连接里可能同时推告警、设备状态、语音助手、TTS 播放等多类事件，前端如何分流？**

本文从前端事件总线角度，整理一套多 Topic SSE 的设计方式。示例均已脱敏，不包含真实接口、设备编号和告警内容。

## 一、为什么要多 Topic

如果每类事件都开一条连接，会有几个问题：

- 浏览器连接数变多
- 鉴权和重连逻辑重复
- 页面切换时清理复杂
- 服务端推送通道难以统一治理

因此很多系统会选择：**一条 SSE 连接，多类 topic 分发**。

## 二、总体结构

```mermaid
flowchart LR
  S[SSE 连接] --> P[Topic Parser]
  P --> A[告警处理器]
  P --> B[设备/机库状态处理器]
  P --> C[语音助手处理器]
  P --> D[TTS 播放处理器]
  A --> UI1[告警弹窗/地图点位]
  B --> UI2[设备状态面板]
  C --> UI3[AI 助手]
  D --> UI4[AudioContext]
```

SSE 层只负责连接和解析，不要直接操作所有 UI，否则会变成上帝模块。

## 三、事件格式设计

推荐统一 envelope：

```json
{
  "topic": "alarm.created",
  "id": "evt-001",
  "ts": 1720000000000,
  "payload": {}
}
```

这样分发层只看 `topic`，业务处理器再看 `payload`。

## 四、连接层

```js
function createSseClient(url, handlers) {
  const source = new EventSource(url);

  source.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    dispatchTopic(msg, handlers);
  };

  source.onerror = () => {
    source.close();
    scheduleReconnect();
  };

  return source;
}
```

如果需要带自定义 Header，可以改成 `fetch + ReadableStream`，但连接层和分发层仍然保持一样的接口。

## 五、Topic 分发表

```js
const handlers = {
  'alarm.created': handleAlarmCreated,
  'device.status': handleDeviceStatus,
  'assistant.message': handleAssistantMessage,
  'tts.play': handleTtsPlay
};

function dispatchTopic(msg, handlers) {
  const handler = handlers[msg.topic];
  if (!handler) {
    console.warn('[sse] unknown topic', msg.topic);
    return;
  }
  handler(msg.payload, msg);
}
```

未知 topic 不应该让连接崩掉，只记录日志即可。

## 六、Topic 分流时序

```mermaid
sequenceDiagram
  participant S as SSE Server
  participant C as SSE Client
  participant D as Dispatcher
  participant A as Alarm Handler
  participant T as TTS Handler

  S-->>C: topic=alarm.created
  C->>D: dispatch
  D->>A: handleAlarmCreated
  A->>A: 地图落点 + 弹窗

  S-->>C: topic=tts.play
  C->>D: dispatch
  D->>T: handleTtsPlay
  T->>T: 解锁 AudioContext + 播放
```

## 七、不同 Topic 的处理边界

| Topic 类型 | 处理方式 |
|---|---|
| 告警 | 写入状态、地图落点、弹窗提示 |
| 设备状态 | 更新设备 Map，不弹窗 |
| AI 助手 | 写入对话流，支持打字机 |
| TTS | 进入音频队列，不走普通 UI 状态 |

如果所有 topic 都写进同一个 Vuex/Pinia 模块，会很快失控。更稳的做法是按领域拆处理器。

## 八、重连状态机

```mermaid
stateDiagram-v2
  [*] --> 连接中
  连接中 --> 在线: open
  在线 --> 断线: error
  断线 --> 等待重连
  等待重连 --> 连接中: timeout
  等待重连 --> 停止: 页面销毁
  在线 --> 停止: 主动关闭
```

重连时建议带上 `lastEventId` 或业务游标，防止告警漏掉。

## 九、音频类 Topic 的特殊处理

TTS 和普通文本不同，容易撞到浏览器自动播放限制。推荐流程：

```mermaid
flowchart TB
  A[收到 tts.play] --> B{AudioContext 已解锁?}
  B -->|否| C[等待用户交互解锁]
  B -->|是| D[加入播放队列]
  C --> D
  D --> E[按顺序播放 PCM/音频块]
  E --> F[播放完成清理缓存]
```

音频播放不要直接在 SSE 回调里堆 `new Audio()`，否则多段语音会互相抢。

## 十、小结

多 Topic SSE 的重点不是「能收到消息」，而是：**连接层、分发层、业务处理层分开**。

- 连接层：负责打开、关闭、重连
- 分发层：负责 topic 到 handler
- 处理层：负责各自业务副作用

这样即使后续新增告警、TTS、AI 助手或设备状态，也不会把 SSE 客户端写成一团。
