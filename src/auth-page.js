import { finishAuthorization } from "./auth.js";

const message = document.querySelector("[data-auth-message]");

try {
    await finishAuthorization();
} catch (error) {
    message.textContent = error instanceof Error ? error.message : "Sign-in failed. Return to the game and try again.";
}
