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
            vendorid: '',
            orderid: '',
            customerid: '',
            rating: 0,
            review: ''
        };

        this.onChangeRating = this.onChangeRating.bind(this);
        this.onChangeReview = this.onChangeReview.bind(this);
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
    
    onChangeRating(event) {
        this.setState({ rating: event.target.value });
    }
    onChangeReview(event) {
        this.setState({ review: event.target.value });
    }
    

    onSubmit(e) {
        e.preventDefault();
        // const pro = {
        //     vendorid: this.state.vendorid,
        //     orderid: this.state.orderid,
        //     customerid: this.state.customerid,
        //     rating: this.state.rating,
        //     review: this.state.review
        // }
        // axios.post('http://localhost:4000/api/customer/rating', pro)
        //     .then(res => console.log(res.data));
        //     alert('Review saved');
        //     this.props.history.push('/customers');
        console.log('value--',this.state.rating,this.state.review);
    }

    render() {
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
                    <label>Rating: </label>
                    <input type="number" 
                            className="form-control" 
                            value={this.state.rating}
                            onChange={this.onChangeRating}
                            />
                </div>
                <div className="form-group">
                    <input type="submit" value="Submit" className="btn btn-primary"/>
                </div>
            </form>
        </div>
            ) ;
        }
}