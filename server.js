import "dotenv/config"
import nunjucks from "nunjucks"
import express from "express"
import pool from "./db.js"

const app = express()
const port = 3000

nunjucks.configure("views", {
    autoescape: true,
    express: app,
})

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



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
