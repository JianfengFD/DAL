# DAL · 大夏 · 学术浮生

**by JF_Li@FD & Sol**

**Daxia Academic Life**，简称 **DAL**。一款以虚构“大夏”学界为舞台的季度策略 RPG：读书、研究、任教、申报、参会与合作，共同构成一段学术人生。

[English introduction](README.en.md) · **[下载 v1.0.0 玩家包](https://github.com/JianfengFD/DAL/releases/download/v1.0.0/DAL-v1.0.0-portable.zip)** · [所有最新发布](https://github.com/JianfengFD/DAL/releases/latest) · [完整玩法](docs/GAMEPLAY.md)

## 先看演示

[![大夏 · 学术浮生游戏画面：Blender 原创校园与季度行动界面](docs/media/game-preview.jpg)](docs/media/dal-gameplay-zh.mp4)

**[观看中文游戏演示](docs/media/dal-gameplay-zh.mp4)** · **[下载演示视频 MP4](https://github.com/JianfengFD/DAL/releases/download/v1.0.0/DAL-gameplay-zh.mp4)**

约 4 分 12 秒的中文加速解说，展示一条实际游玩路线：**32 岁青年讲师开局 → 36 岁 9 个月晋升副教授 → 40 岁入选杰青**。这是一段成长示范；获得杰青后仍可继续研究、育人与追求其他结局。

## 下载与开始

下载 **[DAL-v1.0.0-portable.zip 玩家包](https://github.com/JianfengFD/DAL/releases/download/v1.0.0/DAL-v1.0.0-portable.zip)**，解压整个文件夹；新版本见 **[Releases 下载页](https://github.com/JianfengFD/DAL/releases/latest)**。

**玩家包已经包含 `dist/`。GitHub 绿色 `Code → Download ZIP` 下载的是源码，需先执行 `npm ci` 和 `npm run build`，才能使用启动器。**

运行环境：**Python 3.9+** 与支持 WebGL 的现代桌面浏览器。便携包已包含构建好的游戏，游玩无需安装 Node.js 或 Blender。

| 系统 | 启动方式 |
| --- | --- |
| macOS | 双击 `macOS.command` |
| Windows | 双击 `Windows.bat` |
| Linux | 在解压目录运行 `bash ./Linux.sh` |

提供上述三种系统的启动器；当前实际验证环境为 macOS 与 Python 本机 HTTP 服务，Windows、Linux 启动器尚未在对应系统实测。

启动器会运行本地服务并打开浏览器。游玩时保持终端窗口开启；关闭游戏服务可在该窗口按 `Ctrl+C`。

也可以在解压目录手动运行：

```bash
python3 run_game.py
```

Windows 也可使用：

```powershell
py -3 run_game.py
```

服务仅监听本机 `127.0.0.1`。默认端口被占用时会另选可用端口，请打开终端显示的地址。请通过启动器访问游戏，避免直接打开 `dist/index.html`。

## 你会在大夏经历什么

- **三个起点**：18 岁本科新生、25 岁在读博士、32 岁青年教师；搭配 5 个研究方向、5 种成长背景和 3 档难度。
- **科研循环**：提出问题、收集证据、追问反常、复核数据、写作与投稿。热门、稳健和原创课题各有取舍。
- **完整生涯**：本科、硕士、博士、博后、助教、讲师、副教授、教授；岗位与人才称号分别发展。
- **大学日常**：备课、授课、课程建设、学生指导、同事互助、院系考核，以及科研处、人事处、教务处和财务处的流程。
- **资源与关系**：大夏自然基金委、大夏科技署、会议、人才项目、四唯压力与权学交易。短期便利可能留下之后才兑现的代价。
- **Blender 场景**：可旋转与点选的 3D 校园，以及实验室、会议厅、课堂；另有 6 座城市的资源与生活选择。

当前版本含 **67 个事件、201 个选项、12 位主要人物、4 个院系、6 个校内行政部门、6 场具名会议**，以及省域青拔、优青、长河学者、杰青、科技署领军、院士 6 类人才或荣誉称号。

每季有 4 格时间。点击校园建筑或底部行动栏做事，在“全部行动”查看完整选项；通过“研究”“事务”“人脉”“生涯”“舆图”与“手册”查看进展和条件。研究、课堂与生活都需要安排时间，详见 [完整玩法指南](docs/GAMEPLAY.md)。

## 存档

每次行动与换季都会自动保存到当前浏览器。右上角 **“存档与设置”** 提供手动保存、导出和导入 JSON 存档，也提供可复制的完整存档文本。

存档保存在当前浏览器和访问地址下；换浏览器、设备或本地端口之前，请先导出备份，再在新入口导入。导入和新开局会替换当前自动存档。游戏无需账号，没有云端存档同步。

## 从源码开发

源码仓库的根目录就是游戏目录。需要 Node.js **20.19+ 或 22.12+**，以及随 Node.js 安装的 npm：

```bash
git clone https://github.com/JianfengFD/DAL.git
cd DAL
npm ci
npm run dev
```

打开终端显示的本机开发地址。测试与正式构建：

```bash
npm test
npm run build
python3 run_game.py
```

`npm run build` 生成 `dist/`；克隆仓库或通过 `Code → Download ZIP` 获取源码后，均需先构建，再使用 Python 启动器。游戏不依赖账号、后端数据库或第三方 API。

| 目录 / 文件 | 内容 |
| --- | --- |
| `src/` | 季度模拟引擎、叙事、界面、3D 交互与合成声景 |
| `public/assets/` | 浏览器加载的 GLB 场景、坐标元数据与预览图 |
| `blender/` | Blender Python 场景程序、可编辑工程与资产检查工具 |
| `docs/` | 玩法、制度来源、验证记录、截图与演示视频 |
| `run_game.py` | 使用 Python 标准库的本机游戏启动器 |

重新生成场景需要 Blender，推荐 4.5 LTS：

```bash
blender --background --python blender/build_scenes.py -- --scene all
python3 blender/validate_assets.py
```

开发细节见 [架构说明](docs/ARCHITECTURE.md)、[验证记录](docs/VALIDATION.md) 与 [Blender 场景说明](blender/README.md)。

## 架空设定与使用说明

大夏自然基金委、大夏科技署、高沪市、大江市、深河市及全部院校、人物与事件均为虚构。薪酬、津贴、项目经费、年龄窗口、评审概率和晋升条件都是**游戏数值**，不对应特定现实个人或真实待遇。

现实制度资料用于区分职称、科研项目、荣誉、个人收入与科研经费，见 [官方来源与架空边界](docs/SOURCES.md)。

欢迎免费下载游玩。原创代码、叙事、场景及其他原创素材保留版权，未另行授予再发布或商用许可。第三方组件许可见 [public/THIRD_PARTY_NOTICES.txt](public/THIRD_PARTY_NOTICES.txt)。
