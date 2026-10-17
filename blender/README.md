# 大夏 · 学术浮生 — Blender 场景

by JF_Li@FD & Sol

全部场景由 `build_scenes.py` 用 Blender Python 程序生成，无外部纹理、字体或第三方模型。模型为低多边形校园与剖面室内，采用象牙白、深青色与秋日金色。浏览器端加载实际 GLB 网格，可旋转、缩放与点选建筑。

## 场景文件

| 资产 | 可编辑源文件 | 内容 |
| --- | --- | --- |
| `public/assets/campus.glb` | `daxia_campus.blend` | 8 栋建筑、中心喷泉与轨道雕塑、秋树、校园学者、长椅、咖啡桌、公告栏、自行车 |
| `public/assets/laboratory.glb` | `daxia_laboratory.blend` | 四组实验台、显微镜、仪器、试剂、白板图示与研究者 |
| `public/assets/conference.glb` | `daxia_conference.blend` | 40 座报告厅、讲台、报告屏、专家席与参会代表 |
| `public/assets/classroom.glb` | `daxia_classroom.blend` | 24 席课堂、教学黑板、教师与助教、教学办公室、课程公告栏 |

每个场景同时包含 `*-preview.png`，为 Blender Cycles 48 samples 实际渲染的 1400 × 1050 预览。GLB 的版权元数据、Blender Scene 自定义属性 `creator` 及底座刻字均包含作者署名。

## 再生成

推荐 Blender 4.5 LTS。构建环境使用官方 Blender 4.5.14 Apple Silicon 便携程序，未全局安装。

```sh
blender --background --python game/blender/build_scenes.py -- --scene all
blender --background --python game/blender/build_scenes.py -- --scene campus
blender --background --python game/blender/build_scenes.py -- --scene classroom --no-render
```

执行后直接覆盖上述 `.blend`、`.glb`、预览与 `campus.json`。相机、材质、照明都存于 `.blend`；GLB 不导出灯光与相机，由游戏的 Three.js 场景统一照明。

## 坐标与建筑点选

Blender 使用 Z-up，GLB/Three.js 使用 Y-up：`(x, y, z) → (x, z, -y)`。地块为 35.4 × 28.5 单位；校园推荐 Three.js 正交相机位置为 `[32, 33, 39]`，观察原点。`campus.json` 提供建筑中心与 HTML 标签锚点。

可交互建筑网格命名为：

- `building_academy`：教学楼 · 院系
- `building_lab`：格物实验楼
- `building_foundation`：大夏自然基金委
- `building_library`：知微图书馆
- `building_conference`：群贤会议中心
- `building_dorm`：青年学者公寓
- `building_cafe`：未名咖啡
- `building_admin`：校务行政楼（科研处、教务处、人事处、财务处）

各网格 `extras.interaction_id` 是对应的英文 ID。glTF 会按材质将网格拆成子 Mesh，射线点选时向父级查找上述 `building_*` 名称。所有建筑的局部原点均为世界原点；游戏高亮与标签使用 `campus.json` 内的 `center` / `labelAnchor`。

## 检查

```sh
python3 game/blender/validate_assets.py
```

该检查独立读取 GLB 二进制头、JSON 与浮点坐标，验证 4 个资产的完整性、有限顶点、索引边界、材质关联、作者署名及 8 个校园建筑交互节点。
