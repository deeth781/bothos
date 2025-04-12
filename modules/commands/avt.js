module.exports.config = {
	name: "avt",
	version: "1.1.0",
	hasPermssion: 0,
	credits: "𝑽𝒖̃ 𝑻𝒂̀𝒊 (𝑺𝒕𝒂𝒘)",
	description: "Lấy ảnh đại diện người dùng hoặc nhóm",
	commandCategory: "Thành Viên",
	cooldowns: 0
};

const fs = require("fs");
const request = require("request");
const path = __dirname + "/cache/1.png";
const access_token = "6628568379|c1e620fa708a1d5696fb991c1bde5662";

function downloadImage(url, callback) {
	request(encodeURI(url))
		.pipe(fs.createWriteStream(path))
		.on("close", () => callback());
}

module.exports.run = async function({ api, event, args, Threads }) {
	const threadSetting = (await Threads.getData(String(event.threadID))).data || {};
	const prefix = threadSetting?.PREFIX || global.config.PREFIX;
	const mn = this.config.name;

	if (!args[0]) {
		return api.sendMessage(
			`📌 Hướng dẫn sử dụng:\n` +
			`${prefix}${mn} box → Lấy avatar nhóm\n` +
			`${prefix}${mn} id <uid> → Lấy avatar theo ID\n` +
			`${prefix}${mn} user → Lấy avatar bản thân\n` +
			`${prefix}${mn} user @tag → Lấy avatar người được tag\n` +
			`${prefix}${mn} link <link> → Lấy avatar từ link`,
			event.threadID,
			event.messageID
		);
	}

	// Get avatar nhóm
	if (args[0] == "box") {
		let threadID = args[1] || event.threadID;
		let threadInfo = await api.getThreadInfo(threadID);
		if (!threadInfo.imageSrc)
			return api.sendMessage(`❎ Nhóm "${threadInfo.threadName}" không có avatar`, event.threadID, event.messageID);

		downloadImage(threadInfo.imageSrc, () =>
			api.sendMessage({
				body: `✅ Avatar của nhóm "${threadInfo.threadName}"`,
				attachment: fs.createReadStream(path)
			}, event.threadID, () => fs.unlinkSync(path), event.messageID)
		);
		return;
	}

	// Get avatar bằng ID
	if (args[0] == "id") {
		const id = args[1];
		if (!id) return api.sendMessage(`❎ Vui lòng nhập UID cần lấy avatar`, event.threadID, event.messageID);

		const url = `https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=${access_token}`;
		downloadImage(url, () =>
			api.sendMessage({
				attachment: fs.createReadStream(path)
			}, event.threadID, () => fs.unlinkSync(path), event.messageID)
		);
		return;
	}

	// Get avatar bằng link
	if (args[0] == "link") {
		const tool = require("fb-tools");
		const link = args[1];
		if (!link) return api.sendMessage(`❎ Vui lòng nhập link Facebook`, event.threadID, event.messageID);
		try {
			const uid = await tool.findUid(link);
			const url = `https://graph.facebook.com/${uid}/picture?height=720&width=720&access_token=${access_token}`;
			downloadImage(url, () =>
				api.sendMessage({
					attachment: fs.createReadStream(path)
				}, event.threadID, () => fs.unlinkSync(path), event.messageID)
			);
		} catch {
			api.sendMessage(`⚠️ Không thể lấy UID từ link`, event.threadID, event.messageID);
		}
		return;
	}

	// Get avatar user
	if (args[0] == "user") {
		let uid;

		if (Object.keys(event.mentions).length > 0) {
			uid = Object.keys(event.mentions)[0];
		} else if (event.messageReply) {
			uid = event.messageReply.senderID;
		} else {
			uid = event.senderID;
		}

		const url = `https://graph.facebook.com/${uid}/picture?height=720&width=720&access_token=${access_token}`;
		downloadImage(url, () =>
			api.sendMessage({
				attachment: fs.createReadStream(path)
			}, event.threadID, () => fs.unlinkSync(path), event.messageID)
		);
		return;
	}

	// Sai lệnh
	api.sendMessage(`❎ Lệnh không hợp lệ, gõ ${prefix}${mn} để xem hướng dẫn`, event.threadID, event.messageID);
};
