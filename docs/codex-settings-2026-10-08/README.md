# Codexの承認設定

2026-10-08、`docs/設定.md` の依頼に基づきユーザー共通設定へ反映した。サイトのコードは今回変更していない。

## 反映先

- `C:\Users\ryoji\.codex\config.toml`
- `C:\Users\ryoji\.codex\rules\default.rules`

設定値：

```toml
approval_policy = "on-request"
sandbox_mode = "danger-full-access"
approvals_reviewer = "user"
```

通常の調査・編集・ビルド・テスト・プレビューは依頼範囲内で進め、インストール・依存関係変更・履歴変更・強制push・復元困難な削除は実行前に確認する指示も追加した。これはモデルへの行動指示であり、全操作を機械的に阻止する境界ではない。

既存プラグイン、MCP、通知、Windows、プロジェクト設定を保持。変更後のファイルが元ファイルの全内容を末尾に保持することも検証した。バックアップ：

`C:\Users\ryoji\.codex\backups\approval-settings-20261008-215502\config.toml`

## ルールと確認結果

手元のCLIは0.157.1。インストール等の具体例15件をprompt、ビルド・テスト・通常Git操作8件を追加promptなしと判定することを確認した。対象コマンドを実行せず、`codex execpolicy check` による判定のみ。結果は [verification.json](verification.json)。

- [追加設定の内容](config-fragment.toml)
- [追加ルールの内容](default.rules)
- [判定確認スクリプト](verify-settings.ps1)
- [適用スクリプト](apply-settings.ps1)（既に適用済み。重複適用は停止する）

## 有効化と限界

作業を保存し、Codexを再起動して新しい会話を開始する。Cursorの拡張で使う場合はCursorも再起動する。権限の選択肢にCustom／config.tomlがある場合はその設定を使う。アプリや組織の権限プロファイル・起動時指定が上書きする場合、ファイルの値だけでは希望どおりにならない。この進行中の会話のサンドボックスが設定変更だけで切り替わったとは確認していない。

`danger-full-access` はプロジェクト外のファイルやネットワークも許可する指定。prefix_ruleは具体的な接頭辞に一致する仕組みで、オプションの順番、任意remote名、絶対パス、PowerShellや別言語スクリプトなど全ての書き方を網羅しない。ルールは完全なセキュリティ境界ではなく、承認が必要な操作を漏れなく検出する保証はない。実際の新規会話での承認画面の挙動は再起動後に確認が必要。

今回の設定は自動push・公開の依頼ではない。既存タスクのpush・本番反映禁止は維持する。

公式資料：[ルール](https://learn.chatgpt.com/docs/agent-configuration/rules)、[設定リファレンス](https://learn.chatgpt.com/docs/config-file/config-reference)、[サンドボックス](https://learn.chatgpt.com/docs/sandboxing)。

元の`docs/設定.md`にはルールの改行欠落と未完の`prefix_rule(`があったため、そのままコピーせず有効な形式に修正して実装した。
