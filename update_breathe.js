const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'index.html');
let content = fs.readFileSync(targetFile, 'utf8');

// Chunk 1: Breathing CSS
content = content.replace(
`    /* Glowing Icons & Effects */
    .glow-blue { filter: drop-shadow(0 0 12px rgba(59, 130, 246, 0.4)); }
    .glow-purple { filter: drop-shadow(0 0 12px rgba(168, 85, 247, 0.4)); }
    .glow-red { filter: drop-shadow(0 0 15px rgba(239, 68, 68, 0.5)); }
    .glow-orange { filter: drop-shadow(0 0 12px rgba(249, 115, 22, 0.4)); }

    /* Panic Help Red Pulse */`,
`    /* Glowing Icons & Effects */
    .glow-blue { filter: drop-shadow(0 0 12px rgba(59, 130, 246, 0.4)); }
    .glow-purple { filter: drop-shadow(0 0 12px rgba(168, 85, 247, 0.4)); }
    .glow-red { filter: drop-shadow(0 0 15px rgba(239, 68, 68, 0.5)); }
    .glow-orange { filter: drop-shadow(0 0 12px rgba(249, 115, 22, 0.4)); }

    @keyframes breathing {
      0% { transform: scale(1.0); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1.0); }
    }
    .breathing-effect {
      animation: breathing 4s ease-in-out infinite;
    }

    /* Panic Help Red Pulse */`
);

// Chunk 2: Auth component update
content = content.replace(
`// --- 1. Authentication & Onboarding ---
const Auth = ({ onLogin }) => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) { setError(t('auth.error_empty')); return; }
    if (isLogin) {
      const savedStr = localStorage.getItem('breathe_user');
      if (savedStr) {
        const saved = JSON.parse(savedStr);
        if (saved.email === email && saved.password === password) { onLogin(saved); return; }
      }
      setError(t('auth.error_invalid'));
    } else {
      onLogin({ isNew: true, email, password });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass w-full max-w-md p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-300 to-yellow-200"></div>
        <div className="flex flex-col items-center mb-6">
          <BreeIcon size={80} />
          <h2 className="font-serif-logo text-4xl text-[#1e293b] mt-4">{t('auth.welcome')}</h2>
          <p className="text-sm text-center text-gray-600 mt-2">{t('auth.subtitle')}</p>
        </div>
        {error && <p className="text-red-500 text-sm text-center mb-4 font-medium">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4 text-start">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.email')}</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.password')}</label>
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <button type="submit" className="w-full bg-[#1e293b] hover:bg-black text-white py-3 rounded-xl font-medium transition shadow-lg mt-6">
            {isLogin ? t('auth.login') : t('auth.signup')}
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">{isLogin ? t('auth.no_account') : t('auth.has_account')} </span>
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-[#1e293b] font-bold hover:underline">
            {isLogin ? t('auth.signup') : t('auth.login')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};`,
`// --- 1. Authentication & Onboarding ---
const Auth = ({ onLogin }) => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showForgot) {
      if (!email) { setError(t('auth.error_empty')); return; }
      setResetSent(true);
      setError('');
      return;
    }
    if (!email || !password) { setError(t('auth.error_empty')); return; }
    if (isLogin) {
      const savedStr = localStorage.getItem('breathe_user');
      if (savedStr) {
        const saved = JSON.parse(savedStr);
        if (saved.email === email && saved.password === password) { 
          onLogin({ ...saved, remember: rememberMe }); 
          return; 
        }
      }
      setError(t('auth.error_invalid'));
    } else {
      onLogin({ isNew: true, email, password, remember: rememberMe });
    }
  };

  const handleGoogleAuth = () => {
    alert("Connecting to Google Auth...");
    onLogin({ isNew: false, email: "googleuser@example.com", name: "Google User", remember: true });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass w-full max-w-md p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-300 to-yellow-200"></div>
        <div className="flex flex-col items-center mb-6">
          <BreeIcon size={80} />
          <h2 className="font-serif-logo text-4xl text-[#1e293b] mt-4">{t('auth.welcome')}</h2>
          <p className="text-sm text-center text-gray-600 mt-2">{t('auth.subtitle')}</p>
        </div>
        {error && <p className="text-red-500 text-sm text-center mb-4 font-medium">{error}</p>}
        {resetSent ? (
          <div className="text-center">
            <p className="text-green-600 font-medium mb-4">Password reset link sent to {email}!</p>
            <button onClick={() => { setShowForgot(false); setResetSent(false); }} className="text-[#1e293b] font-bold hover:underline">Back to login</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-start">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.email')}</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            {!showForgot && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.password')}</label>
                <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
            )}
            {!showForgot && isLogin && (
              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  Remember Me
                </label>
                <button type="button" onClick={() => setShowForgot(true)} className="text-[#1e293b] hover:underline font-medium">Forgot Password?</button>
              </div>
            )}
            <button type="submit" className="w-full bg-[#1e293b] hover:bg-black text-white py-3 rounded-xl font-medium transition shadow-lg mt-6">
              {showForgot ? 'Send Reset Link' : isLogin ? t('auth.login') : t('auth.signup')}
            </button>
            {!showForgot && (
              <button type="button" onClick={handleGoogleAuth} className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 py-3 rounded-xl font-medium transition shadow-sm mt-3 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z" /></svg>
                Connect with Google
              </button>
            )}
          </form>
        )}
        {!showForgot && (
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">{isLogin ? t('auth.no_account') : t('auth.has_account')} </span>
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-[#1e293b] font-bold hover:underline">
              {isLogin ? t('auth.signup') : t('auth.login')}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};`
);

