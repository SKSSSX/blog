---
title: Cesium 实时飞行：把遥测画成「活的」无人机
subtitle: 从消息通道到三维实体的前端实践
categories:
  - JavaScript
tags:
  - Cesium
  - WebSocket
  - IoT
keywords: Cesium, 遥测, 无人机, 实时
copyright: true
date: 2026-06-08 21:30:00
---

巡检或应急三维控制台里，「飞机在不在动」往往比静态模型更抓人。本文基于一类 **Vue + Cesium + 实时通道** 的实践，梳理如何把设备遥测稳定画成「活的」飞行实体。厂商协议字段、内网地址等已脱敏，只保留可复用的设计思路。

<!-- more -->

## 一、为什么「动起来」很难

很多人以为「实时显示位置」就是 `setInterval` 拉坐标再 `entity.position = ...`。演示能跑，上生产会撞上四类问题：

1. **消息抖动**：遥测不是匀速到达，1 秒 30 条、下一秒 0 条，画面会顿挫
2. **切页失真**：标签页后台时 `setInterval` 被节流，回到前台位置「跳一大段」
3. **多机同屏**：几十架飞机各自高频更新，主线程被回调淹没
4. **弱网重连**：断线恢复后历史点要不要补、怎么补

关键不是「收到消息就画」，而是「**把消息喂进时间轴，让 Cesium 时钟驱动插值**」。

## 二、总体链路

{% mermaid %}
flowchart LR
  A[设备/模拟器] --> B[消息中间件<br/>MQTT/AMQP]
  B --> C[业务服务<br/>落库 + 缓存最新点]
  C --> D[实时推送层<br/>Socket.IO/SSE]
  D --> E[前端订阅]
  E --> F[归一化为 Pose]
  F --> G{有界缓冲?}
  G -->|否| H[丢弃/打点]
  G -->|是| I[SampledPositionProperty]
  I --> J[Cesium Entity<br/>位置+姿态+轨迹]
{% endmermaid %}

> **读图：** 上游协议可以换，前端只吃统一 Pose，再经有界缓冲写入 SampledPosition，由 Entity 渲染位置、姿态和轨迹。

前端不必关心上游是 MQTT 还是 AMQP，只要约定一种 **Pose DTO**。换协议只动推送层，三维渲染层零改动。

## 三、Pose 归一化：统一数据入口

不同设备、不同协议字段名各异。把收敛逻辑集中在一个函数，避免组件里散落 `if (protocol === ...)`。

```js
// 把任意通道报文收敛成统一 Pose
function normalizePose(msg) {
  const lon = Number(msg.longitude ?? msg.lon ?? msg.lng);
  const lat = Number(msg.latitude ?? msg.lat);
  if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;

  return {
    id: String(msg.deviceId ?? msg.id),
    lon,
    lat,
    alt: Number(msg.altitude ?? msg.alt ?? 0),
    heading: Number(msg.heading ?? msg.yaw ?? 0),
    pitch: Number(msg.pitch ?? 0),
    roll: Number(msg.roll ?? 0),
    ts: Number(msg.timestamp ?? msg.ts ?? Date.now())
  };
}
```

**关键纪律**：

- 非法坐标直接返回 `null`，调用方丢弃并打点「坏包率」——比 silent fail 好排查
- 时间戳优先用设备时间，没有才退回 `Date.now()`，避免服务端转发延迟污染时间轴
- `id` 统一字符串化，防止数字 ID 和字符串 ID 被当成两个实体

## 四、用时钟驱动，而不是 setInterval

这是整篇文章最核心的一步。

### 4.1 两种方案对比

{% mermaid %}
flowchart TB
  subgraph bad [❌ setInterval 方案]
    B1[消息到达] --> B2[直接设 position]
    B2 --> B3[画面跳到新点]
    B4[标签页后台] --> B5[定时器节流]
    B5 --> B6[回到前台跳点]
  end
  subgraph good [✅ 时钟驱动方案]
    G1[消息到达] --> G2[addSample 到时间轴]
    G2 --> G3[时钟前进时插值]
    G4[标签页后台] --> G5[时钟继续走]
    G5 --> G6[回到前台自动追上]
  end
{% endmermaid %}

### 4.2 SampledPositionProperty 详解

Cesium 的 `SampledPositionProperty` 本质是「按时间戳存离散点，查询时插值」的容器：

```js
const prop = new Cesium.SampledPositionProperty();
// 超出最后一个采样点后：保持最后位置（不外推乱飞）
prop.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD;
// 早于第一个采样点前：不插值
prop.backwardExtrapolationType = Cesium.ExtrapolationType.NONE;

function onPose(pose) {
  if (!pose) return;
  const time = Cesium.JulianDate.fromDate(new Date(pose.ts));
  const pos = Cesium.Cartesian3.fromDegrees(pose.lon, pose.lat, pose.alt);

  prop.addSample(time, pos);

  // 姿态用航向转四元数，让机头朝飞行方向
  entity.orientation = Cesium.Transforms.headingPitchRollQuaternion(
    pos,
    new Cesium.HeadingPitchRoll(
      Cesium.Math.toRadians(pose.heading),
      Cesium.Math.toRadians(pose.pitch),
      Cesium.Math.toRadians(pose.roll)
    )
  );
}
```

