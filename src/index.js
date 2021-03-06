import React from 'react';
import ReactDOM from 'react-dom';

import uniqueId from 'lodash/uniqueId';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGavel, faBars, faPlay } from '@fortawesome/free-solid-svg-icons';

import { Notebook } from './notebook';
import { ModalView } from './modal';
import './index.css';


class ToggleStatus extends React.Component {
    render() {
        return (
        <button className="toggleButtonStatus" onClick={this.props.buttonClicked}>
            <FontAwesomeIcon icon={faGavel} size='lg' />
        </button>
        );
    }
}

class ToggleCurrent extends React.Component {
    render() {
        return (
            <button className="toggleButtonCurrent" onClick={this.props.buttonClicked}>
                <FontAwesomeIcon icon={faPlay} size='lg' />
            </button>
        );
    }
}

class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isActive: true,
            isCurrent: false,
        };
    }

    _selectPlayerClassName() {
        if (this.state.isCurrent) {
            return "player-current";
        } else if (this.state.isActive) {
            return "player-active";
            
        } else {
            return "player-inactive";
        }
    }

    togleStatusChange(event) {
        event.preventDefault();
        this.setState({
            isActive: !this.state.isActive,
            isCurrent: false,
        });
    }

    toggleCurrentPlayer(event) {
        event.preventDefault();
        this.setState({
            isCurrent: !this.state.isCurrent,
            isActive: !this.isActive ? true: false,
        });
    }

    render() {
        // NOTE text selection inside ps is turned off with css prop
        return (
            <div className={this._selectPlayerClassName()}>
                <p className="name-p">{this.props.name}</p>
                <p className="stat-p">
                    <span>AC: </span>{this.props.ac}
                </p>
                <p className="stat-p">
                    <span>HP: </span>{this.props.hp}
                </p>
                <p className="stat-p">
                    <ToggleStatus buttonClicked={this.togleStatusChange.bind(this)}/>
                    <ToggleCurrent buttonClicked={this.toggleCurrentPlayer.bind(this)}/>
                </p>
            </div>
        )
    }
}

// react-sortable-hoc examples pasta
const SortableItem = sortableElement(({value}) => <li>{value}</li>);

const SortableContainer = sortableContainer(({children}) => {
    return <ul>{children}</ul>;
  });

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            players: [],
            playersCount: {},
            showModal: false,
            beastUID: 0,
        }
        this.addPlayer = this.addPlayer.bind(this)
        this.showModal = this.showModal.bind(this)
        this.hideModal = this.hideModal.bind(this)
    }

    showModal(uid) {
        this.setState({
            showModal: true,
            beastUID: uid,
        });
        console.log("GOT THIS AS UID", uid)
    }  

    hideModal() {
        this.setState({
            showModal: false
        })
    }

    addPlayer(data) {
        let prevPlayers = this.state.players;
        let prevCount = this.state.playersCount;
        for (let i=0; i<data.count;i++){
            if (!prevCount[data.name]) {
                prevCount[data.name] = 1;
                prevPlayers.push(
                    <Player 
                        key={uniqueId("player")} 
                        name={data.name}   
                        ac={data.ac}
                        hp={data.hp} />
                );
            } else {
                prevCount[data.name] += 1;
                let cloneName = data.name + " " + prevCount[data.name]; 
                prevPlayers.push(
                    <Player 
                        key={uniqueId("player")} 
                        name={cloneName}    
                        ac={data.ac}
                        hp={data.hp} />
                    );
            }
        }   
        this.setState({
            players: prevPlayers,
            playersCount: prevCount,
        });
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState(({players}) => ({
          players: arrayMove(players, oldIndex, newIndex),
        }));
      };

    render() {
        const players = this.state.players;
        return (
            <div>
                <div className="heading">
                    <NavButton/>
                </div>
                <div className="main">
                    <div className="initiativeOuterContainer">
                        <div className="initiativeContainer">
                            <SortableContainer 
                                pressDelay={150} 
                                onSortStart={(_, event) => event.preventDefault()} 
                                onSortEnd={this.onSortEnd}
                            >
                                {players.map((value, index) => (
                                    <SortableItem 
                                        key={`item-${index}`} 
                                        index={index} 
                                        value={value} 
                                    />
                                ))}
                            </SortableContainer>
                        </div>            
                    </div>
                    <ModalView hideModal={this.hideModal} show={this.state.showModal} uid={this.state.beastUID} />
                    <Notebook addPlayer={this.addPlayer} showModal={this.showModal}  />
                </div>
            </div>
        );
    }
}

class NavButton extends React.Component {
    render() {
        return (
            <button className="menuButton">
                {<FontAwesomeIcon icon={faBars} size='lg'/>}
            </button>
        )
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById("root"));
