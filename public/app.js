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

// Def state changes for user:
auth.onAuthStateChanged((user) => {
  if (user) {
    // signed in:
    whenSignedIn.hidden = false;
    whenSignedOut.hidden = true;
    userDetails.innerHTML = `<h2>Hello ${user.displayName}!</h2> <ul><li>Your user ID: ${user.uid}</li> <li>Your email: ${user.email}</li> </ul>`;
  } else {
    // not signed in:
    whenSignedIn.hidden = true;
    whenSignedIn.hidden = false;
    userDetails.innerHTML = "";
  }
});

// Setup firestore:
const db = firebase.firestore();

const createThing = document.getElementById("createThing");
const thingsList = document.getElementById("thingsList");

let thingsRef;
let unsubscribe;

auth.onAuthStateChanged((user) => {
  if (user) {
    // Database ref:
    thingsRef = db.collection("things");

    createThing.onclick = () => {
      const { serverTimestamp } = firebase.firestore.FieldValue;

      thingsRef.add({
        uid: user.uid,
        name: faker.commerce.productName(),
        createdAt: serverTimestamp(),
      });
    };

    // Setting query:
    unsubscribe = thingsRef
      .where("uid", "==", user.uid)
      .orderBy("createdAt") // Requires a query - Composite Indexes
      .onSnapshot((querySnapshot) => {
        // Map results to an array of li elements

        const items = querySnapshot.docs.map((doc) => {
          return `<li class="list-group-item list-group-item-action list-group-item-warning" >${
            doc.data().name
          }</li>`;
        });

        thingsList.innerHTML = items.join("");
      });
  } else {
    // Unsubscribe when the user signs out:
    unsubscribe && unsubscribe();
  }
});
