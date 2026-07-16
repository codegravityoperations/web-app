import { useState } from "react";
import { API, apiFetch, clearTokens } from "../../apiClient";
import { Logo, PageWrap, Card, Spinner } from "../../components/ui";

const Dashboard = ({auth, onLogout, onEditProfile}) => {
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await apiFetch(API.logout, {auth: true});
    } catch {
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
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:28,padding:"20px",background:"linear-gradient(135deg,#eef2ff,#f5f3ff)",borderRadius:14,border:"1px solid #c7d2fe"}}>
            <div style={{width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:"white",fontFamily:"'DM Sans',sans-serif",flexShrink:0}}>
              {(auth.email||"U")[0].toUpperCase()}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <p style={{margin:"0 0 4px",fontSize:16,fontWeight:600,color:"#111827",fontFamily:"'DM Sans',sans-serif",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{auth.email}</p>
              <p style={{margin:0,fontSize:13,color:"#6b7280",fontFamily:"'DM Sans',sans-serif"}}>
                {auth.userType?.charAt(0)+(auth.userType?.slice(1)||"").toLowerCase()} · {auth.role}
              </p>
            </div>
            <div style={{background:"#eef2ff",color:"#4f46e5",fontSize:11,fontWeight:600,padding:"4px 12px",borderRadius:20,fontFamily:"'DM Sans',sans-serif",flexShrink:0}}>
              {auth.userType}
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:28}}>
            {[
              {label:"Business ID", value: auth.businessId || "—", mono:true},
              {label:"Token type",  value: auth.tokenType  || "Bearer"},
              {label:"Role",        value: auth.role       || "—"},
              {label:"Status",      value: "Active ✓",     color:"#059669"},
            ].map(item=>(
              <div key={item.label} style={{background:"#f9fafb",borderRadius:12,padding:"14px 16px",border:"0.5px solid #e5e7eb"}}>
                <p style={{margin:"0 0 4px",fontSize:11,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:"#9ca3af",fontFamily:"'DM Sans',sans-serif"}}>{item.label}</p>
                <p style={{margin:0,fontSize:14,fontWeight:600,color:item.color||"#111827",fontFamily:item.mono?"'DM Mono',monospace":"'DM Sans',sans-serif",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.value}</p>
              </div>
            ))}
          </div>

          {auth.userType === "CANDIDATE" && (
            <button onClick={onEditProfile}
              style={{width:"100%",padding:"13px",fontSize:15,fontWeight:600,fontFamily:"'DM Sans',sans-serif",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"white",border:"none",borderRadius:10,cursor:"pointer",marginBottom:12}}>
              Edit Profile
            </button>
          )}

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

export default Dashboard;