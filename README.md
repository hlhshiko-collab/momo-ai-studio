# AI Studio · 墨墨 API（PWA）

这是一个个人使用的静态 PWA，默认直接从浏览器请求墨墨 API，适合部署到 GitHub Pages 后安装到 Android Chrome 主屏幕。

## 按 New API 官方路由调用

- OpenAI 兼容模型列表：`GET /v1/models`，Bearer Token，读取 `data[].id`。
- OpenAI Chat Completions：`POST /v1/chat/completions`，Bearer Token，`model` + `messages`，本项目使用 `stream: true` 读取 `data:` SSE 事件并以 `[DONE]` 结束。
- Gemini 原生模型列表：`GET /v1beta/models`，读取 `models[].name`。
- Gemini 原生生成：`POST /v1beta/models/{model}:generateContent`，Bearer Token，Gemini 请求体使用 `contents`、`generationConfig`；图片从 `candidates[].content.parts[].inlineData` 提取。
- Gemini 兼容路径：`POST /v1/models/{model}:generateContent`，保留为备选调用模式。
- OpenAI 图片生成：`POST /v1/images/generations`。New API 文档的标准参数主要说明 DALL·E / GPT Image，不应默认认为 Nano Banana 支持此路径。

参考：
- New API 源码与路由：https://github.com/QuantumNous/new-api
- 官方 Chat Completions 文档：https://docs.newapi.pro/zh/docs/api/ai-model/chat/openai/createchatcompletion
- 官方 Gemini 文档：https://docs.newapi.pro/zh/docs/api/ai-model/chat/gemini/geminirelayv1beta
- 官方图像生成文档：https://docs.newapi.pro/zh/docs/api/ai-model/images/openai/post-v1-images-generations

## 部署到 GitHub Pages（HTTPS）

1. 登录 GitHub，创建仓库，例如 `momo-ai-studio`。
2. 将 `index.html`、`manifest.webmanifest`、`sw.js`、`icon.svg`、`README.md` 上传到仓库根目录。
3. 在仓库 **Settings → Pages** 中选择 **Deploy from a branch**，分支 `main`，目录 `/(root)`，保存。
4. 等待 GitHub Pages 显示 HTTPS 地址。
5. 用 Android Chrome 打开站点，菜单 `⋮` → **添加到主屏幕** 或 **安装应用**。

## 使用与安全

- API Key 不写入项目源码或 GitHub 仓库；默认不保存在浏览器本地存储。
- 只有主动勾选“在此浏览器记住 API Key”才会存入当前设备的 localStorage。仅在自己的手机启用，不要在公用设备开启。
- 该项目是静态前端，浏览器直接请求墨墨 API；提供商必须允许对应 CORS 请求。
- Service Worker 只缓存静态网页外壳，模型调用仍需要网络。自动更新发布后重新打开网页；若看到旧版本，在 Chrome 网站设置中清除此站点数据。
- 设置按模式保留上次选择的模型；最近文字聊天记录会恢复为可继续上下文的对话（最多 80 条消息）。图片结果不长期存入聊天存储，生成后可点“保存图片”。

不要把真实 API Key 写入 `index.html`、README 或截图中。
