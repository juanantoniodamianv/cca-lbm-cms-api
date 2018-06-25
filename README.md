# CCA Api #

Instore Messaging Portal.

## API References ##

## **USER**
___
### To create a user: 
(only administrators users, or superior role, can create other users)

    POST http://localhost:1337/v1/user/signup	
		body		
			email: :string, required: true
			password: :string, required: true
			confirmPassword: :string, required: true	
		header 
			Authorization bearer <token>
