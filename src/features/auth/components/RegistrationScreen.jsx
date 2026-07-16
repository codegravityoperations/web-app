import { useState } from "react";
import { API, apiFetch } from "../../../apiClient";
import { validateReg } from "../utils/validation";
import { Logo, PageWrap, Card, ErrorBanner, Spinner, Field, FooterLink } from "../../../components/ui";
import SuccessScreen from "./SuccessScreen";

const emptyEmp = {firstName:"",lastName:"",email:"",phone:"",address:"",password:"",confirmPassword:""};
const emptyCan = {firstName:"",lastName:"",email:"",phone:"",address:"",password:"",confirmPassword:"",appliedRole:"",resumeUrl:"",notes:""};

const RegistrationScreen = ({onGoLogin}) => {
  const [tab, setTab]           = useState("employee");
  const [fields, setFields]     = useState(emptyEmp);
  const [errors, setErrors]     = useState({});
  const [touched, setTouched]   = useState({});
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess]   = useState(null);

  const isCandidate = tab === "candidate";

  const switchTab = (t) => {
    setTab(t); setFields(t==="candidate" ? emptyCan : emptyEmp);
    setErrors({}); setTouched({}); setApiError(""); setSuccess(null);
  };

  const change = (id, val) => {
    const u = {...fields, [id]: val};
    setFields(u);
    if (touched[id]) setErrors(p => ({...p, [id]: validateReg(u, isCandidate)[id]}));
    setApiError("");
  };
  const blur = (id) => {
    setTouched(p => ({...p, [id]: true}));
    setErrors(p => ({...p, [id]: validateReg(fields, isCandidate)[id]}));
  };

  const submit = async () => {
    const allTouched = Object.keys(fields).reduce((a,k) => ({...a,[k]:true}), {});
    setTouched(allTouched);
    const errs = validateReg(fields, isCandidate);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true); setApiError("");
    try {
      let body, url;
      if (isCandidate) {
        url  = API.registerCandidate;
        body = {firstName:fields.firstName.trim(),lastName:fields.lastName.trim(),email:fields.email.trim(),password:fields.password,phone:fields.phone.trim(),address:fields.address.trim(),appliedRole:fields.appliedRole.trim(),resumeUrl:fields.resumeUrl.trim()||undefined,notes:fields.notes.trim()||undefined};
      } else {
        url  = API.registerEmployee;
        body = {firstName:fields.firstName.trim(),lastName:fields.lastName.trim(),email:fields.email.trim(),password:fields.password,phone:fields.phone.trim(),address:fields.address.trim()};
      }
      const res = await apiFetch(url, {body});
      setSuccess(res.data);
    } catch (err) {
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
            {["employee","candidate"].map(t => (
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

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
                {["firstName","lastName"].map(id=>(
                  <Field key={id} label={id==="firstName"?"First name":"Last name"} id={id} value={fields[id]} onChange={change} onBlur={blur} error={errors[id]} touched={touched[id]} placeholder={id==="firstName"?"Jane":"Smith"}/>
                ))}
              </div>

              <Field label="Email address" id="email" type="email" value={fields.email} onChange={change} onBlur={blur} error={errors.email} touched={touched.email} placeholder="jane@example.com"/>
              <Field label="Phone number" id="phone" type="tel" value={fields.phone} onChange={change} onBlur={blur} error={errors.phone} touched={touched.phone} placeholder="+15550000000"/>
              <Field label="Address" id="address" value={fields.address} onChange={change} onBlur={blur} error={errors.address} touched={touched.address} placeholder="123 Main St, City, State"/>

              {isCandidate && (
                <>
                  <Field label="Applied role *" id="appliedRole" value={fields.appliedRole} onChange={change} onBlur={blur} error={errors.appliedRole} touched={touched.appliedRole} placeholder="e.g. Software Engineer"/>
                  <Field label="Resume URL (optional)" id="resumeUrl" value={fields.resumeUrl} onChange={change} onBlur={blur} error={errors.resumeUrl} touched={touched.resumeUrl} placeholder="https://drive.google.com/..."/>
                  <Field label="Notes (optional)" id="notes" value={fields.notes} onChange={change} onBlur={blur} error={errors.notes} touched={touched.notes} placeholder="Any additional notes…"/>
                </>
              )}

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
                {[{id:"password",label:"Password",ph:"Min. 8 characters"},{id:"confirmPassword",label:"Confirm password",ph:"Re-enter password"}].map(f=>(
                  <Field key={f.id} label={f.label} id={f.id} type="password" value={fields[f.id]} onChange={change} onBlur={blur} error={errors[f.id]} touched={touched[f.id]} placeholder={f.ph}/>
                ))}
              </div>

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
      <p style={{textAlign:"center",marginTop:20,fontSize:12,color:"#d1d5db"}}>© 2025 Code Gravity Consultancy Portal · Phase 1 Registration</p>
    </PageWrap>
  );
};

export default RegistrationScreen;