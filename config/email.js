// config/email.js
module.exports.email = {
	service: "Mailgun",
	auth: {
		user: "postmaster@sandboxa1e9402992814c40abedac5fa4b828cc.mailgun.org", 
		pass: "8da4f0dbadb4eb39a7349391d7b532bc-e44cc7c1-f187d800"
	},
	templateDir: "api/emailTemplates",
	from: "antonio.vargas@walloom.com",
	testMode: true,
	ssl: true
};