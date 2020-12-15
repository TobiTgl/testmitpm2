const express = require('express')
const app = express()
const port = 4000
const db = require('./database')
const bodyParser = require('body-parser')
const cors = require('cors');
const axios = require('axios');
//const jsonImport = require('./jsonAPIData')

var CronJob = require('cron').CronJob;

const Pool = require('pg').Pool

app.use(cors());
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

const pool = new Pool({
  user: 'netuser',
  host: 'localhost',
  database: 'postgres',
  password: 'netpass',
  port: 5432,
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/matches', db.getMatches)

let jsonMas = null;

let one = 'https://api.pandascore.co/lol/matches?token=6W1WQp6WMqtt7LmweMkgLv6YyoUMhauuKE1ABezjHsFPD1GNU6U'
let two = 'https://api.pandascore.co/csgo/matches?token=6W1WQp6WMqtt7LmweMkgLv6YyoUMhauuKE1ABezjHsFPD1GNU6U'

const requestOne = axios.get(one);
const requestTwo = axios.get(two);

axios.all([requestOne, requestTwo]).then(axios.spread((...responses) => {
  const responseOne = responses[0].data
  const responseTwo = responses[1].data
  
})).catch(errors => {
  // react on errors.
})



var job = new CronJob('0 */1 * * * *', function(){
//'0 */1 * * * *'

console.log('test') 

axios.all([requestOne, requestTwo]).then(axios.spread((...responses) => {
  const jsonMas = responses[0].data
  const csgoData = responses[1].data

/*axios.get('https://api.pandascore.co/csgo/matches?token=6W1WQp6WMqtt7LmweMkgLv6YyoUMhauuKE1ABezjHsFPD1GNU6U')//this is a promise object
.then((response) => { //javascrip promise --then
  jsonMas = response.data*/

for (x = 0; x<jsonMas.length; x++) {

  let begin_at = jsonMas[x].begin_at
  let end_at = jsonMas[x].end_at
  let league_id = jsonMas[x].league_id
  let tournament_id = jsonMas[x].tournament_id
  let match_type = jsonMas[x].match_type
  let winner_id = jsonMas[x].winner_id
  let serie_id = jsonMas[x].serie_id
  let number_of_games = jsonMas[x].number_of_games
  let official_stream_url = jsonMas[x].official_stream_url
  let match_id = jsonMas[x].id
  let match_name = jsonMas[x].name
  let videogame_id = jsonMas[x].videogame.id
  let videogame_name = jsonMas[x].videogame.name

  let league_name = jsonMas[x].league.name
  let league_url = jsonMas[x].league.url
  let league_image_url = jsonMas[x].league.image_url

  let serie_begin_at = jsonMas[x].serie.begin_at
  let serie_end_at = jsonMas[x].serie.end_at
  let serie_full_name = jsonMas[x].serie.full_name
  let serie_name = jsonMas[x].serie.name
  let serie_tier = jsonMas[x].serie.tier
  let serie_winner_id = jsonMas[x].serie.winner_id
  let serie_year = jsonMas[x].serie.year

  let tournament_begin_at = jsonMas[x].tournament.begin_at
  let tournament_end_at = jsonMas[x].tournament.end_at
  //let tournament_id = jsonMas[x].tournament.id
  let tournament_prizepool = jsonMas[x].tournament.prizepool
  let tournament_name = jsonMas[x].tournament.name

  for (y = 0; y<jsonMas[x].opponents.length-1; y++) {
    let match_team1_id = jsonMas[x].opponents[y].opponent.id
    let match_team2_id = jsonMas[x].opponents[y+1].opponent.id

//Match query

    pool.query('INSERT INTO match(match_id, videogame_id, name, match_type, tournament_id, serie_id, team1_id, team2_id, league_id, number_of_games, winner_id, begin_at, end_at, official_stream_url) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) ON CONFLICT (match_id) DO UPDATE SET match_id= excluded.match_id, videogame_id= excluded.videogame_id, name= excluded.name, match_type= excluded.match_type, tournament_id= excluded.tournament_id, serie_id= excluded.serie_id, team1_id= excluded.team1_id, team2_id= excluded.team2_id, league_id= excluded.league_id, number_of_games= excluded.number_of_games, winner_id= excluded.winner_id, begin_at= excluded.begin_at, end_at= excluded.end_at, official_stream_url= excluded.official_stream_url' , [match_id, videogame_id, match_name, match_type, tournament_id, serie_id, match_team1_id, match_team2_id, league_id, number_of_games, winner_id, begin_at, end_at, official_stream_url], (error, results) => {
      if (error) { //ON CONFLICT (match_id) DO NOTHING 
        throw error
      }
    })

//Leagues query

    pool.query('INSERT INTO leagues(league_id, image_url, name, url) VALUES($1, $2, $3, $4) ON CONFLICT (league_id) DO UPDATE SET league_id=excluded.league_id, image_url=excluded.image_url, name=excluded.name, url=excluded.url', [league_id, league_image_url, league_name, league_url], (error, results) => {
      if (error) {
        throw error
      }
    })

//Tournaments query

    pool.query('INSERT INTO tournaments(begin_at, end_at, tournament_id, league_id, prizepool, serie_id, name, winner_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (tournament_id) DO UPDATE SET begin_at=excluded.begin_at, end_at=excluded.end_at, tournament_id=excluded.tournament_id, league_id=excluded.league_id, prizepool=excluded.prizepool, serie_id=excluded.serie_id, name=excluded.name, winner_id=excluded.winner_id', [tournament_begin_at, tournament_end_at, tournament_id, league_id, tournament_prizepool, serie_id, tournament_name, winner_id], (error, results) => {
      if (error) {
        throw error
      }
    })

//series query

    pool.query('INSERT INTO series(serie_id, begin_at, end_at, full_name, league_id, name, tier, winner_id, year) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (serie_id) DO UPDATE SET serie_id=excluded.serie_id, begin_at=excluded.begin_at, end_at=excluded.end_at, full_name=excluded.full_name, league_id=excluded.league_id, name=excluded.name, tier=excluded.tier, winner_id=excluded.winner_id, year=excluded.year', [serie_id, serie_begin_at, serie_end_at, serie_full_name, league_id, serie_name, serie_tier, serie_winner_id, serie_year], (error, results) => {
      if (error) {
        throw error
      }
    })
//videogame query

/*
    pool.query('INSERT INTO videogame(name) VALUES($1)ON CONFLICT (name) DO NOTHING' , [videogame_name], (error, results) => {
      if (error) {
        throw error
      }
    })
*/
  }
  for (y = 0; y<jsonMas[x].opponents.length; y++) {
    

    let team1_id = jsonMas[x].opponents[y].opponent.id
    let team1_name = jsonMas[x].opponents[y].opponent.name
    let team1_acronym = jsonMas[x].opponents[y].opponent.acronym
    let team1_imageUrl = jsonMas[x].opponents[y].opponent.image_url
    let team1_location = jsonMas[x].opponents[y].opponent.location
  
    //Teams query

    pool.query('INSERT INTO team(team_id, name, acronym, image_url, location) VALUES($1, $2, $3, $4, $5) ON CONFLICT (team_id) DO UPDATE SET team_id=excluded.team_id, name=excluded.name, acronym=excluded.acronym, image_url=excluded.image_url, location=excluded.location', [team1_id, team1_name, team1_acronym, team1_imageUrl, team1_location], (error, results) => {
      if (error) {
        throw error
      }
    })
  }
  for (y = 0; y<jsonMas[x].games.length; y++) {
    let game_id = jsonMas[x].games[y].id
    let game_begin_at = jsonMas[x].games[y].begin_at
    let game_end_at = jsonMas[x].games[y].end_at
    let game_complete = jsonMas[x].games[y].complete
    let game_finished = jsonMas[x].games[y].finished
    let game_length = jsonMas[x].games[y].length
    let game_position = jsonMas[x].games[y].position
    let game_status = jsonMas[x].games[y].status
    let game_winner_id = jsonMas[x].games[y].winner.id
    
//games query

    pool.query('INSERT INTO games(game_id, match_id, begin_at, end_at, complete, finished, length, position, status, winner_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (game_id) DO UPDATE SET game_id=excluded.game_id, match_id=excluded.match_id, begin_at=excluded.begin_at, end_at=excluded.end_at, complete=excluded.complete, finished=excluded.finished, length=excluded.length, position=excluded.position, status=excluded.status, winner_id=excluded.winner_id', [game_id, match_id, game_begin_at, game_end_at, game_complete, game_finished, game_length, game_position, game_status, game_winner_id], (error, results) => {
      if (error) {
        throw error
      }
    })  
  } 
  
}


for (x = 0; x<csgoData.length; x++) {
  

    let begin_at = csgoData[x].begin_at
    let end_at = csgoData[x].end_at
    let league_id = csgoData[x].league_id
    let tournament_id = csgoData[x].tournament_id
    let match_type = csgoData[x].match_type
    let winner_id = csgoData[x].winner_id
    let serie_id = csgoData[x].serie_id
    let number_of_games = csgoData[x].number_of_games
    let official_stream_url = csgoData[x].official_stream_url
    let match_id = csgoData[x].id
    let match_name = csgoData[x].name
    let videogame_id = csgoData[x].videogame.id
    let videogame_name = csgoData[x].videogame.name
  
    let league_name = csgoData[x].league.name
    let league_url = csgoData[x].league.url
    let league_image_url = csgoData[x].league.image_url
  
    let serie_begin_at = csgoData[x].serie.begin_at
    let serie_end_at = csgoData[x].serie.end_at
    let serie_full_name = csgoData[x].serie.full_name
    let serie_name = csgoData[x].serie.name
    let serie_tier = csgoData[x].serie.tier
    let serie_winner_id = csgoData[x].serie.winner_id
    let serie_year = csgoData[x].serie.year
  
    let tournament_begin_at = csgoData[x].tournament.begin_at
    let tournament_end_at = csgoData[x].tournament.end_at
    //let tournament_id = jsonMas[x].tournament.id
    let tournament_prizepool = csgoData[x].tournament.prizepool
    let tournament_name = csgoData[x].tournament.name
  
    for (y = 0; y<csgoData[x].opponents.length-1; y++) {
      let match_team1_id = csgoData[x].opponents[y].opponent.id
      let match_team2_id = csgoData[x].opponents[y+1].opponent.id
  
  //Match query
  
      pool.query('INSERT INTO match(match_id, videogame_id, name, match_type, tournament_id, serie_id, team1_id, team2_id, league_id, number_of_games, winner_id, begin_at, end_at, official_stream_url) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) ON CONFLICT (match_id) DO UPDATE SET match_id= excluded.match_id, videogame_id= excluded.videogame_id, name= excluded.name, match_type= excluded.match_type, tournament_id= excluded.tournament_id, serie_id= excluded.serie_id, team1_id= excluded.team1_id, team2_id= excluded.team2_id, league_id= excluded.league_id, number_of_games= excluded.number_of_games, winner_id= excluded.winner_id, begin_at= excluded.begin_at, end_at= excluded.end_at, official_stream_url= excluded.official_stream_url', [match_id, videogame_id, match_name, match_type, tournament_id, serie_id, match_team1_id, match_team2_id, league_id, number_of_games, winner_id, begin_at, end_at, official_stream_url], (error, results) => {
        if (error) { //ON CONFLICT (match_id) DO NOTHING 
          throw error
        }
      })
  
  //Leagues query
  
      pool.query('INSERT INTO leagues(league_id, image_url, name, url) VALUES($1, $2, $3, $4) ON CONFLICT (league_id) DO UPDATE SET league_id=excluded.league_id, image_url=excluded.image_url, name=excluded.name, url=excluded.url', [league_id, league_image_url, league_name, league_url], (error, results) => {
        if (error) {
          throw error
        }
      })
  
  //Tournaments query
  
      pool.query('INSERT INTO tournaments(begin_at, end_at, tournament_id, league_id, prizepool, serie_id, name, winner_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (tournament_id) DO UPDATE SET begin_at=excluded.begin_at, end_at=excluded.end_at, tournament_id=excluded.tournament_id, league_id=excluded.league_id, prizepool=excluded.prizepool, serie_id=excluded.serie_id, name=excluded.name, winner_id=excluded.winner_id', [tournament_begin_at, tournament_end_at, tournament_id, league_id, tournament_prizepool, serie_id, tournament_name, winner_id], (error, results) => {
        if (error) {
          throw error
        }
      })
  
  //series query
  
      pool.query('INSERT INTO series(serie_id, begin_at, end_at, full_name, league_id, name, tier, winner_id, year) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (serie_id) DO UPDATE SET serie_id=excluded.serie_id, begin_at=excluded.begin_at, end_at=excluded.end_at, full_name=excluded.full_name, league_id=excluded.league_id, name=excluded.name, tier=excluded.tier, winner_id=excluded.winner_id, year=excluded.year', [serie_id, serie_begin_at, serie_end_at, serie_full_name, league_id, serie_name, serie_tier, serie_winner_id, serie_year], (error, results) => {
        if (error) {
          throw error
        }
      })
  //videogame query
  
  /*
      pool.query('INSERT INTO videogame(name) VALUES($1)ON CONFLICT (name) DO NOTHING' , [videogame_name], (error, results) => {
        if (error) {
          throw error
        }
      })
  */
    }
    for (y = 0; y<csgoData[x].opponents.length; y++) {
      
  
      let team1_id = csgoData[x].opponents[y].opponent.id
      let team1_name = csgoData[x].opponents[y].opponent.name
      let team1_acronym = csgoData[x].opponents[y].opponent.acronym
      let team1_imageUrl = csgoData[x].opponents[y].opponent.image_url
      let team1_location = csgoData[x].opponents[y].opponent.location
    
      //Teams query
  
      pool.query('INSERT INTO team(team_id, name, acronym, image_url, location) VALUES($1, $2, $3, $4, $5) ON CONFLICT (team_id) DO UPDATE SET team_id=excluded.team_id, name=excluded.name, acronym=excluded.acronym, image_url=excluded.image_url, location=excluded.location', [team1_id, team1_name, team1_acronym, team1_imageUrl, team1_location], (error, results) => {
        if (error) {
          throw error
        }
      })
    }
    for (y = 0; y<csgoData[x].games.length; y++) {
      let game_id = csgoData[x].games[y].id
      let game_begin_at = csgoData[x].games[y].begin_at
      let game_end_at = csgoData[x].games[y].end_at
      let game_complete = csgoData[x].games[y].complete
      let game_finished = csgoData[x].games[y].finished
      let game_length = csgoData[x].games[y].length
      let game_position = csgoData[x].games[y].position
      let game_status = csgoData[x].games[y].status
      let game_winner_id = csgoData[x].games[y].winner.id
      
  //games query
  
      pool.query('INSERT INTO games(game_id, match_id, begin_at, end_at, complete, finished, length, position, status, winner_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (game_id) DO UPDATE SET game_id=excluded.game_id, match_id=excluded.match_id, begin_at=excluded.begin_at, end_at=excluded.end_at, complete=excluded.complete, finished=excluded.finished, length=excluded.length, position=excluded.position, status=excluded.status, winner_id=excluded.winner_id', [game_id, match_id, game_begin_at, game_end_at, game_complete, game_finished, game_length, game_position, game_status, game_winner_id], (error, results) => {
        if (error) {
          throw error
        }
      })  
    } 
    
  }
})).catch(errors => {
  console.log(errors)
})
} , null, true, 'America/Los_Angeles');
job.start();

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})