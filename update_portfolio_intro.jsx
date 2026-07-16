function findByName(container, name) {
  for (var i = 0; i < container.layers.length; i++) {
    var layer = container.layers[i];
    if (layer.name === name) return layer;
    if (layer.typename === "LayerSet") {
      var nested = findByName(layer, name);
      if (nested) return nested;
    }
  }
  return null;
}

if (app.documents.length > 0) {
  var doc = app.activeDocument;
  var copy = {
    "Display Name": "LUO",
    "Chinese Name": "卢森涛",
    "English Name": "Luoison",
    "Roles": "视觉执行设计师 | AIGC 出图师 | 品牌空间视觉",
    "Section Label": "ABOUT / PROFILE",
    "Small Note": "Material, typography, spatial execution",
    "Intro Paragraph 1": "我以扎实的美术表现力为起点，在多元品牌实践中构建起严谨的视觉逻辑与系统化执行能力。\r在帆书（原樊登读书）期间，我深度参与从大型盛典到线下活动的视觉全链路落地，负责从核心视觉延伸至多类触点的策略布控。\r我擅长在业务框架中提取视觉基因，通过对材质工艺、空间动线与信息层级的精细规划，实现品牌调性在物理空间中的高质量还原。",
    "Intro Paragraph 2": "我热衷于探索设计在物理空间中的多种可能，从手绘构思到数字化表达，始终追求逻辑与美感的平衡。\r我注重字体张力、材质触感与执行效率的统一，倾向于打造简洁有力、具有现代感且兼具落地精度的视觉方案。"
  };

  for (var key in copy) {
    var textLayer = findByName(doc, key);
    if (textLayer && textLayer.kind === LayerKind.TEXT) {
      textLayer.textItem.contents = copy[key];
    }
  }

  var layer1 = findByName(doc, "图层 1");
  if (layer1) layer1.remove();

  var renameMap = {
    "TEXT": "TEXT_CONTENT",
    "ACCENT": "ACCENT_SHAPES",
    "STRUCTURE": "GRID_STRUCTURE",
    "BG": "BACKGROUND"
  };

  for (var from in renameMap) {
    var group = findByName(doc, from);
    if (group) group.name = renameMap[from];
  }
}
