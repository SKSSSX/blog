---
title: 应急无人机三维操控台：前端技术选型笔记
subtitle: 地图、实时、媒体与工程化的取舍
categories:
  - JavaScript
tags:
  - Cesium
  - 架构
  - 前端选型
keywords: 应急, 无人机, Cesium, 前端架构
copyright: true
date: 2024-09-15 14:00:00
top: false
---

做应急或巡检类「三维操控台」时，前端选型会被四件事同时拉扯：**地图表现、实时性、视频能力、工程可维护性**。本文用脱敏后的经验，整理一版可讨论的选型笔记，便于同类项目开题。

## 一、能力地图

```mermaid
mindmap
  root((三维操控台前端))
    态势
      三维地球
      标绘
      航迹
    实时
      设备状态
      告警推送
      语音控制
    媒体
      多路视频
      分享页
    工程
      拆包
      多环境配置
      组件库
```

## 二、关键取舍

| 领域 | 常见选择 | 取舍说明 |
|---|---|---|
| 三维 | Cesium | 生态成熟；体积与首屏要用拆包换 |
| 框架 | Vue 2/3 均可 | 老项目保稳；新项目优先 Vue3+TS |
| 实时 | WS / MQTT over WS / SSE | 遥测与告警通道分离，避免一根绳子吊死 |
| 视频 | WebRTC + FLV 备份 | 低延迟与兼容性折中 |
| UI | 元件库 + 少量自研 | 地图主屏少用「后台表格思维」堆控件 |

## 三、架构建议

```mermaid
flowchart TB
  Entry[主入口] --> Mobile{移动端?}
  Mobile -->|是| M[移动端入口]
  Mobile -->|否| PC[PC 主入口]
  PC --> Main[主屏单页]
  Main --> Mod1[态势模块]
  Main --> Mod2[实时模块]
  Main --> Mod3[视频模块]
  Main --> Mod4[标绘模块]
  Main --> Mod5[告警模块]
  Share[分享/直播独立入口] --> ShareMod[独立模块]
```

1. **主屏单页 + 模块开关**，而不是把飞控拆成几十个路由页
2. **地图工具库与业务组件分层**（航线、禁飞区、告警落点可测）
3. **分享/直播页独立入口**，减少权限与包体耦合
4. **配置外置**（行业/环境），代码仓库避免写死客户差异

## 四、实时通道分层

```mermaid
flowchart LR
  subgraph 设备通道
    DEV[设备] --> MQTT[MQTT over WS]
    MQTT --> BUS[消息总线]
  end
  subgraph 告警通道
    SSE[SSE] --> BUS
  end
  subgraph 控制通道
    WS[WebSocket] --> BUS
  end
  BUS --> Main[主屏状态管理]
  Main --> Cesium[Cesium 渲染]
```

为什么分三条而不是一条：每条的可靠性要求、重连策略、消息频率都不同，混在一起一条断了全断。

## 五、视频能力分层

```mermaid
flowchart TB
  V[视频需求] --> W[WebRTC 低延迟]
  V --> F[FLV 兼容备份]
  V --> S[分享页独立信令]
  W --> A[播放器壳 + 适配器]
  F --> A
  S --> A
  A --> UI[统一 UI]
```

## 六、工程化分层

```mermaid
flowchart TB
  A[构建] --> B[splitChunks 拆包]
  B --> C[Cesium 独立 chunk]
  B --> D[媒体独立 chunk]
  A --> E[多环境配置外置]
  E --> F[config/index-{env}.js]
  F --> G[拷到 public/config]
  A --> H[私有组件库联调]
  H --> I[alias 到本地 monorepo]
```

## 七、不建议的做法

- 首屏同步加载三维、播放器、图表全家桶
- 在 URL 长期携带令牌
- 标绘与设备树全量 DOM 渲染
- 把客户定制直接 fork 主干却不回流配置化

## 八、选型决策流程

```mermaid
flowchart TB
  Q[需求: 三维操控台] --> A{团队规模}
  A -->|小团队| B[Vue + Cesium + 单体]
  A -->|大团队| C[Vue3 + TS + Monorepo]
  B --> D{实时要求}
  C --> D
  D -->|高| E[三通道分离]
  D -->|低| F[单 WS 够用]
  E --> G[视频: WebRTC+FLV]
  F --> H[视频: FLV 够用]
  G --> I[工程: 拆包+配置外置]
  H --> I
```

## 九、小结

操控台前端的胜负手，往往不在「用了哪个炫技库」，而在 **通道是否清晰、重模块是否懒加载、客户差异是否配置化**。选型时先画能力地图，再决定框架版本，不容易被单点技术偏好带跑。
