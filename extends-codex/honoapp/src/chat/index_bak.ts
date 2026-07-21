// import { zValidator } from "@hono/zod-validator";
// import { Hono } from "hono";
// import { hc } from "hono/client";
// import { spawn } from "node:child_process";
// import { existsSync, mkdirSync, readFileSync } from "node:fs";
// import { join } from "node:path";
// import store, { runtime } from "../store";
// import { z } from "zod";
// import { codexCliSchema } from "./schema";

// export default new Hono().basePath("/chat")
//   .post("/codexcli",
//     zValidator("json", codexCliSchema),
//     async (ctx) => {
//       const input = ctx.req.valid("json");
//       try {
//         const chatConfig = store.getState().chat;
//         const defaultOutputDir = join(runtime.CWD_PATH, ".log");
//         mkdirSync(defaultOutputDir, { recursive: true });
//         const outputLastMessage = input.outputLastMessage
//           ?? join(defaultOutputDir, `codexcli-last-message-${Date.now()}.txt`);
//         const args = ["exec", "-"];
//         args.push("--model", input.model ?? "openai/gpt-oss-120b:free");
//         if (input.profile) args.push("--profile", input.profile);
//         if (input.sandbox) args.push("--sandbox", input.sandbox);
//         if (input.cd) args.push("--cd", input.cd);
//         for (const dir of input.addDir ?? []) args.push("--add-dir", dir);
//         for (const image of input.image ?? []) args.push("--image", image);
//         for (const [key, value] of Object.entries(input.config ?? {})) args.push("--config", `${key}=${value}`);
//         for (const feature of input.enable ?? []) args.push("--enable", feature);
//         for (const feature of input.disable ?? []) args.push("--disable", feature);
//         if (input.oss) args.push("--oss");
//         if (input.localProvider) args.push("--local-provider", input.localProvider);
//         if (input.skipGitRepoCheck) args.push("--skip-git-repo-check");
//         if (input.ephemeral) args.push("--ephemeral");
//         if (input.ignoreUserConfig) args.push("--ignore-user-config");
//         if (input.ignoreRules) args.push("--ignore-rules");
//         if (input.outputSchema) args.push("--output-schema", input.outputSchema);
//         if (input.color) args.push("--color", input.color);
//         if (input.json) args.push("--json");
//         args.push("--config", `model_provider="openrouter"`);
//         args.push("--config", `model_providers.openrouter.name="OpenRouter"`);
//         args.push("--config", `model_providers.openrouter.base_url="${chatConfig.baseUrl}"`);
//         args.push("--config", `model_providers.openrouter.env_key="OPENROUTER_API_KEY"`);
//         args.push("--config", `model_providers.openrouter.wire_api="responses"`);
//         args.push("--output-last-message", outputLastMessage);
//         if (input.bypass) args.push("--dangerously-bypass-approvals-and-sandbox");

//         let command = "codex";
//         let prefixArgs: string[] = [];
//         if (process.platform === "win32") {
//           for (const dir of (process.env.PATH ?? "").split(";").filter(Boolean)) {
//             const codexJs = join(dir, "node_modules", "@openai", "codex", "bin", "codex.js");
//             if (!existsSync(codexJs)) continue;
//             command = process.execPath;
//             prefixArgs = [codexJs];
//             break;
//           }
//         }
//         const child = spawn(command, [...prefixArgs, ...args], {
//           cwd: runtime.CWD_PATH,
//           env: {
//             ...process.env,
//             OPENAI_API_KEY: chatConfig.apiKey,
//             OPENAI_BASE_URL: chatConfig.baseUrl,
//             OPENROUTER_API_KEY: chatConfig.apiKey,
//           },
//           stdio: ["pipe", "pipe", "pipe"],
//           windowsHide: true,
//         });

//         child.stdin.end(input.prompt);
//         child.stdout.setEncoding("utf8");
//         child.stderr.setEncoding("utf8");

