const latestEl = document.getElementById('latest');

fetch('https://api.github.com/users/kokosnotfound/events/public')
  .then(response => response.json())
  .then(data => {
      let created = new Date(data[0].created_at) 

      latestEl.innerHTML = `<img src="${data[0].actor.avatar_url}" class="avatar" width="40" height="40" style="vertical-align: middle;"> ${data[0].actor.login}<br>
      ${data[0].type}
      <br>${data[0].repo.name}
      <br>${created.getDate()}/${created.getMonth() + 1}/${created.getFullYear()} ${created.getHours()}:${created.getMinutes()}:${created.getSeconds()}`
  });