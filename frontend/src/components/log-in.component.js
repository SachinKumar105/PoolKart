import React, {Component} from 'react';
import axios from 'axios';

import {
    getFromstorage,
    setInStorage,
} from '../../src/utils/storage'
import { Redirect } from 'react-router-dom';

export default class LogInUser extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            email: '',
            password: '',
            role: '',
            isLoading: true,
            signinerror: '',
            token: '',
            loggedin: false
        };

        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeToken = this.onChangeToken.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount(){
        const obj = getFromstorage('the_main_app');
        // console.log("hell yeah!",obj);
        if(obj && obj.token) {
            const { token } = obj.token;
            //verify token
            fetch('http://localhost:4000/api/account/verify?token=' + obj.token)
            .then((res) => res.json())
            .then(json => {
                // console.log('json',json);
                if(json.success){
                    // console.log("is this even there?");
                    this.setState({
                        token,
                        isLoading: false,
                        loggedin: true
                    });
                }
                else{
                    // console.log("this is not there!");
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
        console.log(this.state);

    }
    

    onChangeEmail(event) {
        this.setState({ email: event.target.value });
    }

    onChangePassword(event) {
        this.setState({ password: event.target.value });
    }

    onChangeToken(event) {
        this.setState({ token: event.target.value });
    }

    onSubmit(e) {
        const loggedin = this.state.loggedin
        e.preventDefault();
        if(loggedin){
            const obj = getFromstorage('the_main_app');
            // console.log("trying to logout",obj);
            if(obj && obj.token) {
                const { token } = obj.token;
                const j = {
                    userid: obj.token
                };
                // console.log('token for logout',j);
                axios.get('http://localhost:4000/api/account/logout', {
                    params: {
                        userid: obj.token
                    }
                }).then(res => res.data)
                .then(data => {
                    // console.log('data',data);
                    if(data.success){
                        setInStorage('the_main_app', { token: '' });
                        console.log("logged out");
                        this.setState({
                            isLoading: false,
                            loggedin: false
                        });
                        alert('Logging out');
                        window.location.reload()
                    }
                    else{
                        // console.log("didn't logout");
                        this.setState({
                            isLoading: false,
                            loggedin: true
                        });
                    }
                });
            }
        }
        else{
            const User = {
                username: this.state.username,
                email: this.state.email,
                password: this.state.password,
                token: this.state.token,
                role: this.state.role,
                isLoading: false
            }
            // console.log("User:",User);
            axios.post('http://localhost:4000/api/account/signin', User)
            .then(res => res.data)
            .then(data => {
                // console.log('json',data);
                if (data.success) {
                    // console.log("suuuuuuuuuccccccceeeeesssssss");
                    // setInStorage('the_main_app', { token: data.token });
                    axios.get('http://localhost:4000/api/account/getuser', {
                        params : {
                            token: data.token
                        }
                    })
                    .then(res => res.data)
                    .then(data => {
                        setInStorage('the_main_app', { token: data.token, username:data.name, role:data.role });
                        // console.log('lol',data.token,data.name);
                    })
                    this.setState({
                        username: this.state.username,
                        email: this.state.email,
                        password: this.state.password,
                        role: data.role,
                        token: data.token,
                        isLoading: false,
                        loggedin: true,
                    });
                    if(data.role == "Customer"){
                        alert('Logging in as a customer');
                        console.log(this.state);
                        // this.props.history.push("/customer");
                        // window.location.reload('/customer');
                    }
                    if(data.role == "Vendor"){
                        alert('Logging in as a vendor');
                        console.log(this.state);
                        // this.props.history.push("/vendor");
                        // window.location.reload('/vendor');
                        // return <Redirect to="/" />
                    }
                }   
                else {
                    this.setState({
                        signinerror: 'Error',
                        loggedin: false
                });
            }
            console.log(this.state);
        });
        }
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
                   Logged In...
                </p>
                <form onSubmit={this.onSubmit}>
                <div className="form-group">
                        <input type="submit" value="LogOut" className="btn btn-primary"/>
                    </div>
                </form>
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
                        <input type="submit" value="LogIn" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }
}