let User    = require('../models/users');
let jwt 	= require('jsonwebtoken');
var log     = log || process.log;

var Users = {
	/**
	 * Read Users
	 */
	FindUsers : (callback) => {
		User.find({}, (error, users) => {
			error ? 
				callback('No se pueden obtener los usuarios de la base de datos', null) :
				callback(null, users);
		});
	},
	/**
	 * Create a user
	 */
	CreateUser : (user, callback) => {
		User.findOne(
			{
				Username: user.Username,
				Password: user.Password
			},
			(e, userFound) => {
				/**
				 * Returns the saved user
				 */
				let savedUser = (u) => {
					log.success('> User \"' + u.Username + '\" '+ 
											'sucessfully created.');
					callback(null, u);
				};
				/**
				 * Error while saving the user. Log it and return the error
				 */
				let errorSaving = (er)  => {
					log.error('> Something happened creating the user. ' + er);
					callback('Algo paso creando el usuario: \"' + 
								user.Username + '\"', null);
				};
				/**
				 * Error while searching for the user. Log it and return the error
				 */
				let errorSearching = () => {
					log.error('> Something happened searching the user. ' + e);
					callback('Algo paso buscando el usuario ' + user.Username, null);
				};
				/**
				 * The user already exists in the database. Log and return a message
				 */
				let userAlreadySaved = () => {
					log.error('> The user with username \"' + user.Username + '\" ' +
										'already exists!');
					callback('El usuario ingresado ya existe.' + 
								' Elija otro nombre de usuario.', null);
				};
				/**
				 * When a user is successfully saved, update the user with the Token
				 * property and then save it again
				 */ 
				let saveTokenUser = (u) => {
					// const secret = process.env.JWT_SECRET// || 'r{YW"oj8C73I~714sJy0dE1j45x1Qw';
					u.Token = jwt.sign(u, process.env.JWT_SECRET);
					u.save((eUser, uSaved) => {
						eUser ? errorSaving(eUser) : savedUser(uSaved);
					});
				};
				/**
				 *  Populate the model with the given user (request.body) and save it 
				 */
				let registerUser = () => {
					new User(user).save((error, u) => {
						error ? errorSaving(error) : saveTokenUser(u);
					});
				};

				e ? errorSearching() : (userFound ? userAlreadySaved() : registerUser());
			});
	},
	/**
	 * Modify a user
	 */
	ModifyUser : (user, callback) => {
		User.update(
		{
			_id: user.id
		},
		user,
		(e, u) => {

			let userModified = () => {
				log.success('> User updated: \"' + u.Name + '\"');
				callback(null, u);
			};

			let error = () => {
				log.error('> Something happened updating the user \"' + 
							user.Name + '\" -> ' +  e);
				callback(e, null);
			};

			e ? error() : userModified();
		});
	},
	/**
	 * Delete a user
	 */
	DeleteUser : (id, callback) => {
		User.findOne({_id: id}).remove((e, r) => {

			let userDeleted = () => {
				log.success('> Removed User with GUID:' + id);
				callback(null, r);
			};

			let error = () => {
				log.error('> Something happened removing the user -> ' + e);
				callback(e, null);
			};

			e ? error() : userDeleted();
		});
	}
};

// app.use((request, response, next) => {
//    response.setHeader('Access-Control-Allow-Origin', '*');
//    response.setHeader('Access-Control-Allow-Methods', 'GET, POST');
//    response.setHeader('Access-Control-Allow-Headers', 
//    						'X-Requested-With,content-type, Authorization');
//    next();
// });

var Login = {
	/**
	 * Login User
	 */
	Authenticate : (user, callback) => { 
		User.findOne({
				Username: user.Username,
				Password: user.Password
			}, (e, u) => {

				let userFound = () => {
					log.success('> Found User: \"' + u.Username + '\"');
					let token = jwt.sign(u, process.env.JWT_SECRET, {
						expiresInMinutes: 1440 // expires in 24 hours
					});
					// callback(null, u);
					callback(null, token);
				};

				let incorrectAuth = () => {
					log.error('> Incorrect username or password for \"' + 
								user.Username + '\"');
					callback('Incorrect username or password for ' + user.Username, null);
				};

				let error = () => {
					log.error('[Error] Something happened retrieving users '+
							'from database -> ' + e);
					callback('Something happened retrieving users from database' + e, null);	
				};


			e ? error() : (typeof u === 'null' ? incorrectAuth() : userFound());	
		});
	},
	/**
	 * Retrieve User
	 */
	RetrieveUser : (data, callback) => {
		User.findOne({Token: data.Token}, (error, user) => {
			error ? 
				callback(error, null) : 
				callback(null, user);
		});
	},
	/**
	 * Ensure authorized user
	 */
	EnsureAuthorized : (request, response, next) => {
		const bearerHeader = request.headers['authorization'];
		
		let success = () => {
			request.Token = bearerHeader.split(' ')[1];
			next();
		};
		let error = () => {
			response.send(403);
		};

		typeof bearerHeader === 'undefined' ? error() : success();
	}
};
	
module.exports = (app) => {
	app
    /**
	 * GET Users
	 */
    .get('/api/Users', (request, response) => {
		Users.FindUsers((error, users) => {
			response.json({"Users": users, "Error": error});
		});
    })
	/**
	 * Create a user
	 */
    .post('/User', (request, response) => {
		Users.CreateUser(request.body, (error, user) => {
			response.json({User : user, Error : error});
		});
    })
    /**
	 * Modify a user
	 */
    .put('/User', (request, response) => {
		Users.ModifyUser(request.body, (error, user) => {
			response.json({User : user, Error : error});
		});
    })
	/**
	 * Delete a user
	 */
    .delete('/User/:id', (request, response) => {
		Users.DeleteUser(request.params.id, (error, user) => {
			response.json({User : user, Error: error});
		});
    })
	/**
	 * Retrieve the authorized user
	 */
	.get('/Me', Login.EnsureAuthorized, (request, response) => {
		Login.RetrieveUser(request.body, (error, user) => {
			response.json({User : user, Error : error});
		});
	})
	/**
	 * Authentication
	 */
    .post('/Authenticate', (request, response) => {
		Login.Authenticate(request.body, (error, token) => {
			response.json({Token : token});
		});
    });
};