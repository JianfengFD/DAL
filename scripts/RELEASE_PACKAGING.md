# DAL 便携发布包

by JF_Li@FD & Sol

先更新构建，再打包并验证实际 ZIP：

```sh
cd game
npm run build
python3 scripts/package_release.py --verify-http
```

默认产物位于 `releases/`：

- `DAL-v1.0.0-portable.zip`
- `DAL-v1.0.0-portable.zip.sha256`
- `DAL-v1.0.0-portable.json`（路径、SHA256 与 HTTP 验证报告）

可用 `--version 1.0.1` 与 `--output-dir /目标目录` 指定版本与产物目录。打包脚本只需要 Python 标准库；npm 仅在开发者重新构建网页时使用，玩家无需 npm。

ZIP 通过允许列表只收集 `dist`、三个系统启动器、`run_game.py`、玩家 README、完整第三方许可、可选现有原创许可证与文件校验清单。不会收集源码配置、`.openai`、Git、node_modules、Blender 运行时、视频、临时帧或音频。视频应作为单独的发布附件。

`--verify-http` 会将本次 ZIP 真正解压到临时目录，用解压出来的启动器在 `127.0.0.1` 自动分配端口，检查首页与全部静态文件的 HTTP200／字节长度，然后关闭服务并清理该测试目录。不启动浏览器、不读取玩家存档。

macOS／Linux 启动器已做本机语法与完整包检查；Windows 启动器为 CRLF 批处理，依次查找 `py -3`、`python`、`python3`。当前开发环境为 macOS，因此没有声称在真实 Windows 系统运行过。

## 公开源文件前的素材检查

```sh
python3 blender/sanitize_assets.py
python3 blender/sanitize_assets.py --verify
python3 blender/validate_assets.py
```

清理器将 Blender 文件中的本机用户目录字段改为相对目录，并移除 PNG 的文本元数据。PNG 的 IHDR、调色板／透明度与压缩像素 IDAT chunk 保持逐字节相同；不重绘、不重新压缩像素。场景生成器会自动执行相同清理。公开源文件应排除视频的工作帧、旁白音频与含本机绝对路径的原始记录 JSON。

## 第三方许可收集

现有 `THIRD_PARTY_NOTICES.txt` 保留了 Three.js 的完整 MIT 文本，与已安装依赖的 LICENSE 一致。不要把第三方 MIT 自动套用到本项目的原创源码与素材。当前便携包不包含 Blender 程序、系统字体或配音工具；这些开发工具无需随包分发。以后若加入新的运行时库、字体、模型或音频，应同时核对并收集其自身许可。
