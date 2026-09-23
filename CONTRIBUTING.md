# 贡献指南

感谢参与 IP-Lookup 的开发。提交改动前请先阅读本指南。

## 开发环境

```bash
git clone git@github.com:huangmj1982/IP-Lookup.git
cd IP-Lookup

python3 -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt

cp .env.example .env   # 填入 MODEL_AGENT_API_KEY
```

## 分支规范

从 `main` 切出分支，命名格式为 `<类型>/<简短描述>`：

- `feat/ipv6-support`
- `fix/ipapi-co-fallback`
- `docs/readme-update`

## 提交信息规范

采用 [Conventional Commits](https://www.conventionalcommits.org/) 风格，与仓库现有提交保持一致：

```
<类型>: <简短描述>
```

常用类型：`feat`（新功能）、`fix`（缺陷修复）、`docs`（文档）、`refactor`（重构）、`chore`（构建与杂项）。

示例：

```
feat: 新增 IP 归属地批量查询工具
fix: ip-api.com 限流时未能回退到备用数据源
```

## 新增工具

在 `vwa/agent.py` 中新增工具时，请遵循以下约定：

1. 使用类型标注的函数实现，docstring 中写清 `Args` 与 `Returns`，模型依赖它生成工具描述
2. 返回可直接序列化的 `dict`，字段使用中文命名
3. 失败时返回带 `错误` 字段的字典，不要抛出异常中断对话
4. 外部请求必须设置超时（参考 `REQUEST_TIMEOUT`）
5. 把工具注册到 `Agent(tools=[...])`，并在 `INSTRUCTION` 中说明调用时机

## 提交 PR 前的检查清单

- [ ] 本地 `veadk web` 启动正常，相关问法能得到预期回答
- [ ] 涉及外部接口的改动，已用真实 IP 验证过成功与失败两条路径
- [ ] 新增依赖已写入 `requirements.txt` 并锁定版本
- [ ] 新增环境变量已补充到 `.env.example` 与 `README.md`
- [ ] 用户可见的改动已记录到 `CHANGELOG.md`
