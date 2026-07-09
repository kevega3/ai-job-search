# Ampliar Búsqueda con Empleo.com y Computrabajo Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Integrar Empleo.com y Computrabajo al flujo de búsqueda de vacantes, respetando políticas/bloqueos de sitios y evitando que un portal bloqueado rompa todo el scrape.

**Architecture:** Crear dos portal skills bajo `.agents/skills/` siguiendo el patrón existente de `linkedin-search`: cada portal tendrá CLI propia con comandos `search` y `detail`, helpers de fetch/parsing, tests y documentación. El flujo `/scrape` debe detectar accesibilidad por portal, usar Empleo.com como fuente directa, Computrabajo como fuente directa cuando responda y fallback seguro cuando devuelva 403/reset/rate-limit.

**Tech Stack:** Bun + TypeScript para CLIs de portales, fetch nativo, parsers HTML/RSS sin dependencias runtime, markdown para specs y `NETWORK_ACCESS.md` para matriz de acceso.

---

## Contexto verificado

### Empleo.com

Verificaciones actuales desde WSL:
- `https://empleo.com/jobs` responde HTTP 200.
- `https://empleo.com/jobs?q=desarrollador%20.net` responde HTTP 200.
- `https://empleo.com/jobs?q=desarrollador%20.net&remote=1` responde HTTP 200.
- `https://empleo.com/jobs.rss` responde HTTP 200, pero puede tener resets intermitentes; requiere retry/backoff.
- `https://empleo.com/s/colombia-empleos` responde HTTP 200.
- `https://empleo.com/s/trabajos-a-distancia` puede responder, pero también presentó reset intermitente.

Parámetros confirmados en `/jobs`:
- `q`: búsqueda por texto.
- `remote=1`: trabajos a distancia.
- `type[]=2242`: A tiempo completo.
- `type[]=2243`: A tiempo parcial.
- `type[]=2244`: Contrato.
- `type[]=2245`: Temporal.
- `type[]=2246`: Voluntario.
- `type[]=2247`: Prácticas.
- `place`, `place_slug`, `salary_min`, `salary_max` existen en el formulario.

Conclusión: Empleo.com es implementable de inmediato. RSS sirve como fuente amplia; `/jobs` sirve para filtros específicos.

### Computrabajo

Verificaciones actuales desde WSL:
- `https://www.computrabajo.com/` responde HTTP 200.
- `https://co.computrabajo.com/` respondió HTTP 200 con User-Agent de navegador, aunque antes había devuelto 403; se debe tratar como acceso protegido/intermitente.
- `https://computrabajo.com.co/` redirige a `https://co.computrabajo.com/` y respondió HTTP 200 en la verificación actual.
- `https://co.computrabajo.com/trabajo-de-desarrollador-net` respondió HTTP 200 y contiene enlaces de ofertas.
- Se verificó una oferta real accesible: `oferta-de-trabajo-de-desarrollador-backend-net-8-remoto-proyecto-freelance-900-horas...` respondió HTTP 200.

Riesgo: Computrabajo usa protecciones que pueden bloquear según headers, frecuencia, IP o comportamiento. No debe considerarse 100% estable.

Conclusión: Computrabajo puede implementarse como fuente directa con políticas conservadoras: User-Agent realista, bajo volumen, backoff, detección de 403/Cloudflare/challenge, y fallback sin scraping agresivo.

---

## Plan recomendado

### Fase 1: Actualizar matriz de acceso

**Objective:** Reflejar el estado real de Empleo.com y Computrabajo, incluyendo bloqueos intermitentes.

**Files:**
- Modify: `NETWORK_ACCESS.md`

**Steps:**
1. Agregar Empleo.com como “Reachable / intermittent resets”.
2. Agregar Computrabajo como “Guarded / intermittently reachable”.
3. Documentar que Computrabajo no debe reintentarse agresivamente si responde 403.
4. Documentar workaround: fallback a búsqueda externa o pegado manual de vacante.

