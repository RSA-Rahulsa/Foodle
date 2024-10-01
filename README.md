# foodle

A campus wide food ordering portal built as a course project for CS253 by Team Spartans


### To run the software locally follow the given steps:

Clone the github repo with the link provided below:

```bash
  git clone https://github.com/pranabp-bit/foodle
```

Add the .env (environment file) needed for the software to the backend directory in the following format -
```
PORT=5000 
MONGO_URI="mongodb+srv://anmolpabla19:foodle@cluster0.5jyz8a3.mongodb.net/foodle" 
JWT_SECRET="mya32acharacteraultraasecureaand" 
JWT_EXPIRES_IN="20d" 
SENDER_EMAIL="anmolpabla19@gmail.com" 
SENDER_PASSWORD=".." 
```

Run the following sequence of commands from the root directory:

```bash
  cd backend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```
Backend starts at port 5000

```bash
  cd ..
```
```bash
  cd frontend
```
```bash
  npm install
```
```bash
  npm start
```
Frontend starts at port 3000
### Note

The application will run on the default browser, and is structured minimally as a now, hence can be easily navigated once made to run

Update the system if required in the process



