import { useState, useEffect, useRef, useMemo } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const PAYBILL  = "247247";
const ACCT_NUM = "0113407704";
const G        = "#22c55e";
const GRAD     = "linear-gradient(135deg,#16a34a,#22c55e)";

// ─── CURRENCIES ───────────────────────────────────────────────────────────────
const CURRENCIES = [
  { code:"KES", symbol:"KSH",  name:"Kenyan Shilling",     flag:"🇰🇪", rate:1      },
  { code:"USD", symbol:"$",    name:"US Dollar",           flag:"🇺🇸", rate:0.0077 },
  { code:"EUR", symbol:"€",    name:"Euro",                flag:"🇪🇺", rate:0.0071 },
  { code:"GBP", symbol:"£",    name:"British Pound",       flag:"🇬🇧", rate:0.0061 },
  { code:"UGX", symbol:"USh",  name:"Ugandan Shilling",    flag:"🇺🇬", rate:28.5   },
  { code:"TZS", symbol:"TSh",  name:"Tanzanian Shilling",  flag:"🇹🇿", rate:20.1   },
  { code:"NGN", symbol:"₦",    name:"Nigerian Naira",      flag:"🇳🇬", rate:12.3   },
  { code:"GHS", symbol:"₵",    name:"Ghanaian Cedi",       flag:"🇬🇭", rate:0.11   },
  { code:"ZAR", symbol:"R",    name:"South African Rand",  flag:"🇿🇦", rate:0.14   },
  { code:"INR", symbol:"₹",    name:"Indian Rupee",        flag:"🇮🇳", rate:0.64   },
  { code:"AED", symbol:"AED",  name:"UAE Dirham",          flag:"🇦🇪", rate:0.028  },
  { code:"CAD", symbol:"C$",   name:"Canadian Dollar",     flag:"🇨🇦", rate:0.011  },
  { code:"AUD", symbol:"A$",   name:"Australian Dollar",   flag:"🇦🇺", rate:0.012  },
  { code:"RWF", symbol:"RF",   name:"Rwandan Franc",       flag:"🇷🇼", rate:10.2   },
  { code:"ETB", symbol:"Br",   name:"Ethiopian Birr",      flag:"🇪🇹", rate:0.43   },
  { code:"ZMW", symbol:"K",    name:"Zambian Kwacha",      flag:"🇿🇲", rate:0.19   },
  { code:"MWK", symbol:"MK",   name:"Malawian Kwacha",     flag:"🇲🇼", rate:13.4   },
  { code:"SGD", symbol:"S$",   name:"Singapore Dollar",    flag:"🇸🇬", rate:0.010  },
  { code:"CNY", symbol:"¥",    name:"Chinese Yuan",        flag:"🇨🇳", rate:0.056  },
];

function fmt(ksh, cur) {
  const v = ksh * cur.rate;
  if (v >= 10000) return Math.round(v).toLocaleString();
  if (v >= 100)   return Math.round(v).toString();
  if (v >= 10)    return v.toFixed(1);
  return v.toFixed(2);
}

// ─── PACKAGES ─────────────────────────────────────────────────────────────────
const LIKES_PKGS = [
  { amount:"1,000",  price:150,  bonus:"+1K Free Views",  popular:false },
  { amount:"2,000",  price:200,  bonus:"+1K Free Views",  popular:false },
  { amount:"3,000",  price:250,  bonus:"+1K Free Views",  popular:false },
  { amount:"4,000",  price:300,  bonus:"+1K Free Views",  popular:false },
  { amount:"5,000",  price:350,  bonus:"+2K Free Views",  popular:true  },
  { amount:"6,000",  price:400,  bonus:"+2K Free Views",  popular:false },
  { amount:"7,000",  price:450,  bonus:"+2K Free Views",  popular:false },
  { amount:"8,000",  price:500,  bonus:"+3K Free Views",  popular:false },
  { amount:"9,000",  price:550,  bonus:"+3K Free Views",  popular:false },
  { amount:"10,000", price:600,  bonus:"+5K Free Views",  popular:false },
];
const FOLLOWERS_PKGS = [
  { amount:"1,000",  price:300,  bonus:"+1K Free Likes",  popular:false },
  { amount:"2,000",  price:400,  bonus:"+1.5K Likes",     popular:false },
  { amount:"3,000",  price:500,  bonus:"+2K Free Likes",  popular:false },
  { amount:"4,000",  price:700,  bonus:"+2.5K Likes",     popular:false },
  { amount:"5,000",  price:800,  bonus:"+3K Free Likes",  popular:true  },
  { amount:"6,000",  price:900,  bonus:"+3.5K Likes",     popular:false },
  { amount:"7,000",  price:1050, bonus:"+4K Free Likes",  popular:false },
  { amount:"8,000",  price:1200, bonus:"+4.5K Likes",     popular:false },
  { amount:"9,000",  price:1450, bonus:"+5K Free Likes",  popular:false },
  { amount:"10,000", price:1500, bonus:"+6K Free Likes",  popular:false },
];
const REVIEWS = [
  { name:"Natasha M.", handle:"@natasha_ke", av:"N", stars:5, text:"Ordered 5K followers for my boutique page. Within 5 minutes numbers started going up. Total game changer.", time:"2h ago", plat:"IG" },
  { name:"Brian O.",   handle:"@brianodhis",  av:"B", stars:5, text:"Was skeptical at first but these look real. My engagement went up too. Definitely ordering again.",           time:"5h ago", plat:"TikTok" },
  { name:"Cynthia W.", handle:"@cynthia_w",   av:"C", stars:5, text:"Fast delivery, no drop after 2 weeks. Best service I've tried.",                                              time:"1d ago", plat:"IG" },
  { name:"Kevin N.",   handle:"@njorokevin",  av:"K", stars:5, text:"Got 10K likes for a campaign post. The boost was real. Client was very impressed!",                           time:"1d ago", plat:"TikTok" },
];

