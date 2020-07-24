import React, {Component} from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

import {
    getFromstorage,
    setInStorage,
} from '../../src/utils/storage'

export default class UsersList extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            vendorproducts: [],
            username: '',
            userid: '',
            email: '',
            password: '',
            role: '',
            isLoading: true,
            signinerror: '',
            token: ''
        }
    }

    componentDidMount() {
        const obj = getFromstorage('the_main_app');
        console.log("hell yeah!",obj);
        if(obj && obj.token) {
            const { token } = obj.token;
            const j = {
                userid: obj.token
            };
            console.log('like this?',j);
            axios.get('http://localhost:4000/api/vendor/reviews', {
                params: {
                    userid: obj.token
                }
            })
                .then(response => {
                    this.setState({vendorproducts: response.data});
                    console.log('hello');
                    console.log(response);
                })
                .catch(function(error) {
                    console.log(error);
                })
        }
    }
    // func(currentUser){
    //     console.log(currentUser._id);
    //     const product = {
    //         product_id: currentUser._id
    //     }
    //     axios.post('http://localhost:4000/api/vendor/cancel', product)
    //         .then(res => console.log(res.data));
    //     window.location.reload();
    // }
    render() {
        console.log('vp',this.state.vendorproducts.length);
        if(!this.state.vendorproducts.length){
            return(
                <div>
                    <p>
                        No Products to show
                    </p>
                </div>
                ) ;
        }
        return (
            <div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Customer Name</th>
                            <th>Rating</th>
                            <th>Review</th>
                        </tr>
                    </thead>
                    <tbody>
                    { 
                        this.state.vendorproducts.map((currentUser, i) => {
                            return (
                                <tr>
                                    <td>{currentUser.name}</td>
                                    <td>{currentUser.buyer}</td>
                                    <td>{currentUser.rating}</td>
                                    <td>{currentUser.review}</td>
                                    {/* <td> <button onClick={this.func.bind(null,currentUser) } className="btn btn-primary">Cancel</button> </td> */}
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
            </div>
        )
    }
}