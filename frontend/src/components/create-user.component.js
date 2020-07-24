import React, {Component} from 'react';
import axios from 'axios';

import {
    getFromstorage,
    // setInStorage,
} from '../../src/utils/storage'

export default class CreateUser extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            email: '',
            password: '',
            role: '',
            isLoading: true,
            signuperror: '',
            token: '',
            loggedin: false
        };

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeRole = this.onChangeRole.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount(){
        const obj = getFromstorage('the_main_app');
        console.log("hell yeah!",obj);
        if(obj && obj.token) {
            const { token } = obj.token;
            //verify token
            fetch('http://localhost:4000/api/account/verify?token=' + obj.token)
            .then((res) => res.json())
            .then(json => {
                console.log('json',json);
                if(json.success){
                    console.log("is this even there?");
                    this.setState({
                        token,
                        isLoading: false,
                        loggedin: true
                    });
                }
                else{
                    console.log("this is not there!");
                    this.setState({
                        isLoading: false,
                        loggedin: false
                    });
                }
            });
        }
        else {
            this.setState({
                isLoading: false,
                loggedin: false 
            });
        }
    }
    
    onChangeUsername(event) {
        this.setState({ username: event.target.value });
    }

    onChangeEmail(event) {
        this.setState({ email: event.target.value });
    }

    onChangePassword(event) {
        this.setState({ password: event.target.value });
    }

    onChangeRole(event) {
        this.setState({ role: event.target.value });
    }

    onSubmit(e) {
        e.preventDefault();

        const newUser = {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password,
            role: this.state.role
        }

        axios.post('http://localhost:4000/api/account/signup', newUser)
             .then(res => console.log(res.data));

        this.setState({
            username: '',
            email: '',
            password: '',
            role: ''
        });
    }

    render() {
        const {
            isLoading,
            token,
            loggedin
        } = this.state;

        if (loggedin) {
            return (<div>
                <p>
                    Logged In....
                </p>
                <p>
                    Please Logout to SignIn
                </p>
                </div>);
        }

        // if(!token){
        //     return (<div>
        //         <p>Sign Up</p>
        //     </div>);
        // }

        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Username: </label>
                        <input type="text" 
                               className="form-control" 
                               value={this.state.username}
                               onChange={this.onChangeUsername}
                               />
                    </div>
                    <div className="form-group">
                        <label>Email: </label>
                        <input type="email" 
                               className="form-control" 
                               value={this.state.email}
                               onChange={this.onChangeEmail}
                               />  
                    </div>
                    <div className="form-group">
                        <label>Password: </label>
                        <input type="password" 
                               className="form-control" 
                               value={this.state.password}
                               onChange={this.onChangePassword}
                               />  
                    </div>
                    <div className="form-group">
                        <div onChange={this.onChangeRole}>
                            <input type="radio" value="Vendor" name="Role"/>Vendor
                            <input type="radio" value="Customer" name="Role"/> Customer
                        </div>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Create User" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }
}