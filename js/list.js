// Initialiserer Firebase
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCJA4lucqgKolB6QvNheWF9Lb4HzchxcCY",
    authDomain: "speldatabase.firebaseapp.com",
    projectId: "speldatabase",
    storageBucket: "speldatabase.appspot.com",
    messagingSenderId: "933452366698",
    appId: "1:933452366698:web:eba02330a5b1bec3d21b13",
});

// Opprett referansar til databasen og autentisering
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

// Sjekkar om brukaren er logga inn
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("Brukaren er logga inn:", user.email);
        fetchGames(); // Hentar spel når brukaren er logga inn
    } else {
        // Omdirigerer til påloggingssida om brukaren ikkje er logga inn
        window.location.href = "login.html";
    }
});

// Funksjon for å gå tilbake til heimesida
function goHome() {
    window.location.href = "index.html";
}

// Funksjon for å hente spel frå databasen
function fetchGames(searchQuery = "") {
    const userId = firebase.auth().currentUser?.uid; // Hentar UID for den innlogga brukaren

    if (!userId) {
        console.error("Ingen brukar er logga inn!");
        return; // Avbryt om ingen brukar er logga inn
    }

    // Opprett ein spørring for å hente spel som tilhøyrer brukaren
    let query = db.collection("games").where("userId", "==", userId);

    query.get()
        .then((querySnapshot) => {
            const gameList = document.getElementById("gameList");
            gameList.innerHTML = ""; // Tøm eksisterande innhald i lista

            // Gå gjennom alle dokument i resultatet
            querySnapshot.forEach((doc) => {
                const game = doc.data();
                const title = game.title?.toLowerCase() || "";

                // Filtrer spel basert på søkefrase
                if (searchQuery && !title.includes(searchQuery.toLowerCase())) {
                    return; // Hopp over spel som ikkje matcher søket
                }

                // Opprett eit kort for spelet
                const gameCard = document.createElement("div");
                gameCard.classList.add("game-card");

                gameCard.innerHTML = `
                    <img src="${game.image || 'images/question.png'}" alt="${game.title}">
                    <h3>${game.title || 'Ukjent spel'}</h3>
                    <p>Utgivingsår: ${game.year || 'Ikkje oppgitt'}</p>
                    <p>Sjanger: ${game.genre || 'Ikkje oppgitt'}</p>
                    <p>Vurdering: ${game.rating || 'Ingen vurdering'}</p>
                `;

                gameList.appendChild(gameCard); // Legg spelet til lista
            });

            // Vis ei melding dersom ingen spel blei funne
            if (querySnapshot.empty || !gameList.hasChildNodes()) {
                gameList.innerHTML = "<p>Ingen spel funne</p>";
            }
        })
        .catch((error) => {
            console.error("Feil ved henting av spel: ", error);
        });
}

// Funksjon for å søkje etter spel
function searchGames() {
    const searchQuery = document.getElementById("searchInput").value; // Hent teksten frå søkefeltet
    fetchGames(searchQuery); // Filtrer lista basert på søket
}
