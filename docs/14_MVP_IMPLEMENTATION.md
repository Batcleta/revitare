# MVP Web — implementação atual

## Objetivo

Entregar uma primeira plataforma funcional em **Next.js** capaz de receber várias imagens de uma vez e processá-las **estritamente uma por vez**.

Esta versão não tenta implementar ainda o pipeline completo de Analyzer + Router + Validator. O objetivo é validar:

- upload múltiplo;
- experiência de fila;
- restauração real;
- custo/latência;
- comportamento do modelo;
- before/after/result;
- operação privada dos arquivos.

## Stack escolhida

- Next.js 16.3.3 / App Router;
- React 19.2;
- TypeScript;
- Vercel Private Blob;
- @google/genai;
- Gemini 3.1 Flash Image como restaurador inicial;
- CSS próprio, sem framework visual;
- sem banco de dados nesta fase;
- sem queue distribuída nesta fase.

## Por que Next.js

O mesmo projeto entrega:

- landing;
- interface de upload;
- Route Handlers server-side;
- integração segura com Gemini;
- integração direta com Vercel;
- futura camada SEO/growth.

## Por que Vercel Blob

O upload de fotos não deve atravessar o request body de uma Function.

Fluxo:

~~~text
browser
  ↓ token curto
Vercel Private Blob
  ↓ pathname
/api/restore
~~~

O cliente envia o arquivo diretamente ao storage. A API recebe apenas o pathname.

Isso:

- evita limite de payload da Function;
- reduz uso de memória;
- deixa arquivos privados;
- permite arquivos maiores;
- prepara retenção futura.

## Sem banco por enquanto

A fila pertence à sessão do navegador.

Consequências intencionais:

- fechar/recarregar a página encerra a fila;
- não há retomada automática;
- não há histórico;
- não há usuários;
- não há billing.

Isso é aceitável no MVP porque o objetivo atual é validar restauração e fluxo de múltiplas imagens.

Quando houver necessidade de fila durável, adicionar:

~~~text
PostgreSQL
+ RestorationJob
+ worker/queue
~~~

sem alterar a experiência da interface.

## Sem três agentes por enquanto

Há um único Restorer.

Por isso cada item é síncrono no sentido de negócio:

~~~text
imagem 1
 upload
 await restore
 save result
 conclude
 ↓
imagem 2
 upload
 await restore
 save result
 conclude
 ↓
...
~~~

Não existe Promise.all da fila e não existem duas chamadas de restauração simultâneas na mesma sessão.

A chamada HTTP continua naturalmente assíncrona para o navegador, mas a **orquestração é serial**.

## Estados da fila

~~~text
queued
uploading
restoring
completed
error
~~~

Falha de uma imagem não aborta as demais.

O usuário pode:

- parar depois da atual;
- tentar novamente uma falha;
- remover item;
- limpar resultados.

## Limites atuais

- até 12 imagens no lote;
- JPEG, PNG e WebP;
- até 20 MB por arquivo;
- multipart upload acima de 5 MB;
- resultado em 2K;
- link assinado de resultado com validade curta.

O limite de 20 MB é validado no cliente **e no token de upload do servidor**.

## Privacidade

- uploads ficam em Blob privado;
- chave Gemini somente no servidor;
- upload de trabalho é apagado após a tentativa de restauração;
- resultado fica privado e é entregue ao browser via signed URL;
- resultado pode ser apagado pela interface;
- uma limpeza automática de leftovers deve ser adicionada antes de produção pública.

## Beta access

A variável opcional:

~~~text
REVITARE_ACCESS_KEY
~~~

cria um gate simples para beta.

Isso não é autenticação final.

Se vazia, o gate fica desabilitado.

## Variáveis

~~~env
GEMINI_API_KEY=
GEMINI_IMAGE_MODEL=gemini-3.1-flash-image
REVITARE_ACCESS_KEY=
BLOB_READ_WRITE_TOKEN=
~~~

Novos stores Blob conectados à Vercel podem usar a autenticação configurada pela plataforma; manter o token apenas quando o projeto/store exigir.

## Setup Vercel

1. importar o repositório \`Batcleta/revitare\`;
2. conectar/criar um **Private Vercel Blob Store**;
3. configurar \`GEMINI_API_KEY\`;
4. opcionalmente configurar \`REVITARE_ACCESS_KEY\`;
5. deploy.

## Próxima evolução técnica

Somente depois de validar o fluxo atual:

1. persistir jobs;
2. worker/queue durável;
3. Analyzer barato;
4. Restoration Router;
5. deterministic QA;
6. Validator;
7. targeted retry;
8. auth;
9. retenção automática;
10. billing.

A interface de fila pode continuar praticamente igual quando o backend evoluir.
