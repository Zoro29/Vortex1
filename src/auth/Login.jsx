
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaEye, FaArrowLeft  } from "react-icons/fa";
import { useState } from "react";

import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    linkWithCredential,
} from "firebase/auth";

import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../config/firebase";
import bg from "../assets/about.jpg";


export default function Login() {

    const navigate = useNavigate();


    /* =====================================================
       STATE
    ===================================================== */

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });


    /* =====================================================
       FIRESTORE USER PROFILE
    ===================================================== */

    const createOrUpdateUserProfile = async (user) => {

        if (!user) return;

        const userRef = doc(
            db,
            "users",
            user.uid
        );

        const snapshot = await getDoc(userRef);


        /*
         * First login
         */
        if (!snapshot.exists()) {

            await setDoc(userRef, {

                uid: user.uid,

                name:
                    user.displayName ||
                    "",

                email:
                    user.email ||
                    "",

                profile:
                    user.photoURL ||
                    "",

                createdAt:
                    serverTimestamp(),

                updatedAt:
                    serverTimestamp(),

            });

            return;
        }


        /*
         * Existing profile
         *
         * merge = true means we don't destroy
         * existing user data.
         */
        await setDoc(
            userRef,
            {

                email:
                    user.email ||
                    "",

                /*
                 * Only use Auth's Google/profile
                 * data when it exists.
                 */
                ...(user.displayName
                    ? {
                        name:
                            user.displayName,
                    }
                    : {}),

                ...(user.photoURL
                    ? {
                        profile:
                            user.photoURL,
                    }
                    : {}),

                updatedAt:
                    serverTimestamp(),

            },
            {
                merge: true,
            }
        );
    };


    /* =====================================================
       EMAIL / PASSWORD LOGIN
    ===================================================== */

    const handleLogin = async (e) => {

        e.preventDefault();


        setErrors({
            email: "",
            password: "",
        });


        const newErrors = {};


        /*
         * Validation
         */

        if (!email.trim()) {

            newErrors.email =
                "Please enter your email.";

        }


        if (!password) {

            newErrors.password =
                "Please enter your password.";

        }


        if (
            Object.keys(newErrors).length > 0
        ) {

            setErrors(newErrors);

            return;
        }


        try {

            setLoading(true);


            /*
             * Login with email/password
             */

            const result =
                await signInWithEmailAndPassword(
                    auth,
                    email.trim(),
                    password
                );


            const user =
                result.user;


            console.log(
                "Password login:",
                user.uid
            );


            /*
             * Make sure Firestore profile exists
             */

            await createOrUpdateUserProfile(
                user
            );


            /*
             * Go home
             */

            navigate("/dashboard");


        } catch (error) {

            console.error(
                "Password Login Error:",
                error
            );


            switch (error.code) {

                case "auth/invalid-email":

                    setErrors((prev) => ({
                        ...prev,
                        email:
                            "Please enter a valid email address.",
                    }));

                    break;


                case "auth/user-not-found":

                    setErrors((prev) => ({
                        ...prev,
                        email:
                            "No account exists with this email.",
                    }));

                    break;


                case "auth/wrong-password":

                    setErrors((prev) => ({
                        ...prev,
                        password:
                            "Incorrect password.",
                    }));

                    break;


                case "auth/invalid-credential":

                    setErrors((prev) => ({
                        ...prev,
                        password:
                            "Incorrect email or password.",
                    }));

                    break;


                case "auth/user-disabled":

                    setErrors((prev) => ({
                        ...prev,
                        email:
                            "This account has been disabled.",
                    }));

                    break;


                case "auth/too-many-requests":

                    setErrors((prev) => ({
                        ...prev,
                        password:
                            "Too many failed attempts. Please try again later.",
                    }));

                    break;


                case "auth/network-request-failed":

                    setErrors((prev) => ({
                        ...prev,
                        email:
                            "Network error. Please check your connection.",
                    }));

                    break;


                default:

                    console.error(
                        "Code:",
                        error.code
                    );

                    console.error(
                        "Message:",
                        error.message
                    );

                    setErrors((prev) => ({
                        ...prev,
                        email:
                            "Something went wrong. Please try again.",
                    }));
            }

        } finally {

            setLoading(false);

        }
    };


    /* =====================================================
       GOOGLE LOGIN
    ===================================================== */

    const handleGoogleLogin = async () => {

        try {

            setLoading(true);


            const provider =
                new GoogleAuthProvider();


            /*
             * Ask Google to authenticate
             */

            const result =
                await signInWithPopup(
                    auth,
                    provider
                );


            const user =
                result.user;


            console.log(
                "Google login UID:",
                user.uid
            );

            console.log(
                "Google email:",
                user.email
            );


            /*
             * Create/update Firestore profile
             */

            await createOrUpdateUserProfile(
                user
            );


            /*
             * Success
             */

            navigate("/dashboard");


        } catch (error) {

            console.error(
                "Google Login Error:",
                error
            );


            /*
             * =================================================
             * EXISTING PASSWORD ACCOUNT
             *
             * Example:
             *
             * Firebase:
             * UID A
             * email = jaymeen@gmail.com
             * provider = password
             *
             * User tries Google.
             *
             * Firebase returns:
             * account-exists-with-different-credential
             *
             * We need to authenticate the existing
             * password account and then link Google.
             * =================================================
             */

            if (
                error.code ===
                "auth/account-exists-with-different-credential"
            ) {

                /*
                 * Firebase gives us the Google credential
                 * that couldn't be linked automatically.
                 */

                const pendingCredential =
                    error.credential;


                /*
                 * Firebase also gives us the email
                 * associated with the Google account.
                 */

                const googleEmail =
                    error.customData?.email ||
                    error.email ||
                    "";


                /*
                 * Put the Google email into the login
                 * field so the user only has to enter
                 * their existing password.
                 */

                if (googleEmail) {

                    setEmail(
                        googleEmail
                    );

                }


                /*
                 * Store pending credential temporarily.
                 *
                 * It is only kept in this page's memory.
                 * We do NOT put OAuth credentials into
                 * Firestore.
                 */

                window.__rivoPendingGoogleCredential =
                    pendingCredential;


                /*
                 * Tell the user exactly what happened.
                 */

                setErrors((prev) => ({

                    ...prev,

                    email:
                        "This Google email already has a RIVO account. Enter your existing password to connect Google.",

                }));


                return;
            }


            switch (error.code) {

                case "auth/popup-closed-by-user":

                    setErrors((prev) => ({
                        ...prev,
                        email:
                            "Google sign-in was cancelled.",
                    }));

                    break;


                case "auth/popup-blocked":

                    setErrors((prev) => ({
                        ...prev,
                        email:
                            "Google sign-in popup was blocked. Please allow popups for this site.",
                    }));

                    break;


                case "auth/cancelled-popup-request":

                    break;


                case "auth/network-request-failed":

                    setErrors((prev) => ({
                        ...prev,
                        email:
                            "Network error. Please check your connection.",
                    }));

                    break;


                default:

                    console.error(
                        "Google error code:",
                        error.code
                    );

                    console.error(
                        "Google error message:",
                        error.message
                    );

                    setErrors((prev) => ({
                        ...prev,
                        email:
                            "Unable to sign in with Google. Please try again.",
                    }));
            }

        } finally {

            setLoading(false);

        }
    };


    /* =====================================================
       COMPLETE GOOGLE + PASSWORD LINK
    ===================================================== */

    const completeGoogleLink = async (
        existingUser
    ) => {

        const pendingCredential =
            window.__rivoPendingGoogleCredential;


        if (!pendingCredential) {

            return false;

        }


        try {

            /*
             * Link the Google credential to the
             * already authenticated password user.
             */

            const result =
                await linkWithCredential(
                    existingUser,
                    pendingCredential
                );


            const linkedUser =
                result.user;


            console.log(
                "Google linked successfully."
            );

            console.log(
                "Final UID:",
                linkedUser.uid
            );


            /*
             * Update Firestore using the SAME UID.
             */

            await createOrUpdateUserProfile(
                linkedUser
            );


            /*
             * Remove temporary credential.
             */

            window.__rivoPendingGoogleCredential =
                null;


            return true;


        } catch (error) {

            console.error(
                "Google linking error:",
                error
            );


            if (
                error.code ===
                "auth/credential-already-in-use"
            ) {

                setErrors((prev) => ({
                    ...prev,
                    email:
                        "This Google account is already connected to another RIVO account.",
                }));

            } else if (
                error.code ===
                "auth/provider-already-linked"
            ) {

                setErrors((prev) => ({
                    ...prev,
                    email:
                        "Google is already connected to this account.",
                }));

            } else {

                setErrors((prev) => ({
                    ...prev,
                    email:
                        "We couldn't connect your Google account. Please try again.",
                }));

            }


            return false;
        }
    };


    /* =====================================================
       PASSWORD LOGIN WITH PENDING GOOGLE
       ===================================================== */

    const handlePasswordLogin = async (e) => {

        e.preventDefault();


        /*
         * Clear previous errors
         */

        setErrors({
            email: "",
            password: "",
        });


        /*
         * Validation
         */

        if (!email.trim()) {

            setErrors({
                email:
                    "Please enter your email.",
                password:
                    "",
            });

            return;
        }


        if (!password) {

            setErrors({
                email:
                    "",
                password:
                    "Please enter your password.",
            });

            return;
        }


        try {

            setLoading(true);


            /*
             * Authenticate the existing account
             */

            const result =
                await signInWithEmailAndPassword(
                    auth,
                    email.trim(),
                    password
                );


            const user =
                result.user;


            console.log(
                "Existing password account:",
                user.uid
            );


            /*
             * Check whether Google was waiting
             * to be linked.
             */

            const googleLinked =
                await completeGoogleLink(
                    user
                );


            if (googleLinked) {

                /*
                 * Google + Password are now attached
                 * to the SAME Firebase UID.
                 */

                console.log(
                    "Password + Google account merged."
                );

            }


            /*
             * Update/create profile
             */

            await createOrUpdateUserProfile(
                auth.currentUser
            );


            navigate("/home");


        } catch (error) {

            console.error(
                "Password login error:",
                error
            );


            switch (error.code) {

                case "auth/invalid-credential":

                case "auth/wrong-password":

                case "auth/user-not-found":

                    setErrors((prev) => ({
                        ...prev,
                        password:
                            "Incorrect email or password.",
                    }));

                    break;


                case "auth/too-many-requests":

                    setErrors((prev) => ({
                        ...prev,
                        password:
                            "Too many failed attempts. Please try again later.",
                    }));

                    break;


                case "auth/network-request-failed":

                    setErrors((prev) => ({
                        ...prev,
                        email:
                            "Network error. Please check your connection.",
                    }));

                    break;


                default:

                    setErrors((prev) => ({
                        ...prev,
                        email:
                            "Unable to sign in. Please try again.",
                    }));
            }

        } finally {

            setLoading(false);

        }
    };


    /* =====================================================
       FORM SUBMIT
    ===================================================== */

    const handleSubmit = async (e) => {

        /*
         * If Google authentication previously discovered
         * an existing password account, use the special
         * linking flow.
         */

        if (
            window.__rivoPendingGoogleCredential
        ) {

            await handlePasswordLogin(e);

            return;
        }


        /*
         * Normal login
         */

        await handleLogin(e);
    };


    /* =====================================================
       UI
    ===================================================== */

    return (

        <div className="login-page">

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


            <div className="login-card">

                {/* TITLE */}

                <h1>
                    Welcome Back!
                </h1>


                <p className="subtitle">

                    Sign in to continue your
                    entertainment journey.

                </p>


                <form
                    autoComplete="off"
                    onSubmit={handleSubmit}
                >


                    {/* =====================================
                        EMAIL
                    ====================================== */}

                    <div className="input-group">

                        <label>
                            Email
                        </label>


                        <input
                            type="email"
                            placeholder="Enter your email"
                            autoComplete="off"
                            value={email}

                            className={
                                errors.email
                                    ? "input-error"
                                    : ""
                            }

                            onChange={(e) => {

                                setEmail(
                                    e.target.value
                                );

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


                    {/* =====================================
                        PASSWORD
                    ====================================== */}

                    <div className="input-group">

                        <label>
                            Password
                        </label>


                        <div
                            className={`
password - field
                                ${errors.password
                                    ? "password-error"
                                    : ""
                                }
`}
                        >

                            <input

                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }

                                placeholder="Enter your password"

                                autoComplete="new-password"

                                value={password}

                                onChange={(e) => {

                                    setPassword(
                                        e.target.value
                                    );

                                    setErrors((prev) => ({
                                        ...prev,
                                        password: "",
                                    }));

                                }}

                            />


                            <FaEye
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                className="eye-icon-login"
                            />

                        </div>


                        {errors.password && (

                            <span className="field-error">

                                {errors.password}

                            </span>

                        )}

                    </div>


                    {/* =====================================
                        OPTIONS
                    ====================================== */}

                    <div className="options">

                        <label className="remember">

                            <input
                                type="checkbox"
                            />

                            Remember me

                        </label>


                        <Link
                            to="/forgot-password"
                        >
                            Forgot Password?
                        </Link>

                    </div>


                    {/* =====================================
                        LOGIN
                    ====================================== */}

                    <button

                        type="submit"

                        className="login-btn"

                        disabled={loading}

                    >

                        {loading
                            ? "Signing In..."
                            : "Log In"
                        }

                    </button>


                    {/* =====================================
                        DIVIDER
                    ====================================== */}

                    <div className="divider">

                        <span>
                            Or
                        </span>

                    </div>


                    {/* =====================================
                        GOOGLE
                    ====================================== */}

                    <button

                        type="button"

                        className="google-btn"

                        onClick={
                            handleGoogleLogin
                        }

                        disabled={loading}

                    >

                        <FaGoogle />

                        {
                            loading
                                ? "Signing In..."
                                : "Sign In with Google"
                        }

                    </button>


                    {/* =====================================
                        SIGNUP
                    ====================================== */}

                    <p className="signup-text">

                        Don't have an account?

                        <Link to="/signup">
                            {" "}Sign Up
                        </Link>

                    </p>


                </form>

            </div>

        </div>
    );
}
