# Alternativas para ampliar búsquedas: Computrabajo y Empleo.com

Fecha: 2026-07-09

Objetivo: extender el flujo de búsqueda de vacantes más allá de LinkedIn, priorizando Computrabajo y Empleo.com.

## Hallazgos verificados

### Empleo.com
- `https://empleo.com/` responde 200.
- `https://empleo.com/jobs` responde 200.
- `https://empleo.com/jobs.rss` responde 200.
- La página de `/jobs` expone un formulario con parámetros:
  - `q`
  - `type[]`
  - `place`
  - `place_slug`
  - `salary_min`
  - `salary_max`
  - `remote`
  - `commit`
- También existen páginas por ubicación, por ejemplo:
  - `/s/colombia-empleos`
  - `/s/trabajos-a-distancia`

### Computrabajo
- `https://www.computrabajo.com/` responde 200.
- `https://co.computrabajo.com/` y `https://computrabajo.com.co/` responden 403 desde este entorno.
- El HTML de la home global muestra la lógica de búsqueda:
  - input de cargo con `data-su="/ofertas-de-trabajo/"`
  - selección de país vía links como `#Colombialink`
  - el JS construye búsquedas como `country_link + "trabajo-de-" + searchText`
- En este entorno, la ruta país específica parece ser el principal bloqueo operativo.

## Alternativas de implementación

### Opción A — Empleo.com primero, Computrabajo como fallback manual/externo

Implementación:
1. Crear un adaptador nuevo para Empleo.com.
2. Consumir primero `GET /jobs.rss` para un feed rápido y sencillo.
3. Para búsquedas filtradas, usar `GET /jobs` con los parámetros detectados.
4. Agregar páginas por ubicación como fuente secundaria.
5. Dejar Computrabajo fuera del primer corte hasta resolver el 403.

Ventajas:
- Rápido de implementar.
- Menos riesgo técnico.
- RSS facilita parsing limpio.

Desventajas:
- No cubre Computrabajo de inmediato.

### Opción B — Adapter dual para Computrabajo con fallback de búsqueda externa

Implementación:
1. Intentar buscar en Computrabajo con la URL de país y slug de cargo.
2. Si devuelve 403, hacer fallback a:
   - Google/Bing `site:co.computrabajo.com/trabajo-de-...`
   - o solicitar al usuario el texto/URL de la vacante.
3. Mantener Empleo.com como fuente directa.

Ventajas:
- Cubre Computrabajo sin bloquear todo el flujo.
- Mantiene la arquitectura de múltiples portales.

Desventajas:
- Más frágil.
- Depende de un motor de búsqueda externo o intervención manual.

### Opción C — Adaptadores por portal con detección automática de accesibilidad

Implementación:
1. Añadir una capa de “health check” por portal.
2. Si Empleo.com responde, usar su parser nativo.
3. Si Computrabajo responde 403, marcarlo como bloqueado y activar fallback automático.
4. Registrar el estado por portal en `NETWORK_ACCESS.md` o en un archivo de estado del scraper.

Ventajas:
- Más robusto para ejecuciones recurrentes.
- Evita romper el scrape completo por un portal bloqueado.

Desventajas:
- Requiere más trabajo de orquestación y mantenimiento.

## Recomendación

La mejor ruta para avanzar rápido es:

1. Implementar Empleo.com ya.
2. Dejar Computrabajo como segundo paso con fallback automático.
3. Si se necesita cobertura completa, agregar búsqueda externa por `site:` para Computrabajo mientras se resuelve el 403.

## Propuesta técnica concreta

### Empleo.com
- Fuente primaria: `https://empleo.com/jobs.rss`
- Fuente secundaria: `https://empleo.com/jobs?q=...&place_slug=...&remote=...`
- Parser: RSS + HTML de `/jobs`

### Computrabajo
- Fuente objetivo: `https://co.computrabajo.com/trabajo-de-<cargo>`
- Estado actual: bloqueado por 403 desde este entorno
- Fallback recomendado: búsqueda externa por `site:co.computrabajo.com/trabajo-de-...`

## Siguiente paso sugerido

Si quieres, el próximo paso práctico es que yo implemente primero el adaptador de Empleo.com en el repo y deje Computrabajo preparado como fallback bloqueado/externo.
