import Header from './components/Header.jsx'
import About from './components/About.jsx'
import Skills from './components/Skills.jsx'
import Footer from './components/Footer.jsx'
import './App.css'

const studentName = 'Heer Ghevariya'
const portfolioTitle = 'Student Portfolio'
const aboutText =
  'IT student at Charusat University, passionate about web development and software engineering. Skilled in React, JavaScript, HTML, CSS, C++, and Git. Eager to contribute to innovative projects and enhance technical expertise.'
const skills = ['React', 'JavaScript', 'HTML', 'CSS', 'C++', 'Git']
const contactEmail = '24it025@charusat.edu.in'

function App() {
  return (
    <main className="portfolio-shell">
      <Header title={portfolioTitle} name={studentName} />
      <About bio={aboutText} />
      <Skills heading="Core Skills" items={skills} />
      <Footer email={contactEmail} year={2026} />
    </main>
  )
}

export default App