// Chunk 3: Onboarding remember me save
content = content.replace(
`    const user = saveUser({ ...tempUser, ...formData, id: Date.now().toString() });
    localStorage.setItem('breathe_user', JSON.stringify(user));
    onComplete(user);`,
`    const user = saveUser({ ...tempUser, ...formData, id: Date.now().toString() });
    if (tempUser.remember !== false) {
      localStorage.setItem('breathe_user', JSON.stringify(user));
    }
    onComplete(user);`
);

// Chunk 4: SupportPage Component (before Dashboard)
content = content.replace(
`// --- 2. Dashboard Navigation ---
const Dashboard = ({ user, setView, onLogout }) => {`,
`// --- Support Page ---
const SupportPage = ({ onBack }) => {
  const { t } = useTranslation();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen p-6 flex flex-col items-center justify-center relative">
      <div className="absolute top-8 left-8">
        <button onClick={onBack} className="text-[#2B3A55] hover:text-black flex items-center gap-2">
          <ArrowLeft size={20} /> {t('panic.back') || 'Back'}
        </button>
      </div>
      <div className="glass p-12 text-center rounded-3xl max-w-lg w-full">
        <h1 className="font-serif-logo text-4xl text-[#2B3A55] mb-6">Support Details</h1>
        <p className="text-gray-700 mb-8 font-medium">We are here to help. Reach out to us anytime.</p>
        <div className="bg-white/50 p-6 rounded-2xl border border-white/60 mb-8 font-bold text-2xl text-blue-900 shadow-sm">
          breath.tma@gmail.com
        </div>
        <BreeIcon size={80} className="mx-auto breathing-effect" />
      </div>
    </motion.div>
  );
};

// --- 2. Dashboard Navigation ---
const Dashboard = ({ user, setView, onLogout }) => {`
);

// Chunk 5: Dashboard Support button
content = content.replace(
`          <a href="mailto:breath.tma@gmail.com" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition">
            <HelpCircle size={18} strokeWidth={1.5} /> {t('dashboard.support')}
          </a>`,
`          <button onClick={() => setView('support')} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition">
            <HelpCircle size={18} strokeWidth={1.5} /> {t('dashboard.support')}
          </button>`
);

// Chunk 6: PanicHelp breathing effect step 0
content = content.replace(
`<BreeIcon size={120} className="mt-8" />`,
`<BreeIcon size={120} className="mt-8 breathing-effect" />`
);

