import { test } from "node:test";
import assert from "node:assert/strict";
import { classifyServerExit } from "./native.js";

test("classifyServerExit: 我們要求的停止一律算正常 exited", () => {
  assert.equal(classifyServerExit(0, null, true), "exited");
  assert.equal(classifyServerExit(1, null, true), "exited"); // killTree 送 SIGTERM/非 0 也是我們要的停止
  assert.equal(classifyServerExit(null, "SIGKILL", true), "exited");
});

test("classifyServerExit: 非預期退出依 code/signal 判崩潰", () => {
  assert.equal(classifyServerExit(0, null, false), "exited"); // 乾淨退出(罕見的非預期正常關)
  assert.equal(classifyServerExit(1, null, false), "crash"); // 非 0 = 崩潰
  assert.equal(classifyServerExit(139, null, false), "crash"); // segfault
  assert.equal(classifyServerExit(null, "SIGSEGV", false), "crash"); // 被 signal 砍 = 崩潰
});
