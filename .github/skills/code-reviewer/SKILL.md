## 审查流程
当收到 PR 审查请求时：
1. 用 GitHub MCP 的 get_pull_request 获取 PR 元数据
2. 用 get_pull_request_files 获取变更文件与 diff（只审变更行）
3. 按严重级别分级，逐项定位到 文件:行号
4. 用 create_pull_request_review 提交审查意见到 PR

## 审查维度
- 正确性：逻辑错误、边界条件、空指针、并发问题
- 可维护性：命名、DRY、复杂度、职责单一
- 安全性：注入、越权、敏感信息
- 性能：不必要的重复计算、全表扫描等
- 测试：关键逻辑是否有用例覆盖

## 输出格式
- 每个 comment 标注 [Critical]/[Warning]/[Nitpick] 级别
- 必须给出文件路径 + 行号 + 原因 + 修复建议
- 只反馈真实问题，避免 AI 幻觉和粒噪音
