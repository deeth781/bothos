module.exports.config = {
 name: "antiqtv",
 version: "3.0.0",
 credits: "𝑽𝒖̃ 𝑻𝒂̀𝒊 (𝑺𝒕𝒂𝒘)",
 hasPermssion: 1,
 description: "Ngăn chặn việc thay đổi qtv box",
 usages: "antiqtv",
 commandCategory: "Quản Trị Viên",
 cooldowns: 0
};

module.exports.run = async({ api, event, Threads, Users}) => {
    const info = await api.getThreadInfo(event.threadID);
    if (!info.adminIDs.some(item => item.id == api.getCurrentUserID())) 
      return api.sendMessage({body:'Bot chưa là quản trị viên!!'},event.threadID, event.messageID);  
    const data = (await Threads.getData(event.threadID)).data || {};
    if (typeof data["guard"] == "guard" || data["guard"] == false) data["guard"] = true;
    else data["guard"] = false;
    await Threads.setData(event.threadID, { data });
      global.data.threadData.set(parseInt(event.threadID), data);  
    return api.sendMessage({body:`Đã ${(data["guard"] == true) ? "bật" : "tắt"} thành công anti thay đổi quản trị viên`}, event.threadID, event.messageID);
}