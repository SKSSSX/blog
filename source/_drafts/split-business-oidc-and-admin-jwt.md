---
title: 业务身份与管理端身份为什么要拆开
subtitle: OIDC 与自建后台鉴权的边界
categories:
  - NodeJS
tags:
  - 安全
  - OAuth
  - 架构
keywords: Keycloak, JWT, RBAC, 身份认证
copyright: true
date: 2026-07-27 19:40:00
top: false
---

不少平台会同时存在「业务用户」和「系统管理员」。把两套人马塞进同一个登录域，看起来省事，实际会在权限模型、审计与发布节奏上互相拖累。更稳妥的做法是：**业务走企业级 OIDC，管理端走独立身份与 RBAC**。

## 一、两种用户，两种风险面

| | 业务端 | 管理端 |
|---|---|---|
| 用户 | 作业人员/客户账号 | 内部运维/配置员 |
| 协议 | OIDC / 统一认证 | 自建登录 + JWT |
| 权限 | 租户/项目/设备范围 | 菜单与危险操作 RBAC |
| 发布 | 与业务迭代强相关 | 变更更少、审计更严 |
| 被攻击代价 | 影响单用户 | 影响全平台 |

## 二、推荐拓扑

```mermaid
flowchart TB
  U[业务用户] --> IdP[企业 IdP / OIDC]
  IdP --> GW[业务网关]
  GW --> Biz[业务服务]
  A[管理员] --> AdminAPI[管理 API]
  AdminAPI --> AdminDB[(独立权限库)]
  AdminAPI -.只调受控运维接口.-> Biz
  Note1[业务 Token 不碰管理 API]
  Note2[管理 Token 不碰业务用户数据]
```

## 三、为什么要拆

```mermaid
flowchart TB
  A[混用一套身份] --> B[权限模型互相污染]
  A --> C[发布节奏互相拖]
  A --> D[攻击面扩大]
  A --> E[审计难以区分]
  B --> F[业务变更误改管理组]
  C --> G[管理端变更等业务发版]
  D --> H[XSS 连带打穿管理端]
  E --> I[谁操作的说不清]
```

## 四、业务端：OIDC 流程

```mermaid
sequenceDiagram
  participant U as 用户
  participant FE as 业务前端
  participant GW as 业务网关
  participant IdP as IdP
  U->>FE: 访问业务页
  FE->>IdP: 重定向到登录
  IdP-->>FE: 授权码 code
  FE->>GW: 带 code 换 token
  GW->>IdP: code 换 access_token
  IdP-->>GW: token
  GW-->>FE: 业务 session/token
  FE->>GW: 后续请求带 token
  GW->>GW: 校验 + 提取 scope
```

## 五、管理端：独立 JWT + RBAC

```mermaid
flowchart LR
  A[管理员登录] --> B[管理 API 验密码]
  B --> C[签发 JWT 含角色]
  C --> D[请求带 JWT]
  D --> E[网关校验签名+角色]
  E --> F{有权限?}
  F -->|是| G[执行运维操作]
  F -->|否| H[403]
```

要点：

- 管理端 **不要** 直接复用业务 Refresh Token 调所有业务 API
- 业务网关校验 OIDC Access Token；管理 API 校验自己的 JWT
- 跨系统调用用窄权限服务账号，而不是「管理员个人令牌」

## 六、常见反例

```mermaid
flowchart TB
  R1[反例1: 同域名 Cookie] --> E1[XSS 打穿两端]
  R2[反例2: 同 Realm 用 group 区分] --> E2[业务变更误改管理组]
  R3[反例3: 管理接口公网+同限流] --> E3[被扫到代价高]
  R4[反例4: 管理员个人令牌调业务] --> E4[离职后未收回]
```

1. 前端把管理 Token 存同一域名 Cookie，业务站被 XSS 连带打穿管理端
2. 同一 Realm 里用 group 区分管理员，业务变更误改管理组
3. 管理接口暴露在公网且与业务同限流策略，被扫到代价更高
4. 用管理员个人令牌做系统间调用，离职后未收回

## 七、跨系统调用的正确姿势

```mermaid
flowchart LR
  Admin[管理服务] --> SA[服务账号<br/>窄权限 长期]
  SA --> Biz[业务受控接口]
  Biz --> Audit[审计日志]
  Note[不使用管理员个人令牌]
```

- 服务账号有独立密钥，可轮换
- 只授予「需要的几个运维接口」
- 每次调用写审计日志

## 八、小结

拆开身份不是重复建设，而是 **缩小爆炸半径**。业务侧拥抱组织账号体系，管理侧强调可控 RBAC 与审计；两者通过显式、窄权限的集成点交互，平台才比较扛得住误操作与攻击面扩张。
