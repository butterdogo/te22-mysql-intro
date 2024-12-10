import "dotenv/config"
import nunjucks from "nunjucks"
import express from "express"
import pool from "./db.js"
import morgan from "morgan"
import bodyParser from "body-parser"

const app = express()
const port = 3000

nunjucks.configure("views", {
    autoescape: true,
    express: app,
})


app.use(morgan("dev"))
app.use(bodyParser.urlencoded({extenden: true}));
app.use(bodyParser.json());

app.use(express.static("public"))

app.get("/birds", async (req, res) => {
    // const [birds] = await pool.promise().query('SELECT * FROM birds')
    const [birds] = await pool
        .promise()
        .query(
            "SELECT birds.*, species.name AS species FROM birds JOIN species ON birds.species_id = species.id;",
        )
        res.render("birds.njk", {
            birds
        })
})

app.get("/birds/:id", async (req, res) => {
    const [bird] = await pool
        .promise()
        .query(
            "SELECT birds.*, species.name AS species FROM birds JOIN species ON birds.species_id = species.id WHERE birds.id = ?;",
            [req.params.id],
        )
    res.render("bird.njk", {
        bird:bird[0]
    })
    console.log(bird)
})

app.get("/birds_form", async (req, res) => {
    const [species] = await pool.promise().query('SELECT * FROM species')
    
res.render('birds_form.njk', {
        species,
        title: "New bird"
    })
})

app.get("/species_form", async (req, res) => {

    res.render('species_form.njk', {
    
    })
})
app.get('/birds/new', async (req, res) => {
    const [species] = await pool.promise().query('SELECT * FROM species')
  
    res.render('birds_form.njk', { species })
})

app.post('/species', async (req, res) => {
    const { name, latin, wingspan_min, wingspan_max } = req.body
  
    const [result] = await pool.promise().query('INSERT INTO species (name, latin, wingspan_min, wingspan_max) VALUES (?, ?, ?, ?)', [name, latin, wingspan_min, wingspan_max])
  
    res.render('newspecies.njk', {

    })
  })

app.get('/birds/new', async (req, res) => {
  const [species] = await pool.promise().query('SELECT * FROM species')

  res.render('birds_form.njk', { species })
})

app.post('/birds', async (req, res) => {
  console.log(req.body)
  const { name, wingspan, species_id } = req.body

  const [result] = await pool.promise().query('INSERT INTO birds (name, wingspan, species_id) VALUES (?, ?, ?)', [name, wingspan, species_id])

  res.json(result)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
