const auth = firebase.auth();

const whenSignedIn = document.getElementById("whenSignedIn");
const whenSignedOut = document.getElementById("whenSignedOut");

const signInBtn = document.getElementById("signInBtn");
const signOutBtn = document.getElementById("signOutBtn");

const userDetails = document.getElementById("userDetails");

// Sign in provider:
const provider = new firebase.auth.GoogleAuthProvider();

// Sign in event handlers:

signInBtn.onclick = () => auth.signInWithPopup(provider);

signOutBtn.onclick = () => auth.signOut();
// console.log(firebase);

// Def state changes for user:

auth.onAuthStateChanged((user) => {
  if (user) {
    // signed in:
    whenSignedIn.hidden = false;
    whenSignedOut.hidden = true;
    userDetails.innerHTML = `<h2>Hello Mr/Mrs ${user.displayName}!</h2> <p>With user ID: ${user.uid} and email: ${user.email}</p>`;
  } else {
    // not signed in:
    whenSignedIn.hidden = true;
    whenSignedIn.hidden = false;
    userDetails.innerHTML = "";
  }
});

//firestore:

const db = firebase.firestore();

const createThing = document.getElementById("createThing");
const thingsList = document.getElementById("thingsList");

let thingsRef;
let unsubscribe;

auth.onAuthStateChanged((user) => {
  if (user) {
    // Database Reference
    thingsRef = db.collection("things");

    createThing.onclick = () => {
      const { serverTimestamp } = firebase.firestore.FieldValue;

      thingsRef.add({
        uid: user.uid,
        name: faker.commerce.productName(),
        createdAt: serverTimestamp(),
      });
    };

    // Query
    unsubscribe = thingsRef
      .where("uid", "==", user.uid)
      .orderBy("createdAt") // Requires a query
      .onSnapshot((querySnapshot) => {
        // Map results to an array of li elements

        const items = querySnapshot.docs.map((doc) => {
          return `<li>${doc.data().name}</li>`;
        });

        thingsList.innerHTML = items.join("");
      });
  } else {
    // Unsubscribe when the user signs out
    unsubscribe && unsubscribe();
  }
});
