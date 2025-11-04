import { useEffect, useState } from 'react'
import {gsap} from 'gsap'
import './App.css'

function App() {
  const [skillsOpen, setSkillsOpen] = useState(true);
  const [experienceOpen, setExperienceOpen] = useState(true);
  const [educationOpen, setEducationOpen] = useState(true);
  const [contactOpen, setContactOpen] = useState(true);
  const [promptInput, setPromptInput] = useState('');
  const [promptPlaceHolder, setPromptPlaceHolder] = useState('');
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [chats, setChats] = useState<string[]>([]);

  const exampleQuestions = [
    "What programming languages do you specialise in?",
    "What is your experience with cloud computing?",
    "What experience do you have with Azure?",
    "What did you study at university?",
    ""

  ]; // The text to type out

  useEffect(() => {
    let questionIndex = -1;
    let index = 0;
    let increasing = true;
    const interval = setInterval(() => {

      if (index == 0 ){
        increasing = true;
        questionIndex = (questionIndex + 1) % exampleQuestions.length;
      }
      if (index < exampleQuestions[questionIndex].length && increasing) {
        setPromptPlaceHolder(exampleQuestions[questionIndex].slice(0, index + 1));
        index++;
      }
      else if (index > 0 && !increasing) {
        setPromptPlaceHolder(exampleQuestions[questionIndex].slice(0, index + 1));
        index--;
      }
      else if (index == exampleQuestions[questionIndex].length) {
        increasing = false;
      }
    }, 50); // Adjust speed (ms per character)

    return () => clearInterval(interval);
  }, []);

  const CallChat = async (event:any) => {
    event.preventDefault();
    console.log("Calling chat with prompt: " + promptInput);
    var response;

    // Implement chat call logic here
    try{
      setWaitingForResponse(true);
      setChats([...chats, promptInput]);
      response = await fetch("http://localhost:8000/api/chat/", 
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({prompt: promptInput, chats: chats}),
        method: 'POST'
      });
      setWaitingForResponse(false);
      const data = await response.json();
      console.log("Response from chat API:", data);
      setChats([...chats, promptInput, data.response]);
      setPromptInput('');
    }
    catch (error){
      setWaitingForResponse(false);
      console.error('Error calling chat API:', error);
    }
    
  }


  const revealOverlay = (event: MouseEvent, element: HTMLElement) => {
    if (element) {
      const rect = element.getBoundingClientRect();
      const relativeX = event.clientX - rect.left;
      const relativeY = event.clientY - rect.top;

      //Always keep the relative values between 0 and the size of the element
      const clampedX = Math.min(Math.max(relativeX, 0), element.offsetWidth);
      const clampedY = Math.min(Math.max(relativeY, 0), element.offsetHeight);

      element.style.setProperty('--mouse-x', `${clampedX}px`);
      element.style.setProperty('--mouse-y', `${clampedY}px`);
    }
  }



  //Track mouse movement
  const handleMouseMove = (event: MouseEvent) => {
    const AvatarOverlay = document.querySelector('.AvatarOverlay') as HTMLElement;
    if (AvatarOverlay) {
      revealOverlay(event, AvatarOverlay);
    }
  };

  // Add event listener for mouse movement
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Manages the opening and closing animations of the CV sections
  useEffect(() => {
    gsap.fromTo(".CVSectionContent.Skills", {height: skillsOpen ? '0px' : 'auto', duration: 0.5}, {height: skillsOpen ? 'auto' : '0px', duration: 0.5});
  }, [skillsOpen]);
  useEffect(() => {
    gsap.fromTo(".CVSectionContent.Experience", {height: experienceOpen ? '0px' : 'auto', duration: 0.5}, {height: experienceOpen ? 'auto' : '0px', duration: 0.5});
  }, [experienceOpen]);
  useEffect(() => {
    gsap.fromTo(".CVSectionContent.Education", {height: educationOpen ? '0px' : 'auto', duration: 0.5}, {height: educationOpen ? 'auto' : '0px', duration: 0.5});
  }, [educationOpen]);
  useEffect(() => {
    gsap.fromTo(".CVSectionContent.Contact", {height: contactOpen ? '0px' : 'auto', duration: 0.5}, {height: contactOpen ? 'auto' : '0px', duration: 0.5});
  }, [contactOpen]);


  return (
    <>
      <div className="pageWrapper">
        <h1 className="Name">Sam Nichols</h1>
        <form onSubmit={(event) => CallChat(event)}>
          <div className="AIChatter">
            <div className="AvatarWrapper">
              <img src="./AIAvatar.png" className='Avatar'></img>
              <img src="./AIAvatarOverlay.png" className='AvatarOverlay'></img>
            </div>
            {chats.length > 0 ? 
            <div className="ChatEntries">
              {chats.map((chat, index) => (
              <div className={`ChatEntry ${index % 2 === 0 ? 'Prompt' : 'Response'}`} key={index}>
                  <p>{chat}</p>
              </div>
              ))}
            </div> : null}

            <input
              type='text'
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder={promptPlaceHolder}
            />
          </div>
        </form>
        <div className='CV'>
          <div className="AboutMe">
            <h2>About Me</h2>
            <p>
              Mid-level Software Developer with over 5 years of experience, primarily in full-stack web development using React, C#, .NET, and Node.js, with additional experience in real time simulation, game engines and more. Proven track record in creating efficient website functionality with strong system design principles, reworking legacy code to improve performance using modern technologies, while ensuring alignment with existing project design principles.
              <br/><br/>
              Skilled in deploying, hosting, and migrating applications to cloud environments (Azure), managing on-premises systems, and implementing efficient CI/CD pipelines.
              <br/><br/>
              Strong focus on structured workflows using clear issue tracking (Jira), concise git logs and daily scrums. Excellent communicator and team player, while also able to work in a solo environment. 
            </p>
          </div>
          <div className="CVSection" id="SkillsSection">
            <h2 onClick={() => setSkillsOpen(!skillsOpen)}>Skills</h2>
            <div className='CVSectionContent Skills' style={{ height: skillsOpen ? 'auto' : '0px' }}>
              <div className='SkillCategory'>
                <h3>Languages</h3>
                <ul>
                  <li>C#</li>
                  <li>TypeScript</li>
                  <li>JavaScript</li>
                  <li>SQL</li>
                  <li>C++</li>
                  <li>Python</li>
                  <li>HTML/CSS</li>
                </ul>
              </div>
              <div className='SkillCategory'>
                <h3>Frameworks/Technologies</h3>
                <ul>
                  <li>React</li>
                  <li>.NET</li>
                  <li>Node.js</li>
                  <li>Azure</li>
                  <li>PostgreSQL</li>
                  <li>Docker</li>
                  <li>Express.js</li>
                  <li>MongoDB</li>
                  <li>Unity</li>
                </ul>
              </div>
              <div className='SkillCategory'>
                <h3>Tools</h3>
                <ul>
                  <li>Git/GitHub</li>
                  <li>Jira</li>
                  <li>VS Code</li>
                  <li>Postman</li>
                  <li>Figma</li>
                </ul>
              </div>
              
            </div>
          </div>
          <div className="CVSection" id="ExperienceSection">
            <h2 onClick={() => setExperienceOpen(!experienceOpen)}>Experience</h2>
            <div className='CVSectionContent Experience' style={{ height: experienceOpen ? 'auto' : '0px' }}>
              <div className='JobExperience'>  
                <a className='h5' href="https://cricksoft.com/">Crick Software</a>
                <p>Software Developer – 1 Year (Mar 2024 – Jan 2025) </p>
                <p>Key Responsibilities:</p>
                <ul>
                  <li>Managing, updating, hosting and maintaining the websites responsible for the licensing of the software sold by the company (C#, Postgres).</li>
                  <li>Migrating existing applications into the cloud (Azure).</li>
                  <li>Creating matching algorithms to reduce data redundancy in their databases (Python).</li>
                  <li>Working alongside the UI/UX designer to rework the website to be more user friendly and accessible.</li>
                </ul>
              </div>
              <div className='JobExperience'>  
                <a className='h5' href="https://cp.catapult.org.uk/">Connected Places Catapult</a>
                <p>Software Developer – 4.5 Years (Nov 2019 – Mar 2024)</p>
                <p>Key Responsibilities:</p>
                <ul>
                  <li>Leading work packages as a solo developer or managing a small technical team.</li>
                  <li>Coding and contributing towards greenfield projects to create MVP / demonstrators, including all stages of the software development life cycle.</li>
                  <li>Mentoring other colleagues in their progression as a software developer through code walkthroughs, peer development and code reviews.</li>
                  <li>Hosting and maintaining project deliverables in the cloud (Azure) and streamlining processes with CICD pipelines.</li>
                  <li>Holding workshops with clients and other stakeholders to build up and document requirements (became a lead contributor in solution design) and presenting the project outputs.</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="CVSection" id="EducationSection">
            <h2 onClick={() => setEducationOpen(!educationOpen)}>Education</h2>
            <div className='CVSectionContent Education' style={{ height: educationOpen ? 'auto' : '0px' }}>
              <div className='EducationEntry'>  
                <h3 className='h5'>Bachelor's Degree</h3>
                <p>2016-2019</p>
                <p>University of Lincoln</p>
                <p>BSc (Hons) Computer Science</p>
                <p>2:1 (0.5% from 1st)</p>

              </div>
              <div className='EducationEntry'>  
                <h3 className='h5'>A-Levels</h3>
                <p>2014-2016</p>
                <p>Weston Favell Academy, Northampton</p>
                <p>Maths, Economics, I.T </p>
              </div>
            </div>
          </div>
          <div className="CVSection" id="ContactSection">
            <h2 onClick={()=> setContactOpen(!contactOpen)}>Contact</h2>
            <div className='CVSectionContent Contact' style={{ height: contactOpen ? 'auto' : '0px' }}>
              <a href="mailto:samuel.james.nichols@hotmail.com">samuel.james.nichols@hotmail.com</a>
              <p>+44 7389 069 835</p>
              <a href="https://www.linkedin.com/in/sam-nichols-685710223/">LinkedIn Profile</a>
            </div>
          </div>
        </div>
        
      </div>

    </>
  )
}

export default App
