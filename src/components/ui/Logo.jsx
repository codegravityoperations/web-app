const Logo = () => (
  <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"white",borderRadius:12,padding:"8px 16px",boxShadow:"0 1px 4px rgba(0,0,0,0.08)",marginBottom:20}}>
    <div style={{width:28,height:28,borderRadius:7,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
    <span style={{fontSize:13,fontWeight:600,color:"#374151",fontFamily:"'DM Sans',sans-serif"}}>Code Gravity Consultancy Portal</span>
  </div>
);

export default Logo;