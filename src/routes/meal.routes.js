const express = require("express")
const db = require("../services/firebase.js")

const router = express.Router()

router.get("/", async (req, res) => {
    const mealsRes = await fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    const mealsData = await mealsRes.json()
	const meal = mealsData.meals[0]

	const ingredients = []
	for (let index = 1; index <= 20; index++) {
		const ingredient = meal[`strIngredient${index}`]
		const measure = meal[`strMeasure${index}`]

		if (!ingredient || !measure) continue

		ingredients.push({
			name: ingredient,
			measure,
		})
	}

	meal.ingredients = ingredients
	meal.favorite = false

    res.render("index", { meal })
})

router.get("/favorites", async (req, res) => {
	const snapshot = await db.collection("favorites").get()

	const favorites = snapshot.docs.map(doc => {
		return JSON.parse(doc.data().meal)
	})

	return res.render("favorites", { favorites })
})

router.get("/favorites/:id", async (req, res) => {
	const id = req.params.id
	const doc = await db.collection("favorites").doc(id).get()
	const meal = {
		...JSON.parse(doc.data().meal),
		favorite: true,
	}

	return res.render("index", { meal })
})

router.delete("/favorites/:id", async (req, res) => {
	const id = req.params.id
	const doc = await db.collection("favorites").doc(id).delete();
	
	return res.status(200).json(doc)
})

router.post("/favorites", async (req, res) => {
	const meal = req.body

	const doc = await db.collection("favorites").doc(meal.idMeal).set({
		meal: JSON.stringify(meal)
	})

	return res.status(201).json(doc)
})

module.exports = router
