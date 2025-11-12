"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ThemeToggle from "./theme-toggle"

interface CommandOutput {
  command: string
  output: React.ReactNode
}

export default function TerminalView() {
  const [input, setInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<CommandOutput[]>([])
  const [cursorBlink, setCursorBlink] = useState(true)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [historyIndex, setHistoryIndex] = useState(-1)
  const [inputHistory, setInputHistory] = useState<string[]>([])
  const [tempInput, setTempInput] = useState("")
  const availableCommands = [
    "help",
    "whoami",
    "projects",
    "skills",
    "achievements",
    "experience",
    "competitive",
    "startup",
    "contact",
    "clear",
    "resume",
  ]

  // Initial welcome message
  useEffect(() => {
    const initialOutput = [
      {
        command: "",
        output: (
          <div className="text-green-500">
            <p className="text-xl font-bold mb-2">Welcome to Het's Terminal Portfolio v1.0.0</p>
            <p>
              Type <span className="text-yellow-400">help</span> to see available commands
            </p>
          </div>
        ),
      },
    ]
    setCommandHistory(initialOutput)
  }, [])

  // Auto-scroll to bottom when new commands are added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [commandHistory])

  // Focus input when clicking anywhere in the terminal
  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }

    const terminal = terminalRef.current
    if (terminal) {
      terminal.addEventListener("click", handleClick)
      return () => terminal.removeEventListener("click", handleClick)
    }
  }, [])

  // Cursor blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setCursorBlink((prev) => !prev)
    }, 500)

    return () => clearInterval(blinkInterval)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (input.trim()) {
        // Add command to history
        setInputHistory((prev) => [...prev, input])
        setHistoryIndex(-1)
        processCommand(input)
        setInput("")
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
      // Command completion
      const currentInput = input.toLowerCase().trim()
      if (currentInput) {
        const matchingCommands = availableCommands.filter((cmd) => cmd.startsWith(currentInput))
        if (matchingCommands.length === 1) {
          setInput(matchingCommands[0])
        } else if (matchingCommands.length > 1) {
          // Show available completions
          const completionsOutput = {
            command: input,
            output: (
              <div>
                <p className="text-yellow-400">Available completions:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {matchingCommands.map((cmd, index) => (
                    <span key={index} className="text-green-400">
                      {cmd}
                    </span>
                  ))}
                </div>
              </div>
            ),
          }
          setCommandHistory((prev) => [...prev, completionsOutput])
        }
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      // Navigate command history (up)
      if (inputHistory.length > 0) {
        if (historyIndex === -1) {
          // Save current input before navigating history
          setTempInput(input)
          setHistoryIndex(inputHistory.length - 1)
          setInput(inputHistory[inputHistory.length - 1])
        } else if (historyIndex > 0) {
          setHistoryIndex(historyIndex - 1)
          setInput(inputHistory[historyIndex - 1])
        }
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      // Navigate command history (down)
      if (historyIndex !== -1) {
        if (historyIndex === inputHistory.length - 1) {
          setHistoryIndex(-1)
          setInput(tempInput)
        } else {
          setHistoryIndex(historyIndex + 1)
          setInput(inputHistory[historyIndex + 1])
        }
      }
    }
  }

  // Handle resume download
  const handleDownloadResume = () => {
    // Open Google Drive resume link in new tab
    window.open("https://drive.google.com/file/d/1r0apoij6kKZgTzyvbKkziH7c_N02644q/view?usp=drivesdk", "_blank")
  }

  const processCommand = (cmd: string) => {
    const command = cmd.trim().toLowerCase()
    let output: React.ReactNode

    switch (command) {
      case "help":
        output = (
          <div>
            <p className="font-bold text-yellow-400">Available commands:</p>
            <ul className="ml-4">
              <li>
                <span className="text-green-400">whoami</span> - Learn about me
              </li>
              <li>
                <span className="text-green-400">projects</span> - View my projects
              </li>
              <li>
                <span className="text-green-400">skills</span> - See my technical skills
              </li>
              <li>
                <span className="text-green-400">achievements</span> - View my achievements
              </li>
              <li>
                <span className="text-green-400">experience</span> - View my work experience
              </li>
              <li>
                <span className="text-green-400">competitive</span> - View my CP Skills
              </li>
              <li>
                <span className="text-green-400">startup</span> - View my startup ventures
              </li>
              <li>
                <span className="text-green-400">contact</span> - Get my contact information
              </li>
              <li>
                <span className="text-green-400">resume</span> - Download my resume
              </li>
              <li>
                <span className="text-green-400">clear</span> - Clear the terminal
              </li>
              <li>
                <span className="text-green-400">help</span> - Show this help message
              </li>
            </ul>
            <p className="mt-2 text-blue-400">
              Pro tip: Use <span className="text-yellow-400">Tab</span> for command completion and{" "}
              <span className="text-yellow-400">↑/↓</span> arrows to navigate command history
            </p>
          </div>
        )
        break

      case "whoami":
        output = (
          <div>
            <p className="font-bold text-xl text-purple-400 mb-2">Het Mehta</p>
            <p className="mb-2">
              A passionate Full-stack Developer and AI/ML Engineer creating beautiful and interactive web experiences
              and ML Engineering.
            </p>
            <p>With 3+ years of experience in web development and Machine Learning.</p>
          </div>
        )
        break
      case "achievements":
        output = (
          <div>
            <p className="font-bold text-yellow-400 mb-2">My Achievements:</p>
            <div className="ml-4 space-y-4">
              <div>
                <p className="font-bold text-green-400">🏆 Hackathons & Competitions</p>
                <div className="ml-4 space-y-2">
                  <div>
                    <p className="font-bold text-blue-400">Odoo Hackathon 2025 - Winner 🏆</p>
                    <p>
                      Won the Odoo Hackathon 2025 for the Carbon Footprint Tracker project, focusing on reducing
                      industrial carbon emissions using IoT sensors and AI.
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-blue-400">HSBC Hackathon - Finalist 🥈</p>
                    <p>
                      Selected as a finalist in the HSBC Hackathon, developing fintech solutions for modern banking
                      challenges.
                    </p>
                  </div>
                 
                  <div>
                    <p className="font-bold text-blue-400">IIT Indore Hackathon - 4th Position 🥉</p>
                    <p>
                      Secured 4th position in the prestigious IIT Indore Hackathon, competing against top teams from
                      across India. Developed innovative solutions showcasing technical excellence and problem-solving
                      skills.
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-blue-400">ISRO Robotics Challenge 2025 - Shortlisted</p>
                    <p>
                      Shortlisted in the top 170 teams among 1,600 colleges, for the ISRO IRoC-U challenge, creating an
                      Autonomous Navigation System for Martian Terrain.
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-blue-400">NUV ACM - 2025 -Winner </p>
                    <p>
                      Real-time Campus Monitoring & Threat Prediction and Reduction System Predicts assaults, thefts, fires, intrusions, before they happen. Maps campus hotspots where risks are highest. Human-in-the-loop Agentic AI → real-time SMS + calls to police, ambulance, principal instantly.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <p className="font-bold text-green-400">🌐 Open Source Contributions</p>
                <div className="ml-4 space-y-2">
                  <div>
                    <p className="font-bold text-blue-400">GirlScript Summer of Code - Contributor 👩‍💻</p>
                    <p>
                      Active contributor in GirlScript Summer of Code, one of India's largest open-source programs.
                      Contributed to multiple projects, mentored newcomers, and helped build inclusive tech communities.
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-blue-400">Open Source India Connect - Contributor 🌐</p>
                    <p>
                      Contributing member of Open Source India Connect, promoting open-source culture and collaboration.
                      Participated in community initiatives, code contributions, and knowledge sharing sessions.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <p className="font-bold text-green-400">🎤 Speaking & Community</p>
                <div className="ml-4 space-y-2">
                  <div>
                    <p className="font-bold text-blue-400">Tech Speaker 🎤</p>
                    <p>
                      Regular speaker at tech conferences and meetups, sharing insights on AI/ML, full-stack
                      development, and emerging technologies. Delivered talks on carbon footprint tracking, network
                      security, and sustainable tech solutions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
        break

      case "experience":
        output = (
          <div>
            <p className="font-bold text-yellow-400 mb-2">Professional Experience:</p>
            <div className="ml-4 space-y-6">
              <div>
                <p className="font-bold text-green-400">Software Developer Intern - TatvaSoft</p>
                <p className="text-blue-400">May 2025 - June 2025</p>
                <div className="ml-2 mt-2 space-y-1">
                  <p>
                    • Developed and maintained web applications using React.js, Node.js, and modern JavaScript
                    frameworks
                  </p>
                  <p>• Collaborated with senior developers on feature implementation and code optimization</p>
                  <p>
                    • Participated in code reviews and followed industry best practices for clean, maintainable code
                  </p>
                  <p>• Gained experience with version control systems (Git) and agile development methodologies</p>
                  <p>• Worked on database integration and API development for seamless data flow</p>
                </div>
                <p className="text-purple-400 mt-2">
                  Tech Stack: React.js, Node.js, JavaScript, HTML/CSS, Git, REST APIs
                </p>
              </div>

              <div>
                <p className="font-bold text-green-400">Python Developer Intern - Zidio Development</p>
                <p className="text-blue-400">March 2025 - April 2025</p>
                <div className="ml-2 mt-2 space-y-1">
                  <p>• Developed Python-based applications and automation scripts for various business processes</p>
                  <p>• Worked with data analysis and visualization using pandas, numpy, and matplotlib</p>
                  <p>• Built RESTful APIs using Flask and FastAPI frameworks</p>
                  <p>• Implemented data processing pipelines and ETL operations</p>
                  <p>• Collaborated on machine learning projects using scikit-learn and TensorFlow</p>
                  <p>• Optimized existing Python codebases for better performance and maintainability</p>
                </div>
                <p className="text-purple-400 mt-2">
                  Tech Stack: Python, Flask, FastAPI, pandas, numpy, scikit-learn, TensorFlow, PostgreSQL
                </p>
              </div>
            </div>
          </div>
        )
        break

      case "projects":
        output = (
          <div>
            <p className="font-bold text-yellow-400 mb-2">My Projects:</p>
            <div className="ml-4 space-y-6">
              <div>
                <p className="font-bold text-green-400">1. Carbon Footprint Tracker (Odoo 1st Runner-up) 🏆</p>
                <p className="mb-2">
                  Developed AI system to track and reduce emissions in red-zone industries. Achieved 20% reduction using
                  IoT sensors and CNN-LSTM (95.4% accuracy). Deployed with full CI/CD for real-time updates.
                </p>
                <p className="text-blue-400 mb-2">
                  <span className="text-purple-400">Tech Stack:</span> Python, TensorFlow, Flask, React.js, Node.js,
                  Supabase, IoT
                </p>
                <p className="text-cyan-400">
                  Link:{" "}
                  <a
                    href="https://github.com/mehtahet619"
                    className="underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                </p>
              </div>

              <div>
                <p className="font-bold text-green-400">2. Network Intrusion Detection System (NIDS) 🛡️</p>
                <p className="mb-2">
                  Built real-time NIDS using CNN-LSTM, Random Forest, and XGBoost. Integrated Snort for signature-based
                  detection and real-time alerts. Included admin dashboard and active threat prevention.
                </p>
                <p className="text-blue-400">
                  <span className="text-purple-400">Tech Stack:</span> Python, Flask, Scikit-learn, Snort, Wireshark,
                  ELK Stack, XGBoost
                </p>
              </div>

              <div>
                <p className="font-bold text-green-400">3. AI Legal Research Engine for Commercial Courts ⚖️</p>
                <p className="mb-2">
                  Created multilingual NLP-based assistant (LegalBERT, T5); used OCR for document extraction
                  (Tesseract). Improved legal research speed and decision accuracy by 15%.
                </p>
                <p className="text-blue-400 mb-2">
                  <span className="text-purple-400">Tech Stack:</span> Python, Django, React.js, T5, LegalBERT,
                  Elasticsearch, XGBoost
                </p>
                <p className="text-cyan-400">
                  Link:{" "}
                  <a
                    href="https://github.com/mehtahet619"
                    className="underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                </p>
              </div>
            </div>
          </div>
        )
        break

      case "skills":
        output = (
          <div>
            <p className="font-bold text-yellow-400 mb-2">Technical Skills:</p>
            <div className="ml-4">
              <p>
                <span className="text-green-400">Frontend:</span> React, Next.js, TypeScript, Tailwind CSS, HTML, CSS,
                JavaScript
              </p>
              <p>
                <span className="text-green-400">Backend:</span> Node.js, Express, Python, Django, Flask
              </p>
              <p>
                <span className="text-green-400">Database:</span> MongoDB, PostgreSQL, Firebase, MySQL
              </p>
              <p>
                <span className="text-green-400">DevOps:</span> Docker, AWS, CI/CD, Git, Jenkins
              </p>
              <p>
                <span className="text-green-400">Machine Learning:</span> Scikit-learn, TensorFlow, Keras, XGBoost,
                Random Forest, LSTM, CNN, NLP, BERT
              </p>
              <p>
                <span className="text-green-400">Data Engineering:</span> Pandas, NumPy, PySpark, ETL, Data
                Preprocessing
              </p>
              <p>
                <span className="text-green-400">Cloud & AI Services:</span> Google Cloud, Azure, OpenAI API, GPT,
                Google Gemini
              </p>
              <p>
                <span className="text-green-400">Version Control:</span> Git, GitHub, GitLab
              </p>
              <p>
                <span className="text-green-400">Others:</span> Docker, Agile/Scrum, RESTful APIs, GraphQL, Jira, Trello
              </p>
            </div>
          </div>
        )
        break

      case "competitive":
        output = (
          <div>
            <p className="font-bold text-yellow-400 mb-2">My CP:</p>
            <div className="ml-4 space-y-4">
              <div>
                <p className="font-bold text-green-400">LeetCode</p>
                <p>
                  Solved 340+ questions and still going:&nbsp;
                  <a
                    href="https://leetcode.com/u/mehtahet619/"
                    className="text-blue-400 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    leetcode.com/u/mehtahet619
                  </a>
                </p>
              </div>
              <div>
                <p className="font-bold text-green-400">GeeksforGeeks</p>
                <p>
                  Solved 130+ problems:&nbsp;
                  <a
                    href="https://www.geeksforgeeks.org/user/mehtahet619/"
                    className="text-blue-400 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    geeksforgeeks.org/user/mehtahet619
                  </a>
                </p>
              </div>
            </div>
          </div>
        )
        break

      case "contact":
        output = (
          <div>
            <p className="font-bold text-yellow-400 mb-2">Contact Information:</p>
            <div className="ml-4">
              <p>
                <span className="text-green-400">Email:</span> mehtahet619@gmail.com
              </p>
              <p>
                <span className="text-green-400">GitHub:</span>{" "}
                <a
                  href="https://github.com/mehtahet619"
                  className="text-blue-400 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/mehtahet619
                </a>
              </p>
              <p>
                <span className="text-green-400">LinkedIn:</span>{" "}
                <a
                  href="https://www.linkedin.com/in/het-mehta-5b9a47236/"
                  className="text-blue-400 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  linkedin.com/in/het-mehta-5b9a47236
                </a>
              </p>
              <p>
                <span className="text-green-400">Leetcode:</span>{" "}
                <a
                  href="https://leetcode.com/u/mehtahet619/"
                  className="text-blue-400 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  leetcode.com/u/mehtahet619
                </a>
              </p>
            </div>
          </div>
        )
        break

      case "startup":
        output = (
          <div>
            <p className="font-bold text-yellow-400 mb-2">My Startup Ventures:</p>
            <div className="ml-4 space-y-6">
              <div>
                <p className="font-bold text-green-400">LenGen - Carbon Neutrality Solutions 🌱</p>
                <p className="mb-2">
                  Building LenGen, a comprehensive carbon neutrality platform for red zone industries. Our solution
                  helps industries monitor, reduce, and manage their carbon emissions through advanced IoT sensors,
                  AI-powered analytics, and automated reporting systems.
                </p>
                <p className="mb-2">
                  <span className="text-blue-400">Website:</span>{" "}
                  <a
                    href="https://lengen.in/"
                    className="text-blue-400 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    lengen.in
                  </a>
                </p>
                <p className="mb-2">
                  <span className="text-purple-400">Key Features:</span>
                </p>
                <ul className="ml-4 space-y-1">
                  <li>• Real-time emission monitoring with IoT integration</li>
                  <li>• AI-powered predictive analytics for emission reduction</li>
                  <li>• Automated compliance reporting and penalty management</li>
                  <li>• Industry-specific carbon footprint optimization</li>
                </ul>
                <p className="mt-2">
                  <span className="text-green-400">Status:</span> Currently in development and testing phase
                </p>
              </div>

              <div>
                <p className="font-bold text-green-400">CornvAi - AI Sales Automation Platform 🤖</p>
                <p className="mb-2">
                  Developing CornvAi, an AI-powered sales automation platform designed specifically for SMBs. Our
                  platform automates lead generation, outreach campaigns, and deal tracking to help small businesses
                  scale their sales operations efficiently.
                </p>
                <p className="mb-2">
                  <span className="text-blue-400">Tagline:</span> "Automate Your Sales. Accelerate Your Growth."
                </p>
                <p className="mb-2">
                  <span className="text-purple-400">Core Features:</span>
                </p>
                <ul className="ml-4 space-y-1">
                  <li>• AI Outreach Engine - Personalized email & WhatsApp automation</li>
                  <li>• Smart Lead Generation - LinkedIn and Google Maps scraping</li>
                  <li>• CRM Automation - Automatic deal tracking and updates</li>
                  <li>• Sales Insights Dashboard - Pipeline visualization and forecasting</li>
                </ul>
                <p className="mb-2">
                  <span className="text-cyan-400">How It Works:</span>
                </p>
                <ul className="ml-4 space-y-1">
                  <li>1. Connect Your Accounts (Email, WhatsApp, CRM)</li>
                  <li>2. Launch AI-Generated Campaigns</li>
                  <li>3. Track & Close with AI Insights</li>
                </ul>
                <p className="mt-2">
                  <span className="text-green-400">Status:</span> Early development phase, seeking early access users
                </p>
              </div>
            </div>
          </div>
        )
        break

      case "resume":
        // Trigger resume opening
        setTimeout(() => {
          handleDownloadResume()
        }, 500)

        output = (
          <div>
            <p className="text-green-500 mb-2">
              <span className="animate-pulse">🔗</span> Opening resume...
            </p>
            <p>
              If the resume doesn't open automatically, click{" "}
              <button
                onClick={handleDownloadResume}
                className="text-blue-400 underline cursor-pointer hover:text-blue-500"
              >
                here
              </button>
            </p>
          </div>
        )
        break

      case "clear":
        setCommandHistory([])
        return

      case "":
        output = <></>
        break

      default:
        output = (
          <p className="text-red-500">
            Command not found: {command}. Type <span className="text-yellow-400">help</span> to see available commands.
          </p>
        )
    }

    setCommandHistory((prev) => [...prev, { command, output }])
  }

  return (
    <div className="min-h-screen bg-slate-900 text-green-400 font-mono p-4 flex flex-col">
      <div className="absolute top-4 left-4 z-50">
        <ThemeToggle />
      </div>

      <div className="flex items-center justify-center mb-4 pt-12">
        <h1 className="text-2xl font-bold">Terminal Portfolio</h1>
      </div>

      <div ref={terminalRef} className="flex-1 bg-slate-950 rounded-lg p-4 overflow-y-auto border border-slate-700">
        <AnimatePresence>
          {commandHistory.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4"
            >
              {item.command && (
                <div className="flex items-center mb-1">
                  <span className="text-purple-500 mr-2">hacker@portfolio:~$</span>
                  <span>{item.command}</span>
                </div>
              )}
              <div className="ml-0">{item.output}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center mt-4">
        <span className="text-purple-500">hacker@portfolio:~$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="ml-2 flex-1 bg-transparent text-green-400 outline-none"
          autoFocus
          placeholder="Type a command"
        />
        {cursorBlink && <span className="text-green-400">|</span>}
      </div>
    </div>
  )
}
