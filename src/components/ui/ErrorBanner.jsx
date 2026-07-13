const ErrorBanner = ({message}) => (
  <div style={{background:"#fff5f5",border:"1px solid #fecaca",borderRadius:10,padding:"12px 16px",marginBottom:20,display:"flex",gap:10,alignItems:"flex-start",animation:"fadeIn 0.25s ease"}}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{flexShrink:0,marginTop:1}}>
      <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.8"/>
      <path d="M12 7v6M12 15v2" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
    </svg>
    <p style={{margin:0,fontSize:13.5,color:"#dc2626",fontFamily:"'DM Sans',sans-serif",lineHeight:1.5}}>{message}</p>
  </div>
);

export default ErrorBanner;