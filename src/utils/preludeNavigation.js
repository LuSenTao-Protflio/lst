const editableTags = new Set(["INPUT", "TEXTAREA", "SELECT"]);

export function shouldAdvanceFromWheel(deltaY) {
  return deltaY >= 18;
}

export function shouldAdvanceFromKey(key, tagName = "") {
  return key === "ArrowDown" && !editableTags.has(tagName.toUpperCase());
}
