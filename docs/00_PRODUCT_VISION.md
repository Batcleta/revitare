# Visão do Produto

## Tese

Revitare começa resolvendo um problema simples de explicar e difícil de executar bem:

> **restaurar fotografias antigas preservando a pessoa, a composição e o caráter histórico da imagem.**

A evolução natural é transformar a restauração em porta de entrada para uma plataforma de **preservação de memórias familiares**.

~~~text
Restore
  ↓
Preserve
  ↓
Understand
  ↓
Share
  ↓
Collaborate
~~~

## O problema real

O mercado já consegue produzir imagens mais nítidas. O problema é que "mais bonito" não significa "mais fiel".

Falhas recorrentes de restauração automática:

- rosto tecnicamente melhor, mas diferente da pessoa real;
- olhos, boca, idade aparente ou expressão alterados;
- suavização excessiva;
- fundo e roupas deixados para trás enquanto o rosto fica artificialmente perfeito;
- reconstrução de objetos que nunca existiram;
- modernização indevida da fotografia;
- texto ou datas alterados;
- falta de explicação sobre o que foi recuperado e o que foi inventado.

O produto deve otimizar separadamente:

~~~text
visual_quality
fidelity
~~~

Fidelidade prevalece quando houver conflito.

## Posicionamento

Evitar:

- "AI Photo Enhancer";
- "deixe qualquer foto em 4K";
- "recrie pessoas com IA";
- "faça sua foto velha parecer moderna".

Posicionamento preferido:

> **Restaure a foto. Preserve a pessoa.**

Alternativas já trabalhadas:

- "Recupere suas fotos sem perder quem está nelas."
- "A memória continua a mesma. A foto volta a aparecer."
- "Não recriamos sua história. Ajudamos você a preservá-la."

## Pilares

### Fidelity
Não descaracterizar a pessoa ou a cena.

### Trust
Explicar quando houve preservação, reparo, inferência ou reconstrução.

### Memory
Guardar contexto, nomes, datas, lugares, verso, áudio e histórias.

### Shareability
Cada resultado deve poder ser naturalmente compartilhado sem tornar a foto pública por padrão.

## Personas

- **Memory Keeper:** tem caixas/álbuns e quer preservá-los.
- **Gift Giver:** quer recuperar uma foto especial para presentear.
- **Family Historian:** interessa-se por genealogia, datas, lugares e relações.
- **Family Operator:** filho, neto ou sobrinho que digitaliza para a família.
- **Pro Restorer:** fotógrafo, laboratório, loja de molduras ou digitalizadora.
- **Archive Operator:** museu, arquivo local, genealogista ou instituição.

## Product ladder

~~~text
Restaurar uma foto
        ↓
Restaurar várias
        ↓
Criar álbum
        ↓
Adicionar verso, pessoas, datas e histórias
        ↓
Convidar família
        ↓
Pesquisar memórias
        ↓
Criar impressos, livros e vídeos
~~~

### Produto 1 — Restore
Scan/upload → restore → compare → download → share.

### Produto 2 — Preserve
Álbuns, frente/verso, metadata, original imutável e histórias.

### Produto 3 — Family
Convites, colaboração, identificação manual, comentários e memória coletiva.

### Produto 4 — Create
Impressões, quadros, canvas, livros, calendários, vídeo e animações derivadas.

## Moat

Modelos de imagem tendem a virar commodity. A defensabilidade deve vir de:

~~~text
restoration dataset autorizado
+ benchmark próprio
+ damage/risk classification
+ routing
+ validator
+ user preference data
+ cost/quality intelligence
+ family memory graph
+ trust/provenance
+ distribution
~~~

O motor estratégico recebe o nome interno de **Restoration Intelligence**.

## O que não construir primeiro

- árvore genealógica completa;
- rede social;
- foundation model próprio;
- reconhecimento facial/identity database;
- editor estilo Photoshop;
- marketplace humano completo;
- scanner multi-shot proprietário;
- on-device generative model;
- animação como produto central.

O wedge precisa provar **restauração fiel** antes de expandir.