// ─── TICKER ───────────────────────────────────────────────────────────────────
const TICKS = [
  "Felix just ordered 3K Followers 🔥","Amara purchased 5K TikTok Likes ⚡",
  "Brian added 10K Instagram Followers 🎉","Zara ordered 2K Likes — delivered in 3 min ✅",
  "Kevin boosted 7K TikTok Followers 🚀","Natasha secured 5K Instagram Likes 💥",
];
function Ticker() {
  const [i, setI] = useState(0);
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setVis(false);
      setTimeout(() => { setI(x => (x+1) % TICKS.length); setVis(true); }, 350);
    }, 3000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{background:GRAD,padding:"7px 16px",textAlign:"center",fontSize:12,fontWeight:700,letterSpacing:"0.04em",transition:"opacity 0.35s",opacity:vis?1:0}}>
      🟢 LIVE — {TICKS[i]}
    </div>
  );
}

// ─── CURRENCY MODAL ───────────────────────────────────────────────────────────
function CurrencyModal({ currency, onChange, onClose }) {
  const [q, setQ] = useState("");
  const list = CURRENCIES.filter(c =>
    c.name.toLowerCase().includes(q.toLowerCase()) ||
    c.code.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"flex-end",justifyContent:"center"}}
      onClick={onClose}>
      <div onClick={e=>e.stopPropagation()}
        style={{width:"100%",maxWidth:540,background:"#0d0d1c",borderRadius:"24px 24px 0 0",border:"1px solid rgba(255,255,255,0.1)",maxHeight:"82vh",display:"flex",flexDirection:"column",boxShadow:"0 -20px 60px rgba(0,0,0,0.5)"}}>
        {/* drag handle */}
        <div style={{width:40,height:4,background:"rgba(255,255,255,0.18)",borderRadius:2,margin:"14px auto 0"}}/>
        <div style={{padding:"16px 20px 10px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
            <span style={{fontWeight:900,fontSize:18}}>Choose Your Currency</span>
            <button onClick={onClose} style={{background:"rgba(255,255,255,0.07)",border:"none",color:"rgba(255,255,255,0.5)",width:32,height:32,borderRadius:"50%",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          </div>
          <input autoFocus value={q} onChange={e=>setQ(e.target.value)}
            placeholder="🔍  Search currency or country..."
            style={{width:"100%",boxSizing:"border-box",background:"rgba(255,255,255,0.06)",border:"1.5px solid rgba(255,255,255,0.12)",borderRadius:14,padding:"13px 16px",color:"#fff",fontSize:14,outline:"none",fontFamily:"inherit"}}/>
        </div>
        <div style={{overflowY:"auto",flex:1,paddingBottom:24}}>
          {list.map(c => (
            <div key={c.code} onClick={() => { onChange(c); onClose(); }}
              style={{display:"flex",alignItems:"center",gap:14,padding:"14px 20px",cursor:"pointer",background:c.code===currency.code?"rgba(34,197,94,0.1)":"transparent",borderBottom:"1px solid rgba(255,255,255,0.04)",transition:"background 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}
              onMouseLeave={e=>e.currentTarget.style.background=c.code===currency.code?"rgba(34,197,94,0.1)":"transparent"}>
              <span style={{fontSize:28,lineHeight:1,flexShrink:0}}>{c.flag}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:15}}>{c.name}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.38)",marginTop:1}}>{c.code} &nbsp;·&nbsp; {c.symbol}</div>
              </div>
              {c.code===currency.code
                ? <span style={{color:G,fontWeight:900,fontSize:20}}>✓</span>
                : <span style={{color:"rgba(255,255,255,0.18)",fontSize:13}}>›</span>}
            </div>
          ))}
          {list.length===0 && <div style={{padding:"40px",textAlign:"center",color:"rgba(255,255,255,0.3)",fontSize:14}}>No results</div>}
        </div>
      </div>
    </div>
  );
}

// ─── COPY BUTTON ──────────────────────────────────────────────────────────────
function CopyBtn({ text }) {
  const [done, setDone] = useState(false);
  const copy = () => { try { navigator.clipboard.writeText(text); } catch(_) {} setDone(true); setTimeout(()=>setDone(false),1800); };
  return (
    <button onClick={copy}
      style={{background:done?"rgba(34,197,94,0.2)":"rgba(255,255,255,0.08)",border:`1px solid ${done?"rgba(34,197,94,0.4)":"rgba(255,255,255,0.12)"}`,borderRadius:8,padding:"5px 13px",color:done?G:"rgba(255,255,255,0.55)",fontSize:11,fontWeight:800,cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.2s",letterSpacing:"0.05em"}}>
      {done ? "✓ Copied" : "Copy"}
    </button>
  );
}

// ─── MPESA SCREEN ─────────────────────────────────────────────────────────────
function MpesaScreen({ pkg, handle, platform, service, currency, onDone, onBack }) {
  const [screen,  setScreen]  = useState("pay");   // pay | code | success
  const [code,    setCode]    = useState("");
  const [err,     setErr]     = useState("");
  const [loading, setLoading] = useState(false);
  const ksh = pkg.price;

  const submit = () => {
    const c = code.trim().toUpperCase();
    if (c.length < 8) { setErr("Enter a valid M-Pesa code — e.g. QHX3B2TY1Z"); return; }
    setErr(""); setLoading(true);
    setTimeout(() => { setLoading(false); setScreen("success"); }, 1600);
  };

  // ── SUCCESS ───────────────────────────────────────────────────────────────
  if (screen === "success") return (
    <div style={{textAlign:"center",padding:"36px 16px"}}>
      <div style={{width:84,height:84,borderRadius:"50%",background:GRAD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,margin:"0 auto 20px",boxShadow:"0 0 40px rgba(34,197,94,0.4)"}}>✓</div>
      <h3 style={{fontSize:24,fontWeight:900,margin:"0 0 10px",color:G}}>Order Confirmed! 🎉</h3>
      <p style={{color:"rgba(255,255,255,0.55)",fontSize:14,lineHeight:1.8,marginBottom:6}}>
        Payment of <strong style={{color:"#fff"}}>KSH {ksh.toLocaleString()}</strong> verified via Paybill <strong style={{color:G}}>{PAYBILL}</strong>.<br/>
        Code: <span style={{fontFamily:"monospace",color:G,fontWeight:900,fontSize:15,letterSpacing:"0.08em"}}>{code.trim().toUpperCase()}</span>
      </p>
      <p style={{color:"rgba(255,255,255,0.45)",fontSize:14,lineHeight:1.7,marginBottom:28}}>
        Your <strong style={{color:"#fff"}}>{pkg.amount} {service}</strong> for <strong style={{color:"#fff"}}>{handle}</strong> on {platform==="instagram"?"Instagram":"TikTok"} starts in under 5 minutes.
      </p>
      <div style={{padding:"14px 18px",borderRadius:14,background:"rgba(34,197,94,0.07)",border:"1px solid rgba(34,197,94,0.2)",fontSize:13,color:"rgba(255,255,255,0.55)",textAlign:"left",marginBottom:28,lineHeight:1.7}}>
        📌 Keep your account <strong style={{color:"#fff"}}>PUBLIC</strong> and do not change your username until delivery is complete.
      </div>
      <button onClick={onDone} style={{background:GRAD,border:"none",color:"#fff",padding:"14px 36px",borderRadius:100,fontWeight:900,fontSize:13,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer"}}>
        Place Another Order
      </button>
    </div>
  );

  // ── ENTER CODE ────────────────────────────────────────────────────────────
  if (screen === "code") return (
    <div>
      <button onClick={()=>{setScreen("pay");setErr("");}}
        style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:13,fontWeight:700,cursor:"pointer",padding:"0 0 18px",display:"flex",alignItems:"center",gap:6}}>
        ← Back to Payment Details
      </button>

      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{fontSize:52,marginBottom:10}}>📨</div>
        <h3 style={{fontSize:21,fontWeight:900,margin:"0 0 8px"}}>Enter Your M-Pesa Code</h3>
        <p style={{fontSize:13,color:"rgba(255,255,255,0.45)",margin:0,lineHeight:1.7}}>
          After paying, M-Pesa sends you a confirmation SMS.<br/>
          Paste the transaction code from that message below.
        </p>
      </div>

      {/* SMS mockup */}
      <div style={{background:"#141424",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"16px 20px",marginBottom:22,lineHeight:1.8}}>
        <div style={{fontSize:10,fontWeight:800,letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(255,255,255,0.22)",marginBottom:10}}>Example confirmation SMS</div>
        <span style={{fontFamily:"monospace",color:G,fontWeight:900,fontSize:15}}>QHX3B2TY1Z</span>
        <span style={{fontFamily:"monospace",color:"rgba(255,255,255,0.5)",fontSize:13}}> Confirmed. KSH {ksh.toLocaleString()} sent to InstantGains {PAYBILL} on {new Date().toLocaleDateString("en-KE",{day:"numeric",month:"short",year:"numeric"})}. New M-Pesa balance is KSH XXXX.XX</span>
      </div>

      <label style={{fontSize:10,fontWeight:800,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.35)",marginBottom:8,display:"block"}}>
        M-Pesa Transaction Code
      </label>
      <input value={code} onChange={e=>{setCode(e.target.value.toUpperCase());setErr("");}} placeholder="e.g. QHX3B2TY1Z" maxLength={14}
        style={{width:"100%",boxSizing:"border-box",background:"rgba(255,255,255,0.05)",border:`1.5px solid ${err?"#ef4444":"rgba(255,255,255,0.12)"}`,borderRadius:14,padding:"16px 18px",color:G,fontSize:18,fontWeight:900,outline:"none",letterSpacing:"0.12em",fontFamily:"monospace",textTransform:"uppercase",transition:"border 0.2s"}}/>
      {err && <div style={{fontSize:12,color:"#f87171",marginTop:8,fontWeight:600}}>⚠ {err}</div>}

      <button onClick={submit} disabled={loading||code.trim().length<8}
        style={{width:"100%",marginTop:16,border:"none",borderRadius:14,padding:"17px",fontWeight:900,fontSize:14,letterSpacing:"0.08em",textTransform:"uppercase",cursor:loading||code.trim().length<8?"not-allowed":"pointer",background:loading||code.trim().length<8?"rgba(255,255,255,0.06)":GRAD,color:loading||code.trim().length<8?"rgba(255,255,255,0.2)":"#fff",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",gap:9}}>
        {loading
          ? <><span style={{display:"inline-block",width:16,height:16,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/> Verifying...</>
          : "✅ Confirm & Place Order"}
      </button>
      <p style={{textAlign:"center",fontSize:11,color:"rgba(255,255,255,0.2)",marginTop:14,lineHeight:1.6}}>
        Your order is only processed after the code is verified.
      </p>
    </div>
  );

  // ── PAY INSTRUCTIONS ─────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:22,padding:"18px 20px",borderRadius:18,background:"linear-gradient(135deg,rgba(34,197,94,0.1),rgba(22,163,74,0.04))",border:"1px solid rgba(34,197,94,0.22)"}}>
        <div style={{width:52,height:52,borderRadius:14,background:GRAD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0}}>📱</div>
        <div style={{flex:1}}>
          <div style={{fontWeight:900,fontSize:17,marginBottom:2}}>M-Pesa Paybill</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>Send the exact amount to complete your order</div>
        </div>
        <div style={{textAlign:"right",flexShrink:0}}>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2}}>You Pay</div>
          <div style={{fontWeight:900,fontSize:22,color:G}}>KSH {ksh.toLocaleString()}</div>
          {currency.code!=="KES" && <div style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>≈ {currency.symbol}{fmt(ksh,currency)} {currency.code}</div>}
        </div>
      </div>

      {/* Order chips */}
      <div style={{display:"flex",gap:7,marginBottom:20,flexWrap:"wrap"}}>
        {[[platform==="instagram"?"📷":"🎵", platform==="instagram"?"Instagram":"TikTok"],
          [service==="followers"?"👥":"❤️", `${pkg.amount} ${service}`],
          ["🎁", pkg.bonus],
          ["👤", handle]
        ].map(([icon,label],i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:5,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,padding:"5px 11px",fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.65)"}}>
            {icon} {label}
          </div>
        ))}
      </div>

      {/* Copyable payment details */}
      <div style={{fontSize:10,fontWeight:800,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.28)",marginBottom:10}}>Payment Details — Tap to Copy</div>

      {[
        { label:"Paybill Number",  value:PAYBILL,                  highlight:true  },
        { label:"Account Number",  value:ACCT_NUM,                 highlight:true  },
        { label:"Amount (KSH)",    value:ksh.toLocaleString(),     highlight:false },
      ].map(row=>(
        <div key={row.label} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",background:row.highlight?"rgba(34,197,94,0.07)":"rgba(255,255,255,0.03)",border:`1px solid ${row.highlight?"rgba(34,197,94,0.22)":"rgba(255,255,255,0.07)"}`,borderRadius:13,marginBottom:8}}>
          <span style={{fontSize:12,color:"rgba(255,255,255,0.38)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em"}}>{row.label}</span>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontFamily:"monospace",fontWeight:900,fontSize:row.highlight?19:15,color:row.highlight?G:"#fff",letterSpacing:"0.06em"}}>{row.value}</span>
            <CopyBtn text={row.value}/>
          </div>
        </div>
      ))}

      {/* Step guide */}
      <div style={{margin:"18px 0",padding:"18px 20px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16}}>
        <div style={{fontSize:10,fontWeight:800,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.28)",marginBottom:14}}>Step-by-Step Guide</div>
        {[
          ["Open M-Pesa → Lipa na M-Pesa → Paybill", null, false],
          ["Business No:", PAYBILL, true],
          ["Account No:", ACCT_NUM, true],
          ["Amount:", `KSH ${ksh.toLocaleString()}`, true],
          ["Enter your M-Pesa PIN and Send", null, false],
          ["Copy the code from the confirmation SMS", "You'll need it in the next step ↓", false],
        ].map(([text,sub,mono],i)=>(
          <div key={i} style={{display:"flex",gap:12,marginBottom:i<5?11:0,alignItems:"flex-start"}}>
            <div style={{width:23,height:23,borderRadius:"50%",background:i===5?"linear-gradient(135deg,#f97316,#ec4899)":GRAD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,flexShrink:0,marginTop:1}}>{i+1}</div>
            <div style={{fontSize:13,lineHeight:1.5}}>
              <span style={{fontWeight:700}}>{text}</span>
              {sub && <span style={{fontWeight:900,color:G,fontFamily:mono?"monospace":"inherit",marginLeft:5,fontSize:mono?14:12}}>{sub}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button onClick={()=>setScreen("code")}
        style={{width:"100%",border:"none",borderRadius:14,padding:"18px",fontWeight:900,fontSize:14,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer",background:GRAD,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:10,boxShadow:"0 6px 24px rgba(34,197,94,0.28)"}}>
        ✅ I've Paid — Enter My Code →
      </button>
      <button onClick={onBack}
        style={{width:"100%",background:"transparent",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,padding:"13px",color:"rgba(255,255,255,0.35)",fontWeight:700,fontSize:12,cursor:"pointer",letterSpacing:"0.08em",textTransform:"uppercase"}}>
        ← Back to Order
      </button>
    </div>
  );
}

// ─── COUNT UP HOOK ────────────────────────────────────────────────────────────
function useCountUp(target, duration=1200, go=false) {
  const [v, setV] = useState(0);
  useEffect(()=>{
    if (!go) return;
    let t0 = null;
    const step = ts => {
      if (!t0) t0=ts;
      const p = Math.min((ts-t0)/duration,1);
      setV(Math.floor(p*target));
      if (p<1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },[target,duration,go]);
  return v;
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [platform, setPlatform] = useState("instagram");
  const [service,  setService]  = useState("followers");
  const [selPkg,   setSelPkg]   = useState(null);
  const [handle,   setHandle]   = useState("");
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [showCurrModal, setShowCurrModal] = useState(false);
  const [step, setStep] = useState(1); // 1=select 2=confirm 3=mpesa
  const statsRef = useRef(null);
  const [statsGo, setStatsGo] = useState(false);

  const pkgs = useMemo(() => service==="followers" ? FOLLOWERS_PKGS : LIKES_PKGS, [service]);
  const pkg  = selPkg !== null ? pkgs[selPkg] : null;

  useEffect(()=>{
    const obs = new IntersectionObserver(([e])=>{ if(e.isIntersecting) setStatsGo(true); },{threshold:0.3});
    if (statsRef.current) obs.observe(statsRef.current);
    return ()=>obs.disconnect();
  },[]);

  const c1 = useCountUp(48320,1400,statsGo);
  const c2 = useCountUp(99,1000,statsGo);
  const c3 = useCountUp(5,800,statsGo);

  const reset = () => { setStep(1); setSelPkg(null); setHandle(""); };

  return (
    <div style={{minHeight:"100vh",background:"#080810",color:"#fff",fontFamily:"'DM Sans','Segoe UI',sans-serif",overflowX:"hidden"}}>
      <Ticker/>

      {/* ── NAV ── */}
      <nav style={{position:"sticky",top:0,zIndex:100,background:"rgba(8,8,16,0.9)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(255,255,255,0.07)",padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:62}}>
        <div style={{display:"flex",alignItems:"center",gap:9,fontWeight:900,fontSize:17,letterSpacing:"-0.04em",textTransform:"uppercase"}}>
          <div style={{width:36,height:36,borderRadius:9,background:GRAD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>⚡</div>
          InstantGains
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {/* Currency pill in nav */}
          <button onClick={()=>setShowCurrModal(true)}
            style={{display:"flex",alignItems:"center",gap:7,background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.25)",borderRadius:100,padding:"7px 14px",cursor:"pointer",color:"#fff",fontWeight:800,fontSize:13,whiteSpace:"nowrap",transition:"all 0.2s"}}>
            <span style={{fontSize:17,lineHeight:1}}>{currency.flag}</span>
            <span style={{color:G}}>{currency.symbol}</span>
            <span style={{opacity:0.5,fontSize:11}}>{currency.code}</span>
            <span style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>▼</span>
          </button>
          <button onClick={()=>document.getElementById("order-section")?.scrollIntoView({behavior:"smooth"})}
            style={{background:GRAD,border:"none",color:"#fff",padding:"9px 18px",borderRadius:100,fontWeight:800,fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer"}}>
            Order Now ↗
          </button>
        </div>
      </nav>

      {/* ── CURRENCY MODAL ── */}
      {showCurrModal && <CurrencyModal currency={currency} onChange={setCurrency} onClose={()=>setShowCurrModal(false)}/>}

      {/* ── HERO ── */}
      <div style={{padding:"72px 20px 56px",textAlign:"center",position:"relative"}}>
        <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:600,height:380,background:"radial-gradient(ellipse at top,rgba(34,197,94,0.1) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.28)",color:G,borderRadius:100,padding:"5px 14px",fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:26}}>
          🟢 Live Orders — Instant Delivery
        </div>
        <h1 style={{fontSize:"clamp(44px,8vw,90px)",fontWeight:900,lineHeight:0.9,letterSpacing:"-0.04em",margin:"0 0 22px"}}>
          Grow Your<br/>
          <span style={{background:"linear-gradient(135deg,#22c55e,#86efac)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Social Presence</span>
        </h1>
        <p style={{color:"rgba(255,255,255,0.42)",maxWidth:500,margin:"0 auto 32px",fontSize:15,lineHeight:1.7}}>
          Premium followers &amp; likes for Instagram and TikTok. Real accounts, non-drop guarantee, delivered in under 5 minutes. Pay via M-Pesa Paybill <strong style={{color:G}}>{PAYBILL}</strong>.
        </p>

        {/* BIG currency switcher in hero */}
        <div style={{display:"inline-flex",flexDirection:"column",alignItems:"center",gap:8,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:20,padding:"16px 24px",marginBottom:28}}>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)"}}>Viewing prices in</div>
          <button onClick={()=>setShowCurrModal(true)}
            style={{display:"flex",alignItems:"center",gap:10,background:"rgba(34,197,94,0.08)",border:"2px solid rgba(34,197,94,0.3)",borderRadius:14,padding:"12px 22px",cursor:"pointer",color:"#fff",fontWeight:900,fontSize:16,transition:"all 0.2s"}}>
            <span style={{fontSize:26}}>{currency.flag}</span>
            <span>{currency.name}</span>
            <span style={{color:G,fontSize:18,fontWeight:900}}>{currency.symbol}</span>
            <span style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginLeft:4}}>Change ▼</span>
          </button>
          {currency.code!=="KES" && (
            <div style={{fontSize:11,color:"rgba(255,255,255,0.28)",fontWeight:600}}>
              Prices shown in {currency.code}. All payments processed in KSH via M-Pesa.
            </div>
          )}
        </div>

        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={()=>document.getElementById("order-section")?.scrollIntoView({behavior:"smooth"})}
            style={{background:GRAD,border:"none",color:"#fff",padding:"15px 30px",borderRadius:100,fontWeight:800,fontSize:13,letterSpacing:"0.07em",textTransform:"uppercase",cursor:"pointer",boxShadow:"0 6px 24px rgba(34,197,94,0.3)"}}>
            🚀 Start Growing
          </button>
          <button onClick={()=>document.getElementById("reviews")?.scrollIntoView({behavior:"smooth"})}
            style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.12)",color:"rgba(255,255,255,0.7)",padding:"15px 26px",borderRadius:100,fontWeight:700,fontSize:12,letterSpacing:"0.07em",textTransform:"uppercase",cursor:"pointer"}}>
            See Reviews
          </button>
        </div>
      </div>

      <div style={{maxWidth:1080,margin:"0 auto",padding:"0 20px 80px"}}>

        {/* ── STATS ── */}
        <div ref={statsRef} style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:2,borderRadius:22,overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)",marginBottom:72}}>
          {[[c1.toLocaleString()+"+","Orders Completed"],[c2+"%","Satisfaction Rate"],["~"+c3+" min","Avg. Delivery"]].map(([n,l],i)=>(
            <div key={i} style={{background:"rgba(255,255,255,0.025)",padding:"36px 16px",textAlign:"center",borderLeft:i>0?"1px solid rgba(255,255,255,0.06)":"none"}}>
              <div style={{fontSize:"clamp(32px,5vw,52px)",fontWeight:900,letterSpacing:"-0.04em",background:"linear-gradient(135deg,#22c55e,#86efac)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{n}</div>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)",marginTop:6}}>{l}</div>
            </div>
          ))}
        </div>

        {/* ── ORDER SECTION ── */}
        <div id="order-section" style={{scrollMarginTop:72,marginBottom:72}}>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(255,255,255,0.28)",marginBottom:6}}>Order Your Package</div>
          <h2 style={{fontSize:24,fontWeight:900,letterSpacing:"-0.03em",margin:"0 0 24px"}}>Choose What You Need</h2>

          {/* Platform + service toggles */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
            {[
              { label:"Platform", opts:[{icon:"📷",label:"Instagram",val:"instagram"},{icon:"🎵",label:"TikTok",val:"tiktok"}], cur:platform, set:(v)=>{setPlatform(v);setSelPkg(null);} },
              { label:"Service",  opts:[{icon:"👥",label:"Followers",val:"followers"},{icon:"❤️",label:"Likes",val:"likes"}],    cur:service,  set:(v)=>{setService(v);setSelPkg(null);}  },
            ].map(({label,opts,cur,set})=>(
              <div key={label}>
                <div style={{fontSize:10,fontWeight:800,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.28)",marginBottom:7}}>{label}</div>
                <div style={{display:"flex",gap:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:5}}>
                  {opts.map(o=>(
                    <button key={o.val} onClick={()=>set(o.val)}
                      style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"11px 0",borderRadius:10,border:"none",fontWeight:800,fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",transition:"all 0.22s",background:cur===o.val?GRAD:"transparent",color:cur===o.val?"#fff":"rgba(255,255,255,0.38)",boxShadow:cur===o.val?"0 4px 16px rgba(34,197,94,0.22)":"none"}}>
                      {o.icon} {o.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Inline currency change strip */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",background:"rgba(34,197,94,0.05)",border:"1px solid rgba(34,197,94,0.15)",borderRadius:12,marginBottom:18}}>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",fontWeight:600}}>
              Prices in <strong style={{color:G}}>{currency.code} ({currency.symbol})</strong>
              {currency.code!=="KES" && <span style={{color:"rgba(255,255,255,0.3)"}}> · Payment in KSH via M-Pesa</span>}
            </div>
            <button onClick={()=>setShowCurrModal(true)}
              style={{display:"flex",alignItems:"center",gap:6,background:"rgba(34,197,94,0.12)",border:"1px solid rgba(34,197,94,0.25)",borderRadius:10,padding:"6px 12px",cursor:"pointer",color:"#fff",fontWeight:800,fontSize:12}}>
              <span style={{fontSize:15}}>{currency.flag}</span> Change ▼
            </button>
          </div>

          {/* Package grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10,marginBottom:28}}>
            {pkgs.map((p,i)=>(
              <div key={`${service}-${i}`} onClick={()=>setSelPkg(i)}
                style={{position:"relative",background:selPkg===i?GRAD:p.popular?"rgba(34,197,94,0.07)":"rgba(255,255,255,0.025)",border:`2px solid ${selPkg===i?"transparent":p.popular?"rgba(34,197,94,0.28)":"rgba(255,255,255,0.07)"}`,borderRadius:18,padding:"20px 14px 16px",cursor:"pointer",textAlign:"center",transition:"all 0.2s",transform:selPkg===i?"scale(1.04)":"scale(1)",boxShadow:selPkg===i?"0 10px 36px rgba(34,197,94,0.28)":"none"}}>
                {p.popular && <div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:GRAD,color:"#fff",fontSize:8,fontWeight:900,letterSpacing:"0.15em",textTransform:"uppercase",padding:"3px 11px",borderRadius:100,whiteSpace:"nowrap"}}>🔥 Best Value</div>}
                {selPkg===i && <div style={{position:"absolute",top:-9,right:-9,width:24,height:24,borderRadius:"50%",background:"#fff",color:G,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:900,border:"3px solid #080810"}}>✓</div>}
                <div style={{fontSize:26,fontWeight:900,letterSpacing:"-0.04em",lineHeight:1,marginBottom:2}}>{p.amount}</div>
                <div style={{fontSize:9,fontWeight:800,letterSpacing:"0.2em",textTransform:"uppercase",opacity:0.5,marginBottom:10}}>{service}</div>
                <div style={{fontSize:19,fontWeight:900,marginBottom:6}}>
                  <span style={{fontSize:11,opacity:0.65}}>{currency.symbol} </span>{fmt(p.price,currency)}
                </div>
                {currency.code!=="KES" && <div style={{fontSize:9,color:selPkg===i?"rgba(255,255,255,0.5)":"rgba(255,255,255,0.25)",marginBottom:6}}>KSH {p.price}</div>}
                <div style={{display:"inline-block",fontSize:9,fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",background:selPkg===i?"rgba(255,255,255,0.18)":"rgba(34,197,94,0.13)",color:selPkg===i?"#fff":G,padding:"3px 9px",borderRadius:100}}>{p.bonus}</div>
              </div>
            ))}
          </div>

          {/* Order box */}
          <div style={{background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:24,padding:"30px 26px"}}>
            {step===3 ? (
              <MpesaScreen pkg={pkg} handle={handle} platform={platform} service={service} currency={currency} onDone={reset} onBack={()=>setStep(2)}/>
            ) : step===2 ? (
              <div>
                <h3 style={{fontSize:19,fontWeight:900,margin:"0 0 18px"}}>Confirm Your Order</h3>
                {[
                  ["Platform", platform==="instagram"?"📷 Instagram":"🎵 TikTok"],
                  ["Service", service.charAt(0).toUpperCase()+service.slice(1)],
                  ["Package", `${pkg?.amount} ${service}`],
                  ["Profile", handle],
                  ["Bonus", pkg?.bonus],
                ].map(([l,v],i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:i===4?"rgba(34,197,94,0.07)":"rgba(255,255,255,0.03)",border:`1px solid ${i===4?"rgba(34,197,94,0.2)":"rgba(255,255,255,0.07)"}`,borderRadius:12,padding:"13px 16px",marginBottom:6}}>
                    <span style={{fontSize:11,color:"rgba(255,255,255,0.4)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em"}}>{l}</span>
                    <span style={{fontWeight:800,color:i===4?G:"#fff"}}>{v}</span>
                  </div>
                ))}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"14px 16px",marginBottom:6,marginTop:2}}>
                  <span style={{fontSize:12,fontWeight:900,textTransform:"uppercase",letterSpacing:"0.08em"}}>Total</span>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontWeight:900,fontSize:22,color:G}}>KSH {pkg?.price.toLocaleString()}</div>
                    {currency.code!=="KES" && <div style={{fontSize:12,color:"rgba(255,255,255,0.3)"}}>≈ {currency.symbol}{fmt(pkg?.price,currency)} {currency.code}</div>}
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:9,padding:"11px 14px",background:"rgba(34,197,94,0.05)",border:"1px solid rgba(34,197,94,0.15)",borderRadius:11,marginBottom:16,fontSize:13}}>
                  <span style={{fontSize:18}}>📱</span>
                  <span style={{color:"rgba(255,255,255,0.5)"}}>Pay via <strong style={{color:"#fff"}}>M-Pesa Paybill {PAYBILL}</strong> · Acct <strong style={{color:"#fff",fontFamily:"monospace"}}>{ACCT_NUM}</strong></span>
                </div>
                <div style={{display:"flex",gap:9}}>
                  <button onClick={()=>setStep(1)} style={{background:"rgba(255,255,255,0.06)",border:"none",color:"#fff",padding:"15px 20px",borderRadius:12,fontWeight:700,fontSize:12,cursor:"pointer"}}>← Back</button>
                  <button onClick={()=>setStep(3)} style={{flex:1,background:GRAD,border:"none",color:"#fff",padding:"15px",borderRadius:12,fontWeight:900,fontSize:13,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer",boxShadow:"0 4px 20px rgba(34,197,94,0.25)"}}>
                    📱 Pay with M-Pesa →
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 style={{fontSize:17,fontWeight:900,margin:"0 0 16px"}}>{platform==="instagram"?"📷 Your Instagram Handle":"🎵 Your TikTok Profile Link"}</h3>
                <label style={{fontSize:10,fontWeight:800,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.35)",marginBottom:8,display:"block"}}>
                  {platform==="instagram"?"Username (without @)":"Profile URL"}
                </label>
                <input value={handle} onChange={e=>setHandle(e.target.value)}
                  placeholder={platform==="instagram"?"e.g. yourname":"e.g. https://tiktok.com/@yourname"}
                  style={{width:"100%",boxSizing:"border-box",background:"rgba(255,255,255,0.05)",border:"1.5px solid rgba(255,255,255,0.1)",borderRadius:13,padding:"14px 16px",color:"#fff",fontSize:14,fontWeight:500,outline:"none",transition:"border 0.2s"}}/>
                {selPkg!==null && (
                  <div style={{marginTop:12,padding:"10px 14px",borderRadius:11,background:"rgba(34,197,94,0.06)",border:"1px solid rgba(34,197,94,0.16)",fontSize:13,color:"rgba(255,255,255,0.6)"}}>
                    <strong style={{color:G}}>{pkg?.amount} {service}</strong>
                    {" — "}
                    <strong style={{color:"#fff"}}>{currency.symbol}{fmt(pkg?.price,currency)}</strong>
                    {currency.code!=="KES" && <span style={{color:"rgba(255,255,255,0.28)"}}> (KSH {pkg?.price})</span>}
                    {" · "}<span style={{color:G}}>{pkg?.bonus}</span>
                  </div>
                )}
                <button onClick={()=>{if(!handle||selPkg===null)return;setStep(2);}} disabled={!handle||selPkg===null}
                  style={{width:"100%",marginTop:14,border:"none",borderRadius:13,padding:"16px",fontWeight:900,fontSize:13,letterSpacing:"0.1em",textTransform:"uppercase",cursor:!handle||selPkg===null?"not-allowed":"pointer",background:!handle||selPkg===null?"rgba(255,255,255,0.06)":GRAD,color:!handle||selPkg===null?"rgba(255,255,255,0.2)":"#fff",transition:"all 0.2s",boxShadow:!handle||selPkg===null?"none":"0 4px 20px rgba(34,197,94,0.25)"}}>
                  Review Order →
                </button>
                <div style={{display:"flex",justifyContent:"center",gap:20,marginTop:14,opacity:0.26,fontSize:10,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase"}}>
                  <span>🔒 Secure</span><span>⚡ 5-Min</span><span>📱 M-Pesa {PAYBILL}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── CHECKLIST ── */}
        <div style={{marginBottom:72}}>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(255,255,255,0.28)",marginBottom:6}}>Requirements</div>
          <h2 style={{fontSize:24,fontWeight:900,letterSpacing:"-0.03em",margin:"0 0 18px"}}>Before You Order</h2>
          <div style={{display:"grid",gap:9}}>
            {[
              ["Account must be PUBLIC","Orders cannot be delivered to private accounts."],
              ["Posts visible to everyone","For likes orders, your posts must be public."],
              ["Don't change handle mid-order","Changing username during delivery may pause it."],
              ["Likes go to your latest post","Make sure it's already published."],
              ["Delivery starts within 5 minutes","Our system processes orders automatically."],
            ].map(([t,d],i)=>(
              <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:13,padding:"13px 17px"}}>
                <div style={{width:21,height:21,borderRadius:"50%",background:"rgba(34,197,94,0.14)",border:"1px solid rgba(34,197,94,0.28)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0,marginTop:2,color:G}}>✓</div>
                <div><div style={{fontWeight:800,fontSize:13,marginBottom:2}}>{t}</div><div style={{fontSize:12,color:"rgba(255,255,255,0.36)"}}>{d}</div></div>
              </div>
            ))}
          </div>
        </div>

        {/* ── REVIEWS ── */}
        <div id="reviews" style={{marginBottom:72}}>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(255,255,255,0.28)",marginBottom:6}}>Social Proof</div>
          <h2 style={{fontSize:24,fontWeight:900,letterSpacing:"-0.03em",margin:"0 0 18px"}}>What Customers Say</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:12}}>
            {REVIEWS.map((r,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:17,padding:19}}>
                <div style={{display:"flex",alignItems:"center",marginBottom:11}}>
                  <div style={{width:37,height:37,borderRadius:"50%",background:GRAD,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:14,marginRight:10,flexShrink:0}}>{r.av}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:800,fontSize:13}}>{r.name}</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.32)"}}>{r.handle}</div>
                  </div>
                  <div style={{fontSize:9,fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",background:"rgba(255,255,255,0.06)",padding:"3px 7px",borderRadius:6,color:"rgba(255,255,255,0.4)"}}>{r.plat}</div>
                </div>
                <span style={{color:"#f59e0b",fontSize:12,letterSpacing:1}}>{"★".repeat(r.stars)}</span>
                <p style={{fontSize:12,color:"rgba(255,255,255,0.55)",lineHeight:1.55,margin:"7px 0 7px"}}>"{r.text}"</p>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.2)",fontWeight:700}}>{r.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TRUST BADGES ── */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:2,borderRadius:20,overflow:"hidden",background:"rgba(255,255,255,0.05)"}}>
          {[["🔒","100% Secure","Encrypted payments, zero data leaks."],["⚡","Instant Delivery","Orders processed in under 5 minutes."],["♾️","Non-Drop","Followers & likes that stick."]].map(([icon,t,d],i)=>(
            <div key={i} style={{background:"#080810",padding:"30px 16px",textAlign:"center"}}>
              <div style={{fontSize:28,marginBottom:9}}>{icon}</div>
              <div style={{fontWeight:900,fontSize:14,marginBottom:5}}>{t}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.32)"}}>{d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{borderTop:"1px solid rgba(255,255,255,0.07)",padding:"26px 20px"}}>
        <div style={{maxWidth:1080,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:8,fontWeight:900,fontSize:15,letterSpacing:"-0.04em",textTransform:"uppercase",opacity:0.4}}>
            <div style={{width:30,height:30,borderRadius:8,background:GRAD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>⚡</div>
            InstantGains
          </div>
          <p style={{fontSize:10,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(255,255,255,0.17)",textAlign:"center",margin:0}}>
            © 2026 InstantGains · Paybill {PAYBILL} · Acct {ACCT_NUM} · Not affiliated with Meta or TikTok
          </p>
          <div style={{display:"flex",gap:7}}>
            {["📷","🎵"].map(e=><div key={e} style={{width:32,height:32,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:13}}>{e}</div>)}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&display=swap');
        *{box-sizing:border-box}body{margin:0;background:#080810}
        @keyframes spin{to{transform:rotate(360deg)}}
        input:focus{border-color:#22c55e!important;box-shadow:0 0 0 3px rgba(34,197,94,0.14)!important}
        button:active{transform:scale(0.97)}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:#080810}
        ::-webkit-scrollbar-thumb{background:rgba(34,197,94,0.3);border-radius:10px}
      `}</style>
    </div>
  );
}
