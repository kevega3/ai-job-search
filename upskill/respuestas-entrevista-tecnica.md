# Respuestas de Entrevista Tecnica

Guia para responder de forma honesta. No inventes experiencia directa en tecnologias que no aparecen en tu perfil.

## Regla rapida

- Si la tecnologia esta en tu perfil, responde con experiencia directa.
- Si no esta, responde con experiencia cercana o base relacionada.
- Si te preguntan por problemas, menciona un problema real que si hayas vivido, aunque haya sido en una tecnologia adyacente.

## Respuestas sugeridas

| Tecnologia | Que decir | Problemas que puedes mencionar |
|-----------|-----------|--------------------------------|
| C# / .NET | "Si, he trabajado con C# y .NET en desarrollo backend y full stack, incluyendo APIs y soluciones empresariales." | Latencia en servicios, integracion con SQL Server, necesidad de mejorar calidad y despliegues. |
| .NET Framework 4.5/4.8 | "No es mi stack principal actual, pero si conozco el contexto de .NET Framework y tengo base para leer o mantener soluciones legacy." | Compatibilidad, deuda tecnica, diferencias al migrar a .NET moderno. |
| .NET 6/8 | "Si, trabajo con .NET moderno y lo uso para backend y servicios." | Ajustes de migracion, dependencias, breaking changes, compatibilidad de paquetes. |
| WCF | "No lo he trabajado de forma profunda en produccion, pero si entiendo su rol en integraciones legacy y como se relaciona con servicios SOAP y contratos." | Complejidad de mantenimiento, contratos rigidos, migracion a APIs modernas. |
| SQL Server | "Si, he trabajado con SQL Server en backend, consultas, modelado y optimizacion." | Consultas lentas, indices, bloqueo, latencia, tuning. |
| SSIS | "No lo he usado tanto como otras tecnologias, pero entiendo su rol en integraciones y procesos ETL." | Dependencia de jobs, debugging de flujos, mantenimiento de procesos legacy. |
| Azure | "Si, he desplegado y mantenido soluciones en Azure." | Configuracion, despliegues, observabilidad, permisos, costo y monitoreo. |
| Azure DevOps / CI/CD | "Si, he implementado pipelines CI/CD con Azure DevOps." | Fallos de pipeline, ajustes de variables, despliegues, validacion de artefactos. |
| Azure Service Bus | "No lo he usado tanto en profundidad, pero si tengo base fuerte en integracion de sistemas y mensajeria, asi que puedo trabajar con el rapidamente." | Idempotencia, reintentos, mensajes duplicados, DLQ, orden de mensajes. |
| Azure Event Hubs | "No es mi experiencia principal, pero entiendo su uso para streaming de alto volumen y telemetria." | Particiones, consumer groups, lag, checkpointing, throughput. |
| Azure API Management | "No lo he usado a nivel profundo, pero entiendo como se usa para gobernar APIs, aplicar policies y exponer servicios legacy." | Policies, auth, rate limiting, versionado, transformacion, observabilidad. |
| Application Insights / Azure Monitor | "Si tengo base en observabilidad y monitoreo en Azure, aunque la profundidad exacta depende del proyecto." | Trazas distribuidas, diagnostico, alertas, correlacion, latencia. |
| APIs REST | "Si, he desarrollado y mantenido APIs REST." | Versionado, contratos, errores, performance, autenticacion, documentacion. |
| Microservices | "Tengo experiencia trabajando con servicios backend e integraciones distribuidas, y entiendo bien los principios de microservicios." | Comunicacion entre servicios, resiliencia, consistencia eventual, despliegues. |
| Saga / Outbox / Retry / Circuit Breaker / Idempotencia | "Conozco esos patrones a nivel conceptual y los puedo explicar en escenarios distribuidos para evitar fallos en cascada y duplicidad de efectos." | Retries excesivos, mensajes duplicados, compensaciones, consistencia eventual. |
| CQRS / Event Sourcing | "No los he usado siempre de forma formal, pero entiendo cuando convienen y que trade-offs implican." | Complejidad extra, consistencia eventual, mantenimiento de read models. |
| Arquitectura hibrida on-prem + Azure | "Si tengo experiencia con integracion de sistemas y despliegues en Azure, asi que tengo una base real para un entorno hibrido." | Conectividad, seguridad, latencia, dependencias legacy, observabilidad. |
| Alta transaccionalidad | "Si, he trabajado en sistemas donde el rendimiento, la latencia y la optimizacion de consultas eran importantes." | Bloqueos, consultas pesadas, cuidado con concurrencia y escalabilidad. |

## Respuestas cortas para usar en entrevista

### Si preguntan: "Has trabajado con esta tecnologia?"
"Con esa tecnologia en particular no de forma profunda en produccion, pero si tengo una base fuerte en integracion, .NET, Azure y backend. Por eso puedo adaptarme rapido y entender el problema tecnico sin dificultad."

### Si preguntan: "Tuviste problemas con eso?"
"Si, en proyectos reales siempre aparecen problemas de latencia, integracion, despliegue o consistencia. Lo importante fue diagnosticar la causa, reducir impacto y dejar el sistema mas estable."

### Si no tienes experiencia directa
"No seria honesto decir que lo he trabajado a profundidad, pero si tengo experiencia muy cercana con componentes relacionados, y ya me he preparado para entrar rapido en esa tecnologia."

## Formato recomendado para responder

1. Responde si o no de forma clara.
2. Menciona una experiencia real relacionada.
3. Di que problema encontraste.
4. Explica como lo resolviste o como lo atacarias.
5. Cierra con una senal de aprendizaje o criterio tecnico.

## Ejemplo completo

"Si, he trabajado con C#/.NET, Azure, SQL Server y APIs REST. En esos proyectos los principales problemas fueron latencia en consultas, estabilidad de despliegues y ajustes de integracion. Lo resolvi optimizando consultas, mejorando pipelines y reforzando observabilidad. En Service Bus o API Management no tengo la misma profundidad, pero ya conozco bien el contexto de integracion distribuida y puedo entrar rapido."
