export function c(contentMap, key, fallback = '') {
  return contentMap?.[key]?.value ?? fallback;
}
