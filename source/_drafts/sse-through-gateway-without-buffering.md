---
title: 一条 SSE 如何穿过多层网关还不卡顿
subtitle: Nginx、API Gateway、BFF 到业务服务的流式透传要点
categories:
  - NodeJS
tags:
  - SSE
  - Gateway
  - 架构
keywords: SSE, Nginx, 网关, 流式, 不缓冲
copyright: true
date: 2026-07-06 21:20:00
top: false
---

AI 对话、告警推送、长任务进度……这些场景常用 SSE。链路一旦变成「浏览器 → Nginx → Gateway → BFF → 业务服务」，任何一层默认缓冲都会让「流式」变成「最后一次性吐出」。本文总结如何把 SSE **真的流起来**。

## 一、SSE 的基本帧格式

SSE 是单向长连接，服务端按帧推送：

```text
event: token
data: {"text":"你"}

event: token
data: {"text":"好"}

event: done
data: [DONE]
```

每帧之间空行分隔。浏览器端 `EventSource` 或 `fetch + ReadableStream` 都能逐帧解析。

## 二、典型链路

```mermaid
sequenceDiagram
  participant B as Browser
  participant N as Nginx
  participant G as API Gateway
  participant F as BFF
  participant S as Service
  B->>N: GET /api/stream (Accept text/event-stream)
  N->>G: proxy_pass
  G->>F: 转发
  F->>S: 上游 SSE/内部流
  S-->>F: chunk
  F-->>G: chunk
  G-->>N: chunk
  N-->>B: chunk
  Note over N,G: 任一层 buffering 都会攒成包
```

## 三、缓冲问题定位

```mermaid
flowchart TB
  S[症状: 等很久突然全出来] --> R{逐层排查}
  R --> N1[Nginx proxy_buffering?]
  R --> G1[Gateway 是否 await 完整响应?]
  R --> F1[BFF 是否 pipe/流式?]
  R --> P1[公司代理/HTTPS中间盒?]
  N1 -->|开| Fix1[proxy_buffering off]
  G1 -->|是| Fix2[改为流式转发]
  F1 -->|否| Fix3[用 ReadableStream pipe]
  P1 -->|是| Fix4[绕过或加心跳]
```

## 四、各层配置要点

### Nginx

```nginx
location /api/stream {
  proxy_buffering off;
  proxy_cache off;
  proxy_http_version 1.1;
  proxy_set_header Connection "";
  chunked_transfer_encoding on;
  proxy_read_timeout 300s;  # 大于心跳间隔
}
```

### Gateway（Spring Cloud Gateway 示意）

```mermaid
flowchart LR
  A[请求进入] --> B{是否 SSE?}
  B -->|是| C[流式转发 不缓冲 body]
  B -->|否| D[正常路由]
  C --> E[保持连接 透传 chunk]
```

关键：不要把上游 `body` 读成完整 `String` 再转发，要用响应式/流式 API 透传。

### BFF（NestJS 示意）

```ts
@Sse('/stream')
async stream(): Promise<Observable<MessageEvent>> {
  return this.aiService.analyze().pipe(
    map(chunk => ({ event: 'token', data: chunk }))
  );
}
```

不要 `await` 上游成完整字符串再 `res.send`，用 pipe / streaming response。

### 浏览器

```js
// fetch 流式读，便于带 Authorization
const res = await fetch('/api/stream', {
  headers: { Authorization: `Bearer ${token}` }
});
const reader = res.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const text = decoder.decode(value);
  // 逐帧解析
  for (const line of text.split('\n\n')) {
    handleFrame(line);
  }
}
```

## 五、心跳保活

长时间无数据的连接会被中间设备断掉。服务端定时发注释行（不触发事件）：

```text
: keep-alive

: keep-alive
```

浏览器 `EventSource` 会忽略注释行，但连接保持活跃。间隔建议 15-30 秒。

## 六、鉴权怎么带

```mermaid
flowchart TB
  A[SSE 鉴权] --> B{方案选择}
  B --> C[短时 ticket 放 query<br/>一次性 短TTL]
  B --> D[fetch 流式读<br/>带 Authorization Header]
  C --> E[服务端校验后销毁 ticket]
  D --> F[标准 Bearer Token]
```

不要把长期 Refresh Token 塞进 URL——日志、浏览器历史都会留痕。

## 七、断线重连

```mermaid
stateDiagram-v2
  [*] --> 已连接
  已连接 --> 断开: 网络抖动/超时
  断开 --> 重连中: 自动重连
  重连中 --> 已连接: 成功(带 Last-Event-ID)
  重连中 --> 重连中: 失败(指数退避)
  已连接 --> [*]: 主动关闭
```

- `EventSource` 原生支持 `Last-Event-ID`，服务端可据此续传
- `fetch` 方案需自己维护游标，断线后带上 `cursor` 参数

## 八、排障口诀

| 症状 | 优先怀疑 |
|---|---|
| 等很久突然全出来 | 某层 buffering |
| 一分钟断 | 空闲超时 / 无心跳 |
| 只自己环境不行 | 公司代理或 HTTPS 中间盒 |
| 多实例偶发丢 | Sticky / 连接打到不同副本 |
| 前几帧正常后面断 | 响应被提前 close |

## 九、小结

SSE「卡顿」多半不是业务模型慢，而是 **代理把流攒成了包**。从最外层 Nginx 往内逐层确认「不缓冲、可心跳、超时匹配」，通常就能恢复逐 token/逐事件的体验。
