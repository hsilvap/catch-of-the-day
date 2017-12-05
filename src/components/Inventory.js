import React from 'react';
import AddFishForm from './AddFishForm';
import base from  '../base';

class Inventory extends React.Component {

    constructor(){
        super();
        this.renderInventory = this.renderInventory.bind(this);
        this.renderLogin = this.renderLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.logout = this.logout.bind(this);
        this.authHandler = this.authHandler.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.state = {
            uid: null,
            owner: null
        }
    }   

    componentDidMount(){
        base.onAuth((user)=> {
            if(user){
                this.authHandler(null, {user});
            }
        });
    }

    handleChange(e,key){
        const fish = this.props.fishes[key];
        //take copy of fish then update it
        const updatedFish ={...fish,
            [e.target.name]: e.target.value
        };
        this.props.updateFish(key, updatedFish);
    }

    renderLogin(){
        return (
            <nav className="login">
                <h2>Inventory</h2>
                <p>Sign in to manage your store's inventory</p>
                <button className="github" onClick={()=>this.authenticate('github')}>Login with Github</button>
                <button className="facebook" onClick={()=>this.authenticate('facebook')}>Login with Facebook</button>
            </nav>
        )
    }

    authenticate(provider){
        console.log(`trying to log with ${provider}`);
        base.authWithOAuthPopup(provider, this.authHandler);
    }

    logout(){
        base.unauth();
        this.setState({
            uid: null
        })
    }

    authHandler(err, authData){
        if(err){
            console.error(err);
            return;
        }
        
        // grab the store info
        const storeRef = base.database().ref(this.props.storeId);

        storeRef.once('value', (snapshot)=> {
            const data = snapshot.val() || {}

            //claim as our own if no owner
            if(!data.owner){
                storeRef.set({
                    owner: authData.user.uid
                })
            }

            this.setState({
                uid: authData.user.uid,
                owner: data.owner || authData.user.uid
            });
        })

    }

    renderInventory(key){
        const fish = this.props.fishes[key];
        return (
            <div className="fish-edit" key={key}>
                <input type="text" name="name" value={fish.name} placeholder="Fish Name" onChange={(e)=> this.handleChange(e,key)}/>
                <input type="text" name="price" value={fish.price} placeholder="Fish Price" onChange={(e)=> this.handleChange(e,key)}/>
                <select type="text" name="status" value={fish.status} placeholder="Fish Status" onChange={(e)=> this.handleChange(e,key)}> 
                   <option value="available"> Fresh!</option>
                   <option value="unavailable"> Sold Out!</option>
                </select>
                <textarea type="text" name="desc" value={fish.desc} placeholder="Fish Desc" onChange={(e)=> this.handleChange(e,key)}>
                </textarea>
                <input type="text" name="image" value={fish.image} placeholder="Fish Image" onChange={(e)=> this.handleChange(e,key)}/>
                <button onClick={()=> this.props.removeFish(key)}>Remove Fish</button>
            </div>
        )
    }

    render(){
        const logout = <button onClick={this.logout}>Log Out!</button>

        ///check if they are not logged in at all
        if(!this.state.uid){
            return <div>{this.renderLogin()}</div>
        }

        //check if they are owners of the current store
        if(this.state.uid !== this.state.owner){
            return (
                <div>
                    <p>Sorry you aren't the owner of this store!</p> 
                </div>
            )
        }
        return(
            <div>
                <h2>Inventory</h2>
                {logout}
                {Object.keys(this.props.fishes).map(this.renderInventory)}
                <AddFishForm addFish={this.props.addFish}/>
                <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
            </div>
        )
    }
}

Inventory.propTypes = {
    fishes : React.PropTypes.object.isRequired,
    addFish : React.PropTypes.func.isRequired,
    updateFish : React.PropTypes.func.isRequired,
    removeFish : React.PropTypes.func.isRequired,
    loadSamples :  React.PropTypes.func.isRequired,
    storeId : React.PropTypes.string.isRequired
};

export default Inventory;