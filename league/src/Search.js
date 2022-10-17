import React, { useState } from 'react'
import axios from 'axios'
import { traits } from './traits.js'
import { units } from './units.js'
import './trait.css';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import SendIcon from '@mui/icons-material/Send';
import {colors} from './color.js'
// import './app.css';


const onFormSubmit = e => {
  e.preventDefault();
  // send state to server with e.g. `window.fetch`
}



export default function Search() {
  

  // console.log(Traits['Set_7_])
  const [playerName, setPlayerName] = useState('');
  const [playerName2, setPlayerName2] = useState(''); //name that doesnt change when you re-search
  const [stats, setStats] = useState([]);
  const [show, setShow] = useState(false);
  const [noGames, setNoGames] = useState(false);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState('')
  
  function compare( a, b ) {
    if ( a.placement < b.placement ){
      return -1;
    }
    if ( a.placement > b.placement ){
      return 1;
    }
    return 0;
  }

  function trait_compare( a, b ) {
    if ( a.style > b.style ){
      return -1;
    }
    if ( a.style < b.style ){
      return 1;
    }
    return 0;
  }

  function searchForPlayer()
  { 

    axios.get('http://localhost:4000/names', {params: {name: playerName}})
    .then(function(response)
    {
      setId(response.data)

    })
    .catch(err => {
      console.log(err)
    })

    axios.get('http://localhost:4000/names2', {params: {name: playerName}})
    .then(function(response)
    {
      console.log(response)
      setPlayerName2(response.data)

    })
    .catch(err => {
      console.log(err)
    })

    if (playerName == '') return; 
    setLoading(true);
    setPlayerName2([...playerName]);
    setShow(false)
    axios.get('http://localhost:4000/stats', {params: {username: playerName}})
    .then(function(response)
    {
        if(response.data.length > 0)
        {
          setLoading(false);
          console.log(response.data)
          for (var i = 0; i < response.data.length; i++)
          {
            ////do the states to hide the games
            
            response.data[i].participants.sort( compare );
            for (var j = 0; j < 8; j++){
              response.data[i].participants[j].traits.sort( trait_compare)
            }
          }
          setStats((response.data));
          setNoGames(false);
          setShow(true);
        }
        else 
        {
          setLoading(false)
          setShow(false);
          setNoGames(true);
          
        }
    })
    .catch(err => {
      setLoading(false)
        console.log(err);
    });

  }


  return (
    <>
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '50ch'},
      }}
      noValidate
      spellcheck="false"
      autoComplete="off"
      className = 'center'
      onSubmit = {onFormSubmit}
    >
      <div>
        <TextField
          id="outlined-textarea"
          spellcheck="false"
          label="Search any NA player"
          placeholder=""
          size="medium"
          onChange = {e => setPlayerName(e.target.value)}
        />
        <IconButton type = 'submit' color="primary" aria-label="search" onClick = {searchForPlayer}>
          <SearchIcon sx={{ fontSize: 55 }} />
        </IconButton>
      </div>
      
    </Box>
        {(playerName2 != '') && show && !loading ? <h1>{playerName2}'s Stats</h1> : <></>}
        {show ? stats.map((data, index) =>
        <>
          <Button>Game #{index+1}{data.tft_game_type == "pairs" ? ": Doubles" : ""}</Button>
          {data.participants.map((data2, index2) => 
          <>
            {data2.puuid == id ? <p><b>YOU</b></p> : data.tft_game_type == "pairs" ? <p>Team #{Math.floor((index2+2)/2)}</p> : <p>Player #{index2+1}:</p>}
            <div>
            {data2.traits.map((data3, index3) =>
              <div className = 'parent'> 
              { data3.style != 0 ?
                <>
                  <img className = "circle" src = {data3.style == 1 ? colors["Bronze"] : data3.style == 2 ? colors["Silver"] : data3.style == 3 ? colors["Gold"] : colors["Prismatic"]} alt = "bronze"></img>
                  <img className = "trait" src = {traits[(data3.name)]} alt = {data3.name}></img>
                </> : <></>
              }
                  
              </div>
            )}
            </div>
            <div>
            {data2.units.map((data3, index3) => 
              <div className = 'text-center'>
                <div className = 'stars' >{data3.tier == 1 ? '⭐' : data3.tier == 2 ? '⭐⭐' : data3.tier == 3 ? '⭐⭐⭐' : <></>}</div>
                <img className = "unit" style = {data3.rarity==7 ? {border: "2px solid #f98c5e"} : data3.rarity == 6 ? {border: "2px solid #feb93b"} : data3.rarity == 5 ? {border: "2px solid #c441da"} : data3.rarity == 4 ? {border: "2px solid #c441da"} : data3.rarity == 3 ? {border: "2px solid #c441da"} : data3.rarity == 2 ? {border: "2px solid #217ac7"} : data3.rarity == 1 ? {border: "2px solid #14b188"} : {border: "2px solid #808080"}} src = {units[(data3.character_id)]} alt = {data3.character_id}></img>
              </div>
            )}
            </div>
          </>
          )

          
            }</>
        )
         : <></>}
        {noGames ? <h1>error</h1> : <></>}
        {loading ? 
        <Box className = 'absolute-center' sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box> : <></>}
    </>
    
  )
}
