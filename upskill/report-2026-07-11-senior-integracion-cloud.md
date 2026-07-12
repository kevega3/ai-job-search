# Upskill Report - 2026-07-11
**Mode:** Targeted: Profesional senior en integración de sistemas y arquitectura de soluciones cloud @ Empresa no especificada

---

## Gap Heatmap

| Priority | Skill / Area | Type | Gap Source |
|----------|-------------|------|------------|
| Critical | Azure Service Bus: queues, topics, DLQ, sessions, transactions, managed identity | Hard | Oferta directa |
| Critical | Azure API Management: gateway, policies, self-hosted gateway, hybrid exposure | Hard | Oferta directa |
| Critical | WCF y .NET Framework 4.5/4.8 en escenarios legacy | Hard | Oferta directa |
| High | Azure Event Hubs: partitions, consumer groups, checkpointing, throughput | Hard | Oferta directa |
| High | Patrones de resiliencia: Retry, Circuit Breaker, Idempotency | Hard | Oferta directa |
| High | Observability: Application Insights y Azure Monitor | Hard | Oferta directa |
| Medium | SSIS e integraciones ETL/legacy | Hard | Oferta directa |
| Medium | Saga, CQRS y compensating transactions | Hard | Oferta directa |
| Medium | Diseño para alta transaccionalidad y concurrencia en SQL Server | Hard | Oferta directa + rol senior |
| Medium | Arquitectura híbrida on-premise + Azure y migración productiva | Domain | LLM synthesis |

---

## Plan de Estudio

### Stack Microsoft Legacy

**WCF y modernización de .NET** `[Hard]` - ~8h
- [What Is Windows Communication Foundation - WCF](https://learn.microsoft.com/en-us/dotnet/framework/wcf/whats-wcf) - base para hablar de contratos, endpoints, bindings y SOAP en entrevistas
- [Upgrade .NET apps overview](https://learn.microsoft.com/en-us/dotnet/core/porting/) - útil para explicar migración desde .NET Framework a .NET moderno

Direccion de estudio: ya tienes base fuerte en .NET moderno; enfocate en que aporta WCF en legacy, como se integra con sistemas existentes y que cambia al migrar. Prepara una explicacion clara de los limites de .NET Framework vs .NET 6/8.

### Integracion y Mensajeria en Azure

**Azure Service Bus** `[Hard]` - ~6h
- [Introduction to Azure Service Bus Messaging](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-messaging-overview) - cubre queues, topics, sessions, DLQ y transacciones
- Revisa los apartados de duplicate detection, dead-lettering y security en la misma guía

Direccion de estudio: aprende a justificar cuando usar Service Bus y cuando no. Practica explicar mensajeria confiable, desacople, procesamiento idempotente y manejo de retries sin duplicar efectos.

**Azure API Management** `[Hard]` - ~5h
- [Azure API Management - Overview and Key Concepts](https://learn.microsoft.com/en-us/azure/api-management/api-management-key-concepts) - gateway, policies, observability y self-hosted gateway para híbrido

Direccion de estudio: centrate en policies, rate limiting, auth, transformation, self-hosted gateway y como exponer APIs legacy sin tocar el backend. Preparate para contar un caso de uso hibrido on-prem + Azure.

**Azure Event Hubs** `[Hard]` - ~5h
- [What is Azure Event Hubs](https://learn.microsoft.com/en-us/azure/event-hubs/event-hubs-about) - partitions, consumer groups, checkpointing, Capture y cuándo elegirlo frente a Service Bus

Direccion de estudio: aprende a distinguir streaming de mensajeria empresarial. Practica responder por que Event Hubs sirve para alto volumen y telemetria, pero no para workflows con garantias de entrega y transacciones como Service Bus.

### Resiliencia y Consistencia Distribuida

**Retry, Circuit Breaker y compensación** `[Hard]` - ~8h
- [Retry pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/retry) - cuándo reintentar y cuándo parar
- [Circuit Breaker Pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker) - evita cascadas de fallo
- [Compensating Transaction Pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/compensating-transaction) - rollback lógico en flujos distribuidos
- [Saga Design Pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/saga) - coordinación de transacciones distribuidas
- [CQRS Pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs) - separación de lectura/escritura cuando hay carga y complejidad

Direccion de estudio: no memorices definiciones; prepara una historia tecnica de 2 minutos sobre como manejarias una operacion distribuida con retries, idempotencia, dead-lettering y compensacion. Eso te va a dar puntos en entrevista senior.

### Observabilidad y Operacion

**Application Insights y Azure Monitor** `[Hard]` - ~4h
- [Application Insights OpenTelemetry observability overview](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview) - tracing, live metrics, logs, alerts y diagnóstico end-to-end

Direccion de estudio: enfocate en correlacion, trazas distribuidas, metricas de latencia, fallos y alertas. Preparate para explicar como detectarias una degradacion en una integracion hibrida productiva.

### Practica para Entrevista Senior

**Alta transaccionalidad, SQL Server e integracion hibrida** `[Domain]` - ~4h
- Repasa el lenguaje para explicar locking, aislamiento, colas, retrys, particionamiento y cómo reducir latencia bajo carga
- Practica un caso de arquitectura: migración gradual de on-prem a Azure sin cortar operación

Direccion de estudio: aqui no hace falta teoria pesada; hace falta discurso senior. Debes poder defender decisiones, trade-offs y como protegerias disponibilidad y consistencia en un sistema con +100M de transacciones.

---

## Orden Sugerido de Estudio

| # | Tema | Tipo | Tiempo Est. | Nota |
|---|-------|------|-----------|------|
| 1 | WCF y modernizacion de .NET | Hard | ~8h | Base para hablar de legacy Microsoft y migracion |
| 2 | Azure Service Bus | Hard | ~6h | Clave para integracion confiable y workflows |
| 3 | Azure API Management | Hard | ~5h | Necesario para exponer y gobernar APIs en hibrido |
| 4 | Azure Event Hubs | Hard | ~5h | Diferenciar streaming de mensajeria empresarial |
| 5 | Retry, Circuit Breaker y compensacion | Hard | ~8h | Se conecta con Service Bus, CQRS y operacion robusta |
| 6 | Application Insights y Azure Monitor | Hard | ~4h | Imprescindible para produccion y troubleshooting |
| 7 | SQL Server y alta transaccionalidad | Domain | ~4h | Cierre de arquitectura para escenarios de alta carga |
| 8 | Mock interview tecnico | Domain | ~4h | Practica el relato completo y respuestas de trade-off |

**Total estimated time: ~44h**
