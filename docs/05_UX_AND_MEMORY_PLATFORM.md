# UX e Plataforma de Memórias

## Regra de UX

O usuário médio não deve saber o que é prompt, inpainting, diffusion, mask, provider ou LPIPS.

Ele deve saber:

> **Quero recuperar esta foto.**

## First-run ideal

~~~text
1. abrir produto
2. restaurar sem cadastro
3. fotografar/enviar
4. quality gate aponta glare/blur
5. análise
6. preview
7. before/after
8. preservar ou recuperar mais detalhes
9. pagar/crédito para final HD quando aplicável
10. baixar
11. compartilhar
12. criar conta apenas para guardar/continuar
~~~

O magic moment vem antes da fricção de cadastro.

## Home

Headline:

> **Recupere suas fotos antigas sem perder quem está nelas.**

CTA primário: Restaurar uma foto.

Secundário: Escolher da galeria.

## Captura

Microcopy simples:

- mantenha a foto na moldura;
- evite luz direta;
- feedback de reflexo/foco;
- "usar mesmo assim" quando fizer sentido.

A captura é parte da restauração.

## Processamento

Não mostrar modelo/provedor.

Estágios reais:

~~~text
Preparando a foto
Reparando os danos
Conferindo o resultado
~~~

Evitar percentual falso.

## Resultado

Componente principal:

~~~text
Before <—— slider ——> After
~~~

Ações:

- salvar em alta qualidade;
- compartilhar;
- recuperar mais detalhes;
- ver o que foi alterado.

O before/after é UX, QA, conversão e marketing.

## Progressive disclosure

Só mostrar controles quando fazem sentido.

- dano leve → fluxo simples;
- rosto severamente danificado → pedir referência;
- reconstrução usada → oferecer mapa/passport;
- B2B/advanced → masks, strength e profiles.

## Acessibilidade e público mais velho

- touch targets grandes;
- alto contraste;
- Dynamic Type;
- VoiceOver/TalkBack;
- uma ação primária por tela;
- evitar jargão;
- não depender só de cor;
- confirmações legíveis.

Direção visual:

- moderna;
- calma;
- confiável;
- off-white/neutro quente;
- charcoal;
- destaque moderado;
- fotos como hero;
- sem vintage caricato;
- sem neon "IA" exagerado.

## Original e versionamento

~~~text
Original
 ├─ Normalized
 ├─ Restore v1
 ├─ Restore v2
 ├─ Colorized
 ├─ Upscaled
 └─ Animated derivative
~~~

O usuário sempre pode voltar ao original.

## Family Archive

Restauração é episódica; memória cria retenção.

Features:

- álbuns;
- scan frente/verso;
- metadata;
- pessoas;
- lugares;
- eventos;
- histórias;
- áudio;
- private share;
- colaboração.

## Frente e verso

Depois da frente:

> **Quer fotografar o verso?**

Extrair:

- nomes;
- datas;
- locais;
- dedicatórias;
- carimbos.

OCR/handwriting é sugestão, nunca verdade automática. Sempre preservar o scan bruto do verso.

## Voice Story e Interview Mode

Usuário grava a história.

~~~text
audio → speech-to-text → draft → user confirms
~~~

Perguntas:

- Quem aparece?
- Onde foi?
- O que estava acontecendo?
- Que lembrança você tem?

## Family Memory Graph

~~~text
Photo
 ├─ Person
 ├─ Person
 ├─ Place
 ├─ Event
 └─ Story
~~~

Inicialmente, relações são criadas ou confirmadas por humanos, sem reconhecimento biométrico pesquisável.

## "Quem é esta pessoa?"

~~~text
unknown person
→ private share question
→ family member responds
→ owner confirms
~~~

Cria memória coletiva e loop de aquisição sem fabricar genealogia.

## Search natural — futuro

Exemplos:

- "foto da vó com vestido azul";
- "casamento dos meus avós";
- "fotos de Santos nos anos 60".

Combinar metadata + multimodal search quando a base existir.

## Batch e album scanning

~~~text
scan album page
→ detect/crop photos
→ create photo records
→ analyze
→ queue restorations
~~~

Valioso para caixas, álbuns, genealogistas e B2B.

## Negatives/slides e Scan Kit — futuro

Expansão para negativos exige backlight, inversão e correção específica de filme.

Pode existir um Revitare Scan Kit com suporte, alinhamento e iluminação, mas não faz parte do MVP.
