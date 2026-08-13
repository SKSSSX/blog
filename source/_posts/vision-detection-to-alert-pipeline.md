---
title: 视觉检测如何接入告警闭环
subtitle: 从帧结果到可处理工单的事件化设计
categories:
  - Framework
tags:
  - AI
  - 计算机视觉
  - 消息队列
keywords: YOLO, 告警, 消息队列, 视觉检测
copyright: true
date: 2026-08-08 19:55:00
---

巡检场景里，模型打出「框和标签」只是起点；业务要的是 **可分派、可抑制、可追溯的告警**。与其把视觉服务直接耦合进业务库表，不如做成「检测事件 → 消息总线 → 告警服务」的闭环。

<!-- more -->

## 一、从检测结果到告警的鸿沟

| 模型输出 | 业务需要 |
|---|---|
| 框坐标 + 标签 + 置信度 | 谁的设备、什么时间、在哪、要不要处理 |
| 每帧都出 | 同一目标不要刷屏 |
| 无状态 | 要工单、要确认、要误报反馈 |

模型不懂「工单」，业务不该懂「bbox」。中间需要一层 **事件化**。

## 二、闭环图

{% mermaid %}
flowchart LR
  V[视频帧/图片] --> D[检测服务]
  D --> E[标准化 DetectionEvent]
  E --> Q[消息队列]
  Q --> A[告警服务]
  A --> DB[(告警单)]
  A --> N[通知/推送]
  A --> U[人工确认/误报]
  U --> A
{% endmermaid %}

> **读图：** 检测服务只产出标准化事件，经消息队列交给告警服务；人工确认/误报再回到告警侧，形成可运营闭环。

消息队列把模型世界和业务世界拆开：检测侧专注推理与事件 schema，告警侧专注抑制、分派和确认。两边可以独立扩缩容，也不会互相拖垮。

## 三、DetectionEvent 最小字段

{% mermaid %}
classDiagram
  class DetectionEvent {
    +String source
    +String deviceId
    +String taskId
    +Number frameTs
    +String label
    +Number score
    +BBox bbox
    +String model
    +String modelVersion
    +String traceId
  }
  class BBox {
    +Number x
    +Number y
    +Number w
    +Number h
    +String coordSystem
  }
  DetectionEvent --> BBox : 包含
{% endmermaid %}

- `source`：设备/任务/帧时间
- `label` / `score`
- `bbox`（坐标系约定写清）
- `model` / `version`
- `traceId`

业务侧负责：阈值、地理围栏、重复告警合并、升级策略——不要让模型服务理解「工单」。

## 四、检测服务内部流程

{% mermaid %}
sequenceDiagram
  participant V as 视频流
  participant D as 检测服务
  participant M as 模型
  participant Q as 消息队列
  V->>D: 帧
  D->>D: 预处理(缩放/归一化)
  D->>M: 推理
  M-->>D: detections
  D->>D: 后处理(NMS/过滤)
  D->>D: 包装 DetectionEvent
  D->>Q: 发布事件
{% endmermaid %}

## 五、Mock 与真权重

{% mermaid %}
flowchart TB
  A[开发期] --> B[Mock 检测器<br/>固定 bbox]
  B --> C[链路可测]
  D[预发] --> E[真权重模型]
  E --> F[事件 schema 不变]
  F --> G[前端/告警无感切换]
{% endmermaid %}

开发期用 mock 检测器保持链路可测；预发再挂真权重。**事件 schema 保持不变**，避免前端与告警服务被模型细节绑死。

## 六、告警服务内部处理

{% mermaid %}
flowchart TB
  E[DetectionEvent] --> R{重复检测?}
  R -->|是 同目标短时间| S[抑制]
  R -->|否| T[创建告警单]
  T --> G{围栏内?}
  G -->|否| D[丢弃]
  G -->|是| P[推送通知]
  P --> W[等待人工确认]
  W -->|确认| C[闭环]
  W -->|误报| F[反馈]
  F --> M[反哺规则/数据集]
{% endmermaid %}

## 七、抑制与确认策略

| 策略 | 作用 |
|---|---|
| 时间窗去重 | 同一目标短时间不刷屏 |
| 置信度门槛可配 | 不同场景不同阈值 |
| 人工误报反馈 | 反哺规则或微调数据集 |
| 围栏过滤 | 围栏外丢弃，减少噪声 |

实际落地时，抑制往往比「创建工单」更重要——否则每帧一个框会把告警中心打爆。下面这张决策图把常见分支收一下：

{% mermaid %}
flowchart TB
  E[DetectionEvent] --> S{score ≥ 阈值?}
  S -->|否| X[丢弃]
  S -->|是| D{同设备+同标签<br/>在时间窗内?}
  D -->|是| Y[抑制/合并计数]
  D -->|否| G{在地理围栏内?}
  G -->|否| X
  G -->|是| C[创建或升级告警单]
{% endmermaid %}

顺序建议固定：先阈值，再时间窗去重，再围栏。阈值过滤掉噪声；去重避免刷屏；围栏决定「要不要进业务视野」。确认与误报则走状态机，不要塞回检测服务。

## 八、告警状态机

{% mermaid %}
stateDiagram-v2
  [*] --> 待处理: 新告警
  待处理 --> 处理中: 分派
  处理中 --> 已确认: 人工确认
  处理中 --> 误报: 标记误报
  已确认 --> [*]
  误报 --> [*]
  待处理 --> 超时: 超时升级
  超时 --> 处理中: 重新分派
{% endmermaid %}

## 九、小结

视觉项目能上线，靠的往往不是更高的 mAP 宣传，而是 **检测结果是否事件化、告警是否可运营**。消息队列是模型世界和业务世界之间最清晰的防腐层。
