import React from "react";
import "../css/Offline.css";

const Offline = ({ onNavigate }) => {

    const goHome = () => {
        onNavigate?.("home");
    };

    const reloadPage = () => {
        window.location.reload();
    };

    return (
        <main className="offline">

            <div className="offline__background">
                <div className="offline__glow" />
                <div className="offline__noise" />
            </div>

            <header className="offline__header">

                <button
                    type="button"
                    className="offline__logo"
                    onClick={goHome}
                >
                    RIVO<span>.</span>
                </button>

            </header>

            <section className="offline__content">

                <span className="offline__eyebrow">
                    NETWORK ERROR
                </span>

                <h1 className="offline__code">
                    OFFLINE
                </h1>

                <div className="offline__message">

                    <h2>
                        You're not connected.
                    </h2>

                    <p>
                        RIVO can't reach the internet right now.
                        Check your connection and try again.
                    </p>

                </div>

                <div className="offline__actions">

                    <button
                        type="button"
                        className="offline__home"
                        onClick={reloadPage}
                    >
                        <span>
                            Try Again
                        </span>

                        <span className="offline__arrow">
                            ↻
                        </span>
                    </button>

                    <button
                        type="button"
                        className="offline__back"
                        onClick={goHome}
                    >
                        Go Home
                    </button>

                </div>

            </section>

            <footer className="offline__footer">

                <span>
                    RIVO
                </span>

                <span>
                    OFFLINE MODE
                </span>

                <span>
                    © {new Date().getFullYear()}
                </span>

            </footer>

        </main>
    );
};

export default Offline;