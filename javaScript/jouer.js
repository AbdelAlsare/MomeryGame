
// Récupération des éléments du DOM
const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const folderSelect = document.getElementById("folder-select");
const selectedFolder = folderSelect.value;
let cards;
let interval;
let firstCard = false;
let secondCard = false;

// Liste des noms de mes dossiers et des formats d'images correspondants
const folders = new Map();
folders.set("animaux",{size:28,format:".webp"});
folders.set("animauxAnimes",{size:8,format:".webp"});
folders.set("animauxdomestiques",{size:10,format:".jpg"});
folders.set("chiens",{size:23,format:".webp"});
folders.set("dinosaures",{size:10,format:".jpg"});
folders.set("dinosauresAvecNom",{size:10,format:".jpg"});
folders.set("memory-legume",{size:6,format:".svg"});

const allItems = new Map();
let items;

folders.forEach(function(value, key, map) {
  let folderItems = [];
  
  for (let i = 1; i <= value.size; i++) { // Si chaque dossier contient x images
    folderItems.push({ name: key+i, image: './images/'+key+'/'+i+value.format});
  }
  allItems.set(key, folderItems);
});
console.log(allItems);
// Fonction pour générer les objets pour le tableau 'items'
const generateItems = (folder) => {
  let items = allItems.get(folder);
  console.log(items)
  return items;
};

folderSelect.addEventListener('change', (event) => {
  let selectedFolder = event.target.value;
   items = generateItems(selectedFolder);
  console.log(items);
});
// const items = generateItems(selectedFolder);
// folderSelect.addEventListener('change', (event) => {
//   const selectedFolder = event.target.value;
//   const items = generateItems(selectedFolder);
//   console.log(items);
// });



// Temps initial
let seconds = 0,
    minutes = 0;
// Mouvements initiaux et compteur de victoires
let movesCount = 0,
    winCount = 0;

// Pour le chronomètre
const timeGenerator = () => {
  seconds += 1;
  // Logique des minutes
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  // Formatage du temps avant affichage
  let secondsValue = seconds < 10 ? '0' + seconds : seconds;
  let minutesValue = minutes < 10 ? '0' + minutes : minutes;
  timeValue.innerHTML = '<span>Time:</span>' + minutesValue + ':' + secondsValue;
};

// Pour calculer les mouvements
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = '<span>Moves:</span>' + movesCount;
};



////////////////////////////////////////////////////////////////////

// Sélection d'objets aléatoires dans le tableau 'items'
const generateRandom = (size = 4) => {
  // Tableau temporaire
  let tempArray = [...items]; //items.slice();
  // Initialisation du tableau 'cardValues'
  let cardValues = [];
  // La taille doit être doublée (matrice 4*4)/2 car des paires d'objets existent
  size = (size * size) / 2;
  // Sélection d'objets aléatoires
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    // Une fois sélectionné, retirez l'objet du tableau temporaire
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};



const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  // Mélange simple
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
 
        gameContainer.innerHTML += 
        '<div class="card-container" data-card-value="' + cardValues[i].folders + '">' +
        '<div class="card-before">?</div>' +
        '<div class="card-after">' +
        '<img src="' + cardValues[i].image + '" class="image"/></div>' +
        '</div>';
  }

  
  // Grille
  gameContainer.style.gridTemplateColumns = 'repeat(' + size + ', auto)';

  // Cartes
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      // Si la carte sélectionnée n'a pas encore été trouvée, alors seulement exécuter 
      if (!card.classList.contains("matched")) {
        // Retourner la carte cliquée
        card.classList.add("flipped");
        // Si c'est la première carte (!firstCard car firstCard est initialement false)
        if (!firstCard) {
          // La carte actuelle devient la première carte
          firstCard = card;
          // La valeur de la carte actuelle devient la valeur de la première carte
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          // Incrémentation des mouvements car l'utilisateur a sélectionné une deuxième carte
          movesCounter();
          // Deuxième carte et valeur
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            // Si les deux cartes correspondent, ajoutez la classe 'matched' pour que ces cartes soient ignorées la prochaine fois
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            // Mette 'firstCard' à false car la prochaine carte sera la première
            firstCard = false;
            // Incrémentation du compteur de victoires car l'utilisateur a trouvé une correspondance correcte
            winCount += 1;
            // Vérifie si 'winCount' est égal à la moitié de 'cardValues'
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = '<h2>You Won</h2>' +
              '<h4>Moves: ' + movesCount + '</h4>';
              stopGame();
            }
          } else {
            // Si les cartes ne correspondent pas
            // Retourne les cartes à leur état normal
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

// Démarrer le jeu
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  // Visibilité des contrôles et des boutons
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  // Démarrer le chronomètre
  interval = setInterval(timeGenerator, 1000);
  // Mouvements initiaux
  moves.innerHTML = '<span>Moves:</span> ' + movesCount;
  initializer();
});

// Arrêter le jeu
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
  })
);

// //Initialiser les valeurs et les appels de fonctions
// const initializer = () => {
//   result.innerText = "";
//   winCount = 0;
//   let cardValues = generateRandom();
//   matrixGenerator(cardValues);

//   console.log(cardValues);
// };

// // Initialiser les valeurs et les appels de fonctions

const initializer = () => {
  result.innerText = "";
  winCount = 0;
  const selectedFolder = folderSelect.value;
  const items = generateItems(selectedFolder); // Déplacez la déclaration de 'items' ici
  let cardValues = generateRandom(items);
  matrixGenerator(cardValues);
};

// folderSelect.addEventListener('change', initializer);

// const initializer = () => {
//   result.innerText = "";
//   winCount = 0;
//   const selectedFolder = folderSelect.value;
//   const items = generateItems(selectedFolder);
//   const size = sizeSelect.value; // Récupérez la valeur sélectionnée
//   let cardValues = generateRandom(items, size); // Passez la taille à generateRandom
//   matrixGenerator(cardValues, size); // Passez la taille à matrixGenerator
// };