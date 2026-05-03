const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'index.html');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('tailwind.config =')) {
  content = content.replace(
    '<script src="https://cdn.tailwindcss.com"></script>',
    '<script src="https://cdn.tailwindcss.com"></script>\n  <script>\n    tailwind.config = {\n      darkMode: "class",\n      theme: {\n        extend: {}\n      }\n    }\n  </script>'
  );
}

if (!content.includes('html.dark body')) {
  content = content.replace(
    '/* Premium Glassmorphism Cards */',
    `/* Dark Mode Variables */
    html.dark body {
      background: linear-gradient(135deg, #020617 0%, #0f172a 40%, #1e1b4b 80%, #312e81 100%);
      color: #f8fafc;
    }
    html.dark .glass {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.05);
      box-shadow: 
        -15px -15px 40px rgba(0, 0, 0, 0.4),
        15px 15px 40px rgba(0, 0, 0, 0.6),
        inset 0 1px 0 rgba(255,255,255,0.05);
    }
    html.dark .glass:hover {
      background: rgba(15, 23, 42, 0.8);
      box-shadow: 
        -20px -20px 50px rgba(0, 0, 0, 0.5),
        20px 20px 50px rgba(0, 0, 0, 0.7),
        inset 0 1px 0 rgba(255,255,255,0.05);
    }

    /* Premium Glassmorphism Cards */`
  );
}

if (!content.includes('Moon,')) {
  content = content.replace(
    "import { Heart, MessageCircle, Book, Activity, ArrowLeft, Send, Phone, Info, HelpCircle, LogOut } from 'lucide-react';",
    "import { Heart, MessageCircle, Book, Activity, ArrowLeft, Send, Phone, Info, HelpCircle, LogOut, Sun, Moon } from 'lucide-react';"
  );
}

if (!content.includes('const [isDark, setIsDark]')) {
  content = content.replace(
    "const App = () => {",
    `const App = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);`
  );
}

if (!content.includes('isDark={isDark}')) {
  content = content.replace(
    '<Dashboard key="dashboard" user={user} setView={setView} onLogout={logout} />',
    '<Dashboard key="dashboard" user={user} setView={setView} onLogout={logout} isDark={isDark} toggleTheme={() => setIsDark(!isDark)} />'
  );
}

if (!content.includes('toggleTheme')) {
  content = content.replace(
    "const Dashboard = ({ user, setView, onLogout }) => {",
    "const Dashboard = ({ user, setView, onLogout, isDark, toggleTheme }) => {"
  );
  
  content = content.replace(
    '{user?.photoURL && <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full shadow-sm border border-white" />}',
    `{user?.photoURL && <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full shadow-sm border border-white dark:border-slate-800" />}
          <button onClick={toggleTheme} className="flex items-center justify-center w-8 h-8 rounded-full bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 transition text-[#0f172a] dark:text-slate-200">
            {isDark ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
          </button>`
  );
}

content = content.replace(/text-\[#0f172a\]/g, 'text-[#0f172a] dark:text-white');
content = content.replace(/text-\[#1e293b\]/g, 'text-[#1e293b] dark:text-slate-100');
content = content.replace(/text-\[#2B3A55\]/g, 'text-[#2B3A55] dark:text-slate-200');
content = content.replace(/text-gray-800/g, 'text-gray-800 dark:text-slate-200');
content = content.replace(/text-gray-700/g, 'text-gray-700 dark:text-slate-300');
content = content.replace(/text-gray-600/g, 'text-gray-600 dark:text-slate-400');
content = content.replace(/text-gray-500/g, 'text-gray-500 dark:text-slate-400');
content = content.replace(/text-gray-900/g, 'text-gray-900 dark:text-white');
content = content.replace(/bg-white\/50/g, 'bg-white/50 dark:bg-slate-800/50');
content = content.replace(/bg-white\/40/g, 'bg-white/40 dark:bg-slate-800/40');
content = content.replace(/hover:bg-white\/60/g, 'hover:bg-white/60 dark:hover:bg-slate-700/60');
content = content.replace(/className="(.*?)bg-white([^/a-zA-Z0-9-].*?)"/g, 'className="$1bg-white dark:bg-slate-900$2"');
content = content.replace(/className="(.*?)bg-white"/g, 'className="$1bg-white dark:bg-slate-900"');

fs.writeFileSync(file, content);
console.log('Dark Mode script applied successfully.');
