# Changelog

本文件记录项目的所有重要变更，格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

## [0.1.0] - 2026-09-23

### Added

- 基于 veADK 的 IP 地址查询 Agent（`vwa/agent.py`），提供 `query_ip_info` 与 `get_my_ip_info` 两个工具
- IP 归属地查询：支持 IPv4 / IPv6，返回国家、地区、城市、邮编、运营商、ASN、经纬度、时区
- 多数据源回退：ip-api.com 失败时自动切换 ipapi.co
- 基于标准库 `ipaddress` 的输入校验与中文错误提示
- IP 地址查询静态页面（`static/ip-lookup/index.html`）
- 项目标准文件：README、LICENSE（Apache-2.0）、CONTRIBUTING、CHANGELOG、requirements.txt、`.env.example`、Dockerfile

### Changed

- 将 `static/ip-lookup/index.html` 中的前端查询逻辑改写为 veADK 工具，Agent 可通过自然语言对话完成查询
- 移除原页面用于绕过浏览器跨域限制的本地代理（`127.0.0.1:8090`），Python 侧直连数据源

[Unreleased]: https://github.com/huangmj1982/IP-Lookup/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/huangmj1982/IP-Lookup/releases/tag/v0.1.0
