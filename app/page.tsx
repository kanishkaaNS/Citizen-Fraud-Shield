import Link from "next/link";
import Image from "next/image";
import PlatformStats from "@/components/PlatformStats";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. HERO */}
      <section className="relative w-full max-w-[1200px] mx-auto px-6 py-16 md:py-32 flex flex-col md:flex-row items-center justify-between text-center md:text-left dot-grid-bg overflow-hidden border-b gap-12" style={{ borderColor: "var(--border-hairline)" }}>
        <div className="z-10 flex-1 flex flex-col items-center md:items-start max-w-3xl">
          <span className="text-xs uppercase tracking-wide font-semibold text-primary mb-6 py-1 px-3 rounded-full border" style={{ borderColor: "var(--border-hairline)", background: "var(--bg-elevated)" }}>
            Digital Public Safety
          </span>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-white leading-tight">
            Catch fraud before the money moves.
          </h1>
          <p className="text-base md:text-lg text-muted leading-relaxed mb-10 max-w-2xl">
            Paste a call transcript, scan a currency note, or trace a fraud network — one platform, three ways to stop scams before they cost you.
          </p>
          <div className="flex flex-col sm:flex-row items-center md:items-start gap-4">
            <Link href="/scam" className="btn-pill-primary">
              Try Scam Detector
            </Link>
            <a href="#pillars" className="btn-pill-secondary">
              Explore all three pillars
            </a>
          </div>
          <PlatformStats />
        </div>

        {/* Abstract Alarm Shield Graphic */}
        <div className="z-0 flex-shrink-0 relative opacity-90 md:opacity-100 animate-pulse flex justify-center md:justify-end md:ml-8" style={{ animationDuration: '4s' }}>
          <svg width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="scale-90 md:scale-100 drop-shadow-2xl">
            <g filter="url(#glow)">
              <path d="M160 20C120 60 40 100 40 180C40 260 160 300 160 300C160 300 280 260 280 180C280 100 200 60 160 20Z" stroke="url(#alarm-grad)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M160 60C130 90 80 120 80 180C80 240 160 270 160 270C160 270 240 240 240 180C240 120 190 90 160 60Z" fill="url(#alarm-grad)" opacity="0.6"/>
              <path d="M160 20C120 60 40 100 40 180" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
            </g>
            <defs>
              <linearGradient id="alarm-grad" x1="40" y1="20" x2="280" y2="300" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="var(--grad-red)"/>
                <stop offset="35%" stopColor="var(--grad-pink)"/>
                <stop offset="65%" stopColor="var(--grad-purple)"/>
                <stop offset="100%" stopColor="var(--grad-indigo)"/>
              </linearGradient>
              <filter id="glow" x="-20" y="-40" width="360" height="400" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feGaussianBlur stdDeviation="24" result="effect1_foregroundBlur"/>
              </filter>
            </defs>
          </svg>
        </div>
      </section>

      {/* 2. THREE WAYS WE STOP FRAUD BEFORE IT HAPPENS */}
      <section id="pillars" className="w-full max-w-[1200px] mx-auto px-6 py-16 md:py-24 border-b" style={{ borderColor: "var(--border-hairline)" }}>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Three ways we stop fraud before it happens
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-8 rounded-[24px] border flex flex-col" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-elevated)" }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--risk-safe)" }}></div>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--risk-suspicious)" }}></div>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--risk-scam)" }}></div>
              </div>
              <span className="text-xs uppercase tracking-wide font-semibold text-white bg-green-500/20 px-2 py-1 rounded">Live</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Scam Detector</h3>
            <p className="text-base text-muted leading-relaxed mb-6 flex-1">
              Classify a call or message in seconds. Get a risk score, the exact phrases that triggered it, and a plain-language explanation.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-[24px] border flex flex-col" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-elevated)" }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col gap-1.5 w-8">
                <div className="h-1.5 rounded-full bg-white/40 w-full"></div>
                <div className="h-1.5 rounded-full bg-white/60 w-3/4"></div>
                <div className="h-1.5 rounded-full bg-white/80 w-5/6"></div>
              </div>
              <span className="text-xs uppercase tracking-wide font-semibold text-white bg-green-500/20 px-2 py-1 rounded">Live</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Counterfeit Detector</h3>
            <p className="text-base text-muted leading-relaxed mb-6 flex-1">
              Photograph a note. Get a verdict on security thread, print quality, and serial pattern — plus which features you can trust.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-[24px] border flex flex-col" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-elevated)" }}>
            <div className="flex items-center justify-between mb-6">
              <div className="relative w-10 h-10">
                <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/80"></div>
                <div className="absolute top-6 left-2 w-2 h-2 rounded-full bg-white/60"></div>
                <div className="absolute top-4 right-1 w-2 h-2 rounded-full bg-white/90"></div>
                <svg className="absolute inset-0 w-full h-full text-white/30" viewBox="0 0 40 40">
                   <line x1="6" y1="6" x2="10" y2="26" stroke="currentColor" strokeWidth="1.5" />
                   <line x1="6" y1="6" x2="34" y2="18" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
              <span className="text-xs uppercase tracking-wide font-semibold text-white bg-green-500/20 px-2 py-1 rounded">Live</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Fraud Network Graph</h3>
            <p className="text-base text-muted leading-relaxed mb-6 flex-1">
              See how scammers, phone numbers, and mule accounts connect — trace one report into a whole network.
            </p>
          </div>
        </div>
      </section>

      {/* 3. SEE EXACTLY WHAT TRIGGERED THE VERDICT */}
      <section className="w-full max-w-[1200px] mx-auto px-6 py-16 md:py-24 border-b flex flex-col lg:flex-row items-center gap-12" style={{ borderColor: "var(--border-hairline)" }}>
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-8">
            See exactly what triggered the verdict
          </h2>
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <svg className="w-6 h-6 shrink-0 mt-0.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Flagged phrase highlighting</h4>
                <p className="text-base text-muted">Every scam verdict points to the exact words that gave it away.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <svg className="w-6 h-6 shrink-0 mt-0.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Plain-language explanations</h4>
                <p className="text-base text-muted">No jargon — just why a message is safe, suspicious, or a scam.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <svg className="w-6 h-6 shrink-0 mt-0.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Works in Hindi and Hinglish</h4>
                <p className="text-base text-muted">Regional-language messages are analyzed in the language they were written, no translation step required.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full max-w-md">
          <div className="relative p-6 rounded-[24px] border shadow-2xl" style={{ borderColor: "var(--border-hairline-strong)", backgroundColor: "var(--bg-elevated)" }}>
            <div className="absolute -top-3 right-6 px-3 py-1 rounded-full text-xs font-bold shadow-lg" style={{ backgroundColor: "var(--risk-scam)", color: "white" }}>
              Risk: 92 · SCAM
            </div>
            <div className="text-base leading-relaxed text-muted pt-4">
              "First, I need you to <span className="text-white px-1 rounded" style={{ backgroundColor: "rgba(239, 68, 68, 0.4)" }}>stay on this video call and not tell anyone</span> until this is resolved."
            </div>
          </div>
        </div>
      </section>

      {/* 4. BUILT FOR HOW FRAUD ACTUALLY MOVES */}
      <section className="w-full max-w-[1200px] mx-auto px-6 py-16 md:py-24 border-b dot-grid-bg" style={{ borderColor: "var(--border-hairline)" }}>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Built for how fraud actually moves
          </h2>
        </div>

        <div className="flex flex-col gap-8">
          {/* Row 1 */}
          <div className="p-8 rounded-[24px] border flex flex-col md:flex-row items-start md:items-center gap-8" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-elevated)" }}>
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center border" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg)" }}>
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">No missed warning signs</h3>
              <p className="text-base text-muted">Digital-arrest scams follow patterns — impersonated officials, fake case numbers, pressure to stay on the call. The classifier is trained to catch them.</p>
            </div>
            <div className="flex-shrink-0 p-4 rounded-xl border flex flex-col gap-2 font-mono text-sm text-faint" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg)" }}>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--risk-scam)" }}></div> +91-XXXXX-892</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--risk-scam)" }}></div> +91-XXXXX-114</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--risk-suspicious)" }}></div> +91-XXXXX-405</div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="p-8 rounded-[24px] border flex flex-col md:flex-row items-start md:items-center gap-8" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-elevated)" }}>
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center border" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg)" }}>
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">Verify in seconds, not minutes</h3>
              <p className="text-base text-muted">Upload a note and get a verdict on security thread, microprinting, and serial quality — before you accept it at the counter.</p>
            </div>
            <div className="flex-shrink-0 p-4 rounded-xl border flex items-center justify-center gap-3 w-32" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg)" }}>
               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--risk-safe)" }}></div>
               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--risk-suspicious)" }}></div>
               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--risk-scam)" }}></div>
            </div>
          </div>

          {/* Row 3 */}
          <div className="p-8 rounded-[24px] border flex flex-col md:flex-row items-start md:items-center gap-8" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-elevated)" }}>
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center border" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg)" }}>
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">See the whole network, not just one report</h3>
              <p className="text-base text-muted">One scam report becomes a node. Shared phone numbers and mule accounts across reports reveal the ring behind them.</p>
            </div>
            <div className="flex-shrink-0 p-4 rounded-xl border flex items-end gap-1 h-20 w-32" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg)" }}>
               <div className="w-full bg-white/20 rounded-t h-[20%]"></div>
               <div className="w-full bg-white/40 rounded-t h-[40%]"></div>
               <div className="w-full bg-white/60 rounded-t h-[70%]"></div>
               <div className="w-full bg-white/90 rounded-t h-[100%]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY THIS MATTERS */}
      <section className="w-full max-w-[1200px] mx-auto px-6 py-16 md:py-24 border-b" style={{ borderColor: "var(--border-hairline)" }}>
         <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Why this matters
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-[24px] border flex flex-col items-center text-center" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-elevated)" }}>
            <span className="text-5xl font-bold text-white mb-4">1.14M+</span>
            <span className="text-base text-muted">Cybercrime complaints filed in India in 2023</span>
          </div>
          <div className="p-8 rounded-[24px] border flex flex-col items-center text-center" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-elevated)" }}>
            <span className="text-5xl font-bold text-white mb-4">₹1,776 Cr+</span>
            <span className="text-base text-muted">Lost to digital-arrest scams in the first nine months of 2024</span>
          </div>
          <div className="p-8 rounded-[24px] border flex flex-col items-center text-center" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-elevated)" }}>
            <span className="text-5xl font-bold text-white mb-4">3</span>
            <span className="text-base text-muted">AI-powered detection pillars in one platform</span>
          </div>
        </div>
      </section>

      {/* 6. UNDER THE HOOD */}
      <section className="w-full max-w-[1200px] mx-auto px-6 py-16 md:py-24 border-b" style={{ borderColor: "var(--border-hairline)" }}>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Under the hood
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-[24px] border" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-elevated)" }}>
            <h3 className="text-lg font-bold text-white mb-2">Explainable, not a black box</h3>
            <p className="text-base text-muted">Every verdict returns the specific flagged phrases and a plain-language reason, never just a score.</p>
          </div>
          <div className="p-8 rounded-[24px] border" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-elevated)" }}>
            <h3 className="text-lg font-bold text-white mb-2">Hindi, Hinglish, and English</h3>
            <p className="text-base text-muted">Messages are analyzed in the language they arrive in.</p>
          </div>
          <div className="p-8 rounded-[24px] border" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-elevated)" }}>
            <h3 className="text-lg font-bold text-white mb-2">Data minimized by design</h3>
            <p className="text-base text-muted">Full transcripts aren't stored longer than the demo needs.</p>
          </div>
          <div className="p-8 rounded-[24px] border" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-elevated)" }}>
            <h3 className="text-lg font-bold text-white mb-2">Server-side secrets, always</h3>
            <p className="text-base text-muted">API keys and credentials never reach the browser.</p>
          </div>
        </div>
      </section>

      {/* 7. BUILT TO PROTECT THE DATA IT HANDLES */}
      <section className="w-full max-w-[1200px] mx-auto px-6 py-16 md:py-24 border-b flex flex-col items-center" style={{ borderColor: "var(--border-hairline)" }}>
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-12 text-center">
          Built to protect the data it handles
        </h2>
        <div className="w-full overflow-hidden flex justify-center opacity-70">
          <div className="flex items-center gap-6 font-mono text-sm tracking-widest text-faint flex-wrap justify-center max-w-4xl">
            <span className="px-4 py-2 border rounded-md" style={{ borderColor: "var(--border-hairline)" }}>+91-XXXXX-892</span>
            <span className="px-4 py-2 border rounded-md" style={{ borderColor: "var(--border-hairline)" }}>XXXX-4471</span>
            <span className="px-4 py-2 border rounded-md" style={{ borderColor: "var(--border-hairline)" }}>RISK: 92</span>
            <span className="px-4 py-2 border rounded-md" style={{ borderColor: "var(--border-hairline)" }}>+91-XXXXX-114</span>
            <span className="px-4 py-2 border rounded-md" style={{ borderColor: "var(--border-hairline)" }}>XXXX-9023</span>
            <span className="px-4 py-2 border rounded-md" style={{ borderColor: "var(--border-hairline)" }}>RISK: 85</span>
            <span className="px-4 py-2 border rounded-md" style={{ borderColor: "var(--border-hairline)" }}>+91-XXXXX-405</span>
          </div>
        </div>
      </section>

      {/* 8. SECURITY, BUILT IN FROM DAY ONE */}
      <section className="w-full max-w-[1200px] mx-auto px-6 py-16 md:py-24 border-b flex flex-col md:flex-row items-center gap-16" style={{ borderColor: "var(--border-hairline)" }}>
        <div className="flex-1 flex justify-center">
           <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
             <circle cx="120" cy="120" r="80" fill="var(--bg-elevated)" stroke="var(--border-hairline-strong)" strokeWidth="2" />
             <circle cx="120" cy="120" r="110" stroke="url(#orbit-grad)" strokeWidth="1" strokeDasharray="4 4" className="origin-center animate-spin-slow" style={{ animationDuration: '20s' }} />
             <defs>
               <linearGradient id="orbit-grad" x1="10" y1="120" x2="230" y2="120" gradientUnits="userSpaceOnUse">
                 <stop stopColor="var(--grad-red)" />
                 <stop offset="1" stopColor="var(--grad-indigo)" />
               </linearGradient>
             </defs>
           </svg>
        </div>
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-8">
            Security, built in from day one
          </h2>
          <div className="flex flex-col gap-6">
            <div>
              <h4 className="text-lg font-bold text-white mb-1">Secrets never reach the client</h4>
              <p className="text-base text-muted">API keys and credentials live only in server-side routes.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-1">Every input is validated</h4>
              <p className="text-base text-muted">Malformed requests are rejected before they reach Gemini, Supabase, or Neo4j.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-1">Rate-limited by design</h4>
              <p className="text-base text-muted">Public endpoints are protected against abuse.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-1">HTTPS-only</h4>
              <p className="text-base text-muted">Enforced by default on the Vercel deployment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA */}
      <section className="w-full max-w-[1200px] mx-auto px-6 py-24 flex flex-col items-center text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-8">
          Report a scam. Verify a note. Trace the network.
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/scam" className="btn-pill-primary">
            Try Scam Detector
          </Link>
          <a href="https://github.com/kanishkaaNS/Citizen-Fraud-Shield" target="_blank" rel="noopener noreferrer" className="btn-pill-secondary">
            View source on GitHub
          </a>
        </div>
      </section>

    </div>
  );
}
