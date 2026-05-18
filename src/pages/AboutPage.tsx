export function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 my-4">
      <h1 className="text-3xl font-extrabold text-slate-800 mb-4">About Pokemon App</h1>
      
      <p className="text-slate-600 leading-relaxed mb-6">
        This is a React-based Explorer application powered by the PokeAPI. 
        It allows users to search for their favorite Pokemons, view comprehensive details, 
        and browse through pages smoothly using routing and caching mechanisms.
      </p>

      <hr className="border-slate-100 my-6" />

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-700 mb-2">Author Information</h2>
          <p className="text-slate-600 mb-3">
            Developed with dedication as part of the RS School React Course.
          </p>
          <a
            href="https://online-cv-gold.vercel.app/CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors"
          >
            {"View Author's CV"}
          </a>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-700 mb-2">Course Information</h2>
          <p className="text-slate-600 mb-3">
            Built following the high standards and best practices taught at The Rolling Scopes School.
          </p>
          <a
            href="https://rs.school/courses/reactjs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors"
          >
            RS School React Course ↗
          </a>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;