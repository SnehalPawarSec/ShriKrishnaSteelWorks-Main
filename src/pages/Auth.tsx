import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  /* ================= EMAIL LINK CONFIG ================= */
  const actionCodeSettings = {
    url: `${window.location.origin}/auth`,
    handleCodeInApp: true,
  };

  /* ================= AUTO LOGIN FROM EMAIL LINK ================= */
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let storedEmail = window.localStorage.getItem('emailForSignIn');
      if (!storedEmail) {
        storedEmail = window.prompt('Please confirm your email') || '';
      }
      if (!storedEmail) return;

      signInWithEmailLink(auth, storedEmail, window.location.href)
        .then(async (result) => {
          window.localStorage.removeItem('emailForSignIn');
          await upsertUserInFirestore(result.user, result.user.email);
          handleLoginSuccess(result.user, result.user.email);
        })
        .catch((err) => {
          console.error(err);
          toast({
            title: 'Login failed',
            description: err?.message || 'Invalid or expired link',
          });
        });
    }
  }, []);

  /* ================= FIRESTORE USER UPSERT ================= */
  const upsertUserInFirestore = async (user: any, name?: string | null) => {
    await setDoc(
      doc(db, 'users', user.uid),
      {
        uid: user.uid,
        name: name || user.displayName || null,
        email: user.email,
        photoURL: user.photoURL || null,
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    );
  };

  /* ================= SUCCESS HANDLER ================= */
  const handleLoginSuccess = (user: any, name?: string | null) => {
    localStorage.setItem(
      'user',
      JSON.stringify({
        uid: user.uid,
        displayName: name,
        email: user.email,
        photoURL: user.photoURL || null,
      })
    );

    setLoading(false);
    setShowSuccessModal(true);

    toast({
      title: 'Login Successful!',
      description: 'Welcome to Shri Krishna Steel Works!',
    });
  };

  /* ================= GOOGLE SIGN IN ================= */
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider || new GoogleAuthProvider());
      const user = result.user;
      await upsertUserInFirestore(user, user.displayName || user.email);
      handleLoginSuccess(user, user.displayName || user.email);
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Google sign-in failed', description: err?.message });
      setLoading(false);
    }
  };

  /* ================= EMAIL OTP / MAGIC LINK ================= */
  const handleEmailOtpLogin = async () => {
    if (!email) {
      toast({ title: 'Email required', description: 'Please enter your email' });
      return;
    }

    setLoading(true);
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      toast({
        title: 'Check your email',
        description: 'A login link has been sent to your email.',
      });
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Failed', description: err?.message });
    } finally {
      setLoading(false);
    }
  };

  /* ================= EMAIL SIGN UP ================= */
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);
      await upsertUserInFirestore(cred.user, displayName || cred.user.email);
      setInfoMessage({ type: 'success', text: 'Verification email sent. Please verify before login.' });
      setMode('login');
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Signup failed', description: err?.message });
    } finally {
      setLoading(false);
    }
  };

  /* ================= EMAIL PASSWORD LOGIN ================= */
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (!cred.user.emailVerified) {
        setInfoMessage({ type: 'error', text: 'Please verify your email before login.' });
        setLoading(false);
        return;
      }
      await upsertUserInFirestore(cred.user, cred.user.displayName || cred.user.email);
      handleLoginSuccess(cred.user, cred.user.displayName || cred.user.email);
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Login failed', description: err?.message });
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="py-20 min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-2xl text-center">
          <h1 className="text-3xl font-bold mb-6">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </h1>

          {mode === 'signup' && (
            <input
              placeholder="Full name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="border p-3 rounded-lg mb-4 w-full"
            />
          )}

          <form onSubmit={mode === 'login' ? handleEmailSignIn : handleEmailSignUp} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-3 rounded-lg w-full"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-3 rounded-lg w-full"
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Sign up'}
            </Button>
          </form>

          {infoMessage && (
            <div className="mt-4 text-sm text-green-700 bg-green-50 p-3 rounded">
              {infoMessage.text}
            </div>
          )}

          <div className="text-sm my-4">
            {mode === 'login' ? (
              <>Don’t have an account? <button className="text-blue-600 underline" onClick={() => setMode('signup')}>Create one</button></>
            ) : (
              <>Already have an account? <button className="text-blue-600 underline" onClick={() => setMode('login')}>Sign in</button></>
            )}
          </div>

          <div className="text-sm text-muted-foreground my-4 font-semibold">OR</div>

          <Button onClick={handleGoogleSignIn} disabled={loading} className="w-full mb-3">
            Continue with Google
          </Button>

          <Button variant="outline" onClick={handleEmailOtpLogin} disabled={loading} className="w-full">
            Login with Email Code
          </Button>
        </div>
      </section>

      {/* SUCCESS MODAL */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader className="text-center">
            <DialogTitle className="text-green-600 text-2xl">Login Successful</DialogTitle>
            <DialogDescription>Welcome to Shri Krishna Steel Works</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className="w-full" onClick={() => navigate('/')}>Go to Home</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Auth;
