# Princípios do Produto

## Regras não negociáveis

1. O **original nunca é sobrescrito**.
2. Regiões intactas devem ser modificadas o mínimo possível.
3. A IA generativa não deve redesenhar a fotografia inteira quando apenas uma região está danificada.
4. Colorização é uma derivação separada da restauração.
5. Reconstrução generativa deve ser explicitada.
6. O usuário comum não escreve prompts.
7. O domínio não depende de nomes de provedores/modelos.
8. Chaves de API vivem somente no backend.
9. Fotos não entram em logs/analytics convencionais.
10. Retentativas têm limite de tentativas e de custo.
11. Casos de baixa confiança pedem ajuda ao usuário em vez de esconder incerteza.
12. O custo real de cada job é registrado.
13. Mudança de modelo não entra automaticamente em produção sem regressão.
14. Fotos e referências privadas são privadas por padrão.
15. Um modelo só entra em produção após revisão de qualidade, licença e política de dados.

## Preservation First

A unidade de decisão não é "qual modelo gera melhor?", mas:

~~~text
qual dano existe?
→ qual região pode ser tocada?
→ qual tecnologia é suficiente?
→ qual orçamento está disponível?
→ como provar que regiões relevantes foram preservadas?
~~~

## Restoration Contract

Cada job recebe um contrato de intervenção.

### P0 — Capture Correction

Não modifica conteúdo histórico.

Permitido: crop, rotação, perspectiva, exposição, white balance e correções de glare/sombra causados pela captura.

### P1 — Conservative Enhancement

Permitido: denoise, contraste, sharpening leve, upscale e correções tonais.

Não deve inventar novos detalhes semanticamente relevantes.

### P2 — Local Repair

Permitido: riscos, poeira, vincos, pequenos patches e pequenas regiões faltantes.

Regra: editar preferencialmente apenas a máscara danificada.

### P3 — Generative Reconstruction

Usado quando informação real foi perdida.

Exige:

- disclosure;
- QA mais rígido;
- referência adicional quando possível;
- múltiplos candidatos/user review quando necessário.

### P4 — Interpretative Colorization

Colorização é explicitamente uma **interpretação**. Cores criadas pela IA não são apresentadas como fatos históricos.

### P5 — Animation

Derivado criativo posterior à restauração; nunca substitui original ou restauração fiel.

## Missing Information Rule

Quando informação visual deixou de existir, há apenas três respostas honestas:

~~~text
ASK FOR REFERENCE
GENERATE WITH WARNING
LEAVE UNRESTORED
~~~

## Linguagem da UX

A UI não precisa mostrar P0–P5.

### Restaurar com cuidado
Corrige danos alterando o mínimo possível.

### Recuperar mais detalhes
Permite reconstrução controlada quando a informação está severamente degradada.

### Colorir
Gera uma versão colorizada separada e identificada como interpretativa.

## Hard reject

Independentemente de score médio, podem reprovar o job:

- pessoa criada/removida;
- face count alterado;
- texto preservável alterado;
- objeto histórico importante criado/removido;
- pose/composição drasticamente alterada;
- região protegida modificada acima do limiar calibrado;
- artefato severo.

## Falha honesta

> **Há informação demais ausente para uma restauração fiel. Podemos criar uma reconstrução interpretativa ou manter essas regiões sem alteração.**

A confiança do produto depende de saber quando não gerar.
