const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Cloud Function callable pour définir un rôle
exports.setAdminRole = functions.https.onCall(async (data, context) => {
  // sécuriser : seul un admin peut donner le rôle admin
  if (context.auth.token.admin !== true) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Tu dois être admin pour faire ça.'
    );
  }

  const uid = data.uid;

  await admin.auth().setCustomUserClaims(uid, { admin: true });

  return { message: "Utilisateur défini comme admin !" };
});
