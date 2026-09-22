# Snapshot de Modelos e Custos — 22/09/2026

> Este documento é histórico. Preços, nomes, licenças e disponibilidade precisam ser revalidados antes de qualquer implementação.

## Analyzer / Validator

O baseline sugerido nas pesquisas foi **Gemini 3.1 Flash-Lite paid**, por multimodalidade, structured output e custo baixo.

A ideia importante não é o nome do modelo: **análise e validação são baratas comparadas à geração**, então vale usar paid tier com política de dados melhor em vez de economizar frações de centavo com tier gratuito.

## Candidatos econômicos levantados

O documento arquitetural pesquisado listou, como referências de setembro/2026:

| Modelo/serviço | Referência de custo observada | Papel |
|---|---:|---|
| FLUX.2 Klein 4B | ~US$0,014 por edição/primeiro MP | edição barata |
| Qwen Image Edit 2511 via fal | ~US$0,03/MP | challenger barato |
| Gemini 3.1 Flash Lite Image | ~US$0,0336 por imagem 1K | edição/generação barata |
| fal Photo Restoration | ~US$0,04/imagem | baseline especializado |
| Bria Fibo Edit Restore | ~US$0,04/imagem | restauração especializada |
| FLUX.2 Pro | ~US$0,045/MP | tier produção |
| Gemini 3.1 Flash Image | ~US$0,067 em 1K | edição mais forte |
| FLUX.2 Max | ~US$0,07/MP | premium FLUX |
| Topaz Restore Recover 3 | ~US$0,08 por bloco de 4MP | specialized premium |
| Topaz Dust-Scratch V2 | ~US$0,08 por bloco de 24MP | dust/scratch |

Esses números são snapshot de pesquisa, não orçamento vigente.

## Candidatos premium levantados

- modelos premium de imagem/edição da OpenAI;
- Gemini 3 Pro Image / Flash Image;
- FLUX.2 Pro/Max;
- Topaz Restore;
- challengers como Seedream.

A decisão deve vir do benchmark próprio.

## Open source / self-host candidates

### Real-ESRGAN
Super-resolution e enhancement geral.

### SwinIR
Super-resolution, denoise e JPEG artifacts.

### NAFNet
Deblur/denoise não generativo.

### GFPGAN
Blind face restoration; risco de identity drift exige validação.

### FLUX.2 Klein 4B
Pesos/licença foram citados como potencialmente interessantes para self-hosting; revalidar versão e termos.

## Research-only / licença a revisar

- Microsoft Bringing Old Photos Back to Life;
- CodeFormer;
- SUPIR;
- HYPIR;
- DiffBIR;
- SSDiff;
- FaithDiff;
- Restore, Assess, Repeat;
- PixRestore;
- LiveMoments.

## Cuidado com licença

Nunca inferir:

~~~text
repo Apache/MIT/BSD
= stack inteiro comercialmente liberado
~~~

Auditar código, weights, datasets, base model, dependências e hosted terms.

## Exemplo de por que routing importa

Os documentos fizeram simulações mostrando que uma mistura de modelos baratos, standard e premium pode reduzir muito o custo frente ao uso do premium em 100% dos jobs.

A regra a preservar é:

> **rotear pelo dano e risco, não pelo desejo de sempre usar o modelo "melhor".**

## Preview

Outra conclusão estável:

- gerar preview mais barato/menor;
- só produzir 2K/4K premium após compra/aceitação;
- não pré-computar versões caras sem demanda.

## Paid vs free para dados reais

Para fotos familiares reais, os documentos recomendam paid services com políticas apropriadas de dados e retention.

O free tier fica restrito a protótipo/material não privado quando os termos permitirem.
