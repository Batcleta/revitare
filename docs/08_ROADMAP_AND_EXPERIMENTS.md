# Roadmap e Experimentos

## Stage A — Research / Benchmark

Entregas:

- Benchmark Harness;
- dataset inicial;
- synthetic degradation;
- provider adapters;
- evaluation UI blind;
- Golden Set;
- Model Registry;
- License Ledger;
- cost/latency telemetry;
- schemas canônicos.

**Critério de saída:** saber quais rotas/modelos são aceitáveis em pelo menos três classes relevantes de dano.

## Stage B — Concierge MVP

Antes da automação completa:

- landing web;
- upload;
- processing real;
- admin/Quality Console;
- before/after;
- payment/credits simples;
- share link;
- manual review quando necessário.

Objetivo: aprender comportamento real antes de construir dezenas de telas.

## Stage C — Automated MVP

- Capture Quality Gate;
- Analyzer;
- Damage/Protected Masks;
- Router;
- 2–3 restoration routes;
- deterministic QA;
- multimodal validator;
- max 1 auto retry;
- guest session;
- download/share;
- cost ledger;
- retention/deletion;
- provider fallback.

## Stage D — Native

- React Native shell;
- Android/iOS scanner;
- capture guidance;
- native share;
- status/push quando relevante.

## Stage E — Trust & Reference

- Reference-Assisted Restoration;
- reconstruction disclosure;
- confidence/evidence UI;
- Restoration Passport;
- A/B routing;
- structured feedback;
- premium human review eligibility.

## Stage F — Memory

- conta opcional;
- albums;
- front/back;
- OCR + confirmation;
- people/place/event/story;
- audio;
- private collaboration;
- version history;
- Family Archive subscription.

## Stage G — Scale / B2B

- batch;
- professional dashboard;
- profiles;
- API;
- white label;
- ZIP export;
- billing mensal;
- prints/books;
- self-host onde for economicamente vantajoso.

## Experimentos obrigatórios

### Prova técnica
100–300 fotos, múltiplas rotas/modelos, custo, latência e fidelity.

### Prova de mercado
Landing:

> **Restaure uma foto antiga sem mudar quem está nela.**

Medir visit→upload→preview→purchase→share.

### Prova de diferenciação

A/B:

~~~text
AI restores old photos
vs
Restore without changing the person
~~~

### Prova de confiança

Resultado normal versus resultado + Restoration Passport.

### Prova de Reference Assistance

Severe face damage:
auto reconstruction versus pedir referência.

### Prova de canal

SEO, Search Ads, Instagram, TikTok/Reels e WhatsApp com baixo orçamento e tracking.

## Critérios internos

Definir antes do teste:

- first-pass acceptance;
- max retry;
- max cost/job;
- min preview→purchase;
- min fidelity approval;
- max infrastructure failure;
- privacy/deletion correctness.

Thresholds finais só são escolhidos após dados.

## Kill criteria

Pausar rota/modelo se:

- muda rostos com frequência;
- retry explode custo;
- exige manual review em quase todo caso;
- usuário não percebe benefício;
- CAC ultrapassa margem estrutural;
- licença/política de dados inviabiliza produção.

## Sequência recomendada de desenvolvimento

~~~text
1. schemas/domain
2. Benchmark Harness
3. provider interfaces
4. dataset + model lanes
5. initial routing policy
6. job state machine
7. storage + signed upload
8. validator/retry
9. web concierge
10. before/after
11. guest flow
12. cost telemetry
13. mobile shell/scanner
14. credits/payment
15. private beta
~~~

## Definition of Done do MVP

- restauração sem cadastro;
- original nunca perdido;
- custo por attempt/job registrado;
- provenance por tentativa;
- nenhuma key no cliente;
- retry limitado;
- fallback de provider;
- before/after mobile funcional;
- save/share;
- feedback "continua parecendo a pessoa?";
- retenção/deleção ponta a ponta;
- política de privacidade clara;
- nenhuma foto em analytics/logs;
- infraestrutura estável para beta.

Qualidade/fidelidade recebe thresholds apenas após benchmark.
