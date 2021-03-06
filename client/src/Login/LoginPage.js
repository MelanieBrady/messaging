import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import "./LoginPage.css";

export default class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            loggedIn: false,
        };
    }

    validateForm = () => {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://3.135.218.245:3001/login', {
            username: this.state.username,
            password: this.state.password,
        }).then((res) => {
            this.setState({ loggedIn: true }, () => {
                localStorage.setItem('loggedIn', true);
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('username', this.state.username);
            });
        }).catch((error) => {
            console.log(error);
            if (error.response && error.response.status === 401) {
                alert('Invalid username/password combination');
            }
        });
    }

    render() {
        if (this.state.loggedIn) {
            return (
                <Redirect to='/home' />
            );
        }
        return (
            <div>
                <div className="logo_container">
                    <img alt="minimum" src="https://i.redd.it/8fhjxz0ena261.jpg" />
                </div>
                <div className="Login">
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group size="lg" controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                autoFocus
                                value={this.state.username}
                                onChange={(e) => this.setState({ username: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group size="lg" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={this.state.password}
                                onChange={(e) => this.setState({ password: e.target.value })}
                            />
                        </Form.Group>
                        <Button block size="lg" type="submit" disabled={!this.validateForm()}>
                            Login
                        </Button>
                    </Form>
                </div>
            </div>
        );
    }
}