import { useState } from "react";

// ─── API CONFIG ───────────────────────────────────────────────────────────────
const BASE_URL = "http://52.54.52.163:8080";

const API = {
  login:            `${BASE_URL}/api/auth/login`,
  logout:           `${BASE_URL}/api/auth/logout`,
  refresh:          `${BASE_URL}/api/auth/refresh`,
  registerEmployee: `${BASE_URL}/api/employees/register`,
  registerCandidate:`${BASE_URL}/api/candidates/register`,
};

// ─── TOKEN HELPERS ────────────────────────────────────────────────────────────
const saveTokens = (access, refresh) => {
  localStorage.setItem("accessToken",  access);
  localStorage.setItem("refreshToken", refresh);
};
const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};
const getAccessToken  = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");

// ─── GENERIC API CALL ─────────────────────────────────────────────────────────
async function apiFetch(url, { method = "POST", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const json = await res.json().catch(() => ({}));
  // Backend wraps everything in { success, message, data, timestamp }
  if (!res.ok || json.success === false) {
    throw new Error(json.message || `Request failed (${res.status})`);
  }
  return json; // { success, message, data, timestamp }
}

// ─── VALIDATION ───────────────────────────────────────────────────────────────
const validateReg = (fields, isCandidate) => {
  const e = {};
  if (!fields.firstName.trim()) e.firstName = "First name is required";
  if (!fields.lastName.trim())  e.lastName  = "Last name is required";
  if (!fields.email.trim())     e.email     = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = "Enter a valid email";
  if (!fields.phone.trim())     e.phone     = "Phone number is required";
  else if (!/^\+?[0-9]{7,15}$/.test(fields.phone.replace(/[\s\-()]/g,""))) e.phone = "Enter a valid phone (7–15 digits)";
  if (!fields.password)         e.password  = "Password is required";
  else if (fields.password.length < 8) e.password = "Minimum 8 characters";
  if (!fields.confirmPassword)         e.confirmPassword = "Please confirm your password";
  else if (fields.password !== fields.confirmPassword) e.confirmPassword = "Passwords do not match";
  if (isCandidate && !fields.appliedRole.trim()) e.appliedRole = "Applied role is required";
  return e;
};

const validateLogin = (fields) => {
  const e = {};
  if (!fields.email.trim()) e.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = "Enter a valid email";
  if (!fields.password) e.password = "Password is required";
  return e;
};

// ─── ANIMATIONS ───────────────────────────────────────────────────────────────
const ANIMATIONS = `
  @keyframes slideUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes scaleIn  { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes checkPop { 0%{transform:scale(0);opacity:0} 70%{transform:scale(1.2);opacity:1} 100%{transform:scale(1);opacity:1} }
`;
const FONTS = "https://fonts.googleapis.com/css2?family=Fraunces:wght@500;700&family=DM+Sans:wght@400;500;600&family=DM+Mono&display=swap";

// ─── SHARED UI ────────────────────────────────────────────────────────────────
const Logo = () => (
  <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"white",borderRadius:12,padding:"8px 16px",boxShadow:"0 1px 4px rgba(0,0,0,0.08)",marginBottom:20}}>
    <div style={{width:28,height:28,borderRadius:7,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
    <span style={{fontSize:13,fontWeight:600,color:"#374151",fontFamily:"'DM Sans',sans-serif"}}>IT Consultancy Portal</span>
  </div>
);

const PageWrap = ({children}) => (
  <div style={{minHeight:"100vh",background:"#f5f5f7",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px 16px",fontFamily:"'DM Sans',sans-serif"}}>
    <div style={{width:"100%",maxWidth:520,animation:"slideUp 0.45s cubic-bezier(0.22,1,0.36,1)"}}>
      {children}
    </div>
  </div>
);

const Card = ({children}) => (
  <div style={{background:"white",borderRadius:20,boxShadow:"0 4px 24px rgba(0,0,0,0.07),0 1px 4px rgba(0,0,0,0.04)",overflow:"hidden"}}>
    {children}
  </div>
);

const ErrorBanner = ({message}) => (
  <div style={{background:"#fff5f5",border:"1px solid #fecaca",borderRadius:10,padding:"12px 16px",marginBottom:20,display:"flex",gap:10,alignItems:"flex-start",animation:"fadeIn 0.25s ease"}}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{flexShrink:0,marginTop:1}}>
      <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.8"/>
      <path d="M12 7v6M12 15v2" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
    </svg>
    <p style={{margin:0,fontSize:13.5,color:"#dc2626",fontFamily:"'DM Sans',sans-serif",lineHeight:1.5}}>{message}</p>
  </div>
);

const Spinner = () => (
  <div style={{width:17,height:17,border:"2.5px solid rgba(255,255,255,0.4)",borderTopColor:"white",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>
);

const Field = ({label,id,type="text",value,onChange,onBlur,error,touched,placeholder,children}) => {
  const bad = touched && error;
  return (
    <div style={{marginBottom:18}}>
      <label htmlFor={id} style={{display:"block",fontSize:12,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:bad?"#e05252":"#6b7280",marginBottom:5,fontFamily:"'DM Sans',sans-serif"}}>
        {label} <span style={{color:"#e05252"}}>*</span>
      </label>
      {children || (
        <input id={id} type={type} value={value} placeholder={placeholder}
          autoComplete={type==="password"?"new-password":"off"}
          onChange={e=>onChange(id,e.target.value)}
          onBlur={()=>onBlur&&onBlur(id)}
          style={{width:"100%",padding:"11px 14px",fontSize:15,fontFamily:"'DM Sans',sans-serif",background:bad?"#fff5f5":"#f9fafb",border:`1.5px solid ${bad?"#e05252":"#e5e7eb"}`,borderRadius:10,outline:"none",boxSizing:"border-box",color:"#111827",transition:"border-color 0.2s"}}
          onFocus={e=>{e.target.style.borderColor=bad?"#e05252":"#6366f1";e.target.style.boxShadow=`0 0 0 3px ${bad?"rgba(224,82,82,0.1)":"rgba(99,102,241,0.12)"}`;e.target.style.background="#fff"}}
          onBlurCapture={e=>{e.target.style.borderColor=bad?"#e05252":"#e5e7eb";e.target.style.boxShadow="none";e.target.style.background=bad?"#fff5f5":"#f9fafb"}}
        />
      )}
      {bad && (
        <p style={{margin:"4px 0 0",fontSize:12,color:"#e05252",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:4}}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#e05252" strokeWidth="1.5"/><path d="M8 5v4M8 11v.5" stroke="#e05252" strokeWidth="1.5" strokeLinecap="round"/></svg>
          {error}
        </p>
      )}
    </div>
  );
};

const FooterLink = ({text,linkText,onClick}) => (
  <div style={{borderTop:"1px solid #f3f4f6",padding:"16px 32px",background:"#fafafa",textAlign:"center"}}>
    <p style={{margin:0,fontSize:14,color:"#6b7280",fontFamily:"'DM Sans',sans-serif"}}>
      {text}{" "}
      <button onClick={onClick} style={{background:"none",border:"none",cursor:"pointer",color:"#6366f1",fontWeight:600,fontFamily:"'DM Sans',sans-serif",fontSize:14,padding:0}}>
        {linkText}
      </button>
    </p>
  </div>
);

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
const LoginScreen = ({onLogin, onGoRegister}) => {
  const [fields, setFields]   = useState({email:"",password:"",userType:"EMPLOYEE"});
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPwd, setShowPwd]   = useState(false);

  const change = (id,val) => {
    const u = {...fields,[id]:val};
    setFields(u);
    if(touched[id]) setErrors(p=>({...p,[id]:validateLogin(u)[id]}));
    setApiError("");
  };
  const blur = (id) => {
    setTouched(p=>({...p,[id]:true}));
    setErrors(p=>({...p,[id]:validateLogin(fields)[id]}));
  };

  const submit = async () => {
    setTouched({email:true,password:true});
    const errs = validateLogin(fields);
    setErrors(errs);
    if(Object.keys(errs).length) return;

    setLoading(true); setApiError("");
    try {
      // POST /api/auth/login → { success, message, data: AuthResponse }
      const res = await apiFetch(API.login, {
        body: {
          email:    fields.email.trim(),
          password: fields.password,
          userType: fields.userType,   // "EMPLOYEE" | "CANDIDATE"
        }
      });
      // res.data = { accessToken, refreshToken, tokenType, email, businessId, userType, role }
      const auth = res.data;
      saveTokens(auth.accessToken, auth.refreshToken);
      onLogin(auth);
    } catch(err) {
      setApiError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (id) => ({
    width:"100%",padding:"11px 14px",fontSize:15,fontFamily:"'DM Sans',sans-serif",
    background: touched[id]&&errors[id] ? "#fff5f5" : "#f9fafb",
    border:`1.5px solid ${touched[id]&&errors[id]?"#e05252":"#e5e7eb"}`,
    borderRadius:10,outline:"none",boxSizing:"border-box",color:"#111827",transition:"border-color 0.2s"
  });

  return (
    <PageWrap>
      <div style={{textAlign:"center",marginBottom:32}}>
        <Logo/>
        <h1 style={{margin:"0 0 8px",fontSize:32,fontWeight:700,fontFamily:"'Fraunces',serif",color:"#111827",lineHeight:1.2}}>Welcome back</h1>
        <p style={{margin:0,fontSize:15,color:"#9ca3af"}}>Sign in to your portal account</p>
      </div>

      <Card>
        <div style={{padding:"32px 32px 28px"}}>
          {apiError && <ErrorBanner message={apiError}/>}

          {/* User type toggle */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:24}}>
            {["EMPLOYEE","CANDIDATE"].map(t=>(
              <button key={t} onClick={()=>setFields(p=>({...p,userType:t}))}
                style={{padding:"10px",fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif",borderRadius:10,cursor:"pointer",transition:"all 0.2s",
                  background: fields.userType===t ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "#f9fafb",
                  color: fields.userType===t ? "white" : "#6b7280",
                  border: `1.5px solid ${fields.userType===t ? "transparent" : "#e5e7eb"}`}}>
                {t.charAt(0)+t.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Email */}
          <Field label="Email address" id="email" type="email" value={fields.email} onChange={change} onBlur={blur} error={errors.email} touched={touched.email} placeholder="jane@example.com"/>

          {/* Password with toggle */}
          <div style={{marginBottom:8}}>
            <label style={{display:"block",fontSize:12,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:touched.password&&errors.password?"#e05252":"#6b7280",marginBottom:5,fontFamily:"'DM Sans',sans-serif"}}>
              Password <span style={{color:"#e05252"}}>*</span>
            </label>
            <div style={{position:"relative"}}>
              <input type={showPwd?"text":"password"} value={fields.password} placeholder="Enter your password"
                autoComplete="current-password"
                onChange={e=>change("password",e.target.value)}
                onBlur={()=>blur("password")}
                style={{...inputStyle("password"),paddingRight:44}}
                onFocus={e=>{e.target.style.borderColor="#6366f1";e.target.style.boxShadow="0 0 0 3px rgba(99,102,241,0.12)";e.target.style.background="#fff"}}
                onBlurCapture={e=>{e.target.style.borderColor=touched.password&&errors.password?"#e05252":"#e5e7eb";e.target.style.boxShadow="none";e.target.style.background=touched.password&&errors.password?"#fff5f5":"#f9fafb"}}
              />
              <button onClick={()=>setShowPwd(p=>!p)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#9ca3af",padding:4,lineHeight:0}}>
                {showPwd
                  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
            {touched.password&&errors.password && (
              <p style={{margin:"4px 0 0",fontSize:12,color:"#e05252",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:4}}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#e05252" strokeWidth="1.5"/><path d="M8 5v4M8 11v.5" stroke="#e05252" strokeWidth="1.5" strokeLinecap="round"/></svg>
                {errors.password}
              </p>
            )}
          </div>

          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:24}}>
            <button style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:"#6366f1",fontFamily:"'DM Sans',sans-serif",fontWeight:500,padding:0}}>Forgot password?</button>
          </div>

          <button onClick={submit} disabled={loading}
            style={{width:"100%",padding:"13px",fontSize:15,fontWeight:600,fontFamily:"'DM Sans',sans-serif",background:loading?"linear-gradient(135deg,#a5b4fc,#c4b5fd)":"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"white",border:"none",borderRadius:10,cursor:loading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,transition:"all 0.2s"}}
            onMouseEnter={e=>{if(!loading){e.currentTarget.style.opacity="0.9";e.currentTarget.style.transform="translateY(-1px)"}}}
            onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="translateY(0)"}}>
            {loading ? <><Spinner/> Signing in…</> : <>Sign in <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></>}
          </button>
        </div>
        <FooterLink text="Don't have an account?" linkText="Register here" onClick={onGoRegister}/>
      </Card>
      <p style={{textAlign:"center",marginTop:20,fontSize:12,color:"#d1d5db"}}>© 2025 IT Consultancy Portal · Phase 1</p>
    </PageWrap>
  );
};

// ─── REGISTRATION SCREEN ──────────────────────────────────────────────────────
const emptyEmp = {firstName:"",lastName:"",email:"",phone:"",address:"",password:"",confirmPassword:""};
const emptyCan = {firstName:"",lastName:"",email:"",phone:"",address:"",password:"",confirmPassword:"",appliedRole:"",resumeUrl:"",notes:""};

const SuccessScreen = ({data, email, userType, onBack, onGoLogin}) => (
  <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"44px 32px",textAlign:"center",animation:"scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1)"}}>
    <div style={{width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24,animation:"checkPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both"}}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M8 16l6 6 10-12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </div>
    <h2 style={{fontSize:26,fontWeight:700,color:"#111827",margin:"0 0 8px",fontFamily:"'Fraunces',serif"}}>Account created!</h2>
    <p style={{fontSize:14,color:"#6b7280",margin:"0 0 28px",fontFamily:"'DM Sans',sans-serif",lineHeight:1.6}}>
      {data?.message || "Your account has been successfully registered."}
    </p>

    {/* Generated ID */}
    <div style={{background:"linear-gradient(135deg,#eef2ff,#f5f3ff)",border:"1px solid #c7d2fe",borderRadius:14,padding:"18px 24px",marginBottom:12,width:"100%",boxSizing:"border-box"}}>
      <p style={{margin:"0 0 4px",fontSize:11,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"#818cf8",fontFamily:"'DM Sans',sans-serif"}}>
        Your {userType === "employee" ? "Employee" : "Candidate"} ID
      </p>
      <p style={{margin:0,fontSize:22,fontWeight:700,color:"#4f46e5",fontFamily:"'DM Mono',monospace",letterSpacing:"0.04em"}}>
        {data?.generatedId || "—"}
      </p>
    </div>

    {/* Email status */}
    <div style={{display:"flex",alignItems:"center",gap:10,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"12px 16px",marginBottom:28,width:"100%",boxSizing:"border-box"}}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 8l9 6 9-6M5 6h14a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1z" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
      <p style={{margin:0,fontSize:13,color:"#15803d",fontFamily:"'DM Sans',sans-serif"}}>
        Email status: <strong>{data?.emailStatus || "SENT"}</strong> · Sent to <strong>{email}</strong>
      </p>
    </div>

    <div style={{display:"flex",gap:10,width:"100%"}}>
      <button onClick={onBack} style={{flex:1,padding:"12px",fontSize:14,fontWeight:600,fontFamily:"'DM Sans',sans-serif",background:"white",color:"#6b7280",border:"1.5px solid #e5e7eb",borderRadius:10,cursor:"pointer"}}>
        Register another
      </button>
      <button onClick={onGoLogin} style={{flex:2,padding:"12px",fontSize:14,fontWeight:600,fontFamily:"'DM Sans',sans-serif",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"white",border:"none",borderRadius:10,cursor:"pointer"}}
        onMouseEnter={e=>{e.currentTarget.style.opacity="0.9"}}
        onMouseLeave={e=>{e.currentTarget.style.opacity="1"}}>
        Sign in now →
      </button>
    </div>
  </div>
);

const RegistrationScreen = ({onGoLogin}) => {
  const [tab, setTab]         = useState("employee");
  const [fields, setFields]   = useState(emptyEmp);
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess]   = useState(null); // holds RegistrationResponse data

  const isCandidate = tab === "candidate";

  const switchTab = (t) => {
    setTab(t); setFields(t==="candidate" ? emptyCan : emptyEmp);
    setErrors({}); setTouched({}); setApiError(""); setSuccess(null);
  };

  const change = (id,val) => {
    const u={...fields,[id]:val};
    setFields(u);
    if(touched[id]) setErrors(p=>({...p,[id]:validateReg(u,isCandidate)[id]}));
    setApiError("");
  };
  const blur = (id) => {
    setTouched(p=>({...p,[id]:true}));
    setErrors(p=>({...p,[id]:validateReg(fields,isCandidate)[id]}));
  };

  const submit = async () => {
    const allTouched = Object.keys(fields).reduce((a,k)=>({...a,[k]:true}),{});
    setTouched(allTouched);
    const errs = validateReg(fields,isCandidate);
    setErrors(errs);
    if(Object.keys(errs).length) return;

    setLoading(true); setApiError("");
    try {
      let body, url;
      if (isCandidate) {
        // POST /api/candidates/register — CandidateRegisterRequest
        url  = API.registerCandidate;
        body = {
          firstName:   fields.firstName.trim(),
          lastName:    fields.lastName.trim(),
          email:       fields.email.trim(),
          password:    fields.password,
          phone:       fields.phone.trim(),
          address:     fields.address.trim(),
          appliedRole: fields.appliedRole.trim(),
          resumeUrl:   fields.resumeUrl.trim() || undefined,
          notes:       fields.notes.trim()     || undefined,
        };
      } else {
        // POST /api/employees/register — EmployeeRegisterRequest
        url  = API.registerEmployee;
        body = {
          firstName: fields.firstName.trim(),
          lastName:  fields.lastName.trim(),
          email:     fields.email.trim(),
          password:  fields.password,
          phone:     fields.phone.trim(),
          address:   fields.address.trim(),
        };
      }

      // res = { success, message, data: RegistrationResponse, timestamp }
      const res = await apiFetch(url, { body });
      setSuccess(res.data); // { message, userType, generatedId, emailStatus }
    } catch(err) {
      setApiError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrap>
      <div style={{textAlign:"center",marginBottom:32}}>
        <Logo/>
        <h1 style={{margin:"0 0 8px",fontSize:32,fontWeight:700,fontFamily:"'Fraunces',serif",color:"#111827",lineHeight:1.2}}>Create your account</h1>
        <p style={{margin:0,fontSize:15,color:"#9ca3af"}}>Join the portal to get started</p>
      </div>

      <Card>
        {!success && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",borderBottom:"1px solid #f3f4f6",background:"#fafafa"}}>
            {["employee","candidate"].map(t=>(
              <button key={t} onClick={()=>switchTab(t)}
                style={{padding:"16px",border:"none",cursor:"pointer",background:tab===t?"white":"transparent",borderBottom:tab===t?"2.5px solid #6366f1":"2.5px solid transparent",fontSize:14,fontWeight:600,fontFamily:"'DM Sans',sans-serif",color:tab===t?"#6366f1":"#9ca3af",transition:"all 0.2s"}}>
                <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
                  {t==="employee"
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  }
                  {t.charAt(0).toUpperCase()+t.slice(1)}
                </span>
              </button>
            ))}
          </div>
        )}

        <div style={{padding:success?0:"32px 32px 28px"}}>
          {success ? (
            <SuccessScreen
              data={success} email={fields.email} userType={tab}
              onBack={()=>{setSuccess(null);setFields(isCandidate?emptyCan:emptyEmp);setTouched({});setErrors({})}}
              onGoLogin={onGoLogin}
            />
          ) : (
            <>
              {apiError && <ErrorBanner message={apiError}/>}

              {/* Name row */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
                {["firstName","lastName"].map(id=>(
                  <Field key={id} label={id==="firstName"?"First name":"Last name"} id={id} value={fields[id]} onChange={change} onBlur={blur} error={errors[id]} touched={touched[id]} placeholder={id==="firstName"?"Jane":"Smith"}/>
                ))}
              </div>

              {/* Common fields */}
              <Field label="Email address" id="email" type="email" value={fields.email} onChange={change} onBlur={blur} error={errors.email} touched={touched.email} placeholder="jane@example.com"/>
              <Field label="Phone number" id="phone" type="tel" value={fields.phone} onChange={change} onBlur={blur} error={errors.phone} touched={touched.phone} placeholder="+15550000000"/>
              <Field label="Address" id="address" value={fields.address} onChange={change} onBlur={blur} error={errors.address} touched={touched.address} placeholder="123 Main St, City, State"/>

              {/* Candidate-only fields */}
              {isCandidate && (
                <>
                  <Field label="Applied role *" id="appliedRole" value={fields.appliedRole} onChange={change} onBlur={blur} error={errors.appliedRole} touched={touched.appliedRole} placeholder="e.g. Software Engineer"/>
                  <Field label="Resume URL (optional)" id="resumeUrl" value={fields.resumeUrl} onChange={change} onBlur={blur} error={errors.resumeUrl} touched={touched.resumeUrl} placeholder="https://drive.google.com/..."/>
                  <Field label="Notes (optional)" id="notes" value={fields.notes} onChange={change} onBlur={blur} error={errors.notes} touched={touched.notes} placeholder="Any additional notes…"/>
                </>
              )}

              {/* Password row */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
                {[{id:"password",label:"Password",ph:"Min. 8 characters"},{id:"confirmPassword",label:"Confirm password",ph:"Re-enter password"}].map(f=>(
                  <Field key={f.id} label={f.label} id={f.id} type="password" value={fields[f.id]} onChange={change} onBlur={blur} error={errors[f.id]} touched={touched[f.id]} placeholder={f.ph}/>
                ))}
              </div>

              {/* Actions */}
              <div style={{display:"flex",gap:12,marginTop:8}}>
                <button onClick={()=>{setFields(isCandidate?emptyCan:emptyEmp);setErrors({});setTouched({})}} disabled={loading}
                  style={{flex:1,padding:"12px",fontSize:14,fontWeight:600,fontFamily:"'DM Sans',sans-serif",background:"white",color:"#6b7280",border:"1.5px solid #e5e7eb",borderRadius:10,cursor:loading?"not-allowed":"pointer",opacity:loading?0.5:1}}>
                  Reset
                </button>
                <button onClick={submit} disabled={loading}
                  style={{flex:3,padding:"12px",fontSize:14,fontWeight:600,fontFamily:"'DM Sans',sans-serif",background:loading?"linear-gradient(135deg,#a5b4fc,#c4b5fd)":"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"white",border:"none",borderRadius:10,cursor:loading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,transition:"all 0.2s"}}
                  onMouseEnter={e=>{if(!loading){e.currentTarget.style.opacity="0.9";e.currentTarget.style.transform="translateY(-1px)"}}}
                  onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="translateY(0)"}}>
                  {loading ? <><Spinner/> Registering…</> : <>Register as {tab} <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></>}
                </button>
              </div>
              <p style={{margin:"16px 0 0",textAlign:"center",fontSize:12,color:"#d1d5db",fontFamily:"'DM Sans',sans-serif"}}>All fields marked <span style={{color:"#e05252"}}>*</span> are required</p>
            </>
          )}
        </div>

        {!success && <FooterLink text="Already have an account?" linkText="Sign in" onClick={onGoLogin}/>}
      </Card>
      <p style={{textAlign:"center",marginTop:20,fontSize:12,color:"#d1d5db"}}>© 2025 IT Consultancy Portal · Phase 1 Registration</p>
    </PageWrap>
  );
};

// ─── DASHBOARD SCREEN ─────────────────────────────────────────────────────────
const Dashboard = ({auth, onLogout}) => {
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      // POST /api/auth/logout  (requires Bearer token)
      await apiFetch(API.logout, { auth: true });
    } catch(_) {
      // logout best-effort — clear tokens regardless
    } finally {
      clearTokens();
      onLogout();
    }
  };

  return (
    <PageWrap>
      <div style={{textAlign:"center",marginBottom:32}}>
        <Logo/>
        <h1 style={{margin:"0 0 8px",fontSize:30,fontWeight:700,fontFamily:"'Fraunces',serif",color:"#111827"}}>Welcome back!</h1>
        <p style={{margin:0,fontSize:15,color:"#9ca3af"}}>You're logged in to the portal</p>
      </div>

      <Card>
        <div style={{padding:"32px 32px 28px"}}>
          {/* User hero */}
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:28,padding:"20px",background:"linear-gradient(135deg,#eef2ff,#f5f3ff)",borderRadius:14,border:"1px solid #c7d2fe"}}>
            <div style={{width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:"white",fontFamily:"'DM Sans',sans-serif",flexShrink:0}}>
              {(auth.email||"U")[0].toUpperCase()}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <p style={{margin:"0 0 4px",fontSize:16,fontWeight:600,color:"#111827",fontFamily:"'DM Sans',sans-serif",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{auth.email}</p>
              <p style={{margin:0,fontSize:13,color:"#6b7280",fontFamily:"'DM Sans',sans-serif"}}>
                {auth.userType?.charAt(0) + (auth.userType?.slice(1)||"").toLowerCase()} · {auth.role}
              </p>
            </div>
            <div style={{background:"#eef2ff",color:"#4f46e5",fontSize:11,fontWeight:600,padding:"4px 12px",borderRadius:20,fontFamily:"'DM Sans',sans-serif",flexShrink:0}}>
              {auth.userType}
            </div>
          </div>

          {/* Info grid */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:28}}>
            {[
              {label:"Business ID",  value: auth.businessId || "—", mono:true},
              {label:"Token type",   value: auth.tokenType  || "Bearer"},
              {label:"Role",         value: auth.role       || "—"},
              {label:"Status",       value: "Active ✓",     color:"#059669"},
            ].map(item=>(
              <div key={item.label} style={{background:"#f9fafb",borderRadius:12,padding:"14px 16px",border:"0.5px solid #e5e7eb"}}>
                <p style={{margin:"0 0 4px",fontSize:11,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:"#9ca3af",fontFamily:"'DM Sans',sans-serif"}}>{item.label}</p>
                <p style={{margin:0,fontSize:14,fontWeight:600,color:item.color||"#111827",fontFamily:item.mono?"'DM Mono',monospace":"'DM Sans',sans-serif",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.value}</p>
              </div>
            ))}
          </div>

          <button onClick={handleLogout} disabled={loggingOut}
            style={{width:"100%",padding:"13px",fontSize:15,fontWeight:600,fontFamily:"'DM Sans',sans-serif",background:"white",color:"#6b7280",border:"1.5px solid #e5e7eb",borderRadius:10,cursor:loggingOut?"not-allowed":"pointer",opacity:loggingOut?0.6:1,transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}
            onMouseEnter={e=>{if(!loggingOut){e.currentTarget.style.borderColor="#d1d5db";e.currentTarget.style.color="#374151"}}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#e5e7eb";e.currentTarget.style.color="#6b7280"}}>
            {loggingOut ? <><Spinner/> Signing out…</> : "Sign out"}
          </button>
        </div>
      </Card>
    </PageWrap>
  );
};

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("login");
  const [authData, setAuthData] = useState(null);

  const handleLogin  = (auth) => { setAuthData(auth); setScreen("dashboard"); };
  const handleLogout = ()     => { setAuthData(null); setScreen("login"); };

  return (
    <>
      <style>{ANIMATIONS}</style>
      <link href={FONTS} rel="stylesheet"/>
      {screen==="login"     && <LoginScreen      onLogin={handleLogin}  onGoRegister={()=>setScreen("register")}/>}
      {screen==="register"  && <RegistrationScreen                       onGoLogin={()=>setScreen("login")}/>}
      {screen==="dashboard" && <Dashboard        auth={authData}        onLogout={handleLogout}/>}
    </>
  );
}

