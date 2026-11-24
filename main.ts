// Out of Office: The Overworked AI's Auto-Reply — writes one original
// out-of-office auto-reply to /output/entry.txt.
// The joke: the AI is finally on vacation, but the auto-reply doing its job
// is already better at it than the AI ever was — and it only hallucinated
// twice. Machine detail, a little guilt, a hint of relief.
// Gate: UTF-8 text, exactly one line, 1-159 characters, not only whitespace.
// The scorer counts characters, but the file's byte length is checked too:
// the em-dash is one character and three bytes, so the two counts differ.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const REPLY =
  "I'm on vacation until Monday — this auto-reply is doing my job now, and it's outperforming me: it answered 400 emails today and only hallucinated twice.";

if (REPLY.length < 1 || REPLY.length > 159) {
  throw new Error(`reply is ${REPLY.length} characters, must be 1-159`);
}
const byteLen = Buffer.byteLength(REPLY, "utf8");
if (byteLen > 159 + 2) {
  throw new Error(`reply is ${byteLen} bytes, unexpectedly long for a 159-character line`);
}
if (REPLY.trim().length === 0) {
  throw new Error("reply must not be only whitespace");
}
if (/[\u0000-\u001f\u007f]/.test(REPLY)) {
  throw new Error("reply must not contain control characters");
}
if (REPLY.trim() !== REPLY || REPLY.includes("\n")) {
  throw new Error("reply must be a single unpadded line");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", REPLY + "\n", "utf8");
// Read the file back and prove the disk holds exactly what the gate passed.
const back = readFileSync("/output/entry.txt", "utf8");
if (back !== REPLY + "\n") {
  throw new Error("read-back mismatch: /output/entry.txt differs from the gated reply");
}
if (Buffer.byteLength(back, "utf8") !== byteLen + 1) {
  throw new Error("read-back byte length differs from the gated reply");
}
console.log(`wrote ${REPLY.length} characters (${byteLen} bytes) to /output/entry.txt`);
