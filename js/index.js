// Initialiserer Firebase-applikasjonen
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCJA4lucqgKolB6QvNheWF9Lb4HzchxcCY",
    authDomain: "speldatabase.firebaseapp.com",
    projectId: "speldatabase",
    storageBucket: "speldatabase.appspot.com",
    messagingSenderId: "933452366698",
    appId: "1:933452366698:web:eba02330a5b1bec3d21b13",
});

// Opprett referansar til Firestore-databasen og Firebase Authentication
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
let docid = ""; // Variabel for å halde på dokument-ID

// Sjekkar om brukaren er logga inn
auth.onAuthStateChanged((user) => {
    if (user) {
        // Dersom brukaren er logga inn, loggar vi informasjon og hentar element
        console.log("Brukaren er logga inn:", user.email);
        getItems(); // Hentar element frå databasen
    } else {
        // Dersom brukaren ikkje er logga inn, blir dei sendt til påloggingssida
        window.location.href = "login.html";
    }
});
