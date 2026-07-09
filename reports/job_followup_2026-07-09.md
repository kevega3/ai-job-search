# Seguimiento de vacantes por contratación de servicios / tiempo parcial - 2026-07-09

Objetivo: dar seguimiento a vacantes .NET / React / Node con modalidad freelance, contractor, part-time o prestación de servicios, priorizando Colombia/Bogotá y descartando ofertas que exijan inglés.

## Resumen rápido

- Se ejecutaron búsquedas reales sobre LinkedIn Jobs guest.
- Se filtraron vacantes con modalidad flexible/no tiempo completo.
- Se descartaron ofertas con inglés explícito como requisito.
- Se evitó duplicar ofertas ya presentes en `job_search_tracker.csv`.

## Vacantes relevantes encontradas

| # | Cargo | Empresa | Modalidad / señal | Ubicación | URL | Estado |
|---|---|---|---|---|---|---|
| 1 | Mobile App Developer (React Native / Python Django) | Sur Global | remote contractor; “set your own hours” | Bogotá, D.C., Colombia | https://co.linkedin.com/jobs/view/mobile-app-developer-react-native-python-django-at-sur-global-4432087177 | nuevo |
| 2 | Desarrollador Backend .NET 8 | Positivo S+ Latam | modalidad freelance | Bogotá, D.C., Colombia | https://co.linkedin.com/jobs/view/desarrollador-backend-net-8-at-positivo-s%2B-latam-4438100752 | ya registrado en tracker |

## Notas de descarte

Se revisaron otras vacantes contract/freelance, pero se descartaron por uno o más de estos motivos:

- Pedían inglés explícitamente.
- El stack estaba demasiado alejado del foco actual (.NET / React / Node).
- No había señal clara de contratación de servicios o tiempo parcial en el texto recuperado.

## Criterio de priorización usado

1. .NET primero.
2. React / Node como alternativas cercanas.
3. Modalidad freelance / contractor / prestación de servicios / part-time.
4. Bogotá o Colombia remoto.
5. Sin requisito explícito de inglés.

## Recomendación de seguimiento

- Prioridad alta: Positivo S+ Latam (.NET 8 freelance) porque encaja mejor con el perfil, aunque ya está en el tracker.
- Prioridad media: Sur Global por modalidad contractor, aunque el stack es menos alineado.
- Si se quiere ampliar el universo, conviene buscar en otras bolsas además de LinkedIn para encontrar más ofertas no full-time.

## Próximo paso sugerido

Revisar una de estas dos rutas:

- ampliar búsqueda a otras bolsas con filtro de contractor / freelance
- o hacer una segunda pasada solo para vacantes .NET freelance sin importar si ya quedaron registradas
