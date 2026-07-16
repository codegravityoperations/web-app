const SuccessScreen = ({data, email, userType, onBack, onGoLogin}) => (
  <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"44px 32px",textAlign:"center",animation:"scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1)"}}>
    <div style={{width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24,animation:"checkPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both"}}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M8 16l6 6 10-12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </div>
    <h2 style={{fontSize:26,fontWeight:700,color:"#111827",margin:"0 0 8px",fontFamily:"'Fraunces',serif"}}>Account created!</h2>
    <p style={{fontSize:14,color:"#6b7280",margin:"0 0 28px",fontFamily:"'DM Sans',sans-serif",lineHeight:1.6}}>
      {data?.message || "Your account has been successfully registered."}
    </p>

    <div style={{background:"linear-gradient(135deg,#eef2ff,#f5f3ff)",border:"1px solid #c7d2fe",borderRadius:14,padding:"18px 24px",marginBottom:12,width:"100%",boxSizing:"border-box"}}>
      <p style={{margin:"0 0 4px",fontSize:11,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"#818cf8",fontFamily:"'DM Sans',sans-serif"}}>
        Your {userType === "employee" ? "Employee" : "Candidate"} ID
      </p>
      <p style={{margin:0,fontSize:22,fontWeight:700,color:"#4f46e5",fontFamily:"'DM Mono',monospace",letterSpacing:"0.04em"}}>
        {data?.generatedId || "—"}
      </p>
    </div>

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

export default SuccessScreen;