//         let output = "";
//         const stdout = async () => {
//           for await (const text of child.stdout) {
//             output += text;
//           }
//         };
//         const stderr = async () => {
//           for await (const text of child.stderr) {
//             output += text;
//           }
//         };
//         const close = new Promise<number | null>((resolve, reject) => {
//           child.on("error", reject);
//           child.on("close", (code) => {
//             resolve(code);
//           });
//         });
//         const [code] = await Promise.all([close, stdout(), stderr()]);
//         const lastMessage = existsSync(outputLastMessage)
//           ? readFileSync(outputLastMessage, "utf8").trim()
//           : "";
//         if (lastMessage) return ctx.text(lastMessage);
//         if (code !== 0) return ctx.text(output.trim() || `Codex CLI exited with code ${code ?? "unknown"}`, 500);
//         return ctx.text("Codex CLI response is empty");
//       } catch (error) {
//         return ctx.text(error instanceof Error ? error.message : String(error), 500);
//       }
//     }
//   )
//   .post("/openairouter",
//     zValidator("json", z.object({
//       prompt: z.string().min(1),
//     }).strict()),
//     (ctx) => {
//       const input = ctx.req.valid("json");
//       const encoder = new TextEncoder();
//       const route = new Hono().post("/chat/completions", (ctx) => ctx.json<{
//         choices: {
//           message?: {
//             content?: string;
//           };
//           delta?: {
//             content?: string;
//           };
//         }[];
//       } | {
//         error: {
//           code?: string;
//           message: string;
//           type?: string;
//         };
//       }>({} as any));
//       return new Response(new ReadableStream<Uint8Array>({
//         async start(controller) {
//           const write = (text: string) => {
//             controller.enqueue(encoder.encode(text));
//           };
//           try {
//             const chatConfig = store.getState().chat;
//             const response = await hc<typeof route>(chatConfig.baseUrl).chat.completions.$post({
//               json: {
//                 messages: [{ role: "user", content: input.prompt }],
//                 max_tokens: 512,
//                 model: "openai/gpt-oss-120b:free",
//                 stream: true,
//               },
//             }, {
//               headers: {
//                 Accept: "*/*",
//                 Authorization: `Bearer ${chatConfig.apiKey}`,
//                 "HTTP-Referer": "http://127.0.0.1",
//                 "X-Title": "HonoCodex",
//                 "X-OpenRouter-Title": "HonoCodex",
//               },
//             });
//             if (!response.ok) {
//               const text = await response.text();
//               let message = text;
//               try {
//                 const parsed: unknown = JSON.parse(text);
//                 const error = typeof parsed === "object" && parsed && "error" in parsed ? parsed.error : undefined;
//                 const errorMessage = typeof error === "object" && error && "message" in error ? error.message : undefined;
//                 if (typeof errorMessage === "string") message = errorMessage;
//               } catch {
//                 message = text;
//               }
//               write(message);
//               return;
//             }
//             const reader = response.body?.getReader();
//             if (!reader) throw new Error("OpenRouter response has no body");
//             const decoder = new TextDecoder();
//             let eventText = "";
//             let output = "";
//             const consume = (value: string) => {
//               eventText += value;
//               const events = eventText.split(/\r?\n\r?\n/);
//               eventText = events.pop() ?? "";
//               for (const event of events) {
//                 const data = event
//                   .split(/\r?\n/)
//                   .filter(line => line.startsWith("data:"))
//                   .map(line => line.slice(5).trimStart())
//                   .join("\n");
//                 if (!data || data === "[DONE]") continue;
//                 const payload = JSON.parse(data) as {
//                   error?: { message?: string };
//                   choices?: {
//                     delta?: { content?: string };
//                     message?: { content?: string };
//                   }[];
//                 };
//                 if (payload.error?.message) throw new Error(payload.error.message);
//                 for (const choice of payload.choices ?? []) {
//                   const content = choice.delta?.content ?? choice.message?.content;
//                   if (!content) continue;
//                   output += content;
//                   write(content);
//                 }
//               }
//             };
//             for (; ;) {
//               const result = await reader.read();
//               if (result.done) break;
//               consume(decoder.decode(result.value, { stream: true }));
//             }
//             consume(decoder.decode());
//             if (!output.trim()) write("OpenRouter response is empty");
//           } catch (error) {
//             write(error instanceof Error ? error.message : String(error));
//           } finally {
//             controller.close();
//           }
//         },
//       }), {
//         headers: {
//           "Content-Type": "text/plain; charset=utf-8",
//         },
//       });
//     }
//   )
//   .post("/", zValidator("json", z.object({
//     prompt: z.string().min(1),
//   }).strict()), async (ctx) => {
//     const input = ctx.req.valid("json");
//     const chatConfig = store.getState().chat;
//     const route = new Hono().post("/chat/completions", (ctx) => ctx.json<{
//       choices: {
//         message?: {
//           content?: string;
//         };
//       }[];
//     } | {
//       error: {
//         code?: string;
//         message: string;
//         type?: string;
//       };
//     }>({} as any));
//     const response = await hc<typeof route>(chatConfig.baseUrl).chat.completions.$post({
//       json: {
//         messages: [{ role: "user", content: input.prompt }],
//         model: "gpt-5.4-mini",
//         stream: false,
//       },
//     }, {
//       headers: {
//         Accept: "*/*",
//         Authorization: `Bearer ${chatConfig.apiKey}`,
//       },
//     });
//     return ctx.json(await response.json());
//   });


// // base_url (OpenAI)	https://api.deepseek.com
// // base_url (Anthropic)	https://api.deepseek.com/anthropic
// // api_key	sk-9bc20b15e8f946039297ab12016f7436
// // model*	deepseek-v4-flash
// // deepseek-v4-pro