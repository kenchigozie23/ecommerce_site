"use client";
import { signIn } from "next-auth/react";
import { useRef, useState } from "react";

interface IProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

const LoginPage = ({ searchParams }: IProps) => {
  const userName = useRef("");
  const pass = useRef("");
  const confirmPass = useRef("");
  const email = useRef("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^A-Za-z0-9]/)) strength++;
    setPasswordStrength(strength);
  };

  const onSubmit = async () => {
    if (isSignUp && pass.current !== confirmPass.current) {
      alert("Passwords don't match!");
      return;
    }
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        username: userName.current,
        password: pass.current,
        email: email.current,
        redirect: true,
        callbackUrl: "/",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell;
        }

        .login-box {
          background: rgba(255, 255, 255, 0.95);
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          width: 90%;
          max-width: 400px;
          transform: translateY(0);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .login-box:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
        }

        .form-title {
          text-align: center;
          color: #4a5568;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }

        .form-group {
          margin-bottom: 1.5rem;
          position: relative;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #4a5568;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: all 0.3s ease;
          outline: none;
        }

        .form-group input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .strength-meter {
          height: 4px;
          background: #e2e8f0;
          margin-top: 0.5rem;
          border-radius: 2px;
          overflow: hidden;
        }

        .strength-meter div {
          height: 100%;
          width: 25%;
          background: #667eea;
          transition: width 0.3s ease;
        }

        .submit-button {
          width: 100%;
          padding: 0.75rem;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .submit-button:hover {
          background: #5a67d8;
        }

        .submit-button:active {
          transform: scale(0.98);
        }

        .submit-button.loading {
          background: #5a67d8;
          pointer-events: none;
        }

        .submit-button.loading::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          top: 50%;
          left: 50%;
          margin: -10px 0 0 -10px;
          border: 2px solid transparent;
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .toggle-form {
          text-align: center;
          margin-top: 1rem;
        }

        .toggle-button {
          background: none;
          border: none;
          color: #667eea;
          cursor: pointer;
          font-size: 0.875rem;
          text-decoration: underline;
        }

        .error {
          background: #fed7d7;
          color: #c53030;
          padding: 0.75rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .form-group {
          animation: fadeIn 0.5s ease backwards;
        }

        .form-group:nth-child(1) { animation-delay: 0.1s; }
        .form-group:nth-child(2) { animation-delay: 0.2s; }
        .form-group:nth-child(3) { animation-delay: 0.3s; }
        .form-group:nth-child(4) { animation-delay: 0.4s; }
      `}</style>

      <div className="container">
        {searchParams?.message && <p className="error">{searchParams?.message}</p>}
        <div className="login-box">
          <h2 className="form-title">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              onChange={(e) => (userName.current = e.target.value)}
            />
          </div>

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                onChange={(e) => (email.current = e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              onChange={(e) => {
                pass.current = e.target.value;
                checkPasswordStrength(e.target.value);
              }}
            />
            {isSignUp && (
              <div className="strength-meter">
                <div style={{ width: `${passwordStrength * 25}%` }} />
              </div>
            )}
          </div>

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                onChange={(e) => (confirmPass.current = e.target.value)}
              />
            </div>
          )}

          <button
            onClick={onSubmit}
            className={`submit-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? '' : (isSignUp ? 'Sign Up' : 'Login')}
          </button>

          <div className="toggle-form">
            <button
              className="toggle-button"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
