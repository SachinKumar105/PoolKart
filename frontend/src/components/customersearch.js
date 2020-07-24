import React, {Component} from 'react';
import axios from 'axios';
// import { SearchBar } from 'react-native-elements';
import {
    getFromstorage,
    // setInStorage,
} from '../../src/utils/storage'

export default class CreateUser extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            vendorproducts: [],
            orderquantity: 0,
            orderwill: false,
            order_seller: '',
            order_sellerid: '',
            order_buyer: '',
            order_buyerid: '',
            order_productid: '',
            order_name: '',
            order_price: 0,
            order_quantity: 0,
            sorttype: '',
            quantity: 0,
            quantityordered: 0,
        };

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeSortType = this.onChangeSortType.bind(this);
        this.onChangeOrderQuantity = this.onChangeOrderQuantity.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.func = this.func.bind(this);
        this.func1 = this.func1.bind(this);
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
    
    onChangeName(event) {
        this.setState({ name: event.target.value });
    }
    onChangeSortType(event) {
        this.setState({ sorttype: event.target.value },()=> this.func1())
        // this.func1()
    }
    onChangeOrderQuantity(event) {
        this.setState({ orderquantity: event.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
        if(this.state.orderwill){
            const pro = {
                seller: this.state.order_seller,
                sellerid: this.state.order_sellerid,
                buyer: this.state.order_buyer,
                buyerid: this.state.order_buyerid,
                productid: this.state.order_productid,
                name: this.state.order_name,
                price: this.state.order_price,
                quantity: this.state.orderquantity,
            }
            axios.post('http://localhost:4000/api/customer/order', pro)
                .then(res => console.log(res.data));
                alert('Order saved');
                this.setState({
                    orderwill: '',
                });
            window.location.reload()
        }
        if(!this.state.orderwill){
            const Search = {
                name: this.state.name,
            }
            console.log('name',this.state.name)
            axios.get('http://localhost:4000/api/customer/viewproducts', {
                params: {
                    name: this.state.name,
                    sort: this.state.sorttype
                }
            })
                .then(response => {
                    this.setState({vendorproducts: response.data})
                //     .then(p => {
                //         this.state.vendorproducts.sort(function(a,b) {
                //         return b.quantity-b.quantityordered-a.quantity+a.quantityordered;
                //     }
                //     )
                // }

                // );
                this.state.vendorproducts.sort(function(a,b) {
                    return b.quantity-b.quantityordered-a.quantity+a.quantityordered;
                });
                    console.log('tiwiw',this.state.vendorproducts);
                    console.log('hello');
                    console.log(response);
                })
                .catch(function(error) {
                    console.log(error);
                });
            // window.location.reload()
            this.setState({
                name: '',
            });
        }
    }
    func(currentUser){
        // console.log(currentUser._id);
        // const pro = {
        //     seller: currentUser.seller,
        //     buyer: obj.username,
        //     buyerid: obj.token,
        //     productid: currentUser._id,
        //     name: currentUser.name,
        //     price: currentUser.price,
        //     quantity: orderquantity,
        // }
        // axios.post('http://localhost:4000/api/customer/order', pro)
        //     .then(res => console.log(res.data));
        // window.location.reload();
        const obj = getFromstorage('the_main_app');
        this.setState({
            orderwill: true,
            order_seller: currentUser.seller,
            order_sellerid: currentUser.sellerid,
            order_buyer: obj.username,
            order_buyerid: obj.token,
            order_productid: currentUser._id,
            order_name: currentUser.name,
            order_price: currentUser.price,
            quantity: currentUser.quantity,
            quantityordered: currentUser.quantityordered
        })
    }
    func1(){
        let ar = this.state.vendorproducts;
        console.log('sorttype: ',this.state.sorttype);
        if(this.state.sorttype=="price"){
            console.log('hoho----price');
            
            ar.sort(function(a,b) {
                return b.price-a.price;
            });
        }
        if(this.state.sorttype=="quantityleft"){
            console.log('hoho----quantity');
            ar.sort(function(a,b) {
                return b.quantity-b.quantityordered-a.quantity+a.quantityordered;
            });
        }
        if(this.state.sorttype=="rating"){
            console.log('hoho----rating');
            ar.sort(function(a,b) {
                return b.sum*a.number - a.sum*b.number;
            });
        }
        this.setState({
            vendorproducts: ar
        })
        console.log(this.state.vendorproducts);
    }
    render() {
        console.log('vp',this.state.vendorproducts.length);
        if(!this.state.vendorproducts.length && !this.state.orderwill){
            return(
                <div>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Product Name: </label>
                        <input type="text" 
                               className="form-control" 
                               value={this.state.name}
                               onChange={this.onChangeName}
                               />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Search" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
                ) ;
        }
        if(this.state.orderwill){
            return (
                <div>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Quantity : </label>
                            <input type="number" 
                                   className="form-control" 
                                   max = {this.state.quantity-this.state.quantityordered}
                                    // max = {10}
                                   value={this.state.orderquantity}
                                   onChange={this.onChangeOrderQuantity}
                                   />
                        </div>
                        <div className="form-group">
                            <input type="submit" value="Order" className="btn btn-primary"/>
                        </div>
                    </form>
                {/* </div>
                <div> */}
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Quantity Left</th>
                            <th>Vendor</th>
                            <th>Vendor Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                    {   
                        this.state.vendorproducts.map((currentUser, i) => {
                            return (
                                <tr>
                                    <td>{currentUser.name}</td>
                                    <td>{currentUser.quantity}</td>
                                    <td>{currentUser.price}</td>
                                    <td>{currentUser.quantity-currentUser.quantityordered}</td>
                                    <td >{currentUser.seller}</td>
                                    <td >{currentUser.sum/currentUser.number}</td>
                                    {/* <td><input type="number"className="form-control"value={this.state.orderquantity}onChange={this.onChangeOrderQuantity}
                                   /></td> */}
                                    <td> <button onClick={this.func.bind(null,currentUser,this.state.orderquantity) } className="btn btn-primary">Order</button> </td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
            </div>
            )
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
                        <label>Product Name: </label>
                        <input type="text" 
                               className="form-control" 
                               value={this.state.name}
                               onChange={this.onChangeName}
                               />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Search" className="btn btn-primary"/>
                    </div>
                </form>
            <div className="form-group">
                    <div onChange={this.onChangeSortType} >
                        <input type="radio" value="price" name="Sort By"/>Price
                        <input type="radio" value="quantityleft" name="Sort By"/>Quantity Left
                        <input type="radio" value="rating" name="Sort By"/>Rating 
                    </div>
                </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Quantity Left</th>
                        <th>Vendor</th>
                        <th>Vendor Rating</th>
                    </tr>
                </thead>
                <tbody>
                { 
                    this.state.vendorproducts.map((currentUser, i) => {
                        return (
                            <tr>
                                <td>{currentUser.name}</td>
                                <td>{currentUser.quantity}</td>
                                <td>{currentUser.price}</td>
                                <td>{currentUser.quantity-currentUser.quantityordered}</td>
                                <td>{currentUser.seller}</td>
                                <td >{currentUser.sum/currentUser.number}</td>
                                {/* <td><input type="number"className="form-control"value={this.state.orderquantity}onChange={this.onChangeOrderQuantity}
                               /></td> */}
                                <td> <button onClick={this.func.bind(null,currentUser,this.state.orderquantity) } className="btn btn-primary">Order</button> </td>
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