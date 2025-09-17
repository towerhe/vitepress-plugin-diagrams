# Плагин диаграмм для VitePress

[English](README.md) | [Español](README.es.md) | [中文](README.zh.md) | [Українська](README.uk.md) | [Русский](README.ru.md)

Плагин VitePress, добавляющий поддержку различных типов диаграмм с использованием сервиса Kroki. Плагин автоматически преобразует блоки кода диаграмм в SVG-изображения, кэширует их локально как файлы и обеспечивает семантическое, стилизуемое отображение с опциональными подписями (captions).

Использование внешнего сервиса требует подключения к Интернету во время сборки, но предоставляет значительные преимущества по сравнению с созданием изображения на клиенте (огромный бандл и падение производительности) и созданием изображения на сервере (сложность - mermaid требует puppeteer для этого, например).

Диаграммы генерируются в __DEV время__ по следующим причинам:

1. Процесс генерации является асинхронным.
2. Он не является 100% надежным (например, сервис kroki.io может быть недоступен).
3. Пользователь должен проверить вывод.

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

## Поддерживаемые диаграммы

Mermaid, PlantUML, GraphViz, BlockDiag, BPMN, Bytefield, SeqDiag, ActDiag, NwDiag, PacketDiag, RackDiag, C4 (с PlantUML), D2, DBML, Ditaa, Erd, Excalidraw, Nomnoml, Pikchr, Structurizr, Svgbob, Symbolator, TikZ, UMlet, Vega, Vega-Lite, WaveDrom, WireViz

[Посмотреть полный список поддерживаемых диаграмм →](https://kroki.io/#support)

## Конфигурация

| Опция | Тип | По умолчанию | Описание |
|--------|------|---------|-------------|
| `diagramsDir` | `string` | `"docs/public/diagrams"` | Директория для хранения SVG файлов |
| `publicPath` | `string` | `"/diagrams"` | Публичный путь для доступа к файлам |
| `krokiServerUrl` | `string` | `"https://kroki.io"` | URL сервера Kroki для генерации диаграмм |

## Структура вывода

```html
<figure class="vpd-diagram vpd-diagram--[diagramType]">
  <img 
    src="[publicPath]/[diagramType]-[hash].svg" 
    alt="[diagramType] Diagram" 
    class="vpd-diagram-image"
  />
  <figcaption class="vpd-diagram-caption">
    [caption]
  </figcaption>
</figure>
```

Вы можете настроить классы `CSS` в соответствии с вашей темой.

## Замечание

При обновлении диаграммы вы можете увидеть placeholder изображение. Это нормально, потому что svg файл загружается асинхронно и может не отобразиться сразу. Просто перегрузите страницу.

## Лицензия

MIT

## Содействие

Мы приветствуем вклад в развитие проекта. Перед отправкой Pull Request, пожалуйста, создайте issue для обсуждения предлагаемых изменений.

## Благодарности

Этот плагин использует сервис [Kroki](https://kroki.io/) для генерации диаграмм. 