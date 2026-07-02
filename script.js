const githubUser = "harimarni";
const projectGrid = document.querySelector("#projectGrid");
const repoStatus = document.querySelector("#repoStatus");
const year = document.querySelector("#year");

year.textContent = new Date().getFullYear();

const fallbackRepos = [
  {
    name: "portfolio",
    description: "Personal portfolio site with GitHub project cards and professional profile links.",
    html_url: "https://github.com/harimarni",
    language: "HTML",
    stargazers_count: 0,
    forks_count: 0,
    updated_at: new Date().toISOString(),
  },
  {
    name: "github-projects",
    description: "A curated view of public repositories from the harimarni GitHub profile.",
    html_url: "https://github.com/harimarni?tab=repositories",
    language: "JavaScript",
    stargazers_count: 0,
    forks_count: 0,
    updated_at: new Date().toISOString(),
  },
  {
    name: "resume-profile",
    description: "Professional profile page linking resume highlights, GitHub, and LinkedIn.",
    html_url: "https://www.linkedin.com/in/harikrishnamarni/",
    language: "CSS",
    stargazers_count: 0,
    forks_count: 0,
    updated_at: new Date().toISOString(),
  },
];

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

function renderRepos(repos) {
  projectGrid.innerHTML = repos
    .map((repo) => {
      const description = repo.description || "Project details are available in the GitHub repository.";
      const language = repo.language || "Code";

      return `
        <article class="project-card">
          <h3>${repo.name}</h3>
          <p>${description}</p>
          <div class="repo-meta">
            <span>${language}</span>
            <span>${repo.stargazers_count} stars</span>
            <span>${repo.forks_count} forks</span>
            <span>Updated ${formatDate(repo.updated_at)}</span>
          </div>
          <a href="${repo.html_url}" target="_blank">Open project</a>
        </article>
      `;
    })
    .join("");
}

async function loadGitHubRepos() {
  try {
    const response = await fetch(`https://api.github.com/users/${githubUser}/repos?sort=updated&per_page=6`);

    if (!response.ok) {
      throw new Error("GitHub repositories could not be loaded.");
    }

    const repos = await response.json();
    const visibleRepos = repos.filter((repo) => !repo.fork).slice(0, 6);

    renderRepos(visibleRepos.length ? visibleRepos : fallbackRepos);
    repoStatus.textContent = visibleRepos.length
      ? `Showing ${visibleRepos.length} recent public repositories`
      : "Showing featured project links";
  } catch (error) {
    renderRepos(fallbackRepos);
    repoStatus.textContent = "Showing featured project links";
  }
}

loadGitHubRepos();