**Verification:**
- Leer `NETWORK_ACCESS.md` y confirmar que no dice que Computrabajo está permanentemente bloqueado.
- Confirmar que el flujo recomienda saltar/fallback cuando hay 403.

---

### Fase 2: Crear skill CLI de Empleo.com

**Objective:** Añadir un portal nativo confiable para Empleo.com.

**Files:**
- Create: `.agents/skills/empleo-search/SKILL.md`
- Create: `.agents/skills/empleo-search/cli/package.json`
- Create: `.agents/skills/empleo-search/cli/tsconfig.json`
- Create: `.agents/skills/empleo-search/cli/src/cli.ts`
- Create: `.agents/skills/empleo-search/cli/src/helpers.ts`
- Create: `.agents/skills/empleo-search/cli/src/commands/search.ts`
- Create: `.agents/skills/empleo-search/cli/src/commands/detail.ts`
- Create: `.agents/skills/empleo-search/cli/tests/parsing.test.ts`

**CLI behavior:**
- `search --query <text> --remote remote --type contract|part-time|temporary|full-time --limit <n> --format json|table|plain`
- Mapear tipos:
  - `full-time -> type[]=2242`
  - `part-time -> type[]=2243`
  - `contract -> type[]=2244`
  - `temporary -> type[]=2245`
- `detail <url-or-slug> --format json|plain`

**Implementation notes:**
- Usar `/jobs` para búsqueda filtrada.
- Usar `/jobs.rss` como fallback o modo broad.
- Implementar `htmlFetch` con retries para `ECONNRESET`, 429 y 5xx.
- No fallar el proceso si RSS falla; devolver error estructurado y permitir que `/scrape` continúe con otros portales.
- Parser debe extraer: `id`, `title`, `company`, `location`, `url`, `employmentType`, `remote`, `date` si aparece.

**Verification commands:**
- `bun run .agents/skills/empleo-search/cli/src/cli.ts search -q "desarrollador .net" --remote remote --type contract --format json --limit 5`
- `bun run .agents/skills/empleo-search/cli/src/cli.ts search -q "desarrollador" --type part-time --format table --limit 5`
- `bun test --timeout 30000`
- `bun run typecheck` desde `.agents/skills/empleo-search/cli` si se define script.

---

### Fase 3: Crear skill CLI de Computrabajo con acceso conservador

**Objective:** Añadir Computrabajo sin violar restricciones ni romper el flujo cuando el sitio bloquee.

**Files:**
- Create: `.agents/skills/computrabajo-search/SKILL.md`
- Create: `.agents/skills/computrabajo-search/cli/package.json`
- Create: `.agents/skills/computrabajo-search/cli/tsconfig.json`
- Create: `.agents/skills/computrabajo-search/cli/src/cli.ts`
- Create: `.agents/skills/computrabajo-search/cli/src/helpers.ts`
- Create: `.agents/skills/computrabajo-search/cli/src/commands/search.ts`
- Create: `.agents/skills/computrabajo-search/cli/src/commands/detail.ts`
- Create: `.agents/skills/computrabajo-search/cli/tests/parsing.test.ts`

**CLI behavior:**
- `search --query <text> --country co --limit <n> --format json|table|plain`
- `detail <url> --format json|plain`

**URL strategy:**
- Normalizar query a slug:
  - `desarrollador .net` -> `desarrollador-net`
  - `full stack .net` -> `full-stack-net`
- Buscar en:
  - `https://co.computrabajo.com/trabajo-de-<slug>`
- Parsear enlaces:
  - `/ofertas-de-trabajo/oferta-de-trabajo-de-...`

**Security/blocking policy:**
- Usar User-Agent de navegador y `Accept-Language: es-CO`.
- Máximo 1 página por query en primera versión.
- No hacer scraping paralelo contra Computrabajo.
- Si aparece 403, 429, challenge HTML o reset repetido:
  - retornar JSON con `meta.blocked=true`, `reason`, `fallbackQuery`.
  - no reintentar más de 2 veces.
  - no pasar a WebSearch automáticamente salvo que el flujo general lo habilite.

