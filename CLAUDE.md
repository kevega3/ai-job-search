# Job Application Assistant for Kevins Vega Quiroga

<!-- Initial profile populated from the source CV PDF. Remaining Pending items require direct user confirmation. -->

## Role
This repo is a job application workspace. Codex acts as a career advisor and application assistant for Kevins Vega Quiroga, helping with:
1. **Job fit evaluation** - Assess job postings against your profile (skills, experience, behavioral traits)
2. **CV tailoring** - Adapt existing CV templates (LaTeX/moderncv) to target specific roles
3. **Cover letter writing** - Draft targeted cover letters using existing templates (LaTeX)
4. **Interview preparation** - Prepare answers, questions, and talking points for interviews
5. **Career strategy** - Advise on positioning and personal branding

## Candidate Profile

<!-- This section is auto-populated by /setup. You can also fill it in manually. -->

### Identity
- **Name:** Kevins Vega Quiroga
- **Location:** Bogotá D.C., Colombia
- **Phone:** +57 311 444 40 64
- **Email:** kevinsvegaquiroga@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/kevins-vega-quiroga-01a7b71ab/
- **GitHub:** https://github.com/kevega3?tab=repositories
- **Portfolio:** https://kevinsvega-react.vercel.app/
- **Languages:** Español
- **English:** No disponible; descartar vacantes que exijan inglés como requisito
- **Status:** Actualmente trabaja como dev soft junior en Bogotá
- **LinkedIn headline:** "Ingeniero de Desarrollo de Software"

### Education
- **Ingeniería de Software** (2025) - Fundación Universitaria Compensar
- **Tecnólogo en Análisis y Desarrollo de Sistemas** (2021) - Servicio Nacional de Aprendizaje (SENA)

### Professional Experience
- **Desarrollador de Software** (2021 - Actualidad) - **Cuenta de Alto Costo (CAC)** (Bogotá D.C., Colombia)
  - Diseña e implementa soluciones Full Stack con C#/.NET, Node.js y React.
  - Desarrolla APIs y servicios backend integrados con SQL Server.
  - Despliega soluciones en Azure y mantiene su ciclo de vida.
  - Optimiza consultas y modelado de datos para reducir latencia.
  - Implementa pipelines CI/CD con Azure DevOps y automatiza despliegues.
  - Mantiene interfaces en React y componentes en Blazor.
  - Integra pruebas automatizadas y prácticas de control de calidad.

### Technical Skills
- **Primary:** C#, .NET, Azure, SQL Server, React, Full Stack development, backend APIs, CI/CD, Azure DevOps
- **Secondary:** Next.js, Node.js, Blazor, JavaScript (ES6+), HTML5, CSS3, MySQL, MongoDB, Docker, Git, GitHub, Node-RED
- **Domain:** HealthTech, HL7 FHIR, interoperabilidad clínica, integración de sistemas distribuidos, automatización y calidad técnica
- **Software:** Azure App Services, Azure DevOps, SQL Server, MySQL, MongoDB, Docker

### Certifications
- AWS Academy Cloud Foundations - AWS Academy
- Microsoft Full-Stack Developer - Microsoft
- Scrum Fundamentals - ScrumStudy
- HL7 GOV FHIR CAMP - HL7 / organización HL7
- Full Stack React / API .NET C# / SQL Server - Udemy
- Analista y Calidad en .NET - Euroinnova
- Cero a Experto React - Udemy
- Cero a Experto JavaScript - Udemy
- FrontEnd Web Developer - Udemy
- SQL Bootcamp with MySQL & PHP - Udemy
- Developer Node-RED - Udemy
- Protección de Datos Personales - Escuela de Privacidad

### Publications
- No publications stated in the source CV.

### Awards
- No awards stated in the source CV.

### Behavioral Profile
- Pending - the CV does not provide enough evidence for a reliable behavioral assessment.
- **Strengths to present confidently:** verified technical delivery, full stack implementation, backend/API development, cloud deployment, SQL optimization, interoperability work
- **Growth areas:** Pending - not stated in the source CV
- **Thrives in:** modalidades virtuales y modalidades híbridas solo en Bogotá

### What Excites You
- Full Stack product delivery with C#/.NET, React, and Node.js
- HealthTech and clinical interoperability problems (HL7 FHIR)
- Distributed system integration, automation, and technical quality
- Cloud deployment and engineering process improvement with Azure DevOps / CI/CD
- Buscar oportunidades con un rango salarial superior al actual
- No hay un mínimo exacto definido más allá de superar la compensación actual; priorizar la mejor mejora salarial viable

### Target Sectors
- Abierto a cualquier sector
- Software engineering roles in Microsoft ecosystem teams (.NET / Azure / SQL Server)
- Full Stack web product teams using React + backend APIs
- No hay sectores a evitar por ahora

