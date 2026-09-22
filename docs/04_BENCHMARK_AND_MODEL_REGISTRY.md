# Benchmark e Model Registry

## Primeira entrega técnica

Antes do app completo, construir o **Restoration Benchmark Harness**.

Objetivo: escolher rotas e modelos com evidência, não por demos.

## Dataset

### Fase exploratória
50–100 imagens.

### Benchmark maior
200–500 imagens.

Cobrir:

- riscos;
- dust;
- rasgos;
- manchas;
- faded;
- blur;
- compressão/baixa resolução;
- missing regions;
- faces individuais;
- grupos;
- estúdio/exterior;
- P&B/cor;
- texto manuscrito;
- fundo complexo;
- dano facial severo.

## Duas pistas

### Track A — Ground Truth

Imagem limpa/licenciada → synthetic degradation → restauração → comparação com original conhecido.

Degradações:

- scratches;
- dust;
- film grain;
- Gaussian/motion blur;
- downsample;
- JPEG;
- faded contrast;
- color cast;
- tears/masks;
- stains;
- uneven exposure.

Métricas:

- PSNR;
- SSIM;
- LPIPS;
- landmark drift;
- OCR preservation.

### Track B — Real Historical

Fotos realmente antigas sem ground truth.

Avaliação:

- fidelity;
- naturalness;
- damage removal;
- historical plausibility;
- hallucination;
- pairwise human preference.

## Tournament / blind evaluation

Não mostrar o nome do modelo.

~~~text
Original
Candidate A
Candidate B
Candidate C
~~~

Perguntas:

1. Qual parece mais com a pessoa original?
2. Qual removeu melhor o dano?
3. Qual parece menos artificial?
4. Qual preservou melhor o caráter histórico?
5. Algum detalhe foi inventado?

Pairwise A×B tende a gerar sinal melhor que uma nota arbitrária.

## Golden Set

Manter 50–100 casos críticos de regressão.

Toda mudança de:

- modelo;
- versão;
- prompt;
- mask pipeline;
- quality thresholds;

roda o Golden Set antes de produção.

Nunca migrar automaticamente para latest.

## Model Registry

Campos:

~~~text
provider
model
version
capabilities
input/output limits
supports mask
supports multi-reference
max references
resolution
pricing model
commercial/license status
data/privacy status
quality profile by damage class
latency
enabled
reviewed_at
~~~

## License Ledger

Licença deve ser analisada em camadas:

~~~text
code license
model weights
dataset
dependency
base model
hosted provider terms
~~~

Repo com Apache/MIT/BSD não prova automaticamente que todo o caminho de produção é comercialmente utilizável.

Projetos discutidos:

- Real-ESRGAN;
- SwinIR;
- NAFNet;
- GFPGAN;
- FLUX.2;
- Bringing Old Photos Back to Life;
- CodeFormer;
- DiffBIR;
- SUPIR;
- HYPIR;
- SSDiff;
- FaithDiff;
- Restore, Assess, Repeat;
- PixRestore;
- LiveMoments.

Projetos com restrição ou ambiguidade entram como **benchmark/research** até revisão.

## Lanes de benchmark

### Lane 1 — Classical/Open Source
OpenCV + NAFNet/SwinIR + Real-ESRGAN; GFPGAN apenas quando necessário e validado.

### Lane 2 — Specialized
Endpoints/modelos especializados em photo restoration, dust/scratch e recovery.

### Lane 3 — Cheap Generative
Modelos de edição de baixo custo que suportem mask/reference quando possível.

### Lane 4 — Premium
Modelos com maior fidelidade de edição/reconstrução e multi-reference.

Nomes/preços atuais são voláteis; pertencem ao Registry, não ao domínio.

## Candidatos pesquisados em setembro/2026

### Análise/validação
Gemini 3.1 Flash-Lite paid foi apontado como baseline econômico.

### Econômicos/especializados
Foram levantados candidatos como:

- FLUX.2 Klein 4B;
- Qwen Image Edit;
- Gemini Flash Lite Image;
- fal Photo Restoration;
- Bria Restore;
- Topaz Dust/Scratch;
- Real-ESRGAN / SwinIR / NAFNet.

### Premium
Foram levantados:

- modelos premium de edição OpenAI;
- FLUX.2 Pro/Max;
- Gemini Flash/Pro Image;
- Topaz Restore;
- outros challengers de edição/restauração.

Nenhum recebe status de vencedor sem benchmark próprio.

## Cost Ledger

Por attempt:

~~~text
provider
model
operation
input_units
output_units
reported_cost_usd
estimated_cost_usd
latency_ms
attempt_number
~~~

Por job:

~~~text
analyzer
+ restoration attempts
+ validator
+ storage
+ egress
+ payment variable costs
~~~

## Budget guardrails

Exemplo conceitual:

~~~text
FREE PREVIEW
maxAttempts=1
premium=false

STANDARD
maxAttempts=2
premium=conditional

PREMIUM
maxAttempts=3
multiReference=true
highResolution=true
humanReviewEligible=true
~~~

O router conhece o teto antes de gerar.

## Preview econômico

Não gerar 4K antes de saber que o usuário pagará.

~~~text
upload
→ analysis
→ low-cost 1K preview
→ acceptance/payment
→ 2K/4K final
~~~

Casos fáceis podem usar rota classical/specialized ainda mais barata.

## Reward model futuro

Os documentos discutem um futuro **Restoration Reward Model**, inspirado em pesquisa como DiffusionReward.

Dataset de preferência:

~~~text
original
candidate A/B
damage class
validator evidence
provider/cost
user chose A/B
~~~

Uso futuro:

- learned router;
- validator melhor;
- ranking de candidatos;
- preferences.

Não usar fotos privadas para treinamento sem consentimento/base apropriada. Preferir public domain, material licenciado, sintético ou opt-in explícito.

## Self-hosting

Não começar comprando GPU.

Comparar após volume real:

~~~text
API spend
vs
GPU fixed cost + idle + ops + engineering
~~~

Self-host é consequência de evidência econômica.
