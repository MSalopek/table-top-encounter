import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import './modal.css';

// TODO:
// modal win: put stats into first part (basic info) -- make it flex

export class ModalView extends React.Component {
    // takes JSON response
    // returns modal view for PC/NPC
    constructor(props) {
        super(props);
        this.state = {
            jsonData: {},
            lastUID: null,
            isLoading: true,
        }
    }

    titleCase(string) {
        let splitStr = string.split(" ");
        for (let i=0; i<splitStr.length; i++) {
            let target = splitStr[i];
            let newStr = ""
            for (let j=0; j<target.length; j++) {
                if (j === 0) {
                    newStr += target[j].toUpperCase();
                } else {
                    newStr += target[j].toLowerCase();
                }
            }
            splitStr[i] = newStr;
        }
        return splitStr.join(" ");
    }

    fetchModalViewData() {
        // check if uid is Integer
        const url = 'http://localhost:8000/api/v1/bestiary/'+this.props.uid+"/"
        fetch(url)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    jsonData: data,
                    isLoading: false,
                    lastUID: this.props.uid
                });
            })
    }

    componentDidUpdate (prevProps) {
        if (prevProps.uid !== this.props.uid) {
            if (this.props.uid !== this.state.lastUID) {
                this.fetchModalViewData();
            }
        }
    }
    
    render() {
        if (!this.props.show) {
            return null;
        }

        if (!this.state.isLoading) {
            const jsonData = this.state.jsonData;
            return (
                <div className="modal-window">
                    <div className="modal-content">
                        <div className="close-btn-container">
                            <button className="close-btn" onClick={this.props.hideModal}>
                                <FontAwesomeIcon icon={faTimes} size="lg"/>
                            </button>
                        </div>
                        <h2 className="name-heading">{jsonData['Full Name'].toUpperCase()}</h2>
                        {
                            this.insertSubtitle(
                                jsonData['Alignment'],
                                jsonData['Type'],
                                jsonData['Challenge'][0])
                        }
                        <hr/>
                        <div className="overview">
                            {
                                this.insertBaseElems(
                                    jsonData["Size"],
                                    jsonData["AC"],
                                    jsonData["AC Type"],
                                    jsonData["HP"],
                                    jsonData["HP Dice"],
                                    jsonData["Speed"],
                                )
                            }
                            {
                                this.insertStatblock(jsonData["Stats"], 
                                jsonData["statMods"])
                            }
                        </div>
                        <hr/>
                        {this.insertDetails(jsonData["details"])}
                        <hr/>
                        {this.insertActions(jsonData["Actions"])}
                        {
                            (Object.entries(jsonData["Legendary Actions"]).length !== 0)
                                ? <hr/>
                                : null
                        }
                        {this.insertLegendaryActions(jsonData["Legendary Actions"])}
                        <hr className="bottom-hr"/>
                    </div>
                </div>
            )  
        } else {
            return <p>Loading...</p>
        }
       
    }

    insertSubtitle(aligned, type, cr) {
        return (
            <div className="subtitle">
                <span>
                    {this.titleCase(aligned)} {this.titleCase(type)} {cr}
                </span>
            </div>
        )
    }

    insertStatblock(jsonStats, jsonStatMods) {
        let divChilds = [];
        Object.keys(jsonStats).forEach(k => {
            divChilds.push (
                <div className="statblock-elem">
                    <span><b>{k}</b>  </span>
                    <br/>
                    <span>
                        {jsonStats[k]} {(parseInt(jsonStatMods[k],10) > 0) 
                                            ? `(+${jsonStatMods[k]})`
                                            : `(${jsonStatMods[k]})`
                                        }
                    </span>
                </div>
            );
        });
        return (
            <div className="statblock">
                {divChilds}
             </div>
        )
    }

    insertBaseElems(size, ac, acType, hp, hpDice, speed) {
        let speeds = [];
        Object.keys(speed).forEach(k => {
            speeds.push(
                <span>
                    <i> {k}: </i>{speed[k]}
                </span>
            );
        });
        return (
            <div className="base-elem">
                <ul>
                    <li>
                        <span>
                            <b>Size: </b><i>{size}</i></span>
                    </li>
                    <li>
                        {(acType !== "undefined") 
                            ? <span><b>Armor: </b><i>{ac} ({this.titleCase(acType)})</i></span>
                            : <span><b>Armor: </b><i>{ac}</i></span>
                        }
                    </li>
                    <li>
                        <span>
                            <b>Hit Points: </b><i>{hp} ({hpDice})</i>
                        </span>
                    </li>
                    <li>
                        <span><b>Movement: </b>
                            {speeds}
                        </span>
                    </li>
                </ul>
            </div>
        )
    }


    insertDetails(jsonDetails) {
        let listItems = [];
        Object.keys(jsonDetails).forEach(k => {
            if (k === "Traits") {
                Object.keys(jsonDetails["Traits"]).forEach(k2 => {
                    listItems.push(
                        <li>
                            <span>
                                <b>{this.titleCase(k2)}: </b>
                                <i>{jsonDetails["Traits"][k2]}</i>
                            </span>
                        </li>
                    );
                });             
            } else {
                // checks if obj is array
                if (Array.isArray(jsonDetails[k])) {
                    listItems.push(
                        <li>
                            <span>
                                <b>{this.titleCase(k)}: </b>
                                <i>{jsonDetails[k].join(", ")}</i>
                            </span>
                        </li>
                    );
                }
            }
        });

        return (
            <div className="actions-elem">
                <ul>
                    {listItems}
                </ul>
            </div>            
        )
    }

    insertActions(jsonActions) {
        let listItems = [];
        Object.keys(jsonActions).forEach(k => {
            listItems.push(
                <li>
                    <span>
                        <b>{this.titleCase(k)}: </b><i>{jsonActions[k]}</i>
                    </span>
                </li>
            );
        });
        return (
            <div className="actions-elem">
                <div className="actions-title">Actions:</div>
                <hr/>
                <ul>
                    {listItems}
                </ul>
            </div>
        )

    }

    insertLegendaryActions(jsonLegendaryActions) {
        let listItems = [];
        if (Object.entries(jsonLegendaryActions).length !== 0) {
            Object.keys(jsonLegendaryActions).forEach(k => {
                listItems.push(
                    <li>
                        <span>
                            <b>{this.titleCase(k)}: </b>
                            <i>{jsonLegendaryActions[k]}</i>
                        </span>
                    </li>
                );
            });
            return (
                <div className="actions-elem">
                    <div className="actions-title"> Legendary Actions:</div>
                    <hr />
                    <ul>
                        {listItems}
                    </ul>
                </div>
            )
        } else {
            return null;
        }
    }    
}
