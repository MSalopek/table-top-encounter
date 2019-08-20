import React from 'react';
// import uniqueId from 'lodash/uniqueId';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { faShieldAlt, faPlus, faStarHalfAlt, faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';

import './index.css';


// Right menu items
class TabButton extends React.Component {
    onClick(event) {
        const value = event.target.value;
        this.props.onClick(value);
      }
    render () {
        return(
            <button
                value={this.props.value}
                className={this.props.className}
                onClick={ e => this.onClick(e) }>
                {this.props.value}
            </button>
        )
    }
}

class NotebookTabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeButton: "NPCs", // Bestiary, Create, PCs
        }
        this.handleTabChange = this.handleTabChange.bind(this);
    }

    handleTabChange(value) {
        this.setState({activeButton: value});
        console.log(this.state);
    }
    render() {
        const { activeButton, items } = this.state
        return (
            <div className="tabs">
                <TabButton 
                    className={(this.state.activeButton === "NPCs") ? "tabButtonActive": "tabButton"}
                    value="NPCs" 
                    onClick={this.handleTabChange}
                />
                <TabButton 
                    className={(this.state.activeButton === "PCs") ? "tabButtonActive": "tabButton"}
                    value="PCs" 
                    onClick={this.handleTabChange}
                />
                <TabButton 
                    className={(this.state.activeButton === "Create") ? "tabButtonActive": "tabButton"}
                    value="Create" 
                    onClick={this.handleTabChange}
                />
            </div>
        )
    }
}

class BeastMiniView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            counter: 0,
        }
        this.counterIncrement = this.counterIncrement.bind(this)
        this.counterDecrement = this.counterDecrement.bind(this)
    }

    counterDecrement() {
        console.log("CLICKED DOWN")
        if (this.state.counter > 0) {
            this.setState({counter: this.state.counter-1});
        }
    }

    counterIncrement() {
        console.log("CLICKED Up")
        if (this.state.counter < 10) {
            this.setState({counter: this.state.counter+1});
        }
    }
    
    render () {
        return (
            <div className="beast-element">
                <div className="statblock">
                    <table className="beast-info-table">
                    <thead>
                        <tr>
                            <th colSpan="4">{this.props.p_name}</th>
                        </tr>
                    </thead>
                    <tbody> 
                        <tr>
                            <td><FontAwesomeIcon icon={faQuestionCircle}/></td>
                            <td><span><FontAwesomeIcon icon={faShieldAlt}/></span> {this.props.ac}</td>
                            <td><span><FontAwesomeIcon icon={faPlus}/></span> {this.props.hp}</td>
                            <td><span><FontAwesomeIcon icon={faStarHalfAlt}/></span> {this.props.cr}</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                <div className="notebook-counter">
                    <div className="counter"><p className="counter-para">{this.state.counter}</p></div>
                    <div className="action-button-container">
                        <button className="action-button" onClick={this.counterIncrement}><FontAwesomeIcon icon={faCaretUp}/></button>
                        <button className="action-button" onClick={this.counterDecrement}><FontAwesomeIcon icon={faCaretDown}/></button>
                    </div>
                </div>
            </div> 
        )
    }
}



export class Notebook extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            items: [],
            error: null
        }
    }
    fetchBestiary() {
        // Where we're fetching data from
        fetch('http://localhost:8000/api/v1/bestiary')
          // We get the API response and receive data in JSON format...
          .then(response => response.json())
          // ...then we update the users state
          .then(data => {
            this.setState({
              items: data.sort().map(item => ({count: 0, details: item})),
              isLoading: false,
            })
        })
          // Catch any errors we hit and update the app
          .catch(error => this.setState({ error, isLoading: false }));
      }
    componentDidMount () {
        this.fetchBestiary();
    }

    render() {
        const { isLoading, items, error } = this.state;
        return (
            <div className="Notebook">
                <NotebookTabs/>
                <div className="NotebookPageContent">
                    <div className="bestiary">
                    <ul>
                        {!isLoading ? (
                            items.map(item => {
                                const { name, pretty_name, ac, hp, cr } = item.details;
                                return (
                                    <li key={name} className="list-elem">
                                        <BeastMiniView p_name={pretty_name} ac={ac} hp={hp} cr={cr} />
                                    </li>
                                );
                            })) : (<h3>Loading...</h3>)
                        }
                    </ul>
                    </div>
                </div>
            </div>
        );
    }
}
