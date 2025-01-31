import { logEvent } from 'firebase/analytics';
import { analytics } from './firebase';

export const trackPageView = (pathname, user) => {
  if (!analytics) return;

  logEvent(analytics, 'page_view', {
    page_path: pathname,
    page_title: pathname.replace('/', '') || 'home',
    user_id: user?.id || 'anonymous',
    session_id: generateSessionId(),
    is_new_user: checkIfNewUser(),
    timestamp: new Date().toISOString()
  });
};

// Generate a unique session ID
const generateSessionId = () => {
  const existingSession = sessionStorage.getItem('session_id');
  if (existingSession) return existingSession;
  
  const newSession = `session_${Date.now()}`;
  sessionStorage.setItem('session_id', newSession);
  return newSession;
};

// Check if this is a new user
const checkIfNewUser = () => {
  const hasVisitedBefore = localStorage.getItem('has_visited');
  if (!hasVisitedBefore) {
    localStorage.setItem('has_visited', 'true');
    return true;
  }
  return false;
};