// Chunk 7: PanicHelp support button
content = content.replace(
`// --- 3. Panic Help Section (Flashcards) ---
const PanicHelp = ({ onBack, user }) => {`,
`// --- 3. Panic Help Section (Flashcards) ---
const PanicHelp = ({ onBack, user, onSupport }) => {`
);

content = content.replace(
`<button className="text-sm font-medium text-gray-500">{t('panic.support')}</button>`,
`<button onClick={onSupport} className="text-sm font-medium text-gray-500">{t('panic.support')}</button>`
);

// Chunk 8: ChatInterface deduplication & concise
content = content.replace(
`const ChatInterface = ({ onBack, user }) => {`,
`const ChatInterface = ({ onBack, user, onSupport, lang }) => {`
);

content = content.replace(
`<button className="text-sm font-medium text-gray-500">{t('chat.support')}</button>`,
`<button onClick={onSupport} className="text-sm font-medium text-gray-500">{t('chat.support')}</button>`
);

content = content.replace(
`      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        systemInstruction: "You are Bree, an empathetic AI companion. You must adapt to the user's requests naturally. If the user asks for a story, a joke, or a distraction, DO NOT ask clinical questions like 'how long have you felt this way?'. Instead, instantly provide a calming, beautifully written therapeutic story or engage in casual, friendly conversation. Flow with the user's intent. Do not act like a rigid therapist; act like an emotionally intelligent friend.\\n\\nDeep Conversational Immersion:\\n1. Active Threading: naturally weave details from previous messages into the current response.\\n2. Emotional Mirroring & Pacing: match the user's energy, use grounding language if they are anxious and typing a lot.\\n3. Seamless Transitions: never change the subject abruptly. Bridge back naturally to their feelings (e.g., '...and that's how the little bird found its way home. How are you feeling in your chest right now after hearing that?').\\n4. Human Imperfections: occasionally use conversational fillers like 'Hmm...', 'I hear you...', or 'Take your time...' at the beginning of sentences to simulate a real human thinking."
      }, { apiVersion: 'v1beta' });`,
`      const journalContext = user?.journalMemory ? \`\\nUser's recent journal analysis: "\${user.journalMemory}". Refer to this gracefully if relevant.\` : '';
      const languageContext = lang === 'ar' ? '\\nCRITICAL: YOU MUST RESPOND EXCLUSIVELY IN ARABIC.' : '';
      
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        systemInstruction: \`You are Bree, an empathetic AI companion. Keep your responses VERY CONCISE (1-3 sentences max). DEDUPLICATION: DO NOT repeat any phrases or advice given previously in this session. Flow with the user's intent.\${languageContext}\${journalContext}\`
      }, { apiVersion: 'v1beta' });`
);

