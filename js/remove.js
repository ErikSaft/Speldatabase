// Firebase-konfigurasjon
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
let currentDocId = ""; // Global variabel for å halde på ID-en til spelet som skal oppdaterast

// Overvåkar autentiseringstilstanden
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("Brukaren er logga inn:", user.email);
        loadGames(); // Lastar inn spel når brukaren er logga inn
    } else {
        window.location.href = "login.html"; // Omdiriger til påloggingssida om brukaren ikkje er logga inn
    }
});

// Funksjon for å hente og vise spel
function loadGames(searchQuery = "") {
    const userId = firebase.auth().currentUser.uid; // Hentar ID-en til den innlogga brukaren

    // Hentar spel frå databasen som tilhøyrer den innlogga brukaren
    db.collection("games")
        .where("userId", "==", userId)
        .get()
        .then((querySnapshot) => {
            const gameList = document.getElementById("gameList");
            gameList.innerHTML = ""; // Tøm eksisterande innhald i lista

            // Gå gjennom alle dokument i resultatet
            querySnapshot.forEach((doc) => {
                const game = doc.data();
                const title = game.title?.toLowerCase() || "";

                // Filtrer spel basert på søkefrasen
                if (searchQuery && !title.includes(searchQuery.toLowerCase())) {
                    return; // Hopp over spel som ikkje matcher søkefrasen
                }

                // Opprett eit kort for kvart spel
                const gameCard = document.createElement("div");
                gameCard.classList.add("game-card");

                gameCard.innerHTML = `
                    <img src="${game.image || 'images/question.png'}" alt="${game.title}">
                    <h3>${game.title}</h3>
                    <p>Utgivelsesår: ${game.year}</p>
                    <p>Sjanger: ${game.genre}</p>
                    <p>Vurdering: ${game.rating}</p>
                    <div class="actions">
                        <button onclick="showUpdateForm('${doc.id}', '${game.title}', '${game.year}', '${game.image}', '${game.genre}', '${game.rating}')">⟳</button>
                        <button onclick="deleteGame('${doc.id}')">🗑️</button>
                    </div>
                `;

                gameList.appendChild(gameCard); // Legg spelet til lista
            });

            // Vis ei melding om ingen spel blei funne
            if (querySnapshot.empty || !gameList.hasChildNodes()) {
                gameList.innerHTML = "<p>Ingen spel funne</p>";
            }
        })
        .catch((error) => {
            console.error("Feil ved henting av spel: ", error);
        });
}

// Funksjon for å oppdatere spel-lista basert på søk
function searchGames() {
    const searchQuery = document.getElementById("search").value; // Hentar verdien frå søkefeltet
    loadGames(searchQuery); // Filtrer spelet etter søket
}

// Funksjon for å vise oppdateringsskjema med førehandsutfylte verdiar
function showUpdateForm(docId, title, year, image, genre, rating) {
    currentDocId = docId; // Set ID-en til spelet som skal oppdaterast
    document.getElementById("updateTitle").value = title;
    document.getElementById("updateYear").value = year;
    document.getElementById("updateImage").value = image;
    document.getElementById("updateGenre").value = genre;
    document.getElementById("updateRating").value = rating;
    document.getElementById("updateForm").style.display = "block"; // Vis skjemaet
}

// Funksjon for å sende inn oppdateringar
function submitUpdate() {
    const updatedTitle = document.getElementById("updateTitle").value;
    const updatedYear = document.getElementById("updateYear").value;
    const updatedImage = document.getElementById("updateImage").value;
    const updatedGenre = document.getElementById("updateGenre").value;
    const updatedRating = document.getElementById("updateRating").value;

    // Oppdaterer spelet i databasen
    db.collection("games").doc(currentDocId).update({
        title: updatedTitle,
        year: updatedYear,
        image: updatedImage,
        genre: updatedGenre,
        rating: updatedRating,
    })
        .then(() => {
            document.getElementById("updateForm").style.display = "none"; // Skjul skjemaet
            loadGames(); // Last inn spelet på nytt
        })
        .catch((error) => {
            console.error("Feil ved oppdatering av spel: ", error);
        });
}

// Funksjon for å avbryte oppdatering
function cancelUpdate() {
    document.getElementById("updateForm").style.display = "none"; // Skjul skjemaet
}

// Funksjon for å slette eit spel
function deleteGame(docId) {
    db.collection("games").doc(docId).delete()
        .then(() => {
            loadGames(); // Last inn spelet på nytt
        })
        .catch((error) => {
            console.error("Feil ved sletting av spel: ", error);
        });
}

// Funksjon for å gå tilbake til startsida
function goHome() {
    window.location.href = "index.html";
}
