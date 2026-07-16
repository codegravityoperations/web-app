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

export default FooterLink;