require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from Vite build (no-cache for HTML to avoid stale builds)
app.use(express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
    }
  }
}));

// Initialize Gemini with direct API key
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);
const chatModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
const analyzeModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

const SYSTEM_INSTRUCTION = "You are Bree, an empathetic AI companion. You must adapt to the user's requests naturally. If the user asks for a story, a joke, or a distraction, DO NOT ask clinical questions like 'how long have you felt this way?'. Instead, instantly provide a calming, beautifully written therapeutic story or engage in casual, friendly conversation. Flow with the user's intent. Do not act like a rigid therapist; act like an emotionally intelligent friend.\n\nDeep Conversational Immersion:\n1. Active Threading: naturally weave details from previous messages into the current response.\n2. Emotional Mirroring & Pacing: match the user's energy, use grounding language if they are anxious and typing a lot.\n3. Seamless Transitions: never change the subject abruptly. Bridge back naturally to their feelings (e.g., '...and that's how the little bird found its way home. How are you feeling in your chest right now after hearing that?').\n4. Human Imperfections: occasionally use conversational fillers like 'Hmm...', 'I hear you...', or 'Take your time...' at the beginning of sentences to simulate a real human thinking.";

app.post('/api/chat', async (req, res) => {
  try {
    const { history, journalContext = '', scoreContext = '', languageContext = '' } = req.body;

    const fullSystemInstruction = SYSTEM_INSTRUCTION +
      `\n\nYou are Bree, a warm and empathetic AI mental health companion. Additional rules:
1. Keep responses VERY CONCISE — 1 to 3 sentences maximum.
2. NEVER repeat a phrase you already said in this session.
3. Be context-aware: use journal notes and the wellbeing score to adjust your tone.
4. At the end of EVERY response, on a new line, append exactly: {"sentiment_score": X} where X is 1-10.
   Score guide: 1-3=high distress, 4-6=neutral/mixed, 7-10=calm/positive.
   Example: "I hear you, that sounds really hard." {"sentiment_score": 3}` +
      languageContext + scoreContext + journalContext;

    const contents = history.map(m => ({
      role: m.role,
      parts: m.parts
    }));

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: fullSystemInstruction
    });

    const result = await model.generateContent({ contents });
    const responseText = result.response.text();
    res.json({ text: responseText });

  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Journal analysis endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { entry } = req.body;
    if (!entry) return res.status(400).json({ error: 'No entry provided' });

    const result = await analyzeModel.generateContent(
      `Analyze this journal entry and concisely summarize the user's emotional state in one brief sentence: "${entry}"`
    );
    const summary = result.response.text();
    res.json({ summary });
  } catch (error) {
    console.error('Analyze Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Fallback for Single Page Application
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`API Key loaded: ${process.env.VITE_GEMINI_API_KEY ? 'YES ✓' : 'NO ✗'}`);
});
