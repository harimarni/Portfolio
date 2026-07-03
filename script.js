const githubUser = "harimarni";
const projectGrid = document.querySelector("#projectGrid");
const repoStatus = document.querySelector("#repoStatus");
const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

const fallbackRepos = [
  {
    name: "cloud-security-devops-lab",
    description: "AWS DevOps and cloud security lab with Terraform, Docker, Kubernetes, CI/CD, monitoring, and detection workflows.",
    html_url: "https://github.com/harimarni",
    language: "DevOps",
    stargazers_count: 0,
    forks_count: 0,
    updated_at: new Date().toISOString(),
  },
  {
    name: "portfolio",
    description: "Personal Cloud DevOps Engineer portfolio with resume, skills, projects, and contact information.",
    html_url: "https://github.com/harimarni/Portfolio",
    language: "HTML",
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
  if (!projectGrid) return;

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
          <a href="${repo.html_url}" target="_blank" rel="noreferrer">Open project</a>
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

    if (repoStatus) {
      repoStatus.textContent = visibleRepos.length
        ? `Showing ${visibleRepos.length} recent public repositories`
        : "Showing featured project links";
    }
  } catch (error) {
    renderRepos(fallbackRepos);

    if (repoStatus) {
      repoStatus.textContent = "Showing featured project links";
    }
  }
}

function setupRevealAnimations() {
  const sections = document.querySelectorAll(".section, .hero");

  sections.forEach((section) => section.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15 }
  );

  sections.forEach((section) => observer.observe(section));
}

loadGitHubRepos();
setupRevealAnimations();