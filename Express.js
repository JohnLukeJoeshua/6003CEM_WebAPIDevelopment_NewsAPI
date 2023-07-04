const Record = require('./Connect');
const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');

const apikey = '30f83a24e019442888eec2080ad83df9';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let searchResults = []; // Store the search results
let showMoreClicked = false; // Flag to track if "Show More Results" button is clicked

// Render the initial form
app.get('/', (req, res) => {
  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>News App</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          background-color: maroon;
        }
  
        .container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-gap: 20px;
        }
  
        .box {
          background-color: #fff;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
  
        h1 {
          color: #333;
          font-size: 24px;
          margin-bottom: 20px;
        }
  
        p {
          color: #555;
          font-size: 16px;
          line-height: 1.5;
        }
  
        .form-container {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
  
        .form-container input[type="text"] {
          padding: 10px;
          margin-right: 10px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }
  
        .form-container button {
          padding: 10px 20px;
          background-color: #ffeead;
          color: maroon;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
  
        .results-container {
          margin-top: 20px;
        }
  
        .results-container hr {
          margin: 10px 0;
          border: none;
          border-top: 1px solid #ccc;
        }
  
        .show-more-button {
          margin-top: 20px;
          display: block;
          padding: 10px 20px;
          background-color: #ffeead;
          color: maroon;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
  
        .news-section {
          margin-top: 40px;
        }
  
        .news-section h2 {
          color: #333;
          font-size: 20px;
          margin-bottom: 10px;
        }
  
        .news-section.box {
          padding: 20px;
          background-color: #fff;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
  
        .news-section form {
          margin-top: 10px;
        }
  
        .news-section label {
          display: block;
          color: #555;
          margin-bottom: 5px;
        }
  
        .news-section input[type="text"] {
          padding: 10px;
          border-radius: 5px;
          border: 1px solid #ccc;
          width: 99%;
          margin-bottom: 10px;
        }
  
        .news-section .button {
          padding: 10px 20px;
          background-color: #ffeead;
          color: maroon;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
      </style>
      <script>
        function showMoreResults() {
          document.getElementById('showMoreButton').style.display = 'none';
          window.location.href = '/showMoreResults';
        }
      </script>
    </head>
    <body>
      <div class="container">
        <div class="box">
          <h1>Search for News</h1>
          <div class="form-container">
            <form action="/searchNews" method="post">
              <input type="text" name="title" placeholder="Enter a title" />
              <button type="submit">Search</button>
            </form>
          </div>
        </div>
        <div class="box">
          <h1>News Details</h1>
          <div class="results-container">
            <p>No news articles found for the given title.</p>
          </div>
        </div>
      </div>
  
      <div class="container">
        <div class="news-section box">
          <h2>Delete News</h2>
          <form action="/deleteNews" method="POST">
            <label for="title">Title:</label>
            <input type="text" name="title" id="title" required /><br />
            <input type="submit" class="button" value="Delete News" />
          </form>
        </div>
  
        <div class="news-section box">
          <h2>Fetch ALL News</h2>
          <form action="/fetchAllNews" method="GET">
            <input type="submit" class="button" value="Fetch News" />
          </form>
        </div>
      </div>
    </body>
  </html>
  `;
  
  res.send(html); // Output initial form with title input and submit button
});

// Handle the form submission
app.post('/searchNews', (req, res) => {
  const title = req.body.title;
  const querystr = `https://newsapi.org/v2/everything?q=${encodeURIComponent(title)}&sortBy=publishedAt&apiKey=${apikey}`;

  axios.get(querystr).then((response) => {
    // Extract the news details from the response
    const articles = response.data.articles;

    // Filter articles based on the title
    searchResults = articles.filter(article => {
      const articleTitle = article.title ? article.title.toLowerCase() : '';
      const searchTitle = title ? title.toLowerCase() : '';
      return articleTitle.includes(searchTitle);
    });

    if (searchResults.length > 0) {
      const article = searchResults[0]; // Get the first article

      const Author = article.author || 'N/A';
      const Title = article.title || 'N/A';
      const Description = article.description || 'N/A';
      const Url = article.url || '#';

      const newsValue = new Record({
        newsAuthor: Author,
        newsTitle: Title,
        newsDescription: Description,
        newsUrl: Url,
      });

      newsValue
        .save()
        .then((result) => {
          console.log('Success' + result);
        })
        .catch((error) => {
          console.log('Error' + error);
        });

      const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>News App</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              background-color: maroon;
            }
      
            .container {
              display: grid;
              grid-template-columns: 1fr 1fr;
              grid-gap: 20px;
            }
      
            .box {
              background-color: #fff;
              padding: 20px;
              border-radius: 5px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
      
            h1 {
              color: #333;
              font-size: 24px;
              margin-bottom: 20px;
            }
      
            p {
              color: #555;
              font-size: 16px;
              line-height: 1.5;
            }
      
            .form-container {
              display: flex;
              align-items: center;
              margin-bottom: 20px;
            }
      
            .form-container input[type="text"] {
              padding: 10px;
              margin-right: 10px;
              border-radius: 5px;
              border: 1px solid #ccc;
            }
      
            .form-container button {
              padding: 10px 20px;
              background-color: #ffeead;
              color: maroon;
              border: none;
              border-radius: 5px;
              cursor: pointer;
            }
      
            .results-container {
              margin-top: 20px;
            }
      
            .results-container hr {
              margin: 10px 0;
              border: none;
              border-top: 1px solid #ccc;
            }
      
            .show-more-button {
              margin-top: 20px;
              display: block;
              padding: 10px 20px;
              background-color: #ffeead;
              color: maroon;
              border: none;
              border-radius: 5px;
              cursor: pointer;
            }
          </style>
          <script>
            function showMoreResults() {
              document.getElementById('showMoreButton').style.display = 'none';
              window.location.href = '/showMoreResults';
            }
          </script>
        </head>
        <body>
          <div class="container">
            <div class="box">
              <h1>Search for News</h1>
              <div class="form-container">
                <form action="/searchNews" method="post">
                  <input type="text" name="title" placeholder="Enter a title" />
                  <button type="submit">Search</button>
                </form>
              </div>
            </div>
            <div class="box">
              <h1>News Details</h1>
              <div class="results-container">
                <p><strong>Author:</strong> ${Author}</p>
                <p><strong>Title:</strong> ${Title}</p>
                <p><strong>Description:</strong> ${Description}</p>
                <p><strong>URL:</strong> <a href="${Url}">${Url}</a></p>
                <p>Record saved</p>
              </div>
              <button id="showMoreButton" class="show-more-button" type="button" onclick="showMoreResults()">Show More Results</button>
            </div>
          </div>
        </body>
      </html>      
      `;

      res.send(html); // Output news details
    } else {
      const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>News App</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              background-color: maroon;
            }
      
            .container {
              display: grid;
              grid-template-columns: 1fr 1fr;
              grid-gap: 20px;
            }
      
            .box {
              background-color: #fff;
              padding: 20px;
              border-radius: 5px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
      
            h1 {
              color: #333;
              font-size: 24px;
              margin-bottom: 20px;
            }
      
            p {
              color: #555;
              font-size: 16px;
              line-height: 1.5;
            }
      
            .form-container {
              display: flex;
              align-items: center;
            }
      
            .form-container input[type="text"] {
              padding: 10px;
              margin-right: 10px;
              border-radius: 5px;
              border: 1px solid #ccc;
            }
      
            .form-container button {
              padding: 10px 20px;
              background-color: #ffeead;
              color: maroon;
              border: none;
              border-radius: 5px;
              cursor: pointer;
            }
      
            .results-container {
              margin-top: 20px;
            }
      
            .results-container hr {
              margin: 10px 0;
              border: none;
              border-top: 1px solid #ccc;
            }
      
            .show-more-button {
              margin-top: 20px;
              display: block;
              padding: 10px 20px;
              background-color: #ffeead;
              color: maroon;
              border: none;
              border-radius: 5px;
              cursor: pointer;
            }
          </style>
          <script>
            function showMoreResults() {
              document.getElementById('showMoreButton').style.display = 'none';
              window.location.href = '/showMoreResults';
            }
          </script>
        </head>
        <body>
          <div class="container">
            <div class="box">
              <h1>Search for News</h1>
              <div class="form-container">
                <form action="/searchNews" method="post">
                  <input type="text" name="title" placeholder="Enter a title" />
                  <button type="submit">Search</button>
                </form>
              </div>
            </div>
            <div class="box">
              <h1>News Details</h1>
              <div class="results-container">
                <p>No news articles found for the given title.</p>
              </div>
              <button id="showMoreButton" class="show-more-button" type="button" onclick="showMoreResults()">Show More Results</button>
            </div>
          </div>
        </body>
      </html>      
      `;

      res.send(html); // Output no results message
    }
  }).catch((error) => {
    console.log('Error' + error);
  });
});


// Delete news
app.post('/deleteNews', (req, res) => {
  const title = req.body.title;
  console.log(title);
  Record.deleteOne({ newsTitle: title }, function (err) {
    if (err) return handleError(err);
    // Deleted at most one document
    const message = `${title} deleted successfully.`;
    res.send(`
      <html>
        <head>
          <script>
            window.onload = function() {
              alert('${message}');
              window.history.back();
            }
          </script>
        </head>
        <body></body>
      </html>
    `);
  });
});

// Show more search results
app.get('/showMoreResults', (req, res) => {
  showMoreClicked = true;

  const html = `
  <!DOCTYPE html>
<html>
<head>
  <title>News App</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      background-color: maroon;
    }

    .container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 20px;
    }

    .box {
      background-color: #fff;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    h1 {
      color: #333;
      font-size: 24px;
      margin-bottom: 20px;
    }

    p {
      color: #555;
      font-size: 16px;
      line-height: 1.5;
    }

    .form-container {
      display: flex;
      align-items: center;
    }

    .form-container input[type="text"] {
      padding: 10px;
      margin-right: 10px;
      border-radius: 5px;
      border: 1px solid #ccc;
    }

    .form-container button {
      padding: 10px 20px;
      background-color: #ffeead;
      color: maroon;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    .results-container {
      margin-top: 20px;
    }

    .results-container hr {
      margin: 10px 0;
      border: none;
      border-top: 1px solid #ccc;
    }

    .show-more-button {
      margin-top: 20px;
      display: none;
      padding: 10px 20px;
      background-color: #333;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  </style>
  <script>
    function showMoreResults() {
      document.getElementById('showMoreButton').style.display = 'none';
      window.location.href = '/showMoreResults';
    }
  </script>
</head>
<body>
  <div class="container">
    <div class="box">
      <h1>Search for News</h1>
      <div class="form-container">
        <form action="/searchNews" method="post">
          <input type="text" name="title" placeholder="Enter a title" />
          <button type="submit">Search</button>
        </form>
      </div>
    </div>
    <div class="box">
      <h1>News Details</h1>
      <div class="results-container">
        ${renderSearchResults()}
      </div>
      <button id="showMoreButton" class="show-more-button" type="button" onclick="showMoreResults()">Show More Results</button>
    </div>
  </div>
</body>
</html>  
  `;

  res.send(html); // Output search results with "Show More Results" button
});

// Render the search results
function renderSearchResults() {
  let html = '';

  if (searchResults.length > 0) {
    for (let i = 0; i < searchResults.length; i++) {
      const article = searchResults[i];

      const Author = article.author || 'N/A';
      const Title = article.title || 'N/A';
      const Description = article.description || 'N/A';
      const Url = article.url || '#';

      html += `
        <p><strong>Author:</strong> ${Author}</p>
        <p><strong>Title:</strong> ${Title}</p>
        <p><strong>Description:</strong> ${Description}</p>
        <p><strong>URL:</strong> <a href="${Url}">${Url}</a></p>
        <hr>
      `;
    }
  }

  return html;
}

// Fetch all news
app.get('/fetchAllNews', (req, res) => {
  Record.find({}, (err, news) => {
    if (err) {
      console.log('Error: ' + err);
    } else {
      const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>News App - Fetch All News</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              background-color: maroon;
            }
      
            .container {
              display: grid;
              grid-template-columns: 1fr 1fr;
              grid-gap: 20px;
            }
      
            .box {
              background-color: #fff;
              padding: 20px;
              border-radius: 5px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
      
            h1 {
              color: #333;
              font-size: 24px;
              margin-bottom: 20px;
            }
      
            p {
              color: #555;
              font-size: 16px;
              line-height: 1.5;
            }
      
            .form-container {
              display: flex;
              align-items: center;
            }
      
            .form-container input[type="text"] {
              padding: 10px;
              margin-right: 10px;
              border-radius: 5px;
              border: 1px solid #ccc;
            }
      
            .form-container button {
              padding: 10px 20px;
              background-color: #ffeead;
              color: maroon;
              border: none;
              border-radius: 5px;
              cursor: pointer;
            }
      
            .results-container {
              margin-top: 20px;
            }
      
            .results-container hr {
              margin: 10px 0;
              border: none;
              border-top: 1px solid #ccc;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="box">
              <h1>Search for News</h1>
              <div class="form-container">
                <form action="/searchNews" method="post">
                  <input type="text" name="title" placeholder="Enter a title" />
                  <button type="submit">Search</button>
                </form>
              </div>
            </div>
            <div class="box">
              <h1>All News</h1>
              <div class="results-container">
                ${renderAllNews(news)}
              </div>
            </div>
          </div>
        </body>
      </html>            
      `;
      res.send(html);
    }
  });
});

// Render all news
function renderAllNews(news) {
  let html = '';
  if (news.length > 0) {
    news.forEach((article) => {
      const Author = article.newsAuthor || 'N/A';
      const Title = article.newsTitle || 'N/A';
      const Description = article.newsDescription || 'N/A';
      const Url = article.newsUrl || '#';

      html += `
        <p><strong>Author:</strong> ${Author}</p>
        <p><strong>Title:</strong> ${Title}</p>
        <p><strong>Description:</strong> ${Description}</p>
        <p><strong>URL:</strong> <a href="${Url}">${Url}</a></p>
        <hr>
      `;
    });
  } else {
    html += '<p>No news articles found.</p>';
  }
  return html;
}

app.listen(3000, () => {
  console.log('Server started on port 3000');
});