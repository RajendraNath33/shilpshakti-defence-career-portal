import { useEffect, useRef, useState } from 'react';

const GOOGLE_CLIENT_ID = '557804189885-jqr788bjl7qri6b8kflnam4aaq1utlj1.apps.googleusercontent.com';
const N8N_LOGIN_WEBHOOK = 'https://n8n.shilpshakti.org.in/webhook/shilpshakti-user-login';

interface GoogleUser {
  name: string;
  email: string;
  picture: string;
}

function decodeJwtPayload(token: string): any {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  const json = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(json);
}

declare global {
  interface Window {
    google?: any;
  }
}

export default function GoogleLoginButton({ compact = false }: { compact?: boolean }) {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('shilpshakti_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('shilpshakti_user');
      }
    }
  }, []);

  useEffect(() => {
    if (user) return;
    if (!window.google || !btnRef.current) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response: any) => {
        const payload = decodeJwtPayload(response.credential);
        const newUser: GoogleUser = {
          name: payload.name,
          email: payload.email,
          picture: payload.picture,
        };
        setUser(newUser);
        localStorage.setItem('shilpshakti_user', JSON.stringify(newUser));

        fetch(N8N_LOGIN_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser),
        }).catch(() => {});
      },
    });

    window.google.accounts.id.renderButton(btnRef.current, {
      theme: 'outline',
      size: compact ? 'medium' : 'large',
      shape: 'pill',
      text: 'signin_with',
    });
  }, [user, compact]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('shilpshakti_user');
  };

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full border border-gold-400/60" referrerPolicy="no-referrer" />
        <span className="hidden sm:inline text-cream-100 text-[12.5px] font-medium truncate max-w-[110px]">{user.name}</span>
        <button
          type="button"
          onClick={handleLogout}
          className="text-[11px] text-olive-300 hover:text-gold-300 underline"
        >
          Logout
        </button>
      </div>
    );
  }

  return <div ref={btnRef} />;
}
