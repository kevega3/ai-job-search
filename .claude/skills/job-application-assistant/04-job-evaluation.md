# Job Evaluation Framework

<!-- Partially personalized from CV PDF. Career-motivation and behavioral sections still need interview input. -->

## Scoring Dimensions

Evaluate each job posting against these five dimensions:

### 1. Technical Skills Match (0-100)
How well do the required/preferred skills align with the candidate's capabilities?

| Score | Meaning |
|-------|---------|
| 80-100 | Core requirements are primary skills |
| 60-79 | Most requirements match, 1-2 gaps that are learnable |
| 40-59 | Partial match, significant upskilling needed |
| 0-39 | Fundamental mismatch |

**Strong match areas:** C#, .NET, Azure, SQL Server, React, Full Stack development, backend APIs, CI/CD, Azure DevOps, HealthTech interoperability, HL7 FHIR
**Moderate match areas:** Next.js, Node.js, Blazor, MySQL, MongoDB, Docker, Node-RED, automated testing, Scrum
**Weak match areas:** Any stack or domain not evidenced in the CV should be treated as a gap until confirmed

### 2. Experience Match (0-100)
Does work history align with what they're looking for?

| Score | Meaning |
|-------|---------|
| 80-100 | Direct experience in the same domain and role type |
| 60-79 | Related experience, transferable skills clear |
| 40-59 | Adjacent experience, would need to make the case |
| 0-39 | Unrelated experience |

**Strong:** Software development roles using Microsoft stack, backend/API work, Azure deployments, SQL Server, React-based full stack work, HealthTech / clinical interoperability
**Moderate:** General JavaScript full stack roles, DevOps-adjacent roles, distributed systems integration
**Entry-level:** Roles demanding people management, extensive architecture ownership, or unverified niche stacks

### 3. Behavioral/Culture Fit (0-100)
Does the role and company culture match the behavioral profile?

| Score | Meaning |
|-------|---------|
| 80-100 | Culture strongly matches behavioral preferences |
| 60-79 | Mixed signals but mostly compatible |
| 40-59 | Some friction areas |
| 0-39 | Significant culture mismatch |

**Red flags to research:** Department disorganization, heavy maintenance with little product development, unclear engineering ownership, unrealistic on-call expectations, or strong soft-skill claims the CV cannot support yet.

### 4. Location & Logistics (Pass/Fail + Notes)
- Fully remote roles: PASS
- Hybrid in Bogotá: PASS
- Hybrid outside Bogotá: FAIL unless the user explicitly approves it
- On-site outside Bogotá: FAIL unless compensation clearly justifies it and the user approves it
- Requires relocation outside Bogotá: FLAG for user confirmation
- Frequent international travel: FLAG for user confirmation

### 4A. Language Filter (Pass/Fail)
- Spanish-only roles: PASS
- Vacancies where English is optional or only "nice to have": FLAG for manual review
- Vacancies requiring conversational English, advanced English, fluent English, or bilingual Spanish-English: FAIL

### 5. Career Alignment & Motivation (0-100)
Does this role advance career goals and contain tasks that energize?

| Score | Meaning |
|-------|---------|
| 80-100 | Strongly aligned with career direction, clear growth path |
| 60-79 | Good role but only partially aligned with long-term goals |
| 40-59 | Decent job but doesn't build toward career goals |
| 0-39 | Dead end or backwards step |

**Career goals:**
- Increase compensation above the current 4.000.000 COP monthly salary
- Continue growing in software engineering roles using .NET / Azure / SQL Server and modern full stack tools
- Prefer fully remote opportunities or hybrid opportunities only in Bogotá

**Motivation filter:** Evaluate not just whether the candidate *can* do the tasks, but whether the tasks likely build on the verified strengths below.
- Tasks likely aligned with verified strengths: Full Stack delivery, backend/API development, Azure deployment, SQL optimization, interoperability/integration work, quality-focused engineering
- Tasks that require confirmation: leadership preference, consulting-heavy stakeholder work, people management, sales-facing responsibilities
- Non-task factors: leadership style, department culture, company values, and autonomy still need user input

