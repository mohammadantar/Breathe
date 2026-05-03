const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'index.html');
let content = fs.readFileSync(targetFile, 'utf8');

// Chunk 1: Update Auth handleSubmit
content = content.replace(
`  const handleSubmit = (e) => {
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
  };`,
`  const handleSubmit = (e) => {
    e.preventDefault();
    if (showForgot) {
      if (!email) { setError(t('auth.error_empty')); return; }
      setResetSent(true);
      setError('');
      return;
    }
    if (!email || !password) { setError(t('auth.error_empty')); return; }
    
    // Check Mock DB (breathe_users_db)
    const usersDbStr = localStorage.getItem('breathe_users_db');
    const usersDb = usersDbStr ? JSON.parse(usersDbStr) : [];
    let existingUser = usersDb.find(u => u.email === email);
    
    // Also check legacy single user if not found in db
    if (!existingUser) {
      const legacyStr = localStorage.getItem('breathe_user');
      if (legacyStr) {
        const legacyUser = JSON.parse(legacyStr);
        if (legacyUser.email === email) {
          existingUser = legacyUser;
        }
      }
    }

    if (existingUser) {
      if (existingUser.password === password) {
         // Log them in directly (works for both login & signup clicks if email exists)
         onLogin({ ...existingUser, remember: rememberMe, isNew: false });
         return;
      } else {
         setError("Incorrect password. Please try again or reset your password.");
         return;
      }
    } else {
      if (isLogin) {
         setError(t('auth.error_invalid') || "Invalid email or password");
      } else {
         onLogin({ isNew: true, email, password, remember: rememberMe });
      }
    }
  };`
);

// Chunk 2: Update Onboarding handleSubmit
content = content.replace(
`  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.emergency || !formData.relationship) return;
    const user = saveUser({ ...tempUser, ...formData, id: Date.now().toString() });
    if (tempUser.remember !== false) {
      localStorage.setItem('breathe_user', JSON.stringify(user));
    }
    onComplete(user);
  };`,
`  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.emergency || !formData.relationship) return;
    
    const user = saveUser({ ...tempUser, ...formData, id: Date.now().toString(), isNew: false });
    
    // Save to Mock DB array
    const usersDbStr = localStorage.getItem('breathe_users_db');
    const usersDb = usersDbStr ? JSON.parse(usersDbStr) : [];
    usersDb.push(user);
    localStorage.setItem('breathe_users_db', JSON.stringify(usersDb));

    // Save session
    if (tempUser.remember !== false) {
      localStorage.setItem('breathe_user', JSON.stringify(user));
    }
    onComplete(user);
  };`
);

// Chunk 3: Update App component logout to clear session explicitly
content = content.replace(
`  const logout = () => {
    // If not remembered, clear from local storage
    if (user && !user.remember) {
      localStorage.removeItem('breathe_user');
    }
    setUser(null);
    setView('auth');
  };`,
`  const logout = () => {
    // Clear session so the next person has to log in again
    localStorage.removeItem('breathe_user');
    setUser(null);
    setView('auth');
  };`
);

fs.writeFileSync(targetFile, content);
console.log('Update auth complete.');
