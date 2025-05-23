const moment = require("moment-timezone");
const axios = require("axios");
const cheerio = require("cheerio");
const https = require("https");
const agent = new https.Agent({
  rejectUnauthorized: false
});
const getStreamFromURL = async (url) => {
  try {
    const res = await axios({
      method: "GET",
      url,
      responseType: "stream"
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching image:", error.message);
    return null; // fallback in case of error
  }
};

module.exports.config = {
  name: "moon",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑽𝒖̃ 𝑻𝒂̀𝒊 (𝑺𝒕𝒂𝒘)",
  description: "Xem ảnh trăng vào sinh nhật của bạn",
  commandCategory: "Thành Viên",
  usages: "DD/MM/YYYY",
  cooldowns: 5
};

function checkDate(date) {
  const [day0, month0, year0] = (date || "").split('/');
  const day = (day0 || "").length == 1 ? "0" + day0 : day0;
  const month = (month0 || "").length == 1 ? "0" + month0 : month0;
  const year = year0 || "";
  const newDateFormat = year + "/" + month + "/" + day;
  return moment(newDateFormat, 'YYYY/MM/DD', true).isValid() ? newDateFormat : false;
}

const moonImages = [
  'https://i.ibb.co/9shyYH1/moon-0.png',
  'https://i.ibb.co/vBXLL37/moon-1.png',
  'https://i.ibb.co/0QCKK9D/moon-2.png',
  'https://i.ibb.co/Dp62X2j/moon-3.png',
  'https://i.ibb.co/xFKCtfd/moon-4.png',
  'https://i.ibb.co/m4L533L/moon-5.png',
  'https://i.ibb.co/VmshdMN/moon-6.png',
  'https://i.ibb.co/4N7R2B2/moon-7.png',
  'https://i.ibb.co/C2k4YB8/moon-8.png',
  'https://i.ibb.co/F62wHxP/moon-9.png',
  'https://i.ibb.co/Gv6R1mk/moon-10.png',
  'https://i.ibb.co/0ZYY7Kk/moon-11.png',
  'https://i.ibb.co/KqXC5F5/moon-12.png',
  'https://i.ibb.co/BGtLpRJ/moon-13.png',
  'https://i.ibb.co/jDn7pPx/moon-14.png',
  'https://i.ibb.co/kykn60t/moon-15.png',
  'https://i.ibb.co/qD4LFLs/moon-16.png',
  'https://i.ibb.co/qJm9gcQ/moon-17.png',
  'https://i.ibb.co/yYFYZx9/moon-18.png',
  'https://i.ibb.co/8bc7vpZ/moon-19.png',
  'https://i.ibb.co/jHG7DKs/moon-20.png',
  'https://i.ibb.co/5WD18Rn/moon-21.png',
  'https://i.ibb.co/3Y06yHM/moon-22.png',
  'https://i.ibb.co/4T8Zdfy/moon-23.png',
  'https://i.ibb.co/n1CJyP4/moon-24.png',
  'https://i.ibb.co/zFwJRqz/moon-25.png',
  'https://i.ibb.co/gVBmMCW/moon-26.png',
  'https://i.ibb.co/hRY89Hn/moon-27.png',
  'https://i.ibb.co/7C13s7Z/moon-28.png',
  'https://i.ibb.co/2hDTwB4/moon-29.png',
  'https://i.ibb.co/Rgj9vpj/moon-30.png',
  'https://i.ibb.co/s5z0w9R/moon-31.png'
];

module.exports.handleReply = async ({ api, event, args, handleReply }) => {
  const { author, type, date } = handleReply;

  switch (type) {
    case 'replyDay': {
      const day = parseInt(event.body);
      if (isNaN(day) || day < 1 || day > 31)
        return api.sendMessage("Ngày bạn nhập vào không hợp lệ. Vui lòng nhập lại.", author);
      date.day = day;
      return api.sendMessage("Phản hồi tin nhắn này và nhập vào tháng (1-12)", event.threadID, (error, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author,
          type: 'replyMonth',
          date
        });
      });
    }
    case 'replyMonth': {
      const month = parseInt(event.body);
      if (isNaN(month) || month < 1 || month > 12)
        return api.sendMessage("Tháng bạn nhập vào không hợp lệ. Vui lòng nhập lại.", author);
      date.month = month;
      return api.sendMessage("Phản hồi tin nhắn này và nhập vào năm (yyyy)", event.threadID, (error, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author,
          type: 'done',
          date
        });
      });
    }
    case 'done': {
      try {
        const date2 = checkDate(`${date.day}/${date.month}/${event.body}`);
        const message = {
          reply: (content) => api.sendMessage(content, event.threadID, event.messageID)
        };

        if (!date2)
          return message.reply("Vui lòng nhập ngày/tháng/năm hợp lệ theo định dạng DD/MM/YYYY.");

        const linkCrawl = `https://lunaf.com/lunar-calendar/${date2}`;

        let html;
        try {
          html = await axios.get(linkCrawl, { httpsAgent: agent });
        }
        catch (err) {
          return message.reply(`Đã xảy ra lỗi khi lấy thông tin mặt trăng của ngày ${date.day}/${date.month}/${event.body}.`);
        }

        const $ = cheerio.load(html.data);
        const href = $("figure.mimg img").attr("src");

        let imgIndex = parseInt(href.match(/\d+/)[0]);
        let imgSrc = moonImages[imgIndex] || moonImages[0]; // fallback to first image if not found

        const msg = `- Ảnh mặt trăng vào đêm ${date.day}/${date.month}/${event.body}`
          + `\n- ${$($('h3').get()[0]).text()}`
          + `\n- ${$("#phimg > small").text()}`
          + `\n- ${linkCrawl}`
          + `\n- https://lunaf.com/img/moon/h-${href.slice(href.lastIndexOf("/") + 1)}`;

        const streamImg = await getStreamFromURL(imgSrc);
        if (streamImg) {
          message.reply({
            body: msg,
            attachment: streamImg
          });
        } else {
          message.reply("Đã xảy ra lỗi khi lấy ảnh mặt trăng. Vui lòng thử lại sau.");
        }
      }
      catch (e) {
        console.log(e);
        api.sendMessage("Đã xảy ra lỗi. Vui lòng thử lại sau.", event.threadID, event.messageID);
      }
      break;
    }
  }
};

module.exports.run = async ({ api, event }) => {
  api.sendMessage("Phản hồi tin nhắn này và nhập vào ngày (1-31)", event.threadID, (err, info) => {
    global.client.handleReply.push({
      name: this.config.name,
      messageID: info.messageID,
      author: event.senderID,
      type: "replyDay",
      date: {}
    });
  });
};
