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
            vendorproducts: [],
            userid: '',
            name: '',
            price: 0,
            quantity: 0,
            quantityordered: 0,
            isLoading: true,
            signuperror: '',
            loggedin: false
        };

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangePrice = this.onChangePrice.bind(this);
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
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
    }
    
    onChangeName(event) {
        this.setState({ name: event.target.value });
    }

    onChangePrice(event) {
        this.setState({ price: event.target.value });
    }

    onChangeQuantity(event) {
        this.setState({ quantity: event.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
        const obj = getFromstorage('the_main_app');
        // console.log("hell yeah!",obj);
        if(obj && obj.token) {
            const newProduct = {
                username: obj.username,
                userid: obj.token,
                name: this.state.name,
                price: this.state.price,
                quantity: this.state.quantity,
            }
    
            axios.post('http://localhost:4000/api/vendor/addproduct', newProduct)
                 .then(res => console.log(res.data));
    
            this.setState({
                userid: '',
                name: '',
                price: 0,
                quantity: 0,
            });
        }  
    }

    render() {
        const {
            isLoading,
            token,
            loggedin
        } = this.state;

        // if (loggedin) {
        //     return (<div>
        //         <p>
        //             Logged In....
        //         </p>
        //         <p>
        //             Please Logout to SignIn
        //         </p>
        //         </div>);
        // }

        // if(!token){
        //     return (<div>
        //         <p>Sign Up</p>
        //     </div>);
        // }

        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Name: </label>
                        <input type="text" 
                               className="form-control" 
                               value={this.state.name}
                               onChange={this.onChangeName}
                               />
                    </div>
                    <div className="form-group">
                        <label>Price: </label>
                        <input type="number" 
                               className="form-control" 
                               value={this.state.price}
                               onChange={this.onChangePrice}
                               />  
                    </div>
                    <div className="form-group">
                        <label>Quantity: </label>
                        <input type="number" 
                               className="form-control" 
                               value={this.state.quantity}
                               onChange={this.onChangeQuantity}
                               />  
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Create Product" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }
}