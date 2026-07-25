import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { projectsData } from '../portfolioData';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Projects() {
  // --- Practical 3: REST API Integration States ---
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Customization & Testing controls for Practical 3
  const [username, setUsername] = useState('PurvUghareja');
  const [useBrokenUrl, setUseBrokenUrl] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // --- Practical 2: Local Projects State ---
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('portfolio_projects');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading projects from localStorage', e);
      }
    }
    return projectsData;
  });

  // Local Project form inputs
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [github, setGithub] = useState('');
  const [link, setLink] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Save local projects to localStorage
  useEffect(() => {
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));
  }, [projects]);

  // --- Practical 3: Fetching GitHub REST API ---
  const fetchRepos = useCallback(() => {
    setLoading(true);
    setError(null);

    // Step 6: Test error path by intentionally using broken URL if toggled
    const targetUrl = useBrokenUrl
      ? 'https://api.github.com/invalid_endpoint_test_404'
      : `https://api.github.com/users/${encodeURIComponent(username.trim() || 'PurvUghareja')}/repos?sort=updated`;

    fetch(targetUrl)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error(`GitHub User or Endpoint "${username}" Not Found (404 Error)`);
          } else if (res.status === 403) {
            throw new Error('GitHub API rate limit exceeded. Please try again later (403 Error)');
          }
          throw new Error(`HTTP network error! Status Code: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setRepos(data);
        } else {
          throw new Error('Received unexpected data format from GitHub API');
        }
      })
      .catch((err) => {
        setError(err.message || 'An unexpected error occurred while fetching repositories.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [username, useBrokenUrl]);

  // Step 2: Trigger fetch on component mount and when username or test mode changes
  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  // Handle local project form submission
  const handleAddProject = (e) => {
    e.preventDefault();
    if (!title.trim() || !category.trim() || !description.trim()) {
      alert('Please fill out Title, Category, and Description.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const newProject = {
      title: title.trim(),
      category: category.trim(),
      description: description.trim(),
      tags: tags.length > 0 ? tags : ['General'],
      github: github.trim() || undefined,
      link: link.trim() || undefined,
    };

    setProjects([newProject, ...projects]);

    setTitle('');
    setCategory('');
    setDescription('');
    setTagsInput('');
    setGithub('');
    setLink('');
    setShowForm(false);
  };

  const handleResetProjects = () => {
    if (window.confirm('Reset project list to default student projects?')) {
      setProjects(projectsData);
    }
  };

  // Supplementary Problem: Search filter for repository list by name
  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div id="projects-page" className="flex flex-col gap-6 sm:gap-8 animate-fadeIn">
      {/* Page Header */}
      <div className="bg-white border border-neutral-200/60 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 
            id="projects-heading" 
            className="font-display font-bold text-xl sm:text-2xl text-neutral-900 flex items-center gap-2"
          >
            <span className="w-1 h-6 rounded bg-indigo-500"></span>
            Projects & GitHub API Integration
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Practical 3 REST API consumer with asynchronous state management & local project catalog.
          </p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-neutral-900 hover:bg-neutral-800 text-white transition-all duration-300"
          >
            {showForm ? 'Cancel Form' : 'Add Local Project'}
          </button>
          
          <button 
            id="reset-proj-list-btn"
            onClick={handleResetProjects}
            className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200/40 transition-all duration-300"
          >
            Reset Local
          </button>
        </div>
      </div>

      {/* --- PRACTICAL 3: GITHUB REST API INTEGRATION SECTION --- */}
      <section className="bg-white border border-neutral-200/60 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100 mb-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
              Practical 3 API Endpoint
            </div>
            <h3 className="font-display font-bold text-lg text-neutral-900">
              Live GitHub Repositories (REST API)
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Fetched dynamically using <code className="font-mono text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">useEffect()</code> from <code className="font-mono text-neutral-700">api.github.com</code>
            </p>
          </div>

          {/* GitHub Username & API Error Tester Controls */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200/80 rounded-xl px-3 py-1.5 flex-1 md:flex-none">
              <span className="text-xs font-semibold text-neutral-400 font-mono">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="GitHub Username"
                className="bg-transparent text-xs font-semibold text-neutral-800 focus:outline-none w-28 sm:w-36"
              />
            </div>

            {/* Test Error Path Toggle Button (Requirement Step 6) */}
            <button
              id="toggle-broken-url-btn"
              onClick={() => setUseBrokenUrl(!useBrokenUrl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                useBrokenUrl
                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-200/60'
              }`}
              title="Test the error path by temporarily breaking the API URL"
            >
              {useBrokenUrl ? '❌ API URL Broken (Test Error)' : '⚡ Break URL (Test Error)'}
            </button>

            <button
              onClick={fetchRepos}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm"
            >
              Refetch API
            </button>
          </div>
        </div>

        {/* Supplementary Requirement: Search input to filter repository list by name */}
        {!loading && !error && repos.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-neutral-50/60 p-3.5 rounded-2xl border border-neutral-200/40">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search repository by name..."
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs font-medium border border-neutral-200 bg-white text-neutral-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <svg className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="text-xs text-neutral-500 font-medium self-end sm:self-center">
              Showing <span className="font-bold text-neutral-800">{filteredRepos.length}</span> of <span className="font-bold text-neutral-800">{repos.length}</span> public repositories
            </div>
          </div>
        )}

        {/* --- CONDITIONAL RENDERING BASED ON API STATE --- */}
        {loading && <Spinner label={`Fetching @${username}'s repositories from GitHub REST API...`} />}

        {!loading && error && <ErrorMessage message={error} onRetry={fetchRepos} />}

        {!loading && !error && (
          <div>
            {filteredRepos.length === 0 ? (
              <div className="p-8 text-center bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-200 text-neutral-500 text-sm">
                No repositories found matching <span className="font-bold">"{searchQuery}"</span> for GitHub user <span className="font-mono text-neutral-800">@{username}</span>.
              </div>
            ) : (
              <div id="github-repos-list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredRepos.map((repo) => (
                  <div
                    key={repo.id}
                    id={`repo-item-${repo.id}`}
                    className="bg-neutral-50/50 hover:bg-white border border-neutral-200/60 hover:border-neutral-300 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all duration-300 shadow-2xs group"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-display font-bold text-base text-neutral-900 group-hover:text-indigo-600 transition-colors line-clamp-1 break-all"
                        >
                          {repo.name}
                        </a>

                        {/* Supplementary Requirement: Star count alongside repository name */}
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60 shrink-0">
                          ⭐ {repo.stargazers_count ?? 0}
                        </div>
                      </div>

                      <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed min-h-[36px]">
                        {repo.description || <span className="italic text-neutral-300">No description provided.</span>}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-2 border-t border-neutral-100">
                      <div className="flex items-center justify-between text-xs text-neutral-400 font-medium">
                        {repo.language && (
                          <span className="inline-flex items-center gap-1.5 font-semibold text-neutral-600">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                            {repo.language}
                          </span>
                        )}
                        <span className="font-mono text-[11px] ml-auto">
                          🍴 {repo.forks_count ?? 0}
                        </span>
                      </div>

                      {/* Required html_url link */}
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-between w-full px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-indigo-600 hover:text-white text-neutral-700 transition-colors"
                      >
                        <span>View on GitHub</span>
                        <span>→</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* --- LOCAL PROJECTS CATALOG (Practical 2) --- */}
      {showForm && (
        <div 
          id="add-project-box" 
          className="bg-white border border-neutral-200/60 rounded-3xl p-6 shadow-sm flex flex-col gap-5 animate-fadeIn"
        >
          <div>
            <h3 className="font-display font-bold text-lg text-neutral-900">Add New Local Project</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Introduce a new custom prototype into your portfolio dataset.</p>
          </div>
          
          <form onSubmit={handleAddProject} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="proj-title" className="text-xs font-semibold text-neutral-600">
                Project Title *
              </label>
              <input
                type="text"
                id="proj-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Smart Irrigation System"
                required
                className="w-full px-3.5 py-2 rounded-xl text-sm border border-neutral-200 bg-white text-neutral-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="proj-category" className="text-xs font-semibold text-neutral-600">
                Category *
              </label>
              <input
                type="text"
                id="proj-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. IoT / Frontend / Full-Stack"
                required
                className="w-full px-3.5 py-2 rounded-xl text-sm border border-neutral-200 bg-white text-neutral-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="proj-desc" className="text-xs font-semibold text-neutral-600">
                Description *
              </label>
              <textarea
                id="proj-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the problem, technologies used, and functional outputs..."
                required
                className="w-full px-3.5 py-2 rounded-xl text-sm border border-neutral-200 bg-white text-neutral-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="proj-tags" className="text-xs font-semibold text-neutral-600">
                Technologies (comma separated)
              </label>
              <input
                type="text"
                id="proj-tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="React, TypeScript, CSS"
                className="w-full px-3.5 py-2 rounded-xl text-sm border border-neutral-200 bg-white text-neutral-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="proj-github" className="text-xs font-semibold text-neutral-600">
                GitHub Repository URL
              </label>
              <input
                type="url"
                id="proj-github"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-3.5 py-2 rounded-xl text-sm border border-neutral-200 bg-white text-neutral-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="proj-link" className="text-xs font-semibold text-neutral-600">
                Live Preview Link
              </label>
              <input
                type="url"
                id="proj-link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://example.com/..."
                className="w-full px-3.5 py-2 rounded-xl text-sm border border-neutral-200 bg-white text-neutral-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="md:col-span-2 mt-2">
              <button
                type="submit"
                id="add-proj-submit-btn"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/10"
              >
                Add Project
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Render Current List of Local Projects */}
      <section className="bg-white border border-neutral-200/60 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
        <div>
          <h3 className="font-display font-bold text-lg text-neutral-900">
            Custom Projects (Local State)
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manually curated project items saved in browser LocalStorage.
          </p>
        </div>

        <div id="projects-list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project, idx) => (
            <div 
              key={`${project.title}-${idx}`} 
              id={`project-item-${idx}`} 
              className="bg-neutral-50/50 border border-neutral-200/60 rounded-3xl p-6 shadow-2xs flex flex-col justify-between gap-4 group hover:border-neutral-300 transition-all duration-300"
            >
              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-start gap-2">
                  <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-white text-neutral-500 border border-neutral-200/60">
                    {project.category}
                  </span>
                </div>
                
                <h4 className="font-display font-bold text-base text-neutral-900 group-hover:text-indigo-600 transition-colors">
                  {project.title}
                </h4>
                
                <p className="text-neutral-500 text-xs leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="flex flex-col gap-4 mt-2">
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag, tIdx) => (
                    <span 
                      key={tIdx} 
                      className="inline-flex px-2 py-0.5 rounded-lg text-[11px] font-medium bg-indigo-50/60 text-indigo-700 border border-indigo-100/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 border-t border-neutral-200/60 pt-3.5 text-xs font-semibold">
                  {project.github && (
                    <a 
                      href={project.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-neutral-600 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                    >
                      Source Code
                    </a>
                  )}
                  
                  {project.link && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors ml-auto"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
