import { useState } from "react";
import { API, apiFetch, saveTokens } from "../../../apiClient";
import { validateLogin } from "../utils/validation";
import { Logo, PageWrap, Card, ErrorBanner, Spinner, Field, FooterLink } from "../../../components/ui";

const LoginScreen = ({onLogin, onGoRegister}) => {
  const [fields, setFields]     = useState({email:"",password:"",userType:"EMPLOYEE"});
  const [errors, setErrors]     = useState({});
  const [touched, setTouched]   = useState({});
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPwd, setShowPwd]   = useState(false);

  const change = (id, val) => {
    const u = {...fields, [id]: val};
    setFields(u);
    if (touched[id]) setErrors(p => ({...p, [id]: validateLogin(u)[id]}));
    setApiError("");
  };
  const blur = (id) => {
    setTouched(p => ({...p, [id]: true}));
    setErrors(p => ({...p, [id]: validateLogin(fields)[id]}));
  };

  const submit = async () => {
    setTouched({email: true, password: true});
    const errs = validateLogin(fields);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true); setApiError("");
    try {
      const res = await apiFetch(API.login, {
        body: {email: fields.email.trim(), password: fields.password, userType: fields.userType}
      });
      const auth = res.data;
      saveTokens(auth.accessToken, auth.refreshToken);
      onLogin(auth);
    } catch (err) {
      setApiError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (id) => ({
    width:"100%", padding:"11px 14px", fontSize:15, fontFamily:"'DM Sans',sans-serif",
    background: touched[id] && errors[id] ? "#fff5f5" : "#f9fafb",
    border: `1.5px solid ${touched[id] && errors[id] ? "#e05252" : "#e5e7eb"}`,
    borderRadius:10, outline:"none", boxSizing:"border-box", color:"#111827", transition:"border-color 0.2s"
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

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:24}}>
            {["EMPLOYEE","CANDIDATE"].map(t => (
              <button key={t} onClick={() => setFields(p => ({...p, userType: t}))}
                style={{padding:"10px",fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif",borderRadius:10,cursor:"pointer",transition:"all 0.2s",
                  background: fields.userType===t ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "#f9fafb",
                  color: fields.userType===t ? "white" : "#6b7280",
                  border: `1.5px solid ${fields.userType===t ? "transparent" : "#e5e7eb"}`}}>
                {t.charAt(0)+t.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <Field label="Email address" id="email" type="email" value={fields.email} onChange={change} onBlur={blur} error={errors.email} touched={touched.email} placeholder="jane@example.com"/>

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
            {touched.password && errors.password && (
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
      <p style={{textAlign:"center",marginTop:20,fontSize:12,color:"#d1d5db"}}>© 2025 Code Gravity Consultancy Portal · Phase 1</p>
    </PageWrap>
  );
};

export default LoginScreen;