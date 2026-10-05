---
name: ai-weekly-newsletter
description: 为 kyrie-ai-insight 网站补做或更新一期 AI 周刊（index.html 时间轴新面板）并推送 GitHub Pages。Use when 用户要求更新周刊、补做落下的一期、或按三模块搜索本周 AI 新闻写周刊。Do not use for 深度调研报告（research.html）或非周刊类页面修改。
---

# AI 周刊更新（kyrie-ai-insight）

为纯静态站点 index.html 的时间轴新增一期周刊。完整流程分三阶段：**搜索采集 → 呈报等确认 → 写 HTML 推送**。确认门是硬闸门，任何阶段不得跳过。

## 0. 环境事实（先读，避免踩坑）

- 工作目录：`c:\Users\yikai\Documents\trae_projects\ai-insight`，主文件 `index.html`（约 290KB，内联 CSS/JS）。
- Git 已装但可能不在 PATH：用全路径 `C:\Program Files\Git\cmd\git.exe`。凭证由 Windows Credential Manager 托管，push 免密。
- 线上：https://ailiuliuliu.github.io/kyrie-ai-insight/ ，推 main 即部署（约 30–60 秒生效）。
- 无 python/node；本地预览用 PowerShell `System.Net.HttpListener`（见第 5 节脚本）。
- 未跟踪的本地文件 `ai-research-brain/`、`ai-research-brain-main.zip` **永远不要提交**：只 `git add 指定文件`，严禁 `git add -A`。
- 期数与最新 weekMMDD 不要靠记忆：动手前先 grep `持续更新 · N期` 和时间轴第一个 `timeline-btn` 核实。

## 1. 三轮搜索采集（缺一不可）

1. 第一轮：按三模块多关键词并行搜索（模型 / 应用 / 上下游，中英文关键词都要）。
2. 第二轮：宽泛关键词全域兜底（如 "AI news week of 日期"、融资汇总、发布会汇总）。
3. 第三轮：针对空缺模块与存疑条目定向补搜。未做兜底不得呈报。

## 2. 日期与链接铁律

- 每条核实**原文发布日期**落在周期内：看文章自身发布时间，不看摘要里提到的事件日期。
- 临界事件按"事件本身发生/发布日"判定，不按国内转载报道日（例：某产品官方文档 9.17 上线、媒体 9.21 报道 → 属上一周）。
- 法案/政策查国会原文或首发媒体核实提出日，警惕二手汇总稿日期错位。
- 每条附真实可访问的原文 URL，优先一手来源（官方博客、政府网站、SEC/法庭文件），不可伪造；搜不到原文就标「未找到原文链接」。
- 传闻口径（如 The Information 援引知情人士）保留「待官方证实」措辞；科学发现有复现争议时保留待验证口径。
- 与上一期及更早各期去重：grep index.html 确认事件未收录过。周期外事件（即使很热门）一律不收。

## 3. 三模块分类（每条只归一类）

- **模型**：模型发布/训练/开源/评测基准/安全研究。
- **应用**：C 端产品、Agent 落地、用量数据、垂直行业。
- **上下游**：芯片算力、云基建、融资并购、监管立法。
- 同一事件在"本周必读"出现后，模块区不重复列；但要检查模块的国内外平衡——若某模块全为国内条目，主动补搜同周期国外动态换入（必读已占用的除外）。

## 4. 呈报与确认门

- 呈报格式：**3 条本周必读 + 三模块各 3 条 = 12 条**，每模块合并一节完整呈现，每条含标题、一两句事实摘要、真实 URL、日期。
- 开头给一句"本周核心判断"主线（多线交织时用「A × B × C」式概括）。
- 边界条目单列"需要你定夺"区说明（临界日期、单一弱来源、备选条目）。
- **必须等明确确认词**（可以/写吧/确认/OK/没问题/搞定）才写 HTML。
- 回复含"但是/能不能/加上/为什么没"等 = 修改信号：补搜或调整后**重新呈报完整 12 条**，再等确认。会话恢复后也必须重新确认。

## 5. 写 HTML

面板骨架见 `assets/date-panel-template.html`，以 index.html 中最新一期面板为最终样式基准（class 命名保持一致）。

1. 新面板插在所有 date-panel 最前面：`<div class="date-panel active" id="weekMMDD">`，注释写「第N期：周期」。
2. 原最新面板的 class 从 `date-panel active` 改为 `date-panel`。
3. 时间轴：最前面加新按钮（class 带 active），原第一个按钮去掉 active；按现有「按钮 + timeline-line」交替结构插入。
4. header：`持续更新 · N期` 的数字 +1。
5. 行文规范：
   - 事实与判断分层：模块条目用 `<strong>` 收束判断；必读写在 mustread-why 末尾的 `<em>` 段，用"我的判断是…/我的判断保持克制"等自然表达，不用生硬标签、不写 AI 腔 meta 文字。
   - 标题挂链接用 `<a target="_blank" style="color:inherit;text-decoration:none;">`。
   - 标签复用现有 ntag-red/blue/purple/green/orange/cyan/yellow。
6. 改完结构自检：
   - 全文 `date-panel active` 与 `timeline-btn active` 各只有 1 处；
   - switchNewsTab 的 id 与新面板 id 一致；
   - div 配平（对照模板开闭）。

本地预览（后台执行）：

```powershell
$l=New-Object System.Net.HttpListener; $l.Prefixes.Add('http://localhost:8000/'); $l.Start(); while($l.IsListening){ $c=$l.GetContext(); $u=$c.Request.Url.AbsolutePath; if($u -eq '/'){$u='/index.html'}; $p=Join-Path 'c:\Users\yikai\Documents\trae_projects\ai-insight' $u.TrimStart('/'); if(Test-Path $p -PathType Leaf){ $b=[IO.File]::ReadAllBytes($p); $c.Response.OutputStream.Write($b,0,$b.Length) } else { $c.Response.StatusCode=404 }; $c.Response.Close() }
```

## 6. 提交前 diff 校验

```powershell
$git='C:\Program Files\Git\cmd\git.exe'
& $git diff --stat
# 删除行应只有 3 类预期修改：part-num 期数、旧按钮去 active、旧面板去 active
& $git diff | Select-String '^-' | Select-String -NotMatch '^---'
```

出现任何非预期删除行立即停止、查清再提交。commit message 形如 `周刊第N期（周期）：新增 weekMMDD 面板`。

## 7. 推送与线上验证

1. `git add index.html`（只加明确改动的文件）→ `git commit`。
2. push 需在沙箱外执行（GCM 要写凭证库）：`& $git push origin main`，EXITCODE=0 即成功（stderr 出现 `cb..xx main -> main` 是正常进度输出不是错误）。
3. 确认远端 main 最新 commit：`https://api.github.com/repos/ailiuliuliu/kyrie-ai-insight/commits/main`。
4. 轮询 Pages（URL 加 `?v=时间戳` 破缓存），内容含新 weekMMDD 与新期数才算完成；一般 1–2 次轮询（15s/次）生效。
5. 交付时给用户线上链接，并简述本期边界处理（剔除了哪些临界条目、为什么）。

## 8. 常见坑速查

- PowerShell profile 报 PSSecurityException 红字：无害，忽略。
- curl 访问 GitHub 报 schannel 吊销检查错误：加 `--ssl-no-revoke`。
- CRLF：仓库配置 core.autocrlf=false，不要改；否则 diff 出现全文件噪声。
- 期数注释：写前先看最新面板注释里的「第N期」，新期 = N+1。
- 数字口径：引用融资/估值时区分人民币与美元，二手周报可能写错数量级，回一手报道核对。
