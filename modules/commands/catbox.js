module.exports = {
    config: {
      name: 'catbox',
      commandCategory: 'Tiện ích',
      hasPermssion: 0,
      credits: '𝑽𝒖̃ 𝑻𝒂̀𝒊 (𝑺𝒕𝒂𝒘)',
      usages: 'chuyển ảnh, video, gif sang link catbox',
      description: 'Up ảnh, video, GIF lên Catbox',
      cooldowns: 0
    },
    run: async (o) => {
      const send = (msg) => o.api.sendMessage(msg, o.event.threadID, o.event.messageID);
      
      if (o.event.type !== "message_reply") {
        return send("⚠️ Hình ảnh không hợp lệ, vui lòng phản hồi một video, ảnh nào đó");
      }
      
      let msg = [];
      
      for (const attachment of o.event.messageReply.attachments) {
        try {
          const response = await require('axios').get(`https://catbox-mnib.onrender.com/upload?url=${encodeURIComponent(attachment.url)}`);
          msg.push(`${response.data.url}`);
        } catch (error) {
          console.error(`Failed to upload ${attachment.url}:`, error);
          msg.push(`⚠️ Không thể tải lên ${attachment.url}`);
        }
      }
      
      if (msg.length === 0) {
        return send("⚠️ Không có liên kết nào được tạo.");
      }
      
      return send(msg.join(',\n'));
    }
  };
  