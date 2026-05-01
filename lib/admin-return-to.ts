export function adminReturnTo(basePath: string, params: Record<string, string | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value && !(key === "page" && value === "1")) {
      query.set(key, value);
    }
  });
  const queryString = query.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}
