#target illustrator

(function () {
    var OUTPUT_DIR = "/Users/ttao/Documents/作品集";
    var OUTPUT_AI = OUTPUT_DIR + "/南头古城-古城漫游AR导航-SelectedWorks短案例.ai";
    var OUTPUT_PREVIEW = OUTPUT_DIR + "/南头古城-古城漫游AR导航-SelectedWorks短案例-preview.png";
    var OUTPUT_PREFLIGHT = OUTPUT_DIR + "/南头古城-古城漫游AR导航-SelectedWorks短案例-preflight.txt";
    var LOG_PATH = OUTPUT_DIR + "/南头古城-古城漫游AR导航-构建日志.txt";
    var REPO = "/Users/ttao/Documents/Codex/2026-07-11/new-chat/outputs/portfolio-v4-source-shwung";

    var ASSETS = {
        rules: "/Users/ttao/Downloads/woof项目/4.jpg",
        application: "/Users/ttao/Downloads/woof项目/5.jpg",
        ui: REPO + "/assets/portfolio-pages/48.jpg"
    };

    var W = 1440;
    var GAP = 80;
    var boards = [
        { name: "01-CONTEXT", height: 900 },
        { name: "02-ROUTE-SYSTEM", height: 900 },
        { name: "03-AR-JOURNEY", height: 900 }
    ];

    var COLORS = {
        paper: [248, 246, 239],
        ink: [31, 31, 29],
        muted: [112, 108, 101],
        cyan: [78, 211, 225],
        yellow: [247, 210, 87],
        coral: [244, 93, 71],
        cream: [244, 233, 209],
        white: [255, 255, 255],
        dark: [20, 22, 23],
        glass: [220, 225, 225]
    };

    function log(message) {
        try {
            var file = new File(LOG_PATH);
            if (file.open("a")) {
                file.writeln("[" + new Date() + "] " + message);
                file.close();
            }
        } catch (ignore) {}
    }

    function rgb(values) {
        var color = new RGBColor();
        color.red = values[0];
        color.green = values[1];
        color.blue = values[2];
        return color;
    }

    function fontByNames(names) {
        for (var i = 0; i < names.length; i++) {
            try { return app.textFonts.getByName(names[i]); } catch (ignore) {}
        }
        return app.textFonts[0];
    }

    var regularFont;
    var semiboldFont;

    function globalTop(board, localY) {
        return board.rect[1] - localY;
    }

    function addRect(layer, name, board, x, y, width, height, fill, stroke, strokeWidth) {
        var item = layer.pathItems.rectangle(globalTop(board, y), x, width, height);
        item.name = name;
        item.filled = !!fill;
        if (fill) item.fillColor = rgb(fill);
        item.stroked = !!stroke;
        if (stroke) {
            item.strokeColor = rgb(stroke);
            item.strokeWidth = strokeWidth || 1;
        }
        return item;
    }

    function addLine(layer, name, board, x1, y1, x2, y2, color, width) {
        var line = layer.pathItems.add();
        line.name = name;
        line.setEntirePath([[x1, globalTop(board, y1)], [x2, globalTop(board, y2)]]);
        line.closed = false;
        line.filled = false;
        line.stroked = true;
        line.strokeColor = rgb(color);
        line.strokeWidth = width || 1;
        line.strokeCap = StrokeCap.ROUNDENDCAP;
        return line;
    }

    function addAreaText(layer, name, board, text, x, y, width, height, size, color, leading, bold, tracking, justification) {
        var path = layer.pathItems.rectangle(globalTop(board, y), x, width, height);
        path.stroked = false;
        path.filled = false;
        var frame = layer.textFrames.areaText(path);
        frame.name = name;
        frame.contents = text;
        var range = frame.textRange;
        range.characterAttributes.size = size;
        range.characterAttributes.leading = leading || size * 1.35;
        range.characterAttributes.fillColor = rgb(color);
        range.characterAttributes.textFont = bold ? semiboldFont : regularFont;
        range.characterAttributes.tracking = tracking || 0;
        range.paragraphAttributes.justification = justification || Justification.LEFT;
        return frame;
    }

    function addPointText(layer, name, board, text, x, y, size, color, bold, tracking) {
        var frame = layer.textFrames.add();
        frame.name = name;
        frame.contents = text;
        frame.position = [x, globalTop(board, y)];
        frame.textRange.characterAttributes.size = size;
        frame.textRange.characterAttributes.fillColor = rgb(color);
        frame.textRange.characterAttributes.textFont = bold ? semiboldFont : regularFont;
        frame.textRange.characterAttributes.tracking = tracking || 0;
        return frame;
    }

    function fitItemToRect(item, rect) {
        var targetWidth = rect[2] - rect[0];
        var targetHeight = rect[1] - rect[3];
        var bounds = item.geometricBounds;
        var itemWidth = bounds[2] - bounds[0];
        var itemHeight = bounds[1] - bounds[3];
        if (itemWidth <= 0 || itemHeight <= 0) return;
        var scale = Math.min(targetWidth / itemWidth, targetHeight / itemHeight);
        item.resize(scale * 100, scale * 100);
        bounds = item.geometricBounds;
        itemWidth = bounds[2] - bounds[0];
        itemHeight = bounds[1] - bounds[3];
        var centerX = (rect[0] + rect[2]) / 2;
        var centerY = (rect[1] + rect[3]) / 2;
        item.position = [centerX - itemWidth / 2, centerY + itemHeight / 2];
    }

    var placedCount = 0;
    var missingCount = 0;
    var routeElementCount = 0;

    function placeImage(layer, name, board, path, x, y, width, height, mode) {
        var file = new File(path);
        if (!file.exists) {
            missingCount++;
            log("Missing image: " + path);
            return null;
        }
        var left = x;
        var top = globalTop(board, y);
        var rect = [left, top, left + width, top - height];
        var group = layer.groupItems.add();
        group.name = name + "-CLIP";
        var placed = group.placedItems.add();
        placed.name = name;
        placed.file = file;
        fitItemToRect(placed, rect);
        var clip = group.pathItems.rectangle(top, left, width, height);
        clip.name = name + "-MASK";
        clip.stroked = false;
        clip.filled = false;
        clip.clipping = true;
        clip.move(group, ElementPlacement.PLACEATBEGINNING);
        group.clipped = true;
        placedCount++;
        return group;
    }

    function addRoute(layer, prefix, board, points, color, width) {
        var converted = [];
        for (var i = 0; i < points.length; i++) converted.push([points[i][0], globalTop(board, points[i][1])]);
        var path = layer.pathItems.add();
        path.name = prefix;
        path.setEntirePath(converted);
        path.closed = false;
        path.filled = false;
        path.stroked = true;
        path.strokeColor = rgb(color);
        path.strokeWidth = width || 8;
        path.strokeCap = StrokeCap.ROUNDENDCAP;
        path.strokeJoin = StrokeJoin.ROUNDENDJOIN;
        routeElementCount++;
        return path;
    }

    function addNode(layer, name, board, x, y, radius, color, fill) {
        var item = layer.pathItems.ellipse(globalTop(board, y - radius), x - radius, radius * 2, radius * 2);
        item.name = name;
        item.filled = !!fill;
        if (fill) item.fillColor = rgb(color);
        item.stroked = true;
        item.strokeColor = rgb(color);
        item.strokeWidth = 2;
        routeElementCount++;
        return item;
    }

    function addArrow(layer, prefix, board, x1, y1, x2, y2, color) {
        addLine(layer, prefix + "-SHAFT", board, x1, y1, x2, y2, color, 2);
        addLine(layer, prefix + "-HEAD-A", board, x2, y2, x2 - 12, y2 - 8, color, 2);
        addLine(layer, prefix + "-HEAD-B", board, x2, y2, x2 - 12, y2 + 8, color, 2);
        routeElementCount += 3;
    }

    function addImageFrame(layer, prefix, board, x, y, width, height, color) {
        addRect(layer, prefix + "-FRAME", board, x - 10, y - 10, width + 20, height + 20, null, color, 1);
        addRect(layer, prefix + "-MARK", board, x - 18, y - 18, 40, 8, color, null, 0);
    }

    function addMicroLabel(typeLayer, board, prefix, text, x, y, dark) {
        addPointText(typeLayer, prefix, board, text, x, y, 9, dark ? COLORS.white : COLORS.ink, true, 130);
    }

    function addPageDecor(typeLayer, graphicsLayer, board, prefix, page, dark) {
        var colors = [COLORS.cyan, COLORS.yellow, COLORS.coral];
        for (var i = 0; i < colors.length; i++) {
            addRect(graphicsLayer, prefix + "-BAR-" + i, board, 24 + i * 20, 24, 14, 8 + i * 5, colors[i], null, 0);
        }
        addMicroLabel(typeLayer, board, prefix + "-PAGE", "SELECTED WORKS / NANTOU / 0" + page, 1165, board.height - 25, dark);
    }

    function makeArtboards(doc) {
        var cursorTop = 4000;
        for (var i = 0; i < boards.length; i++) {
            boards[i].rect = [0, cursorTop, W, cursorTop - boards[i].height];
            var artboard;
            if (i === 0) {
                artboard = doc.artboards[0];
                artboard.artboardRect = boards[i].rect;
            } else {
                artboard = doc.artboards.add(boards[i].rect);
            }
            artboard.name = boards[i].name;
            cursorTop -= boards[i].height + GAP;
        }
    }

    function buildContext(typeLayer, graphicsLayer, imageLayer, annotationLayer, board) {
        addRect(graphicsLayer, "B01-BG", board, 0, 0, W, board.height, COLORS.paper);
        addPointText(typeLayer, "B01-INDEX", board, "SELECTED WORK 03 / UI & WAYFINDING", 72, 74, 12, COLORS.muted, true, 120);
        addAreaText(typeLayer, "B01-TITLE", board, "把古城巷道，\r变成可跟随的\r彩色路径。", 72, 128, 470, 260, 56, COLORS.ink, 62, true, -35);
        addAreaText(typeLayer, "B01-LEAD", board, "南头古城巷道纵深、道路节点密集，民宿、餐饮、非餐饮店铺与居民空间并置。路线系统需要帮助游客识别方向和店铺类型，同时减少杂乱标识对古城空间的干扰。", 72, 455, 470, 145, 16, COLORS.ink, 29, false, 0);
        addAreaText(typeLayer, "B01-ROLE-LABEL", board, "ROLE", 72, 650, 90, 24, 10, COLORS.muted, 13, true, 100);
        addAreaText(typeLayer, "B01-ROLE", board, "负责视觉概念、路线识别系统、\rAR 界面与场景应用设计。", 72, 680, 455, 70, 15, COLORS.ink, 25, true, 0);
        addAreaText(typeLayer, "B01-QUOTE", board, "让游客在古城生活肌理中找到方向。", 72, 792, 455, 38, 18, COLORS.coral, 24, true, 0);
        placeImage(imageLayer, "B01-APPLICATION", board, ASSETS.application, 610, 105, 760, 538, "contain");
        addImageFrame(graphicsLayer, "B01-APPLICATION", board, 610, 105, 760, 538, COLORS.ink);
        addRoute(graphicsLayer, "B01-ROUTE-CYAN", board, [[590, 720], [760, 720], [760, 790], [1030, 790], [1030, 850], [1368, 850]], COLORS.cyan, 8);
        addRoute(graphicsLayer, "B01-ROUTE-YELLOW", board, [[590, 745], [820, 745], [820, 815], [1110, 815], [1110, 875], [1368, 875]], COLORS.yellow, 8);
        addRoute(graphicsLayer, "B01-ROUTE-CORAL", board, [[590, 770], [690, 770], [690, 840], [930, 840], [930, 875]], COLORS.coral, 8);
        addNode(graphicsLayer, "B01-NODE-A", board, 760, 720, 9, COLORS.cyan, true);
        addNode(graphicsLayer, "B01-NODE-B", board, 820, 745, 9, COLORS.yellow, true);
        addNode(graphicsLayer, "B01-NODE-C", board, 690, 770, 9, COLORS.coral, true);
        addAreaText(annotationLayer, "B01-SPEC", board, "3-BOARD MODULE / IMAGE CONTAIN", 1120, 68, 250, 24, 9, COLORS.ink, 12, true, 80);
    }

    function buildRouteSystem(typeLayer, graphicsLayer, imageLayer, board) {
        addRect(graphicsLayer, "B02-BG", board, 0, 0, W, board.height, COLORS.dark);
        addPointText(typeLayer, "B02-INDEX", board, "02 / ROUTE LANGUAGE", 72, 72, 12, COLORS.cream, true, 120);
        addAreaText(typeLayer, "B02-TITLE", board, "树根地图：\r让路线沿古城肌理生长。", 72, 116, 330, 145, 42, COLORS.white, 48, true, -25);
        addAreaText(typeLayer, "B02-BODY", board, "彩色线路像古城根系一样沿巷道延伸，圆形节点对应路口、定位与店铺信息。系统保留盘绕生长的空间感，同时用颜色降低识别成本。", 72, 300, 320, 130, 14, [202, 202, 196], 25, false, 0);
        var classes = [
            ["民宿 / 居民区", COLORS.cyan],
            ["非餐饮 / 体验", COLORS.yellow],
            ["餐饮 / 店铺", COLORS.coral],
            ["公共信息", COLORS.cream]
        ];
        for (var i = 0; i < classes.length; i++) {
            var y = 490 + i * 72;
            addRect(graphicsLayer, "B02-CLASS-" + i, board, 72, y, 300, 50, classes[i][1], COLORS.white, 0.8);
            addAreaText(typeLayer, "B02-CLASS-TEXT-" + i, board, classes[i][0], 92, y + 15, 220, 24, 12, COLORS.ink, 16, true, 40);
            addNode(graphicsLayer, "B02-CLASS-NODE-" + i, board, 344, y + 25, 7, COLORS.ink, i < 3);
        }
        placeImage(imageLayer, "B02-RULES", board, ASSETS.rules, 450, 118, 918, 649, "contain");
        addImageFrame(graphicsLayer, "B02-RULES", board, 450, 118, 918, 649, COLORS.cream);
        addRoute(graphicsLayer, "B02-ROOT-A", board, [[450, 815], [610, 815], [610, 850], [850, 850]], COLORS.cyan, 7);
        addRoute(graphicsLayer, "B02-ROOT-B", board, [[735, 815], [735, 780], [1030, 780], [1030, 850]], COLORS.yellow, 7);
        addRoute(graphicsLayer, "B02-ROOT-C", board, [[1040, 815], [1190, 815], [1190, 850], [1360, 850]], COLORS.coral, 7);
        addNode(graphicsLayer, "B02-ROOT-NODE-A", board, 610, 815, 8, COLORS.cyan, true);
        addNode(graphicsLayer, "B02-ROOT-NODE-B", board, 735, 815, 8, COLORS.yellow, true);
        addNode(graphicsLayer, "B02-ROOT-NODE-C", board, 1190, 815, 8, COLORS.coral, true);
    }

    function buildJourney(typeLayer, graphicsLayer, imageLayer, board) {
        addRect(graphicsLayer, "B03-BG", board, 0, 0, W, board.height, COLORS.paper);
        addPointText(typeLayer, "B03-INDEX", board, "03 / AR JOURNEY & APPLICATION", 72, 66, 12, COLORS.muted, true, 120);
        addAreaText(typeLayer, "B03-TITLE", board, "从地图规则，进入真实街巷。", 72, 105, 600, 70, 44, COLORS.ink, 50, true, -25);
        addAreaText(typeLayer, "B03-BODY", board, "统一的色彩、线路和节点语言从手机分类入口延续至 AR 实景导航，并进入灯箱与桌牌，让线上路径与现场触点保持连续。", 850, 108, 518, 72, 14, COLORS.muted, 24, false, 0);
        placeImage(imageLayer, "B03-UI", board, ASSETS.ui, 220, 198, 1000, 563, "contain");
        addImageFrame(graphicsLayer, "B03-UI", board, 220, 198, 1000, 563, COLORS.ink);
        var steps = [
            ["01", "选择分类", "民宿 / 非餐饮 / 餐饮", COLORS.cyan],
            ["02", "确认位置", "查看附近目的地", COLORS.yellow],
            ["03", "AR 导航", "距离与方向提示", COLORS.coral],
            ["04", "到达探索", "进入店铺或继续浏览", COLORS.cream]
        ];
        for (var i = 0; i < steps.length; i++) {
            var x = 72 + i * 326;
            addRect(graphicsLayer, "B03-STEP-" + i, board, x, 792, 302, 76, steps[i][3], COLORS.ink, 1);
            addPointText(typeLayer, "B03-STEP-NO-" + i, board, steps[i][0], x + 18, 821, 10, COLORS.ink, true, 80);
            addAreaText(typeLayer, "B03-STEP-TITLE-" + i, board, steps[i][1], x + 58, 807, 110, 25, 14, COLORS.ink, 18, true, 0);
            addAreaText(typeLayer, "B03-STEP-BODY-" + i, board, steps[i][2], x + 58, 833, 215, 20, 10, COLORS.ink, 13, false, 0);
            if (i < steps.length - 1) addArrow(graphicsLayer, "B03-ARROW-" + i, board, x + 286, 778, x + 326, 778, COLORS.ink);
        }
        addRoute(graphicsLayer, "B03-ROUTE-CYAN", board, [[72, 735], [160, 735], [160, 765], [220, 765]], COLORS.cyan, 6);
        addRoute(graphicsLayer, "B03-ROUTE-YELLOW", board, [[1220, 735], [1285, 735], [1285, 700], [1368, 700]], COLORS.yellow, 6);
        addNode(graphicsLayer, "B03-NODE-A", board, 160, 735, 7, COLORS.cyan, true);
        addNode(graphicsLayer, "B03-NODE-B", board, 1285, 735, 7, COLORS.yellow, true);
    }

    function writePreflight(doc) {
        var file = new File(OUTPUT_PREFLIGHT);
        if (!file.open("w")) throw new Error("Cannot write preflight report");
        file.writeln("artboards=" + doc.artboards.length);
        file.writeln("layers=" + doc.layers.length);
        file.writeln("placed_images=" + placedCount);
        file.writeln("missing_images=" + missingCount);
        file.writeln("route_elements=" + routeElementCount);
        file.writeln("fit_mode=contain_only");
        file.writeln("document_color_space=RGB");
        file.writeln("output_ai=" + OUTPUT_AI);
        file.close();
    }

    function main() {
        app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;
        var logFile = new File(LOG_PATH);
        if (logFile.exists) logFile.remove();
        log("Build started");

        for (var openIndex = app.documents.length - 1; openIndex >= 0; openIndex--) {
            try {
                if (app.documents[openIndex].saved && app.documents[openIndex].fullName.fsName === new File(OUTPUT_AI).fsName) {
                    app.documents[openIndex].close(SaveOptions.DONOTSAVECHANGES);
                }
            } catch (ignoreOpenDocument) {}
        }

        regularFont = fontByNames(["PingFangSC-Regular", "NotoSansCJKsc-Regular", "ArialMT"]);
        semiboldFont = fontByNames(["PingFangSC-Semibold", "NotoSansCJKsc-Bold", "Arial-BoldMT"]);

        var doc = app.documents.add(DocumentColorSpace.RGB, W, boards[0].height);
        doc.name = "南头古城-古城漫游AR导航-SelectedWorks短案例";
        makeArtboards(doc);

        var graphicsLayer = doc.layers[0];
        graphicsLayer.name = "02-GRAPHICS";
        var imageLayer = doc.layers.add();
        imageLayer.name = "03-IMAGES";
        var typeLayer = doc.layers.add();
        typeLayer.name = "01-TYPE";
        var annotationLayer = doc.layers.add();
        annotationLayer.name = "04-ANNOTATIONS";
        var guideLayer = doc.layers.add();
        guideLayer.name = "00-GUIDES";

        buildContext(typeLayer, graphicsLayer, imageLayer, annotationLayer, boards[0]);
        buildRouteSystem(typeLayer, graphicsLayer, imageLayer, boards[1]);
        buildJourney(typeLayer, graphicsLayer, imageLayer, boards[2]);
        addPageDecor(typeLayer, graphicsLayer, boards[0], "B01-DECO", 1, false);
        addPageDecor(typeLayer, graphicsLayer, boards[1], "B02-DECO", 2, true);
        addPageDecor(typeLayer, graphicsLayer, boards[2], "B03-DECO", 3, false);

        guideLayer.visible = true;
        annotationLayer.visible = true;
        app.redraw();

        var saveOptions = new IllustratorSaveOptions();
        saveOptions.compatibility = Compatibility.ILLUSTRATOR24;
        saveOptions.pdfCompatible = true;
        doc.saveAs(new File(OUTPUT_AI), saveOptions);
        log("AI saved");

        var png = new ExportOptionsPNG24();
        png.antiAliasing = true;
        png.transparency = false;
        png.artBoardClipping = false;
        png.horizontalScale = 78;
        png.verticalScale = 78;
        doc.exportFile(new File(OUTPUT_PREVIEW), ExportType.PNG24, png);
        log("Preview exported");

        writePreflight(doc);
        doc.save();
        doc.artboards.setActiveArtboardIndex(0);
        app.redraw();
        log("Build finished");
        app.userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;
    }

    try {
        main();
    } catch (error) {
        log("FATAL: " + error + (error && error.line ? " line=" + error.line : ""));
        try { app.userInteractionLevel = UserInteractionLevel.DISPLAYALERTS; } catch (ignore) {}
        throw error;
    }
})();
