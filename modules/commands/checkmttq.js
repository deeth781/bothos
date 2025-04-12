module.exports.config = {
    name: "checkmttq",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑽𝒖̃ 𝑻𝒂̀𝒊 (𝑺𝒕𝒂𝒘)",
    description: "Check Var MTTQ",
    commandCategory: "Tìm kiếm",
    usages: "checkmttq",
    cooldowns: 5
  };
  
  module.exports.run = async ({ api, event, args }) => {
    const axios = global.nodemodule["axios"];
    
    // Kiểm tra xem người dùng có nhập từ khóa tìm kiếm không
    if (args.length === 0) {
      return api.sendMessage("Vui lòng nhập từ khóa để tìm kiếm.", event.threadID, event.messageID);
    }
  
    let timkiem = args.join(" ");
    
    try {
      // Gửi yêu cầu đến API với từ khóa người dùng nhập vào
      const res = await axios.get(`https://tracuusaoke.co/api/search/yagi?type=full&keyword=${encodeURIComponent(timkiem)}`);
      
      // Kiểm tra cấu trúc phản hồi và kiểm tra dữ liệu
      if (!res.data || res.data.length === 0) {
        return api.sendMessage("Không tìm thấy kết quả nào.", event.threadID, event.messageID);
      }
  
      // Tạo danh sách các thông tin từ kết quả API
      let message = "Thông tin tìm kiếm:\n\n";
      res.data.forEach(item => {
        message += `Id: ${item.id}\nNgày Chuyển: ${item.date}\nSố Tiền: ${item.money}\nNội Dung: ${item.content}\n\n`;
      });
  
      // Gửi toàn bộ dữ liệu trong một tin nhắn
      return api.sendMessage(message.trim(), event.threadID, event.messageID);
      
    } catch (error) {
      // Xử lý lỗi nếu có vấn đề trong quá trình gọi API
      console.error(error);
      return api.sendMessage("Đã xảy ra lỗi khi truy vấn dữ liệu.", event.threadID, event.messageID);
    }
  };