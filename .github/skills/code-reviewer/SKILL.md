name	PR-code-review
description	项目级代码审查技能。审查 pull request 的代码变更, 覆盖通用质量维度及本项目(Python/veADK Agent/前端 JS/Docker)专项规则, 输出分级的结构化审查意见。当需要审查 PR 或代码差异时使用。
PR Code Review 审查规则 (IP-Lookup)
审查范围
仅审查 PR 中变更的文件和行(diff), 不扩大范围。
结合分支差异与业务流程理解变更意图。
通用审查维度
正确性: 逻辑错误、边界条件、空指针/None、除零、并发、异常处理缺失。
可维护性: 命名规范、重复(DRY)、复杂度、职责单一、可读性、遗留调试代码。
性能: 不必要的重复计算、无界内存增长、N+1 查询、阻塞调用。
测试: 关键逻辑是否有合理用例覆盖, 是否存在易致缺陷的测试盲区。
项目专项规则
Python / veADK Agent (vwa/agent.py)
所有 requests.* 调用必须显式传 timeout, 禁止无限期阻塞; 与 REQUEST_TIMEOUT 约定一致。
捕获网络异常: requests.RequestException(含 ConnectTimeout/ReadTimeout), 失败时应落到错误信息而非直接崩溃。
IP 校验用 ipaddress 库(is_valid_ip 应为健全的 IPv4/IPv6 判断), 关注非法输入、边界(0.0.0.0 等)的健壮性。
对外部 IP API 的返回字段做归一化时, 校验字段是否存在/类型, 避免 KeyError; 缺失字段按约定显示为 "-"。
Agent 工具返回的中文字段与提示词(INSTRUCTION)保持一致, 不编造字段。
密钥/API Key 必须走环境变量或 config.yaml, 严禁硬编码进源码。
前端 JavaScript (static/ip-lookup, static/multimodal/js, static/weather)
fetch 必须带超时(AbortController 或 timeout 信号), 失败要有用户可读的错误提示。
用户可控内容(IP、运营商、地区等)插入 DOM 时必须防 XSS: 优先 textContent, 勿直接拼 innerHTML。
异步竞态: 快速连续查询时忽略过期响应(请求序号/token 校验), 避免旧结果覆盖新结果。
模块职责: api.js(请求)、logic.js(校验/换算)、ui.js(渲染)、main.js(组装) 边界清晰, 不互相串改。
Docker / 部署
依赖版本应明确固定(requirements.txt 已 pin), 新增依赖需追溯来源。
镜像敏感信息不得通过 ENV/COPY . . 把 .env 打进镜像; 容器运行权限优先非 root。
多阶段/瘦身与 python:3.12-slim 基线一致性; 不放大无谓的构建上下文。
输出格式
Summary 总览: 变更范围、涉及文件数、整体评价(一段)。
Findings 分级列表, 每条包含:
级别: [Critical] / [Warning] / [Nitpick]
位置: 文件路径:行号
问题: 一句话说明
建议: 具体修复方案(必要时给示例代码)
Conclusion: 是否建议合并, 或需修改后合并。
硬性约束
只反馈真实、可定位的问题, 禁止臆测与幻觉。
不修改任何源文件; 审查结论经 gh 提交为 PR review 评论。
中文输出。
