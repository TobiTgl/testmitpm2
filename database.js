const Pool = require('pg').Pool

const pool = new Pool({
  user: 'netuser',
  host: 'localhost',
  database: 'postgres',
  password: 'netpass',
  port: 5432,
})

const getMatches = (request, response) => {
    pool.query('SELECT * FROM apidata', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const insertMaches = (request, response) => {

    console.log(request.body)
    const { id, dateum, opponentone, opponenttwo, opponentonescore, opponenttwoscore} = request.body
  
    pool.query('INSERT INTO public.apidata(id, dateum, opponentone, opponenttwo, opponentonescore, opponenttwoscore) VALUES($1, $2, $3, $4, $5, $6)', [id, dateum, opponentone, opponenttwo, opponentonescore, opponenttwoscore], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Match added with ID: ${results.id}`)
    })
  }
  

module.exports = {
  getMatches,
  insertMaches
};