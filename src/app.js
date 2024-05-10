import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
const characterRef = ref(database, "characters/myCharacter");

const character = document.getElementById("character");
let characterPosition = { x: 0, y: 0 };

const updateCharacterPosition = (x, y) => {
  characterPosition.x = x;
  characterPosition.y = y;
  character.style.left = x + "px";
  character.style.top = y + "px";

  set(characterRef, {
    x: x,
    y: y,
  });
};

updateCharacterPosition(0, 0);

character.addEventListener("click", function () {
  const newX = Math.floor(Math.random() * window.innerWidth);
  const newY = Math.floor(Math.random() * window.innerHeight);
  updateCharacterPosition(newX, newY);
});

const moveCharacter = (deltaX, deltaY) => {
  const newX = characterPosition.x + deltaX;
  const newY = characterPosition.y + deltaY;

  if (
    newX >= 0 &&
    newX <= window.innerWidth &&
    newY >= 0 &&
    newY <= window.innerHeight
  ) {
    updateCharacterPosition(newX, newY);
  }
};
document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowUp") {
    moveCharacter(0, -10);
  } else if (event.key === "ArrowDown") {
    moveCharacter(0, 10);
  } else if (event.key === "ArrowLeft") {
    moveCharacter(-10, 0);
  } else if (event.key === "ArrowRight") {
    moveCharacter(10, 0);
  }
});

onValue(characterRef, (snapshot) => {
  const newPosition = snapshot.val();
  updateCharacterPosition(newPosition.x, newPosition.y);
});
