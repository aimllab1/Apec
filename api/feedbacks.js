import feedbacksHandler from '../Backend_API/api/feedbacks.js';

export default async function handler(req, res) {
  return feedbacksHandler(req, res);
}
