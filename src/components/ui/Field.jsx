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

export default Field;