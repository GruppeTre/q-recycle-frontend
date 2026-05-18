import {useCallback, useRef} from "react";

export function useSpeech({ lang = "da-DK", rate = 1, pitch = 1} = {}) {
    const supported = typeof window !== 'undefined' && "speechSynthesis" in window;
    const lastSpokenRef = useRef("");

    const speak = useCallback((text) => {
        if (!supported || !text) return;
        if (text === lastSpokenRef.current) return;
        lastSpokenRef.current = text;

        window.speechSynthesis.cancel();

        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang;
        u.rate = rate;
        u.pitch = pitch;
        window.speechSynthesis.speak(u);
    }, [supported, lang, rate, pitch]);

    return { speak, supported}
}