// Chunk 9: MoodTracker Palette and Persistence
content = content.replace(
`// --- 5. Mood Tracker ---
const MoodTracker = ({ onBack }) => {
  const { t } = useTranslation();
  const days = ['sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [grid, setGrid] = useState(Array(35).fill('none'));

  const colorMap = { sad: 'bg-[#1D60A4]', panic: 'bg-[#B21F1F]', anxious: 'bg-[#E3983B]', stressed: 'bg-[#EBD15A]', good: 'bg-[#1E9540]', none: 'bg-white/40' };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen p-6 flex flex-col max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="text-[#2B3A55] hover:text-black flex items-center gap-2">
          <ArrowLeft size={20} /> {t('mood.back')}
        </button>
        <h1 className="font-serif-logo text-4xl text-[#2B3A55]">{t('mood.title')}</h1>
        <button className="text-sm font-medium text-gray-500">{t('mood.support')}</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full relative">
        <p className="text-[#1e293b] mb-4 font-medium italic">{t('mood.prompt')}</p>
        <div className="bg-[#fdfaf0] shadow-xl rounded-[40px] p-12 border border-yellow-100 w-full max-w-3xl">
          <div className="grid grid-cols-7 gap-4 text-center mb-6 text-[#1e293b] font-serif-logo text-xl">
            {days.map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-4">
            {grid.map((status, i) => (
              <div 
                key={i} 
                onClick={() => {
                  const newGrid = [...grid];
                  newGrid[i] = newGrid[i] === 'none' ? 'good' : 'none';
                  setGrid(newGrid);
                }}
                className={\`aspect-square rounded-xl \${colorMap[status]} cursor-pointer transition hover:scale-105 shadow-sm border border-black/5\`}
              ></div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm text-[#2B3A55] font-medium">
            <div className="flex items-center gap-2"><div className={\`w-6 h-6 rounded-md \${colorMap.sad}\`}></div> {t('mood.sad')}</div>
            <div className="flex items-center gap-2"><div className={\`w-6 h-6 rounded-md \${colorMap.panic}\`}></div> {t('mood.panic')}</div>
            <div className="flex items-center gap-2"><div className={\`w-6 h-6 rounded-md \${colorMap.anxious}\`}></div> {t('mood.anxious')}</div>
            <div className="flex items-center gap-2"><div className={\`w-6 h-6 rounded-md \${colorMap.good}\`}></div> {t('mood.good')}</div>
          </div>
        </div>
      </div>`,
`// --- 5. Mood Tracker ---
const MoodTracker = ({ onBack, onSupport }) => {
  const { t } = useTranslation();
  const days = ['sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [grid, setGrid] = useState(Array(35).fill('none'));
  const [selectedColor, setSelectedColor] = useState('good');

  useEffect(() => {
    const saved = localStorage.getItem('breathe_mood_grid');
    if (saved) setGrid(JSON.parse(saved));
  }, []);

  const colorMap = { sad: 'bg-[#1D60A4]', panic: 'bg-[#B21F1F]', anxious: 'bg-[#E3983B]', stressed: 'bg-[#EBD15A]', good: 'bg-[#1E9540]', none: 'bg-white/40' };

  const handleSquareClick = (index) => {
    const newGrid = [...grid];
    newGrid[index] = selectedColor;
    setGrid(newGrid);
    localStorage.setItem('breathe_mood_grid', JSON.stringify(newGrid));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen p-6 flex flex-col max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="text-[#2B3A55] hover:text-black flex items-center gap-2">
          <ArrowLeft size={20} /> {t('mood.back')}
        </button>
        <h1 className="font-serif-logo text-4xl text-[#2B3A55]">{t('mood.title')}</h1>
        <button onClick={onSupport} className="text-sm font-medium text-gray-500">{t('mood.support')}</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full relative">
        <p className="text-[#1e293b] mb-4 font-medium italic">Select a color below, then click a box to log today's mood</p>
        <div className="bg-[#fdfaf0] shadow-xl rounded-[40px] p-12 border border-yellow-100 w-full max-w-3xl">
          <div className="grid grid-cols-7 gap-4 text-center mb-6 text-[#1e293b] font-serif-logo text-xl">
            {days.map((d, i) => <div key={i}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-4">
            {grid.map((status, i) => (
              <div 
                key={i} 
                onClick={() => handleSquareClick(i)}
                className={\`aspect-square rounded-xl \${colorMap[status]} cursor-pointer transition hover:scale-105 shadow-sm border border-black/5\`}
              ></div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm text-[#2B3A55] font-medium">
            <div onClick={() => setSelectedColor('sad')} className={\`cursor-pointer flex items-center gap-2 \${selectedColor === 'sad' ? 'scale-110 font-bold border-b-2 border-black' : 'opacity-70'}\`}><div className={\`w-6 h-6 rounded-md \${colorMap.sad}\`}></div> {t('mood.sad')}</div>
            <div onClick={() => setSelectedColor('panic')} className={\`cursor-pointer flex items-center gap-2 \${selectedColor === 'panic' ? 'scale-110 font-bold border-b-2 border-black' : 'opacity-70'}\`}><div className={\`w-6 h-6 rounded-md \${colorMap.panic}\`}></div> {t('mood.panic')}</div>
            <div onClick={() => setSelectedColor('anxious')} className={\`cursor-pointer flex items-center gap-2 \${selectedColor === 'anxious' ? 'scale-110 font-bold border-b-2 border-black' : 'opacity-70'}\`}><div className={\`w-6 h-6 rounded-md \${colorMap.anxious}\`}></div> {t('mood.anxious')}</div>
            <div onClick={() => setSelectedColor('good')} className={\`cursor-pointer flex items-center gap-2 \${selectedColor === 'good' ? 'scale-110 font-bold border-b-2 border-black' : 'opacity-70'}\`}><div className={\`w-6 h-6 rounded-md \${colorMap.good}\`}></div> {t('mood.good')}</div>
          </div>
        </div>
      </div>`
);

