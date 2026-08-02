#target illustrator

(function () {
    var OUTPUT_DIR = "/Users/ttao/Documents/作品集";
    var OUTPUT_AI = OUTPUT_DIR + "/SmallRig-焦点计划-SelectedWorks短案例.ai";
    var OUTPUT_PREVIEW = OUTPUT_DIR + "/SmallRig-焦点计划-SelectedWorks短案例-preview.png";
    var OUTPUT_PREFLIGHT = OUTPUT_DIR + "/SmallRig-焦点计划-SelectedWorks短案例-preflight.txt";
    var LOG_PATH = OUTPUT_DIR + "/SmallRig-焦点计划-构建日志.txt";
    var REPO = "/Users/ttao/Documents/Codex/2026-07-11/new-chat/outputs/portfolio-v4-source-shwung";
    var ASSET_DIR = REPO + "/assets/selected-works/smallrig-focus";

    var ASSETS = {
        cover: ASSET_DIR + "/page-01-cover.jpg",
        logo: ASSET_DIR + "/page-02-logo.jpg",
        color: ASSET_DIR + "/page-04-color.jpg",
        photoSystem: ASSET_DIR + "/page-06-photo-system.jpg",
        photoApplication: ASSET_DIR + "/page-07-photo-application.jpg",
        keychain: ASSET_DIR + "/page-10-keychain.jpg",
        ipKeychain: ASSET_DIR + "/page-11-ip-keychain.jpg",
        umbrella: ASSET_DIR + "/page-12-umbrella.jpg"
    };

    var W = 1440;
    var GAP = 80;
    var boards = [
        { name: "01-STRATEGY", height: 900 },
        { name: "02-VISUAL-IP", height: 900 },
        { name: "03-CAMPAIGN-APPLICATION", height: 900 }
    ];

    var COLORS = {
        black: [10, 10, 10],
        blackSoft: [22, 22, 22],
        white: [250, 249, 246],
        paper: [244, 242, 236],
        gray: [188, 188, 188],
        grayDark: [90, 90, 90],
        red: [211, 34, 40],
        redDark: [126, 10, 17],
        redPale: [249, 216, 216]
    };

    var regularFont;
    var semiboldFont;
    var placedCount = 0;
    var missingCount = 0;
    var containViolations = 0;
    var vectorElementCount = 0;
    var textFrames = [];

    function log(message) {
        try {
            var file = new File(LOG_PATH);
            if (file.open("a")) {
                file.writeln("[" + new Date() + "] " + message);
                file.close();
            }
        } catch (ignore) {}
    }

    function ensureFolder(path) {
        var folder = new Folder(path);
        if (!folder.exists && !folder.create()) throw new Error("Cannot create output folder: " + path);
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
        vectorElementCount++;
        return item;
    }

    function addEllipse(layer, name, board, centerX, centerY, radius, fill, stroke, strokeWidth) {
        var item = layer.pathItems.ellipse(globalTop(board, centerY - radius), centerX - radius, radius * 2, radius * 2);
        item.name = name;
        item.filled = !!fill;
        if (fill) item.fillColor = rgb(fill);
        item.stroked = !!stroke;
        if (stroke) {
            item.strokeColor = rgb(stroke);
            item.strokeWidth = strokeWidth || 1;
        }
        vectorElementCount++;
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
        vectorElementCount++;
        return line;
    }

    function addPolyline(layer, name, board, points, color, width) {
        var converted = [];
        for (var i = 0; i < points.length; i++) converted.push([points[i][0], globalTop(board, points[i][1])]);
        var path = layer.pathItems.add();
        path.name = name;
        path.setEntirePath(converted);
        path.closed = false;
        path.filled = false;
        path.stroked = true;
        path.strokeColor = rgb(color);
        path.strokeWidth = width || 2;
        path.strokeCap = StrokeCap.ROUNDENDCAP;
        path.strokeJoin = StrokeJoin.ROUNDENDJOIN;
        vectorElementCount++;
        return path;
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
        textFrames.push(frame);
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
        textFrames.push(frame);
        return frame;
    }

    function fitContain(item, rect) {
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
        bounds = item.geometricBounds;
        if (bounds[0] < rect[0] - 1 || bounds[2] > rect[2] + 1 || bounds[1] > rect[1] + 1 || bounds[3] < rect[3] - 1) containViolations++;
    }

    function placeImageContain(layer, name, board, path, x, y, width, height) {
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
        group.name = name + "-CONTAIN";
        var placed = group.placedItems.add();
        placed.name = name;
        placed.file = file;
        fitContain(placed, rect);
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

    function addFrameCorners(layer, prefix, board, x, y, width, height, color, length, strokeWidth) {
        var len = length || 26;
        var sw = strokeWidth || 2;
        addLine(layer, prefix + "-TL-H", board, x, y, x + len, y, color, sw);
        addLine(layer, prefix + "-TL-V", board, x, y, x, y + len, color, sw);
        addLine(layer, prefix + "-TR-H", board, x + width - len, y, x + width, y, color, sw);
        addLine(layer, prefix + "-TR-V", board, x + width, y, x + width, y + len, color, sw);
        addLine(layer, prefix + "-BL-H", board, x, y + height, x + len, y + height, color, sw);
        addLine(layer, prefix + "-BL-V", board, x, y + height - len, x, y + height, color, sw);
        addLine(layer, prefix + "-BR-H", board, x + width - len, y + height, x + width, y + height, color, sw);
        addLine(layer, prefix + "-BR-V", board, x + width, y + height - len, x + width, y + height, color, sw);
    }

    function addFocusMark(layer, prefix, board, x, y, radius, color) {
        addEllipse(layer, prefix + "-RING", board, x, y, radius, null, color, 1.5);
        addLine(layer, prefix + "-H", board, x - radius - 12, y, x + radius + 12, y, color, 1.2);
        addLine(layer, prefix + "-V", board, x, y - radius - 12, x, y + radius + 12, color, 1.2);
        addEllipse(layer, prefix + "-DOT", board, x, y, 4, color, null, 0);
    }

    function addIpCharacter(layer, prefix, board, x, y, scale, color, lineColor) {
        var s = scale;
        var head = layer.pathItems.add();
        head.name = prefix + "-HEAD";
        head.setEntirePath([
            [x, globalTop(board, y)],
            [x + 78 * s, globalTop(board, y + 10 * s)],
            [x + 72 * s, globalTop(board, y + 70 * s)],
            [x + 6 * s, globalTop(board, y + 64 * s)]
        ]);
        head.closed = true;
        head.filled = true;
        head.fillColor = rgb(color);
        head.stroked = false;
        vectorElementCount++;
        addEllipse(layer, prefix + "-EYE-L", board, x + 25 * s, y + 34 * s, 5 * s, COLORS.white, null, 0);
        addEllipse(layer, prefix + "-EYE-R", board, x + 52 * s, y + 38 * s, 5 * s, COLORS.white, null, 0);
        addLine(layer, prefix + "-LEG-L", board, x + 22 * s, y + 66 * s, x + 17 * s, y + 132 * s, lineColor, 7 * s);
        addLine(layer, prefix + "-LEG-M", board, x + 40 * s, y + 68 * s, x + 42 * s, y + 136 * s, lineColor, 7 * s);
        addLine(layer, prefix + "-LEG-R", board, x + 58 * s, y + 68 * s, x + 67 * s, y + 132 * s, lineColor, 7 * s);
        addPolyline(layer, prefix + "-ARM-L", board, [[x + 8 * s, y + 40 * s], [x - 12 * s, y + 50 * s], [x - 18 * s, y + 30 * s]], lineColor, 6 * s);
        addPolyline(layer, prefix + "-ARM-R", board, [[x + 72 * s, y + 43 * s], [x + 91 * s, y + 55 * s], [x + 97 * s, y + 37 * s]], lineColor, 6 * s);
    }

    function addTag(typeLayer, graphicsLayer, prefix, board, text, x, y, width, filled) {
        addRect(graphicsLayer, prefix + "-BG", board, x, y, width, 30, filled ? COLORS.red : null, filled ? null : COLORS.red, 1.2);
        addAreaText(typeLayer, prefix + "-TEXT", board, text, x + 12, y + 8, width - 24, 16, 9, filled ? COLORS.white : COLORS.red, 11, true, 80);
    }

    function addPageDecor(typeLayer, graphicsLayer, board, index, dark) {
        var foreground = dark ? COLORS.white : COLORS.black;
        addPointText(typeLayer, "PAGE-" + index, board, "SELECTED WORKS / SMALLRIG / 0" + index, 72, 860, 9, foreground, true, 130);
        addPointText(typeLayer, "META-" + index, board, "FOCUS / FRAME / RED", 1172, 860, 9, COLORS.red, true, 110);
        addLine(graphicsLayer, "PAGE-LINE-" + index, board, 72, 836, 1368, 836, dark ? COLORS.grayDark : [210, 207, 200], 0.8);
        addEllipse(graphicsLayer, "PAGE-DOT-" + index, board, 1100, 832, 4, COLORS.red, null, 0);
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

    function buildStrategy(typeLayer, graphicsLayer, imageLayer, annotationLayer, board) {
        addRect(graphicsLayer, "B01-BG", board, 0, 0, W, board.height, COLORS.black, null, 0);
        addPointText(typeLayer, "B01-KICKER", board, "BRAND CAMPAIGN / VISUAL IDENTITY / CONTENT PLANNING", 72, 68, 10, COLORS.gray, true, 120);
        addAreaText(typeLayer, "B01-TITLE", board, "把摄影器材品牌，\r变成可参与的\r内容事件。", 72, 112, 450, 218, 48, COLORS.white, 56, true, -30);
        addAreaText(typeLayer, "B01-BODY", board, "SmallRig 需要在产品功能之外建立更具参与感的品牌内容。方案以摄影创作者活动为载体，用黑白影像承载生活观察，以品牌红定位焦点。", 72, 370, 430, 124, 15, COLORS.gray, 27, false, 0);
        addAreaText(typeLayer, "B01-STRATEGY-LABEL", board, "CORE STRATEGY", 72, 532, 180, 18, 9, COLORS.red, 12, true, 120);
        addAreaText(typeLayer, "B01-STRATEGY", board, "在灰调世界增加一抹红色。", 72, 560, 430, 42, 23, COLORS.white, 28, true, -10);
        addAreaText(typeLayer, "B01-ROLE-LABEL", board, "ROLE", 72, 652, 80, 18, 9, COLORS.gray, 12, true, 120);
        addAreaText(typeLayer, "B01-ROLE", board, "负责活动概念、视觉系统、活动 IP、\r内容传播与周边应用设计。", 72, 680, 430, 64, 14, COLORS.white, 23, true, 0);
        placeImageContain(imageLayer, "B01-COVER", board, ASSETS.cover, 560, 112, 808, 455);
        addFrameCorners(graphicsLayer, "B01-COVER-FRAME", board, 560, 112, 808, 455, COLORS.red, 32, 2);
        addFocusMark(graphicsLayer, "B01-FOCUS", board, 1190, 646, 34, COLORS.red);
        addLine(graphicsLayer, "B01-FOCUS-LINE", board, 540, 618, 1210, 618, COLORS.red, 1);
        addTag(typeLayer, graphicsLayer, "B01-TAG-A", board, "SEARCH FOR THE FOCUS OF LIFE", 560, 662, 312, true);
        addTag(typeLayer, graphicsLayer, "B01-TAG-B", board, "BLACK & WHITE + BRAND RED", 890, 662, 270, false);
        addAreaText(annotationLayer, "B01-NOTE", board, "从产品功能转向品牌参与感", 1168, 715, 200, 22, 10, COLORS.gray, 13, false, 20, Justification.RIGHT);
        addPageDecor(typeLayer, graphicsLayer, board, 1, true);
    }

    function buildVisualIp(typeLayer, graphicsLayer, imageLayer, annotationLayer, board) {
        addRect(graphicsLayer, "B02-BG", board, 0, 0, W, board.height, COLORS.paper, null, 0);
        addPointText(typeLayer, "B02-KICKER", board, "02 / VISUAL SYSTEM & ACTIVITY IP", 72, 64, 10, COLORS.grayDark, true, 120);
        addAreaText(typeLayer, "B02-TITLE", board, "把品牌基因，\r转成活动角色。", 72, 105, 420, 116, 42, COLORS.black, 49, true, -25);
        addAreaText(typeLayer, "B02-BODY", board, "活动标志提取三脚架与品牌红；角色 IP 延续器材结构，以可伸缩的高矮变化建立角色家族，让专业摄影品牌拥有更亲和的活动表达。", 72, 255, 400, 112, 14, COLORS.grayDark, 25, false, 0);
        addTag(typeLayer, graphicsLayer, "B02-TAG-A", board, "BRAND DNA", 72, 405, 134, true);
        addTag(typeLayer, graphicsLayer, "B02-TAG-B", board, "ACTIVITY LOGO", 218, 405, 154, false);
        addTag(typeLayer, graphicsLayer, "B02-TAG-C", board, "CHARACTER IP", 384, 405, 156, false);
        addIpCharacter(graphicsLayer, "B02-IP-LARGE", board, 138, 494, 1.25, COLORS.red, COLORS.red);
        addIpCharacter(graphicsLayer, "B02-IP-MID", board, 310, 542, 0.90, COLORS.red, COLORS.red);
        addIpCharacter(graphicsLayer, "B02-IP-SMALL", board, 440, 586, 0.62, COLORS.red, COLORS.red);
        addAreaText(annotationLayer, "B02-IP-NOTE", board, "三脚架的结构特征\r成为角色比例系统", 72, 730, 390, 48, 12, COLORS.black, 20, true, 0);
        placeImageContain(imageLayer, "B02-LOGO", board, ASSETS.logo, 610, 98, 758, 426);
        placeImageContain(imageLayer, "B02-COLOR", board, ASSETS.color, 610, 548, 758, 270);
        addFrameCorners(graphicsLayer, "B02-LOGO-FRAME", board, 610, 98, 758, 426, COLORS.red, 28, 1.5);
        addFrameCorners(graphicsLayer, "B02-COLOR-FRAME", board, 610, 548, 758, 270, COLORS.black, 24, 1.2);
        addFocusMark(graphicsLayer, "B02-FOCUS", board, 560, 468, 24, COLORS.red);
        addPageDecor(typeLayer, graphicsLayer, board, 2, false);
    }

    function addImageTile(typeLayer, graphicsLayer, imageLayer, board, prefix, asset, x, y, width, height, label, index) {
        placeImageContain(imageLayer, prefix + "-IMAGE", board, asset, x, y, width, height);
        addFrameCorners(graphicsLayer, prefix + "-FRAME", board, x, y, width, height, COLORS.red, 18, 1.5);
        addRect(graphicsLayer, prefix + "-INDEX-BG", board, x, y, 42, 25, COLORS.red, null, 0);
        addAreaText(typeLayer, prefix + "-INDEX", board, index, x + 10, y + 7, 24, 13, 9, COLORS.white, 11, true, 60);
        addAreaText(typeLayer, prefix + "-LABEL", board, label, x, y + height + 10, width, 22, 10, COLORS.white, 13, true, 90);
    }

    function buildApplications(typeLayer, graphicsLayer, imageLayer, annotationLayer, board) {
        addRect(graphicsLayer, "B03-BG", board, 0, 0, W, board.height, COLORS.black, null, 0);
        addPointText(typeLayer, "B03-KICKER", board, "03 / CAMPAIGN CONTENT & APPLICATION", 72, 62, 10, COLORS.gray, true, 120);
        addAreaText(typeLayer, "B03-TITLE", board, "从一抹红，延伸到每个参与触点。", 72, 96, 780, 56, 38, COLORS.white, 45, true, -20);
        addAreaText(typeLayer, "B03-BODY", board, "统一的红色焦点从摄影内容进入钥匙扣、IP 衍生与活动奖品，让内容、物件和现场触点共享同一套识别语言。", 920, 98, 448, 64, 12, COLORS.gray, 21, false, 0);

        addImageTile(typeLayer, graphicsLayer, imageLayer, board, "B03-TILE-A", ASSETS.photoSystem, 72, 190, 616, 347, "PHOTOGRAPHY SYSTEM / 红色主体", "01");
        addImageTile(typeLayer, graphicsLayer, imageLayer, board, "B03-TILE-B", ASSETS.photoApplication, 728, 190, 640, 347, "CONTENT APPLICATION / 城市观察", "02");
        addImageTile(typeLayer, graphicsLayer, imageLayer, board, "B03-TILE-C", ASSETS.keychain, 72, 570, 400, 210, "MAIN MERCH / 主打周边", "03");
        addImageTile(typeLayer, graphicsLayer, imageLayer, board, "B03-TILE-D", ASSETS.ipKeychain, 520, 570, 400, 210, "IP DERIVATIVE / 角色衍生", "04");
        addImageTile(typeLayer, graphicsLayer, imageLayer, board, "B03-TILE-E", ASSETS.umbrella, 968, 570, 400, 210, "PARTICIPATION TOUCHPOINT / 活动奖品", "05");
        addLine(graphicsLayer, "B03-CONNECT-A", board, 688, 572, 728, 572, COLORS.red, 1.5);
        addEllipse(graphicsLayer, "B03-CONNECT-DOT-A", board, 708, 572, 4, COLORS.red, null, 0);
        addFocusMark(graphicsLayer, "B03-FOCUS", board, 1390, 565, 20, COLORS.red);
        addAreaText(annotationLayer, "B03-NOTE", board, "CONTENT → OBJECT → EXPERIENCE", 1020, 570, 348, 20, 9, COLORS.red, 12, true, 100, Justification.RIGHT);
        addPageDecor(typeLayer, graphicsLayer, board, 3, true);
    }

    function countOverset() {
        var count = 0;
        for (var i = 0; i < textFrames.length; i++) {
            try { if (textFrames[i].overflows) count++; } catch (ignore) {}
        }
        return count;
    }

    function writePreflight(doc) {
        var file = new File(OUTPUT_PREFLIGHT);
        if (!file.open("w")) throw new Error("Cannot write preflight report");
        file.writeln("artboards=" + doc.artboards.length);
        file.writeln("layers=" + doc.layers.length);
        file.writeln("placed_images=" + placedCount);
        file.writeln("missing_images=" + missingCount);
        file.writeln("contain_violations=" + containViolations);
        file.writeln("overset=" + countOverset());
        file.writeln("vector_elements=" + vectorElementCount);
        file.writeln("fit_mode=contain_only");
        file.writeln("paid_wave_asset_used=0");
        file.writeln("document_color_space=RGB");
        file.writeln("output_ai_name=SmallRig-Focus-SelectedWorks.ai");
        file.close();
    }

    function closeExistingOutput() {
        for (var i = app.documents.length - 1; i >= 0; i--) {
            try {
                if (app.documents[i].saved && app.documents[i].fullName.fsName === new File(OUTPUT_AI).fsName) {
                    app.documents[i].close(SaveOptions.DONOTSAVECHANGES);
                }
            } catch (ignore) {}
        }
    }

    function main() {
        app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;
        ensureFolder(OUTPUT_DIR);
        var oldLog = new File(LOG_PATH);
        if (oldLog.exists) oldLog.remove();
        log("Build started");
        closeExistingOutput();

        regularFont = fontByNames(["PingFangSC-Regular", "NotoSansCJKsc-Regular", "ArialMT"]);
        semiboldFont = fontByNames(["PingFangSC-Semibold", "NotoSansCJKsc-Bold", "Arial-BoldMT"]);

        var doc = app.documents.add(DocumentColorSpace.RGB, W, boards[0].height);
        doc.name = "SmallRig-焦点计划-SelectedWorks短案例";
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

        buildStrategy(typeLayer, graphicsLayer, imageLayer, annotationLayer, boards[0]);
        buildVisualIp(typeLayer, graphicsLayer, imageLayer, annotationLayer, boards[1]);
        buildApplications(typeLayer, graphicsLayer, imageLayer, annotationLayer, boards[2]);

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
