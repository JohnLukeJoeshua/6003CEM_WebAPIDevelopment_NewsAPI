const axios = require('axios');

const apikey = '30f83a24e019442888eec2080ad83df9';
const title = 'Water Crisis';

const querystr = `https://newsapi.org/v2/everything?q=${encodeURIComponent(title)}&sortBy=publishedAt&apiKey=${apikey}`;

axios.get(querystr).then((response) => {
  const articles = response.data.articles;

  // Filter articles based on the title
  const filteredArticles = articles.filter(article => article.title.toLowerCase().includes(title.toLowerCase()));

  if (filteredArticles.length > 0) {
    const firstArticle = filteredArticles[0];

    // Print information for the first matching article
    console.log(firstArticle.author);
    console.log(firstArticle.title);
    console.log(firstArticle.description);
    console.log(firstArticle.url);
  } else {
    console.log('No articles found matching the title.');
  }
}).catch((error) => {
  console.log(error);
});