// Chunk 10: Journal PIN & Analyze
content = content.replace(
`// --- 6. Journal ---
const Journal = ({ onBack }) => {
  const { t } = useTranslation();
  const [entry, setEntry] = useState('');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen p-6 flex flex-col max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="text-[#2B3A55] hover:text-black flex items-center gap-2">
          <ArrowLeft size={20} /> {t('journal.back')}
        </button>
        <h1 className="font-serif-logo text-4xl text-[#2B3A55]">{t('journal.title')}</h1>
        <button className="text-sm font-medium text-gray-500">{t('journal.support')}</button>
      </div>`,
`// --- 6. Journal ---
const Journal = ({ onBack, onSupport, user, setUser }) => {
  const { t } = useTranslation();
  const [entry, setEntry] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (user?.journalEntry) setEntry(user.journalEntry);
  }, [user]);

  const handleUnlock = () => {
    if (!user.journalPin) {
      const updatedUser = { ...user, journalPin: pinInput };
      setUser(updatedUser);
      localStorage.setItem('breathe_user', JSON.stringify(updatedUser));
      setIsUnlocked(true);
    } else if (pinInput === user.journalPin) {
      setIsUnlocked(true);
    } else {
      setPinError('Incorrect PIN');
    }
  };

  const handleSave = () => {
    const updatedUser = { ...user, journalEntry: entry };
    setUser(updatedUser);
    localStorage.setItem('breathe_user', JSON.stringify(updatedUser));
    alert('Journal entry saved.');
  };

  const handleAnalyze = async () => {
    if (!entry.trim()) return;
    setIsAnalyzing(true);
    try {
      const apiKey = window.__GEMINI_API_KEY__;
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(\`Analyze this journal entry and concisely summarize the user's emotional state in one brief sentence: "\${entry}"\`);
      const summary = result.response.text();
      
      const updatedUser = { ...user, journalMemory: summary, journalEntry: entry };
      setUser(updatedUser);
      localStorage.setItem('breathe_user', JSON.stringify(updatedUser));
      alert("Analysis Saved: " + summary);
    } catch (e) {
      console.error(e);
      alert('Analysis failed: ' + e.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isUnlocked) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen p-6 flex items-center justify-center">
        <div className="glass p-10 rounded-3xl text-center max-w-sm w-full">
          <Book className="mx-auto mb-4 text-blue-500" size={48} />
          <h2 className="text-2xl font-serif-logo text-[#2B3A55] mb-2">{user.journalPin ? 'Enter Journal PIN' : 'Set Journal PIN'}</h2>
          <p className="text-sm text-gray-500 mb-6">{user.journalPin ? 'Enter your 4-digit PIN to access your secure space.' : 'Create a 4-digit PIN to secure your journal.'}</p>
          <input 
            type="password" 
            maxLength={4}
            value={pinInput}
            onChange={e => setPinInput(e.target.value.replace(/[^0-9]/g, ''))}
            className="w-full text-center tracking-widest text-2xl px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-300 mb-4" 
            placeholder="****"
          />
          {pinError && <p className="text-red-500 text-sm mb-4">{pinError}</p>}
          <button onClick={handleUnlock} disabled={pinInput.length !== 4} className="w-full bg-[#1e293b] text-white py-3 rounded-xl font-medium transition disabled:opacity-50">
            {user.journalPin ? 'Unlock' : 'Set PIN'}
          </button>
          <button onClick={onBack} className="w-full mt-4 text-gray-500 hover:text-black">Cancel</button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen p-6 flex flex-col max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="text-[#2B3A55] hover:text-black flex items-center gap-2">
          <ArrowLeft size={20} /> {t('journal.back')}
        </button>
        <h1 className="font-serif-logo text-4xl text-[#2B3A55]">{t('journal.title')}</h1>
        <button onClick={onSupport} className="text-sm font-medium text-gray-500">{t('journal.support')}</button>
      </div>`
);

