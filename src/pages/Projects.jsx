import * as React from 'react';
import { useState, useEffect } from 'react';
import { projectsData } from '../portfolioData';

export default function Projects() {
  // State to hold the list of projects
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

  // State for form inputs
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [github, setGithub] = useState('');
  const [link, setLink] = useState('');

  // UI state for showing project form
  const [showForm, setShowForm] = useState(false);

  // Save projects to localStorage whenever the list changes
  useEffect(() => {
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));
  }, [projects]);

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!title.trim() || !category.trim() || !description.trim()) {
      alert('Please fill out Title, Category, and Description.');
      return;
    }

    // Split tags input by comma and clean whitespace
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

    // Reset form fields & collapse form
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
            Projects Portfolio
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Showcase of engineering prototypes and software applications.
          </p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-neutral-900 hover:bg-neutral-800 text-white transition-all duration-300"
          >
            {showForm ? 'Cancel' : 'New Project'}
          </button>
          
          <button 
            id="reset-proj-list-btn"
            onClick={handleResetProjects}
            className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200/40 transition-all duration-300"
          >
            Reset Defaults
          </button>
        </div>
      </div>

      {/* Form to Add New Project */}
      {showForm && (
        <div 
          id="add-project-box" 
          className="bg-white border border-neutral-200/60 rounded-3xl p-6 shadow-sm flex flex-col gap-5 animate-fadeIn"
        >
          <div>
            <h3 className="font-display font-bold text-lg text-neutral-900">Add New Project</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Introduce a new prototype into your digital showcase.</p>
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

      {/* Render Current List of Projects in a pristine clean visual design */}
      <div id="projects-list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project, idx) => (
          <div 
            key={`${project.title}-${idx}`} 
            id={`project-item-${idx}`} 
            className="bg-white border border-neutral-200/60 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-4 group hover:border-neutral-300 transition-all duration-300"
          >
            <div className="flex flex-col gap-2.5">
              {/* Category Badge & Title */}
              <div className="flex justify-between items-start gap-2">
                <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-neutral-100 text-neutral-500 border border-neutral-200/30">
                  {project.category}
                </span>
              </div>
              
              <h3 className="font-display font-bold text-lg text-neutral-900 group-hover:text-indigo-600 transition-colors">
                {project.title}
              </h3>
              
              <p className="text-neutral-500 text-sm leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              {/* Technologies list as nice custom pill badges */}
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag, tIdx) => (
                  <span 
                    key={tIdx} 
                    className="inline-flex px-2 py-0.5 rounded-lg text-xs font-medium bg-indigo-50/50 text-indigo-700 border border-indigo-100/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Source/Preview Links */}
              <div className="flex gap-4 border-t border-neutral-100 pt-3.5 text-xs sm:text-sm font-semibold">
                {project.github && (
                  <a 
                    href={project.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-neutral-600 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                    </svg>
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
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
