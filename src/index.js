import React from 'react';
import ReactDOM from 'react-dom';

import uniqueId from 'lodash/uniqueId';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGavel, faBars, faPlay } from '@fortawesome/free-solid-svg-icons';

import { Notebook } from './notebook';
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

class InitiativeOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // this is an antipattern but I need to set
            // items from props because items are used for sorting
            // TODO
            // this also clears state when moving elements - >
            // new elements object get rendered instead of keeping
            // old ones with their previous states
            // MAYBE USE REDUX IF NOT FIXABLE
            items: props.players,
        };
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState(({items}) => ({
          items: arrayMove(items, oldIndex, newIndex),
        }));
      };

    render() {
        const { items } = this.state;
        return (
            <div className="initiativeContainer">
            <SortableContainer pressDelay={150} onSortStart={(_, event) => event.preventDefault()} onSortEnd={this.onSortEnd}>
            {items.map((value, index) => (
              <SortableItem key={`item-${index}`} index={index} value={value} />
            ))}
          </SortableContainer>
          </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            players: [],
            playersCount: {}
        }
        this.addPlayer = this.addPlayer.bind(this)
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
        console.log("WENT HERE", this.state.playersCount)
        this.setState({
            players: prevPlayers,
            playersCount: prevCount,
        });
    }

    render() {
        const players = this.state.players;
        return (
            <div>
                <div className="heading">
                    <NavButton/>
                </div>
            <div className="main">
                <div className="initiativeOuterContainer">
                    <InitiativeOrder players={players}/>
                </div>
                <Notebook addPlayer={this.addPlayer}/>
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
