module.exports.config = {
	name: "nhacnho",
	version: "0.0.1-beta",
	hasPermssion: 0,
	credits: "𝑽𝒖̃ 𝑻𝒂̀𝒊 (𝑺𝒕𝒂𝒘)",
	description: "Nhắc nhở bạn về việc gì đấy trong khoảng thời gian cố định",
	commandCategory: "Thành Viên",
	usages: "[Time] [Text] ",
	cooldowns: 5
};

module.exports.run = async function({ api, event, args, Users }) {
	const time = args[0];
	const text = args.join(" ").replace(time, "");
	if (isNaN(time)) return api.sendMessage(`thời gian bạn nhập không phải là một con số!`, event.threadID, event.messageID);
	const display = time > 59 ? `${time / 60} phút` : `${time} giây`;
	api.sendMessage(`tôi sẽ nhắc bạn sau: ${display}`, event.threadID, event.messageID);
	await new Promise(resolve => setTimeout(resolve, time * 1000));
	var value = await api.getThreadInfo(event.threadID);
	if (!(value.nicknames)[event.userID]) value = (await Users.getData(event.senderID)).name;
	else value = (value.nicknames)[event.senderID]; 
	return api.sendMessage({
	body: `${(text) ? value + ", bạn đã để lại lời nhắn như sau:" + text : value + ", hình như bạn yêu cầu tôi nhắc bạn làm việc gì đó thì phải?"}`,
		mentions: [{
			tag: value,
			id: event.senderID
		}]
	}, event.threadID, event.messageID);
}
