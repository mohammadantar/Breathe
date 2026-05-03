const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'index.html');
let content = fs.readFileSync(targetFile, 'utf8');

// 1. Importmap update
content = content.replace(
`      "@google/generative-ai": "https://esm.sh/@google/generative-ai@0.14.1"`,
`      "@google/generative-ai": "https://esm.sh/@google/generative-ai@0.14.1",
      "firebase/app": "https://esm.sh/firebase@10.7.1/app",
      "firebase/auth": "https://esm.sh/firebase@10.7.1/auth"`
);

// 2. Window Globals Update
content = content.replace(
`    window.__GEMINI_API_KEY__ = "%VITE_GEMINI_API_KEY%";`,
`    window.__GEMINI_API_KEY__ = "%VITE_GEMINI_API_KEY%";
    window.__FIREBASE_API_KEY__ = "%VITE_FIREBASE_API_KEY%";
    window.__FIREBASE_AUTH_DOMAIN__ = "%VITE_FIREBASE_AUTH_DOMAIN%";`
);

// 3. JS Imports Update
content = content.replace(
`import { GoogleGenerativeAI } from '@google/generative-ai';`,
`import { GoogleGenerativeAI } from '@google/generative-ai';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: window.__FIREBASE_API_KEY__ || "mock-key",
  authDomain: window.__FIREBASE_AUTH_DOMAIN__ || "mock-domain",
  projectId: "breathe-mock-project"
};

let app, auth, googleProvider;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
} catch (e) {
  console.warn("Firebase init failed:", e);
}`
);

// 4. Auth Component States
content = content.replace(
`  const [resetSent, setResetSent] = useState(false);`,
`  const [resetSent, setResetSent] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [expectedOtp, setExpectedOtp] = useState('');
  const [pendingGoogleUser, setPendingGoogleUser] = useState(null);`
);

// 5. Auth Component handleGoogleAuth
content = content.replace(
`  const handleGoogleAuth = () => {
    alert("Connecting to Google Auth...");
    onLogin({ isNew: false, email: "googleuser@example.com", name: "Google User", remember: true });
  };`,
`  const handleGoogleAuth = async () => {
    setError('');
    try {
      if (!auth) throw new Error("Firebase not initialized");
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      initiateOtp(user.uid, user.email, user.displayName, user.photoURL);
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/invalid-api-key' || err.message.includes('API key') || err.message.includes('Firebase not initialized')) {
        alert("Firebase config missing. Falling back to Mock Google Auth for demonstration.");
        initiateOtp('mock-uid-123', 'googleuser@mock.com', 'Mock Google User', 'https://ui-avatars.com/api/?name=Google+User&background=0D8ABC&color=fff');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Google login cancelled.');
      } else {
        setError('Auth Error: ' + err.message);
      }
    }
  };

  const initiateOtp = (uid, email, name, photoURL) => {
    setPendingGoogleUser({ uid, email, name, photoURL });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setExpectedOtp(otp);
    setShowOtp(true);
    console.log("MOCK OTP IS:", otp);
    alert(\`Mock Verification Code sent to \${email}: \${otp}\`);
  };

  const verifyOtp = () => {
    if (otpInput === expectedOtp) {
       const usersDbStr = localStorage.getItem('breathe_users_db');
       const usersDb = usersDbStr ? JSON.parse(usersDbStr) : [];
       let existingUser = usersDb.find(u => u.email === pendingGoogleUser.email);
       
       if (!existingUser) {
         existingUser = { ...pendingGoogleUser, isNew: false, id: pendingGoogleUser.uid };
         usersDb.push(existingUser);
         localStorage.setItem('breathe_users_db', JSON.stringify(usersDb));
       } else {
         existingUser.photoURL = pendingGoogleUser.photoURL;
         localStorage.setItem('breathe_users_db', JSON.stringify(usersDb));
       }
       onLogin({ ...existingUser, remember: rememberMe, isNew: false });
    } else {
       setError("Invalid Verification Code.");
    }
  };`
);

// 6. Auth Component render showOtp
content = content.replace(
`        {resetSent ? (
          <div className="text-center">
            <p className="text-green-600 font-medium mb-4">Password reset link sent to {email}!</p>
            <button onClick={() => { setShowForgot(false); setResetSent(false); }} className="text-[#1e293b] font-bold hover:underline">Back to login</button>
          </div>
        ) : (`,
`        {showOtp ? (
          <div className="text-center">
            <p className="text-[#2B3A55] font-medium mb-4">A 6-digit verification code was sent to {pendingGoogleUser?.email}.</p>
            <input 
              type="text" 
              maxLength={6}
              value={otpInput}
              onChange={e => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full text-center tracking-widest text-2xl px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-300 mb-4" 
              placeholder="------"
            />
            <button onClick={verifyOtp} disabled={otpInput.length !== 6} className="w-full bg-[#1e293b] hover:bg-black text-white py-3 rounded-xl font-medium transition shadow-lg disabled:opacity-50">
              Verify & Connect
            </button>
            <button onClick={() => { setShowOtp(false); setOtpInput(''); }} className="w-full mt-4 text-gray-500 hover:text-black font-medium text-sm">Cancel</button>
          </div>
        ) : resetSent ? (
          <div className="text-center">
            <p className="text-green-600 font-medium mb-4">Password reset link sent to {email}!</p>
            <button onClick={() => { setShowForgot(false); setResetSent(false); }} className="text-[#1e293b] font-bold hover:underline">Back to login</button>
          </div>
        ) : (`
);

// 7. Dashboard Profile UI
content = content.replace(
`        <div className="flex gap-6 text-sm font-medium items-center">
          <button onClick={() => setView('support')} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition">`,
`        <div className="flex gap-6 text-sm font-medium items-center">
          {user?.photoURL && <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full shadow-sm border border-white" />}
          <button onClick={() => setView('support')} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition">`
);

// 8. ChatInterface Profile UI
content = content.replace(
`          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-400/20 rounded-full flex items-center justify-center">👤</div>
            <h3 className="font-medium text-lg">{t('chat.sidebar_title')}</h3>
          </div>`,
`          <div className="flex items-center gap-3 mb-8">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full shadow-sm" />
            ) : (
              <div className="w-10 h-10 bg-blue-400/20 rounded-full flex items-center justify-center">👤</div>
            )}
            <h3 className="font-medium text-lg">{t('chat.sidebar_title')}</h3>
          </div>`
);

fs.writeFileSync(targetFile, content);
console.log('Firebase Google Auth successfully implemented in index.html!');
