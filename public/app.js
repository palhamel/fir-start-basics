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
    userDetails.innerHTML = '';
  }
});
