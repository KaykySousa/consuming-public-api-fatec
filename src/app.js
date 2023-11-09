const express = require("express")
const bodyParser = require("body-parser")
const handlebars = require("express-handlebars")
const mealRoutes = require("./routes/meal.routes.js")

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(__dirname + "/styles"))

const hbs = handlebars.create({
    helpers: {
        json: function (obj) {
            return JSON.stringify(obj)
        }
    },
    extname: "hbs"
})

app.engine("hbs", hbs.engine)
app.set("view engine", "hbs")
app.set("views", __dirname + "/views")

app.use(mealRoutes)

module.exports = app