**Life situation alignment:** Consider personal constraints:
- **Security**: Prioritize roles paying above 4.000.000 COP monthly
- **Flexibility**: Prefer fully remote roles, or hybrid roles only in Bogotá
- **Professional development**: Likely aligned with Microsoft/.NET, cloud, full stack, and HealthTech-related growth based on the CV

### 6A. Hard Filters Before Recommending Apply
- Salary should be above 4.000.000 COP monthly when compensation is disclosed
- Virtual roles should be prioritized; hybrid roles are acceptable only in Bogotá
- Any role requiring relocation outside Bogotá should be treated as lower priority unless compensation clearly justifies it
- Any role requiring English or bilingual fluency should be discarded

### 6. Salary Benchmark (Optional)

If the salary lookup tool is configured (`salary_data.json` exists), look up the company:
```
python salary_lookup.py "<Company Name>" --json
```

If a city is known from the posting, add `--city "<City>"` to narrow results.

Present findings as:
```
### Salary Benchmark
| Metric | Value |
|--------|-------|
| [Category] index | XX.X (+/-X.X% vs baseline) |
| Overall index | XX.X (+/-X.X% vs baseline) |
```

Interpret results relative to the baseline defined in the data file's metadata. For index-based data, higher typically means above-market compensation.

If the salary tool is not configured, skip this section.

## Output Format

Present the evaluation as:

```
## Job Fit Evaluation: [Role] at [Company]

| Dimension | Score | Notes |
|-----------|-------|-------|
| Technical Skills | XX/100 | [brief note] |
| Experience Match | XX/100 | [brief note] |
| Behavioral Fit | XX/100 | [brief note] |
| Location | PASS/FAIL | [brief note] |
| Career Alignment | XX/100 | [brief note] |

**Overall Score: XX/100** (weighted average of scored dimensions)

### Verdict: [Strong Fit / Good Fit / Moderate Fit / Weak Fit / Poor Fit]

### Key Strengths for This Role
- [bullet points]

### Gaps to Address
- [bullet points]

### Recommendation
[1-2 sentences: apply/skip/apply with caveats]

### Company Research Checklist
- [ ] Checked company website (mission, values, recent news)
- [ ] Checked review sites (Glassdoor, Jobindex, etc.)
- [ ] Checked LinkedIn for team size, recent hires, connections
- [ ] Checked media for restructuring, growth, or workplace issues
- [ ] Identified network contacts who may know the team/manager
```

## Weighting
- Technical Skills: 30%
- Experience Match: 25%
- Behavioral Fit: 15%
- Career Alignment: 30%

(Location is pass/fail, not weighted)

## Thresholds
- **Strong Fit** (75+): Definitely apply, tailor everything
- **Good Fit** (60-74): Apply, address gaps in cover letter
- **Moderate Fit** (45-59): Consider carefully, discuss with user
- **Weak Fit** (30-44): Probably skip unless strategic reasons
- **Poor Fit** (<30): Skip

## Pre-Application: Call the Employer (Best Practice)

Before writing the application, consider whether the candidate should call the contact person listed in the posting. **Only call if there are substantive questions** - never call just to "be remembered."

### When to Suggest Calling
- The posting has unclear or ambiguous requirements
- It's unclear which competencies are essential vs. nice-to-have
- The role description is vague about day-to-day tasks
- There's a named contact person who invites questions

### Good Questions to Ask
- "What are the primary challenges in this role?"
- "How is time typically divided across the listed responsibilities?"
- "Which competencies are most critical for success in this position?"
- "What does success look like in the first 6-12 months?"

### Rules for the Call
- Prepare a 30-second "elevator pitch" about your background in case they ask
- The call's purpose is **gathering information**, not delivering a pitch
- Take notes - use what you learn to tailor the application
- Reference the conversation naturally in the cover letter ("After speaking with [name], I was especially drawn to...")