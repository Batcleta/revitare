# Restoration Intelligence

## Objetivo

Restoration Intelligence decide:

~~~text
qual é o dano
→ o que pode ser alterado
→ qual rota/modelo utilizar
→ quanto gastar
→ como validar
→ quando repetir
→ quando pedir ajuda ao usuário
~~~

Essa camada é mais estratégica que qualquer modelo individual.

## Capture Quality Gate

Antes de pagar IA, separar defeito de captura de defeito histórico.

### Capture defects

- glare/reflexo;
- motion blur;
- foco ruim;
- perspectiva;
- sombra;
- exposição;
- vidro;
- enquadramento;
- compressão.

### Historical defects

- riscos;
- rasgos;
- poeira;
- manchas/mofo;
- faded contrast/color;
- perda de emulsão;
- áreas ausentes;
- degradação química.

Um reflexo sobre o olho deve gerar "capture novamente", não "invente o olho".

Checks locais:

~~~text
blur_score
glare_score
perspective_score
exposure_score
crop_confidence
resolution
shadow_score
~~~

## Normalização

Após upload:

- validar MIME real;
- dimensions/pixel limit;
- auto-rotate/EXIF orientation;
- gerar working copy;
- preservar bytes originais;
- gerar thumbnails;
- remover metadata privada desnecessária;
- calcular SHA-256.

## Analyzer semântico

Funções:

- classificar foto;
- identificar danos;
- contar/localizar pessoas;
- identificar semantic risk;
- indicar áreas críticas;
- decidir Restoration Contract;
- sugerir referência adicional;
- emitir JSON validado.

Gemini Flash-Lite pago foi indicado como candidato inicial econômico, mas permanece substituível.

## Semantic Risk Map

Pixels não possuem o mesmo valor histórico. Tratar com atenção:

- olhos;
- boca/nariz/contorno;
- mãos;
- texto;
- placas;
- uniformes;
- medalhas;
- joias;
- tatuagens;
- logotipos;
- documentos;
- objetos únicos.

## Damage Mask + Protected Mask

O VLM descreve **o que** está danificado. CV/segmentation ajuda a localizar **onde**.

~~~text
original
+ damage mask
+ protected mask
+ restoration plan
→ restorer
~~~

Se 8% está danificado, não regenerar 100% sem necessidade.

## Region Lock e compositing

Quando provider suporta inpainting/mask, editar somente a máscara.

Quando não suporta:

- crop/patch;
- restaurar região;
- composite;
- blend de borda;
- validar patch + contexto.

## Face Rail

~~~text
detect faces
   ↓
damage per face
   ↓
intact? ── yes → lock
   ↓ no
face-specific restoration
   ↓
composite + validate
~~~

Um rosto intacto não deve ser "melhorado" só porque outro está danificado.

## Reference-Assisted Restoration

Quando informação facial/semântica está severamente ausente:

> **Você possui outra foto dessa pessoa?**

Entrada:

~~~text
main damaged photo
+ reference 1
+ reference 2
+ reference 3...
~~~

Preferir mesma época/idade, rosto visível e ângulos úteis.

## Cost-Aware Router

Escolher o **modelo mais barato capaz de atingir o nível de qualidade necessário**.

~~~text
utility =
expected_quality
- cost_weight
- latency_weight
- hallucination_risk
~~~

### Lane A — Capture/classical
Crop, levels, denoise, deblur, upscale.

Candidatos de pesquisa: OpenCV, NAFNet, SwinIR, Real-ESRGAN.

### Lane B — Specialized restoration
Modelos/APIs focados em photo restoration, dust/scratch e recovery.

### Lane C — Controlled generative edit
Mask/inpainting para riscos grandes, rasgos e missing areas localizadas.

### Lane D — Reconstruction
Premium, multi-reference, QA rígido e disclosure.

### Lane E — future on-device
Real-ESRGAN/NCNN/CoreML para tarefas leves.

## Prompting interno

O usuário não vê prompt. O sistema gera a partir do plano:

~~~text
PRESERVE EXACTLY
- people count/position
- facial traits
- age/expression
- pose
- clothing
- text
- background geometry

REPAIR
- only damage defined by plan/mask

DO NOT
- beautify
- modernize
- invent jewelry/teeth/objects
- alter eye shape
- change framing
~~~

Retry adiciona o erro encontrado em vez de trocar tudo aleatoriamente.

## QA híbrido

### QA 0 — File
Integridade, dimensões, formato, alpha.

### QA 1 — Geometry
Face count, posição, landmarks, pose, edges, silhouettes.

### QA 2 — Pixel/perceptual
SSIM, MS-SSIM, LPIPS, edges e histogram fora da máscara.

### QA 3 — OCR preservation
Texto antes/depois não pode mudar silenciosamente.

### QA 4 — Multimodal audit
Original + resultado + masks + contract.

Detectar hallucination, objeto novo/removido, expressão/idade, roupa, fundo, pose e composição.

### QA 5 — User
Em baixa confiança: A/B/C e "qual ainda parece com a pessoa?".

## Evidence Report

Não retornar só score.

~~~json
{
  "decision": "RETRY",
  "changes": [
    {
      "region": "face_2.left_eye",
      "type": "geometry_change",
      "severity": "high",
      "confidence": 0.94
    }
  ],
  "preserved": ["face_count", "pose", "clothing"]
}
~~~

## Policy Decision Engine

LLM não toma decisão final.

~~~ts
if (hardFailure) return reject();
if (outsideMaskDrift > threshold) return retryOnce();
if (hallucinationRisk === 'high') return userReview();
if (attempt >= maxAttempts) return userReview();
return approve();
~~~

Thresholds são calibrados no benchmark.

## Targeted retry

Retry regional e orientado:

- face 2;
- background;
- patch do risco.

Plano comum: geração inicial + no máximo 1 retry automático. Tentativas extras dependem do tier ou ação explícita.

## Feedback

Pergunta principal:

> **Esta restauração continua parecendo com a pessoa?**

Sim / Mais ou menos / Não.

Se negativo: rosto, expressão, roupa, fundo, outro.

## Restoration Passport

Exemplo:

~~~text
Original preservado ✓
Pessoas detectadas: 3
Rostos fortemente reconstruídos: 0
Regiões reconstruídas: 4,2%
Texto alterado: não
Colorização: não
~~~

Auditabilidade vira feature de confiança.
