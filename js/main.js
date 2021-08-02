const reposEl = document.querySelector('.github-cards');

function fetchRepos() {
    fetch("https://gh-pinned-repos-5l2i19um3.vercel.app/?username=kokosnotfound").then(response => {
        if (!response.ok) {
            throw Error("Error while loading repositories");
        }
        return response.json();
    }).then(data => {
        const pinned = data.map(repo => {
            return `
            <a href="${repo.link}" class="github-card">
            <h3>${repo.repo}</h3>
            <p>${repo.description}</p>
            <span class="github-card__meta">
              <span style="color: #4078c0;">●</span> ${repo.language}
            </span>
            <span class="github-card__meta">
              <i class="fa fa-star" aria-hidden="true"></i>
              ${repo.stars}
            </span>
            <span class="github-card__meta">
              <i class="fa fa-code-branch" aria-hidden="true"></i>
              ${repo.forks}
            </span>
          </a>
            `;
        }).join(' ')

        reposEl.insertAdjacentHTML("afterbegin", pinned)
    })
}

fetchRepos()
