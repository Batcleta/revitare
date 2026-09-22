"use client";

import Image from "next/image";
import { upload } from "@vercel/blob/client";
import {
  ChangeEvent,
  DragEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type QueueStatus =
  | "queued"
  | "uploading"
  | "restoring"
  | "completed"
  | "error";

type RestorationMode = "faithful" | "detail";

type QueueItem = {
  id: string;
  file: File;
  name: string;
  size: number;
  previewUrl: string;
  status: QueueStatus;
  error?: string;
  resultUrl?: string;
  resultPathname?: string;
  model?: string;
};

const MAX_BATCH = 12;
const MAX_FILE_BYTES = 20 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const STATUS_LABELS: Record<QueueStatus, string> = {
  queued: "Na fila",
  uploading: "Enviando",
  restoring: "Restaurando",
  completed: "Concluída",
  error: "Falhou",
};

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function safeName(value: string) {
  return (
    value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(-100) || "foto.jpg"
  );
}

function QueueIcon({ status }: { status: QueueStatus }) {
  if (status === "completed") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m5 12.5 4 4L19 6.5" />
      </svg>
    );
  }

  if (status === "error") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 8v5M12 17h.01" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    );
  }

  if (status === "uploading" || status === "restoring") {
    return <span className="spinner" aria-hidden="true" />;
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l2.5 2" />
    </svg>
  );
}

