const Card = ({children}) => (
  <div style={{background:"white",borderRadius:20,boxShadow:"0 4px 24px rgba(0,0,0,0.07),0 1px 4px rgba(0,0,0,0.04)",overflow:"hidden"}}>
    {children}
  </div>
);

export default Card;