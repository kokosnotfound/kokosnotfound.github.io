const flwEl = document.getElementById('follower');

fetch('https://api.github.com/users/kokosnotfound/followers')
  .then(response => response.json())
  .then(data => {
      // print random number between 0 and 10
      let random = Math.floor(Math.random() * data.length);
      flwEl.innerHTML = `
      <img src="${data[random].avatar_url}" class="avatar" width="40" height="40"> <a class="link" href="${data[random].html_url}" target="_blank" rel="noopener noreferrer">${data[random].login}</a><br>
      `
  });
