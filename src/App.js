//React 
import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Link } from "react-router-dom";


//Custom components
import CreateTodo from "./components/create-todo.component";
import EditTodo from "./components/edit-todo.component";
import TodosList from "./components/todos-list.component";
import RegisterUser from "./components/register-user.component";


//CSS
import "bootstrap/dist/css/bootstrap.min.css";

//images
import logo from "./logo.svg";

class App extends Component {
  render() {
    return (
      <Router>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
        
          <Link to="/" className="navbar-brand">MERN-Stack Todo App</Link>
          <div className="collpase navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="navbar-item">
                <Link to="/" className="nav-link">Todos</Link>
              </li>
              <li className="navbar-item">
                <Link to="/create" className="nav-link">Create Todo</Link>
              </li>
              <li className="navbar-item">
                <Link to="/register" className="nav-link">Register User </Link>
              </li>
            </ul>
          </div>
        </nav>
        <br/>
        <Route path="/" exact component={TodosList} />
        <Route path="/edit/:id" component={EditTodo} />
        <Route path="/create" component={CreateTodo} />
        <Route path="/register" component={RegisterUser} />
      </div>
    </Router>
    );
  }
}

export default App;
