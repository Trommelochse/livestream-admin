import React, { Component } from 'react';
import './App.css';
import * as isa from './isa';
import LeagueItem from './components/LeagueItem';
import MarketItem from './components/MarketItem';

import firebase from './firebase';
const db = firebase.firestore();

class App extends Component {

  constructor() {
    super();
    this.state = {
      leagues: [],
      newLeagueInput: 0,
      markets: ['en', 'sv', 'no', 'fi'],
      activeMarket: 'en',
      errMsg: ''
    }
  }

  componentWillMount() {
    this.unsubscribeLeagues =
      db.collection('leagues').onSnapshot(snap => {
        const leagues = [];
        snap.forEach(docSnap => {
          const league = docSnap.data();
          league.id = docSnap.id;
          leagues.push(league)
        })
        this.setState({leagues})
      })
  }

  addLeague() {
    const {newLeagueInput} = this.state;
    if (!newLeagueInput || isNaN(newLeagueInput)) {
      this.setState({errMsg: 'Invalid Input', newLeagueInput: '0'});
    }
    isa.leagueInfo(newLeagueInput)
      .then(res => res.json())
      .then(res => this.saveNewLeague(res.el[0]));
  }

  saveNewLeague(match) {
    if (match) {
      const newLeague = {};
      newLeague.name = match.scn;
      newLeague.sport = match.cri;
      newLeague.scid = match.sci;
      newLeague.market = this.state.activeMarket || 'en';
      newLeague.priority = 1;
      db.collection('leagues')
        .add(newLeague)
        .then(docSnap => {
          this.setState({errMsg: '', newLeagueInput: '0'});
        })
        .catch(err => console.log(err));
    }
    else {
      this.setState({errMsg: 'Can currently not retrieve information for league'});
    }
  }

  handleLeagueDelete(league) {
    const confirmed = window.confirm(`Are you sure you want to delete ${league.name}`);
    if (confirmed) {
      db.collection('leagues').doc(league.id)
        .delete()
        .then(() => console.log('league deleted'))
        .catch(err => console.error(err))
    }
  }

  handleMarketChange(market) {
    this.setState({activeMarket: market});
  }

  handleLeagueUpdate(id, updates) {
    if (id && updates) {
      db.collection('leagues').doc(id).set(updates, {merge: true});
    }
  }

  handleNewLeagueInput(ev) {
    const val = parseInt(ev.target.value, 10);
    if (isNaN(val)) {
      this.setState({newLeagueInput: ''});
    }
    else {
      this.setState({newLeagueInput: Math.abs(val)});
    }
  }

  componentWillUnmount() {
    this.unsubscribeLeagues();
  }

  render() {
    return (
      <div className="App">
        <div className="markets-container">
        <label className="MarketItem">Market:</label>
        {
          this.state.markets.map(market => {
            return (
              <MarketItem
                market={market}
                active={this.state.activeMarket === market}
                onClick={this.handleMarketChange.bind(this)}
                key={market}
              />
            )
          })
        }
        </div>
        <h3 className="leagues-container-heading">
          Active Leagues
        </h3>
        <div className="leagues-container">
        {
          this.state.leagues
          .filter(el => el.market === this.state.activeMarket)
          .sort((a,b) => a.priority - b.priority)
          .map(league => {
            return (
              <LeagueItem
                onUpdate={this.handleLeagueUpdate.bind(this)}
                onDelete={this.handleLeagueDelete.bind(this)}
                key={league.id}
                {...league}
              />
            )
          })
        }
        </div>
        <button onClick={() => this.addLeague()}>Add league</button>
        <input
          type="number"
          value={(this.state.newLeagueInput)}
          onChange={this.handleNewLeagueInput.bind(this)}
          >
        </input>
        <p>{this.state.errMsg}</p>
      </div>
    );
  }
}

export default App;
