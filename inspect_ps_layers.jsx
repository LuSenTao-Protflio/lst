function walkLayers(container, depth, out) {
  for (var i = 0; i < container.layers.length; i++) {
    var layer = container.layers[i];
    var indent = "";
    for (var j = 0; j < depth; j++) indent += "  ";
    if (layer.typename === "LayerSet") {
      out.push(indent + "[Group] " + layer.name);
      walkLayers(layer, depth + 1, out);
    } else {
      out.push(indent + "[Layer] " + layer.name + " :: " + layer.kind);
    }
  }
}

var out = [];
if (app.documents.length === 0) {
  out.push("NO_DOCUMENT");
} else {
  var doc = app.activeDocument;
  out.push("DOC " + doc.name + " " + doc.width.as("px") + "x" + doc.height.as("px"));
  walkLayers(doc, 0, out);
}

var file = new File("/Users/ttao/Documents/New project 2/ps_layers_dump.txt");
file.encoding = "UTF8";
file.open("w");
file.write(out.join("\n"));
file.close();
