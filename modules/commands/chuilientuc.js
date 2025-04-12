const activeThreads = new Set();
module.exports.config = {
    name: "chuilientuc",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "𝑽𝒖̃ 𝑻𝒂̀𝒊 (𝑺𝒕𝒂𝒘)",
    description: "chuilientuc người bạn tag (ngôn của mấy đứa war)",
    commandCategory: "War",
    usages: "chuilientuc @mention",
    cooldowns: 10,
    dependencies: {
        "fs-extra": "",
        "axios": ""
    }
}

module.exports.run = async function({ api, args, Users, event }) {
    if (args.length > 0 && args[0] === "stop") {
        if (activeThreads.has(event.threadID)) {
            activeThreads.delete(event.threadID);
            return api.sendMessage("Đã dừng hoạt động của lệnh chuilientuc.", event.threadID);
        } else {
            return api.sendMessage("Lệnh chuilientuc không hoạt động trong nhóm này.", event.threadID);
        }
    }
    const mention = Object.keys(event.mentions)[0];
    if (!mention) return api.sendMessage("Cần phải tag 1 người bạn muốn chuilientuc vào mặt nó", event.threadID);
    const name = event.mentions[mention];
    const arraytag = [{ id: mention, tag: name }];
    activeThreads.add(event.threadID);

    const messages = [
        "Ngong tai ma nghe bo may chui ne !",
        "D!t con me may",
        "Dit cai lon me may chet chua ha thang lon",
        "Bo may dit me may luon day con cho",
        "Dit vo dau goi, dit thoi man trinh",
        "Dit bat thinh linh",
        "Dit kieu au tuong, dit huong mat troi",
        "Dit choi dit boi, dit ra kieu moi",
        "Dit toi dit lui, dit bui ca dau",
        "Dit dau cung chet, dit bet ca lon",
        "Dit kieu ngang kieu doc, kieu khong can khoa hoc",
        "Cung choc thung lon cai con di me may",
        "Cai thang dam cha chem chu, bop vu chi dau",
        "Cao dau em nho ban bo em trai, ki lon em gai",
        "Dai ia ra song nhu cong xia canh",
        "Nhu danh cho hoang, dap dau cho thien",
        "Bu lon chim se, be lon chim ri",
        "Ki lon chim cat ma dut lon vao chim trau",
        "Dit cai lon me may thay may chet chua ha con cho an cut",
        "Di voi phat thi mac ao ca sa, di voi ma thi mac ao giay",
        "Ma cai lon con di me may khong day chay thi cung day ve",
        "Tao met roi khong chui nua",
        "Nao ong chu update lyric thi chui tiep nha con suc vat",
        "Xin chao va hen gap lai thu tinh trung khuyet tat, that bai cua tao hoa",
        "Gut Bai "
    ];

    const sendMessages = () => {
        for (let i = 0; i < messages.length; i++) {
            setTimeout(() => {
                if (activeThreads.has(event.threadID)) {
                    api.sendMessage({ body: messages[i] + " " + name, mentions: arraytag }, event.threadID);
                }
            }, i * 5000);
        }
    };

    sendMessages();
};
