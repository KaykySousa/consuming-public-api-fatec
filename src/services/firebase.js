const { cert, initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const credentials = require('./firebase-credentials.json')

const app = initializeApp({
    credential: cert(credentials)
})

const db = getFirestore(app)

module.exports = db
