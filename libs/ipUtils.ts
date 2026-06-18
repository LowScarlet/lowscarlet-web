export function censorIp(ip: string): string {
  if (!ip || ip === "unknown") {
    return "Anonymous";
  }
  if (ip === "::1" || ip === "127.0.0.1") {
    return "127.0.***.***";
  }
  if (ip.includes(".")) {
    const parts = ip.split(".");
    if (parts.length >= 2) {
      return `${parts[0]}.${parts[1]}.***.***`;
    }
  } else if (ip.includes(":")) {
    const parts = ip.split(":");
    if (parts.length >= 3) {
      return `${parts[0]}:${parts[1]}:${parts[2]}:****:****:****`;
    }
  }
  return "Anonymous";
}
