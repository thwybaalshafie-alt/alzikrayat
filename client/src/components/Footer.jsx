export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span>&copy; {new Date().getFullYear()} Alzikrayat — MERN Edition. All rights reserved.</span>
        <span>MongoDB · Express · React · Node.js · Gemini AI</span>
      </div>
    </footer>
  );
}
