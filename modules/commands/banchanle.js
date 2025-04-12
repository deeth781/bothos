const axios = require("axios");
module.exports.config = {
	name: "banchanle",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑽𝒖̃ 𝑻𝒂̀𝒊 (𝑺𝒕𝒂𝒘)",
	description: "+))",
	commandCategory: "Trò Chơi",
	usages: "[create/join/start/end]",
	cooldowns: 5
}, module.exports.run = async function({
	api: e,
	event: n,
	Currencies: a,
	Threads: s,
	Users: t,
	args: r
}) {
	try {
		global.chanle || (global.chanle = new Map);
		const {
			threadID: s,
			messageID: o,
			senderID: i
		} = n;
		var g = global.chanle.get(s);
		const c = (await axios.get("https://i.imgur.com/LClPl36.jpg", {
			responseType: "stream"
		})).data;
		switch (r[0]) {
			case "create":
			case "new":
			case "-c": {
				if (!r[1] || isNaN(r[1])) return e.sendMessage("Bạn cần nhập số tiền đặt cược!", s, o);
				if (parseInt(r[1]) < 50) return e.sendMessage("Số tiền phải lớn hơn hoặc bằng 50", s, o);
				const g = await a.getData(n.senderID);
				if (g.money < parseInt(r[1])) return e.sendMessage(`Bạn không có đủ ${r[1]} để tạo bàn game mới!!`, s, o);
				if (global.chanle.has(s)) return e.sendMessage("Nhóm này đã được mở bàn game!", s, o);
				var h = await t.getNameUser(i);
				return global.chanle.set(s, {
					box: s,
					start: !1,
					author: i,
					player: [{
						name: h,
						userID: i,
						choose: {
							status: !1,
							msg: null
						}
					}],
					money: parseInt(r[1])
				}), e.sendMessage("Tạo thành công phòng chẵn lẻ với số tiền cược là :" + r[1], s)
			}
			case "join":
			case "-j": {
				if (!global.chanle.has(s)) return e.sendMessage("Nhóm này hiện chưa có bàn game nào!\n=> Vui lòng hãy tạo bàn game mới để tham gia!", s, o);
				if (1 == g.start) return e.sendMessage("Hiện tại bàn game này đã bắt đầu từ trước!", s, o);
				const r = await a.getData(n.senderID);
				if (r.money < g.money) return e.sendMessage(`Bạn không có đủ $ để tham gia bàn game này! ${g.money}$`, s, o);
				if (g.player.find((e => e.userID == i))) return e.sendMessage("Hiện tại bạn đã tham gia bàn game này!", s, o);
				h = await t.getNameUser(i);
				return g.player.push({
					name: h,
					userID: i,
					choose: {
						stats: !1,
						msg: null
					}
				}), global.chanle.set(s, g), e.sendMessage(`Bạn đã tham gia bàn game!\n=> Số thành viên hiện tại là : ${g.player.length}`, s, o)
			}
			case "start":
			case "-s":
				return g ? g.author != i ? e.sendMessage("Bạn không phải là người tạo ra bàn game này nên không thể bắt đầu game", s, o) : g.player.length <= 1 ? e.sendMessage("Bàn game của bạn không có đủ thành viên để có thể bắt đầu!", s, o) : 1 == g.start ? e.sendMessage("Hiện tại bàn game này đã bắt đầu từ trước!", s, o) : (g.start = !0, global.chanle.set(s, g), e.sendMessage(`Game bắt đầu\n\nSố thành viên : ${g.player.length}\n\nVui lòng chat "Chẵn" hoặc "Lẻ" `, s)) : e.sendMessage("Nhóm này hiện chưa có bàn game nào!\n=> Vui lòng hãy tạo bàn game mới để tham gia!", s, o);
			case "end":
			case "-e":
				return g ? g.author != i ? e.sendMessage("Bạn không phải là người tạo ra bàn game nên không thể xóa bàn game", s, o) : (global.chanle.delete(s), e.sendMessage("Đã xóa bàn game!", s, o)) : e.sendMessage("Nhóm này hiện chưa có bàn game nào!\n=> Vui lòng hãy tạo bàn game mới để tham gia!", s, o);
			default:
				return e.sendMessage({
					body: "Chơi Chẵn Lẻ Nhiều Người\n1.=>banchanle -c/create <price> để tạo phòng\n2.=>banchanle join để vào phòng\n3.=>banchanle start để bắt đầu trò chơi\n4.=>banchanle end để xóa phòng",
					attachment: c
				}, s, o)
		}
	} catch (e) {
		console.log(e)
	}
}, module.exports.handleEvent = async function({
	api: e,
	event: n,
	Currencies: a
}) {
	const {
		threadID: s,
		messageID: t,
		body: r,
		senderID: g
	} = n, h = ["chẵn", "lẻ"], o = ((await a.getData(n.senderID)).money, h[Math.floor(Math.random() * h.length)]);
	if (r && ("chẵn" == r.toLowerCase() || "lẻ" == r.toLowerCase())) {
		const n = global.chanle.get(s) || {};
		if (!n) return;
		if (1 != n.start) return;
		if (!n.player.find((e => e.userID == g))) return;
		var i, c = n.player.findIndex((e => e.userID == g));
		if (1 == (i = n.player[c]).choose.status) return e.sendMessage("Bạn đã chọn rồi không thể chọn lại!", s, t);
		"chẵn" == r.toLowerCase() ? (n.player.splice(c, 1), n.player.push({
			name: i.name,
			userID: g,
			choose: {
				status: !0,
				msg: "chẵn"
			}
		}), e.sendMessage(`${i.name} đã chọn chẵn`, s, t)) : (n.player.splice(c, 1), n.player.push({
			name: i.name,
			userID: g,
			choose: {
				status: !0,
				msg: "lẻ"
			}
		}), e.sendMessage(`${i.name} đã chọn lẻ`, s, t));
		var m = 0,
			u = n.player.length;
		for (var l of n.player) 1 == l.choose.status && m++;
		if (m != u) return; {
			const r = (await axios.get("https://i.imgur.com/P3UEpfF.gif", {
				responseType: "stream"
			})).data;
			e.sendMessage({
				body: "Đang kiểm tra kết quả",
				attachment: r
			}, s, ((r, g) => {
				if (r) return e.sendMessage(r, s, t);
				setTimeout((async function() {
					e.unsendMessage(g.messageID);
					var t = o,
						r = [],
						h = [];
					var i = images();
					if (0 == t.indexOf("chẵn"))
						for (var c of n.player) "chẵn" == c.choose.msg ? r.push({
							name: c.name,
							userID: c.userID
						}) : h.push({
							name: c.name,
							userID: c.userID
						});
					else
						for (var c of n.player) "lẻ" == c.choose.msg ? r.push({
							name: c.name,
							userID: c.userID
						}) : h.push({
							name: c.name,
							userID: c.userID
						});
					const m = (await axios.get(i[Math.floor(5 * Math.random())], {
						responseType: "stream"
					})).data;
					var u = "KẾT QUẢ: " + t.toUpperCase() + "\n\nThắng:\n",
						l = 0,
						p = 0;
					for (var d of r) {
						await a.getData(d.userID);
						await a.increaseMoney(d.userID, n.money), u += ++l + ". " + d.name + "\n"
					}
					for (var y of h) {
						await a.getData(y.userID);
						await a.decreaseMoney(y.userID, n.money), 0 == p && (u += "\nThua:\n"), u += ++p + ". " + y.name + "\n"
					}
					return u += "\nThắng + " + n.money + " VND\n", u += "Thua - " + n.money + " VND", global.chanle.delete(s), e.sendMessage({
						body: u,
						attachment: m
					}, s)

                    function images() {
                        if ("chẵn" == t)
                            var i = [
                      "https://i.imgur.com/6fIJU1q.jpg", "https://i.imgur.com/XPg6Uvq.jpg", "https://i.imgur.com/IWjB9kN.jpg", "https://i.imgur.com/XVxgPhY.png", "https://i.imgur.com/dRzktqf.png"
                ];
                        else if ("lẻ" == t)
                            i = ["https://i.imgur.com/u1DjwX0.png", "https://i.imgur.com/unnBcv9.png", "https://i.imgur.com/181R8Te.jpg", "https://i.imgur.com/y67IGtv.jpg", "https://i.imgur.com/y67IGtv.jpg"];
                        return i;
                    }
				}), 5000)
			}))
		}
	}
};