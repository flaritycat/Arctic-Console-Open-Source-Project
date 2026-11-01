# Try the Northern Bay practice

[Open the practice in your browser](https://flaritycat.github.io/Arctic-Console-Open-Source-Project/practice.html). It requires no installation or account. In the offline release, open `practice.html`.

The case, location and readings are fictional. You are learning how to leave a useful assessment, not making a real Arctic operational decision.

## As the first analyst

1. Select **Open the alert**. Your task is to decide what a rise in two sample averages supports.
2. Open the observation table and sampling note. Mark each reviewed after reading it.
3. Select **Write an assessment**. Choose a next action, describe the supported finding, explain a limitation and give a concrete next check.
4. Select **Review the handover**. Correct anything that a reader might misunderstand.
5. Select **Download handover**. Keep the JSON file and give it to your reader through a channel you choose.

The tool does not send a message or transfer responsibility. The handover screen says this explicitly. **Try the reader role in a new tab** lets you rehearse the other side yourself.

## Keep and resume your draft

Use **Download draft** before closing the page. This creates a JSON file even if your assessment is incomplete. Open the practice again, expand **Resume a draft** on the Alert step and choose that file. Replacing existing work requires confirmation.

There is no automatic saving or persistent browser storage. Browser navigation warnings are a reminder, not a backup. A prepared download is not a guarantee that your browser saved it; check your Downloads folder. An import error preserves your existing work.

## As the reader

Select **Review a handover**, then choose the sender's JSON file. Read the saved assessment and open both sources yourself. The tool checks the record's structure, checksum and references against this case edition. It does not authenticate the author or grade the judgment.

After reviewing, tick the confirmation and select **Finish reader practice**. Completion is local to this device; it does not acknowledge a real assignment or notify the sender.

## If something goes wrong

| Message or situation | Next action |
| --- | --- |
| Sources not reviewed | Open both sources and mark each reviewed before continuing. |
| Incomplete assessment | Complete the marked fields. Your other text remains present. |
| Draft opened in the reader | Use **Resume a draft** on the Alert step instead. |
| Handover opened as a draft | Use **Review a handover** instead. |
| Unsupported practice edition | Open the version that produced the file. This release supports practice record schema 1, tool 0.2.0 and Northern Bay edition 1. |
| Checksum or source mismatch | Obtain the intended file. Do not treat a recalculated checksum as proof of authenticity. |
| File exceeds 64 KiB / invalid JSON | Choose the original small JSON download from this practice. |
| Work changed during import | Choose the file again only if you still want to replace your current work. |
| No download appears | Check the browser's download permissions and Downloads list. |

These files may contain whatever you type. Keep personal or real case information out of the training exercise. [Data handling](../PRIVACY.md) · [Case specification and facilitator criteria](practice-case.md)
