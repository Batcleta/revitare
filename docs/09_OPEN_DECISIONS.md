# Decisões em Aberto

Este arquivo impede que hipóteses virem fatos arquiteturais sem validação.

## Web stack

Opções discutidas:

- Expo Router Web para maximizar código compartilhado;
- Next.js dedicado para marketing/SEO.

Decidir por evidência de SEO, upload UX, share links e manutenção.

## Backend framework

Fastify foi recomendado por simplicidade. Supabase/Edge/Cloudflare/Vercel também apareceram como opções.

Regra estável: domínio/contracts independentes do framework.

## Queue

MVP: pg-boss ou graphile-worker. Escolher após prova de compatibilidade com a infraestrutura.

## Storage

Principais opções discutidas:

- Supabase Storage — simplicidade;
- Cloudflare R2 — egress/custo.

Escolher após estimativa de volume e integração.

## Analyzer / Validator

Gemini Flash-Lite pago é baseline sugerido, mas precisa provar:

- qualidade de JSON;
- detecção semântica;
- custo;
- latência;
- aderência de privacidade.

## Restoration providers

Nenhum modelo é vencedor ainda.

Precisam competir por classe de dano nas lanes:

- classical;
- specialized;
- cheap generative;
- premium reconstruction.

## Open-source production list

Cada projeto passa pelo License Ledger completo.

A licença do repositório isoladamente não basta.

## Thresholds

Ainda não fixar valores definitivos para:

- SSIM/LPIPS;
- landmark drift;
- outside-mask drift;
- confidence;
- aprovação;
- retries.

Calibrar com Golden Set + preferência humana.

## Retenção

Definir por categoria:

- guest;
- paid one-off;
- Archive subscriber;
- public share.

Alinhar com políticas dos providers.

## Pricing

Os preços discutidos até aqui são hipóteses.

Validar willingness to pay, CAC, store/payment fees, retry, support, refund e margem.

## Brand

Documentos anteriores usaram **MEMORIA** como working concept. O repositório/produto atual usa **Revitare**. Consolidar naming antes de material público definitivo.

## C2PA/IPTC

Diferenciais potenciais de provenance/interoperabilidade; não bloqueiam MVP.

## On-device

Real-ESRGAN/NCNN/CoreML é direção futura para custo e privacidade. Só priorizar após benchmark e volume.

## Human review

Decidir se será:

- apenas interno no beta;
- premium próprio;
- especialistas parceiros;
- serviço externo.

Não é requisito do primeiro fluxo automatizado.
