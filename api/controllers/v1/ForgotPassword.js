module.exports = {	
	forgot: function (req, res) {
		var email = req.param('email');
		verifyParams(res, email);

		User.findOne({email: email}).then(function (user) {
      if (!user) {
        return invalidEmail(res);
      }
      resetPassword(res, user)
    }).catch(function (err) {
      return invalidEmail(res);
		})
		
	}
};

function invalidEmail(res){
  return ResponseService.json(401, res, "This email is not registered.")
};

function verifyParams(res, email){
  if (!email) {
    return ResponseService.json(401, res, "Email is required.")
  }
};

function resetPassword(res, user){
	var token = await sails.helpers.strings.random('url-friendly');
	await User.update({ id: user.id }).set({
		passwordResetToken: token,
		passwordResetTokenExpiresAt: Date.now() + sails.config.custom.passwordResetTokenTTL,
	});

	// Send recovery email
	await sails.helpers.sendTemplateEmail.with({
		to: inputs.emailAddress,
		subject: 'Password reset instructions',
		template: 'email-reset-password',
		templateData: {
			fullName: userRecord.fullName,
			token: token
		}
	});
}