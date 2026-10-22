import uploadHandler from '../Backend_API/api/upload.js';

export default async function handler(req, res) {
  return uploadHandler(req, res);
}
