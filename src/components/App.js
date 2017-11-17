import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';

class App extends React.Component {

    constructor(){
        super();
        this.addFish = this.addFish.bind(this);
        this.loadSamples = this.loadSamples.bind(this);
        this.addToOrder = this.addToOrder.bind(this);
        //initial state
        this.state = {
            fishes: {},
            order: {}
        };
    }

    addFish(fish){
        //update the state, set the state
        const fishes  = {...this.state.fishes};
        //add in new fish
        const timestamp = Date.now();
        fishes[`fish-${timestamp}`] = fish;
        //set state
        this.setState({fishes: fishes});
    }

    loadSamples(){
        this.setState({
            fishes:sampleFishes
         })
    }

    addToOrder(key){
        debugger;
        //take copy of state then modify it
        const order = {...this.state.order};
        //update or add the number of fish  -- OR inserts a new one
        order[key] = order[key] + 1 || 1;
        // update state
        this.setState({order});
    }
    
    render(){
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market"/>
                    <ul className="list of fishes">
                            {Object.keys(this.state.fishes).map(key=> <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>)}
                    </ul>
                </div>
                <Order/>
                <Inventory addFish={this.addFish} loadSamples={this.loadSamples}/>
            </div>
        )
    }
} 

export default App;