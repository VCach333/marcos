if(process.env.PORT) {
    module.exports = {MongoURI: "mongodb+srv://alphaavatarvladmircach:112358@cluster0.06hvb3w.mongodb.net/marcos"}
} else {
    module.exports = {MongoURI: "mongodb://localhost/marcos"}
}