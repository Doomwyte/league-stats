import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      summonerName: "",
      matches: []
    };
  }

  handleSummonerNameChange(event) {
    this.setState({
      summonerName: event.target.value
    });
  }

  handleSummonerNameSubmit(event) {
    event.preventDefault();
    this.doSearch();
  }

  doSearch() {
    this.fetchSummoner()
      .then(res => {
        this.setState({
          matches: res.matches
        });
      })
      .catch(err => console.log(err));
  }

  fetchSummoner = async () => {
    const response = await fetch(`/matches?name=${this.state.summonerName}`);
    const body = await response.json();
    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  }

  render() {
    return (
      <div className="App">
        <div className="Page-title">
          League Stats
        </div>
        <div>
          <form onSubmit={this.handleSummonerNameSubmit.bind(this)}>
            <label>
              Enter summoner name:
              <input type="text" value={this.state.summonerName} onChange={this.handleSummonerNameChange.bind(this)} />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </div>
        {this.state.matches.map(match => {
          const participantStat = match.participantStat;
          const participantTeam = match.participantTeam;
          return (
            <div className="Match-box" key={match.gameId}>
              <div className="Match-innerBox">
                <div>{participantTeam.win === "Win" ? "Victory" : "Defeat"}</div>
                <div>Game Duration: {match.gameDuration} sec</div>
              </div>
              <div className="Match-innerBox">
                <div>Summoner Name: {this.state.summonerName}</div>
                <div>Champion: {participantStat.championName}</div>
                <div>Champion Level: {participantStat.stats.champLevel}</div>
                <div>Kill/Deaths/Assits: {participantStat.stats.kills}/{participantStat.stats.deaths}/{participantStat.stats.assists}</div>
                <div>Spell1: {participantStat.spell1Id}</div>
                <div>Spell2: {participantStat.spell2Id}</div>                
              </div>
              <div className="Match-innerBox">
                <div>Item0: {participantStat.itemName0}</div>
                <div>Item1: {participantStat.stats.itemName1}</div>
                <div>Item2: {participantStat.stats.itemName2}</div>
                <div>Item3: {participantStat.stats.itemName3}</div>
                <div>Item4: {participantStat.stats.itemName4}</div>
                <div>Item5: {participantStat.stats.itemName5}</div>
                <div>Item6: {participantStat.stats.itemName6}</div>
              </div>
            </div>
          );
        }, this)}
      </div>
    );
  }
}

export default App;
