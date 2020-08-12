# Pin & Protest
Pin & Protest is a web application built in the MERN stack designed to improve your awareness of local protests by providing access to reported protest information via map and interactive user-based discussions, as well as protest-related news articles.

## Installation 
* Clone the repository
* In the project's root directory, run `npm install` and `npm run-script install-all`
* Run the web app locally with`npm run-script dev` 

To correctly interact with the database, go through the following steps:
1) Go to the src folder and create the file "mongoURI.js"
2) Inside of that file, type in the following: 
		`module.exports = 'mongodb+srv://<username>:<password>@cluster0.tyahz.mongodb.net/<database-name>?retryWrites=true&w=majority';` Where `<username>` and `password` are specific to the account you created in the "Database Access" tab. `<database-name>` is the database you are working with. By default, it is 'protest-tracker' and will have to be modified depend on which database container you are using.
NOTE: the mongoURI.js file has been purposefully excluded on gitignore to avoid others access to your password.

## Available Scripts

Please note that any time the server is run in these scripts `nodemon` is used in place of `node` for easier development. You can view the website at http://localhost:3000 when running these scripts.  In the project directory, you can run:

`npm run-script dev` - Runs both the client app and the server app in development mode. <br> 

`npm run-script client` - Runs just the client app in development mode.<br>

`npm run-script server` - Runs just the server in development mode.<br>

`npm run build` - Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

If deploying to heroku this does not need to be run since it is handled by the heroku-postbuild script<br>

## Technologies
Project is created with:
* MongoDB version: 4.2.7
* Express version: 4.17.1
* React version: 16.13.1
* Node version: 14.3.0
* Leaflet version: 1.6.0
	
## Contributing
In order for your work to be merged, your Pull Request must be reviewed and approved by the Project Manager, as well as 1 team member working on the same tech stack (Frontend/Backend)






