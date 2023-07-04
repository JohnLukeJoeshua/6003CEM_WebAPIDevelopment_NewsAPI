//const apikey = '30f83a24e019442888eec2080ad83df9';
const mongoose = require ('mongoose');
mongoose.set('strictQuery', false);

const db = "mongodb+srv://Web_API:Web_API@web-api-development.nmbmjnt.mongodb.net/Web_API"

mongoose.connect(db).then(()=>{
    console.log("Connected to database");
})
.catch(()=>{
    console.log("Can't connect to database");
}
)

const newsSchema = new mongoose.Schema({
    newsAuthor: {type: String},
    newsTitle: {type: String},
    newsDescription: {type: String},
    newsUrl: {type: String}
});

const News = mongoose.model('news', newsSchema);

module.exports = News;

//npm install express --save
//npm install axios
//npm install mongoose@6.10.0
//npm install mongodb
//npm install react