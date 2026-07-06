const PageWrap = ({children}) => (
  <div style={{minHeight:"100vh",background:"#f5f5f7",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px 16px",fontFamily:"'DM Sans',sans-serif"}}>
    <div style={{width:"100%",maxWidth:520,animation:"slideUp 0.45s cubic-bezier(0.22,1,0.36,1)"}}>
      {children}
    </div>
  </div>
);

export default PageWrap;