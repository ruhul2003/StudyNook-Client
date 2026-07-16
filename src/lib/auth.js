import { authClient } from './auth-client';

export const getMe = async () => {
  const session = await authClient.getSession();
  if (!session || !session.data) throw new Error("No session found");
  return {
    _id: session.data.user.id,
    name: session.data.user.name,
    email: session.data.user.email,
    photoUrl: session.data.user.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
  };
};

export const login = async (email, password) => {
  const res = await authClient.signIn.email({
    email,
    password,
  });
  if (res.error) throw new Error(res.error.message || "Login failed");
  return {
    _id: res.data.user.id,
    name: res.data.user.name,
    email: res.data.user.email,
    photoUrl: res.data.user.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
  };
};

export const register = async (name, email, photoUrl, password) => {
  const res = await authClient.signUp.email({
    email,
    password,
    name,
    image: photoUrl,
  });
  if (res.error) throw new Error(res.error.message || "Registration failed");
  return {
    message: "Registration successful!",
    data: {
      _id: res.data.user.id,
      name: res.data.user.name,
      email: res.data.user.email,
      photoUrl: res.data.user.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    }
  };
};

export const loginWithGoogle = async () => {
  const res = await authClient.signIn.social({
    provider: 'google',
    callbackURL: typeof window !== 'undefined' ? window.location.origin : '/',
  });
  if (res?.error) throw new Error(res.error.message || "Google sign in failed");
};

export const logout = async () => {
  await authClient.signOut();
};
