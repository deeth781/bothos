module.exports.config = {
  name: "binary",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑽𝒖̃ 𝑻𝒂̀𝒊 (𝑺𝒕𝒂𝒘)",
  description: "chuyển văn bản sang mã nhị phân và ngược lại",
  commandCategory: "Tiện ích",
  usages: "[encode/decode] [text/binary]",
  cooldowns: 0
};

function encode(text) {
  return (
    Array
      .from(text)
      .reduce((acc, char) => acc.concat(char.charCodeAt().toString(2)), [])
      .map(bin => '0'.repeat(8 - bin.length) + bin )
      .join(" ")
  );
};

function decode(binary) {
  const arrayOfBytes = binary.split(" ");
  let Output = "";
  for (let i = 0; i < arrayOfBytes.length; i++) Output += String.fromCharCode(parseInt(arrayOfBytes[i], 2));
  return Output;
};

module.exports.run = async function ({ api, event, args }) {
  var { threadID, messageID, senderID } = event;
  if (args.length <= 1) return api.sendMessage("Không đúng cú pháp!", threadID, messageID);
  var type = args[0].toLowerCase();
  const allType = ["encode","en","decode","de"];
  if (!allType.includes(type)) return api.sendMessage("Không đúng cú pháp!", threadID, messageID);
  var input = event.body.slice(event.body.indexOf(args[1]));
  if (type == "encode" || type == "en") return api.sendMessage(`${encode(input)}`, threadID, messageID);
  if (type == "decode" || type == "de") return api.sendMessage(`${decode(input)}`, threadID, messageID);
    }