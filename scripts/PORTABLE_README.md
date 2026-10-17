# DAL · 大夏学术浮生 {{VERSION}}

by JF_Li@FD & Sol

一款有 Blender 3D 校园、科研、教学、同事、基金与人才称号的架空学界策略游戏。

## 开始游玩

1. **完整解压** 下载的 ZIP；保留启动器、`run_game.py` 与 `dist` 文件夹在同一级目录。
2. 安装 **Python 3.8 或更新版本**，并准备现代浏览器（Chrome、Edge、Firefox 或 Safari）。Python 官网：<https://www.python.org/downloads/>。
3. 按系统启动：
   - **macOS**：双击 `macOS.command`；也可在该目录终端运行 `python3 run_game.py`。
   - **Windows**：双击 `Windows.bat`；也可在该目录终端运行 `py -3 run_game.py`。
   - **Linux**：在该目录终端运行 `./Linux.sh`，或 `python3 run_game.py`。
4. 浏览器会打开游戏。保持启动器窗口开启；结束时在该窗口按 **Ctrl+C**。

便携包已包含完整网页、脚本、4 个场景模型与预览图片。**无需 npm、无需 Blender、无需下载其他游戏依赖。** 不要直接双击 `dist/index.html`；请通过启动器打开。

如果浏览器没有自动打开，请复制启动器显示的 `http://127.0.0.1:端口/` 地址。服务器只接受本机连接。需要检查文件时可运行 `python3 run_game.py --check`。

## 保存与继续

每次行动自动保存在当前浏览器与本地地址下。清理浏览器数据、更换浏览器或端口后，请使用游戏“设置 → 导入存档”继续。建议退出前“设置 → 导出存档”备份。

默认端口为 `5173`。如默认端口被占用，启动器会显示另一个可用地址；旧存档仍属于原地址。也可显式指定 `python3 run_game.py --port 5174`。

## 版权

欢迎免费下载游玩。原创代码与素材保留版权，未另行授予再发布或商用许可。

第三方组件的完整许可见本包 `THIRD_PARTY_NOTICES.txt`。所有地名、机构、人物、事件与游戏数值均为虚构。
