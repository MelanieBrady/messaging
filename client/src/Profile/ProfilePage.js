import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import "./ProfilePage.css";


export default class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            username: '',
            createdAt: '',
            friendsList: [],
            clickedFavoritesButton: false,
            clickedMessageButton: false,
            loggedIn: true,
            usernameSearch: "",
            usernameSearchSubmitted: false,
            userViewsOwnProfile: false,
        };
    }

    componentDidMount() {
        this.fetchProfile();
    }

    componentDidUpdate() {
        this.fetchProfile();
    }

    fetchProfile = () => {
        const username = this.props.match.params.username;
        console.log(username);
        console.log(localStorage.getItem('token'));


        axios.get('http://3.135.218.245:3001/profile/' + username, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }

        }).then((res) => {
            const user = res.data.user;
            this.setState({ firstName: user.firstName });
            this.setState({ lastName: user.lastName });
            this.setState({ username: user.username });
            this.setState({ createdAt: user.createdAt });
            this.setState({ friendsList: user.friendsList });

            const curUser = localStorage.getItem('username');

            if (this.state.friendsList.includes(curUser)) {
                this.setState({ weAreFriendsWithThisUser: true });
            }


        }).catch((error) => {
            console.log(error);
            if (error.response && error.response.status === 404) {
                alert('User was not found! :(');
            } else if (error.response && error.response.status === 403) {
                this.setState({ loggedIn: false });
                localStorage.setItem('loggedIn', false);
                localStorage.setItem('token', null);
                localStorage.setItem('username', null);
            }
        });
    }

    // Allows for users to log out!
    handleLogOutSubmit = () => {
        this.setState({ loggedIn: false });
        localStorage.setItem('loggedIn', false);
        localStorage.setItem('token', null);
        localStorage.setItem('username', null);
    }

    // Allows for the user to reset password
    handlePasswordReset = () => {
        axios.post('http://3.135.218.245:3001/reset', {
            username: this.state.username,
            password: this.state.password,
            newPassword: this.state.newPassword,
        }).then((res) => {
            this.setState({ loggedIn: false });
        });
    }

    handleMyProfile = () => {
        this.setState({ userViewsOwnProfile: true });
    }

    handleUsernameSearchSubmit = () => {
        console.log(this.state.usernameSearch);
        this.setState({ usernameSearchSubmitted: true });
    }

    handleMessageButtonClick = () => {
        console.log(this.state.usernameSearch);
        this.setState({ clickedMessageButton: true });
    }

    handleFavoriteButtonClick = () => {
        this.setState({ clickedFavoritesButton: true });
    }

    render() {
        const name = this.state.firstName + " " + this.state.lastName;

        if (this.state.clickedMessageButton) {
            return (
                <Redirect to={'/messaging/' + this.state.username} />
            );
        } else if (this.state.usernameSearchSubmitted) {
            return (
                <Redirect to={`/profile/${this.state.usernameSearch}`} />
            );
        } else if (this.state.userViewsOwnProfile) {
            return (
                <Redirect to={`/profile/${localStorage.getItem('username')}`} />
            );
        } else if (!this.state.loggedIn) {
            return (
                <Redirect to={'/login/'} />
            );
        } else if (this.state.clickedFavoritesButton) {

        } else {
            return (
                <div>
                    <ul className="horizontal_TopRow">
                        <div className="smallLogo">
                            <img alt="logo" src="https://lh3.googleusercontent.com/hMjdvzKdf3jyhja4M7APZdeBv5PMXE9TgEY7cdGcmHvNj82x4594wKoTED-8fyXsH5oVnwTemRi1-2DBNA4WkxsSgbxEn8ctT7cXzcc67kKjdbscB4uPT9yG5MjOhrph_xHCGUoHh3bucMc_ueEaQMsavazPpg4x6b9ta7G8oevNcvoh4-6sMH7PjOtdN6G0Ed2UdP7gQOjs3FvG1CHLUlPJiZlno9Fpcqteg1Jfe_4YgxW5TSlgtYHEZrpV1j-JFFYg4-6H2_7UYXzzXKUD8sTvq8cbTygZKJYr_rTGrxKTDArldkjk-VrI0DVfZqKY7zJO4s7ZfNqeKZSQuEv29ih7s8HCHD_Q_od7DZheisutKlmIdrVQmlr2o51s6yIqmDwetMbcr1pkUTZwZU13CfrUVbGrEoPZmC4gY4W6M1cWl2LhGt_St9Hewkr860A_SJS7RTJp0P-p7YANHXDWy9StbQfLLHaqQFJgXzBNCJ7sw7vUsfGXFGoIfzvhO3cdaAb8pCrtUYvibgw9SVF5yR6B6GXUiBJ-BTrpN6CzLZrXr-MAxesPhXj5hUJ9B4pK0f2DDOc8ys_Ktx6dESVpSMQP0P6Wv0o0tQ2T_66YKRQxWpSoxoP7Dj7Bri5eZIBGsSBE3ajfXA0YkgiQpxQwa6mozZBquoxnUNXvdjDbH6NbJF2-QUknTz0fnYNLUw=w1015-h375-no?authuser=0" />
                        </div>
                        <Button style={{ float: 'left' }} variant="primary" size="sm" onClick={this.handleMyProfile}> My Profile </Button>
                        <Button style={{ float: 'right' }} variant="dark" size="sm" onClick={this.handleLogOutSubmit}> Log Out </Button>
                        <Button style={{ float: 'right' }} variant="secondary" size="sm" onClick={this.handlePasswordReset}> Reset Password </Button>
                    </ul>
                    <ul className="horizontal_SecondRow">
                        <Form style={{ float: 'left' }} size="sm" onSubmit={this.handleUsernameSearchSubmit}>
                            <Form.Control type="text" placeholder="Search for user..."
                                onChange={(e) => this.setState({ usernameSearch: e.target.value })} /> </Form>
                        <Button style={{ float: 'left', 'backgroundColor': 'black', 'textColor': 'white' }} size="sm" type="submit">Search</Button>
                    </ul>

                    <div class="row gutters-sm">
                        <div class="col-md-4 mb-3">
                            <div class="card">
                                <div class="card-body">
                                    <div class="d-flex flex-column align-items-center text-center">
                                        <img src="https://comotion.uw.edu/wp-content/uploads/2019/05/generic-profile.png" alt="Admin" width="150" />
                                        <div class="mt-3">
                                            <h4> {name} </h4>
                                            <h6> {this.state.username} </h6>
                                            <Button block size="sm" style={{ display: 'inlineBlock' }} onClick={this.handleFavoriteButtonClick}> Favorite </Button>
                                            <Button block size="sm" variant="outlinePrimary" style={{ display: 'inlineBlock' }} onClick={this.handleMessageButtonClick}> Message </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            );
        }
    }
}