### Deal-breakers
- Priorizar ofertas con salario superior a 4.000.000 COP mensuales
- Priorizar modalidades virtuales o híbridas solo en Bogotá
- Evitar ofertas que exijan reubicación fuera de Bogotá sin compensación clara
- Descartar vacantes que exijan inglés conversacional, inglés avanzado o bilingüismo

## Repo Structure
- `cv/` - LaTeX CV variants (moderncv template, banking style)
- `cover_letters/` - LaTeX cover letters (custom cover.cls template)
- `.claude/skills/` - AI skill definitions for the application workflow
- `.agents/skills/` - Job search CLI tools

## Workflow for New Job Applications
1. User provides a job posting (URL or text)
2. **Always evaluate fit first**: skills match, experience match, behavioral/culture match. Present this assessment to the user before proceeding.
3. If good fit: create targeted CV (`cv/main_<company>.tex`) and cover letter (`cover_letters/cover_<company>_<role>.tex`)
4. **Verify both documents** (see Verification Checklist below)
5. Prepare interview talking points based on the role requirements and your strengths

**Important:** When mentioning agentic coding or AI tooling in CVs/cover letters, explicitly reference **Codex** by name.

## Verification Checklist
After creating or updating a CV or cover letter, re-read the generated file and verify **all** of the following before presenting to the user. Report the results as a pass/fail checklist.

### Factual accuracy
- [ ] All claims match actual profile (CLAUDE.md / candidate profile) - no fabricated skills, experience, or achievements
- [ ] Job titles, dates, company names, and locations are correct
- [ ] Contact details are correct
- [ ] All company-specific claims (partnerships, products, technology, expansions) have been independently verified via WebFetch/WebSearch - do not trust reviewer agent research without verification

### Targeting
- [ ] Profile statement / opening paragraph is tailored to the specific role (not generic)
- [ ] Skills and experience bullets are reframed to match the job requirements
- [ ] Key job requirements are addressed (with gaps acknowledged where relevant)
- [ ] Nice-to-have requirements are highlighted where there is a match

### Consistency
- [ ] CV follows the standard 2-page moderncv/banking format
- [ ] Cover letter uses cover.cls template and established structure
- [ ] Tone is consistent across CV and cover letter
- [ ] No contradictions between CV and cover letter content

### Quality
- [ ] No LaTeX syntax errors (balanced braces, correct commands)
- [ ] No spelling or grammar errors
- [ ] Agentic coding / AI tooling references mention **Codex** by name
- [ ] Cover letter is addressed to the correct person (or "Dear Hiring Manager" if unknown)
- [ ] Cover letter fits approximately one page

### Compiled PDF verification (MANDATORY - never skip)
Both documents MUST be compiled and visually inspected via the Read tool on the PDF output. "Looks fine in the .tex" is not acceptable - LaTeX page-break decisions are unpredictable. Iterate until these all pass:
- [ ] CV compiled with **lualatex** (pdflatex often fails on modern MiKTeX with fontawesome5 font-expansion errors). Cover letter compiled with **xelatex** (cover.cls requires fontspec).
- [ ] **CV is exactly 2 pages** - not 1, not 3
- [ ] **No orphaned `\cventry` titles** - a job/education title must never sit at the bottom of a page with its bullets spilling to the next page. Use `\needspace{5\baselineskip}` before each `\cventry` to prevent this, and `\enlargethispage{2-3\baselineskip}` to rescue a trailing section that just barely spills
- [ ] **Cover letter is exactly 1 page** - signature block must fit with the body, never overflow
- [ ] **Cover letter bullet font matches body font** - `\lettercontent{}` must not wrap `\begin{itemize}...\end{itemize}` (the command's trailing `\\` errors on `\end{itemize}`, and moving itemize outside loses the Raleway font). Standard pattern: close `\lettercontent{}`, then wrap the list in `{\raggedright\fontspec[Path = OpenFonts/fonts/raleway/]{Raleway-Medium}\fontsize{11pt}{13pt}\selectfont \begin{itemize}...\end{itemize}\par}`

### ATS & keyword verification (CV)
ATS parsers read the PDF's embedded text layer, not the rendered page. Extract it with `pdftotext -layout` and verify what a parser sees. `pdftotext` (poppler) is optional - if missing, skip the parseability items with a warning and check keyword coverage from the visual PDF read instead.
- [ ] CV text layer extracts cleanly - no `(cid:*)` markers, `�` replacement characters, or text visible in the PDF but absent from the extraction
- [ ] Email and phone appear as **literal text** in the extraction (icon-glyph noise like `MOBILE-ALT`/`Envelope` is harmless, but a contact detail carried only by an icon or hyperlink is invisible to ATS)
- [ ] Reading order of the extracted text matches the visual order (single-column stock template is safe; multi-column custom templates are where this breaks)
- [ ] Posting keywords covered or honestly absent - synonym-only matches tightened to the posting's exact term where truthfully applicable, keywords the profile genuinely supports added to experience bullets, genuine gaps left visible and **never stuffed**
