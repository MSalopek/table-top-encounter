import React from 'react';
import uniqueId from 'lodash/uniqueId';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { faShieldAlt, faPlus, faStar, faCaretUp, faCaretDown, faCheck, faSearch } from '@fortawesome/free-solid-svg-icons';

import './index.css';


// Tab menu button
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
            count: 0,
        }
    }
    onClickUp(event) {
        event.preventDefault();
        if (this.state.count < 10) {
            this.setState({count: this.state.count+1})
        } 
      }
    onClickDown(event) {
        event.preventDefault();
        if (this.state.count > 0) {
            this.setState({count: this.state.count-1})
        }
      }
    render () {
        return (
            <li key={this.props.key_name} className="list-elem">
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
                            <td><span><FontAwesomeIcon icon={faStar}/></span> {this.props.cr}</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                <div className="notebook-counter">
                    <div className="counter"><p className="counter-para">{this.state.count}</p></div>
                    <div className="action-button-container">
                        <button className="action-button" onClick={e => this.onClickUp(e)}><FontAwesomeIcon icon={faCaretUp}/></button>
                        <button className="action-button" onClick={e => this.onClickDown(e)}><FontAwesomeIcon icon={faCaretDown}/></button>
                    </div>
                    <div className="check-box">
                        <button className="action-button-check"><FontAwesomeIcon icon={faCheck}/></button>
                    </div>
                </div>
            </div>
            </li>
        )
    }
}


export class Notebook extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            bestiary: [],
            bestiary_len: 0,
            bestiary_max_index: 0,
            error: null,
            // move tab state to this
        }
    }
    fetchBestiary() {
        fetch('http://localhost:8000/api/v1/bestiary')
          .then(response => response.json())
          .then(data => {
            this.setState({
              bestiary: data.sort().map(item => (item)),
              isLoading: false,
              bestiary_len: data.length,
              bestiary_max_index: 25,
            });
        })
          // Catch any errors we hit and update the app
          .catch(error => this.setState({ error, isLoading: false }));
      }
    
    paneDidMount = (node) => {    
        if(node) {      
            node.addEventListener("scroll", this.handleScroll.bind(this));      
        }
      }
    
    handleScroll = (event) => {    
    var node = event.target;
    const bottom = node.scrollHeight - node.scrollTop === node.clientHeight;
        if (bottom) {      
            console.log("BOTTOM REACHED:", bottom);
            this.setState(oldState => {
                return ({
                    bestiary_max_index: oldState.bestiary_max_index + 25
                });
            }) 
        }   
    }

    componentDidMount () {
        this.fetchBestiary();
    }
    
    render() {
        const { isLoading, bestiary, error } = this.state;
        // implement infinite scroll // load on scroll and such 
        const that = this;
        return (
            <div className="Notebook">
                <NotebookTabs/>
                <div ref={that.paneDidMount} className="NotebookPageContent">
                    <div className="search-bar">
                        <form onSubmit={this.handleSubmit}>
                            <span><FontAwesomeIcon icon={faSearch}/> </span>
                            <input type="text" placeholder="Search..."></input>
                        </form>
                    </div>
                    <div className="bestiary">
                    <ul>
                        {!isLoading ? (
                            bestiary.slice(this.state.bestiary_min_index, this.state.bestiary_max_index+1).map(item => {
                                const { name, pretty_name, ac, hp, cr } = item;
                                return (
                                    <BeastMiniView key={uniqueId()} key_name={name} p_name={pretty_name} ac={ac} hp={hp} cr={cr} />
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
