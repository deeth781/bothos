module.exports.config = {
    name: 'autoout',
    version: '1.1.1',
    hasPermssion: 3,
    credits: '𝑽𝒖̃ 𝑻𝒂̀𝒊 (𝑺𝒕𝒂𝒘)',
    description: 'Tự động rời nhóm',
    commandCategory: 'Admin',
    usages: 'số member + thông báo',
    cooldowns: 2
};
   async function onLoad(){
   const { existsSync, writeFileSync } = require('fs-extra')
   const { join } = require('path');
   const pathData = join(__dirname, "cache","data","autoout.json");
   if (!existsSync(pathData)) writeFileSync(pathData, "[]", "utf-8");
     }
onLoad()
module.exports.handleEvent = function({
    api,
    event
}) {
    const auto = global.cmds_autoout || {};
    if (!event.isGroup) return;
    if (!auto.status) return;
    if (event.participantIDs.length < auto.num) return api.sendMessage(`Bot tự rời khi nhóm dưới ${auto.num} thành viên`, event.threadID, async function() {
        await api.removeUserFromGroup(a.getCurrentUserID(), event.threadID);
    });
};
module.exports.run = function({
    api,
    event
}) {
  if (!global.cmds_autoout) global.cmds.autoout = {};
    const auto = global.cmds_autoout || {};
    if (isNaN(event.args[1])) return;
    const status = !auto.status ? true: false;
    global.cmds_autoout = {
        status,
        num: + event.args[1]
    }
    a.sendMessage(`Đã ${status ? 'bật': 'tắt'} tự động rời nhóm dưới ${event.args[1]} thành viên`, event.threadID, event.messageID);
};