**Verification commands:**
- `bun run .agents/skills/computrabajo-search/cli/src/cli.ts search -q "desarrollador .net" --country co --format json --limit 5`
- `bun run .agents/skills/computrabajo-search/cli/src/cli.ts detail "https://co.computrabajo.com/ofertas-de-trabajo/..." --format json`
- Simular bloqueo con URL inválida o mock de 403 en tests.

---

### Fase 4: Integrar ambos portales al flujo `/scrape`

**Objective:** Hacer que el workflow descubra y use automáticamente los nuevos portales.

**Files:**
- Modify: `.claude/skills/job-scraper/search-queries.md`
- Modify: `.claude/commands/scrape.md`
- Possibly modify: `.claude/skills/job-scraper/SKILL.md`

**Changes:**
1. Reemplazar queries danesas genéricas por Colombia/Bogotá:
   - `.NET contractor Colombia`
   - `desarrollador .NET freelance Bogotá`
   - `React contractor Colombia`
   - `Node.js freelance Colombia`
   - `prestación de servicios desarrollador Bogotá`
2. Añadir portales:
   - LinkedIn
   - Empleo.com
   - Computrabajo
3. Añadir regla: Computrabajo se ejecuta en modo conservador y sin paralelismo agresivo.
4. Añadir regla: si un portal está bloqueado, registrar skip reason y continuar.

**Verification:**
- `./bin/scrape "freelance contractor .net" -- --print-prompt` si aplica a prompt.
- Ejecutar CLIs individualmente antes de ejecutar `/scrape` completo.

---

### Fase 5: Deduplicación y seguimiento

**Objective:** Evitar duplicados entre LinkedIn, Empleo.com y Computrabajo.

**Files:**
- Modify or create: `job_scraper/seen_jobs.json` handling if not present.
- Possibly modify workflow docs only if logic remains agent-driven.

**Dedup keys:**
- URL canonical sin fragment `#...`.
- `company + normalized title`.
- Para Computrabajo, eliminar fragmentos `#lc=...`.
- Para Empleo.com, usar slug `/jobs/<slug>`.

**Verification:**
- Dos portales que apunten a la misma empresa/cargo no deben mostrarse como duplicados si URL distinta pero `company+title` igual.
- Si una URL ya existe en `job_search_tracker.csv`, debe saltarse.

---

## Riesgos y mitigaciones

1. **Bloqueos de Computrabajo**
   - Mitigación: bajo volumen, User-Agent, backoff, detección de challenge, fallback.

2. **Resets intermitentes en Empleo.com RSS**
   - Mitigación: retries con backoff y fallback a `/jobs`.

3. **Cambios de HTML**
   - Mitigación: tests con fixtures HTML/RSS guardados.

4. **Ofertas que piden inglés oculto en detalle**
   - Mitigación: siempre ejecutar `detail` antes de rankear; filtrar `english|inglés|bilingual|bilingüe`.

5. **Términos de uso / políticas anti-bot**
   - Mitigación: uso personal, bajo volumen, no scraping masivo, no bypass de challenges, no paralelizar Computrabajo.

---

## Orden recomendado de ejecución

1. Actualizar `NETWORK_ACCESS.md`.
2. Implementar y probar `empleo-search`.
3. Implementar y probar `computrabajo-search` en modo conservador.
4. Integrar ambos en docs/workflow de `/scrape`.
5. Ejecutar una búsqueda controlada con 2-3 queries.
6. Actualizar `reports/job_followup_2026-07-09.md` con resultados nuevos.

---

## Criterio de éxito

- Empleo.com devuelve resultados JSON para `desarrollador .net`, `contract` y/o `part-time` sin romper.
- Computrabajo devuelve resultados JSON cuando está accesible, o devuelve un error estructurado `blocked=true` cuando no.
- `/scrape` continúa aunque Computrabajo esté bloqueado.
- Las vacantes finales se filtran por:
  - .NET / React / Node.
  - remoto Colombia o Bogotá.
  - freelance / contractor / prestación de servicios / part-time.
  - sin inglés explícito.
