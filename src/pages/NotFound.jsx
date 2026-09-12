import React from "react";
import "../css/NotFound.css";

const NotFound = ({ onNavigate }) => {
    const goHome = () => {
        onNavigate?.("home");
    };

    const goBack = () => {
        window.history.back();
    };

    return (
        <main className="not-found">

            {/* Background */}
            <div className="not-found__background">
                <div className="not-found__glow" />
                <div className="not-found__noise" />
            </div>


            {/* Header */}
            <header className="not-found__header">

                <button
                    type="button"
                    className="not-found__logo"
                    onClick={goHome}
                    aria-label="Go to RIVO home"
                >
                    RIVO<span>.</span>
                </button>

            </header>


            {/* Content */}
            <section className="not-found__content">

                <span className="not-found__eyebrow">
                    ERROR 404
                </span>


                <h1 className="not-found__code">
                    404
                </h1>


                <div className="not-found__message">

                    <h2>
                        This universe doesn't exist.
                    </h2>

                    <p>
                        The page you're looking for has
                        disappeared somewhere between
                        dimensions.
                    </p>

                </div>


                {/* Actions */}
                <div className="not-found__actions">

                    <button
                        type="button"
                        className="not-found__home"
                        onClick={goHome}
                    >
                        <span>
                            Back to RIVO
                        </span>

                        <span className="not-found__arrow">
                            →
                        </span>
                    </button>


                    <button
                        type="button"
                        className="not-found__back"
                        onClick={goBack}
                    >
                        Go Back
                    </button>

                </div>

            </section>


            {/* Footer */}
            <footer className="not-found__footer">

                <span>
                    RIVO
                </span>

                <span>
                    YOUR MARVEL UNIVERSE
                </span>

                <span>
                    © {new Date().getFullYear()}
                </span>

            </footer>

        </main>
    );
};

export default NotFound;