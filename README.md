## Github pagesにデプロイする手順
1. gh-pages パッケージをインストール
```
npm install --save gh-pages
```

2. package.json に以下を追加
"homepage" フィールドを追加（GitHubのリポジトリURLに合わせて）

scripts に以下を追加：

```
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

```

以降はコードを更新の度に実行する。
```
git add .
git commit -m "some comment"
git push origin main
```

```
npm run build
npm run deploy
```
これで https://ユーザー名.github.io/リポジトリ名 に公開されます。


