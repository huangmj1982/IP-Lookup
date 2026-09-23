"""IP 地址查询 Agent。

由 static/ip-lookup/index.html 中的前端查询逻辑改写而来：
- isValidIp()          -> _is_valid_ip()
- fetchIpApiCom()      -> _query_ip_api_com()
- fetchIpapiCo()       -> _query_ipapi_co()
- render() 字段归一化   -> query_ip_info() 的返回结构
- “查询我的IP”按钮      -> get_my_ip_info()

运行方式（在本目录下执行，浏览器打开输出的地址即可对话）：
    veadk web

模型通过环境变量或上层目录的 config.yaml 配置：
    MODEL_AGENT_NAME / MODEL_AGENT_PROVIDER / MODEL_AGENT_API_BASE / MODEL_AGENT_API_KEY
"""

import ipaddress
from typing import Any, Callable

import requests

from veadk import Agent

REQUEST_TIMEOUT = 8  # 秒，对应页面里的 FETCH_TIMEOUT

INSTRUCTION = """你是一个 IP 地址查询助手，帮助用户查询 IPv4 / IPv6 地址的归属地信息。

工作方式：
1. 用户给出具体 IP（例如 8.8.8.8）时，调用 `query_ip_info` 查询。
2. 用户询问“我的 IP”“本机 IP”“当前 IP”时，调用 `get_my_ip_info`。
3. 工具返回的字典字段已用中文命名（IP地址 / 国家 / 地区 / 城市 / 邮编 / 运营商 / ASN / 纬度 / 经度 / 时区 / 数据来源），请原样使用，不要编造或推测缺失的字段。
4. 若返回结果中含“错误”字段，请如实说明失败原因，并提示用户确认 IP 格式后重试。

回答要求：
- 使用中文，简洁清晰。
- 用列表或表格列出关键字段，缺失字段显示为 “-”。
- 只汇报工具返回的事实，不要补充无关的推测。
"""


def _is_valid_ip(ip: str) -> bool:
    """校验 IPv4 / IPv6 地址格式（替代页面中的正则校验）。"""
    try:
        ipaddress.ip_address(ip)
        return True
    except ValueError:
        return False


def _query_ip_api_com(ip: str) -> dict[str, Any]:
    """通过 ip-api.com 查询（免费接口仅支持 http，Python 侧无跨域限制）。"""
    response = requests.get(
        f"http://ip-api.com/json/{ip}", params={"lang": "zh-CN"}, timeout=REQUEST_TIMEOUT
    )
    response.raise_for_status()
    data = response.json()
    if data.get("status") == "fail":
        raise RuntimeError(data.get("message") or "ip-api.com 查询失败")
    return {
        "IP地址": data.get("query") or ip,
        "国家": data.get("country"),
        "地区": data.get("regionName"),
        "城市": data.get("city"),
        "邮编": data.get("zip"),
        "运营商": data.get("org") or data.get("isp"),
        "ASN": data.get("as"),
        "纬度": data.get("lat"),
        "经度": data.get("lon"),
        "时区": data.get("timezone"),
        "数据来源": "ip-api.com",
    }


def _query_ipapi_co(ip: str) -> dict[str, Any]:
    """通过 ipapi.co 查询，作为备用数据源。"""
    response = requests.get(f"https://ipapi.co/{ip}/json/", timeout=REQUEST_TIMEOUT)
    response.raise_for_status()
    data = response.json()
    if data.get("error"):
        raise RuntimeError(data.get("reason") or "ipapi.co 查询失败")
    return {
        "IP地址": data.get("ip") or ip,
        "国家": data.get("country_name") or data.get("country"),
        "地区": data.get("region") or data.get("region_code"),
        "城市": data.get("city"),
        "邮编": data.get("postal"),
        "运营商": data.get("org") or data.get("isp"),
        "ASN": data.get("asn") or data.get("as"),
        "纬度": data.get("latitude"),
        "经度": data.get("longitude"),
        "时区": data.get("timezone"),
        "数据来源": "ipapi.co",
    }


def query_ip_info(ip: str) -> dict[str, Any]:
    """查询指定 IP 地址的归属地信息。

    Args:
        ip: 需要查询的 IPv4 或 IPv6 地址，例如 "8.8.8.8"。

    Returns:
        包含归属地信息的字典，字段有 IP地址、国家、地区、城市、邮编、运营商、
        ASN、纬度、经度、时区、数据来源；查询失败时返回带 "错误" 字段的字典。
    """
    ip = (ip or "").strip()
    if not ip:
        return {"错误": "请提供需要查询的 IP 地址"}
    if not _is_valid_ip(ip):
        return {"错误": f"IP 地址格式不正确：{ip}"}

    providers: list[Callable[[str], dict[str, Any]]] = [
        _query_ip_api_com,
        _query_ipapi_co,
    ]
    errors: list[str] = []
    for provider in providers:
        try:
            return provider(ip)
        except Exception as e:  # 单个数据源失败时继续尝试下一个
            errors.append(f"{provider.__name__}: {e}")
    return {"错误": "所有查询源均失败，请稍后重试", "详情": errors}


def _fetch_my_ip() -> str:
    """获取当前运行环境的公网 IP（对应页面“查询我的IP”的取 IP 逻辑）。"""
    try:
        response = requests.get(
            "https://ip.cn/api/index", params={"type": 0}, timeout=REQUEST_TIMEOUT
        )
        response.raise_for_status()
        ip = (response.json() or {}).get("ip") or ""
        if ip:
            return ip
    except Exception:  # 首个接口失败时回退到 ipify
        pass

    response = requests.get(
        "https://api.ipify.org", params={"format": "json"}, timeout=REQUEST_TIMEOUT
    )
    response.raise_for_status()
    return (response.json() or {}).get("ip") or ""


def get_my_ip_info() -> dict[str, Any]:
    """查询当前运行环境（本机）的公网 IP 及其归属地信息。

    Returns:
        与 query_ip_info 相同结构的字典；获取公网 IP 失败时返回带 "错误" 字段的字典。
    """
    try:
        ip = _fetch_my_ip()
    except Exception as e:
        return {"错误": f"获取本机公网 IP 失败：{e}"}
    if not ip:
        return {"错误": "获取本机公网 IP 为空"}
    return query_ip_info(ip)


agent = Agent(
    name="ip_lookup_agent",
    description="IP 地址查询助手，可查询任意 IP 的归属地、运营商、ASN、经纬度、时区等信息。",
    instruction=INSTRUCTION,
    tools=[query_ip_info, get_my_ip_info],
)

# veadk web 会加载这里的 root_agent
root_agent = agent
