module.exports.config = {
  name: "delbox",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "𝑽𝒖̃ 𝑻𝒂̀𝒊 (𝑺𝒕𝒂𝒘)",
  description: "Dùng để rã box",
  commandCategory: "Quản Trị Viên",
  usages: "delbox",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, Threads }) {
  const threadID = event.threadID;
  const botID = api.getCurrentUserID();
  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const botIsAdmin = threadInfo.adminIDs.some(e => e.id == botID);
    if (!botIsAdmin) return api.sendMessage("Bot phải là quản trị viên thì mới rã box được!", threadID);
    const memberIDs = threadInfo.participantIDs.filter(id => {
      return id != botID && !threadInfo.adminIDs.some(admin => admin.id == id);
    });

    for (const userID of memberIDs) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      api.removeUserFromGroup(userID, threadID);
    }

    api.sendMessage("Vĩnh Biệt Box!!", threadID);
  } catch (error) {
    api.sendMessage("Lỗi!!!!!", threadID);
  }
};