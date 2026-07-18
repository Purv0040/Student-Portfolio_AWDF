import * as React from 'react';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import About from '../components/About';
import Skills from '../components/Skills';
import { studentProfile, skillsData } from '../portfolioData';

export default function Home() {
  const [skills, setSkills] = useState(() => {
    const saved = localStorage.getItem('portfolio_skills');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading skills from localStorage', e);
      }
    }
    return skillsData;
  });

  useEffect(() => {
    localStorage.setItem('portfolio_skills', JSON.stringify(skills));
  }, [skills]);

  const handleAddSkill = (newSkill) => {
    setSkills((prev) => [...prev, newSkill]);
  };

  const handleResetSkills = () => {
    if (window.confirm('Reset skills list to default?')) {
      setSkills(skillsData);
    }
  };

  return (
    <div id="home-page" className="flex flex-col gap-6 sm:gap-8 animate-fadeIn">
      {/* Hero Header Section */}
      <Header name={studentProfile.name} role={studentProfile.role} />
      
      {/* Professional Biography Section */}
      <About bio={studentProfile.bio} />
      
      {/* Skillset & Experience Inventory */}
      <Skills 
        skills={skills} 
        onAddSkill={handleAddSkill} 
        onResetSkills={handleResetSkills} 
      />
    </div>
  );
}
