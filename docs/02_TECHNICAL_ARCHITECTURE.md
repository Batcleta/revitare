# Arquitetura Técnica

## Visão geral

~~~text
                    USER
                      │
              ┌───────┴────────┐
              │                │
          WEB/SEO            MOBILE
              │                │
              └───────┬────────┘
                      │
                SIGNED UPLOAD
                      │
                      ▼
                OBJECT STORAGE
                      │
                      ▼
                 CONTROL PLANE
        Auth / Guest / Jobs / Billing
                      │
                      ▼
                    QUEUE
                      │
                      ▼
              RESTORATION WORKER
Analyzer → Masks → Router → Restorer → QA → Audit
                      │
                      ▼
                 VERSIONED RESULT
~~~

## Clientes

### Mobile

Direção consolidada:

- React Native;
- Expo Development Build;
- TypeScript;
- Expo Router;
- TanStack Query;
- Reanimated;
- Gesture Handler.

Expo Go não deve ser pressuposto para scanner/câmera nativa.

### Web

Web deve existir desde o início por:

- SEO;
- landing/upload sem instalar;
- share links;
- acquisition;
- concierge MVP.

Os documentos anteriores avaliaram tanto Expo Router Web quanto Next.js. A decisão final continua aberta e deve equilibrar compartilhamento de código e SEO/marketing.

## Captura

- **Android:** ML Kit Document Scanner.
- **iOS:** VisionKit / VNDocumentCameraViewController.
- **Futuro:** scanner multi-shot inspirado no PhotoScan para fusão e redução de glare.

## Upload e storage

Fluxo:

~~~text
client
  ↓ request signed URL
API
  ↓
client → object storage
~~~

Evitar fazer arquivos grandes atravessarem memória do processo Node.

Separação:

~~~text
originals-private
working-temporary
results-private
references-private
masks-private
shared-public-explicit
~~~

O original é imutável. Cópias de trabalho e derivados são objetos separados.

## API / Control Plane

Direção inicial:

- Node.js;
- TypeScript;
- Zod;
- PostgreSQL / Supabase.

Fastify é uma opção enxuta, mas framework não deve vazar para o domínio.

Responsabilidades:

- GuestSession/Auth;
- PhotoAsset;
- Jobs;
- policies;
- budgets;
- provider router;
- signed URLs;
- billing/credits;
- sharing;
- retention/deletion;
- telemetry de custo.

## Queue

Processamento de IA não mantém request HTTP aberto.

~~~text
POST /restorations
  ↓
202 + jobId
  ↓
queue
  ↓
worker
  ↓
events/status
~~~

MVP pode usar queue PostgreSQL-backed como pg-boss ou graphile-worker antes de introduzir Redis/Temporal.

## Job State Machine

~~~text
CREATED
UPLOADING
UPLOADED
PREFLIGHT
ANALYZING
PLANNING
ROUTED
RESTORING
VALIDATING
RETRYING
NEEDS_USER_INPUT
COMPLETED
FAILED
CANCELED
EXPIRED
~~~

Jobs são idempotentes.

## Provider abstractions

~~~ts
interface AnalyzerProvider {
  analyze(input: AnalyzeInput): Promise<PhotoAnalysis>;
}

interface RestorationProvider {
  restore(input: RestoreInput): Promise<RestorationResult>;
}

interface ValidationProvider {
  validate(input: ValidationInput): Promise<ValidationResult>;
}
~~~

Capacidades:

~~~ts
type RestorationCapabilities = {
  supportsMask: boolean;
  supportsMultiReference: boolean;
  maxReferences: number;
  supports4K: boolean;
  supportsBatch: boolean;
  commercialUseApproved: boolean;
  customerPhotoPolicyApproved: boolean;
};
~~~

## Model Registry

Cada provider/model versiona:

- capabilities;
- cost model;
- max resolution;
- mask support;
- reference support;
- commercial/license status;
- privacy status;
- quality profile;
- enabled/kill switch.

## Provider observability

Registrar, sem conteúdo das fotos:

- provider/model/version;
- latency;
- timeout/error;
- quality result;
- retry count/reason;
- reported/estimated cost;
- user acceptance.

Circuit breaker remove provider degradado da rota.

## Banco de dados

### User
id, email, locale, created_at.

### GuestSession
id, created_at, expires_at, converted_user_id.

### PhotoAsset
owner, original key, MIME, dimensions, SHA-256, capture method, retention policy.

### PhotoVersion
parent, type, object key, dimensions.

Tipos: ORIGINAL, NORMALIZED, RESTORED, COLORIZED, UPSCALED, SHARE_PREVIEW.

### Analysis
provider/model/version/schema e damage JSON.

### DamageRegion
mask/polygon, type, severity, protected.

### RestorationJob
mode, status, budget, max attempts.

### RestorationAttempt
provider/model/prompt version/input-output/cost/latency/status.

### ValidationRun
metrics, audit JSON, decision.

### ReferencePhoto
job + asset + subject hint.

### UserFeedback
similarity vote, categories e texto opcional.

### Futuro
Album, Person, Place, Event, Story, PhotoMetadata.

## API mínima

~~~text
POST   /v1/uploads/presign
POST   /v1/photos
GET    /v1/photos/:id
DELETE /v1/photos/:id

POST   /v1/restorations
GET    /v1/restorations/:id
POST   /v1/restorations/:id/retry
POST   /v1/restorations/:id/reference-photos
POST   /v1/restorations/:id/feedback
GET    /v1/restorations/:id/events

POST   /v1/checkout
GET    /v1/credits
~~~

Polling com backoff ou SSE é suficiente no MVP.

## Estrutura futura do código

~~~text
/apps
  /mobile
  /web
  /api
  /worker

/packages
  /domain
  /contracts
  /provider-sdk
  /image-metrics
  /ui-tokens
  /config

/services
  /gpu-worker-python

/benchmarks
  /datasets
  /runner
  /evaluation-ui
  /reports

/infrastructure
  /migrations
  /deploy
~~~

Regra: domain não importa SDK de Gemini/OpenAI/fal/BFL.

## Backoffice

Desde cedo deve existir Quality Console interna com:

- original;
- candidato;
- damage/protected masks;
- auditoria;
- custo/latency;
- approve/reject/reroute/mark issue.

Human-in-the-loop interno no beta pode proteger reputação e gerar dados.
