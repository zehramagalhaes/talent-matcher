import { test } from "node:test";
import assert from "node:assert/strict";
import { AnalyzeRequestSchema, isSupportedGeminiModelId } from "../src/api/analyze/requestSchema.ts";
import { getClientRateLimitKey, isRateLimited } from "../src/api/security/rateLimit.ts";
import { readJsonBody } from "../src/api/security/readJsonBody.ts";
import { Readable } from "node:stream";

const validRequest = {
  resumeText: "Resume details ".repeat(10),
  jobDescription: "Role requirements ".repeat(5),
};

test("validates bounded analysis inputs and rejects extra or malformed values", () => {
  assert.equal(AnalyzeRequestSchema.safeParse(validRequest).success, true);
  assert.equal(
    AnalyzeRequestSchema.safeParse({ ...validRequest, resumeText: "short" }).success,
    false
  );
  assert.equal(
    AnalyzeRequestSchema.safeParse({ ...validRequest, resumeText: "x".repeat(30_001) }).success,
    false
  );
  assert.equal(AnalyzeRequestSchema.safeParse({ ...validRequest, unexpected: "value" }).success, false);
  assert.equal(
    AnalyzeRequestSchema.safeParse({ ...validRequest, selectedModel: "https://attacker.invalid" })
      .success,
    false
  );
});

test("allows only supported text generation model identifiers", () => {
  assert.equal(isSupportedGeminiModelId("gemini-3-flash-preview"), true);
  assert.equal(isSupportedGeminiModelId("gemini-2.5-pro"), true);
  assert.equal(isSupportedGeminiModelId("gemini-2.5-flash-image"), false);
  assert.equal(isSupportedGeminiModelId("custom-model"), false);
});

test("applies an expiring in-memory rate limit and derives a client key", () => {
  const key = `test:${Date.now()}:${Math.random()}`;
  assert.equal(isRateLimited(key, 2, 1000, 100), false);
  assert.equal(isRateLimited(key, 2, 1000, 200), false);
  assert.equal(isRateLimited(key, 2, 1000, 300), true);
  assert.equal(isRateLimited(key, 2, 1000, 1200), false);
  assert.equal(
    getClientRateLimitKey({ "x-vercel-forwarded-for": "203.0.113.7", "x-forwarded-for": "proxy" }, "fallback"),
    "203.0.113.7"
  );
});

test("reads bounded JSON and returns structured parse and size failures", async () => {
  const body = Buffer.from('{"ok":true}');
  assert.deepEqual(await readJsonBody(Readable.from([body]), 32), { success: true, data: { ok: true } });
  assert.deepEqual(await readJsonBody(Readable.from([Buffer.from("{")]), 32), {
    success: false,
    status: 400,
  });
  assert.deepEqual(await readJsonBody(Readable.from([Buffer.alloc(33)]), 32), {
    success: false,
    status: 413,
  });
});
