// TODO: Edit the URL to get only 5 issues of Twitter's Chill repo
var requestUrl = 'https://api.github.com/repos/Twitter/Chill/issues?per_page=5';

fetch(requestUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log('Github Repo Issues \n----------');
    console.log(data);
    for ( var i = 0 ; i<5 ; ++i){
      console.log(data[i].url);
      console.log(data[i].user.login);
    };
  });
