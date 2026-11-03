import { useEffect, useState } from "react";
import { BrowserRouter, Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { api, ApiError, homeForRole } from "./api";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { jobService } from "./integrated/services/jobService";
import { ToastProvider } from "./integrated/components/common/Toast";
import JobsPage from "./integrated/pages/JobsPage";
import InternshipsPage from "./integrated/pages/InternshipsPage";
import ResourcesPage from "./integrated/pages/ResourcesPage";
import InterviewExperiencesPage from "./integrated/pages/InterviewExperiencesPage";
import SavedJobsPage from "./integrated/pages/SavedJobsPage";
import ApplicationsPage from "./integrated/pages/ApplicationsPage";
import RecruiterPostJobPage from "./integrated/pages/RecruiterPostJobPage";
import MentorshipPage from "./mentorship/pages/MentorshipPage";
import BookSessionPage from "./mentorship/pages/BookSessionPage";
import "./mentorship.css";
import "./integrated.css";
import "./App.css";
import "./site-glass.css";
import "./integrated-overrides.css";
import "./profile.css";

const categories = [["Internships", "💼"], ["Jobs", "🔎"], ["Competitions", "🏆"], ["Mock Tests", "🧩"], ["Mock Interviews", "🧑‍💻"], ["Hackathons", "⌨️"], ["Mentorships", "🤝"]];

function App() {
  return <BrowserRouter><AuthProvider><ToastProvider><AppRoutes/></ToastProvider></AuthProvider></BrowserRouter>;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { pathname: path } = useLocation();
  const go = (to) => { navigate(to); window.scrollTo(0, 0); };
  let page = <CandidateHome go={go} />;
  if (path === "/login") page = <Guest user={user} loading={loading} go={go}><Login go={go}/></Guest>;
  if (path === "/signup") page = <Guest user={user} loading={loading} go={go}><Signup go={go}/></Guest>;
  if (path === "/recruiter") page = <Protected user={user} loading={loading} allow="recruiter" go={go}><Dashboard type="recruiter"/></Protected>;
  if (path === "/admin") page = <Protected user={user} loading={loading} allow="admin" go={go}><Dashboard type="admin"/></Protected>;
  if (path === "/profile") page = <Protected user={user} loading={loading} allow="candidate" go={go}><Profile go={go}/></Protected>;
  if (path === "/resume-builder") page = <Protected user={user} loading={loading} allow="candidate" go={go}><ResumeBuilder go={go}/></Protected>;
  if (path === "/jobs") page = <SitePage go={go}><JobsPage/></SitePage>;
  if (path === "/internships") page = <SitePage go={go}><InternshipsPage/></SitePage>;
  if (path === "/resources" || path === "/prepzone") page = <SitePage go={go}><ResourcesPage/></SitePage>;
  if (path === "/articles") page = <SitePage go={go}><InterviewExperiencesPage/></SitePage>;
  if (path === "/saved-jobs") page = <Protected user={user} loading={loading} allow="candidate" go={go}><SitePage go={go}><SavedJobsPage/></SitePage></Protected>;
  if (path === "/applications") page = <Protected user={user} loading={loading} allow="candidate" go={go}><SitePage go={go}><ApplicationsPage/></SitePage></Protected>;
  if (path === "/recruiter/jobs/new") page = <Protected user={user} loading={loading} allow="recruiter" go={go}><SitePage go={go}><RecruiterPostJobPage/></SitePage></Protected>;
  if (path === "/mentorship") page = <SitePage go={go}><MentorshipPage/></SitePage>;
  if (/^\/mentorship\/[^/]+\/book$/.test(path)) page = <Protected user={user} loading={loading} allow="candidate" go={go}><SitePage go={go}><BookSessionPage/></SitePage></Protected>;
  return page;
}

function SitePage({ go, children }) { return <div className="candidate-page"><section className="candidate-hero nav-only-shell"><Nav go={go}/></section><main className="integrated-page">{children}</main><Footer/></div>; }

function Nav({ go }) { const { user, logout } = useAuth(); async function signOut() { try { await logout(); } finally { go("/"); } } return <header className="candidate-nav"><button className="brand-mark" onClick={() => go("/")}><i>◐</i>Career<span>Hub</span></button><nav className="nav-links"><NavLink to="/" end>Home</NavLink><NavLink to="/jobs">Jobs</NavLink><NavLink to="/internships">Internships</NavLink><NavLink to="/mentorship">Mentorship</NavLink><div className="prepzone"><button type="button">Prepzone<svg className="prep-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="m3 6 5 5 5-5"/></svg></button><div className="prep-menu"><a href="/resume-builder">Resume builder</a><a href="/articles">Articles</a><a href="/resources">Resources</a></div></div><NavLink to="/applications">My Activity</NavLink></nav>{user ? <div className="account"><button className="profile-button" onClick={() => go(user.role === "candidate" ? "/profile" : homeForRole(user.role))}><span>{user.name?.[0]?.toUpperCase()}</span><b>{user.name?.split(" ")[0]}</b></button><button className="logout" onClick={signOut}>Log out</button></div> : <button className="profile-button" onClick={() => go("/login")}><span>U</span><b>Profile</b></button>}</header>; }

function CandidateHome({ go }) {
  const [homeJobs, setHomeJobs] = useState([]);
  const [homeInternships, setHomeInternships] = useState([]);
  useEffect(() => {
    let mounted = true;
    jobService.getJobs({ sort: 'newest' }).then((result) => {
      if (!mounted) return;
      const listings = result.data || [];
      setHomeJobs(listings.filter((job) => job.employmentType !== 'Internship'));
      setHomeInternships(listings.filter((job) => job.employmentType === 'Internship'));
    }).catch(() => {
      if (mounted) { setHomeJobs([]); setHomeInternships([]); }
    });
    return () => { mounted = false; };
  }, []);
  return <div className="candidate-page"><section className="candidate-hero" id="home"><Nav go={go}/><div className="hero-content"><p className="eyebrow">YOUR FUTURE STARTS HERE</p><h1>Unlock your <em>next</em> opportunity.</h1><p>Discover internships, jobs and experiences that move your career forward.</p><div><button className="orange-button" onClick={() => go("/signup")}>Explore opportunities →</button><a href="#internships" className="text-button">Browse internships</a></div></div></section><main className="candidate-main"><section><div className="section-top"><h2>Unlock Your <span>Career!</span></h2><p>⚡ Access to 32M+ profiles</p></div><div className="category-row">{categories.map(([name, icon]) => <a href="#internships" className="category-card" key={name}><b>{name}</b><span>{icon}</span></a>)}</div></section><section className="trust-section"><h2><span>Trusted</span> by Industry Veterans</h2><div><b>PEPSICO</b><b>Reliance</b><b>SAMSUNG</b><b>snapdeal</b><b>TATA</b><b>HERO</b><b>ABInBev</b></div></section><section id="activity"><Heading title="My Activity" caption="Keep track of your applications and registrations."/><div className="activity-box"><div className="tabs"><button className="active">Registrations</button><button>Watchlist</button><button>Recently viewed</button><button>My rounds</button></div><div className="activity-cards"><Activity title="Event Representative" company="Ecosphere.Media" mark="◈"/><Activity title="Amazon ML Challenge" company="Amazon" mark="A"/></div></div></section><Opportunities id="internships" title="Internships" caption="Unleash internships tailored to your aspirations." cards={homeInternships} href="/internships"/><Opportunities id="jobs" title="Jobs" caption="Unveil jobs designed for your next big move." cards={homeJobs} href="/jobs"/><section className="profiles-section"><p>Profiles</p><h2><span>32</span>Million<span>+</span></h2><div className="metrics">{[["Assessments", "22.3M+"], ["Opportunities", "140K+"], ["Organisations", "42K+"], ["Brands trust us", "800+"], ["Countries", "78+"]].map(([label, value]) => <div key={label}><p>{label}</p><b>{value}</b></div>)}</div></section></main><Footer/></div>; }
function Heading({ title, caption }) { return <div className="section-heading"><div><h2>{title}</h2><p>{caption}</p></div><a href="#home">View all →</a></div>; }
function Activity({ title, company, mark }) { return <div className="activity-card"><span>{mark}</span><div><b>{title}</b><small>{company}</small></div></div>; }
function Opportunities({ id, title, caption, cards, href }) {
  return <section className="opportunity-section" id={id}><Heading title={title} caption={caption}/><div className="opportunity-grid">{cards.map((job) => {
    const titleText = job.title || job.name || 'Opportunity';
    const company = job.companyName || job.company || 'Company';
    const compensation = job.stipendOrSalary?.display || (job.stipendOrSalary?.min ? `${job.stipendOrSalary.currency || '₹'} ${job.stipendOrSalary.min} - ${job.stipendOrSalary.max} / ${job.stipendOrSalary.period || 'month'}` : `${job.daysLeft || 0} days left`);
    return <Link className="opportunity-card" to={href} key={job._id || titleText} aria-label={`View ${titleText} on ${title}`}><div className="opportunity-top"><span>{company.charAt(0).toUpperCase()}</span><div><h3>{titleText}</h3><p>{company}</p></div></div><p className={String(compensation).includes("₹") ? "pay" : "deadline"}>{compensation}</p><small>⌖ &nbsp; {job.location || job.workMode || 'Location not specified'}</small></Link>;
  })}</div></section>;
}
function Footer() { return <footer className="candidate-footer"><div className="footer-intro"><div className="brand-mark"><i>◐</i>Career<span>Hub</span></div><p>Built with <em>♥</em> in India for the world</p></div><div className="footer-grid"><Foot title="Products" links={["Engage Talent", "AI Sourcing Agent", "AI Interview Agent"]}/><Foot title="Participate" links={["Competitions", "Assessments", "Hackathons", "Workshops"]}/><Foot title="Learn" links={["Courses", "Articles", "Resources"]}/><Foot title="Mentorship" links={["Be a Mentor", "Explore Mentors", "Mentorship FAQs"]}/><div><h3>Stay Updated</h3><p>Get regular opportunity updates and get hired.</p><div className="subscribe">Your email <button>→</button></div></div></div></footer>; }
function Foot({ title, links }) { return <div><h3>{title}</h3>{links.map((link) => <a href="#home" key={link}>{link}</a>)}</div>; }

function Guest({ user, loading, go, children }) { if (loading) return <Loader/>; if (user) return <Redirect go={go} to={homeForRole(user.role)}/>; return children; }
function Protected({ user, loading, allow, go, children }) { if (loading) return <Loader/>; if (!user) return <Redirect go={go} to="/login"/>; if (user.role !== allow) return <Redirect go={go} to={homeForRole(user.role)}/>; return children; }
function Redirect({ go, to }) { useEffect(() => go(to), [go, to]); return <Loader/>; }
function Loader() { return <div className="loader">Checking your session...</div>; }
function Login({ go }) { const { login } = useAuth(); const [role, setRole] = useState("candidate"); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); async function submit(event) { event.preventDefault(); try { const user = await login({ email, password, role }); go(homeForRole(user.role)); } catch (err) { setError(err instanceof ApiError ? err.message : "Unable to log in."); } } return <AuthPage title="Welcome back" sub="Choose your role, then enter your email and password."><RoleButtons role={role} setRole={setRole} admin/><form onSubmit={submit}><Input label="Email" type="email" value={email} setValue={setEmail}/><Input label="Password" type="password" value={password} setValue={setPassword}/>{error && <p className="form-error">{error}</p>}<button className="form-submit">Continue as {role}</button></form><p className="switch">New here? <button onClick={() => go("/signup")}>Create an account</button></p></AuthPage>; }
function Signup({ go }) { const { signup } = useAuth(); const [role, setRole] = useState("candidate"); const [form, setForm] = useState({ name: "", email: "", college: "", dob: "", password: "" }); const [error, setError] = useState(""); const update = (key) => (value) => setForm({ ...form, [key]: value }); async function submit(event) { event.preventDefault(); try { const user = await signup({ ...form, role }); go(homeForRole(user.role)); } catch (err) { setError(err instanceof ApiError ? err.message : "Unable to create account."); } } return <AuthPage title="Create your account" sub="Find your next opportunity with CareerHub."><RoleButtons role={role} setRole={setRole}/><form onSubmit={submit}><Input label="Name" value={form.name} setValue={update("name")}/><Input label="Email" type="email" value={form.email} setValue={update("email")}/><Input label="College / Organisation" value={form.college} setValue={update("college")}/><Input label="Date of birth" type="date" value={form.dob} setValue={update("dob")}/><Input label="Password" type="password" value={form.password} setValue={update("password")}/>{error && <p className="form-error">{error}</p>}<button className="form-submit">Create account</button></form><p className="switch">Already registered? <button onClick={() => go("/login")}>Log in</button></p></AuthPage>; }
function AuthPage({ title, sub, children }) { return <main className="auth-page"><section className="auth-card"><div className="auth-logo">◐ Career<span>Hub</span></div><h1>{title}</h1><p>{sub}</p>{children}</section></main>; }
function RoleButtons({ role, setRole, admin = false }) { return <div className="role-buttons">{["candidate", "recruiter", ...(admin ? ["admin"] : [])].map((item) => <button type="button" className={role === item ? "selected" : ""} onClick={() => setRole(item)} key={item}>{item}</button>)}</div>; }
function Input({ label, type = "text", value, setValue }) { return <label>{label}<input type={type} value={value} onChange={(event) => setValue(event.target.value)} required minLength={type === "password" ? 8 : undefined}/></label>; }
function Dashboard({ type }) { const { user } = useAuth(); return <main className="dashboard"><h1>{type === "admin" ? "Admin dashboard" : `Hello, ${user.name}`}</h1><p>You are signed in as a {type}. This page is protected by your JWT session.</p></main>; }
function Profile({ go }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(user);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { api("/api/candidate/profile").then(({ user: saved }) => { setProfile(saved); setDraft(saved); }).catch((err) => setError(err.message)); }, []);
  function update(field, value) { setDraft((current) => ({ ...current, [field]: value })); }
  async function save(event) {
    event.preventDefault(); setSaving(true); setError("");
    try { const { user: saved } = await api("/api/candidate/profile", { method: "PATCH", body: draft }); setProfile(saved); setDraft(saved); setEditing(false); }
    catch (err) { setError(err.message || "Could not save your details."); }
    finally { setSaving(false); }
  }
  return <main className="profile-page">
    <header className="profile-toolbar"><button onClick={() => go("/")} aria-label="Go back">←</button><span>Candidate profile</span></header>
    <div className="profile-layout">
      <aside className="profile-sidebar">
        <section className="profile-summary"><div className="profile-avatar">{profile.name?.[0]?.toUpperCase() || "C"}</div><h1>{profile.name}</h1><p>{profile.headline || "Add a professional headline"}</p><p>{profile.college}</p><p>{profile.location}</p><button className="profile-primary" onClick={() => { setDraft(profile); setError(""); setEditing(true); }}>Personal &amp; Professional Details</button></section>
        <button className="resume-cta" onClick={() => go("/resume-builder")}>＋ &nbsp; Create your Resume</button>
      </aside>
      <section className="profile-details"><div className="profile-section-head"><div><span>PROFILE</span><h2>Personal &amp; Professional Details</h2></div><button onClick={() => { setDraft(profile); setError(""); setEditing(true); }}>Edit details</button></div>
        <div className="profile-info-grid"><Info label="Full name" value={profile.name}/><Info label="Email" value={profile.email}/><Info label="Date of birth" value={profile.dob ? new Date(profile.dob).toLocaleDateString() : ""}/><Info label="College" value={profile.college}/><Info label="Phone" value={profile.phone}/><Info label="Pronouns" value={profile.pronouns}/><Info label="Location" value={profile.location}/><Info label="Current address" value={profile.currentAddress}/><Info label="Permanent address" value={profile.permanentAddress}/><Info label="Professional headline" value={profile.headline}/><Info label="Degree" value={profile.degree}/><Info label="Field of study" value={profile.fieldOfStudy}/><Info label="Graduation year" value={profile.graduationYear}/><Info label="Current role" value={profile.currentTitle}/><Info label="Organization" value={profile.currentOrganization}/><Info label="Experience" value={profile.yearsExperience}/><div className="profile-info full"><span>Professional summary</span><p>{profile.professionalSummary || "Add a short introduction about yourself."}</p></div></div>
        <button className="resume-secondary" onClick={() => go("/resume-builder")}>Create your Resume <span>→</span></button>
      </section>
    </div>
    {error && <p className="profile-error">{error}</p>}
    {editing && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditing(false); }}><form className="profile-modal" onSubmit={save}><div className="modal-heading"><div><span>EDIT PROFILE</span><h2>Personal &amp; Professional Details</h2></div><button type="button" onClick={() => setEditing(false)} aria-label="Close">×</button></div><div className="modal-fields"><h3>Personal details</h3><ProfileInput label="Full name" value={draft.name} disabled/><ProfileInput label="Email" value={draft.email} disabled/><ProfileInput label="College" value={draft.college} disabled/><ProfileInput label="Date of birth" value={draft.dob ? new Date(draft.dob).toISOString().slice(0,10) : ""} disabled/><ProfileInput label="Phone" value={draft.phone} onChange={(v) => update("phone",v)} type="tel"/><ProfileInput label="Pronouns" value={draft.pronouns} onChange={(v) => update("pronouns",v)}/><ProfileInput label="Location" value={draft.location} onChange={(v) => update("location",v)}/><ProfileInput label="Current address" value={draft.currentAddress} onChange={(v) => update("currentAddress",v)}/><ProfileInput label="Permanent address" value={draft.permanentAddress} onChange={(v) => update("permanentAddress",v)}/><h3>Professional details</h3><ProfileInput label="Professional headline" value={draft.headline} onChange={(v) => update("headline",v)}/><ProfileInput label="Degree" value={draft.degree} onChange={(v) => update("degree",v)}/><ProfileInput label="Field of study" value={draft.fieldOfStudy} onChange={(v) => update("fieldOfStudy",v)}/><ProfileInput label="Graduation year" value={draft.graduationYear} onChange={(v) => update("graduationYear",v)} type="number"/><ProfileInput label="Current role" value={draft.currentTitle} onChange={(v) => update("currentTitle",v)}/><ProfileInput label="Organization" value={draft.currentOrganization} onChange={(v) => update("currentOrganization",v)}/><ProfileInput label="Years of experience" value={draft.yearsExperience} onChange={(v) => update("yearsExperience",v)}/><label className="profile-field full">Professional summary<textarea maxLength={1000} value={draft.professionalSummary || ""} onChange={(e) => update("professionalSummary",e.target.value)} placeholder="Briefly introduce your professional background"/></label></div>{error && <p className="profile-error">{error}</p>}<div className="modal-actions"><button type="button" className="cancel-button" onClick={() => setEditing(false)}>Cancel</button><button className="profile-primary" disabled={saving}>{saving ? "Saving..." : "Save details"}</button></div></form></div>}
  </main>;
}
function Info({ label, value }) { return <div className="profile-info"><span>{label}</span><p>{value || "Not added yet"}</p></div>; }
function ProfileInput({ label, value, onChange, disabled = false, type = "text" }) { return <label className="profile-field">{label}<input type={type} value={value || ""} disabled={disabled} onChange={(event) => onChange?.(event.target.value)}/></label>; }
function ResumeBuilder({ go }) { return <main className="resume-builder"><button className="resume-back" onClick={() => go("/profile")}>← Back to profile</button><div className="resume-empty"><span>✦</span><h1>Resume Builder</h1><p>Your resume workspace will be available here soon.</p></div></main>; }
export default App;

