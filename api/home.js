import homepageHandler from '../Backend_API/api/homepage.js';

export default async function handler(req, res) {
  return homepageHandler(req, res);
}
