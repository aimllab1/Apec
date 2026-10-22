import chatHandler from '../Backend_API/api/chat.js';

export default async function handler(req, res) {
  return chatHandler(req, res);
}
