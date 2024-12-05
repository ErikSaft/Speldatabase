// Funksjon for å logge ut brukaren
function logout() {
    // Utfører utlogging via Firebase Authentication
    auth.signOut().then(() => {
        // Fjernar UID frå sessionStorage for å indikere at brukaren er logga ut
        sessionStorage.removeItem("uid");
        // Omdirigerer brukaren til påloggingssida
        window.location.href = "login.html";
    });
}
