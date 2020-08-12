# Protest-Tracker
Protest-Tracker is an app designed to improve your awareness of local protests by providing access to reported protest information via map and interactive user-based discussions, as well as recent news specific to your state. 

## Installation 
* Clone the repository
* In the project's root directory, run `npm install`
* Run the web app with`npm start` 

For every pull of the remote repository, please use `npm install` in the root folder. This will install all the app dependencies needed.

To correctly interact with the database, go through the following steps:
1) Go to the src folder and create the file "mongoURI.js"
2) Inside of that file, type in the following: 
		`module.exports = 'mongodb+srv://<username>:<password>@cluster0.tyahz.mongodb.net/<database-name>?retryWrites=true&w=majority';` Where `<username>` and `password` are specific to the account you created in the "Database Access" tab. `<database-name>` is the database you are working with. By default, it is 'protest-tracker' and will have to be modified depend on which database container you are using.
NOTE: the mongoURI.js file has been purposefully excluded on gitignore to avoid others access to your password.

## Testing
Information on test scripts(if implemented)

## Technologies
Project is created with:
* MongoDB version: 4.2.7
* Express version: 4.17.1
* React version: 16.13.1
* Node version: 14.3.0
* Leaflet version: 1.6.0
	
## Contributing
In order for your work to be merged, your Pull Request must:
* Be reviewed and approved by the Project Manager, as well as 1 team member working on the same tech stack (Frontend/Backend)



## Getting Started
This repository aims to assist you in beginning work on a MERN stack application for heroku deployment with a solid file structure as a foundation. To get started make a copy of this template repo for your project teams by clicking the green "Use this template" button above.

Since this project will hold both the client application and the server application there will be node modules in two different places. First run `npm install` from the root. After this you will run `npm run-script install-all` from the root. From now on run this command anytime you want to install all modules again. This is a script we have defined in package.json. Alternatively your group may choose to simplify this process by using yarn workspaces as specified [here](https://yarnpkg.com/lang/en/docs/workspaces/).

This app can be deployed directly to heroku since there is a script defined in package.json which will automatically handle building and deploying the app. For more information on deploying to heroku reference the extra resources at the bottom of this file. 


## Available Scripts

Please note that any time the server is run in these scripts `nodemon` is used in place of `node` for easier development. If you are interested in how this works follow the nodemon In the project directory, you can run:

### `npm run-script dev`

Runs both the client app and the server app in development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view the client in the browser.

### `npm run-script client`

Runs just the client app in development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view the client in the browser.


### `npm run-script server`

Runs just the server in development mode.<br>


### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

If deploying to heroku this does not need to be run since it is handled by the heroku-postbuild script<br>

