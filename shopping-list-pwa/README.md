# 夫婦の買い物リスト PWA

iPhone の Safari で使うことを想定した、ホーム画面追加対応の買い物リストアプリです。

## システム構成

初期版は、初心者でも動かしやすい静的 Web アプリ構成です。

```text
iPhone Safari
  ↓
HTML / CSS / JavaScript
  ↓
localStorage に保存
```

この構成にした理由:

- サーバーやデータベースなしで、まず動くアプリを作れる
- iPhone Safari で開ける
- `manifest.webmanifest` と `service-worker.js` により、ホーム画面追加やオフライン表示に対応しやすい
- 将来、保存処理だけを Supabase / Firebase / 自作API に置き換えれば、妻とのリアルタイム共有へ拡張できる

将来の共有版の構成案:

```text
夫のiPhone / 妻のiPhone
  ↓
同じWebアプリ
  ↓
同期API
  ↓
クラウドDB
```

候補:

- Supabase: PostgreSQL ベース。リアルタイム同期が作りやすい
- Firebase: スマホ向け実績が多く、リアルタイムDBが得意
- 自作API: 家族専用に細かく制御しやすい

## 機能

- 購入予定の商品を登録
- 商品名を編集
- チェックボックスで購入済みに変更
- チェックしただけでは削除しない
- 削除ボタンを押した時だけ削除
- 購入予定と購入済みを別表示
- アプリを閉じても端末内に保存
- ホーム画面追加向けの PWA 設定

## ファイル構成

```text
shopping-list-pwa/
  index.html
  styles.css
  app.js
  manifest.webmanifest
  service-worker.js
  icons/
    icon-192.png
    icon-512.png
```

## Windows PC で試す手順

方法A: `run-local.bat` を使う

1. `run-local.bat` をダブルクリックします。
2. 表示された黒い画面は閉じずに、そのままにします。
3. PC のブラウザで開きます。

```text
http://localhost:8080/
```

方法B: PowerShell で起動する

1. このフォルダを開きます。
2. Python 3 が入っている場合、PowerShell で次を実行します。

```powershell
python -m http.server 8080
```

3. PC のブラウザで開きます。

```text
http://localhost:8080/
```

Python がない場合は、VS Code の Live Server 拡張機能などで開いても動きます。

## iPhone Safari で試す手順

一番簡単なのは、GitHub Pages / Netlify / Vercel などにこのフォルダを公開する方法です。

公開後:

1. iPhone の Safari で公開URLを開く
2. 共有ボタンを押す
3. 「ホーム画面に追加」を選ぶ
4. ホーム画面のアイコンから起動する

注意:

- ホーム画面追加や Service Worker は、通常 HTTPS のURLで使うのが前提です。
- `file://` で直接開くと、一部の PWA 機能が動かないことがあります。
- 初期版のデータは端末ごとに保存されます。夫婦共有には、次の段階でクラウド同期を追加します。

## 共有対応への次の開発ステップ

1. 保存先を `localStorage` からクラウドDBへ変更
2. 夫婦共通のリストIDを持たせる
3. 変更通知を購読してリアルタイム更新
4. 必要ならログインまたは共有用パスコードを追加
