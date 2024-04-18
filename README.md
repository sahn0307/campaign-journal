## Introduction

Welcome to Campaign Manager!

Our Fullstack React-Flask App For orrganizing your Tabletop campaigns and characters.

### Campaign Management
Create and manage your campaigns effortlessly. Keep track of campaign details, sessions, and player characters all in one place.

### Character Creation
Build and customize your player characters with our intuitive character creation tools. Choose from a variety of races, classes, and abilities to bring your characters to life.

### Collaborative Play
Invite your friends to join your campaigns and collaborate in real-time. Share character sheets, notes, and campaign updates seamlessly.

## Installation

To download the dependencies for the backend server, run:

```console
pipenv install
pipenv shell
```

You can run your Flask API on [`localhost:5555`](http://localhost:5555) by
running:

```console
python server/app.py
```

Check that your server serves the default route `http://localhost:5555`.


To download the dependencies for the frontend client, run:

```console
npm install --prefix client
```

You can run your React app on [`localhost:3000`](http://localhost:3000) by
running:

```sh
npm start --prefix client
```

Check that your the React client displays a default page
`http://localhost:3000`. 

## Generating Your Database

NOTE: The initial project directory structure does not contain the `instance` or
`migrations` folders. Change into the `server` directory:

```console
cd server
```

Then enter the commands to create the `instance` and `migrations` folders and
the database `app.db` file:

```
flask db init
flask db migrate
flask db upgrade head
```

Finally, seed the Database by running

```
python seed.py
```

You should now be able to navigate to `http://localhost:3000` to use our App!

## Contributors:
Vincent Revard [Github](https://github.com/Vincent-Revard)

Sung-Jin Ahn [Github](https://github.com/sahn0307)
