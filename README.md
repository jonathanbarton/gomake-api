# gomake-api

goMake API Layer

![DimSum Image](https://pbs.twimg.com/media/CrDtorVUEAA8HW2.jpg:large)

## Tools / Frameworks Used 

| Feature                                | Summary                                                                                                                                                                                                                                                     |
|----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ES6 via Babel                  	 	 | ES6 support using [Babel](https://babeljs.io/).  |
| Authentication via JsonWebToken                  	 	 | Supports authentication using [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken).  |
| Code Linting               			 | JavaScript code linting is done using [ESLint](http://eslint.org) - a pluggable linter tool for identifying and reporting on patterns in JavaScript. Uses ESLint with [eslint-config-airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb), which tries to follow the Airbnb JavaScript style guide.                                                                                                |
| Auto server restart                  	 | Restart the server using [nodemon](https://github.com/remy/nodemon) in real-time anytime an edit is made, with babel compilation and eslint.                                                                                                                                                                            |
| ES6 Code Coverage via [istanbul](https://www.npmjs.com/package/istanbul)                  | Supports code coverage of ES6 code using istanbul and mocha. Code coverage reports are saved in `coverage/` directory post `npm test` execution. Open `lcov-report/index.html` to view coverage report. `npm test` also displays code coverage summary on console.                                                                                                                                                                            |
| Promisified Code via [bluebird](https://github.com/petkaantonov/bluebird)           | We love promise, don't we ? All our code is promisified and even so our tests via [supertest-as-promised](https://www.npmjs.com/package/supertest-as-promised).                       |
| API parameter validation via [express-validation](https://www.npmjs.com/package/express-validation)           | Validate body, params, query, headers and cookies of a request (via middleware) and return a response with errors; if any of the configured validation rules fail. You won't anymore need to make your route handler dirty with such validations. |
| Secure app via [helmet](https://github.com/helmetjs/helmet)           | Helmet helps secure Express apps by setting various HTTP headers. |

## Requirements
 - Node >= 5.4.1
 - Mongodb instance
 
## Installing Mongodb Locally
  (Using mongodb via Docker container details TBA)

  ```bash
  # Install mongo via brew
  brew install mongodb
  
  # Start mongod service via brew
  brew services start mongodb
  
  ```
  
## Getting Started

  ```bash
  # install dependencies
  npm install
    
  # select the right version of node (>=4.2.4)
  nvm use
  
  # cd into the project root and install node dependencies:
  npm install

  ```

Basic Commands

  ```bash
  # start service via swagger:
  gulp serve

  ```

## API Documentation

  API Endpoints fully documented and mockable on Apiary.io:
  
  [goMake API Documentation](https://docs.gomake.apiary.io) - https://docs.gomake.apiary.io
  
	
## Running Unit Tests


  ```bash
  # to run tests:
  gulp mocha
  
  # or
  npm test
  ```

## Test Coverage Report

  Coverage report available after running unit tests at:
  
  ```bash
	coverage/lcov-report/index.html
  ```

## Launching from Docker

  Make sure Docker is installed:

  OSX: https://docs.docker.com/engine/installation/mac/

  Windows: https://docs.docker.com/engine/installation/windows/

(Details TBA)
