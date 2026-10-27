export type JsonBodyResult =
  | { success: true; data: unknown }
  | { success: false; status: 400 | 413 };

export async function readJsonBody(
  stream: AsyncIterable<Uint8Array>,
  maxBytes: number
): Promise<JsonBodyResult> {
  const chunks: Uint8Array[] = [];
  let size = 0;
  for await (const chunk of stream) {
    size += chunk.byteLength;
    if (size > maxBytes) return { success: false, status: 413 };
    chunks.push(chunk);
  }

  try {
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return { success: true, data: JSON.parse(new TextDecoder().decode(bytes)) };
  } catch {
    return { success: false, status: 400 };
  }
}
