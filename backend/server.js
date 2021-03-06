const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const passport = require('passport');
const jwt = require('jsonwebtoken');

const PORT = 4000;
const todoRoutes = express.Router();
const userRoutes = express.Router();

let Todo = require('./models/todo.model');
let User = require('./models/user.model');

var corsOptions = {
    origin: 'http://127.0.0.1:3000',
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

app.use(cors(corsOptions));
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function () {
    console.log("MongoDB database connection established successfully");
})

require('./passportSetup');

todoRoutes.route('/').get(function (req, res) {
    Todo.find(function (err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

todoRoutes.route('/update/:id').post(function (req, res) {
    Todo.findById(req.params.id, function (err, todo) {
        if (!todo)
            res.status(404).send("data is not found");
        else
            todo.todo_description = req.body.todo_description;
        todo.todo_responsible = req.body.todo_responsible;
        todo.todo_priority = req.body.todo_priority;
        todo.todo_completed = req.body.todo_completed;

        todo.save().then(todo => {
            res.json('Todo updated!');
        })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

todoRoutes.route('/:id').get(function (req, res) {
    let id = req.params.id;
    Todo.findById(id, function (err, todo) {
        res.json(todo); //TODO: error handling
    });
});

todoRoutes.route('/add').post(function (req, res) {
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({ 'todo': 'todo added successfully' });
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

todoRoutes.route('/delete/:id').get(function (req, res) {
    let id = req.params.id;
    Todo.findByIdAndDelete(id, function (err, todo) {
        if (err) {
            console.log(err);
            res.status(400).send('Deleting todo failed');
        }
        else {
            res.status(200).send('Deleted todo successfully.');
        }

    })
});

userRoutes.route('/register').post(function (req, res) {
    let user = new User(req.body);
    user.save()
        .then(todo => {
            res.status(200).json({ 'User': 'User registered successfully.' });
        })
        .catch(err => {
            res.status(400).send('Unable to register that user at this time.');
        });
});

/*userRoutes.route('/login').post(function(req, res){
    console.log(req.body);
    User.findOne({ username: req.body.username }, function(err, user) {
        if(!user)
            res.status(400).send('Login failed.');
        else
            user.comparePassword(req.body.password, function(err, isMatch) {
                if(err)
                    res.status(400).send('Login failed.');

                res.status(200).send('Login succeeded');
            });
    });
})*/
userRoutes.route('/login').post(async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        try {
            if (err) {
                console.log(err);
                const error = new Error('An Error occurred')
                return next(error);
            }

            if(!user){
                return res.status(200).send('Login failed');
            }
            req.login(user, { session: false }, async (error) => {
                if (error) return next(error)
                //We don't want to store the sensitive information such as the
                //user password in the token so we pick only the username and id
                const body = { _id: user._id, username: user.username };
                //Sign the JWT token and populate the payload with the user email and id
                const token = jwt.sign({ user: body }, 'top_secret'); //TODO: add secret to key file
                //Send back the token to the user
                res.cookie("token", token, { domain: '127.0.0.1', httponly: true, secure: false, sameSite: false})
                res.status(200).send('Authentication successful');
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
});


app.use('/todos', todoRoutes);
app.use('/user', userRoutes);

//Handle errors
/*app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ error : err });
  });

*/
  
app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});