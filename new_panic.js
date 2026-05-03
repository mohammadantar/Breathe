// new_panic.js — The full 22-step PanicHelp component string
module.exports = `// --- 3. Panic Help Section (Flashcards) ---
const PanicHelp = ({ onBack, user, onSupport, onPanicComplete }) => {
  const { t } = useTranslation();
  const STORAGE_KEY = 'breathe_panic_progress';

  const [step, setStep] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === new Date().toDateString() && parsed.step > 0) {
        return parsed.step;
      }
    }
    return 0;
  });

  const [breathPhase, setBreathPhase] = useState('in');
  const [breathCount, setBreathCount] = useState(4);
  const [groundInputs, setGroundInputs] = useState({ see: ['','','','',''], touch: ['','',''], hear: ['','',''], smell: ['',''], taste: [''] });
  const [checkinScore, setCheckinScore] = useState(5);
  const [doneConfirmed, setDoneConfirmed] = useState(false);

  // Persist progress
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, date: new Date().toDateString() }));
  }, [step]);

  // Breathing timer (cards 4-6, steps 3-5)
  useEffect(() => {
    if (step < 3 || step > 5) return;
    const phases = { in: { next: 'hold', dur: 4000 }, hold: { next: 'out', dur: 4000 }, out: { next: 'in', dur: 4000 } };
    setBreathCount(4);
    const countInt = setInterval(() => setBreathCount(c => c > 1 ? c - 1 : 1), 1000);
    const phaseTimer = setTimeout(() => setBreathPhase(p => phases[p].next), phases[breathPhase].dur);
    return () => { clearInterval(countInt); clearTimeout(phaseTimer); };
  }, [step, breathPhase]);

  const goNext = () => { setDoneConfirmed(false); setStep(s => Math.min(s + 1, 21)); };
  const goPrev = () => { setDoneConfirmed(false); setStep(s => Math.max(s - 1, 0)); };

  const handleFinish = () => {
    localStorage.removeItem(STORAGE_KEY);
    if (onPanicComplete) onPanicComplete(checkinScore);
    onBack();
  };

  const BreathCircle = ({ phase, count }) => {
    const scale = phase === 'in' ? 1.18 : phase === 'hold' ? 1.15 : 1;
    const label = phase === 'in' ? 'Breathe In' : phase === 'hold' ? 'Hold' : 'Breathe Out';
    const color = phase === 'in' ? '#3b82f6' : phase === 'hold' ? '#8b5cf6' : '#10b981';
    return (
      <div className="flex flex-col items-center gap-6">
        <div style={{ transform: 'scale(' + scale + ')', transition: 'transform 1s ease-in-out', background: 'radial-gradient(circle, ' + color + '33 0%, ' + color + '11 70%)', border: '3px solid ' + color + '66' }} className="w-36 h-36 rounded-full flex flex-col items-center justify-center shadow-lg">
          <BreeIcon size={70} className="breathing-effect" />
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold" style={{ color }}>{label}</p>
          <p className="text-5xl font-black text-[#1e293b] mt-1">{count}</p>
        </div>
      </div>
    );
  };

  const GroundInput = ({ sense, prompts, emoji, color }) => (
    <div className="w-full">
      <p className="text-lg font-bold mb-3" style={{ color }}>{emoji} Name {prompts.length} things you can <span className="underline">{sense}</span>:</p>
      <div className="space-y-2">
        {prompts.map((_, i) => (
          <input key={i} type="text" placeholder={prompts[i]} value={groundInputs[sense][i]} onChange={e => { const arr = [...groundInputs[sense]]; arr[i] = e.target.value; setGroundInputs(g => ({...g, [sense]: arr})); }} className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 bg-white/80 focus:outline-none focus:border-blue-400 text-[#1e293b] placeholder-gray-400 transition" />
        ))}
      </div>
    </div>
  );

  const cards = [
    // PHASE 1: Mental Grounding (0-2)
    { phase: 'Mental Grounding', bg: '#FFF9E5', content: (
      <div className="flex flex-col items-center text-center gap-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-3xl">🌊</div>
        <h2 className="font-serif-logo text-3xl text-red-800">You are not in danger.</h2>
        <p className="text-xl text-[#2B3A55] font-medium leading-relaxed">This is a panic attack.<br/>It is temporary. It will pass.</p>
        <p className="text-gray-600 mt-4 italic">"Thousands of people have felt exactly this way<br/>and every single one of them made it through."</p>
      </div>
    )},
    { phase: 'Mental Grounding', bg: '#FFF9E5', content: (
      <div className="flex flex-col items-center text-center gap-6">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-4xl">💙</div>
        <h2 className="font-serif-logo text-3xl text-[#2B3A55]">You are safe.</h2>
        <p className="text-xl text-gray-700 leading-relaxed">Your body is doing its job.<br/>Adrenaline has been released.<br/>It feels scary but it cannot hurt you.</p>
        <div className="bg-white/70 p-4 rounded-2xl border border-blue-100 mt-2">
          <p className="text-blue-800 font-semibold">Say this out loud: <span className="italic">"This feeling is temporary. I am safe."</span></p>
        </div>
      </div>
    )},
    { phase: 'Mental Grounding', bg: '#FFF9E5', content: (
      <div className="flex flex-col items-center text-center gap-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl">🍃</div>
        <h2 className="font-serif-logo text-3xl text-green-800">Like a wave.</h2>
        <p className="text-xl text-gray-700 leading-relaxed max-w-sm">Panic attacks peak and then fade — just like a wave. You don't fight a wave; you <span className="font-bold text-green-700">ride it.</span></p>
        <p className="text-gray-500 italic text-sm mt-2">Feel your feet on the ground. Feel the surface beneath you. You are here. You are real.</p>
      </div>
    )},

    // PHASE 2: Active Breathing (3-5)
    { phase: 'Active Breathing', bg: '#EEF4FF', content: (
      <div className="flex flex-col items-center text-center gap-4">
        <p className="text-[#2B3A55] font-semibold text-lg">Box Breathing — Round 1 of 3</p>
        <BreathCircle phase={breathPhase} count={breathCount} />
        <p className="text-gray-500 text-sm mt-2">Follow the rhythm. Let your body slow down.</p>
      </div>
    )},
    { phase: 'Active Breathing', bg: '#EEF4FF', content: (
      <div className="flex flex-col items-center text-center gap-4">
        <p className="text-[#2B3A55] font-semibold text-lg">Box Breathing — Round 2 of 3</p>
        <BreathCircle phase={breathPhase} count={breathCount} />
        <p className="text-gray-500 text-sm mt-2">Your heart rate is already slowing. Keep going.</p>
      </div>
    )},
    { phase: 'Active Breathing', bg: '#EEF4FF', content: (
      <div className="flex flex-col items-center text-center gap-4">
        <p className="text-[#2B3A55] font-semibold text-lg">Box Breathing — Round 3 of 3</p>
        <BreathCircle phase={breathPhase} count={breathCount} />
        <p className="text-green-600 font-medium text-sm mt-2">✓ Breathing regulated. Well done.</p>
      </div>
    )},

    // PHASE 3: 5-4-3-2-1 Grounding (6-17)
    { phase: '5-4-3-2-1 Grounding', bg: '#FFF5F5', content: (
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-3xl">🎲</div>
        <h2 className="font-serif-logo text-3xl text-[#2B3A55]">The 5-4-3-2-1 Method</h2>
        <p className="text-gray-600 leading-relaxed">This technique forces your brain into the present moment by activating all 5 senses. It's one of the most effective grounding tools known to science.</p>
        <div className="flex gap-3 flex-wrap justify-center mt-2">
          {['👁 5 See','✋ 4 Touch','👂 3 Hear','👃 2 Smell','👅 1 Taste'].map(s => <span key={s} className="bg-white/80 px-3 py-1 rounded-full text-sm font-medium text-[#2B3A55] border border-gray-200">{s}</span>)}
        </div>
      </div>
    )},
    { phase: '5-4-3-2-1 Grounding', bg: '#FFF5F5', content: <GroundInput sense="see" emoji="👁" color="#2B3A55" prompts={['A colour you can see','An object near you','Something small','Something moving or still','Something outside or far']} /> },
    { phase: '5-4-3-2-1 Grounding', bg: '#FFF5F5', content: (
      <div className="flex flex-col items-center text-center gap-3">
        <p className="text-[#2B3A55] font-bold text-xl">👁 See — Great job!</p>
        <p className="text-gray-600">Naming things you see moves your mind from panic to <span className="font-semibold">observation</span>. You're doing brilliantly.</p>
        <div className="bg-white/70 rounded-2xl p-4 border border-gray-100 w-full mt-2">
          {groundInputs.see.filter(v=>v).map((v,i)=><p key={i} className="text-[#2B3A55] font-medium py-1">✓ {v}</p>)}
        </div>
      </div>
    )},
    { phase: '5-4-3-2-1 Grounding', bg: '#FFF5F5', content: <GroundInput sense="touch" emoji="✋" color="#7c3aed" prompts={['The texture beneath you','Something warm or cool','Your own skin or clothing']} /> },
    { phase: '5-4-3-2-1 Grounding', bg: '#FFF5F5', content: (
      <div className="flex flex-col items-center text-center gap-3">
        <p className="text-purple-700 font-bold text-xl">✋ Touch — Excellent!</p>
        <p className="text-gray-600">Tactile grounding brings your awareness back to your <span className="font-semibold">physical body</span>.</p>
        <div className="bg-white/70 rounded-2xl p-4 border border-gray-100 w-full mt-2">
          {groundInputs.touch.filter(v=>v).map((v,i)=><p key={i} className="text-purple-800 font-medium py-1">✓ {v}</p>)}
        </div>
      </div>
    )},
    { phase: '5-4-3-2-1 Grounding', bg: '#FFF5F5', content: <GroundInput sense="hear" emoji="👂" color="#0369a1" prompts={['A distant sound','A closer sound','The quietest sound you can find']} /> },
    { phase: '5-4-3-2-1 Grounding', bg: '#FFF5F5', content: (
      <div className="flex flex-col items-center text-center gap-3">
        <p className="text-blue-700 font-bold text-xl">👂 Hear — Amazing!</p>
        <p className="text-gray-600">Listening pulls your attention out of your thoughts and into <span className="font-semibold">reality</span>.</p>
        <div className="bg-white/70 rounded-2xl p-4 border border-gray-100 w-full mt-2">
          {groundInputs.hear.filter(v=>v).map((v,i)=><p key={i} className="text-blue-800 font-medium py-1">✓ {v}</p>)}
        </div>
      </div>
    )},
    { phase: '5-4-3-2-1 Grounding', bg: '#FFF5F5', content: <GroundInput sense="smell" emoji="👃" color="#047857" prompts={['Something you can smell right now','Another scent, even faint']} /> },
    { phase: '5-4-3-2-1 Grounding', bg: '#FFF5F5', content: <GroundInput sense="taste" emoji="👅" color="#b45309" prompts={['What can you taste right now?']} /> },
    { phase: '5-4-3-2-1 Grounding', bg: '#FFF5F5', content: (
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl">🌿</div>
        <h2 className="font-serif-logo text-3xl text-green-800">Grounding Complete.</h2>
        <p className="text-gray-600 leading-relaxed">You've anchored yourself to the present moment using all 5 senses. Your nervous system is recalibrating.</p>
        <p className="text-green-700 font-semibold mt-2">How are you feeling compared to a few minutes ago?</p>
      </div>
    )},

    // PHASE 4: Physical Shock Therapy (18-20)
    { phase: 'Physical Reset', bg: '#FFF9E5', content: (
      <div className="flex flex-col items-center text-center gap-5">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-5xl">🧊</div>
        <h2 className="font-serif-logo text-3xl text-[#2B3A55]">Ice Cube Method</h2>
        <p className="text-gray-700 leading-relaxed">Hold an ice cube tightly in your hand, or splash ice-cold water on your face. The sudden physical sensation <span className="font-bold text-blue-700">interrupts the panic signal</span> and triggers your body's dive reflex, slowing your heart rate instantly.</p>
        <button onClick={() => setDoneConfirmed(true)} className={"w-full py-3 rounded-2xl font-semibold text-white transition " + (doneConfirmed ? "bg-green-500" : "bg-[#2B3A55] hover:bg-[#1a2536]")}>
          {doneConfirmed ? "✓ Done! Great work." : "I've tried this ✓"}
        </button>
      </div>
    )},
    { phase: 'Physical Reset', bg: '#FFF9E5', content: (
      <div className="flex flex-col items-center text-center gap-5">
        <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center text-5xl">🚿</div>
        <h2 className="font-serif-logo text-3xl text-[#2B3A55]">Cold Shower</h2>
        <p className="text-gray-700 leading-relaxed">A quick cold shower resets your nervous system. Cold water activates your body's <span className="font-bold text-cyan-700">parasympathetic system</span> — the "rest and digest" mode — and washes stress hormones off your skin.</p>
        <p className="text-sm text-gray-500 italic">Even 30 seconds of cold water on your wrists and face helps.</p>
        <button onClick={() => setDoneConfirmed(true)} className={"w-full py-3 rounded-2xl font-semibold text-white transition " + (doneConfirmed ? "bg-green-500" : "bg-[#2B3A55] hover:bg-[#1a2536]")}>
          {doneConfirmed ? "✓ Done! You did amazing." : "I've tried this ✓"}
        </button>
      </div>
    )},
    { phase: 'Physical Reset', bg: '#FFF9E5', content: (
      <div className="flex flex-col items-center text-center gap-5">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-5xl">🖐️</div>
        <h2 className="font-serif-logo text-3xl text-[#2B3A55]">Palm Pressure</h2>
        <p className="text-gray-700 leading-relaxed">Press your palms together firmly, then release. Repeat 5 times. This activates proprioception — your brain's awareness of your <span className="font-bold text-orange-700">body in space</span> — pulling focus away from the panic.</p>
        <button onClick={() => setDoneConfirmed(true)} className={"w-full py-3 rounded-2xl font-semibold text-white transition " + (doneConfirmed ? "bg-green-500" : "bg-[#2B3A55] hover:bg-[#1a2536]")}>
          {doneConfirmed ? "✓ Done! Well done." : "I've tried this ✓"}
        </button>
      </div>
    )},

    // PHASE 5: Check-in (21)
    { phase: 'Check-in', bg: '#F0FFF4', content: (
      <div className="flex flex-col items-center text-center gap-5 w-full">
        <BreeIcon size={80} className="breathing-effect" />
        <h2 className="font-serif-logo text-3xl text-green-800">How are you feeling now?</h2>
        <p className="text-gray-600">You've worked through 5 phases of calming. Be proud of yourself — panic attacks are exhausting and you faced this one with courage.</p>
        <div className="w-full">
          <p className="text-[#2B3A55] font-semibold mb-3">Rate how you feel right now (1 = still very distressed, 10 = calm):</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <button key={n} onClick={() => setCheckinScore(n)} className={"w-10 h-10 rounded-full font-bold text-sm transition " + (checkinScore === n ? "bg-[#2B3A55] text-white scale-110 shadow-md" : "bg-white/80 border border-gray-200 text-[#2B3A55] hover:bg-gray-100")}>
                {n}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm font-medium" style={{ color: checkinScore <= 3 ? '#ef4444' : checkinScore <= 6 ? '#f97316' : '#22c55e' }}>
            {checkinScore <= 3 ? "I hear you — it's still heavy. Bree will follow up with you." : checkinScore <= 6 ? "You're getting there. That's real progress." : "You're doing well. That took real courage. 💚"}
          </p>
        </div>
        <button onClick={handleFinish} className="w-full py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-semibold transition shadow-md mt-2">
          Share this with Bree & Finish ✓
        </button>
      </div>
    )}
  ];

  const phaseNames = ['Mental Grounding','Mental Grounding','Mental Grounding','Active Breathing','Active Breathing','Active Breathing','5-4-3-2-1','5-4-3-2-1','5-4-3-2-1','5-4-3-2-1','5-4-3-2-1','5-4-3-2-1','5-4-3-2-1','5-4-3-2-1','5-4-3-2-1','5-4-3-2-1','5-4-3-2-1','5-4-3-2-1','Physical Reset','Physical Reset','Physical Reset','Check-in'];
  const phaseColors = { 'Mental Grounding': '#dc2626', 'Active Breathing': '#2563eb', '5-4-3-2-1': '#7c3aed', 'Physical Reset': '#b45309', 'Check-in': '#16a34a' };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen p-4 md:p-6 flex flex-col max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={onBack} className="text-[#2B3A55] dark:text-slate-200 hover:text-black flex items-center gap-2">
          <ArrowLeft size={20} /> Back
        </button>
        <h1 className="font-serif-logo text-2xl text-[#2B3A55] dark:text-slate-200">Panic Help</h1>
        <button onClick={onSupport} className="text-sm font-medium text-gray-500 dark:text-slate-400">[Support]</button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400 mb-1">
          <span style={{ color: phaseColors[phaseNames[step]] }} className="font-semibold">{phaseNames[step]}</span>
          <span>Step {step + 1} of {cards.length}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
          <div className="h-2 rounded-full transition-all duration-500" style={{ width: ((step + 1) / cards.length * 100) + '%', background: phaseColors[phaseNames[step]] }}></div>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div className="w-full relative min-h-[420px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="absolute inset-0 rounded-[32px] p-8 flex items-center justify-center overflow-y-auto"
              style={{ background: cards[step].bg, boxShadow: '0 20px 60px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.7)' }}
            >
              <div className="w-full">{cards[step].content}</div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav Buttons */}
        <div className="flex gap-4 mt-6">
          {step > 0 && <button onClick={goPrev} className="px-8 py-2.5 rounded-full glass hover:bg-white/60 dark:hover:bg-slate-700/60 transition text-[#2B3A55] dark:text-white font-medium">← Previous</button>}
          {step < cards.length - 1 && <button onClick={goNext} className="px-8 py-2.5 rounded-full text-white font-medium transition shadow-md" style={{ background: phaseColors[phaseNames[step]] }}>Next Step →</button>}
        </div>
      </div>

      {/* Fixed Emergency Footer */}
      <div className="text-center mt-6 pt-4 border-t border-gray-200/50 flex flex-col items-center gap-1">
        <a href={'tel:' + (user?.emergency || '')} className="text-red-500 hover:text-red-700 font-bold tracking-widest text-sm uppercase animate-pulse">[ EMERGENCY CONTACT ]</a>
        <a href="mailto:breath.tma@gmail.com" className="text-xs text-gray-500 dark:text-slate-400 hover:underline">Official Support: breath.tma@gmail.com</a>
      </div>
    </motion.div>
  );
};

`;
