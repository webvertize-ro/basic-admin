export function c(contentMap, key, fallback = "") {
  return contentMap?.[key]?.value ?? fallback;
}

// Reads a non-"value" column off the same content row — currently used
// for the logo's display width, stored in content.width alongside the
// image URL in content.value on the same row.
export function cWidth(contentMap, key, fallback = null) {
  return contentMap?.[key]?.width ?? fallback;
}
