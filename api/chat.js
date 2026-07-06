import { getLocalResponse } from '../src/ai/engine/localAI.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, session } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // session is passed by reference from the Vite middleware session store
    // mutations inside getLocalResponse persist in the store
    const { response } = getLocalResponse(message, session);
    return res.status(200).json({ response });
  } catch (error) {
    console.error('[Chat Handler Error]:', error.message);
    return res.status(200).json({
      response: "I'm having trouble right now. Please try again or call the APEC helpline: +91 7418064336"
    });
  }
}
