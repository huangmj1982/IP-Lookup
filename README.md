# IP-Lookup

基于火山引擎 veADK（Agent Development Kit）构建的 IP 地址查询 Agent。

利用能力方便查询

原始的 IP 地址查询页面（`static/ip-lookup/index.html`）只支持在浏览器里手动输入 IP 查询，本项目把其中的查询逻辑改写为 veADK 工具，做成一个可以用自然语言对话的 Agent。

## 功能特性

- **IP 归属地查询**：输入任意 IPv4 / IPv6 地址，返回国家、地区、城市、邮编、运营商、ASN、经纬度、时区
- **本机 IP 查询**：直接询问“我的 IP 是多少”，自动获取当前环境的公网 IP 并返回归属地
- **多数据源回退**：主数据源 ip-api.com 失败时自动切换 ipapi.co
- **输入校验**：基于标准库 `ipaddress` 校验格式，非法输入直接返回中文错误提示
- **Web 对话界面**：由 `veadk web` 提供，无需额外编写前端

## 项目结构

| 文件 | 说明 |
|---|---|
| `vwa/agent.py` | Agent 定义与两个查询工具，`root_agent` 供 `veadk web` 加载 |
| `static/ip-lookup/index.html` | 改写前的原始 IP 查询页面（保留作为对照） |
| `static/weather/index.html` | 天气查询示例页面（未纳入 Agent） |
| `static/multimodal/` | 多模态示例页面与静态资源（未纳入 Agent） |
| `requirements.txt` | Python 依赖（已锁定版本） |
| `.env.example` | 模型环境变量模板，复制为 `.env` 后填写 |
| `Dockerfile` / `.dockerignore` | 容器化构建配置 |

## 环境变量

Agent 的推理模型通过 `MODEL_AGENT_*` 环境变量或项目根目录的 `config.yaml` 配置：

| 变量 | 必需 | 说明 |
|---|---|---|
| `MODEL_AGENT_API_KEY` | 是 | 模型 API Key，缺失时 Agent 无法初始化 |
| `MODEL_AGENT_NAME` | 否 | 模型名称，默认 `doubao-seed-1-8-251228` |
| `MODEL_AGENT_PROVIDER` | 否 | 模型提供方，默认 `openai`（火山方舟兼容 OpenAI 协议） |
| `MODEL_AGENT_API_BASE` | 否 | 模型 API 地址，默认 `https://ark.cn-beijing.volces.com/api/v3/` |

IP 查询工具本身不需要任何凭证。

## 快速开始

```bash
# 1. 安装依赖
pip install -r requirements.txt

# 2. 配置模型
cp .env.example .env
# 编辑 .env，填入 MODEL_AGENT_API_KEY

# 3. 启动对话界面
veadk web
```

启动后按终端提示的地址打开浏览器即可对话，例如：

- `帮我查一下 8.8.8.8 在哪里`
- `2001:4860:4860::8888 是哪个运营商的`
- `我的 IP 是多少`

## 工具说明

| 工具 | 入参 | 说明 |
|---|---|---|
| `query_ip_info` | `ip`：IPv4 / IPv6 地址 | 查询指定 IP 的归属地信息 |
| `get_my_ip_info` | 无 | 获取当前环境公网 IP 并查询其归属地 |

返回值为统一字段的字典：`IP地址`、`国家`、`地区`、`城市`、`邮编`、`运营商`、`ASN`、`纬度`、`经度`、`时区`、`数据来源`；查询失败时返回带 `错误` 字段的字典。

## 数据源说明

- **ip-api.com**：主数据源，免费接口仅支持 HTTP，且限制约 45 次/分钟
- **ipapi.co**：备用数据源，免费额度有限，触发限流时会自动跳过
- 原页面中用于绕过浏览器跨域限制的本地代理（`127.0.0.1:8090`）在 Python 侧不再需要，已移除

## Docker 运行

```bash
docker build -t ip-lookup-agent .
docker run --rm -p 8000:8000 -e MODEL_AGENT_API_KEY=<你的 key> ip-lookup-agent
```

## 许可证

本项目采用 [Apache-2.0](LICENSE) 许可证。
