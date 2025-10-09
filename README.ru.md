# Плагин диаграмм для VitePress

[English](README.md) | [Español](README.es.md) | [中文](README.zh.md) | [Українська](README.uk.md) | [Русский](README.ru.md)

Плагин VitePress, добавляющий поддержку различных типов диаграмм с использованием сервиса Kroki. Плагин автоматически преобразует блоки кода диаграмм в SVG-изображения, кэширует их локально как файлы и обеспечивает семантическое, стилизуемое отображение с опциональными подписями (captions).

Использование внешнего сервиса требует подключения к Интернету во время сборки, но предоставляет значительные преимущества по сравнению с созданием изображения на клиенте (огромный бандл и падение производительности) и созданием изображения на сервере (сложность - mermaid требует puppeteer для этого, например).

Диаграммы генерируются в __DEV время__ по следующим причинам:

1. Процесс генерации является асинхронным.
2. Он не является 100% надежным (например, сервис kroki.io может быть недоступен).
3. Пользователь должен проверить вывод.

> CLI `vitepress-plugin-diagrams`, поставляемый в комплекте с этим пакетом, можно использовать в CI для проверки отсутствующих или устаревших диаграмм. Также доступен хук [pre-commit](https://pre-commit.com) (см. раздел [pre-commit](#pre-commit)).

## Возможности

- Поддержка множества типов диаграмм (Mermaid, PlantUML, GraphViz и другие)
- Автоматическая генерация SVG с кэшированием (после генерации кэшируется локально до изменения кода диаграммы)
- Подписи к диаграммам
- Настраиваемые пути
- Чистый, семантический HTML-вывод
- Возможность использования любого редактора для создания диаграмм (например, `VS Code` с расширением `Mermaid`)

![Diagram](./diag-1.svg)

## Установка

```bash
pnpm add -D vitepress-plugin-diagrams
```

<details>
<summary>yarn</summary>

```bash
yarn add -D vitepress-plugin-diagrams
```
</details>

<details>
<summary>npm</summary>

```bash
npm install --save-dev vitepress-plugin-diagrams
```
</details>

## Начало работы

1. Добавьте в конфигурацию VitePress (`.vitepress/config.ts`):

```ts
import { defineConfig } from "vitepress";
import { configureDiagramsPlugin } from "vitepress-plugin-diagrams";

export default defineConfig({
  markdown: {
    config: (md) => {
      configureDiagramsPlugin(md, {
        diagramsDir: "docs/public/diagrams", // Опционально: директория для сохранения SVG файлов
        publicPath: "/diagrams", // Опционально: путь для изображений в HTML
        krokiServerUrl: "https://kroki.io", // Опционально: URL сервера Kroki
        excludedDiagramTypes: ["mermaid"], // Опционально: исключить определённые типы диаграмм
      });
    },
  },
});
```

2. Создавайте диаграммы в markdown:

````
```mermaid
graph TD
    A[Начало] --> B{Решение}
    B -->|Да| C[Принять]
    B -->|Нет| D[Отменить]
```
<!-- diagram id="1" caption: "Диаграмма потока системы" -->
````

## Метаданные диаграмм

Указание метаданных диаграмм предоставляет дополнительный контекст и идентификацию. Вы можете добавлять метаданные к своим диаграммам, используя специальные HTML-комментарии.

```html
<!-- diagram id="1" caption: "Диаграмма потока системы" -->
```

- Уникальный ID каждой диаграммы предотвращает заполнение кэша старыми файлами (опционально, можно опустить, если вы не изменяете и не пересоздаете диаграммы)
- Добавление пояснительных описаний под диаграммой (опционально) 

Примечание об идентификаторах:

- Если вы опустите `id`, плагин автоматически вычислит стабильный идентификатор на основе позиции (`positionId`) из имени markdown-файла и индекса блока кода. Это сохраняет стабильные имена файлов между пересборками, если диаграмма не перемещается внутри файла.
- Если нельзя использовать ни `id`, ни позицию, имя файла будет иметь форму только с хэшем содержимого.

## Поддерживаемые диаграммы

Mermaid, PlantUML, GraphViz, BlockDiag, BPMN, Bytefield, SeqDiag, ActDiag, NwDiag, PacketDiag, RackDiag, C4 (с PlantUML), D2, DBML, Ditaa, Erd, Excalidraw, Nomnoml, Pikchr, Structurizr, Svgbob, Symbolator, TikZ, UMlet, Vega, Vega-Lite, WaveDrom, WireViz

[Посмотреть полный список поддерживаемых диаграмм →](https://kroki.io/#support)

## Конфигурация

| `diagramsDir` | `string` | `"docs/public/diagrams"` | Директория для хранения SVG файлов |
| `publicPath` | `string` | `"/diagrams"` | Публичный путь для доступа к файлам |
| `krokiServerUrl` | `string` | `"https://kroki.io"` | URL сервера Kroki для генерации диаграмм |
| `excludedDiagramTypes` | `DiagramType[]` | `[]` | Типы диаграмм для исключения; такие блоки рендерятся как обычный код |

## Структура вывода

```html
<figure class="vpd-diagram vpd-diagram--[diagramType]">
  <img 
    src="[publicPath]/[diagramType]-[identifier]-[hash].svg" 
    alt="[diagramType] Diagram" 
    class="vpd-diagram-image"
  />
  <figcaption class="vpd-diagram-caption">
    [caption]
  </figcaption>
</figure>
```

Вы можете настроить классы `CSS` в соответствии с вашей темой.

### Шаблон имени файла и поведение кэша

- Формат имени файла зависит от доступных идентификаторов:
  - С явным `id`: `[diagramType]-[id]-[hash].svg`
  - С идентификатором, основанным на позиции: `[diagramType]-[positionId]-[hash].svg`
  - Без идентификатора: `[diagramType]-[hash].svg`
- Старые файлы автоматически очищаются при регенерации:
  - Для `id` удаляются предыдущие файлы с тем же `diagramType` и `id`.
  - Для `positionId` удаляются предыдущие файлы с тем же `diagramType` и `positionId`.
  - Без идентификаторов старые файлы вида `[diagramType]-[otherHash].svg` удаляются при изменении содержимого.

## Pre-commit

Добавьте это в ваш `.pre-commit-config.yaml`:

```yaml
- repo: https://github.com/vuesence/vitepress-plugin-diagrams
  rev: "main"
  hooks:
    - id: check-missing-diagrams
    - id: clean-diagrams
```

## Замечание

При обновлении диаграммы вы можете увидеть placeholder изображение. Это нормально, потому что svg файл загружается асинхронно и может не отобразиться сразу. Просто перегрузите страницу.

## Лицензия

MIT

## Содействие

Мы приветствуем вклад в развитие проекта. Перед отправкой Pull Request, пожалуйста, создайте issue для обсуждения предлагаемых изменений.

## Благодарности

Этот плагин использует сервис [Kroki](https://kroki.io/) для генерации диаграмм.
