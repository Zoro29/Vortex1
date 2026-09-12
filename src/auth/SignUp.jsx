import "./SignUp.css";
import { FaGoogle, FaEye,FaArrowLeft } from "react-icons/fa";
import bg from "../assets/about.jpg";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();

        // Clear previous errors
        setErrors({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        });

        let newErrors = {};

        // Name validation
        if (!name.trim()) {
            newErrors.name = "Please enter your name.";
        }

        // Email validation
        if (!email.trim()) {
            newErrors.email = "Please enter your email.";
        }

        // Password validation
        if (!password) {
            newErrors.password = "Please enter a password.";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        }

        // Confirm password validation
        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password.";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        // Stop if validation failed
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);

            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name: name.trim(),
                email: email.trim(),
                profile: "",
                createdAt: serverTimestamp(),
            });

            // Firebase retains the signed-in user locally, so the session is
            // available again whenever the user returns to the website.
            navigate("/dashboard");

        } catch (error) {
            console.error(error);

            // Firebase errors
            switch (error.code) {
                case "auth/email-already-in-use":
                    setErrors((prev) => ({
                        ...prev,
                        email: "An account with this email already exists.",
                    }));
                    break;

                case "auth/invalid-email":
                    setErrors((prev) => ({
                        ...prev,
                        email: "Please enter a valid email address.",
                    }));
                    break;

                case "auth/weak-password":
                    setErrors((prev) => ({
                        ...prev,
                        password: "Password is too weak. Use a stronger password.",
                    }));
                    break;

                case "auth/network-request-failed":
                    setErrors((prev) => ({
                        ...prev,
                        email: "Network error. Please check your connection.",
                    }));
                    break;

                case "auth/too-many-requests":
                    setErrors((prev) => ({
                        ...prev,
                        email: "Too many attempts. Please try again later.",
                    }));
                    break;

                default:
                    setErrors((prev) => ({
                        ...prev,
                        email: "Something went wrong. Please try again.",
                    }));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-page">

            <button
                className="login-back-button"
                onClick={() => navigate("/")}
                aria-label="Back to home"
            >
                <FaArrowLeft />
                <span>Back</span>
            </button>

            <img
                src={bg}
                className="page-image"
                alt="RIVO."
            />

            <div className="overlay"></div>

            <div className="signup-card">

                <h1>Join Vortex</h1>

                <p className="subtitle">
                    Create your account and start streaming.
                </p>

                <form onSubmit={handleSignup}>

                    {/* NAME */}
                    <div className="input-group">
                        <label>Full Name</label>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            autoComplete="name"
                            value={name}
                            className={errors.name ? "input-error" : ""}
                            onChange={(e) => {
                                setName(e.target.value);

                                setErrors((prev) => ({
                                    ...prev,
                                    name: "",
                                }));
                            }}
                        />

                        {errors.name && (
                            <span className="field-error">
                                {errors.name}
                            </span>
                        )}
                    </div>


                    {/* EMAIL */}
                    <div className="input-group">
                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            autoComplete="email"
                            value={email}
                            className={errors.email ? "input-error" : ""}
                            onChange={(e) => {
                                setEmail(e.target.value);

                                setErrors((prev) => ({
                                    ...prev,
                                    email: "",
                                }));
                            }}
                        />

                        {errors.email && (
                            <span className="field-error">
                                {errors.email}
                            </span>
                        )}
                    </div>


                    <div className="input-group">
                        <label>Password</label>

                        <div
                            className={`password-field ${errors.password ? "password-error" : ""
                                }`}
                        >
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create password"
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);

                                    setErrors((prev) => ({
                                        ...prev,
                                        password: "",
                                    }));
                                }}
                            />

                            <FaEye
                                onClick={() => setShowPassword(!showPassword)}
                                className="eye-icon"
                            />
                        </div>

                        {errors.password && (
                            <span className="field-error">
                                {errors.password}
                            </span>
                        )}
                    </div>


                    <div className="input-group">
                        <label>Confirm Password</label>

                        <div
                            className={`password-field ${errors.confirmPassword ? "password-error" : ""
                                }`}
                        >
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm password"
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);

                                    setErrors((prev) => ({
                                        ...prev,
                                        confirmPassword: "",
                                    }));
                                }}
                            />

                            <FaEye
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="eye-icon"
                            />
                        </div>

                        {errors.confirmPassword && (
                            <span className="field-error">
                                {errors.confirmPassword}
                            </span>
                        )}
                    </div>


                    {/* SIGNUP BUTTON */}
                    <button
                        type="submit"
                        className="signup-btn"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Account"}
                    </button>


                    <div className="divider">
                        <span>Or</span>
                    </div>


                    {/* GOOGLE */}
                    <button
                        type="button"
                        className="google-btn"
                    >
                        <FaGoogle />
                        Continue with Google
                    </button>


                    <p className="login-text">
                        Already have an account?
                        <Link to="/login"> Sign In</Link>
                    </p>

                </form>
            </div>
        </div>
    );
}
