module.exports.config = {
    name: "autotrans",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "𝑽𝒖̃ 𝑻𝒂̀𝒊 (𝑺𝒕𝒂𝒘)",
    description: "Tự động dịch giữa các ngôn ngữ: tiếng Việt, tiếng Anh và tiếng Nhật",
    commandCategory: "Tiện ích",
    usages: "",
    cooldowns: 5,
    dependencies: {
        "request": ""
    }
};

let autoTranslateEnabled = true;
let autoTranslateThreads = new Map();

module.exports.run = async ({ api, event }) => {
    const threadID = event.threadID;
    if (autoTranslateThreads.has(threadID)) {
        autoTranslateThreads.delete(threadID);
        api.setMessageReaction("✅", event.messageID, () => { }, true);
        api.sendMessage("Auto translate đã tắt.", threadID, event.messageID);
    } else {
        autoTranslateThreads.set(threadID, null);
        api.setMessageReaction("✅", event.messageID, () => { }, true);
        api.sendMessage("Chọn chế độ dịch tự động:\n1. Vietnamese - English\n2. Japanese <-> Vietnamese", threadID, (err, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                threadID: threadID
            });
        });
    }
};

module.exports.handleReply = async ({ api, event, handleReply }) => {
    if (event.senderID !== handleReply.author) return;
    const threadID = handleReply.threadID;
    const choice = event.body.toLowerCase();
    if (choice === '1') {
        autoTranslateThreads.set(threadID, "vi-en");
        api.sendMessage("Auto translate giữa Vietnamese và English đã được bật.", threadID);
    } else if (choice === '2') {
        autoTranslateThreads.set(threadID, "ja-vi");
        api.sendMessage("Auto translate giữa Japanese và Vietnamese đã được bật.", threadID);
    } else {
        api.sendMessage("Vui lòng chọn 1 hoặc 2.", threadID);
    }
    global.client.handleReply = global.client.handleReply.filter(item => item.messageID !== handleReply.messageID);
};

module.exports.handleEvent = async ({ api, event }) => {
    const threadID = event.threadID;
    if (!autoTranslateEnabled || !autoTranslateThreads.has(threadID) || event.type !== "message" || event.body.startsWith(global.config.PREFIX)) return;
    if (event.body.toLowerCase() === "trans off") {
        autoTranslateThreads.delete(threadID);
        api.sendMessage("Auto translate đã tắt.", threadID);
        return;
    }
    const languagePair = autoTranslateThreads.get(threadID);
    if (!languagePair) return;
    const message = event.body;
    if (!/[a-zA-Z\u3040-\u30FF]/.test(message)) return;
    const request = global.nodemodule["request"];
    const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=vi&dt=t&q=${encodeURIComponent(message)}`;

    request(apiUrl, (err, response, body) => {
        if (err) return api.sendMessage("Đã có lỗi xảy ra khi phát hiện ngôn ngữ!", threadID, event.messageID);
        const retrieve = JSON.parse(body);
        const detectedLang = retrieve[2];
        let targetLang;
        if (languagePair === "vi-en") {
            targetLang = detectedLang === 'en' ? 'vi' : 'en';
        } else if (languagePair === "ja-vi") {
            targetLang = detectedLang === 'ja' ? 'vi' : 'ja';
        }
        if (!targetLang) return api.sendMessage("Ngôn ngữ không được hỗ trợ!", threadID, event.messageID);
        const translateApiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${detectedLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(message)}`;
        request(translateApiUrl, (err, response, body) => {
            if (err) return api.sendMessage("Đã có lỗi xảy ra khi dịch văn bản!", threadID, event.messageID);
            const translation = JSON.parse(body);
            let translatedText = '';
            translation[0].forEach(item => (item[0]) ? translatedText += item[0] : '');
            api.setMessageReaction("✅", event.messageID, () => { }, true);
            api.sendMessage(translatedText, threadID, event.messageID);
        });
    });
};
