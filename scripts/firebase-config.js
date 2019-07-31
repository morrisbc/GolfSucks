// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDySj5wezRGC10K-73yWz1s8M3Q-pZT-OE",
  authDomain: "golf-sucks.firebaseapp.com",
  databaseURL: "https://golf-sucks.firebaseio.com",
  projectId: "golf-sucks",
  storageBucket: "",
  messagingSenderId: "15320984086",
  appId: "1:15320984086:web:cfc08c3e06697620"
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
