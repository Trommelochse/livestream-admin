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
      leagueInput: '',
      markets: ['en', 'sv', 'no', 'fi'],
      activeMarket: 'en',
      errMsg: ''
    }
  }

  componentWillMount() {
    this.unsubscribeLeauges =
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

  onLeagueInput(ev) {
    this.setState({leagueInput: ev.target.value});
  }

  addLeague() {
    const {leagueInput} = this.state;
    isa.leagueInfo(leagueInput)
      .then(res => res.json())
      .then(res => this.saveLeague(res.el[0]));
  }

  saveLeague(match) {
    if (match) {
      const newLeague = {};
      newLeague.name = match.scn;
      newLeague.sport = match.cri;
      newLeague.scid = match.sci;
      newLeague.market = this.state.activeMarket || 'en';
      newLeague.priority = 1;
      newLeague.active = false;
      db.collection('leagues')
        .add(newLeague)
        .then(docSnap => {
          this.setState({errMsg: '', leagueInput: ''})
        })
        .catch(err => console.log(err))
    }
    else {
      this.setState({errMsg: 'Can currently not retrieve information for league'})
    }
  }

  handleMarketChange(market) {
    this.setState({activeMarket: market})
  }

  handleLeagueUpdate(id, updates) {
    if (id && updates) {
      db.collection('leagues').doc(id).set(updates, {merge: true})
    }
  }

  componentWillUnmount() {
    this.unsubscribeLeauges()
  }

  render() {
    return (
      <div className="App">
        <div className="markets-container">
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
        <div className="leagues-container">
        {
          this.state.leagues
          .filter(el => el.market === this.state.activeMarket)
          .sort((a,b) => a.priority - b.priority)
          .map(league => {
            return (
              <LeagueItem
                onUpdate={this.handleLeagueUpdate.bind(this)}
                key={league.id}
                {...league}
              />
            )
          })
        }
        </div>
        <button onClick={() => this.addLeague()}>Add league</button>
        <input
          value={this.state.leagueInput}
          onChange={ev=> this.setState({leagueInput: ev.target.value})}>
        </input>
      </div>
    );
  }
}

export default App;