### 4.3 为什么切页不跳

{% mermaid %}
sequenceDiagram
  participant U as 用户
  participant T as 标签页
  participant C as Cesium 时钟
  participant S as SampledPosition
  U->>T: 切到别的标签页
  Note over T: requestAnimationFrame 被节流
  Note over C: 但时钟仍在前进(逻辑时间)
  S->>S: 期间收到的 sample 继续存入
  U->>T: 切回来
  T->>C: 恢复渲染
  C->>S: 查当前时间位置
  S-->>C: 插值出正确位置(不跳)
{% endmermaid %}

位置是「按时间戳存的离散点」，时钟走到哪就插值到哪，跟「多久没渲染」无关。

## 五、短轨迹：有界缓存

默认 `PathGraphics` 会画所有历史点，飞久了 sample 无限增长，内存和绘制都会崩。

```js
entity.path = {
  resolution: 1,
  material: Cesium.Color.YELLOW,
  width: 2,
  leadTime: 0,        // 不画未来
  trailTime: 120,     // 只画过去 120 秒
  show: true
};
```

同时限制 `SampledPositionProperty` 的样本量：

```js
const MAX_SAMPLES = 600; // 10Hz × 60s
function pruneSamples(prop) {
  const times = prop._times; // 内部字段，谨慎使用
  while (times && times.length > MAX_SAMPLES) {
    times.shift();
    prop._values.shift();
  }
}
```

> 生产中更稳的做法是包一层 `ManagedSampledPosition`，不要直接戳内部字段。

## 六、多机同屏性能策略

{% mermaid %}
flowchart TB
  N{同屏实体数}
  N -->|< 10| A[全精细模型<br/>每帧更新]
  N -->|10-50| B[LOD 切换<br/>远处用广告牌]
  N -->|> 50| C[聚类/合并<br/>只更新视口内]
  B --> D[requestRenderMode<br/>非交互时降帧]
  C --> D
{% endmermaid %}

| 问题 | 做法 | 收益 |
|---|---|---|
| 高频刷实体 | 按设备节流（10–20Hz 合并） | 主线程回调减半 |
| sample 无限增长 | 滑动窗口只留近 N 秒 | 内存稳定 |
| 多机同屏 | 远距广告牌，近距切模型 | draw call 降 |
| 非交互时满帧 | `requestRenderMode: true` | GPU 占用降 |
| 重连风暴 | 指数退避 + 订阅幂等 | 服务端不雪崩 |

## 七、弱网重连的状态机

{% mermaid %}
stateDiagram-v2
  [*] --> 连接中
  连接中 --> 在线: 握手成功
  连接中 --> 断线: 超时/错误
  在线 --> 断线: 连接丢失
  断线 --> 退避等待
  退避等待 --> 连接中: 退避结束
  退避等待 --> 退避等待: 继续失败(指数增长)
  在线 --> [*]: 主动关闭
{% endmermaid %}

重连后要决定：**补历史点还是只追新点**。经验是：

- 任务回放场景：补历史，让轨迹完整
- 实时态势场景：只追新点，避免回放卡住实时

用一个 `lastEventId` 或时间游标告诉服务端「从哪续」，比前端自己猜更准。

## 八、实体生命周期管理

{% mermaid %}
classDiagram
  class DroneEntityManager {
    +Map~id, Entity~ entities
    +create(pose) Entity
    +update(pose) void
    +remove(id) void
    +pruneAll() void
  }
  class Entity {
    +String id
    +SampledPositionProperty position
    +VelocityOrientationProperty orientation
    +PathGraphics path
    +LabelGraphics label
  }
  class Pose {
    +String id
    +Number lon
    +Number lat
    +Number alt
    +Number heading
    +Number ts
  }
  DroneEntityManager --> Entity : 管理
  DroneEntityManager ..> Pose : 输入
  Entity ..> Pose : 转换
{% endmermaid %}

把实体的增、删、改集中在一个 Manager，组件只调 `manager.update(pose)`。好处：

- 切换任务/退出应急时 `manager.removeAll()` 一行清干净，不会漏实体残留
- 测试时可 mock Manager，不依赖 Cesium

## 九、小结

「活的飞机」本质是三件事：

1. **稳定的 Pose 流**（归一化 + 坏包丢弃）
2. **时间轴插值**（SampledPosition + 时钟驱动）
3. **有界缓存**（滑动窗口 + trailTime）

协议可以换，设备可以换，这三块稳住了，三维观感就不容易崩。

后续可接：任务仅在 RUNNING 时落点、回放用同一套 SampledPosition 喂历史点，实现「实时与回放一套渲染器」——这是把设计延伸到时间轴上的自然做法。
