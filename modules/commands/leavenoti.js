module.exports.config = {
    name: "leavenoti",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑽𝒖̃ 𝑻𝒂̀𝒊 (𝑺𝒕𝒂𝒘)",
    description: "Bật hoặc tắt thông báo khi có thành viên rời khỏi nhóm",
    commandCategory: "Quản Trị Viên",
    usages: "[on/off]",
    cooldowns: 5,
};

module.exports.run = async function({ api, event, Threads, args }) {
    const { threadID, messageID } = event;
    let threadData = await Threads.getData(threadID);
    let data = threadData.data || {};
    if (args.length === 0) {
        return api.sendMessage("Sử dụng leavenoti [on/off] để bật hoặc tắt thông báo khi có thành viên rời khỏi nhóm.", threadID, messageID);
    }
    if (args[0].toLowerCase() === "on") {
        data.leaveNoti = true;
        await Threads.setData(threadID, { data });
        global.data.threadData.set(threadID, data);
        return api.sendMessage("Đã bật thông báo thành viên rời khỏi nhóm này.", threadID, messageID);
    }
    if (args[0].toLowerCase() === "off") {
        data.leaveNoti = false;
        await Threads.setData(threadID, { data });
        global.data.threadData.set(threadID, data);
        return api.sendMessage("Đã tắt thông báo thành viên rời khỏi nhóm này.", threadID, messageID);
    }
    return api.sendMessage("Lựa chọn không hợp lệ, vui lòng nhập đúng cú pháp leavenoti [on/off].", threadID, messageID);
};
