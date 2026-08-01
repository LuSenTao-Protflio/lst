#target illustrator

(function () {
    var OUTPUT_DIR = "/Users/ttao/Documents/作品集";
    var OUTPUT_AI = OUTPUT_DIR + "/有请讲书人-读书月活动视觉-作品集-精修版.ai";
    var OUTPUT_PREVIEW = OUTPUT_DIR + "/有请讲书人-读书月活动视觉-作品集-精修版-preview.png";
    var OUTPUT_PREFLIGHT = OUTPUT_DIR + "/有请讲书人-读书月活动视觉-作品集-精修版-preflight.txt";
    var LOG_PATH = OUTPUT_DIR + "/有请讲书人-读书月活动视觉-精修版-构建日志.txt";
    var REPO = "/Users/ttao/Documents/Codex/2026-07-11/new-chat/outputs/portfolio-v4-source-shwung";

    var ASSETS = {
        hero: "/Users/ttao/Downloads/作品集/有请讲书人2025横版主kv.png",
        engagement: REPO + "/assets/portfolio-pages/38.jpg",
        system: REPO + "/assets/portfolio-pages/39.jpg",
        rules: REPO + "/assets/portfolio-pages/40.jpg",
        spatial: REPO + "/assets/portfolio-pages/41.jpg",
        event: REPO + "/assets/portfolio-pages/42.jpg",
        digital: REPO + "/assets/portfolio-pages/43.jpg"
    };

    var W = 1440;
    var GAP = 80;
    var boards = [
        { name: "01-COVER", height: 810 },
        { name: "02-CONTEXT", height: 900 },
        { name: "03-JOURNEY", height: 860 },
        { name: "04-CONCEPT", height: 900 },
        { name: "05-SYSTEM", height: 900 },
        { name: "06-ENGAGEMENT", height: 900 },
        { name: "07-LAYOUT-RULES", height: 900 },
        { name: "08-SPATIAL", height: 900 },
        { name: "09-TOUCHPOINTS", height: 960 },
        { name: "10-GUIDE", height: 780 }
    ];

    var COLORS = {
        paper: [246, 242, 232],
        cream: [238, 215, 149],
        gold: [241, 202, 95],
        copper: [213, 131, 70],
        orange: [221, 93, 41],
        blue: [104, 135, 190],
        deepBlue: [45, 80, 147],
        ink: [39, 31, 25],
        muted: [112, 98, 85],
        white: [255, 255, 255],
        black: [18, 17, 16],
        paleBlue: [218, 227, 242]
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
        return line;
    }

    var decorationCount = 0;

    function addEllipse(layer, name, board, x, y, width, height, fill, stroke, strokeWidth) {
        var item = layer.pathItems.ellipse(globalTop(board, y), x, width, height);
        item.name = name;
        item.filled = !!fill;
        if (fill) item.fillColor = rgb(fill);
        item.stroked = !!stroke;
        if (stroke) {
            item.strokeColor = rgb(stroke);
            item.strokeWidth = strokeWidth || 1;
        }
        decorationCount++;
        return item;
    }

    function addDotCluster(layer, prefix, board, x, y, color) {
        var sizes = [7, 4, 9, 5, 6];
        for (var i = 0; i < sizes.length; i++) {
            addEllipse(layer, prefix + "-DOT-" + i, board, x + i * 18, y + (i % 2) * 13, sizes[i], sizes[i], color, null, 0);
        }
    }

    function addStageSteps(layer, prefix, board, x, y, color) {
        for (var i = 0; i < 4; i++) {
            addRect(layer, prefix + "-STEP-" + i, board, x + i * 34, y - i * 20, 54, 22 + i * 20, color, null, 0);
            decorationCount++;
        }
    }

    function addFlowLines(layer, prefix, board, startX, startY, color) {
        for (var i = 0; i < 5; i++) {
            var path = layer.pathItems.add();
            path.name = prefix + "-FLOW-" + i;
            path.setEntirePath([
                [startX, globalTop(board, startY + i * 12)],
                [startX + 80, globalTop(board, startY - 18 + i * 12)],
                [startX + 175, globalTop(board, startY + 20 + i * 12)],
                [startX + 285, globalTop(board, startY - 8 + i * 12)]
            ]);
            path.closed = false;
            path.filled = false;
            path.stroked = true;
            path.strokeColor = rgb(color);
            path.strokeWidth = 0.8;
            path.opacity = 55;
            decorationCount++;
        }
    }

    function addImageFrame(layer, prefix, board, x, y, width, height, color) {
        addRect(layer, prefix + "-OUTER", board, x - 10, y - 10, width + 20, height + 20, null, color, 1);
        addLine(layer, prefix + "-TICK-TL", board, x - 18, y - 10, x + 22, y - 10, color, 2);
        addLine(layer, prefix + "-TICK-BR", board, x + width - 22, y + height + 10, x + width + 18, y + height + 10, color, 2);
        decorationCount += 3;
    }

    function addMicroLabel(typeLayer, prefix, board, text, x, y, color) {
        addPointText(typeLayer, prefix, board, text, x, y, 9, color, true, 140);
        decorationCount++;
    }

    function decorateBoard(typeLayer, graphicsLayer, prefix, board, page, accent, dark) {
        var ink = dark ? COLORS.cream : COLORS.ink;
        addRect(graphicsLayer, prefix + "-ACCENT-A", board, 24, 24, 8, 48, accent, null, 0);
        addRect(graphicsLayer, prefix + "-ACCENT-B", board, 36, 24, 20, 8, COLORS.blue, null, 0);
        addDotCluster(graphicsLayer, prefix + "-DOTS", board, 1280, 46, accent);
        addMicroLabel(typeLayer, prefix + "-PAGE", board, "STORYTELLER / " + page, 1216, board.height - 26, ink);
        decorationCount += 2;
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

    function fitItemToRect(item, rect, mode) {
        var targetWidth = rect[2] - rect[0];
        var targetHeight = rect[1] - rect[3];
        var bounds = item.geometricBounds;
        var itemWidth = bounds[2] - bounds[0];
        var itemHeight = bounds[1] - bounds[3];
        if (itemWidth <= 0 || itemHeight <= 0) return;
        var scaleX = targetWidth / itemWidth;
        var scaleY = targetHeight / itemHeight;
        var scale = mode === "cover" ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY);
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
        fitItemToRect(placed, rect, "contain");
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

    function addTag(layer, name, board, text, x, y, width, dark) {
        addRect(layer, name + "-BG", board, x, y, width, 28, dark ? COLORS.black : COLORS.white, COLORS.ink, 1);
        addAreaText(layer, name + "-TEXT", board, text, x + 9, y + 6, width - 18, 18, 10, dark ? COLORS.white : COLORS.ink, 12, true, 70);
    }

    function addBoardHeader(typeLayer, graphicsLayer, prefix, board, index, english, title, body, dark) {
        var ink = dark ? COLORS.white : COLORS.ink;
        var muted = dark ? COLORS.cream : COLORS.muted;
        addPointText(typeLayer, prefix + "-INDEX", board, index + " / " + english, 72, 80, 12, muted, true, 120);
        addAreaText(typeLayer, prefix + "-TITLE", board, title, 72, 120, 500, 200, 52, ink, 58, true, -25);
        addAreaText(typeLayer, prefix + "-BODY", board, body, 650, 126, 650, 150, 16, muted, 29, false, 0);
        addLine(graphicsLayer, prefix + "-RULE", board, 72, 300, 1368, 300, ink, 1);
    }

    function makeArtboards(doc) {
        var cursorTop = 8000;
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

    function buildCover(typeLayer, graphicsLayer, imageLayer, annotationLayer, board) {
        addRect(graphicsLayer, "B01-BG", board, 0, 0, W, board.height, COLORS.cream);
        placeImage(imageLayer, "B01-HERO", board, ASSETS.hero, 0, 0, W, board.height, "contain");
        addPointText(typeLayer, "B01-INDEX", board, "PROJECT 07 / EVENT VISUAL", 590, 42, 11, COLORS.ink, true, 120);
        addTag(annotationLayer, "B01-SPEC", board, "1440 × 810 / KV CONTAIN", 1134, 36, 258, true);
        addFlowLines(graphicsLayer, "B01", board, 90, 705, COLORS.copper);
        addStageSteps(graphicsLayer, "B01", board, 1180, 735, COLORS.orange);
        addImageFrame(graphicsLayer, "B01-FRAME", board, 12, 12, 1416, 786, COLORS.copper);
    }

    function buildContext(typeLayer, graphicsLayer, board) {
        addRect(graphicsLayer, "B02-BG", board, 0, 0, W, board.height, COLORS.paper);
        addPointText(typeLayer, "B02-INDEX", board, "01 / CONTEXT", 72, 88, 12, COLORS.muted, true, 120);
        addAreaText(typeLayer, "B02-TITLE", board, "阅读不只发生在书页里，\r也发生在一次被听见的讲述中。", 72, 145, 500, 300, 56, COLORS.ink, 63, true, -35);
        addAreaText(typeLayer, "B02-LEAD", board, "“有请讲书人”是第 26 届深圳读书月中的阅读分享活动，以讲述与公共表达连接一本书、一个人的理解和更多听众。", 650, 150, 650, 180, 23, COLORS.ink, 37, false, -10);
        addAreaText(typeLayer, "B02-BODY", board, "视觉需要覆盖活动传播、评选沟通、总决赛、现场空间与线上邀请。设计既要保持公共文化活动的正式感，也要让参与者感到舞台是可接近、可加入的。", 650, 355, 620, 150, 15, COLORS.muted, 28, false, 0);
        addLine(graphicsLayer, "B02-RULE", board, 650, 550, 1310, 550, COLORS.ink, 1);
        var metas = [
            ["项目类型", "读书月活动视觉"], ["项目时间", "2025"],
            ["传播范围", "线上传播 / 现场空间"], ["个人职责", "主视觉 / 规范 / 物料延展"]
        ];
        for (var i = 0; i < metas.length; i++) {
            var col = i % 2;
            var row = Math.floor(i / 2);
            var x = 650 + col * 335;
            var y = 580 + row * 112;
            addAreaText(typeLayer, "B02-META-LABEL-" + i, board, metas[i][0], x, y, 290, 24, 11, COLORS.muted, 14, false, 30);
            addAreaText(typeLayer, "B02-META-VALUE-" + i, board, metas[i][1], x, y + 32, 300, 46, 18, COLORS.ink, 23, true, 0);
        }
        addFlowLines(graphicsLayer, "B02", board, 78, 742, COLORS.copper);
        addStageSteps(graphicsLayer, "B02", board, 420, 805, COLORS.gold);
    }

    function buildJourney(typeLayer, graphicsLayer, board) {
        addRect(graphicsLayer, "B03-BG", board, 0, 0, W, board.height, COLORS.paper);
        addBoardHeader(typeLayer, graphicsLayer, "B03", board, "02", "JOURNEY & CHALLENGE", "把一次讲述，组织成完整的活动体验。", "从参与者第一次看到活动，到走进现场并留下分享记忆，视觉系统需要在不同阶段提供一致识别，同时改变信息密度和表达语气。");
        var stages = [
            ["01", "报名传播", "建立兴趣\r明确参与入口"],
            ["02", "评选沟通", "组织信息\r维持活动识别"],
            ["03", "总决赛", "强化舞台感\r突出时间地点"],
            ["04", "分享与留念", "连接现场\r延续活动记忆"]
        ];
        for (var i = 0; i < stages.length; i++) {
            var x = 72 + i * 326;
            addRect(graphicsLayer, "B03-CARD-" + i, board, x, 355, 302, 274, i === 2 ? COLORS.copper : COLORS.cream, COLORS.ink, 1);
            addPointText(typeLayer, "B03-NO-" + i, board, stages[i][0], x + 22, 390, 12, COLORS.ink, true, 80);
            addAreaText(typeLayer, "B03-TITLE-" + i, board, stages[i][1], x + 22, 445, 250, 52, 28, COLORS.ink, 34, true, -10);
            addLine(graphicsLayer, "B03-CARD-RULE-" + i, board, x + 22, 518, x + 280, 518, COLORS.ink, 1);
            addAreaText(typeLayer, "B03-BODY-" + i, board, stages[i][2], x + 22, 545, 250, 62, 14, COLORS.ink, 22, false, 0);
        }
        addAreaText(typeLayer, "B03-CHALLENGE", board, "设计挑战：建立活动识别 / 平衡正式感与亲和力 / 适配横竖版、空间和数字触点", 72, 690, 1090, 54, 16, COLORS.ink, 24, true, 0);
        addTag(typeLayer, "B03-TAG", board, "ONE IDENTITY / MULTIPLE MOMENTS", 1080, 684, 288, false);
        addLine(graphicsLayer, "B03-JOURNEY-LINE", board, 104, 645, 1336, 645, COLORS.blue, 2);
        addDotCluster(graphicsLayer, "B03-JOURNEY-DOTS", board, 1198, 758, COLORS.orange);
    }

    function buildConcept(typeLayer, graphicsLayer, imageLayer, board) {
        addRect(graphicsLayer, "B04-BG", board, 0, 0, W, board.height, COLORS.copper);
        placeImage(imageLayer, "B04-SYSTEM-FULL", board, ASSETS.system, 708, 225, 660, 371, "contain");
        addImageFrame(graphicsLayer, "B04-SYSTEM-FRAME", board, 708, 225, 660, 371, COLORS.cream);
        addPointText(typeLayer, "B04-INDEX", board, "03 / INSIGHT & CONCEPT", 72, 80, 12, COLORS.cream, true, 120);
        addAreaText(typeLayer, "B04-QUOTE", board, "让阅读从个人理解，\r走向公共表达。", 72, 180, 600, 250, 68, COLORS.white, 76, true, -35);
        addAreaText(typeLayer, "B04-BODY", board, "层叠结构从书页逐步转译为台阶、建筑与舞台：每一次阅读理解，都是向表达靠近的一层。麦克风确定“讲述”的动作，连续流线则像声音与路径，把分散触点连接成同一场活动。", 76, 530, 525, 180, 16, COLORS.white, 29, false, 0);
        addTag(typeLayer, "B04-TAG", board, "READ → UNDERSTAND → SPEAK → SHARE", 76, 770, 350, true);
        addStageSteps(graphicsLayer, "B04", board, 1150, 790, COLORS.gold);
        addFlowLines(graphicsLayer, "B04", board, 720, 692, COLORS.cream);
    }

    function buildSystem(typeLayer, graphicsLayer, imageLayer, board) {
        addRect(graphicsLayer, "B05-BG", board, 0, 0, W, board.height, COLORS.paper);
        addPointText(typeLayer, "B05-INDEX", board, "04 / VISUAL SYSTEM", 72, 72, 12, COLORS.muted, true, 120);
        addAreaText(typeLayer, "B05-TITLE", board, "一套识别语言，承载阅读、进步与讲述。", 72, 110, 760, 74, 46, COLORS.ink, 52, true, -25);
        addAreaText(typeLayer, "B05-BODY", board, "暖金与橙红建立公共文化活动的温度，蓝色为参与传播提供清晰对比。字体、层叠几何和流线共同维持正式识别。", 870, 112, 498, 85, 14, COLORS.muted, 25, false, 0);
        placeImage(imageLayer, "B05-SYSTEM", board, ASSETS.system, 72, 225, 800, 600, "contain");
        addImageFrame(graphicsLayer, "B05-SYSTEM-FRAME", board, 72, 225, 800, 600, COLORS.copper);
        var systems = [
            ["01", "上升的书页", "层叠几何同时像书页、台阶和舞台，形成由阅读走向表达的路径。", COLORS.gold],
            ["02", "持续的讲述", "流动线条连接画面边界，转化声音、时间与活动动线。", COLORS.copper],
            ["03", "温暖的公共色彩", "#EED795 / #F1CA5F / #D58346 建立主识别，#6887BE 负责传播对比。", COLORS.blue]
        ];
        for (var i = 0; i < systems.length; i++) {
            var y = 235 + i * 192;
            addRect(graphicsLayer, "B05-CARD-" + i, board, 920, y, 448, 164, systems[i][3], COLORS.ink, 1);
            addPointText(typeLayer, "B05-NO-" + i, board, systems[i][0], 944, y + 33, 11, COLORS.ink, true, 90);
            addAreaText(typeLayer, "B05-CARD-TITLE-" + i, board, systems[i][1], 1000, y + 25, 325, 34, 20, COLORS.ink, 25, true, -10);
            addAreaText(typeLayer, "B05-CARD-BODY-" + i, board, systems[i][2], 944, y + 76, 385, 68, 13, COLORS.ink, 21, false, 0);
        }
        addAreaText(typeLayer, "B05-FONTS", board, "现有规范字体：张海山锐线体简 / 思源黑体 / 上首顿萧体", 920, 828, 448, 28, 11, COLORS.muted, 15, false, 20);
        addDotCluster(graphicsLayer, "B05-SWATCH-DOTS", board, 1230, 840, COLORS.blue);
    }

    function buildEngagement(typeLayer, graphicsLayer, imageLayer, board) {
        addRect(graphicsLayer, "B06-BG", board, 0, 0, W, board.height, COLORS.paleBlue);
        addBoardHeader(typeLayer, graphicsLayer, "B06", board, "05", "ENGAGEMENT VISUAL", "把“走上舞台”，变成一眼可感知的参与动作。", "参与传播使用蓝黄三维阶梯、漂浮书本与麦克风。阶梯让“进步”变得具体，也把讲述舞台塑造成可以一步步靠近的空间。它与金色官方识别承担不同传播层级。", false);
        placeImage(imageLayer, "B06-ENGAGEMENT", board, ASSETS.engagement, 110, 330, 1220, 500, "contain");
        addImageFrame(graphicsLayer, "B06-ENGAGEMENT-FRAME", board, 110, 330, 1220, 500, COLORS.deepBlue);
        addStageSteps(graphicsLayer, "B06", board, 62, 795, COLORS.gold);
        addDotCluster(graphicsLayer, "B06-FLOAT", board, 1242, 316, COLORS.orange);
        addTag(typeLayer, "B06-TAG", board, "APPROACHABLE / DYNAMIC / PARTICIPATORY", 1002, 842, 366, false);
    }

    function buildRules(typeLayer, graphicsLayer, imageLayer, board) {
        addRect(graphicsLayer, "B07-BG", board, 0, 0, W, board.height, COLORS.white);
        addPointText(typeLayer, "B07-INDEX", board, "06 / LAYOUT RULES", 48, 58, 12, COLORS.muted, true, 120);
        addAreaText(typeLayer, "B07-TITLE", board, "固定识别层级，适配横版、竖版与不同信息密度。", 48, 98, 920, 70, 42, COLORS.ink, 48, true, -25);
        addAreaText(typeLayer, "B07-BODY", board, "Logo 区、标题区、主图形区与信息区保持稳定关系；尺寸变化时重新组织，而不是简单等比缩放。", 1040, 102, 352, 65, 12, COLORS.muted, 20, false, 0);
        placeImage(imageLayer, "B07-RULES", board, ASSETS.rules, 110, 195, 1220, 686, "contain");
        addImageFrame(graphicsLayer, "B07-RULES-FRAME", board, 110, 195, 1220, 686, COLORS.copper);
        addFlowLines(graphicsLayer, "B07", board, 80, 176, COLORS.blue);
        addTag(typeLayer, "B07-SPEC", board, "HORIZONTAL / VERTICAL / GRID", 1114, 176, 278, false);
    }

    function buildSpatial(typeLayer, graphicsLayer, imageLayer, board) {
        addRect(graphicsLayer, "B08-BG", board, 0, 0, W, board.height, COLORS.paper);
        addBoardHeader(typeLayer, graphicsLayer, "B08", board, "07", "SPATIAL APPLICATION", "从远距离识别，到近距离行动指引。", "灯箱海报承担活动识别与时间信息，立式导视承接签到和现场行动。相同的金色层叠结构，在不同观看距离中调整主次与裁切。", false);
        placeImage(imageLayer, "B08-SPATIAL-FULL", board, ASSETS.spatial, 260, 340, 920, 518, "contain");
        addImageFrame(graphicsLayer, "B08-SPATIAL-FRAME", board, 260, 340, 920, 518, COLORS.copper);
        addAreaText(typeLayer, "B08-CAP-1", board, "完整物料关系 / 灯箱、导视与签到触点 / 保留原图全部边缘", 260, 870, 920, 28, 12, COLORS.muted, 17, false, 0);
        addStageSteps(graphicsLayer, "B08", board, 92, 770, COLORS.gold);
        addFlowLines(graphicsLayer, "B08", board, 1080, 700, COLORS.blue);
    }

    function buildTouchpoints(typeLayer, graphicsLayer, imageLayer, board) {
        addRect(graphicsLayer, "B09-BG", board, 0, 0, W, board.height, COLORS.black);
        addPointText(typeLayer, "B09-INDEX", board, "08 / EVENT & DIGITAL TOUCHPOINTS", 72, 66, 12, COLORS.cream, true, 120);
        addAreaText(typeLayer, "B09-TITLE", board, "视觉从现场空间，延续到身份与线上邀约。", 72, 105, 720, 72, 44, COLORS.white, 50, true, -25);
        addAreaText(typeLayer, "B09-BODY", board, "舞台分享、集体留影、工作证和移动端邀请共同构成活动记忆。统一的色彩、标题结构和线性图形让触点保持连续。", 850, 108, 518, 80, 14, [196, 187, 176], 24, false, 0);
        placeImage(imageLayer, "B09-EVENT-FULL", board, ASSETS.event, 72, 250, 620, 349, "contain");
        placeImage(imageLayer, "B09-DIGITAL-FULL", board, ASSETS.digital, 748, 360, 620, 349, "contain");
        addImageFrame(graphicsLayer, "B09-EVENT-FRAME", board, 72, 250, 620, 349, COLORS.cream);
        addImageFrame(graphicsLayer, "B09-DIGITAL-FRAME", board, 748, 360, 620, 349, COLORS.blue);
        addAreaText(typeLayer, "B09-CAP-1", board, "01 / 现场分享、舞台与共同留影 / 完整图", 72, 616, 620, 22, 11, [196, 187, 176], 14, false, 20);
        addAreaText(typeLayer, "B09-CAP-2", board, "02 / 工作证与移动端邀请 / 完整图", 748, 726, 620, 22, 11, [196, 187, 176], 14, false, 20);
        addFlowLines(graphicsLayer, "B09", board, 80, 790, COLORS.copper);
        addStageSteps(graphicsLayer, "B09", board, 1180, 850, COLORS.blue);
    }

    function buildGuide(typeLayer, graphicsLayer, annotationLayer, board) {
        addRect(graphicsLayer, "B10-BG", board, 0, 0, W, board.height, COLORS.cream);
        addPointText(typeLayer, "B10-INDEX", board, "09 / SUMMARY & AI BUILD GUIDE", 72, 76, 12, COLORS.copper, true, 120);
        addAreaText(typeLayer, "B10-TITLE", board, "把阅读、表达与公共分享，组织成一段连续体验。", 72, 130, 650, 230, 52, COLORS.ink, 59, true, -30);
        addAreaText(typeLayer, "B10-SUMMARY", board, "项目以层叠书页和流动线条建立官方识别，再用三维阶梯强化参与传播。视觉从横竖版规范延展至空间导视、活动现场、证件与移动邀请。主要负责主视觉、视觉规范与物料延展。", 72, 440, 610, 170, 15, COLORS.ink, 28, false, 0);
        var rows = [
            ["画板基准", "1440 px / RGB"],
            ["文字 / 图片边距", "72 px / 48 px"],
            ["主标题", "82–104 px"],
            ["章节标题", "48–58 px"],
            ["正文 / 图注", "15 px / 12–13 px"],
            ["常用间距", "24 / 48 / 72 / 120 px"]
        ];
        for (var i = 0; i < rows.length; i++) {
            var y = 125 + i * 82;
            addLine(graphicsLayer, "B10-RULE-" + i, board, 805, y, 1368, y, COLORS.copper, 1);
            addAreaText(typeLayer, "B10-LABEL-" + i, board, rows[i][0], 805, y + 18, 210, 30, 12, COLORS.muted, 16, false, 20);
            addAreaText(typeLayer, "B10-VALUE-" + i, board, rows[i][1], 1040, y + 15, 328, 40, 18, COLORS.ink, 22, true, 0);
        }
        addTag(annotationLayer, "B10-END", board, "EDITABLE TYPE / LINKED IMAGES / NAMED LAYERS", 1025, 672, 343, false);
        var swatches = [COLORS.cream, COLORS.gold, COLORS.copper, COLORS.blue, COLORS.ink];
        for (var s = 0; s < swatches.length; s++) {
            addRect(graphicsLayer, "B10-SWATCH-" + s, board, 72 + s * 52, 680, 38, 38, swatches[s], COLORS.ink, 0.5);
            decorationCount++;
        }
    }

    function writePreflight(doc) {
        var file = new File(OUTPUT_PREFLIGHT);
        if (!file.open("w")) throw new Error("Cannot write preflight report");
        file.writeln("artboards=" + doc.artboards.length);
        file.writeln("layers=" + doc.layers.length);
        file.writeln("placed_images=" + placedCount);
        file.writeln("missing_images=" + missingCount);
        file.writeln("decorations=" + decorationCount);
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
        doc.name = "有请讲书人-读书月活动视觉-作品集-精修版";
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

        buildCover(typeLayer, graphicsLayer, imageLayer, annotationLayer, boards[0]);
        buildContext(typeLayer, graphicsLayer, boards[1]);
        buildJourney(typeLayer, graphicsLayer, boards[2]);
        buildConcept(typeLayer, graphicsLayer, imageLayer, boards[3]);
        buildSystem(typeLayer, graphicsLayer, imageLayer, boards[4]);
        buildEngagement(typeLayer, graphicsLayer, imageLayer, boards[5]);
        buildRules(typeLayer, graphicsLayer, imageLayer, boards[6]);
        buildSpatial(typeLayer, graphicsLayer, imageLayer, boards[7]);
        buildTouchpoints(typeLayer, graphicsLayer, imageLayer, boards[8]);
        buildGuide(typeLayer, graphicsLayer, annotationLayer, boards[9]);

        decorateBoard(typeLayer, graphicsLayer, "B01-DECO", boards[0], "01", COLORS.copper, false);
        decorateBoard(typeLayer, graphicsLayer, "B02-DECO", boards[1], "02", COLORS.gold, false);
        decorateBoard(typeLayer, graphicsLayer, "B03-DECO", boards[2], "03", COLORS.blue, false);
        decorateBoard(typeLayer, graphicsLayer, "B04-DECO", boards[3], "04", COLORS.gold, true);
        decorateBoard(typeLayer, graphicsLayer, "B05-DECO", boards[4], "05", COLORS.copper, false);
        decorateBoard(typeLayer, graphicsLayer, "B06-DECO", boards[5], "06", COLORS.blue, false);
        decorateBoard(typeLayer, graphicsLayer, "B07-DECO", boards[6], "07", COLORS.gold, false);
        decorateBoard(typeLayer, graphicsLayer, "B08-DECO", boards[7], "08", COLORS.copper, false);
        decorateBoard(typeLayer, graphicsLayer, "B09-DECO", boards[8], "09", COLORS.orange, true);
        decorateBoard(typeLayer, graphicsLayer, "B10-DECO", boards[9], "10", COLORS.blue, false);

        guideLayer.locked = false;
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
