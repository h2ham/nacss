## 利用アーキテクチャ・バージョン

| アーキテクチャ | バージョン  |
|---|---|
| node.js | v4.4.5 |

## ディレクトリ説明

| ディレクトリ | 内容  |
|---|---|
| _html_resouce | 開発用コード：基本ここに書く |
| _html_resouce/_layouts | HTMLの共通部分パーツ：MTの共通部用などに利用 |
| _html_resouce/common/css | scss格納ディレクトリ |
| gulp | gulp用の設定ファイル |
| html | 出力コード：触るな危険 |

## コーディングガイドライン

* .editorconfig の指定に従うこと

## 環境構築

git でプロジェクトダウンロード後、下記コマンドでnodeパッケージインストール

```
$ npm install
```

### 静的HTML構築環境サーバー起動

```
$ npm start
```

### ビルドのみ

```
$ npm run build
```
