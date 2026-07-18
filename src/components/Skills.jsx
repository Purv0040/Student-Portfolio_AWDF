import * as React from 'react';
import { useState } from 'react';

export default function Skills({ skills, onAddSkill, onResetSkills }) {
  // Form input state variables
  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [level, setLevel] = useState(80);
  const [yearsOfExp, setYearsOfExp] = useState('');

  // UI state to toggle form visibility
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!skillName.trim() || !yearsOfExp.trim()) {
      alert('Please fill out Skill Name and Years of Experience.');
      return;
    }

    const newSkill = {
      name: skillName.trim(),
      category,
      level,
      yearsOfExp: yearsOfExp.trim(),
    };

    onAddSkill(newSkill);

    // Clear form and hide it
    setSkillName('');
    setYearsOfExp('');
    setLevel(80);
    setCategory('Frontend');
    setShowAddForm(false);
  };

  // Group skills by category for pristine layout presentation
  const categories = ['Frontend', 'Backend', 'Design & Tools', 'Core Computer Science'];

  return (
    <section 
      id="skills" 
      className="bg-white border border-neutral-200/60 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 
            id="skills-heading" 
            className="font-display font-bold text-xl sm:text-2xl text-neutral-900 flex items-center gap-2"
          >
            <span className="w-1 h-6 rounded bg-indigo-500"></span>
            Professional Skills
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Dynamic database tracking of my developer capabilities and technology stacks.
          </p>
        </div>
        
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button 
            id="toggle-skill-form-btn"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-neutral-900 hover:bg-neutral-800 text-white transition-all duration-300"
          >
            {showAddForm ? 'Close Form' : 'Add Skill'}
          </button>

          <button 
            id="reset-skills-btn"
            onClick={onResetSkills}
            className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200/40 transition-all duration-300"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Form to Add New Skill with high visual design standards */}
      {showAddForm && (
        <div 
          id="add-skill-box" 
          className="border border-neutral-200 rounded-2xl p-5 bg-neutral-50/50 flex flex-col gap-4 animate-fadeIn"
        >
          <h3 className="font-display font-bold text-base text-neutral-800">Add New Skill</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="flex flex-col gap-1.5">
              <label htmlFor="skill-name" className="text-xs font-semibold text-neutral-600">
                Skill Name *
              </label>
              <input
                type="text"
                id="skill-name"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="e.g. Node.js, Docker, Java"
                required
                className="w-full px-3.5 py-2 rounded-xl text-sm border border-neutral-200 bg-white text-neutral-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="skill-category" className="text-xs font-semibold text-neutral-600">
                Category *
              </label>
              <select
                id="skill-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-sm border border-neutral-200 bg-white text-neutral-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Design & Tools">Design & Tools</option>
                <option value="Core Computer Science">Core Computer Science</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="skill-level" className="text-xs font-semibold text-neutral-600 flex justify-between">
                <span>Skill Level</span>
                <span className="text-indigo-600 font-bold">{level}%</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  id="skill-level"
                  min="0"
                  max="100"
                  value={level}
                  onChange={(e) => setLevel(Number(e.target.value))}
                  className="flex-grow h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="skill-experience" className="text-xs font-semibold text-neutral-600">
                Years of Experience *
              </label>
              <input
                type="text"
                id="skill-experience"
                value={yearsOfExp}
                onChange={(e) => setYearsOfExp(e.target.value)}
                placeholder="e.g. 1 Year, 6 Months"
                required
                className="w-full px-3.5 py-2 rounded-xl text-sm border border-neutral-200 bg-white text-neutral-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="md:col-span-2 mt-2">
              <button
                type="submit"
                id="skill-submit-btn"
                className="w-full md:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/10 active:scale-98"
              >
                Save Skill
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Render Current List of Skills clustered by category */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
        {categories.map((cat) => {
          const catSkills = skills.filter((s) => s.category === cat);
          if (catSkills.length === 0) return null;

          return (
            <div key={cat} className="flex flex-col gap-3.5 border border-neutral-100 rounded-2xl p-4.5 bg-neutral-50/30">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-neutral-400">
                {cat}
              </h3>

              <div className="flex flex-col gap-3">
                {catSkills.map((skill, index) => (
                  <div key={`${skill.name}-${index}`} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-neutral-800">{skill.name}</span>
                      <span className="text-xs text-neutral-500 font-mono">
                        {skill.yearsOfExp} exp
                      </span>
                    </div>

                    {/* Styled progress bar */}
                    <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
