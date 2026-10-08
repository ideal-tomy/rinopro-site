# PowerShellウィンドウの連続表示への対応

## 確認できた原因

現在の会話から同じ診断スクリプトを実行し、Win32 APIの `GetConsoleWindow` と `IsWindowVisible` で確認した。

| 実行方法 | 親プロセス | コンソールの可視性 |
|---|---|---|
| `exec_command(tty=false, login=false)` | daemon PID 6156 | **true（表示あり）** |
| `exec_command(tty=true, login=false)` | 同じdaemon PID 6156 | **false（非表示）** |
| 対応後 `tty=true`、設定読込チェックと診断 | 同じdaemon PID 6156 | **false（非表示）** |

通常のパイプ実行で新しい可視コンソールが生成されている。daemonを使っていてもPTY実行では非表示となった。この環境で確認できた直接の回避策は `tty=true` の指定。

調査時、現在の会話の実行元は `.codex/packages/app-server-daemon/releases/0.157.1-.../bin/codex.exe app-server --managed-daemon` だった。PATH先頭のユーザーnpm版CLIは0.160.0、nvm側CLIは0.157.1。別CLIの起動オプションが既存のアプリ会話へ適用されたとは確認できない。ユーザーが報告した別の `--no-daemon` セッションそのものは未再現であり、報告を否定するものではない。

## 実施した変更

`C:/Users/ryoji/.codex/config.toml` の既存 `developer_instructions` に、Windowsでは次を守る指示を追加した。

- 通常の `exec_command` は `tty=true` を明示。
- PowerShellは `login=false`。
- 補助プロセスを `Start-Process` で起動する場合は `-WindowStyle Hidden`。
- PTY非対応の操作で、無断で可視コンソールを作るパイプ実行へ戻らない。
- 既存の承認方針、作業範囲は変更しない。

`unified_exec` と `unified_exec_tty` は両バージョンとも既にtrueだったため変更していない。必要だったのはツール呼び出し時の `tty=true`。公式資料でも `features.unified_exec` はPTYを使う実行ツールとして説明されているが、今回のウィンドウ表示差はローカルの実測結果に基づく。

参考：[公式の設定リファレンス](https://learn.chatgpt.com/docs/config-file/config-reference)

バックアップ：`C:/Users/ryoji/.codex/backups/console-workaround-20261008-223407/config.toml`。

設定はCLIで読み込めることを確認。既存設定の全文を保持し、指示文の追加だけであることを適用スクリプトで検証している。ソフトウェアの更新・インストール、Windows Terminalのレジストリ変更、daemon停止は実施していない。サイトのコードも変更していない。

## 適用と限界

この会話では既にPTY実行へ切り替えた。次の会話は設定を再読み込みする新規セッションで開始する。設定を読み込まないクライアントや起動時の上書きがある場合は適用されない。

これはCodex本体の不具合修正ではなく、再現した可視ウィンドウ生成経路を避ける運用指示。モデルが `tty=true` を指定することに依存し、エンジンの既定値を強制変更する設定ではない。外部ツール独自のウィンドウ生成も一律には防止しない。画面上で連続表示が止まったというユーザー確認はまだ得ていない。

証拠：[console-verification.json](console-verification.json)。再診断：[inspect-console.ps1](inspect-console.ps1)。適用処理：[apply-console-workaround.ps1](apply-console-workaround.ps1)（適用済み、重複適用はしない）。