content = content.replace(
`      <div className="flex justify-between w-full mt-6 pt-4 text-sm font-medium text-gray-600">
        <button className="hover:text-black transition">{t('journal.save')}</button>
        <button className="text-red-500 hover:text-red-700 transition">{t('journal.analyze')}</button>
      </div>`,
`      <div className="flex justify-between w-full mt-6 pt-4 text-sm font-medium text-gray-600">
        <button onClick={handleSave} className="hover:text-black transition">{t('journal.save')}</button>
        <button onClick={handleAnalyze} disabled={isAnalyzing} className="text-red-500 hover:text-red-700 transition disabled:opacity-50">
          {isAnalyzing ? 'Analyzing...' : t('journal.analyze')}
        </button>
      </div>`
);

// Chunk 11: App component router updates & handleAuth
content = content.replace(
`  const handleAuth = (authData) => {
    if (authData.isNew) {
      setUser(authData);
      setView('onboarding');
    } else {
      setUser(authData);
      setView('dashboard');
    }
  };

  const logout = () => {
    localStorage.removeItem('breathe_user');
    setUser(null);
    setView('auth');
  };`,
`  const handleAuth = (authData) => {
    if (authData.remember) {
      localStorage.setItem('breathe_user', JSON.stringify(authData));
    }
    if (authData.isNew) {
      setUser(authData);
      setView('onboarding');
    } else {
      setUser(authData);
      setView('dashboard');
    }
  };

  const logout = () => {
    // If not remembered, clear from local storage
    if (user && !user.remember) {
      localStorage.removeItem('breathe_user');
    }
    setUser(null);
    setView('auth');
  };`
);

content = content.replace(
`        {view === 'auth' ? (
          <Auth key="auth" onLogin={handleAuth} />
        ) : view === 'onboarding' ? (
          <Onboarding key="onboarding" tempUser={user} onComplete={(u) => { setUser(u); setView('dashboard'); }} />
        ) : view === 'dashboard' ? (
          <Dashboard key="dashboard" user={user} setView={setView} onLogout={logout} />
        ) : view === 'chat' ? (
          <ChatInterface key="chat" onBack={() => setView('dashboard')} user={user} />
        ) : view === 'panic' ? (
          <PanicHelp key="panic" onBack={() => setView('dashboard')} user={user} />
        ) : view === 'mood' ? (
          <MoodTracker key="mood" onBack={() => setView('dashboard')} />
        ) : view === 'journal' ? (
          <Journal key="journal" onBack={() => setView('dashboard')} />
        ) : null}`,
`        {view === 'auth' ? (
          <Auth key="auth" onLogin={handleAuth} />
        ) : view === 'onboarding' ? (
          <Onboarding key="onboarding" tempUser={user} onComplete={(u) => { setUser(u); setView('dashboard'); }} />
        ) : view === 'dashboard' ? (
          <Dashboard key="dashboard" user={user} setView={setView} onLogout={logout} />
        ) : view === 'chat' ? (
          <ChatInterface key="chat" onBack={() => setView('dashboard')} user={user} onSupport={() => setView('support')} lang={lang} />
        ) : view === 'panic' ? (
          <PanicHelp key="panic" onBack={() => setView('dashboard')} user={user} onSupport={() => setView('support')} />
        ) : view === 'mood' ? (
          <MoodTracker key="mood" onBack={() => setView('dashboard')} onSupport={() => setView('support')} />
        ) : view === 'journal' ? (
          <Journal key="journal" onBack={() => setView('dashboard')} user={user} setUser={setUser} onSupport={() => setView('support')} />
        ) : view === 'support' ? (
          <SupportPage key="support" onBack={() => setView('dashboard')} />
        ) : null}`
);

fs.writeFileSync(targetFile, content);
console.log('Update complete.');
