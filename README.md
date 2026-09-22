# Revitare

**Revitare** é um projeto de preservação e restauração fiel de fotografias e memórias familiares com IA.

A proposta não é construir apenas mais um *AI Photo Enhancer*. O produto começa com restauração de fotografias antigas e evolui para uma plataforma de preservação de memórias, priorizando:

- **fidelidade** — restaurar sem descaracterizar pessoas, objetos e contexto histórico;
- **confiança** — distinguir preservação, reparo e reconstrução generativa;
- **custo controlado** — usar o modelo mais barato capaz de resolver cada caso;
- **privacidade** — original privado, retenção explícita e provedores aprovados;
- **auditabilidade** — registrar modelo, versão, custo, máscaras, decisões e validações;
- **shareability** — fazer do próprio resultado um canal natural de aquisição;
- **portabilidade de IA** — nenhum provedor é parte do domínio central.

> **Princípio central:** a fotografia original é a fonte de verdade. A IA só deve alterar o que for necessário e deve deixar claro quando precisou reconstruir o que já não existe.

## Arquitetura em uma frase

~~~text
Capture → Quality Gate → Analyzer → Damage/Protected Masks → Router
→ Restorer → Deterministic QA → Multimodal Audit → Policy Decision
→ Approve / Targeted Retry / User Review
~~~

## Documentação canônica

| Documento | Assunto |
|---|---|
| [Visão do produto](docs/00_PRODUCT_VISION.md) | proposta, posicionamento, usuários, product ladder e moat |
| [Princípios do produto](docs/01_PRODUCT_PRINCIPLES.md) | regras não negociáveis e Restoration Contract |
| [Arquitetura técnica](docs/02_TECHNICAL_ARCHITECTURE.md) | apps, API, workers, storage, queue, dados e estados |
| [Restoration Intelligence](docs/03_RESTORATION_INTELLIGENCE.md) | Analyzer, masks, router, restorers, QA, retries e evidence |
| [Benchmark e Model Registry](docs/04_BENCHMARK_AND_MODEL_REGISTRY.md) | benchmark, Golden Set, licenças, custos e seleção de modelos |
| [UX e plataforma de memórias](docs/05_UX_AND_MEMORY_PLATFORM.md) | first-run, scanner, result UX, Family Archive e colaboração |
| [Privacidade, segurança e proveniência](docs/06_PRIVACY_SECURITY_PROVENANCE.md) | LGPD, retenção, storage, EXIF, IPTC/XMP e C2PA |
| [Negócio, monetização e growth](docs/07_BUSINESS_GROWTH_MONETIZATION.md) | créditos, assinatura, B2B, SEO, WhatsApp, viral loop e conteúdo |
| [Roadmap e experimentos](docs/08_ROADMAP_AND_EXPERIMENTS.md) | fases, provas técnicas/de mercado e critérios de saída |
| [Decisões em aberto](docs/09_OPEN_DECISIONS.md) | decisões que precisam de benchmark ou validação |
| [Referências](docs/10_RESEARCH_REFERENCES.md) | projetos, modelos e fontes pesquisadas |
| [Pesquisa de mercado](docs/11_MARKET_RESEARCH.md) | concorrentes, comunidades e oportunidades |
| [Snapshot de modelos — 2026-09](docs/12_MODEL_SNAPSHOT_2026_09.md) | candidatos, custos pesquisados e cautelas de licença |
| [Linhagem da consolidação](docs/13_SOURCE_LINEAGE.md) | evolução das ideias e regra de precedência |

Também existe um [índice compacto](docs/INDEX.md).

## De onde veio esta arquitetura

A consolidação reuniu quatro gerações de trabalho:

1. ideia inicial Analyzer → Restorer → Validator;
2. pesquisa de mercado, concorrentes, GitHub e growth;
3. blueprint técnico com máscaras, router, QA, storage, queue, UX e segurança;
4. blueprint master com Preservation First, Restoration Contracts, Evidence Report, Reward Model, provenance e plataforma de memória.

A [linhagem da consolidação](docs/13_SOURCE_LINEAGE.md) registra o que cada etapa adicionou.

A documentação atual em docs/00_... até docs/13_... é a **fonte canônica**. Tecnologia, preço e disponibilidade que mudam com o tempo ficam em snapshots/Model Registry em vez de virar acoplamento do domínio.

## Decisão de implementação atual

A primeira entrega técnica não deve ser o app completo. Deve ser o **Restoration Benchmark Harness**, para descobrir com dados quais modelos e rotas entregam melhor fidelidade, qualidade, custo e estabilidade antes de acoplar a experiência final a uma tecnologia específica.

Veja: [Roadmap e experimentos](docs/08_ROADMAP_AND_EXPERIMENTS.md).
