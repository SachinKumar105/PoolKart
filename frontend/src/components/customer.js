import React, {Component} from 'react';
import axios from 'axios';
import CreateUser from './customerraating';
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
            orders: [],
            product: [],
            vendorratings: [],
            username: '',
            userid: '',
            email: '',
            password: '',
            role: '',
            isLoading: true,
            signinerror: '',
            token: '',
            ratingwill: false,
            vendorid: '',
            orderid: '',
            customerid: '',
            productrating: 0,
            vendorrating: 0,
            review: '',
            editorder: false,
            oldquantity: 0,
            newquantity: 0,
            productid: '',
            vendratingwill: false,
        }
        this.func = this.func.bind(this);
        this.func1 = this.func1.bind(this);
        this.func2 = this.func2.bind(this);
        this.func3 = this.func3.bind(this);
        this.onChangeVendorRating = this.onChangeVendorRating.bind(this);
        this.onChangeProductRating = this.onChangeProductRating.bind(this);
        this.onChangeReview = this.onChangeReview.bind(this);
        this.onChangeNewQuantity = this.onChangeNewQuantity.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
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
            axios.get('http://localhost:4000/api/customer/vieworders', {
                params: {
                    token: obj.token
                }
            })
                .then(response => {
                    this.setState({orders: response.data});
                    console.log('hello');
                    console.log(response);
                })
                .catch(function(error) {
                    console.log(error);
                })
        }
    }
    func(currentUser){
        console.log(currentUser);
        this.setState({
            vendorid: currentUser.sellerid,
            orderid: currentUser._id,
            customerid: currentUser.buyerid,
            ratingwill: true
        })
    }
    func1(currentUser){
        console.log(currentUser);
        this.setState({
            orderid: currentUser._id,
            productid: currentUser.productid,
            oldquantity: currentUser.quantity,
            editorder: true
        })
    }
    func2(currentUser){
        console.log('l--',currentUser);
        axios.get('http://localhost:4000/api/vendor/reviews', {
            params: {
                userid: currentUser.sellerid
            }
        })
            .then(response => {
                this.setState({vendorratings: response.data});
                console.log('hello');
                console.log(response);
            })
            .catch(function(error) {
                console.log(error);
            })
        this.setState({
            vendratingwill: true
        })
    }
    func3(currentUser){
        axios.get('http://localhost:4000/api/customer/getdiff',{
            params: {
                productid: currentUser.productid
            }
        })
        .then(response => {
            this.setState({vendorratings: response.data});
            console.log('hello');
            console.log(response.data.diff);
            alert('Quantity left is '+response.data.diff)
        })
        .catch(function(error) {
            console.log(error);
        })

    }
    onChangeVendorRating(event) {
        this.setState({ vendorrating: event.target.value });
    }
    onChangeProductRating(event) {
        this.setState({ productrating: event.target.value });
    }
    onChangeReview(event) {
        this.setState({ review: event.target.value });
    }
    onChangeNewQuantity(event) {
        this.setState({ newquantity: event.target.value });
    }
    

    onSubmit(e) {
        e.preventDefault();
        if(this.state.ratingwill)
        {
                const pro = {
                vendorid: this.state.vendorid,
                orderid: this.state.orderid,
                customerid: this.state.customerid,
                productrating: this.state.productrating,
                vendorrating: this.state.vendorrating,
                review: this.state.review
            }
            axios.post('http://localhost:4000/api/customer/rating', pro)
                .then(res => console.log(res.data));
                alert('Review saved');
                this.setState({
                    ratingwill: false
                });
                this.props.history.push('/customer');
                window.location.reload();
            // console.log('value--',this.state);
        }
        if(this.state.editorder)
        {
            const p ={
                orderid: this.state.orderid,
                productid: this.state.productid,
                oldquantity: this.state.oldquantity,
                newquantity: this.state.newquantity,
            }
            axios.post('http://localhost:4000/api/customer/editorder', p)
                .then(res => console.log(res.data));
                alert('Review saved');
                this.setState({
                    editorder: false
                });
                this.props.history.push('/customer');
                window.location.reload();
        }
    }
    render() {
        console.log('vp',this.state.orders.length);
        if(!this.state.orders.length){
            return(
                <div>
                    <p>
                        No Products to show
                    </p>
                </div>
                ) ;
        }
        if(this.state.vendratingwill){
            return(
                <div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Product Name</th>
                            <th>Customer Name</th>
                            <th>Rating</th>
                            <th>Review</th>
                        </tr>
                    </thead>
                    <tbody>
                    { 
                        this.state.vendorratings.map((currentUser, i) => {
                            return (
                                <tr>
                                    <td>{currentUser.seller}</td>
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
        if(this.state.ratingwill){
            return(
                <div>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Review: </label>
                        <input type="text" 
                                className="form-control" 
                                value={this.state.review}
                                onChange={this.onChangeReview}
                                />
                    </div>
                    <div className="form-group">
                        <label>Product Rating: </label>
                        <input type="number" 
                                className="form-control" 
                                value={this.state.productrating}
                                onChange={this.onChangeProductRating}
                                />
                    </div>
                    <div className="form-group">
                        <label>Vendor Rating: </label>
                        <input type="number" 
                                className="form-control" 
                                value={this.state.vendorrating}
                                onChange={this.onChangeVendorRating}
                                />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Submit" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
                ) ;
        }
        if(this.state.editorder){
            return(
                <div>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Newquantity </label>
                        <input type="text" 
                                className="form-control" 
                                value={this.state.newquantity}
                                onChange={this.onChangeNewQuantity}
                                />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Submit" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
            )
        }
        if(!this.state.ratingwill){
            return (
                <div>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Vendor</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                        { 
                            this.state.orders.map((currentUser, i) => {
                                return (
                                    <tr>
                                        <td>{currentUser.name}</td>
                                        <td>{currentUser.quantity}</td>
                                        <td>{currentUser.price}</td>
                                        <td onClick={this.func2.bind(null,currentUser)}>{currentUser.seller}</td>
                                        <td>{currentUser.status}</td>
                                        {
                                            (currentUser.status=="dispatched")?
                                        <td> <button onClick={this.func.bind(null,currentUser) } className="btn btn-primary">Rate</button> </td>
                                            :
                                        <td><div> <button onClick={this.func1.bind(null,currentUser) } className="btn btn-primary">Edit Order</button>
                                         <button onClick={this.func3.bind(null,currentUser) } className="btn btn-primary">Check Quantity Left</button>
                                         </div></td>
                                        }
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
}