#target illustrator

(function () {
    var OUTPUT_DIR = "/Users/ttao/Documents/作品集";
    var OUTPUT_AI = OUTPUT_DIR + "/大神龛-数字榫卯交互装置-SelectedWorks独立案例.ai";
    var OUTPUT_PREVIEW = OUTPUT_DIR + "/大神龛-数字榫卯交互装置-SelectedWorks独立案例-preview.png";
    var OUTPUT_PREFLIGHT = OUTPUT_DIR + "/大神龛-数字榫卯交互装置-SelectedWorks独立案例-preflight.txt";
    var LOG_PATH = OUTPUT_DIR + "/大神龛-数字榫卯交互装置-构建日志.txt";
    var REPO = "/Users/ttao/Documents/Codex/2026-07-11/new-chat/outputs/portfolio-v4-source-shwung";
    var ASSET_DIR = REPO + "/assets/selected-works/digital-mortise";

    var ASSETS = {
        cover: ASSET_DIR + "/page-01-cover.jpg",
        research: ASSET_DIR + "/page-04-research.jpg",
        userTask: ASSET_DIR + "/page-05-user-task.jpg",
        wireframe: ASSET_DIR + "/page-07-wireframe.jpg",
        arduino: ASSET_DIR + "/page-09-arduino.jpg",
        uiOverview: ASSET_DIR + "/page-10-ui-overview.jpg",
        uiFlow: ASSET_DIR + "/page-11-ui-flow.jpg",
        uiStates: ASSET_DIR + "/page-14-ui-states.jpg",
        deviceSystem: ASSET_DIR + "/page-15-device-system.jpg",
        lighting: ASSET_DIR + "/page-16-lighting.jpg",
        prototype: ASSET_DIR + "/page-17-prototype.jpg"
    };

    var W = 1440;
    var GAP = 80;
    var boards = [
        { name: "01-OVERVIEW", height: 900 },
        { name: "02-CONTEXT", height: 900 },
        { name: "03-IA-FLOW", height: 900 },
        { name: "04-UI-SYSTEM", height: 900 },
        { name: "05-DIGITAL-PHYSICAL", height: 900 },
        { name: "06-PROTOTYPE", height: 900 }
    ];

    var COLORS = {
        charcoal: [18, 17, 16],
        charcoalSoft: [31, 28, 25],
        woodDeep: [43, 23, 14],
        wood: [88, 45, 22],
        woodLight: [145, 82, 38],
        gold: [236, 165, 47],
        goldSoft: [247, 205, 119],
        ivory: [247, 242, 229],
        paper: [239, 231, 211],
        sand: [195, 172, 136],
        gray: [151, 145, 134],
        white: [255, 252, 246],
        jade: [84, 119, 98]
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

    function addRect(layer, name, board, x, y, width, height, fill, stroke, strokeWidth, radius) {
        var item;
        if (radius && radius > 0) {
            item = layer.pathItems.roundedRectangle(globalTop(board, y), x, width, height, radius, radius);
        } else {
            item = layer.pathItems.rectangle(globalTop(board, y), x, width, height);
        }
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

    function placeImageContain(layer, name, board, filePath, x, y, width, height) {
        var file = new File(filePath);
        if (!file.exists) {
            missingCount++;
            log("Missing image: " + filePath);
            return null;
        }
        var left = x;
        var top = globalTop(board, y);
        var rect = [left, top, left + width, top - height];
        var placed = layer.placedItems.add();
        placed.name = name + "-CONTAIN";
        placed.file = file;
        fitContain(placed, rect);
        placedCount++;
        return placed;
    }

    function addJointLine(layer, name, board, points, color, width) {
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
        path.strokeJoin = StrokeJoin.MITERENDJOIN;
        vectorElementCount++;
        return path;
    }

    function addNode(layer, name, board, x, y, radius, fill, stroke) {
        addEllipse(layer, name + "-OUTER", board, x, y, radius, fill, stroke, 1.2);
        if (radius > 5) addEllipse(layer, name + "-INNER", board, x, y, radius * 0.34, stroke || COLORS.gold, null, 0);
    }

    function addSignalFlow(typeLayer, graphicsLayer, name, board, points, labels, color) {
        addJointLine(graphicsLayer, name + "-PATH", board, points, color, 2);
        for (var i = 0; i < points.length; i++) {
            addNode(graphicsLayer, name + "-NODE-" + i, board, points[i][0], points[i][1], i === 0 || i === points.length - 1 ? 9 : 7, COLORS.charcoalSoft, color);
            if (labels && labels[i]) {
                addAreaText(typeLayer, name + "-LABEL-" + i, board, labels[i], points[i][0] - 72, points[i][1] + 20, 144, 28, 10, COLORS.ivory, 13, true, 40, Justification.CENTER);
            }
        }
    }

    function addImageFrame(graphicsLayer, name, board, x, y, width, height, color) {
        var len = 25;
        addLine(graphicsLayer, name + "-TL-H", board, x, y, x + len, y, color, 1.6);
        addLine(graphicsLayer, name + "-TL-V", board, x, y, x, y + len, color, 1.6);
        addLine(graphicsLayer, name + "-TR-H", board, x + width - len, y, x + width, y, color, 1.6);
        addLine(graphicsLayer, name + "-TR-V", board, x + width, y, x + width, y + len, color, 1.6);
        addLine(graphicsLayer, name + "-BL-H", board, x, y + height, x + len, y + height, color, 1.6);
        addLine(graphicsLayer, name + "-BL-V", board, x, y + height - len, x, y + height, color, 1.6);
        addLine(graphicsLayer, name + "-BR-H", board, x + width - len, y + height, x + width, y + height, color, 1.6);
        addLine(graphicsLayer, name + "-BR-V", board, x + width, y + height - len, x + width, y + height, color, 1.6);
    }

    function addPill(typeLayer, graphicsLayer, name, board, label, x, y, width, fill, textColor) {
        addRect(graphicsLayer, name + "-BG", board, x, y, width, 30, fill, null, 0, 15);
        addAreaText(typeLayer, name + "-TEXT", board, label, x + 10, y + 8, width - 20, 14, 9, textColor, 11, true, 75, Justification.CENTER);
    }

    function addBoardHeader(typeLayer, graphicsLayer, board, index, kicker, title, dark) {
        var primary = dark ? COLORS.ivory : COLORS.charcoal;
        var secondary = dark ? COLORS.sand : COLORS.wood;
        addPointText(typeLayer, "B" + index + "-INDEX", board, "0" + index, 72, 68, 12, COLORS.gold, true, 120);
        addPointText(typeLayer, "B" + index + "-KICKER", board, kicker, 124, 68, 10, secondary, true, 110);
        addAreaText(typeLayer, "B" + index + "-TITLE", board, title, 72, 100, 820, 70, 40, primary, 48, true, -25);
        addJointLine(graphicsLayer, "B" + index + "-HEADER-JOINT", board, [[1110, 72], [1250, 72], [1250, 92], [1368, 92]], COLORS.gold, 2);
        addNode(graphicsLayer, "B" + index + "-HEADER-NODE", board, 1250, 72, 6, dark ? COLORS.charcoal : COLORS.paper, COLORS.gold);
    }

    function addPageDecor(typeLayer, graphicsLayer, board, index, dark) {
        var textColor = dark ? COLORS.sand : COLORS.wood;
        addLine(graphicsLayer, "PAGE-LINE-" + index, board, 72, 840, 1368, 840, dark ? COLORS.woodLight : COLORS.sand, 0.8);
        addPointText(typeLayer, "PAGE-LEFT-" + index, board, "SELECTED WORKS / DIGITAL MORTISE", 72, 864, 9, textColor, true, 120);
        addPointText(typeLayer, "PAGE-RIGHT-" + index, board, "UI × ARDUINO × PHYSICAL", 1120, 864, 9, COLORS.gold, true, 90);
        addNode(graphicsLayer, "PAGE-NODE-" + index, board, 1092, 837, 4, dark ? COLORS.charcoal : COLORS.paper, COLORS.gold);
    }

    function makeArtboards(doc) {
        var cursorTop = 7000;
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

    function buildOverview(typeLayer, graphicsLayer, imageLayer, annotationLayer, board) {
        addRect(graphicsLayer, "B01-BG", board, 0, 0, W, board.height, COLORS.charcoal, null, 0);
        addRect(graphicsLayer, "B01-WOOD-BAND", board, 0, 0, 28, board.height, COLORS.wood, null, 0);
        addPointText(typeLayer, "B01-META", board, "INTERACTIVE INSTALLATION / UI DESIGN / ARDUINO PROTOTYPE", 72, 64, 10, COLORS.goldSoft, true, 105);
        addAreaText(typeLayer, "B01-TITLE", board, "数字榫卯，\r重构木艺基因", 72, 112, 430, 126, 47, COLORS.ivory, 55, true, -35);
        addAreaText(typeLayer, "B01-SUBTITLE", board, "关于木雕传统工艺的科普向交互设计", 72, 260, 430, 30, 14, COLORS.sand, 19, false, 20);
        addAreaText(typeLayer, "B01-NARRATIVE", board, "把木雕知识从静态观看转化为可操作、可反馈、可感知的数字体验，让传统木艺通过界面、灯光与实体装置重新被理解。", 72, 338, 430, 116, 16, COLORS.ivory, 28, false, 0);
        addPointText(typeLayer, "B01-ROLE-LABEL", board, "ROLE / 项目职责", 72, 520, 10, COLORS.gold, true, 100);
        addAreaText(typeLayer, "B01-ROLE", board, "负责项目策划、资料研究、信息架构、交互流程、UI 视觉、Arduino 程序与实体原型设计。", 72, 550, 430, 82, 13, COLORS.sand, 23, false, 0);
        addPill(typeLayer, graphicsLayer, "B01-PILL-A", board, "传统文化科普", 72, 682, 132, COLORS.wood, COLORS.ivory);
        addPill(typeLayer, graphicsLayer, "B01-PILL-B", board, "桌面端交互 UI", 216, 682, 142, COLORS.wood, COLORS.ivory);
        addPill(typeLayer, graphicsLayer, "B01-PILL-C", board, "实体交互原型", 370, 682, 132, COLORS.gold, COLORS.charcoal);
        addRect(graphicsLayer, "B01-IMAGE-BED", board, 550, 104, 818, 540, COLORS.woodDeep, COLORS.woodLight, 1, 8);
        placeImageContain(imageLayer, "B01-COVER", board, ASSETS.cover, 570, 124, 778, 438);
        addImageFrame(graphicsLayer, "B01-COVER-FRAME", board, 570, 124, 778, 438, COLORS.gold);
        addSignalFlow(typeLayer, graphicsLayer, "B01-LOOP", board, [[610, 705], [790, 705], [970, 705], [1150, 705], [1328, 705]], ["选择内容", "浏览知识", "触发交互", "装置反馈", "建立理解"], COLORS.gold);
        addAreaText(annotationLayer, "B01-LOOP-NOTE", board, "INTERACTION LOOP", 570, 650, 200, 18, 9, COLORS.sand, 12, true, 120);
        addPageDecor(typeLayer, graphicsLayer, board, 1, true);
    }

    function buildContext(typeLayer, graphicsLayer, imageLayer, annotationLayer, board) {
        addRect(graphicsLayer, "B02-BG", board, 0, 0, W, board.height, COLORS.paper, null, 0);
        addBoardHeader(typeLayer, graphicsLayer, board, 2, "CONTEXT / CULTURAL PROBLEM", "从静态展陈，到参与式理解。", false);
        addAreaText(typeLayer, "B02-INTRO", board, "传统木雕的信息密度高、结构复杂，但常见展示方式以观看和文字讲解为主。设计需要降低理解门槛，同时保留工艺本身的文化质感。", 72, 202, 370, 125, 14, COLORS.wood, 25, false, 0);
        var issueTitles = ["理解门槛", "参与不足", "结构难感知"];
        var issueBodies = ["木雕构件与文化知识信息量大，缺少清晰入口。", "静态展板难以让观众主动探索并形成记忆。", "工艺关系隐藏在复杂细节中，需要可视化拆解。"];
        for (var i = 0; i < 3; i++) {
            var y = 370 + i * 112;
            addNode(graphicsLayer, "B02-ISSUE-NODE-" + i, board, 88, y + 14, 8, COLORS.paper, COLORS.gold);
            addAreaText(typeLayer, "B02-ISSUE-TITLE-" + i, board, issueTitles[i], 116, y, 200, 24, 13, COLORS.charcoal, 17, true, 30);
            addAreaText(typeLayer, "B02-ISSUE-BODY-" + i, board, issueBodies[i], 116, y + 30, 300, 58, 11, COLORS.wood, 19, false, 0);
            if (i < 2) addLine(graphicsLayer, "B02-ISSUE-LINE-" + i, board, 88, y + 24, 88, y + 124, COLORS.gold, 1.2);
        }
        addAreaText(annotationLayer, "B02-DESIGN-QUESTION", board, "DESIGN QUESTION\r如何让传统工艺被看见、被操作、被记住？", 72, 724, 365, 60, 12, COLORS.charcoal, 20, true, 20);
        addRect(graphicsLayer, "B02-R-A", board, 484, 198, 884, 276, COLORS.ivory, COLORS.sand, 1, 6);
        placeImageContain(imageLayer, "B02-RESEARCH", board, ASSETS.research, 500, 214, 852, 240);
        addImageFrame(graphicsLayer, "B02-R-A-FRAME", board, 500, 214, 852, 240, COLORS.woodLight);
        addRect(graphicsLayer, "B02-R-B", board, 484, 496, 884, 298, COLORS.ivory, COLORS.sand, 1, 6);
        placeImageContain(imageLayer, "B02-USERS", board, ASSETS.userTask, 500, 512, 852, 266);
        addImageFrame(graphicsLayer, "B02-R-B-FRAME", board, 500, 512, 852, 266, COLORS.gold);
        addPill(typeLayer, graphicsLayer, "B02-TAG-A", board, "背景与问题", 500, 174, 112, COLORS.wood, COLORS.ivory);
        addPill(typeLayer, graphicsLayer, "B02-TAG-B", board, "用户与目标", 500, 472, 112, COLORS.gold, COLORS.charcoal);
        addPageDecor(typeLayer, graphicsLayer, board, 2, false);
    }

    function buildFlow(typeLayer, graphicsLayer, imageLayer, annotationLayer, board) {
        addRect(graphicsLayer, "B03-BG", board, 0, 0, W, board.height, COLORS.charcoalSoft, null, 0);
        addBoardHeader(typeLayer, graphicsLayer, board, 3, "INFORMATION ARCHITECTURE / INTERACTION FLOW", "把复杂知识，组织成可操作的路径。", true);
        addAreaText(typeLayer, "B03-BODY", board, "界面不只负责展示内容，还要把用户动作转译为装置反馈。流程以知识选择为入口，通过空间浏览、触发事件与灯光响应形成连续体验。", 930, 108, 438, 66, 12, COLORS.sand, 21, false, 0);
        addRect(graphicsLayer, "B03-IMG-A-BED", board, 72, 205, 612, 350, COLORS.woodDeep, COLORS.woodLight, 1, 6);
        placeImageContain(imageLayer, "B03-WIREFRAME", board, ASSETS.wireframe, 88, 221, 580, 318);
        addRect(graphicsLayer, "B03-IMG-B-BED", board, 724, 205, 644, 350, COLORS.woodDeep, COLORS.woodLight, 1, 6);
        placeImageContain(imageLayer, "B03-FLOW-SOURCE", board, ASSETS.uiFlow, 740, 221, 612, 318);
        addImageFrame(graphicsLayer, "B03-IMG-A-FRAME", board, 88, 221, 580, 318, COLORS.gold);
        addImageFrame(graphicsLayer, "B03-IMG-B-FRAME", board, 740, 221, 612, 318, COLORS.gold);
        addPill(typeLayer, graphicsLayer, "B03-TAG-A", board, "模型与信息层级", 88, 182, 142, COLORS.wood, COLORS.ivory);
        addPill(typeLayer, graphicsLayer, "B03-TAG-B", board, "交互事件与状态", 740, 182, 142, COLORS.gold, COLORS.charcoal);
        addAreaText(annotationLayer, "B03-FLOW-LABEL", board, "CORE INTERACTION LOOP", 72, 616, 220, 18, 9, COLORS.goldSoft, 12, true, 120);
        addSignalFlow(typeLayer, graphicsLayer, "B03-FLOW", board, [[110, 692], [385, 692], [660, 692], [935, 692], [1210, 692]], ["01 选择内容", "02 浏览知识", "03 触发交互", "04 装置反馈", "05 建立理解"], COLORS.gold);
        addJointLine(graphicsLayer, "B03-RETURN", board, [[1210, 756], [1210, 788], [110, 788], [110, 756]], COLORS.woodLight, 1.2);
        addAreaText(annotationLayer, "B03-RETURN-NOTE", board, "反馈结果重新成为下一次探索的入口", 505, 766, 310, 18, 10, COLORS.sand, 13, false, 30, Justification.CENTER);
        addPageDecor(typeLayer, graphicsLayer, board, 3, true);
    }

    function buildUiSystem(typeLayer, graphicsLayer, imageLayer, annotationLayer, board) {
        addRect(graphicsLayer, "B04-BG", board, 0, 0, W, board.height, COLORS.ivory, null, 0);
        addBoardHeader(typeLayer, graphicsLayer, board, 4, "UI VISUAL SYSTEM / STATES", "用木色、光感与层级建立沉浸界面。", false);
        addAreaText(typeLayer, "B04-BODY", board, "视觉系统提取木雕的深棕与鎏金质感，以高对比信息层级承载复杂知识；交互状态通过光线跟随、局部放大和内容切换回应操作。", 914, 108, 454, 66, 12, COLORS.wood, 21, false, 0);
        addRect(graphicsLayer, "B04-MAIN-BED", board, 72, 202, 820, 480, COLORS.charcoal, COLORS.woodLight, 1, 8);
        placeImageContain(imageLayer, "B04-UI-MAIN", board, ASSETS.uiOverview, 90, 220, 784, 441);
        addImageFrame(graphicsLayer, "B04-MAIN-FRAME", board, 90, 220, 784, 441, COLORS.gold);
        addRect(graphicsLayer, "B04-STATES-BED", board, 930, 202, 438, 266, COLORS.paper, COLORS.sand, 1, 8);
        placeImageContain(imageLayer, "B04-UI-STATES", board, ASSETS.uiStates, 946, 218, 406, 228);
        addImageFrame(graphicsLayer, "B04-STATES-FRAME", board, 946, 218, 406, 228, COLORS.woodLight);
        addPointText(typeLayer, "B04-SYSTEM-LABEL", board, "VISUAL TOKENS", 930, 520, 10, COLORS.wood, true, 110);
        var swatches = [COLORS.charcoal, COLORS.gold, COLORS.wood, COLORS.ivory];
        var swatchNames = ["炭黑 / 空间底色", "暖金 / 反馈高光", "木棕 / 文化语义", "象牙白 / 信息层"];
        for (var i = 0; i < swatches.length; i++) {
            addRect(graphicsLayer, "B04-SWATCH-" + i, board, 930, 552 + i * 52, 32, 32, swatches[i], i === 3 ? COLORS.sand : null, 1, 4);
            addAreaText(typeLayer, "B04-SWATCH-TEXT-" + i, board, swatchNames[i], 980, 559 + i * 52, 250, 20, 11, COLORS.charcoal, 14, i === 1, 15);
        }
        addJointLine(graphicsLayer, "B04-TOKEN-LINK", board, [[1260, 568], [1328, 568], [1328, 742], [1260, 742]], COLORS.gold, 1.5);
        addNode(graphicsLayer, "B04-TOKEN-NODE", board, 1328, 655, 7, COLORS.ivory, COLORS.gold);
        addAreaText(annotationLayer, "B04-NOTE", board, "层级 / 状态 / 光感 / 文化识别", 72, 720, 820, 28, 13, COLORS.wood, 18, true, 80, Justification.CENTER);
        addPill(typeLayer, graphicsLayer, "B04-PILL-A", board, "字体层级", 186, 770, 120, COLORS.wood, COLORS.ivory);
        addPill(typeLayer, graphicsLayer, "B04-PILL-B", board, "卡片状态", 330, 770, 120, COLORS.gold, COLORS.charcoal);
        addPill(typeLayer, graphicsLayer, "B04-PILL-C", board, "交互反馈", 474, 770, 120, COLORS.jade, COLORS.ivory);
        addPill(typeLayer, graphicsLayer, "B04-PILL-D", board, "信息提示", 618, 770, 120, COLORS.charcoal, COLORS.ivory);
        addPageDecor(typeLayer, graphicsLayer, board, 4, false);
    }

    function buildDigitalPhysical(typeLayer, graphicsLayer, imageLayer, annotationLayer, board) {
        addRect(graphicsLayer, "B05-BG", board, 0, 0, W, board.height, COLORS.woodDeep, null, 0);
        addBoardHeader(typeLayer, graphicsLayer, board, 5, "DIGITAL INTERFACE × ARDUINO × DEVICE", "一次点击，如何变成一束真实的光？", true);
        addAreaText(typeLayer, "B05-BODY", board, "用户在界面中的选择被转换为按键事件，再由 Arduino 触发对应内容与装置反馈。数字交互与实体空间因此形成同一条体验链路。", 920, 108, 448, 66, 12, COLORS.sand, 21, false, 0);
        addRect(graphicsLayer, "B05-CODE-BED", board, 72, 204, 612, 344, COLORS.charcoal, COLORS.woodLight, 1, 7);
        placeImageContain(imageLayer, "B05-ARDUINO", board, ASSETS.arduino, 88, 220, 580, 312);
        addImageFrame(graphicsLayer, "B05-CODE-FRAME", board, 88, 220, 580, 312, COLORS.gold);
        addRect(graphicsLayer, "B05-DEVICE-BED", board, 724, 204, 644, 344, COLORS.charcoal, COLORS.woodLight, 1, 7);
        placeImageContain(imageLayer, "B05-DEVICE", board, ASSETS.deviceSystem, 740, 220, 612, 312);
        addImageFrame(graphicsLayer, "B05-DEVICE-FRAME", board, 740, 220, 612, 312, COLORS.gold);
        addPill(typeLayer, graphicsLayer, "B05-TAG-A", board, "程序转换", 88, 181, 104, COLORS.gold, COLORS.charcoal);
        addPill(typeLayer, graphicsLayer, "B05-TAG-B", board, "视觉与装置语言", 740, 181, 142, COLORS.woodLight, COLORS.ivory);
        addAreaText(annotationLayer, "B05-SIGNAL-LABEL", board, "SIGNAL TRANSLATION", 72, 610, 220, 18, 9, COLORS.goldSoft, 12, true, 120);
        addSignalFlow(typeLayer, graphicsLayer, "B05-SIGNAL", board, [[135, 692], [430, 692], [725, 692], [1020, 692], [1315, 692]], ["界面输入", "事件映射", "Arduino", "灯光 / 投影", "实体反馈"], COLORS.gold);
        addAreaText(annotationLayer, "B05-TECH-NOTE", board, "选择内容被映射为键盘事件，连接 Spline 界面与装置反馈。", 382, 762, 676, 24, 11, COLORS.sand, 15, false, 30, Justification.CENTER);
        addPageDecor(typeLayer, graphicsLayer, board, 5, true);
    }

    function buildPrototype(typeLayer, graphicsLayer, imageLayer, annotationLayer, board) {
        addRect(graphicsLayer, "B06-BG", board, 0, 0, W, board.height, COLORS.charcoal, null, 0);
        addBoardHeader(typeLayer, graphicsLayer, board, 6, "PHYSICAL PROTOTYPE / FINAL EXPERIENCE", "让传统木艺，被操作、被反馈、被感知。", true);
        addAreaText(typeLayer, "B06-BODY", board, "最终原型把桌面端内容、Arduino 触发和白膜投影整合在同一体验中。观众既能浏览木雕知识，也能通过操作看到光线在实体大神龛上发生变化。", 900, 108, 468, 70, 12, COLORS.sand, 21, false, 0);
        addRect(graphicsLayer, "B06-LIGHT-BED", board, 72, 205, 790, 466, COLORS.woodDeep, COLORS.woodLight, 1, 8);
        placeImageContain(imageLayer, "B06-LIGHTING", board, ASSETS.lighting, 90, 223, 754, 424);
        addImageFrame(graphicsLayer, "B06-LIGHT-FRAME", board, 90, 223, 754, 424, COLORS.gold);
        addRect(graphicsLayer, "B06-PROTO-BED", board, 900, 205, 468, 300, COLORS.woodDeep, COLORS.woodLight, 1, 8);
        placeImageContain(imageLayer, "B06-PROTOTYPE", board, ASSETS.prototype, 916, 221, 436, 245);
        addImageFrame(graphicsLayer, "B06-PROTO-FRAME", board, 916, 221, 436, 245, COLORS.gold);
        addPill(typeLayer, graphicsLayer, "B06-TAG-A", board, "灯光反馈", 90, 181, 104, COLORS.gold, COLORS.charcoal);
        addPill(typeLayer, graphicsLayer, "B06-TAG-B", board, "制作与联动", 916, 181, 112, COLORS.woodLight, COLORS.ivory);
        addPointText(typeLayer, "B06-OUTCOME-LABEL", board, "OUTCOME", 900, 560, 10, COLORS.gold, true, 120);
        addAreaText(typeLayer, "B06-OUTCOME", board, "从静态观看，\r转向可感知的文化体验。", 900, 592, 420, 90, 25, COLORS.ivory, 33, true, -15);
        addAreaText(typeLayer, "B06-OUTCOME-BODY", board, "界面负责组织知识，程序负责连接动作，光线与实体装置负责让反馈真正发生。", 900, 706, 420, 54, 12, COLORS.sand, 21, false, 0);
        addJointLine(graphicsLayer, "B06-CLOSING-JOINT", board, [[72, 738], [72, 786], [820, 786], [820, 738]], COLORS.gold, 2);
        addAreaText(annotationLayer, "B06-CLOSING", board, "DIGITAL KNOWLEDGE  →  PHYSICAL FEEDBACK  →  CULTURAL UNDERSTANDING", 125, 754, 642, 22, 10, COLORS.goldSoft, 14, true, 55, Justification.CENTER);
        addPageDecor(typeLayer, graphicsLayer, board, 6, true);
    }

    function countOverset() {
        var count = 0;
        for (var i = 0; i < textFrames.length; i++) {
            try { if (textFrames[i].overflows) count++; } catch (ignore) {}
        }
        return count;
    }

    function writePreflight(doc, reportPath, stats) {
        var file = new File(reportPath);
        if (!file.open("w")) throw new Error("Cannot write preflight report");
        file.writeln("artboards=" + doc.artboards.length);
        file.writeln("layers=" + doc.layers.length);
        file.writeln("placed_images=" + stats.placedImages);
        file.writeln("missing_images=" + stats.missingImages);
        file.writeln("contain_violations=" + stats.containViolations);
        file.writeln("overset=" + stats.overset);
        file.writeln("vector_elements=" + stats.vectorElements);
        file.writeln("fit_mode=contain_only");
        file.writeln("paid_asset_used=0");
        file.writeln("canva_watermark_used=0");
        file.writeln("color_mode=RGB");
        file.writeln("source_pages=01,04,05,07,09,10,11,14,15,16,17");
        file.writeln("output_ai_name=digital-mortise-interactive-selected-works.ai");
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
        doc.name = "大神龛-数字榫卯交互装置-SelectedWorks独立案例";
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

        buildOverview(typeLayer, graphicsLayer, imageLayer, annotationLayer, boards[0]);
        buildContext(typeLayer, graphicsLayer, imageLayer, annotationLayer, boards[1]);
        buildFlow(typeLayer, graphicsLayer, imageLayer, annotationLayer, boards[2]);
        buildUiSystem(typeLayer, graphicsLayer, imageLayer, annotationLayer, boards[3]);
        buildDigitalPhysical(typeLayer, graphicsLayer, imageLayer, annotationLayer, boards[4]);
        buildPrototype(typeLayer, graphicsLayer, imageLayer, annotationLayer, boards[5]);

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
        png.horizontalScale = 72;
        png.verticalScale = 72;
        doc.exportFile(new File(OUTPUT_PREVIEW), ExportType.PNG24, png);
        log("Preview exported");

        writePreflight(doc, OUTPUT_PREFLIGHT, {
            placedImages: placedCount,
            missingImages: missingCount,
            containViolations: containViolations,
            overset: countOverset(),
            vectorElements: vectorElementCount
        });
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
