// Initialiserer Firebase-applikasjonen med konfigurasjonen
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCJA4lucqgKolB6QvNheWF9Lb4HzchxcCY",
    authDomain: "speldatabase.firebaseapp.com",
    projectId: "speldatabase",
    storageBucket: "speldatabase.appspot.com",
    messagingSenderId: "933452366698",
    appId: "1:933452366698:web:eba02330a5b1bec3d21b13",
});

// Referanse til Firestore-databasen
const db = firebaseApp.firestore();
// Referanse til Firebase Authentication
const auth = firebaseApp.auth();

// Funksjon for å logge inn ein brukar
function login() {
    // Hentar e-post og passord frå HTML-skjemaet
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Forsøker å logge inn brukaren med e-post og passord
    auth.signInWithEmailAndPassword(email, password)
        // Dersom det lukkast, blir brukaren logga inn
        .then((userCredentials) => {
            // Lagrar brukar-ID i sessionStorage for å sjå om brukaren er pålogga
            sessionStorage.setItem("uid", userCredentials.user.uid);
            // Omdirigerer brukaren til heimesida
            window.location.href = "./index.html";
        })
        // Handterer feil om noko går gale under innlogging
        .catch((error) => {
            alert(error.message); // Viser feilmelding til brukaren
            console.error("Feil: " + error.message); // Skriver feilmelding til konsollen
        });
}

// Funksjon for å registrere ein ny brukar
function signUp() {
    // Hentar data frå HTML-skjemaet
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const address = document.getElementById("address").value;
    const zip = document.getElementById("zip").value;
    const city = document.getElementById("city").value;

    // Opprettar ein ny brukar i Firebase Authentication
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredentials) => {
            // Lagrar brukar-ID i sessionStorage
            sessionStorage.setItem("uid", userCredentials.user.uid);

            // Legg til brukarinfo i Firestore-databasen i "users"-samlinga
            db.collection("users").doc().set({
                firstname: firstname,
                lastname: lastname,
                address: address,
                zip: zip,
                city: city,
                email: email,
                userId: userCredentials.user.uid
            })
            // Dersom lagringa lukkast, blir brukaren sendt til heimesida
                .then(function () {
                    window.location.href = "./index.html";
                });
        })
        // Handterer feil om noko går gale under registrering
        .catch((err) => {
            alert(err.message); // Viser feilmelding til brukaren
            console.log(err.code); // Logger feilkoden
            console.log(err.message); // Logger feilmeldinga
        });
}

// Funksjon for å kansellere og gå tilbake til påloggingssida
function cancel() {
    window.location.href = "./login.html";
}
