const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const fs = require('fs');

const LeagueJS = require('leaguejs');
const leagueJS = new LeagueJS("RGAPI-17b29302-a259-4b10-b010-5c54a971c474");

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

var championData = JSON.parse(fs.readFileSync('./championFull.json', 'utf8'));
var itemData = JSON.parse(fs.readFileSync('./item.json', 'utf8'))

function getAccountId(summonerName) {
  return leagueJS.Summoner.gettingByName(summonerName);
}

function getMatches(accountId) {
  return leagueJS.Match.gettingListByAccount(accountId, "na1", {
    endIndex: 5
  });
}

function getMatch(matchId) {
  return leagueJS.Match.gettingById(matchId);
}

function formatResult(summonerName, matches) {
  return matches.map(match => {
    const participant = match.participantIdentities.find(identity => {
      return identity.player.summonerName.toLowerCase() === summonerName.toLowerCase();
    }, this);
    const participantId = participant.participantId;
    let participantStat = match.participants.find(participant => {
      return participant.participantId === participantId;
    });
    participantStat.championName = championData.keys[participantStat.championId];
    participantStat.stats.itemName0 = participantStat.stats.item0 ? itemData.data[participantStat.stats.item0].name : "";
    participantStat.stats.itemName1 = participantStat.stats.item1 ? itemData.data[participantStat.stats.item1].name : "";
    participantStat.stats.itemName2 = participantStat.stats.item2 ? itemData.data[participantStat.stats.item2].name : "";
    participantStat.stats.itemName3 = participantStat.stats.item3 ? itemData.data[participantStat.stats.item3].name : "";
    participantStat.stats.itemName4 = participantStat.stats.item4 ? itemData.data[participantStat.stats.item4].name : "";
    participantStat.stats.itemName5 = participantStat.stats.item5 ? itemData.data[participantStat.stats.item5].name : "";
    participantStat.stats.itemName6 = participantStat.stats.item6 ? itemData.data[participantStat.stats.item6].name : "";
    const participantTeam = match.teams.find(team => {
      return team.teamId === participantStat.teamId;
    })
    return {
      gameId: match.gameId,
      gameDuration: match.gameDuration,
      participantStat: participantStat,
      participantTeam: participantTeam
    }
  });
}

// create a GET route
app.get('/matches', (req, res) => {
  getAccountId(req.query.name)
    .then(data => {
      getMatches(data.accountId)
        .then(data => {
          const matchPromises = data.matches.map((match) => {
            return getMatch(match.gameId)
          });
          Promise.all(matchPromises).then(matches => {
            res.send({
              matches: formatResult(req.query.name, matches)
            });
          });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
});
