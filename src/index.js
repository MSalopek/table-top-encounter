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
        this.setState({
            isActive: !this.state.isActive,
            isCurrent: false,
        });
    }

    toggleCurrentPlayer(event) {
        this.setState({
            isCurrent: !this.state.isCurrent,
            isActive: !this.isActive ? true: false,
        });
    }

    render() {
        // text selection inside ps is turned off with css prop
        return (
            <div className={this._selectPlayerClassName()}>
                <p className="name-p">{"PLAYER - " + this.props.nm}</p>
                <p className="stat-p">
                    <span>AC: </span>11
                </p>
                <p className="stat-p">
                    <span>HP: </span>10
                </p>
                <p className="stat-p">
                    <span>Hit: </span>+3
                </p>
                <p className="stat-p">
                    <span>PP: </span>10
                </p>
                <p className="stat-p">
                    <span>PI: </span>10
                </p>
                <p className="stat-p">
                    <ToggleStatus buttonClicked={this.togleStatusChange.bind(this)}/>
                    <ToggleCurrent buttonClicked={this.toggleCurrentPlayer.bind(this)}/>
                </p>
            </div>
        )
    }
}

// react-sortable-hoc pasta
const SortableItem = sortableElement(({value}) => <li>{value}</li>);

const SortableContainer = sortableContainer(({children}) => {
    return <ul>{children}</ul>;
  });

class InitiativeOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: this.createPlayers(5),
        };
    }
    createPlayers(playerCount) {
        let players = [];
        for (let i=0; i<playerCount; i++) {
            players.push(
                <Player nm={i}/>
            );
        };
        return players;
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState(({items}) => ({
          items: arrayMove(items, oldIndex, newIndex),
        }));
      };

    render() {
        const {items} = this.state;
        return (
            <div className="initiativeContainer">
            <SortableContainer pressDelay={100} onSortStart={(_, event) => event.preventDefault()} onSortEnd={this.onSortEnd}>
            {items.map((value, index) => (
              <SortableItem key={`item-${index}`} index={index} value={value} />
            ))}
          </SortableContainer>
          </div>
        );
    }
}

class App extends React.Component {
    render() {
        return (
            <div>
                <div className="heading">
                    <NavButton/>
                </div>
            <div className="main">
                <div className="initiativeOuterContainer">
                    <InitiativeOrder/>
                </div>
                <Notebook/>
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
