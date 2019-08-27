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
        console.log("CHANGE TAB TO:", this.state)
        this.props.onTabChange(value); // callback to Notebook
        console.log("CALLBACK SEND")
    }
    render() {
        const { activeButton } = this.state
        return (
            <div className="tabs">
                <TabButton 
                    className={(activeButton === "NPCs") ? "tabButtonActive": "tabButton"}
                    value="NPCs" 
                    onClick={this.handleTabChange}
                />
                <TabButton 
                    className={(activeButton === "PCs") ? "tabButtonActive": "tabButton"}
                    value="PCs" 
                    onClick={this.handleTabChange}
                />
                <TabButton 
                    className={(activeButton === "Create") ? "tabButtonActive": "tabButton"}
                    value="Create" 
                    onClick={this.handleTabChange}
                />
            </div>
        )
    }
}

class BestiaryListElem extends React.Component {
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

    sendBeastData(event) {
        event.preventDefault();
        const data = {
            name: this.props.p_name,
            ac: this.props.ac,
            hp: this.props.hp,
            count: this.state.count
        }
        this.props.addPlayer(data)
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
                        <button className="action-button-check" onClick={e => this.sendBeastData(e)}><FontAwesomeIcon icon={faCheck}/></button>
                    </div>
                </div>
            </div>
            </li>
        )
    }
}

class BestiaryContent extends React.Component {
    render() {
        const bestiary = this.props.bestiary;
        const minIndex = this.props.min;
        const maxIndex = this.props.max;
        const isLoading = this.props.loading;
        return (
            <div className="bestiary-box">
                <div className="search-bar">
                    <form className="search-form">
                        <label>
                            <FontAwesomeIcon icon={faSearch} size="lg"/>
                            <input type="text" placeholder="Search..."/>
                        </label>
                    </form>
                </div>
                <div className="bestiary-list">
                    <ul>
                    {!isLoading ? (
                        bestiary.slice(minIndex, maxIndex+1).map(item => {
                            const { name, pretty_name, ac, hp, cr } = item;
                            return (
                                <BestiaryListElem 
                                    key={uniqueId()} 
                                    addPlayer={this.props.addPlayer} 
                                    key_name={name} 
                                    p_name={pretty_name} 
                                    ac={ac} 
                                    hp={hp} 
                                    cr={cr} 
                                />
                            );
                        })) : (<div className="loader"></div>)
                    }
                    </ul>
                </div>
            </div>
        )
    }
}

class PlayerForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            p_name: "",
            ac: "",
            hp: "",
            pp: "",
            pi: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    validateForm() { 
        const vals = [
            this.state.ac,
            this.state.hp,
            this.state.pp,
            this.state.pi 
        ];
        for (let i=0; i<vals.length; i++) {
            if (!Number.isInteger(parseInt(vals[i]))) {
                return false
            }
        }
        return true;
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name
        const value = target.value
        this.setState({
            [name]: value,
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const isValid = this.validateForm();
        if (isValid) {
            const data = {
                name: this.state.p_name,
                ac: this.state.ac,
                hp: this.state.hp,
                count: 1,
            }
            this.props.addPlayer(data);
            this.setState({
                p_name: "",
                ac: "",
                hp: "",
                pp: "",
                pi: "",
            });
        } else {
            alert("AC, HP, PP, PI must be integers");
        }
    }

    render() {
        return (
            <div className="p-form">
            <h2 className="p-form-heading">Quick Create</h2>
            <form id="playerForm" onSubmit={this.handleSubmit}>
                <label>
                    Name
                    <input type="text" name="p_name" value={this.state.p_name} onChange={this.handleChange} />
                </label>
                <label>
                    Armor Class
                    <input type="text" name="ac" value={this.state.ac} onChange={this.handleChange} /> 
                </label>
                <label>
                    Hit Points                   
                    <input type="text" name="hp" value={this.state.hp} onChange={this.handleChange} />
                </label>
                <label>
                    Passive Perception                    
                    <input type="text" name="pp" value={this.state.pp} onChange={this.handleChange} />
                </label>
                <label>
                    Passive Insight
                    <input type="text" name="pi" value={this.state.pi} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Add Player" onSubmit={this.handleSubmit}/>
            </form>
            </div>
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
            activeView: "NPCs"
        }
        this.handleTabChange = this.handleTabChange.bind(this)
    }

    handleTabChange(activeTab) {
        console.log("CALLBACK RCV")
        this.setState({
            activeView: activeTab,
        });
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

    renderActiveComponent(component) {
        switch(component) {
            case "NPCs":
                return <BestiaryContent
                        loading={this.state.isLoading}
                        bestiary={this.state.bestiary} 
                        min={0}
                        max={this.state.bestiary_max_index}
                        addPlayer={this.props.addPlayer}/>
            case "PCs":
                return <div>NOT IMPLEMENTED</div>
            case "Create":
                return <PlayerForm addPlayer={this.props.addPlayer}/>
        }
    }
    
    paneDidMount = (node) => {    
        if(node) {      
            node.addEventListener("scroll", this.handleScroll.bind(this));      
        }
      }
    
    handleScroll = (event) => {    
        var node = event.target;
        const bottom = node.scrollHeight - node.scrollTop === node.clientHeight;
        const bestiaryActive = (this.state.activeView === "NPCs") ? true :false
        if (bestiaryActive && bottom) {      
            console.log("BOTTOM REACHED:", bottom);
            let next_max_index = this.state.bestiary_max_index + 25;
            next_max_index = (next_max_index > this.state.bestiary_len) ? 
                this.state.bestiary_len :
                next_max_index; 
            this.setState({
                    bestiary_max_index: next_max_index
                });
        }   
    }

    componentDidMount () {
        this.fetchBestiary();
    }
    
    render() {
        const { bestiary, error, activeView } = this.state;
        const that = this;
        return (
            <div className="Notebook">
                <NotebookTabs onTabChange={this.handleTabChange} />
                <div ref={that.paneDidMount} className="NotebookPageContent">
                    {this.renderActiveComponent(activeView)}
                </div>
            </div>
        );
    }
}
