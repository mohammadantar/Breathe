const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'index.html');
let content = fs.readFileSync(targetFile, 'utf8');

// Add exit animation to Auth
content = content.replace(
`<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass w-full max-w-md p-8 rounded-3xl shadow-2xl relative overflow-hidden">`,
`<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} className="glass w-full max-w-md p-8 rounded-3xl shadow-2xl relative overflow-hidden">`
);

// Add exit animation to Onboarding
content = content.replace(
`  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass w-full max-w-md p-8 rounded-3xl shadow-2xl relative overflow-hidden">`,
`  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} className="glass w-full max-w-md p-8 rounded-3xl shadow-2xl relative overflow-hidden">`
);

// Update App session storage logic
content = content.replace(
`  useEffect(() => {
    const saved = localStorage.getItem('breathe_user');
    if (saved) {
      setUser(JSON.parse(saved));
      setView('dashboard');
    }
    setIsInitializing(false);
  }, []);`,
`  useEffect(() => {
    const saved = localStorage.getItem('breathe_user') || sessionStorage.getItem('breathe_user');
    if (saved) {
      setUser(JSON.parse(saved));
      setView('dashboard');
    }
    setIsInitializing(false);
  }, []);`
);

content = content.replace(
`  const handleAuth = (authData) => {
    if (authData.remember) {
      localStorage.setItem('breathe_user', JSON.stringify(authData));
    }
    if (authData.isNew) {`,
`  const handleAuth = (authData) => {
    if (authData.remember) {
      localStorage.setItem('breathe_user', JSON.stringify(authData));
    } else {
      sessionStorage.setItem('breathe_user', JSON.stringify(authData));
    }
    if (authData.isNew) {`
);

content = content.replace(
`  const logout = () => {
    // Clear session so the next person has to log in again
    localStorage.removeItem('breathe_user');
    setUser(null);
    setView('auth');
  };`,
`  const logout = () => {
    // Clear session so the next person has to log in again
    localStorage.removeItem('breathe_user');
    sessionStorage.removeItem('breathe_user');
    setUser(null);
    setView('auth');
  };`
);

// Update Onboarding save session
content = content.replace(
`    // Save session
    if (tempUser.remember !== false) {
      localStorage.setItem('breathe_user', JSON.stringify(user));
    }
    onComplete(user);`,
`    // Save session
    if (tempUser.remember) {
      localStorage.setItem('breathe_user', JSON.stringify(user));
    } else {
      sessionStorage.setItem('breathe_user', JSON.stringify(user));
    }
    onComplete(user);`
);

fs.writeFileSync(targetFile, content);
console.log('Refined auth transitions and session storage updated.');
