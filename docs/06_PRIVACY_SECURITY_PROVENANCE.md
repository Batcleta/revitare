# Privacidade, Segurança e Proveniência

## Premissa

Fotos familiares podem incluir:

- crianças;
- familiares falecidos;
- casamentos;
- documentos;
- fotos nunca publicadas;
- metadata de localização/captura.

Confiança não é detalhe jurídico; é feature do produto.

## Provider allowlist

Manter:

~~~text
ProviderPolicy
- approvedForCustomerPhotos
- approvedForChildrenPhotos
- trainingUse
- retention
- storageDisabledConfigured
- DPAReviewed
- region
- reviewedAt
~~~

Tier gratuito de IA pode servir a protótipo com material não privado quando os termos permitirem, mas não deve ser padrão para fotos reais se o conteúdo puder ser usado para melhoria/revisão.

## LGPD e biometria

No MVP:

~~~text
face detection          → sim
landmark geometry       → sim para QA
identity database       → não
face embeddings/search  → não
cross-photo recognition → não
~~~

Reference-Assisted Restoration usa referências fornecidas ao job; não cria pesquisa de identidade.

Antes de embeddings faciais, revisar necessidade, base legal, segurança e eventual RIPD/DPIA.

## Retenção

~~~text
upload
→ process
→ result
→ retention window
→ automatic deletion
~~~

Guest e usuário sem Archive devem ter retenção curta/configurável. Family Archive implica retenção explícita.

Deleção cobre:

- DB;
- originals/derivatives;
- working files;
- masks;
- references;
- thumbnails;
- share links;
- caches controlados;
- persistence de provider quando aplicável.

## Storage e acesso

- private buckets;
- signed URLs curtas;
- encryption at rest/in transit;
- authz por asset;
- nenhuma URL pública permanente de original;
- secrets em secret manager;
- rate limiting;
- limites de tamanho e pixels;
- MIME real;
- proteção contra decompression bomb.

## Logs e analytics

Nunca registrar:

- imagem/Base64;
- signed URL completa;
- nomes extraídos;
- texto manuscrito;
- prompt contendo conteúdo pessoal desnecessário.

Registrar IDs técnicos, stage, model, latency, error e cost.

## EXIF

Separar:

~~~text
capture metadata
~~~

de:

~~~text
historical metadata
~~~

GPS do celular de hoje não é o local histórico da foto antiga.

Cópias compartilhadas removem metadata desnecessária de dispositivo/localização.

## Proveniência por job

Guardar:

~~~text
source_sha256
input_version
analysis model/version/prompt
restoration provider/model/version/prompt
mask version
references
parameters
validator model
metrics
cost
latency
timestamp
~~~

Isso permite reproduzir comportamento e detectar regressões.

## Restoration Manifest

~~~json
{
  "sourceHash": "...",
  "contract": "P2_LOCAL_REPAIR",
  "provider": "...",
  "model": "...",
  "reconstructedRegions": [],
  "validatorDecision": "approve"
}
~~~

## IPTC/XMP

Metadata familiar/descritiva pode futuramente ser exportada usando padrões de photo metadata:

- pessoas;
- lugares;
- data;
- descrição;
- direitos.

Não depender apenas do banco quando interoperabilidade for relevante.

## C2PA / Content Credentials — futuro

Possível registrar:

~~~text
AI-assisted restoration
~~~

com proveniência verificável.

Proveniência **não** prova que uma reconstrução é historicamente verdadeira. Nunca chamar de prova forense.

## Compartilhamento

Fotos são privadas por padrão.

Link público só nasce por ação explícita.

Public Gallery/UGC apenas com opt-in e permissão clara.

## Testes de privacidade

Automatizar:

~~~text
DELETE photo
→ DB gone
→ objects gone
→ derivatives gone
→ share invalid
→ policy metadata minimized
~~~

Privacidade precisa de teste, não só política.
