import React from 'react';


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
        // bad coding....
        const url = 'http://localhost:8000/api/v1/bestiary/'+this.props.uid+"/"
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.setState({
                    jsonData: data,
                    isLoading: false,
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
                        <button onClick={this.props.hideModal}>&times</button>
                        <h2>{jsonData['Full Name'].toUpperCase()}</h2>
                        {
                            this.insertBasicData(
                                jsonData['Alignment'],
                                jsonData['Type'],
                                jsonData['Challenge'][0])
                        }
                        <hr/>
                        {
                            this.insertBaseElems(
                                [
                                    jsonData["Size"],
                                    jsonData["AC"],
                                    jsonData["AC Type"],
                                    jsonData["HP"],
                                    jsonData["HP Dice"],
                                    jsonData["Speed"],
                                ]
                            )
                        }
                        <hr/>
                        {
                            this.insertStatblock(jsonData["Stats"], 
                            jsonData["statMods"])
                        }
                        <hr/>
                        {this.insertDetails(jsonData["details"])}
                        <hr/>
                        {this.insertActions(jsonData["Actions"])}
                        <hr/>
                        {this.insertLegendaryActions(jsonData["Legendary Actions"])}
                    </div>
                </div>
            )  
        } else {
            return <p>LOADING PLACEHOLDER</p>
        }
       
    }

    insertBasicData(aligned, type, cr) {
        return (
            <div className="basic-data">
                {this.titleCase(aligned)}
                <span>{this.titleCase(type)};</span>
                <span>{cr}</span>
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
                    <span>{jsonStats[k]} ({jsonStatMods[k]})</span>
                </div>
            );
        });
        return (
            <div className="statblock">
                {divChilds}
             </div>
        )
    }

    insertBaseElems(baseElemArray) {
        // NOTE: baseElemArray == [size, ac, acType, hp, hpDice, speed]
        // REFACTOR
        let listItems = [];
        for (let i=0; i<baseElemArray.length; i++) {
            switch (i) {
            case 0:
                listItems.push(
                    <li><b>Size:</b>
                        <span>{this.titleCase(baseElemArray[0])}</span>
                    </li>
                );
                break;
            case 1:
                console.log(baseElemArray[2])
                listItems.push(
                    <li><b>Armor:</b>
                        {(baseElemArray[2] !== "undefined") 
                            ? <span>{baseElemArray[1]} ({this.titleCase(baseElemArray[2])})</span>
                            : <span>{baseElemArray[1]}</span>
                        }
                    </li>
                );
                break;
            case 3:
                listItems.push(
                    <li><b>Hit Points:</b>
                        <span>{baseElemArray[3]} ({this.titleCase(baseElemArray[4])})</span>
                    </li>
                );
                break;
            case 5:
                let spans = [];
                const speeds = baseElemArray[5];
                Object.keys(speeds).forEach(k => {
                    spans.push(
                        <span>
                        <b>{this.titleCase(k)}:</b> <i>{speeds[k]}</i>
                        </span>
                    );
                });
                listItems.push(
                    <li><b>Speed:</b>
                        {spans}
                    </li>
                );
                break;
            }
        }
        return (
            <div className="base-elem">
                <ul>
                {listItems}
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
                        <li><b>{this.titleCase(k2)}: </b>
                            <span>{jsonDetails["Traits"][k2]}</span>
                        </li>
                    );
                });             
            } else {
                // checks if obj is array
                if (Array.isArray(jsonDetails[k])) {
                    listItems.push(
                        <li><b>{this.titleCase(k)}: </b>
                        <span>{jsonDetails[k].join(", ")}</span>
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
                <li><b>{this.titleCase(k)}:</b>
                    <span>{jsonActions[k]}</span>
                </li>
            );
        });
        return (
            <div className="actions-elem">
                <div className="heading">Actions:</div>
                <hr/>
                <ul>
                    {listItems}
                </ul>
            </div>
        )

    }

    insertLegendaryActions(jsonLegendaryActions) {
        let listItems = [];
        if (jsonLegendaryActions.length === 0) {
            Object.keys(jsonLegendaryActions).forEach(k => {
                listItems.push(
                    <li><b>{this.titleCase(k)}: </b>
                        <span>{jsonLegendaryActions[k]}</span>
                    </li>
                );
            });
            return (
                <div className="actions-elem">
                    <div className="heading"> Legendary Actions:</div>
                    <hr />
                    <ul>
                        {listItems}
                    </ul>
                </div>
            )
        } else {
            return <hr/>
        }
    }    
}
