import React, { Component } from 'react';
import axios from 'axios';

export default class DeleteTodo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: ""
        }

        this.onChangeContent = this.onChangeContent.bind(this);
    }

    componentDidMount() {
        axios.get('http://localhost:4000/todos/delete/'+this.props.match.params.id)
            .then(response => {
                this.setState({
                    content: response.data
                })   
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    onChangeContent(e) {
        this.setState({
            content: e.target.value
        });
    }
    
    render() {
        return (
            <div>
                <h3 align="center">Delete Todo</h3>
            </div>
        )
    }
}