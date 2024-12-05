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
let docid = ""; // Variabel for å lagre dokument-ID

// Sjekkar om brukaren er logga inn
auth.onAuthStateChanged((user) => {
    if (user) {
        // Loggar brukarinfo og hentar element dersom brukaren er logga inn
        console.log("Brukaren er logga inn:", user.email);
        getItems(); // Hentar element frå databasen
    } else {
        // Omdirigerer til påloggingssida dersom brukaren ikkje er logga inn
        window.location.href = "login.html";
    }
});

// Funksjon for å legge til eit nytt element i databasen
function addItem() {
    const userId = auth.currentUser.uid; // Hentar brukarens UID
    const title = document.getElementById("title").value; // Hentar tittel frå input-feltet
    const year = document.getElementById("year").value; // Hentar år frå input-feltet
    const image = document.getElementById("image").value; // Hentar bilde-URL frå input-feltet
    const genre = document.getElementById("genre").value; // Hentar sjanger frå input-feltet
    const rating = document.getElementById("rating").value; // Hentar vurdering frå input-feltet

    console.log("Legg til nytt spel i databasen"); // Debug-logg

    // Opprett nytt dokument i "games"-samlinga med tittel som ID
    db.collection("games").doc(title).set({
        title: title,
        year: year,
        image: image,
        genre: genre,
        rating: rating,
        userId: userId // Lagre brukarens UID i dokumentet
    });

    // Tøm input-felta etter at elementet er lagt til
    document.getElementById("title").value = ""; 
    document.getElementById("year").value = ""; 
    document.getElementById("image").value = "";
    document.getElementById("genre").value = "";
    document.getElementById("rating").value = "";
}

// Funksjon for å navigere tilbake til heimesida
function goHome() {
    window.location.href = "index.html";
}
