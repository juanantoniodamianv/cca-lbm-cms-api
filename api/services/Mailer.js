// api/services/Mailer.js
module.exports.sendPasswordResetEmail = function(obj, token) {
  console.log("Mailer service...");
  console.log("*****************");
  console.log(`firstName: ${obj.firstName}`);
  console.log(`lastName: ${obj.lastName}`);
  console.log(`email: ${obj.email}`);
  console.log(`email: ${obj.email}`);
  console.log(`token: ${token}`);
  console.log("*****************");
  sails.hooks.email.send("forgotPassword", 
  {
    firstName: obj.firstName,
    lastName: obj.lastName,
    email: obj.email,
    organization: obj.organization,
    token
  },
  {
    to: obj.email,
    subject: "Password reset instructions."
  },
  function(err) {console.log(err || "Yay! The instruction to reset your password has been sent to your email.");}
)};