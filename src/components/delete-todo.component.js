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
        axios.get('http://127.0.0.1:4000/todos/delete/'+this.props.match.params.id)
        .then(res => {
                console.log(res.data);
                this.setState({
                    content: res.data
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
            <div style={{marginTop: 10}}>
                <h3>Deleting Todo</h3>
                {this.state.content}
            </div>
        )
    }
}