import { useState } from "react";
import { ANIMATIONS, FONTS }            from "./constants";
import { LoginScreen, RegistrationScreen } from "./features/auth";
import { Dashboard }                    from "./features/dashboard";
import CandidateRegistrationForm from "./features/candidate-registration/CandidateRegistrationForm";
import AdminCandidates from "./features/admin-candidates/AdminCandidates";
import CandidateProfilePage from "./features/candidate-registration/CandidateProfilePage";
import EditCandidateProfile from "./features/candidate-registration/EditCandidateProfile";
import "./App.css";


// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("login");
  const [authData, setAuthData] = useState(null);

  const handleLogin  = (auth) => { setAuthData(auth); setScreen("dashboard"); };
  const handleLogout = ()     => { setAuthData(null); setScreen("login"); };

  return (
    <>
      <style>{ANIMATIONS}</style>
      <link href={FONTS} rel="stylesheet"/>
      {screen==="login"     && <LoginScreen      onLogin={handleLogin}  onGoRegister={()=>setScreen("register")}/>}
      {screen==="register"  && <RegistrationScreen                       onGoLogin={()=>setScreen("login")}/>}
      {screen==="dashboard" && <Dashboard        auth={authData}        onLogout={handleLogout}        onEditProfile={() => setScreen("editProfile")}/>}
      {screen==="editProfile" && <EditCandidateProfile        onBack={() => setScreen("dashboard")}/>}  
    </>
  );
}

