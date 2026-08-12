---
title: 工作流不存 Token：流式 AI 如何既实时又可靠
subtitle: Temporal 一类工作流与 SSE 的边界划分
categories:
  - NodeJS
tags:
  - AI
  - Temporal
  - 架构
keywords: Temporal, SSE, AI, 工作流
copyright: true
date: 2026-07-13 20:15:00
top: false
---

巡检分析、报告生成这类任务，既要 **边生成边展示**，又要 **失败可重试、结果可审计**。若把每个流式 token 都写进工作流历史，体积与重放成本都会爆炸。更干净的切法是：**工作流管可靠结果，SSE 管实时观感**。

## 一、两种需求冲突

| 需求 | 满足方式 | 冲突点 |
|---|---|---|
| 实时展示 | SSE 逐 token 推送 | token 不该进工作流历史 |
| 可靠重试 | 工作流记录状态 | 状态不该包含海量 token |
| 结果审计 | 落库 + 对象存储 | 与 SSE 无直接关系 |

## 二、边界划分

```mermaid
flowchart TB
  U[用户发起分析] --> API[业务 API]
  API --> WF[工作流: 建任务/调模型/落库]
  API --> SSE[SSE: 订阅进度与增量文本]
  WF --> DB[(结果表/对象存储)]
  WF -.进度事件.-> Bus[消息/缓存]
  Bus --> SSE
  SSE --> U
  U -->|断线重连| SSE
  SSE -->|Last-Event-ID| Bus
```

原则：

- **工作流历史**：输入引用、模型版本、最终产物 ID、错误码
- **不进历史**：逐 token 文本、临时调试日志
- **SSE**：从缓存/消息总线读增量；结束帧以「落库成功」为准

## 三、为什么不把 Token 存进工作流

```mermaid
flowchart TB
  A[把 token 存进历史] --> B[历史膨胀 GB 级]
  B --> C[replay 变慢]
  B --> D[存储成本飙升]
  A --> E[重试时重复 token 难去重]
  A --> F[敏感内容扩大存储面]
  F --> G[合规风险]
```

正确做法：把「完整答案」作为 Activity 输出一次写入 DB，SSE 在 `done` 前允许丢包（刷新后以 DB 为准）。

## 四、工作流内部结构

```mermaid
sequenceDiagram
  participant W as Workflow
  participant A as AI Activity
  participant M as Model
  participant DB as 结果库
  W->>A: executeAnalysis(inputRef)
  A->>M: 调用模型(幂等键)
  M-->>A: 逐 token 返回
  A->>A: 拼接完整结果
  A->>DB: 写入最终结果
  A-->>W: 返回 resultId
  W->>W: 标记 done
  W->>W: 发进度事件到总线
```

## 五、幂等与防重复

```mermaid
flowchart TB
  A[重复点击分析] --> B{WorkflowId 已存在?}
  B -->|是| C[返回已有运行中实例]
  B -->|否| D[创建新工作流]
  D --> E[WorkflowId = analysis:bizId:inputHash]
  E --> F[Activity 带幂等键调模型]
  F --> G[避免超时重试双计费]
```

- WorkflowId：`analysis:{bizId}:{inputHash}`
- 同一业务重复点击返回已有运行中实例
- Activity 调用模型时带幂等键，避免超时重试双计费

## 六、前端体验流程

```mermaid
stateDiagram-v2
  [*] --> 发起
  发起 --> 等待runId
  等待runId --> 流式接收
  流式接收 --> 拼接delta
  拼接delta --> 收到done
  收到done --> 拉最终结果
  拉最终结果 --> 校准显示
  流式接收 --> 断线
  断线 --> 重连: 带Last-Event-ID
  重连 --> 流式接收
  校准显示 --> [*]
```

1. 先建任务拿 `runId`
2. 立刻开 SSE
3. 本地拼接 delta；收到 `done` 再拉一次最终结果校准
4. 断线重连从 `Last-Event-ID` 或服务端游标续传

## 七、Activity 伪代码

```ts
async function executeAnalysis(input: AnalysisInput): Promise<string> {
  const idempotencyKey = `${input.taskId}:${input.hash}`;

  const stream = await callModel({
    prompt: input.prompt,
    idempotencyKey
  });

  let fullText = '';
  for await (const chunk of stream) {
    fullText += chunk.text;
    // 进度事件发到总线，不进工作流历史
    await publishProgress(input.runId, chunk);
  }

  // 完整结果落库
  const resultId = await saveResult(input.runId, fullText);
  return resultId; // 只返回 ID 给工作流
}
```

## 八、小结

「流式」满足人，「工作流」满足系统。两者交汇点应是 **进度事件 + 最终落库**，而不是把 token 流塞进工作流引擎。这是巡检 AI、报告生成类功能长期可运维的关键分界。
