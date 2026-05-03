const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'index.html');
let content = fs.readFileSync(file, 'utf8');

// ============================
// 1. Replace sentimentScore state block in ChatInterface
//    — Add: score history, sessionAvg, journalBaseScore
// ============================
content = content.replace(
  `  const [sentimentScore, setSentimentScore] = useState(null);`,
  `  // Sentiment state
  const journalBaseScore = (() => {
    if (user?.journalMemory) {
      // Rough heuristic: negative keywords in journal analysis lower the baseline
      const mem = user.journalMemory.toLowerCase();
      const negWords = ['sad','anxious','panic','stress','overwhelm','heavy','cry','depress','alone','scared','worried'];
      const hits = negWords.filter(w => mem.includes(w)).length;
      return Math.max(3, 5 - hits);
    }
    return 5;
  })();
  const [sentimentScore, setSentimentScore] = useState(journalBaseScore);
  const [scoreHistory, setScoreHistory] = useState([journalBaseScore]);
  const [sessionAvg, setSessionAvg] = useState(journalBaseScore);`
);

// ============================
// 2. Replace AI prompt to ask Gemini for a JSON score
// ============================
content = content.replace(
  `        systemInstruction: \`You are Bree, an empathetic AI companion. Keep your responses VERY CONCISE (1-3 sentences max). DEDUPLICATION: DO NOT repeat any phrases or advice given previously in this session. Flow with the user's intent.\${languageContext}\${journalContext}\``,
  `        systemInstruction: \`You are Bree, an empathetic AI companion. Keep your responses VERY CONCISE (1-3 sentences max). DEDUPLICATION: DO NOT repeat any phrases or advice given previously in this session. Flow with the user's intent.
CRITICAL: At the end of EVERY response, append a JSON block on a new line: {"sentiment_score": X} where X is an integer from 1-10. 
Score guide: 1-3 = high distress/panic/deep sadness. 4-6 = neutral/mixed/slightly stressed. 7-10 = calm/positive/hopeful.
Example response: "I hear you, that sounds really hard." {"sentiment_score": 3}
The JSON block must ALWAYS be included, always at the end.\${languageContext}\${journalContext}\``
);

// ============================
// 3. Replace the response processing block to extract score from JSON
// ============================
content = content.replace(
  `      let responseText = "I'm here to listen.";
      if (typeof result.response?.text === 'function') {
        responseText = result.response.text();
      } else if (result.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        responseText = result.response.candidates[0].content.parts[0].text;
      }
      
      setMessages(prev => [...prev, { id: Date.now()+1, sender: 'bree', text: responseText }]);`,
  `      let rawText = "I'm here to listen.";
      if (typeof result.response?.text === 'function') {
        rawText = result.response.text();
      } else if (result.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        rawText = result.response.candidates[0].content.parts[0].text;
      }
      
      // Extract sentiment_score from JSON block if present
      let aiScore = null;
      const jsonMatch = rawText.match(/\{"sentiment_score"\s*:\s*(\d+)\}/);
      if (jsonMatch) {
        aiScore = Math.min(10, Math.max(1, parseInt(jsonMatch[1], 10)));
        rawText = rawText.replace(/\{"sentiment_score"\s*:\s*\d+\}/, '').trim();
      }
      
      // Fallback to keyword analysis
      if (!aiScore) aiScore = analyzeSentiment(userMsg);
      
      // Update score and session average
      const newHistory = [...scoreHistory, aiScore];
      const avg = Math.round(newHistory.reduce((a, b) => a + b, 0) / newHistory.length);
      setSentimentScore(aiScore);
      setScoreHistory(newHistory);
      setSessionAvg(avg);
      logScore(user?.id, aiScore, !!user?.therapist);
      
      const responseText = rawText || "I'm here to listen.";
      setMessages(prev => [...prev, { id: Date.now()+1, sender: 'bree', text: responseText }]);`
);

// ============================
// 4. Remove old score line (logScore already called above)
// ============================
content = content.replace(
  `    const score = analyzeSentiment(userMsg);
    setSentimentScore(score);
    logScore(user?.id, score, !!user?.therapist);`,
  `    // Score is now computed after AI response`
);

// ============================
// 5. Replace static sidebar metric bar with dynamic one (always visible, color-coded)
// ============================
content = content.replace(
  `          {sentimentScore && (
            <div className="mt-auto p-4 bg-white/10 rounded-xl border border-white/10">
              <p className="text-xs text-blue-200 mb-1 flex items-center gap-1"><Info size={12} /> {t('chat.metric')}</p>
              <div className="w-full bg-black/20 rounded-full h-2 mb-1">
                <div className="bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 h-2 rounded-full transition-all duration-1000" style={{ width: \`\${sentimentScore * 10}%\` }}></div>
              </div>
              <p className="text-[10px] text-end text-white/60" dir="ltr">{t('chat.score', { score: sentimentScore })}</p>
            </div>
          )}`,
  `          <div className="mt-auto p-4 bg-white/10 rounded-xl border border-white/10">
            <p className="text-xs text-blue-200 mb-2 flex items-center gap-1"><Info size={12} /> {t('chat.metric')}</p>
            <div className="w-full bg-black/20 rounded-full h-3 mb-2 overflow-hidden">
              <div
                style={{
                  width: \`\${sentimentScore * 10}%\`,
                  transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: sentimentScore <= 3
                    ? 'linear-gradient(to right, #ef4444, #f97316)'
                    : sentimentScore <= 6
                    ? 'linear-gradient(to right, #f97316, #eab308)'
                    : 'linear-gradient(to right, #22c55e, #10b981)'
                }}
                className="h-3 rounded-full"
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-white/50">
              <span>{sentimentScore <= 3 ? '😔 Distressed' : sentimentScore <= 6 ? '😐 Neutral' : '😊 Calm'}</span>
              <span dir="ltr">{sessionAvg}/10 avg</span>
            </div>
            <p className="text-[10px] text-end text-white/40 mt-1" dir="ltr">Now: {sentimentScore}/10</p>
          </div>`
);

fs.writeFileSync(file, content);
console.log('Sentiment metric upgrade complete!');
