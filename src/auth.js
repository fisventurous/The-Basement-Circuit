import { APP_KEY, TEXT_MODEL, IMAGE_MODEL } from "./config.js";

const TOKEN_KEY = "last-line:access-token";
const DRAFT_KEY = "last-line:draft";
const verifierKey = "last-line:pkce-verifier";
const stateKey = "last-line:oauth-state";
const redirectUri = new URL("../auth.html", import.meta.url).href;

const randomToken = (length = 32) => {
    const bytes = crypto.getRandomValues(new Uint8Array(length));
    return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const challengeFor = async (verifier) => {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
    return btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

export function getAccessToken() {
    try {
        return sessionStorage.getItem(TOKEN_KEY);
    } catch {
        return null;
    }
}

export function takeDraft() {
    try {
        const draft = sessionStorage.getItem(DRAFT_KEY) ?? "";
        sessionStorage.removeItem(DRAFT_KEY);
        return draft;
    } catch {
        return "";
    }
}

export async function connectPollinations(draft = "") {
    if (!APP_KEY) throw new Error("Add your Pollinations App Key in src/config.js first.");
    const verifier = randomToken();
    const state = randomToken(24);
    try {
        sessionStorage.setItem(verifierKey, verifier);
        sessionStorage.setItem(stateKey, state);
        sessionStorage.setItem(DRAFT_KEY, draft);
    } catch {
        throw new Error("This browser blocked the temporary sign-in storage. Allow session storage and try again.");
    }
    const url = new URL("https://enter.pollinations.ai/authorize");
    url.search = new URLSearchParams({
        response_type: "code",
        client_id: APP_KEY,
        redirect_uri: redirectUri,
        state,
        code_challenge: await challengeFor(verifier),
        code_challenge_method: "S256",
        models: `${TEXT_MODEL},${IMAGE_MODEL}`,
        budget: "5",
        expiry: "7",
    });
    window.location.assign(url.href);
}

export function disconnectPollinations() {
    try {
        sessionStorage.removeItem(TOKEN_KEY);
    } catch {
        return;
    }
}

export async function finishAuthorization() {
    const callback = new URL(window.location.href);
    const code = callback.searchParams.get("code");
    const returnedState = callback.searchParams.get("state");
    const error = callback.searchParams.get("error");
    history.replaceState(null, "", callback.pathname);

    if (error) throw new Error("Authorisation was cancelled. You can return to the game.");
    if (!code || !returnedState || returnedState !== sessionStorage.getItem(stateKey)) {
        throw new Error("This sign-in link has expired. Start again from the game.");
    }

    const verifier = sessionStorage.getItem(verifierKey);
    if (!verifier || !APP_KEY) throw new Error("The sign-in details are missing. Start again from the game.");

    const response = await fetch("https://enter.pollinations.ai/api/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            client_id: APP_KEY,
            redirect_uri: redirectUri,
            code_verifier: verifier,
        }),
    });
    const result = await response.json();
    if (!response.ok || typeof result.access_token !== "string") {
        throw new Error("Pollinations couldn’t finish sign-in. Please try again.");
    }

    sessionStorage.setItem(TOKEN_KEY, result.access_token);
    sessionStorage.removeItem(verifierKey);
    sessionStorage.removeItem(stateKey);
    window.location.replace(new URL("index.html", window.location.href).href);
}
