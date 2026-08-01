#target illustrator

(function () {
    var OUTPUT_DIR = "/Users/ttao/Documents/作品集";
    var OUTPUT_AI = OUTPUT_DIR + "/天安云谷-日常读书节-作品集-精修版.ai";
    var OUTPUT_PREVIEW = OUTPUT_DIR + "/天安云谷-日常读书节-作品集-精修版-preview.png";
    var OUTPUT_PREFLIGHT = OUTPUT_DIR + "/天安云谷-日常读书节-作品集-精修版-preflight.txt";
    var LOG_PATH = OUTPUT_DIR + "/天安云谷-日常读书节-精修版-构建日志.txt";

    var ASSETS = {
        hero: "/Users/ttao/Downloads/作品集/主视觉.png",
        symbol: "/Users/ttao/Downloads/作品集/云谷制作-09.jpg",
        mechanism: "/Users/ttao/Downloads/作品集/云谷制作_画板 1 副本 8.jpg",
        vertical: "/Users/ttao/Downloads/作品集/云谷制作_画板 1 副本 10.jpg",
        authors: "/Users/ttao/Downloads/作品集/云谷制作_画板 1 副本 11.jpg",
        calendar: "/Users/ttao/Downloads/作品集/云谷制作_画板 1 副本 12.jpg",
        overview: "/Users/ttao/Downloads/卢森涛｜品牌视觉设计作品集｜优化版/11.png"
    };

    var W = 1440;
    var GAP = 80;
    var boards = [
        { name: "01-COVER", height: 810 },
        { name: "02-CONTEXT", height: 900 },
        { name: "03-MECHANISM", height: 860 },
        { name: "04-CONCEPT", height: 900 },
        { name: "05-SYSTEM", height: 820 },
        { name: "06-FOUR-EXCHANGES", height: 900 },
        { name: "07-CALENDAR", height: 960 },
        { name: "08-ADAPTATION", height: 900 },
        { name: "09-CONTENT", height: 900 },
        { name: "10-GUIDE", height: 760 }
    ];

    var COLORS = {
        paper: [244, 241, 233],
        ink: [28, 27, 25],
        muted: [111, 105, 96],
        yellow: [255, 207, 0],
        deepYellow: [232, 184, 25],
        pink: [245, 5, 141],
        blue: [12, 113, 244],
        green: [63, 185, 63],
        pale: [255, 247, 207],
        white: [255, 255, 255],
        black: [0, 0, 0]
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
    var sceneIconCount = 0;

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
        return item;
    }

    function addBookPage(layer, prefix, board, x, y, width, color) {
        var center = x + width / 2;
        for (var i = 0; i < 5; i++) {
            addLine(layer, prefix + "-LEFT-" + i, board, center, y + i * 11, x + i * 5, y - 18 + i * 11, color, 1);
            addLine(layer, prefix + "-RIGHT-" + i, board, center, y + i * 11, x + width - i * 5, y - 18 + i * 11, color, 1);
            decorationCount += 2;
        }
    }

    function addExchangeArrow(layer, prefix, board, x1, y, x2, color) {
        addLine(layer, prefix + "-SHAFT", board, x1, y, x2, y, color, 2);
        addLine(layer, prefix + "-HEAD-R1", board, x2, y, x2 - 12, y - 8, color, 2);
        addLine(layer, prefix + "-HEAD-R2", board, x2, y, x2 - 12, y + 8, color, 2);
        addLine(layer, prefix + "-HEAD-L1", board, x1, y, x1 + 12, y - 8, color, 2);
        addLine(layer, prefix + "-HEAD-L2", board, x1, y, x1 + 12, y + 8, color, 2);
        decorationCount += 5;
    }

    function addCoffeeIcon(layer, prefix, board, x, y, color) {
        addRect(layer, prefix + "-CUP", board, x, y + 18, 48, 34, null, color, 2);
        addEllipse(layer, prefix + "-HANDLE", board, x + 39, y + 24, 24, 22, null, color, 2);
        for (var i = 0; i < 3; i++) addLine(layer, prefix + "-STEAM-" + i, board, x + 10 + i * 13, y + 10, x + 14 + i * 13, y - 7, color, 1.5);
        decorationCount += 5;
        sceneIconCount++;
    }

    function addBookIcon(layer, prefix, board, x, y, color) {
        for (var i = 0; i < 3; i++) {
            addRect(layer, prefix + "-BOOK-" + i, board, x + i * 5, y + i * 14, 58, 12, null, color, 2);
            decorationCount++;
        }
        sceneIconCount++;
    }

    function addVegetableIcon(layer, prefix, board, x, y, color) {
        addEllipse(layer, prefix + "-FRUIT", board, x + 8, y + 18, 44, 40, null, color, 2);
        addEllipse(layer, prefix + "-LEAF-A", board, x, y, 28, 18, null, color, 1.5);
        addEllipse(layer, prefix + "-LEAF-B", board, x + 30, y, 28, 18, null, color, 1.5);
        addLine(layer, prefix + "-STEM", board, x + 30, y + 20, x + 30, y + 5, color, 1.5);
        decorationCount += 4;
        sceneIconCount++;
    }

    function addPlantIcon(layer, prefix, board, x, y, color) {
        addRect(layer, prefix + "-POT", board, x + 10, y + 38, 42, 26, null, color, 2);
        addLine(layer, prefix + "-STEM", board, x + 31, y + 38, x + 31, y, color, 2);
        addEllipse(layer, prefix + "-LEAF-A", board, x + 2, y + 8, 30, 18, null, color, 1.5);
        addEllipse(layer, prefix + "-LEAF-B", board, x + 31, y + 16, 30, 18, null, color, 1.5);
        decorationCount += 4;
        sceneIconCount++;
    }

    function addCalendarTicks(layer, prefix, board, x, y, width) {
        var colors = [COLORS.deepYellow, COLORS.pink, COLORS.blue, COLORS.green];
        for (var i = 0; i < 42; i++) {
            var tx = x + (width / 41) * i;
            var h = i % 7 === 0 ? 18 : 8;
            addLine(layer, prefix + "-TICK-" + i, board, tx, y, tx, y + h, colors[Math.floor(i / 11) % 4], i % 7 === 0 ? 2 : 1);
            decorationCount++;
        }
    }

    function addImageFrame(layer, prefix, board, x, y, width, height, color) {
        addRect(layer, prefix + "-FRAME", board, x - 9, y - 9, width + 18, height + 18, null, color, 1.2);
        addRect(layer, prefix + "-CORNER", board, x - 16, y - 16, 34, 8, color, null, 0);
        decorationCount += 2;
    }

    function decorateBoard(typeLayer, graphicsLayer, prefix, board, page, accent, dark) {
        var palette = [COLORS.yellow, COLORS.pink, COLORS.blue, COLORS.green];
        for (var i = 0; i < 4; i++) {
            addRect(graphicsLayer, prefix + "-COLOR-" + i, board, 24 + i * 22, 24, 16, 7 + i * 4, palette[i], null, 0);
            decorationCount++;
        }
        for (var j = 0; j < 8; j++) {
            addLine(graphicsLayer, prefix + "-EDGE-" + j, board, 1320 + j * 7, 54, 1320 + j * 7, 68 + (j % 3) * 6, accent, 1);
            decorationCount++;
        }
        addPointText(typeLayer, prefix + "-PAGE", board, "DAILY READING / " + page, 1210, board.height - 25, 9, dark ? COLORS.white : COLORS.ink, true, 130);
        decorationCount++;
    }

    function addText(layer, name, board, text, x, y, width, height, size, color, leading, bold, tracking, justification) {
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
        addText(layer, name + "-TEXT", board, text, x + 9, y + 6, width - 18, 18, 10, dark ? COLORS.white : COLORS.ink, 12, true, 70);
    }

    function addBoardHeader(typeLayer, graphicsLayer, prefix, board, index, english, title, body) {
        addPointText(typeLayer, prefix + "-INDEX", board, index + " / " + english, 72, 80, 12, COLORS.muted, true, 120);
        addText(typeLayer, prefix + "-TITLE", board, title, 72, 120, 470, 210, 54, COLORS.ink, 58, true, -25);
        addText(typeLayer, prefix + "-BODY", board, body, 650, 126, 650, 150, 16, COLORS.muted, 29, false, 0);
        addLine(graphicsLayer, prefix + "-RULE", board, 72, 300, 1368, 300, COLORS.ink, 1);
    }

    function makeArtboards(doc) {
        // Keep the 9,430 pt vertical stack inside Illustrator's legacy canvas
        // coordinate range. Starting at 8,000 avoids CoOA errors on negative
        // artboard origins while leaving the final board safely above -1,500.
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
        addRect(graphicsLayer, "B01-BG", board, 0, 0, W, board.height, COLORS.yellow);
        placeImage(imageLayer, "B01-HERO", board, ASSETS.hero, 0, 0, W, board.height, "contain");
        addPointText(typeLayer, "B01-INDEX", board, "PROJECT 04 / COMMUNITY EVENT", 602, 42, 11, COLORS.ink, true, 120);
        addTag(annotationLayer, "B01-SPEC", board, "1440 × 810 / IMAGE FULL BLEED", 1092, 36, 300, true);
        addBookPage(graphicsLayer, "B01-BOOK-PAGE", board, 70, 735, 260, COLORS.ink);
        addCalendarTicks(graphicsLayer, "B01-DAYS", board, 925, 748, 410);
        addImageFrame(graphicsLayer, "B01-HERO", board, 12, 12, 1416, 786, COLORS.ink);
    }

    function buildContext(typeLayer, graphicsLayer, board) {
        addRect(graphicsLayer, "B02-BG", board, 0, 0, W, board.height, COLORS.paper);
        addPointText(typeLayer, "B02-INDEX", board, "01 / CONTEXT", 72, 88, 12, COLORS.muted, true, 120);
        addText(typeLayer, "B02-TITLE", board, "让阅读离开单次活动，进入社区每天的生活。", 72, 145, 470, 280, 58, COLORS.ink, 64, true, -35);
        addText(typeLayer, "B02-LEAD", board, "天安云谷联合帆书深圳运营中心，将阅读活动放入社区日常生活，以持续 42 天的内容和交换机制连接园区居民、书店与社区伙伴。", 650, 150, 650, 180, 23, COLORS.ink, 37, false, -10);
        addText(typeLayer, "B02-BODY", board, "项目需要同时组织跨月日程、不同参与方式和多方活动信息。视觉系统不仅要有公共活动的可见度，也要让参与者快速理解：什么时候发生、可以交换什么、如何加入。", 650, 355, 620, 150, 15, COLORS.muted, 28, false, 0);
        addLine(graphicsLayer, "B02-RULE", board, 650, 550, 1310, 550, COLORS.ink, 1);
        var metas = [
            ["活动周期", "42 天"], ["项目时间", "2025.06.20—07.31"],
            ["活动结构", "四阶段社区交换"], ["个人职责", "视觉设计与落地执行"]
        ];
        for (var i = 0; i < metas.length; i++) {
            var col = i % 2;
            var row = Math.floor(i / 2);
            var x = 650 + col * 335;
            var y = 580 + row * 112;
            addText(typeLayer, "B02-META-LABEL-" + i, board, metas[i][0], x, y, 290, 24, 11, COLORS.muted, 14, false, 30);
            addText(typeLayer, "B02-META-VALUE-" + i, board, metas[i][1], x, y + 32, 290, 40, 19, COLORS.ink, 23, true, 0);
        }
        addText(typeLayer, "B02-42-DAYS", board, "42 DAYS", 72, 615, 500, 120, 86, COLORS.deepYellow, 92, true, -55);
        addText(typeLayer, "B02-42-CAP", board, "A READING FESTIVAL THAT LIVES WITH THE COMMUNITY", 76, 738, 470, 44, 11, COLORS.ink, 16, true, 80);
        addCalendarTicks(graphicsLayer, "B02-CALENDAR-TICKS", board, 72, 822, 470);
    }

    function buildMechanism(typeLayer, graphicsLayer, imageLayer, board) {
        addRect(graphicsLayer, "B03-BG", board, 0, 0, W, board.height, COLORS.paper);
        addBoardHeader(typeLayer, graphicsLayer, "B03", board, "02", "MECHANISM", "一本书，\r换一份日常惊喜。", "活动以一本书作为参与入口，将 42 天拆成四个连续阶段。咖啡、书籍、蔬菜与植物都来自具体生活场景，让阅读通过交换动作进入社区日常。");
        var cards = [
            { title: "以书换咖", date: "06.20—06.30", en: "BOOKS FOR COFFEE", color: COLORS.deepYellow },
            { title: "以书换书", date: "07.01—07.11", en: "BOOKS FOR BOOKS", color: COLORS.blue },
            { title: "以书换蔬", date: "07.12—07.21", en: "BOOKS FOR VEGETABLES", color: COLORS.green },
            { title: "以书换植", date: "07.22—07.31", en: "BOOKS FOR PLANTS", color: COLORS.pink }
        ];
        var cardY = [382, 340, 382, 340];
        for (var i = 0; i < cards.length; i++) {
            var x = 72 + i * 326;
            var y = cardY[i];
            addRect(graphicsLayer, "B03-CARD-" + i, board, x, y, 302, 330, cards[i].color, COLORS.ink, 1.2);
            addPointText(typeLayer, "B03-CARD-NO-" + i, board, "0" + (i + 1), x + 22, y + 34, 12, COLORS.ink, true, 80);
            addText(typeLayer, "B03-CARD-TITLE-" + i, board, cards[i].title, x + 22, y + 91, 250, 72, 32, COLORS.ink, 38, true, -10);
            addText(typeLayer, "B03-CARD-DATE-" + i, board, cards[i].date, x + 22, y + 198, 250, 30, 15, COLORS.ink, 19, true, 10);
            addText(typeLayer, "B03-CARD-EN-" + i, board, cards[i].en, x + 22, y + 275, 250, 32, 11, COLORS.ink, 15, true, 70);
        }
        addCoffeeIcon(graphicsLayer, "B03-COFFEE", board, 292, 403, COLORS.ink);
        addBookIcon(graphicsLayer, "B03-BOOKS", board, 617, 360, COLORS.ink);
        addVegetableIcon(graphicsLayer, "B03-VEGETABLE", board, 944, 402, COLORS.ink);
        addPlantIcon(graphicsLayer, "B03-PLANT", board, 1266, 355, COLORS.ink);
        addExchangeArrow(graphicsLayer, "B03-ARROW-A", board, 342, 746, 450, COLORS.ink);
        addExchangeArrow(graphicsLayer, "B03-ARROW-B", board, 668, 746, 776, COLORS.ink);
        addExchangeArrow(graphicsLayer, "B03-ARROW-C", board, 994, 746, 1102, COLORS.ink);
        addTag(typeLayer, "B03-NOTE", board, "1 BOOK ↔ 1 DAILY SURPRISE", 1094, 792, 274, false);
    }

    function buildConcept(typeLayer, graphicsLayer, imageLayer, board) {
        addRect(graphicsLayer, "B04-BG", board, 0, 0, W, board.height, COLORS.yellow);
        placeImage(imageLayer, "B04-SYMBOL", board, ASSETS.symbol, 670, 110, 660, 680, "contain");
        addImageFrame(graphicsLayer, "B04-SYMBOL", board, 670, 110, 660, 680, COLORS.ink);
        addPointText(typeLayer, "B04-INDEX", board, "03 / INSIGHT & CONCEPT", 72, 80, 12, COLORS.ink, true, 120);
        addText(typeLayer, "B04-QUOTE", board, "把阅读从一次文化活动，\r变成每天都能参与的\r社区交换。", 72, 180, 620, 330, 68, COLORS.ink, 75, true, -35);
        addText(typeLayer, "B04-BODY", board, "打开的书本与两侧手势共同构成“交换”的动作：书页既是阅读媒介，也像被打开的社区入口。READING IS DAILY LIFE 被嵌入书页结构，让活动主张成为识别本身。", 76, 605, 510, 160, 16, COLORS.ink, 29, false, 0);
        addTag(typeLayer, "B04-TAG", board, "READING IS DAILY LIFE", 76, 785, 250, false);
        addExchangeArrow(graphicsLayer, "B04-EXCHANGE", board, 780, 820, 1240, COLORS.ink);
        addBookPage(graphicsLayer, "B04-BOOK", board, 790, 745, 280, COLORS.ink);
    }

    function buildSystem(typeLayer, graphicsLayer, board) {
        addRect(graphicsLayer, "B05-BG", board, 0, 0, W, board.height, COLORS.paper);
        addBoardHeader(typeLayer, graphicsLayer, "B05", board, "04", "VISUAL SYSTEM", "让复杂活动信息，保持统一且容易区分。", "黄色建立公共活动的可见度；开放书页与行动手势形成主识别；粉、蓝、绿等主题色帮助参与者区分不同交换阶段。白底黑框标签像社区公告一样自由组合。");
        var system = [
            { no: "01", title: "开放书页", body: "阅读符号、社区入口与交换平台，被压缩进一个可持续延展的线性图形。", color: COLORS.yellow },
            { no: "02", title: "行动手势", body: "递出与接收的双手强调参与动作，让视觉从“观看阅读”转向“加入阅读”。", color: COLORS.pink },
            { no: "03", title: "主题色彩", body: "黄色稳定整体识别，粉、蓝、绿建立四阶段之间清晰而活跃的差异。", color: COLORS.blue }
        ];
        var systemY = [365, 405, 340];
        var systemH = [350, 300, 375];
        for (var i = 0; i < system.length; i++) {
            var x = 72 + i * 432;
            var y = systemY[i];
            addRect(graphicsLayer, "B05-CARD-" + i, board, x, y, 402, systemH[i], system[i].color, COLORS.ink, 1);
            addPointText(typeLayer, "B05-NO-" + i, board, system[i].no, x + 25, y + 37, 12, COLORS.ink, true, 90);
            addText(typeLayer, "B05-TITLE-" + i, board, system[i].title, x + 25, y + 115, 340, 60, 28, COLORS.ink, 34, true, -15);
            addLine(graphicsLayer, "B05-CARD-RULE-" + i, board, x + 25, y + 203, x + 377, y + 203, COLORS.ink, 1);
            addText(typeLayer, "B05-BODY-" + i, board, system[i].body, x + 25, y + 239, 335, 90, 14, COLORS.ink, 24, false, 0);
        }
        addBookPage(graphicsLayer, "B05-BOOK", board, 104, 770, 260, COLORS.ink);
        addExchangeArrow(graphicsLayer, "B05-ACTION", board, 536, 770, 812, COLORS.ink);
        addCalendarTicks(graphicsLayer, "B05-COLOR-RHYTHM", board, 970, 770, 340);
    }

    function buildFourExchanges(typeLayer, graphicsLayer, imageLayer, board) {
        addRect(graphicsLayer, "B06-BG", board, 0, 0, W, board.height, COLORS.white);
        addPointText(typeLayer, "B06-INDEX", board, "05 / FOUR EXCHANGES", 48, 58, 12, COLORS.muted, true, 120);
        addText(typeLayer, "B06-TITLE", board, "四周主题，在同一识别系统中连续发生。", 48, 98, 850, 72, 42, COLORS.ink, 48, true, -25);
        placeImage(imageLayer, "B06-OVERVIEW", board, ASSETS.overview, 110, 205, 1220, 686, "contain");
        addImageFrame(graphicsLayer, "B06-OVERVIEW", board, 110, 205, 1220, 686, COLORS.ink);
        addCalendarTicks(graphicsLayer, "B06-STAGES", board, 140, 185, 1160);
        addTag(typeLayer, "B06-SPEC", board, "SYSTEM OVERVIEW / 16:9", 1124, 108, 268, false);
    }

    function buildCalendar(typeLayer, graphicsLayer, imageLayer, board) {
        addRect(graphicsLayer, "B07-BG", board, 0, 0, W, board.height, COLORS.paper);
        addPointText(typeLayer, "B07-INDEX", board, "06 / CALENDAR & INFORMATION", 72, 68, 12, COLORS.muted, true, 120);
        addText(typeLayer, "B07-TITLE", board, "用一张日历，组织 42 天的活动信息。", 72, 110, 600, 70, 46, COLORS.ink, 52, true, -25);
        addText(typeLayer, "B07-BODY", board, "日期、交换主题、活动名称、地点与二维码入口形成固定层级。颜色同时承担分类功能，帮助参与者在密集日程中快速定位。", 850, 110, 500, 90, 14, COLORS.muted, 25, false, 0);
        placeImage(imageLayer, "B07-CALENDAR-FULL", board, ASSETS.calendar, 120, 220, 300, 690, "contain");
        addImageFrame(graphicsLayer, "B07-CALENDAR", board, 120, 220, 300, 690, COLORS.ink);
        addText(typeLayer, "B07-42", board, "42", 520, 300, 360, 190, 152, COLORS.deepYellow, 160, true, -70);
        addText(typeLayer, "B07-DAYS", board, "DAYS / COMMUNITY / EXCHANGE", 548, 486, 560, 40, 18, COLORS.ink, 24, true, 90);
        var calendarNotes = [["06.20", "START"], ["07.01", "BOOKS"], ["07.12", "VEGETABLES"], ["07.22", "PLANTS"]];
        for (var c = 0; c < calendarNotes.length; c++) {
            addRect(graphicsLayer, "B07-NOTE-BG-" + c, board, 540 + (c % 2) * 365, 585 + Math.floor(c / 2) * 105, 330, 78, c === 0 ? COLORS.deepYellow : (c === 1 ? COLORS.blue : (c === 2 ? COLORS.green : COLORS.pink)), COLORS.ink, 1);
            addText(typeLayer, "B07-NOTE-" + c, board, calendarNotes[c][0] + "  /  " + calendarNotes[c][1], 560 + (c % 2) * 365, 610 + Math.floor(c / 2) * 105, 290, 30, 14, COLORS.ink, 18, true, 30);
        }
        addCalendarTicks(graphicsLayer, "B07-TICKS", board, 540, 825, 695);
        addTag(typeLayer, "B07-SPEC", board, "FULL CALENDAR / NO CROP", 1098, 892, 270, false);
    }

    function buildAdaptation(typeLayer, graphicsLayer, imageLayer, board) {
        addRect(graphicsLayer, "B08-BG", board, 0, 0, W, board.height, COLORS.white);
        addBoardHeader(typeLayer, graphicsLayer, "B08", board, "07", "KEY VISUAL ADAPTATION", "同一个识别单元，适应横版、竖版与独立图形。", "主视觉通过重新裁切书页轮廓、手势与信息标签，而不是机械缩放，保持不同媒介中的主题清晰度和画面张力。");
        placeImage(imageLayer, "B08-HORIZONTAL", board, ASSETS.hero, 72, 365, 620, 328, "contain");
        placeImage(imageLayer, "B08-VERTICAL", board, ASSETS.vertical, 735, 320, 250, 550, "contain");
        placeImage(imageLayer, "B08-SYMBOL", board, ASSETS.symbol, 1035, 365, 333, 328, "contain");
        addImageFrame(graphicsLayer, "B08-HORIZONTAL", board, 72, 365, 620, 328, COLORS.ink);
        addImageFrame(graphicsLayer, "B08-VERTICAL", board, 735, 320, 250, 550, COLORS.blue);
        addImageFrame(graphicsLayer, "B08-SYMBOL", board, 1035, 365, 333, 328, COLORS.pink);
        addText(typeLayer, "B08-CAP-1", board, "横版主视觉 / 完整展示", 72, 720, 620, 26, 12, COLORS.muted, 18, false, 0);
        addText(typeLayer, "B08-CAP-2", board, "独立图形 / 完整展示", 1035, 720, 333, 26, 12, COLORS.muted, 18, false, 0);
        addText(typeLayer, "B08-CAP-VERTICAL", board, "竖版传播 / 完整展示", 735, 878, 250, 20, 10, COLORS.muted, 14, false, 0);
    }

    function buildContent(typeLayer, graphicsLayer, imageLayer, board) {
        addRect(graphicsLayer, "B09-BG", board, 0, 0, W, board.height, COLORS.yellow);
        addPointText(typeLayer, "B09-INDEX", board, "08 / CONTENT COMMUNICATION", 72, 72, 12, COLORS.ink, true, 120);
        addText(typeLayer, "B09-TITLE", board, "从活动机制延伸到人物与内容传播。", 72, 112, 620, 80, 46, COLORS.ink, 52, true, -25);
        addText(typeLayer, "B09-BODY", board, "作者海报延续黄色公共底色、白底标题标签与高对比人物轮廓。人物信息、活动标题和合作方信息按阅读优先级重新组织。", 850, 115, 500, 95, 14, COLORS.ink, 25, false, 0);
        placeImage(imageLayer, "B09-AUTHORS-FULL", board, ASSETS.authors, 120, 215, 300, 670, "contain");
        addImageFrame(graphicsLayer, "B09-AUTHORS", board, 120, 215, 300, 670, COLORS.ink);
        for (var a = 0; a < 6; a++) {
            var ax = 520 + (a % 3) * 270;
            var ay = 310 + Math.floor(a / 3) * 210;
            var authorColors = [COLORS.white, COLORS.pink, COLORS.blue, COLORS.green, COLORS.white, COLORS.pink];
            addRect(graphicsLayer, "B09-AUTHOR-CARD-" + a, board, ax, ay, 235, 170, authorColors[a], COLORS.ink, 1);
            addPointText(typeLayer, "B09-AUTHOR-NO-" + a, board, "0" + (a + 1), ax + 20, ay + 36, 12, COLORS.ink, true, 80);
            addText(typeLayer, "B09-AUTHOR-TEXT-" + a, board, "AUTHOR / READING\rCONTENT SERIES", ax + 20, ay + 82, 190, 56, 13, COLORS.ink, 20, true, 40);
        }
        addExchangeArrow(graphicsLayer, "B09-CONTENT-FLOW", board, 520, 755, 1290, COLORS.ink);
        addTag(typeLayer, "B09-SPEC", board, "CONTENT SERIES / 6 AUTHORS", 1084, 812, 284, false);
    }

    function buildGuide(typeLayer, graphicsLayer, annotationLayer, board) {
        addRect(graphicsLayer, "B10-BG", board, 0, 0, W, board.height, COLORS.ink);
        addPointText(typeLayer, "B10-INDEX", board, "09 / SUMMARY & AI BUILD GUIDE", 72, 76, 12, COLORS.yellow, true, 120);
        addText(typeLayer, "B10-TITLE", board, "把阅读变成社区日常，也把复杂活动变成可持续的视觉系统。", 72, 130, 650, 260, 52, COLORS.white, 59, true, -30);
        addText(typeLayer, "B10-SUMMARY", board, "项目以“交换”作为参与动作，以开放书页和双手建立识别，并用四阶段色彩与日历规则组织持续 42 天的信息。设计从主视觉延展到主题海报、活动日历与人物传播，主要负责视觉设计与落地执行。", 72, 450, 610, 170, 15, [195, 190, 180], 28, false, 0);
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
            addLine(graphicsLayer, "B10-RULE-" + i, board, 805, y, 1368, y, [95, 90, 84], 1);
            addText(typeLayer, "B10-LABEL-" + i, board, rows[i][0], 805, y + 18, 210, 30, 12, [150, 144, 135], 16, false, 20);
            addText(typeLayer, "B10-VALUE-" + i, board, rows[i][1], 1040, y + 15, 328, 40, 18, COLORS.white, 22, true, 0);
        }
        addTag(annotationLayer, "B10-END", board, "EDITABLE TYPE / LINKED IMAGES / NAMED LAYERS", 1025, 672, 343, true);
        var swatches = [COLORS.yellow, COLORS.pink, COLORS.blue, COLORS.green];
        for (var s = 0; s < swatches.length; s++) {
            addRect(graphicsLayer, "B10-SWATCH-" + s, board, 72 + s * 52, 675, 38, 38, swatches[s], COLORS.white, 0.5);
            decorationCount++;
        }
        addBookPage(graphicsLayer, "B10-BOOK", board, 350, 690, 260, COLORS.yellow);
        addCalendarTicks(graphicsLayer, "B10-DAYS", board, 805, 636, 563);
    }

    function writePreflight(doc) {
        var file = new File(OUTPUT_PREFLIGHT);
        if (!file.open("w")) throw new Error("Cannot write preflight report");
        file.writeln("artboards=" + doc.artboards.length);
        file.writeln("layers=" + doc.layers.length);
        file.writeln("placed_images=" + placedCount);
        file.writeln("missing_images=" + missingCount);
        file.writeln("decorations=" + decorationCount);
        file.writeln("scene_icons=" + sceneIconCount);
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

        // Close only the file produced by this builder so a rerun can replace it
        // without touching any unrelated document the user has open.
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
        doc.name = "天安云谷-日常读书节-作品集-精修版";
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
        buildMechanism(typeLayer, graphicsLayer, imageLayer, boards[2]);
        buildConcept(typeLayer, graphicsLayer, imageLayer, boards[3]);
        buildSystem(typeLayer, graphicsLayer, boards[4]);
        buildFourExchanges(typeLayer, graphicsLayer, imageLayer, boards[5]);
        buildCalendar(typeLayer, graphicsLayer, imageLayer, boards[6]);
        buildAdaptation(typeLayer, graphicsLayer, imageLayer, boards[7]);
        buildContent(typeLayer, graphicsLayer, imageLayer, boards[8]);
        buildGuide(typeLayer, graphicsLayer, annotationLayer, boards[9]);

        decorateBoard(typeLayer, graphicsLayer, "B01-DECO", boards[0], "01", COLORS.ink, false);
        decorateBoard(typeLayer, graphicsLayer, "B02-DECO", boards[1], "02", COLORS.deepYellow, false);
        decorateBoard(typeLayer, graphicsLayer, "B03-DECO", boards[2], "03", COLORS.blue, false);
        decorateBoard(typeLayer, graphicsLayer, "B04-DECO", boards[3], "04", COLORS.pink, false);
        decorateBoard(typeLayer, graphicsLayer, "B05-DECO", boards[4], "05", COLORS.green, false);
        decorateBoard(typeLayer, graphicsLayer, "B06-DECO", boards[5], "06", COLORS.blue, false);
        decorateBoard(typeLayer, graphicsLayer, "B07-DECO", boards[6], "07", COLORS.deepYellow, false);
        decorateBoard(typeLayer, graphicsLayer, "B08-DECO", boards[7], "08", COLORS.pink, false);
        decorateBoard(typeLayer, graphicsLayer, "B09-DECO", boards[8], "09", COLORS.blue, false);
        decorateBoard(typeLayer, graphicsLayer, "B10-DECO", boards[9], "10", COLORS.yellow, true);

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
