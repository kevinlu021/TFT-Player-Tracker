var express = require('express');
var cors = require('cors');
const axios = require('axios');

var app = express();
let matchList = [], matchData = [];
app.use(cors());

const API_KEY = "RGAPI-11095c66-1523-41d5-b4f0-b254a281312c";

function getPUUID(playerName)
{
    matchData = [];
    return axios.get("https://na1.api.riotgames.com" + "/tft/summoner/v1/summoners/by-name/" + playerName + "?api_key=" + API_KEY)
    .then(response => {
        console.log(response);
        return response.data.puuid;
    }).catch(error =>console.log(error));
}

function getnam(playerName)
{
    matchData = [];
    return axios.get("https://na1.api.riotgames.com" + "/tft/summoner/v1/summoners/by-name/" + playerName + "?api_key=" + API_KEY)
    .then(response => {
        console.log(response);
        return response.data.name;
    }).catch(error =>console.log(error));
}

function getMatchID(API) {
    return axios.get(API)
    .then(response => response.data)
    .catch(err => console.log(err));
}

function getMatchData(API)
{
    return axios.get(API)
    .then(response => {
        // console.log('we pushin')
        matchData.push(response.data.info);
    })
    .catch(err => console.log(err));
}

app.get('/stats', async (req, res) => {


    ////////////////////////////////////////////////////////////////
    //GET PUUID HERE

    const playerName = req.query.username;
    const PUUID = await getPUUID(playerName);
    // console.log(PUUID);
    ////////////////////////////////////////////////////////////////



    ////////////////////////////////////////////////////////////////
    //GET MATCH IDS HERE

    const API_CALL = "https://americas.api.riotgames.com" + "/tft/match/v1/matches/by-puuid/" + PUUID + "/ids" + "?api_key=" + API_KEY;
    const MATCH_ID_DATA = await getMatchID(API_CALL);

    ////////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////////
    //GET MATCH DATA HERE
    for (var i = 0; i < 10 && i < MATCH_ID_DATA.length; i++) {
        changingAPI = "https://americas.api.riotgames.com" + "/tft/match/v1/matches/" + MATCH_ID_DATA[i] + "?api_key=" + API_KEY
        await getMatchData(changingAPI);
    }
    
    // console.log(matchData);
    ////////////////////////////////////////////////////////////////
    res.json(matchData);
});

app.get('/names', async (req, res) => {


    ////////////////////////////////////////////////////////////////
    //GET PUUID HERE

    const playerName2 = req.query.name;
    const PUUID2 = await getPUUID(playerName2);
    res.json(PUUID2);
});

app.get('/names2', async (req, res) => {


    ////////////////////////////////////////////////////////////////
    //GET PUUID HERE

    const playerName2 = req.query.name;
    const name = await getnam(playerName2);
    res.json(name);
});


app.listen(4000, function () {
    console.log('on port 4000')
});