export function RestorationWorkbench() {
  const inputRef = useRef<HTMLInputElement>(null);
  const cancelRef = useRef(false);

  const [items, setItems] = useState<QueueItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [mode, setMode] = useState<RestorationMode>("faithful");
  const [accessKey, setAccessKey] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setAccessKey(sessionStorage.getItem("revitare-access-key") ?? "");
  }, []);

  const counts = useMemo(() => {
    const completed = items.filter((item) => item.status === "completed").length;
    const errors = items.filter((item) => item.status === "error").length;
    const active = items.filter(
      (item) => item.status === "uploading" || item.status === "restoring",
    ).length;

    return { completed, errors, active };
  }, [items]);

  const progress =
    items.length === 0
      ? 0
      : Math.round(((counts.completed + counts.errors) / items.length) * 100);

  function updateItem(id: string, patch: Partial<QueueItem>) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  function addFiles(fileList: FileList | File[]) {
    const incoming = Array.from(fileList);
    const room = Math.max(0, MAX_BATCH - items.length);
    const accepted: File[] = [];
    let rejected = 0;

    for (const file of incoming) {
      if (
        accepted.length >= room ||
        !ACCEPTED_TYPES.has(file.type) ||
        file.size > MAX_FILE_BYTES
      ) {
        rejected += 1;
        continue;
      }
      accepted.push(file);
    }

    if (accepted.length) {
      const next: QueueItem[] = accepted.map((file) => ({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        size: file.size,
        previewUrl: URL.createObjectURL(file),
        status: "queued",
      }));

      setItems((current) => [...current, ...next]);
    }

    if (rejected) {
      setNotice(
        `${rejected} arquivo(s) ignorado(s). Use JPEG, PNG ou WebP de até 20 MB; o lote aceita até ${MAX_BATCH} imagens.`,
      );
    } else {
      setNotice("");
    }
  }

  function onFileInput(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      addFiles(event.target.files);
      event.target.value = "";
    }
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    if (!processing) addFiles(event.dataTransfer.files);
  }

  async function processItem(item: QueueItem) {
    updateItem(item.id, {
      status: "uploading",
      error: undefined,
      resultUrl: undefined,
      resultPathname: undefined,
    });

    try {
      const pathname = `revitare/uploads/${crypto.randomUUID()}-${safeName(item.name)}`;

      const sourceBlob = await upload(pathname, item.file, {
        access: "private",
        handleUploadUrl: "/api/uploads",
        clientPayload: JSON.stringify({ accessKey }),
      });

      updateItem(item.id, { status: "restoring" });

      const response = await fetch("/api/restore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-revitare-access": accessKey,
        },
        body: JSON.stringify({
          pathname: sourceBlob.pathname,
          originalName: item.name,
          mode,
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        pathname?: string;
        url?: string;
        model?: string;
      };

      if (!response.ok || !payload.url || !payload.pathname) {
        throw new Error(payload.error || "A restauração não foi concluída.");
      }

      updateItem(item.id, {
        status: "completed",
        resultUrl: payload.url,
        resultPathname: payload.pathname,
        model: payload.model,
      });
    } catch (error) {
      updateItem(item.id, {
        status: "error",
        error:
          error instanceof Error
            ? error.message
            : "Não foi possível concluir esta imagem.",
      });
    }
  }

  async function startQueue() {
    if (processing) return;

    const queue = items.filter(
      (item) => item.status === "queued" || item.status === "error",
    );
    if (!queue.length) return;

    cancelRef.current = false;
    setProcessing(true);
    setNotice("");

    for (const item of queue) {
      if (cancelRef.current) break;
      await processItem(item);
    }

    setProcessing(false);
  }

  function stopAfterCurrent() {
    cancelRef.current = true;
    setNotice("A fila será interrompida assim que a imagem atual terminar.");
  }

  async function retryOne(item: QueueItem) {
    if (processing) return;
    cancelRef.current = false;
    setProcessing(true);
    await processItem(item);
    setProcessing(false);
  }

  async function deleteStoredResult(item: QueueItem) {
    if (!item.resultPathname) return;

    try {
      await fetch("/api/results/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-revitare-access": accessKey,
        },
        body: JSON.stringify({ pathname: item.resultPathname }),
      });
    } catch {
      // UI removal should not be blocked by best-effort cleanup.
    }
  }

  async function removeItem(item: QueueItem) {
    if (processing) return;
    await deleteStoredResult(item);
    URL.revokeObjectURL(item.previewUrl);
    setItems((current) => current.filter((entry) => entry.id !== item.id));
  }

  async function clearQueue() {
    if (processing) return;

    await Promise.all(items.map(deleteStoredResult));
    items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setItems([]);
    setNotice("");
  }

  function updateAccessKey(value: string) {
    setAccessKey(value);
    sessionStorage.setItem("revitare-access-key", value);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Revitare">
          <span className="brand-mark">R</span>
          <span>
            <strong>Revitare</strong>
            <small>preservação de memórias</small>
          </span>
        </a>

        <div className="beta-access">
          <label htmlFor="accessKey">Acesso beta</label>
          <input
            id="accessKey"
            type="password"
            autoComplete="off"
            placeholder="chave opcional"
            value={accessKey}
            onChange={(event) => updateAccessKey(event.target.value)}
            disabled={processing}
          />
        </div>
      </header>

      <section className="hero">
        <div>
          <span className="eyebrow">RESTAURAÇÃO FIEL · MVP</span>
          <h1>Recupere suas fotos sem perder quem está nelas.</h1>
          <p>
            Adicione várias fotografias. A Revitare trabalha em uma por vez:
            envia, restaura, conclui e só então inicia a próxima.
          </p>
        </div>

        <div className="hero-principle">
          <span className="principle-dot" />
          <div>
            <strong>Fila estritamente sequencial</strong>
            <span>1 imagem ativa · 1 chamada de restauração por vez</span>
          </div>
        </div>
      </section>

      <section className="workspace">
        <div className="controls-card">
          <div className="section-heading">
            <div>
              <span className="step">01</span>
              <h2>Escolha as fotografias</h2>
            </div>
            <span className="limit">{items.length}/{MAX_BATCH}</span>
          </div>

          <div
            className={`dropzone ${dragging ? "is-dragging" : ""} ${processing ? "is-disabled" : ""}`}
            onDragEnter={(event) => {
              event.preventDefault();
              if (!processing) setDragging(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => !processing && inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if ((event.key === "Enter" || event.key === " ") && !processing) {
                inputRef.current?.click();
              }
            }}
          >
            <input
              ref={inputRef}
              className="visually-hidden"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={onFileInput}
              disabled={processing}
            />
            <span className="upload-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 16V5M8 9l4-4 4 4" />
                <path d="M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" />
              </svg>
            </span>
            <strong>Arraste fotos aqui ou clique para selecionar</strong>
            <span>JPEG, PNG ou WebP · até 20 MB cada</span>
          </div>

          <div className="mode-block">
            <div className="section-heading compact">
              <div>
                <span className="step">02</span>
                <h2>Como devemos restaurar?</h2>
              </div>
            </div>

            <div className="mode-grid">
              <button
                type="button"
                className={`mode-option ${mode === "faithful" ? "selected" : ""}`}
                onClick={() => setMode("faithful")}
                disabled={processing}
              >
                <span className="mode-radio" />
                <strong>Restaurar com cuidado</strong>
                <small>
                  Altera o mínimo possível. É o modo padrão da Revitare.
                </small>
              </button>

              <button
                type="button"
                className={`mode-option ${mode === "detail" ? "selected" : ""}`}
                onClick={() => setMode("detail")}
                disabled={processing}
              >
                <span className="mode-radio" />
                <strong>Recuperar mais detalhes</strong>
                <small>
                  Permite reconstrução um pouco maior em áreas degradadas.
                </small>
              </button>
            </div>
          </div>

          <div className="queue-actions">
            <button
              className="primary-button"
              type="button"
              onClick={startQueue}
              disabled={
                processing ||
                !items.some(
                  (item) => item.status === "queued" || item.status === "error",
                )
              }
            >
              {processing ? (
                <>
                  <span className="spinner light" />
                  Processando fila
                </>
              ) : (
                <>
                  Restaurar fila
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m9 5 7 7-7 7" />
                  </svg>
                </>
              )}
            </button>

            {processing ? (
              <button
                className="text-button"
                type="button"
                onClick={stopAfterCurrent}
              >
                Parar depois da atual
              </button>
            ) : items.length ? (
              <button className="text-button" type="button" onClick={clearQueue}>
                Limpar fila
              </button>
            ) : null}
          </div>

          {notice ? <p className="notice">{notice}</p> : null}
        </div>

        <div className="queue-panel">
          <div className="queue-header">
            <div>
              <span className="eyebrow">FILA DE RESTAURAÇÃO</span>
              <h2>{items.length ? `${items.length} fotografias` : "Fila vazia"}</h2>
            </div>
            {items.length ? (
              <div className="progress-copy">
                <strong>{progress}%</strong>
                <span>
                  {counts.completed} concluída(s)
                  {counts.errors ? ` · ${counts.errors} falha(s)` : ""}
                </span>
              </div>
            ) : null}
          </div>

          {items.length ? (
            <>
              <div className="progress-track" aria-hidden="true">
                <span style={{ width: `${progress}%` }} />
              </div>

              <div className="queue-list">
                {items.map((item, index) => (
                  <article
                    className={`queue-item status-${item.status}`}
                    key={item.id}
                  >
                    <div className="thumb">
                      <Image
                        src={item.previewUrl}
                        alt=""
                        fill
                        sizes="88px"
                        unoptimized
                      />
                      <span className="queue-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="item-copy">
                      <div className="item-title-row">
                        <div>
                          <h3 title={item.name}>{item.name}</h3>
                          <span>{formatBytes(item.size)}</span>
                        </div>
                        <span className={`status-pill ${item.status}`}>
                          <QueueIcon status={item.status} />
                          {STATUS_LABELS[item.status]}
                        </span>
                      </div>

                      {item.status === "restoring" ? (
                        <p className="item-message">
                          Preservando composição e identidade. Esta etapa pode
                          levar alguns instantes.
                        </p>
                      ) : null}

                      {item.status === "error" && item.error ? (
                        <p className="item-error">{item.error}</p>
                      ) : null}

                      {item.status === "completed" && item.resultUrl ? (
                        <div className="result-block">
                          <div className="result-image">
                            <Image
                              src={item.resultUrl}
                              alt={`Restauração de ${item.name}`}
                              fill
                              sizes="(max-width: 900px) 80vw, 360px"
                              unoptimized
                            />
                          </div>
                          <div className="result-actions">
                            <a
                              className="small-primary"
                              href={item.resultUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Abrir resultado
                            </a>
                            <span>
                              {item.model
                                ? `Concluída com ${item.model}`
                                : "Restauração concluída"}
                            </span>
                          </div>
                        </div>
                      ) : null}

                      <div className="item-actions">
                        {item.status === "error" ? (
                          <button
                            type="button"
                            onClick={() => retryOne(item)}
                            disabled={processing}
                          >
                            Tentar novamente
                          </button>
                        ) : null}
                        {(item.status === "queued" ||
                          item.status === "error" ||
                          item.status === "completed") && (
                          <button
                            type="button"
                            onClick={() => removeItem(item)}
                            disabled={processing}
                          >
                            Remover
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="4" y="4" width="16" height="16" rx="3" />
                  <circle cx="9" cy="9" r="1.5" />
                  <path d="m6.5 17 4-4 2.5 2.5 2-2 2.5 3.5" />
                </svg>
              </span>
              <strong>Suas fotos aparecerão aqui</strong>
              <p>
                Você pode escolher várias de uma vez. O processamento permanece
                serial para manter custo e comportamento previsíveis.
              </p>
            </div>
          )}
        </div>
      </section>

      <footer className="footer">
        <p>
          <strong>Original preservado.</strong> O upload de trabalho é removido
          após cada tentativa; resultados podem ser excluídos pela própria fila.
        </p>
        <span>Revitare · MVP técnico 0.1</span>
      </footer>
    </main>
  );
}
