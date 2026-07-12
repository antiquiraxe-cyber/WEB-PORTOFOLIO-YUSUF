"use client"

import { useEffect, useState, useRef } from "react"
import { PortfolioItem, ArchiveItem } from "@/types/portfolio"
import DecryptedText from "./DecryptedText"
import BootScreen from "./BootScreen"
import AsciiCube from "./AsciiCube"

interface ClientPageProps {
  projects: PortfolioItem[]
  archives?: ArchiveItem[]
}

type TerminalEntry = { type: 'input' | 'output', text: React.ReactNode }

export default function ClientPage({ projects, archives = [] }: ClientPageProps) {
  const [isBooting, setIsBooting] = useState(true)
  const [isRedAlert, setIsRedAlert] = useState(false)
  
  const [time, setTime] = useState("")
  const [date, setDate] = useState("")
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [selectedGallery, setSelectedGallery] = useState<{ images: string[], currentIndex: number } | null>(null)
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [contactStatus, setContactStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  
  const [terminalHistory, setTerminalHistory] = useState<TerminalEntry[]>([
    { type: 'output', text: 'guest@system:~$ Welcome to the central frame.' },
    { type: 'output', text: 'Type "help" to see available commands.' }
  ])
  const [terminalInput, setTerminalInput] = useState('')
  const terminalContainerRef = useRef<HTMLDivElement>(null)
  const terminalInputRef = useRef<HTMLInputElement>(null)

  const [heroIndex, setHeroIndex] = useState(0)
  const heroImages = ["/hero-potrait.jpeg", "hero-potrait1.jpeg",]

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [heroImages.length, heroIndex])

  const nextHeroImage = () => {
    setHeroIndex((prev) => (prev + 1) % heroImages.length)
  }
  
  const prevHeroImage = () => {
    setHeroIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }

  const toggleRedAlert = () => {
    if (isRedAlert) {
      document.body.classList.remove('theme-red');
      setIsRedAlert(false);
    } else {
      document.body.classList.add('theme-red');
      setIsRedAlert(true);
    }
  }

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!terminalInput.trim()) return

    const newHistory = [...terminalHistory, { type: 'input', text: terminalInput }]
    
    const cmd = terminalInput.trim().toLowerCase()
    
    if (cmd === 'help') {
      newHistory.push({ type: 'output', text: '> AVAILABLE_COMMANDS:\n> whoami    - Display bio\n> skills    - Display core competencies\n> clear     - Clear terminal output\n> projects  - Quick project list\n> sudo      - Gain root privileges' })
    } else if (cmd === 'whoami') {
      newHistory.push({ type: 'output', text: '> SAKHA_YUSUF. Generalist Web Developer building interactive web experiences.' })
    } else if (cmd === 'skills') {
      newHistory.push({ type: 'output', text: <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span>[████████████████] 100% - FRONT-END ARCHITECTURE</span>
        <span>[████████████░░░░] 75% - INTERFACE DESIGN</span>
        <span>[██████████████░░] 85% - CREATIVE CODING</span>
      </div> })
    } else if (cmd === 'clear') {
      setTerminalHistory([])
      setTerminalInput('')
      return
    } else if (cmd === 'projects') {
      newHistory.push({ type: 'output', text: `> FOUND ${projects.length} PROJECTS. Scroll up to [ EXPLORE_FILES ].` })
    } else if (cmd.startsWith('sudo')) {
      newHistory.push({ type: 'output', text: '> ACCESS_DENIED. Nice try, but you are not root.' })
    } else {
      newHistory.push({ type: 'output', text: `> command not found: ${cmd}` })
    }

    setTerminalHistory(newHistory as TerminalEntry[])
    setTerminalInput('')
    setTimeout(() => {
      if (terminalContainerRef.current) {
        terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
      }
    }, 10)
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert("ERROR: Missing required fields.");
      return;
    }
    setContactStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      if (res.ok) {
        setContactStatus('success');
        setContactForm({ name: '', email: '', message: '' });
        setTimeout(() => setContactStatus('idle'), 5000);
      } else {
        setContactStatus('error');
      }
    } catch (err) {
      setContactStatus('error');
    }
  }

  useEffect(() => {
    // Update the system clock
    function updateClock() {
      const now = new Date()
      const timeStr =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0") +
        ":" +
        now.getSeconds().toString().padStart(2, "0")
      const statusElement = document.querySelector(".system-status")
      if (statusElement) {
        statusElement.textContent = `SYS_UP: ${timeStr} | CPU: ${Math.floor(Math.random() * 20) + 5}%`
      }
    }
    updateClock()
    const interval = setInterval(updateClock, 1000)

    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      clearInterval(interval)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      {isBooting ? (
        <BootScreen onComplete={() => setIsBooting(false)} />
      ) : (
        <div className={isRedAlert ? 'hack-animation' : ''} style={{ opacity: 1, animation: 'fadeIn 0.5s ease-out', minHeight: '100vh' }}>
          {/* Nav / Header */}
          <header>
            <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="logo">Sakha Yusuf Portofolio</div>
              <nav className="nav-links">
                <a href="#work">PROJECTS</a>
                <a href="#lab">LAB</a>
                <a href="#archive">ARCHIVE</a>
                <a href="#contact">CONTACT</a>
              </nav>
              <div className="system-status">SYS_UP: {time} | CPU: 12%</div>
            </div>
          </header>

      {showScrollTop && (
        <button onClick={scrollToTop} className="scroll-to-top" aria-label="Scroll to top">
          <span className="scroll-arrow">↑</span>
        </button>
      )}

      <div className="container">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <p style={{ color: "var(--accent-retro)", marginBottom: "10px" }}>{"[ INITIALIZING PROTOCOL... ]"}</p>
            <h1>
              Generalist <span>Web</span> Developer
            </h1>
            <p>
              Bridging the gap between a blank canvas and a live website. I’m a generalist web developer focused on building interactive, clean, and engaging web experiences.
            </p>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginTop: '20px' }}>
              <a href="#work" className="btn-retro">
                EXPLORE FILES
              </a>
              <div style={{ transform: 'translateY(-10px)' }}>
                <AsciiCube />
              </div>
            </div>
          </div>
          <div className="window-frame">
            <div className="window-header">
              <span>SAKHA_PORTRAIT.JPEG</span>
              <div className="window-controls">
                <button className="window-btn" aria-label="Minimize">
                  <span className="minimize-icon"></span>
                </button>
                <button className="window-btn" aria-label="Maximize">
                  <span className="maximize-icon"></span>
                </button>
                <button className="window-btn window-close" aria-label="Close">
                  <span className="close-icon"></span>
                </button>
              </div>
            </div>
            <div style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '500px' }}>
              <div 
                style={{ 
                  display: 'flex', 
                  width: '100%', 
                  height: '100%',
                  transition: 'transform 0.5s ease',
                  transform: `translateX(-${heroIndex * 100}%)`
                }}
              >
                {heroImages.map((src, i) => (
                  <img key={i} src={src} alt={`Professional Portrait ${i+1}`} className="hero-image" style={{ flex: '0 0 100%', minWidth: '100%', objectFit: 'cover' }} />
                ))}
              </div>
              <button 
                onClick={prevHeroImage}
                style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'var(--surface)', color: 'var(--accent-retro)', border: '2px solid var(--text-primary)', padding: '5px 12px', cursor: 'pointer', zIndex: 2, fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '2px 2px 0px var(--text-primary)' }}
                className="btn-retro"
              >
                {'<'}
              </button>
              <button 
                onClick={nextHeroImage}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'var(--surface)', color: 'var(--accent-retro)', border: '2px solid var(--text-primary)', padding: '5px 12px', cursor: 'pointer', zIndex: 2, fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '2px 2px 0px var(--text-primary)' }}
                className="btn-retro"
              >
                {'>'}
              </button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <div className="stats-bar">
          <div className="stat-item">
            <div className="stat-val">1.5</div>
            <div className="stat-label">Years Exp</div>
          </div>
          <div className="stat-item">
            <div className="stat-val">{projects.length > 0 ? projects.length : 124}</div>
            <div className="stat-label">Projects Built</div>
          </div>
          <div className="stat-item">
            <div className="stat-val">99+</div>
            <div className="stat-label">Bugs Squashed</div>
          </div>
          <div className="stat-item">
            <div className="stat-val">50k</div>
            <div className="stat-label">Lines of Code</div>
          </div>
        </div>

        {/* Profile / Dossier Section */}
        <section id="profile" className="dossier-grid">
          {/* Bio Panel */}
          <div className="dossier-panel dossier-panel-blueprint">
            <h2 className="dossier-panel-header">[ BIODATA ]</h2>
            <div className="dossier-row">
              <span className="dossier-key">OPERATIVE_NAME</span>
              <span className="dossier-value"><DecryptedText text="Sakha Yusuf Pasha" /></span>
            </div>
            <div className="dossier-row">
              <span className="dossier-key">CODENAME</span>
              <span className="dossier-value"><DecryptedText text="Yusuf" /></span>
            </div>
            <div className="dossier-row">
              <span className="dossier-key">BASE_OF_OPERATIONS</span>
              <span className="dossier-value"><DecryptedText text="Kabupaten Bekasi" /></span>
            </div>
            <div className="dossier-row">
              <span className="dossier-key">PROGRAMMING_LANGUAGES</span>
              <span className="dossier-value"><DecryptedText text="JavaScript, TypeScript, Python, CSS" /></span>
            </div>
            <div className="dossier-row">
              <span className="dossier-key">FRAMEWORKS</span>
              <span className="dossier-value"><DecryptedText text="Tailwind CSS, Next.js, React" /></span>
            </div>
            <div className="dossier-row">
              <span className="dossier-key">CORE_SPECIALIZATION</span>
              <span className="dossier-value"><DecryptedText text="Frontend Architecture, Backend" /></span>
            </div>
            <div className="dossier-row">
              <span className="dossier-key">CURRENT_STATUS</span>
              <span className="dossier-value" style={{ color: 'var(--accent-retro)' }}><DecryptedText text="Available for Freelance" /></span>
            </div>
          </div>

          {/* Education Timeline */}
          <div className="dossier-panel">
            <h2 className="dossier-panel-header">[ TRAINING_&_EDUCATION ]</h2>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <span className="timeline-date">2024 - SEKARANG</span>
                <h3 className="timeline-title">Universitas Esa Unggul</h3>
                <p className="timeline-desc">Teknik Informatika. Fokus mendalami struktur data, algoritma, dan rekayasa perangkat lunak modern.</p>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <span className="timeline-date">2021 - 2024</span>
                <h3 className="timeline-title">SMA Taman Harapan 1</h3>
                <p className="timeline-desc">Jurusan Matematika dan Ilmu Pengetahuan Alam (MIPA). Membangun fondasi logika dan pemecahan masalah analitis.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio */}
        <section id="work">
          <h2 className="section-title">Latest Deployments</h2>
          <div className="portfolio-grid">
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <div className="project-card" key={project.id || index}>
                  <div className="window-header" style={{ background: "#333", color: "#fff" }}>
                    <span>{project.name.toUpperCase().replace(/\s+/g, "_")}</span>
                    <div className="window-controls">
                      <button className="window-btn" aria-label="Minimize">
                        <span className="minimize-icon"></span>
                      </button>
                      <button className="window-btn" aria-label="Maximize">
                        <span className="maximize-icon"></span>
                      </button>
                      <button className="window-btn window-close" aria-label="Close">
                        <span className="close-icon"></span>
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', overflowX: 'auto', snapType: 'x mandatory' }}>
                    {project.images?.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`${project.name} ${i + 1}`}
                        className="project-img"
                        onClick={() => setSelectedGallery({ images: project.images, currentIndex: i })}
                        style={{ cursor: 'pointer', minWidth: '100%', flex: '0 0 100%', scrollSnapAlign: 'start', borderBottom: 'none' }}
                      />
                    ))}
                  </div>
                  <div className="project-info" style={{ borderTop: '2px solid #000' }}>
                    <span className="project-tag">
                      {project.tags?.map(tag => `#${tag.toUpperCase()}`).join(' ')}
                    </span>
                    <h3 className="project-title">{project.name}</h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      {project.description}
                    </p>
                    {project.link !== '#' && (
                      <a href={project.link} target="_blank" rel="noreferrer" style={{marginTop: '15px', display: 'inline-block', fontSize: '0.8rem', color: 'var(--accent-retro)', textDecoration: 'none'}}>
                        [ VIEW_DEPLOYMENT ]
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: "var(--text-secondary)" }}>{"> NO_DATA_FOUND"}</p>
            )}
          </div>
        </section>
      </div>

      {/* Marquee */}
      <div className="marquee-container">
        <div className="marquee-text">
          <span className="badge-tech">⚛️ REACT</span>
          <span className="badge-tech">⬛ NEXT.JS</span>
          <span className="badge-tech">🟦 TYPESCRIPT</span>
          <span className="badge-tech">🟨 JAVASCRIPT</span>
          <span className="badge-tech">🐍 PYTHON</span>
          <span className="badge-tech">💠 TAILWIND</span>
          <span className="badge-tech">⚛️ REACT</span>
          <span className="badge-tech">⬛ NEXT.JS</span>
          <span className="badge-tech">🟦 TYPESCRIPT</span>
          <span className="badge-tech">🟨 JAVASCRIPT</span>
          <span className="badge-tech">🐍 PYTHON</span>
          <span className="badge-tech">💠 TAILWIND</span>
        </div>
      </div>

      <div className="container">
        {/* Terminal Section */}
        <section className="terminal-section" id="lab" style={{ display: 'flex', flexDirection: 'column', height: '400px', paddingBottom: '20px' }}>
          <div className="terminal-header" style={{ position: 'sticky', top: 0, backgroundColor: 'var(--surface)', zIndex: 10, paddingBottom: '10px' }}>SYSTEM_CONSOLE.EXE</div>
          <div 
            ref={terminalContainerRef}
            onClick={() => terminalInputRef.current?.focus()}
            style={{ flex: 1, overflowY: 'auto', paddingRight: '10px', display: 'flex', flexDirection: 'column', cursor: 'text' }}
          >
            {terminalHistory.map((entry, idx) => (
              <div key={idx} className="terminal-row" style={{ whiteSpace: 'pre-wrap', marginBottom: '10px' }}>
                {entry.type === 'input' ? (
                  <><span className="prompt">{"guest@system:~$"}</span> <span className="command">{entry.text}</span></>
                ) : (
                  <span className="output" style={{ color: 'var(--text-secondary)' }}>{entry.text}</span>
                )}
              </div>
            ))}
            <form onSubmit={handleTerminalSubmit} className="terminal-row" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
              <span className="prompt">{"guest@system:~$"}</span>
              <input 
                ref={terminalInputRef}
                type="text" 
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'white', flex: 1, fontFamily: 'inherit', outline: 'none', marginLeft: '10px' }}
                autoComplete="off"
                spellCheck="false"
                placeholder="Type 'help'..."
              />
              <button 
                type="submit" 
                style={{ 
                  background: 'var(--text-secondary)', 
                  color: 'var(--surface)', 
                  border: 'none', 
                  padding: '2px 8px', 
                  marginLeft: '10px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}
              >
                ENTER ↵
              </button>
            </form>
          </div>
        </section>

        {/* Archive Section */}
        <section id="archive" style={{ marginBottom: "100px" }}>
          <h2 className="section-title">Directory Listing: Archive</h2>
          <div className="window-frame" style={{ padding: 0 }}>
            <div className="window-header">
              <span>ARCHIVE_DATABASE.DAT</span>
              <div className="window-controls">
                <div className="dot"></div><div className="dot"></div><div className="dot"></div>
              </div>
            </div>
            <div style={{ overflowX: 'auto', padding: '10px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: '"Space Mono", monospace' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--text-secondary)', color: 'var(--accent-retro)' }}>
                    <th style={{ padding: '10px' }}>YEAR</th>
                    <th style={{ padding: '10px' }}>PROJECT_NAME</th>
                    <th style={{ padding: '10px' }}>STACK</th>
                    <th style={{ padding: '10px' }}>LINK</th>
                  </tr>
                </thead>
                <tbody>
                  {archives && archives.length > 0 ? archives.map(arc => (
                    <tr key={arc.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '15px 10px', color: 'var(--text-secondary)' }}>{arc.year}</td>
                      <td style={{ padding: '15px 10px', fontWeight: 'bold' }}>{arc.name}</td>
                      <td style={{ padding: '15px 10px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{arc.tech.join(', ')}</td>
                      <td style={{ padding: '15px 10px' }}>
                        {arc.link !== '#' ? (
                          <a href={arc.link} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-retro)', textDecoration: 'none' }}>[ EXECUTE ]</a>
                        ) : (
                          <span style={{ color: 'var(--text-secondary)' }}>OFFLINE</span>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} style={{ padding: '15px 10px', textAlign: 'center' }}>NO_ARCHIVE_DATA_FOUND</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" style={{ marginBottom: "100px" }}>
          <h2 className="section-title">Comm_Protocol</h2>
          <div className="window-frame">
             <div className="window-header">
                <span>SEND_MESSAGE.EXE</span>
                <div className="window-controls">
                  <button className="window-btn window-close" aria-label="Close"><span className="close-icon"></span></button>
                </div>
             </div>
             <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <p style={{ color: 'var(--accent-retro)' }}>{"> INITIATING SECURE CONNECTION..."}</p>
                {contactStatus === 'success' && <p style={{ color: '#00ff00' }}>{"> TRANSMISSION_SUCCESSFUL: Packet delivered to inbox."}</p>}
                {contactStatus === 'error' && <p style={{ color: 'red' }}>{"> TRANSMISSION_FAILED: Error reaching destination."}</p>}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <span>guest@system:~$</span>
                  <input type="text" placeholder="Your Name" value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})} style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--accent-retro)', color: 'white', flex: 1, minWidth: '200px', fontFamily: 'inherit', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <span>guest@system:~$</span>
                  <input type="email" placeholder="Your Email" value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--accent-retro)', color: 'white', flex: 1, minWidth: '200px', fontFamily: 'inherit', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <span>guest@system:~$</span>
                  <textarea placeholder="Message Payload" rows={4} value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})} style={{ background: 'transparent', border: '1px solid var(--accent-retro)', color: 'white', flex: 1, minWidth: '200px', fontFamily: 'inherit', padding: '10px', outline: 'none', resize: 'vertical' }}></textarea>
                </div>
                <button className="btn-retro" style={{ alignSelf: 'flex-start', marginTop: '10px', opacity: contactStatus === 'submitting' ? 0.5 : 1 }} onClick={handleContactSubmit} disabled={contactStatus === 'submitting'}>
                  {contactStatus === 'submitting' ? 'TRANSMITTING...' : 'TRANSMIT_PACKET'}
                </button>
             </div>
          </div>
        </section>

        {/* Footer */}
        <footer>
          <div className="footer-logo">
            <p style={{ color: "var(--accent-retro)", fontSize: "0.8rem", marginBottom: "10px" }}>END_OF_PAGE</p>
            <h2>
              SAKHA_YUSUF
              <br />
              2024©
            </h2>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ marginBottom: "20px" }}>
              <a href="https://github.com/antiquiraxe-cyber" target="_blank" rel="noreferrer" style={{ color: "var(--text-primary)", textDecoration: "none", marginLeft: "20px" }}>
                GITHUB
              </a>
            </div>
            <p className="copyright">BUILT ON THE EDGE OF THE WEB. ALL RIGHTS RESERVED.</p>
          </div>
        </footer>
      </div>

      {selectedGallery && (
        <div 
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.95)',
            zIndex: 99999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
          }}
          onClick={() => setSelectedGallery(null)}
        >
          <button 
            style={{ position: 'absolute', top: '20px', right: '30px', color: 'var(--accent-retro)', background: 'transparent', border: 'none', fontSize: '2rem', cursor: 'pointer', fontFamily: '"Space Mono", monospace', zIndex: 100000 }}
            onClick={() => setSelectedGallery(null)}
          >
            [X] CLOSE
          </button>
          
          {selectedGallery.images.length > 1 && (
            <button
              style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-retro)', background: 'transparent', border: '2px solid var(--accent-retro)', padding: '10px 20px', fontSize: '2rem', cursor: 'pointer', fontFamily: '"Space Mono", monospace', zIndex: 100000 }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedGallery(prev => prev ? { ...prev, currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length } : null);
              }}
            >
              {"<"}
            </button>
          )}

          <img 
            src={selectedGallery.images[selectedGallery.currentIndex]} 
            alt="Enlarged view" 
            style={{ 
              maxWidth: '80%', 
              maxHeight: '85vh', 
              objectFit: 'contain', 
              border: '2px solid var(--accent-retro)', 
              boxShadow: '8px 8px 0px var(--accent-retro)' 
            }} 
            onClick={(e) => e.stopPropagation()}
          />

          {selectedGallery.images.length > 1 && (
            <button
              style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-retro)', background: 'transparent', border: '2px solid var(--accent-retro)', padding: '10px 20px', fontSize: '2rem', cursor: 'pointer', fontFamily: '"Space Mono", monospace', zIndex: 100000 }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedGallery(prev => prev ? { ...prev, currentIndex: (prev.currentIndex + 1) % prev.images.length } : null);
              }}
            >
              {">"}
            </button>
          )}
          
          <div style={{ position: 'absolute', bottom: '20px', color: 'var(--accent-retro)', fontFamily: '"Space Mono", monospace' }}>
            {selectedGallery.currentIndex + 1} / {selectedGallery.images.length}
          </div>
        </div>
      )}

      {/* Red Alert Toggle (Bottom Left) */}
      <button
        onClick={toggleRedAlert}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          background: 'var(--surface)',
          border: '2px solid var(--accent-retro)',
          color: 'var(--accent-retro)',
          fontSize: '1.5rem',
          padding: '10px',
          cursor: 'pointer',
          zIndex: 99999,
          boxShadow: '4px 4px 0px var(--accent-retro)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '0'
        }}
        title="Toggle Red Alert Mode"
      >
        ☢️
      </button>
      </div>
      )}
    </>
  )
}
