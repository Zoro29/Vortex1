
import { useEffect, useState } from "react";

export default function useOffline() {

    const [isOffline, setIsOffline] =
        useState(!navigator.onLine);

    useEffect(() => {

        const online = () =>
            setIsOffline(false);

        const offline = () =>
            setIsOffline(true);

        window.addEventListener(
            "online",
            online
        );

        window.addEventListener(
            "offline",
            offline
        );

        return () => {

            window.removeEventListener(
                "online",
                online
            );

            window.removeEventListener(
                "offline",
                offline
            );

        };

    }, []);

    return isOffline;
}