import inquiriesHandler from '../Backend_API/api/inquiries.js';

export default async function handler(req, res) {
  return inquiriesHandler(req, res);
}
