# Use Evidence Check

Evidence Check compares a file you received with the SHA-256 fingerprint recorded for that file. A fingerprint is a 64-character value calculated from the file’s bytes. A successful check helps you establish that your copy agrees with the reference used for the case.

This guide covers Evidence Check 0.1.0, the software currently released in the public project. The full Investigation and Operations application remains in private review.

## Start in your browser

Open the hosted tool. It needs a file and a fingerprint from a trusted case record or source manifest. File contents are read locally in the browser. You can try the exercise below without a real case. [Open Evidence Check](https://flaritycat.github.io/Arctic-Console-Open-Source-Project/)

To keep an offline copy, download `arctic-evidence-check-0.1.0.zip` from the release page. On Windows, right-click the ZIP, choose **Extract All**, then open `evidence-check.html` in the extracted folder. Keep the license and sample with it. Opening this saved HTML file requires a current browser with JavaScript enabled. [Download the offline release](https://github.com/flaritycat/Arctic-Console-Open-Source-Project/releases/tag/evidence-check-v0.1.0)

## Complete your first check

1. Expand **Try a sample file** below the form.
2. Choose **Save the synthetic observation**. Your browser downloads `sample-observation.txt`.
3. Under **1. Choose the evidence file**, select that downloaded file.
4. Copy the fingerprint shown in the sample section into **2. Paste the recorded SHA-256**. The example fingerprint is reproduced below.
5. Choose **Check file**. You should see **Fingerprints match**.
6. Choose **Save this check**. Your browser downloads `arctic-evidence-check.json` to its usual download location.

```text
6e6a178eaf3ff47416d5efffb5d8ac836f22d477d9b889b79fb920ca19a94857
```

The sample is a fictional training record. Its numbers carry no Arctic measurement meaning.

To see a mismatch, open a copy of the sample in a text editor, change one character and save it under a new name. Choose the changed file, keep the example fingerprint and select **Check file** again. You should see **Fingerprints differ**. Changing a file’s encoding or line endings also changes its bytes and can cause a mismatch.

## Check evidence for a real case

First identify the expected file edition and obtain its recorded fingerprint from the case record or provider manifest. Keep a reference to where that fingerprint came from.

Choose the original evidence download, paste its recorded fingerprint and select **Check file**. The tool accepts upper- or lowercase hexadecimal letters and trims spaces at the beginning and end. The file limit is 64 MiB, or 67,108,864 bytes.

| Result | Meaning | Next action |
| --- | --- | --- |
| **Fingerprints match** | The calculated fingerprint agrees with the reference you supplied. | Save the check with the case’s source reference and file edition. Continue reviewing the evidence’s date, coverage and interpretation. |
| **Fingerprints differ** | Your copy has a different fingerprint. | Confirm the expected edition and obtain the intended file from the sender or source. Record the discrepancy if it affects the assessment. |
| Result disappears after an input changes | The previous result belongs to the earlier inputs. | Select **Check file** again for the new file or fingerprint. |

A match depends on the reference being trustworthy. Establish that reference’s provenance separately. Editing the recorded fingerprint just to make a file pass would remove the basis for the check.

## Keep a useful assessment record

**Save this check** produces a JSON file, a text format that software can read. You can also open it in a text editor. It contains the tool version, the check time in UTC, file name and size, both fingerprints, and a result of `match` or `mismatch`.

The check time comes from the computer running the browser. The record contains the file’s name and fingerprints rather than its contents. Choose a suitable place to store it with the case.

Use a clear case-specific name when keeping several downloads, such as `case-042-evidence-check.json`. Preserve the downloaded values. Adapt the following wording to the evidence.

> I checked [file edition] against the SHA-256 recorded in [case or source reference]. The fingerprints matched. The observation covers [date and area]. Its relevant limitation is [limitation].

Fill in those details from your actual evidence. Pass the original evidence file, trusted reference and saved check to the receiving analyst. That analyst can repeat the check with their own copy. A saved JSON record can be edited, so repeating the calculation gives the receiver their own result.

The page holds the current result while it remains open. Save the record before closing or reloading the page.

## Resolve a problem

| What you see | What to do |
| --- | --- |
| **Check the recorded fingerprint** | Paste all 64 hexadecimal characters. Remove labels, quotation marks and any spaces within the fingerprint. |
| **File exceeds 64 MiB** | Use a local SHA-256 utility for the larger file. A Windows example appears below. |
| **Secure hashing is unavailable** | Open the saved HTML file in a current browser or use the hosted HTTPS page. |
| **The file could not be read** | Download or copy the file to a local folder, choose it again and retry. |
| **Save this check** is missing | Complete a valid check. The button disappears when an input changes. |
| Download seems missing | Check the browser’s Downloads list and download permissions. |

For a larger file on Windows, open PowerShell and replace the example path with your file’s actual path. Compare the resulting `Hash` with the full recorded fingerprint.

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath 'C:\Evidence\observation.nc'
```

For a reproducible software problem, record the browser version, tool version, steps and visible message. Use a synthetic sample in a public issue. [Report a problem](../CONTRIBUTING.md) · [Repository guide](repository-guide.md)
