
import { useState } from "react";
import { loginUser, registerUser } from "../services/authService";

function Auth({ onLogin }) {
    const [isRegister, setIsRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isRegister) {
                await registerUser({ name, email, password });
            }

            const data = await loginUser({ email, password });

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            onLogin(data.user);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const switchMode = () => {
        setIsRegister(!isRegister);
        setName("");
        setEmail("");
        setPassword("");
        setError("");
        setShowPassword(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-shell">

                <section className="auth-brand-panel">
                    <div className="brand-logo">
                        <span className="brand-logo-icon">✓</span>
                        <span>TaskFlow</span>
                    </div>

                    <div className="brand-content">
                        <span className="brand-eyebrow">
                            YOUR WORKSPACE, SIMPLIFIED
                        </span>

                        <h1>
                            Make every day
                            <span> productive.</span>
                        </h1>

                        <p>
                            Organize your work, track your progress,
                            and accomplish more with your personal
                            task management workspace.
                        </p>

                        <div className="brand-features">
                            <div className="brand-feature">
                                <span>✓</span>
                                <p>Keep all your tasks organized</p>
                            </div>

                            <div className="brand-feature">
                                <span>✓</span>
                                <p>Track your daily progress</p>
                            </div>

                            <div className="brand-feature">
                                <span>✓</span>
                                <p>Your tasks, private and secure</p>
                            </div>
                        </div>
                    </div>

                    <div className="brand-footer">
                        Built for focus. Designed for productivity.
                    </div>
                </section>

                <section className="auth-form-panel">
                    <div className="auth-mobile-logo">
                        <span className="brand-logo-icon">✓</span>
                        TaskFlow
                    </div>

                    <div className="auth-card">
                        <div className="auth-heading">
                            <span className="auth-eyebrow">
                                {isRegister ? "GET STARTED" : "WELCOME BACK"}
                            </span>

                            <h2>
                                {isRegister
                                    ? "Create your account"
                                    : "Sign in to TaskFlow"}
                            </h2>

                            <p>
                                {isRegister
                                    ? "Create an account and start organizing your work."
                                    : "Enter your details to access your workspace."}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {isRegister && (
                                <div className="auth-field">
                                    <label htmlFor="auth-name">Full name</label>
                                    <input
                                        id="auth-name"
                                        type="text"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        autoComplete="name"
                                        required
                                    />
                                </div>
                            )}

                            <div className="auth-field">
                                <label htmlFor="auth-email">Email address</label>
                                <input
                                    id="auth-email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="auth-password">Password</label>

                                <div className="password-wrapper">
                                    <input
                                        id="auth-password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete={
                                            isRegister
                                                ? "new-password"
                                                : "current-password"
                                        }
                                        minLength={8}
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>

                                {isRegister && (
                                    <span className="field-hint">
                                        Use at least 8 characters.
                                    </span>
                                )}
                            </div>

                            {error && (
                                <div className="auth-error" role="alert">
                                    <span>!</span>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="auth-submit"
                                disabled={loading}
                            >
                                {loading
                                    ? "Please wait..."
                                    : isRegister
                                        ? "Create account →"
                                        : "Sign in →"}
                            </button>
                        </form>

                        <div className="auth-divider">
                            <span>OR</span>
                        </div>

                        <p className="auth-switch-text">
                            {isRegister
                                ? "Already have an account?"
                                : "New to TaskFlow?"}

                            <button
                                type="button"
                                className="auth-switch"
                                onClick={switchMode}
                            >
                                {isRegister ? "Sign in" : "Create an account"}
                            </button>
                        </p>

                        <p className="auth-terms">
                            By continuing, you agree to use TaskFlow responsibly.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Auth;
