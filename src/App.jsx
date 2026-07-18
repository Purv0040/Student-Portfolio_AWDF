import React from 'react';

export default function App() {
  const profile = {
    name: "Purv Ughareja",
    title: "Information and Technology (IT)",
    bio: "Passionate Information and Technology student focusing on web technologies, application development, and database systems. Dedicated to creating clean code and exploring new tech stacks.",
    skills: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Python", "Git", "SQL"],
    email: "purv.ughareja.demo@example.com",
    github: "github.com/PurvUghareja",
    linkedin: "linkedin.com/in/purvughareja"
  };

  return (
    <div id="student-profile-container">
      {/* Header (title, name) */}
      <header id="profile-header">
        <h1 id="student-name">{profile.name}</h1>
        <p id="student-title">
          <strong>Title:</strong> {profile.title}
        </p>
      </header>

      <hr />

      {/* About (short bio details) */}
      <section id="profile-about">
        <h2>About</h2>
        <p id="student-bio">{profile.bio}</p>
      </section>

      <hr />

      {/* Skill (list of skill) */}
      <section id="profile-skills">
        <h2>Skills</h2>
        <ul id="skills-list">
          {profile.skills.map((skill) => (
            <li key={skill} id={`skill-item-${skill}`}>
              {skill}
            </li>
          ))}
        </ul>
      </section>

      <hr />

      {/* Footer (contact) */}
      <footer id="profile-footer">
        <h2>Contact</h2>
        <p id="student-contact-email">
          <strong>Email:</strong> <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </p>
        <p id="student-contact-github">
          <strong>GitHub:</strong> <a href={`https://${profile.github}`} target="_blank" rel="noreferrer">{profile.github}</a>
        </p>
        <p id="student-contact-linkedin">
          <strong>LinkedIn:</strong> <a href={`https://${profile.linkedin}`} target="_blank" rel="noreferrer">{profile.linkedin}</a>
        </p>
      </footer>
    </div>
  );
}
