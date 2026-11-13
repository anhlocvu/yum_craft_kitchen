# Web Accessibility Audit

An audit of web content, run on 2026-11-13. Read the executive summary for the verdict, the priorities section for what to do first, and the findings tables for detail.

## Metadata

What was audited, with what, and under which settings.

| Field | Value |
|---|---|
| Date | 2026-11-13 |
| Scope | 2 items |
| Skills run | aria-specialist, keyboard-navigator, live-region-controller, text-quality-reviewer |
| Tooling | node v25.7.0 |
| Scan configuration | defaults, no config file found |
| Checks counted | 59 |

Audited:

- `index.html`
- `js/main-menu.js`

## Executive summary

Fail. Critical or serious findings must be fixed before this ships.

The headline numbers for this run.

| Measure | Value |
|---|---|
| Score | 69 out of 100 |
| Grade | D |
| Findings | 35 |
| Blocking (critical plus serious) | 11 |
| Verdict | Fail |

## Severity breakdown

Counts by severity, highest impact first.

| Severity | Count | What it means |
|---|---:|---|
| critical | 0 | Blocks a person from completing the task |
| serious | 11 | Major barrier with a difficult workaround |
| moderate | 13 | Real friction, workaround exists |
| minor | 11 | Noticeable but rarely blocking |

## Findings

35 findings, ordered by severity then by rule.

### Serious (11)

Each row names the rule, the criterion it fails, where it is, and what to change.

| Rule | WCAG | Location | Problem | Fix |
|---|---|---|---|---|
| `ARIA-NAME-TRUNCATION` | 1.3.1 A | index.html:6805-6807 | Mixing Table truncates multi-ingredient dish names with (+N) when mixing 4 or more ingredients, causing assistive technologies to lose critical ingredient information. | Generate defaultMixedName with the full list of ingredients (names.join(" & ")) without (+N) truncation, matching Station 10 beverage_station to ensure complete sensory information reaches NVDA users. |
| `ARIA-ROLE-MISMATCH` | 1.3.1 A | index.html:8820 | Empty state placeholder message is given role="listitem", causing screen readers to falsely announce that the list contains 1 item when it is empty. | Remove role="listitem" from the empty state placeholder so screen readers accurately announce an empty list (0 items). |
| `FOCUS-001` | 2.4.3 A | index.html:9863 | Pressing Escape in #modal-settings closes the dialog without returning focus to #btn-menu-settings. | Register modalSettings with bindDialogFocusRestore(modalSettings) in index.html, and set modalSettings._returnFocusEl = btnMenuSettings in js/main-menu.js when opened. |
| `LIVE-REGION-SILENT-DROPPED-INGREDIENTS-BLENDER` | 4.1.3 AA | index.html:6455 | Blender station announcement silences ingredients beyond the first 3 when blending 4 or more ingredients, leaving screen reader users unaware of all blended ingredients. | Include all constituent ingredients in the announcement: const allBlended = names.join(', '); announceNVDA(`Máy xay đã xay nhuyễn ${names.length} nguyên liệu (${allBlended}) thành món "${blendedItem.name}" sánh mịn ${coldBlendedPhrase}!`, 'polite'); |
| `LIVE-REGION-TRUNCATION-MIXING-TABLE` | 4.1.3 AA | index.html:6805 | Mixing table announcement truncates ingredient lists to 3 items with (+N) suffix, preventing screen reader users from hearing all 4-5+ constituent ingredients of the mixture. | Format the live region announcement to include the full list of constituent ingredients: const allNames = names.join(', '); announceNVDA(`Đã ${actionVerb} ${names.length} nguyên liệu (${allNames}) thành "${mixedItem.name}".${nextHint}`, 'polite'); |
| `TQR-003` | 4.1.2 A | index.html:6805 | Combining 4 or more ingredients replaces remaining items with generic placeholder '(+N)' without disclosing them in name or description. | Include the full list of ingredients in describeItemStateShort or provide an accessible title / aria-description containing all combined ingredients. |
| `TQR-009` | 2.5.3 A | index.html:8639 | Station selector button aria-label '${st.name}. ${st.desc}' does not contain visible text '${st.shortName}' (e.g. '18. Bàn Trộn'). | Prepend the visible shortName to the aria-label, e.g. `${st.shortName} - ${st.name}. ${st.desc}`, so voice navigation can target the visible numbered button names. |
| `TQR-009` | 2.5.3 A | index.html:8803 | Cooking busy button aria-label 'Đang xử lý: ${act.label}' does not contain the visible text '⏳ Đang chế biến...'. | Synchronize the accessible name with the visible text, for example by setting aria-label to `Đang chế biến: ${act.label}`. |
| `TQR-009` | 2.5.3 A | index.html:8839 | Button accessible name 'Bỏ ${it.name}' does not contain the visible text 'Xóa'. | Change the aria-label to 'Xóa ${it.name} khỏi bếp' so the accessible name starts with the visible button text 'Xóa'. |
| `TQR-009` | 2.5.3 A | index.html:9101 | Dish delete button accessible name 'Bỏ món ${dish.name} khỏi dĩa' does not contain visible text 'Xóa'. | Change the aria-label to 'Xóa món ${dish.name} khỏi dĩa' (and in line 9145 to 'Xóa món ${displayName} khỏi dĩa') so the accessible name begins with the visible label 'Xóa'. |
| `TQR-010` | 4.1.2 A | index.html:8831 | Multi-ingredient names and descriptions are clipped by CSS .truncate without title attribute or accessible disclosure in station and staging lists. | Add title attributes (e.g. title='${it.name}') and title='${desc}' to truncated elements, or allow wrapping / accessible tooltip disclosure so full item details are perceivable. |

### Moderate (13)

Each row names the rule, the criterion it fails, where it is, and what to change.

| Rule | WCAG | Location | Problem | Fix |
|---|---|---|---|---|
| `ARIA-LABEL-IN-NAME` | 2.5.3 A | index.html:8802-8805 | When cooking is busy, action buttons visibly display "⏳ Đang chế biến..." while aria-label is set to "Đang xử lý: ${act.label}", omitting the visible text. | Align the accessible name with the visible label text, for example aria-label="Đang chế biến: ${act.label}". |
| `ARIA-LABEL-IN-NAME` | 2.5.3 A | index.html:8836 | Staging transfer button with visible text "Ra khay" specifies aria-label="Cất ${it.name} ra Khay Tạm", failing to include the exact visible label phrase. | Update aria-label to include the visible text phrase, for example aria-label="Ra khay: Cất ${it.name} ra Khay Tạm". |
| `ARIA-LABEL-IN-NAME` | 2.5.3 A | index.html:8912 | Workbench transfer button with visible text "Vào bếp" sets aria-label="Đưa ${it.name} vào Bếp hiện tại", failing to include the exact visible text phrase. | Update aria-label to include the exact visible label text, for example aria-label="Vào bếp: Đưa ${it.name} vào Bếp hiện tại". |
| `ARIA-ROLE-MISMATCH` | 4.1.2 A | index.html:832 | Station selector grid uses role="toolbar" and aria-pressed for single-selection stations, misrepresenting mutually exclusive stations as independent toggle buttons. | Change container role to "radiogroup" with aria-labelledby="heading-station-picker" and child buttons to role="radio" with aria-checked. |
| `ARIA-SEMANTIC-HTML` | 1.3.1 A | index.html:909 | Station and staging item lists use generic <div> with role="list" and role="listitem" instead of semantic HTML <ul> and <li> elements. | Replace container <div> elements with semantic <ul> elements and row elements with native <li> elements, removing explicit role="list" and role="listitem". |
| `FOCUS-002` | 2.4.3 A | js/main-menu.js:1644 | Opening #modal-help from Main Menu does not set _returnFocusEl or focus close button, losing focus on close. | In js/main-menu.js, set modalHelp._returnFocusEl = btnMenuHelp and focus btn-close-help when modalHelp.showModal() is invoked. |
| `FOCUS-003` | 2.4.3 A | index.html:8628 | Roving tabindex callback invokes targetBtn.focus() on a detached DOM element after targetBtn.click() replaces station buttons. | Remove redundant targetBtn.focus() from onSelectItem callback in renderWorkbench since targetBtn.click() already queries and focuses the active station in the live DOM. |
| `LIVE-REGION-DUAL-BUFFER-RACE-CONDITION` | 4.1.3 AA | index.html:5246 | announceNVDA does not cancel pending setTimeout calls across dual buffers, causing simultaneous live region updates and speech collisions if called within 60ms. | Track active timer IDs and clearTimeout before toggling or clearing buffers, ensuring previous pending speech triggers are canceled before new text is inserted into the alternating region. |
| `LIVE-REGION-HIDDEN-WITH-DISPLAY-NONE` | 4.1.3 AA | index.html:237 | Authentication alert containers use Tailwind 'hidden' (display: none), removing them from the accessibility tree and risking failed announcements when text is inserted dynamically. | Remove 'hidden' from initial HTML and keep the live region in the DOM with empty textContent, or use visually hidden styling instead of display:none when inactive so screen readers register the live region before error dispatch. |
| `LIVE-REGION-INAPPROPRIATE-ASSERTIVE-POLITENESS` | 4.1.3 AA | index.html:8324 | Tasting review and routine kitchen validation notices use aria-live='assertive' (role='alert'), unnecessarily interrupting user navigation for non-emergency status updates. | Reserve priority='assertive' strictly for critical system errors. Switch routine dining reviews, empty kitchen notices, and validation guidance to priority='polite' so screen readers do not interrupt in-flight speech. |
| `TQR-009` | 2.5.3 A | index.html:8836 | Button accessible name 'Cất ${it.name} ra Khay Tạm' places the visible text 'Ra khay' after the variable ingredient name instead of at the start. | Set aria-label to 'Ra khay: Cất ${it.name} ra Khay Tạm' so speech-input users uttering 'Click Ra khay' can reliably activate the button. |
| `TQR-009` | 2.5.3 A | index.html:8912 | Button accessible name 'Đưa ${it.name} vào Bếp hiện tại' places the visible text 'Vào bếp' after the ingredient name instead of at the start. | Set aria-label to 'Vào bếp: Đưa ${it.name} vào Bếp hiện tại' so speech-input commands matching the visible label succeed. |
| `TQR-010` | 1.3.1 A | index.html:9099 | The dish ingredient summary list is hidden on viewports under 640px using class 'hidden sm:inline'. | Remove 'hidden sm:inline' or provide a responsive layout that wraps the ingredient list below the dish name on narrow viewports. |

### Minor (11)

Each row names the rule, the criterion it fails, where it is, and what to change.

| Rule | WCAG | Location | Problem | Fix |
|---|---|---|---|---|
| `A11Y-LABEL-001` | 1.3.1 A | index.html:8836 | Full multi-ingredient dish names inside aria-label for both Ra khay and Xóa buttons create excessive auditory verbosity for keyboard screen reader users. | Shorten button aria-label to a concise item identifier (e.g. Cất món 1 ra Khay Tạm) and expose full ingredient names via aria-describedby or an item details disclosure. |
| `A11Y-TEXT-001` | 1.3.1 A | index.html:8831 | Compound multi-ingredient names in #station-items-list are truncated with CSS ellipsis without a title attribute or focusable disclosure for sighted keyboard users. | Add title="${it.name}" or a keyboard-focusable inspect trigger to allow sighted keyboard users to view the complete list of ingredients in compound dishes. |
| `ARIA-BUSY-MISUSE` | 4.1.2 A | index.html:8781 | Attribute aria-busy is set on a static generic <div> container without aria-live or a widget role, rendering the busy state inert to assistive technologies. | Remove aria-busy from #station-action-buttons or add aria-live="polite" to the container if dynamic state observation is intended. |
| `ARIA-GROUP-LABEL` | 1.3.1 A | index.html:885 | Station action buttons container groups related culinary actions but lacks role="group" and an accessible name referencing the station actions heading. | Add role="group" and aria-labelledby="heading-station-actions" to #station-action-buttons. |
| `ARIA-ICON-HIDDEN` | 1.1.1 A | index.html:902 | Package emoji in #btn-station-to-staging is bare inline text without aria-hidden="true", causing screen readers to announce the unicode emoji name before the button label. | Wrap the emoji in <span aria-hidden="true">📦</span> matching other kitchen buttons. |
| `ARIA-VERBOSE-NAME` | 4.1.2 A | index.html:8808 | Station action buttons pack multi-sentence descriptions into aria-label, causing screen readers to read lengthy paragraphs as the button accessible name. | Keep aria-label concise (e.g. act.label) and associate the action description via aria-describedby or visible helper text. |
| `KEYBOARD-001` | 2.1.1 A | index.html:8628 | Station selector toolbar activates stations immediately on arrow key navigation rather than allowing arrow exploration with Space/Enter activation. | Separate arrow key focus movement from tool activation by removing targetBtn.click() from the arrow key handler and allowing Enter/Space to select, or change role to radiogroup. |
| `KEYBOARD-002` | 2.1.1 A | index.html:909 | Scrollable #station-items-list container lacks tabindex="0", preventing keyboard users from scrolling item contents with arrow keys or PageUp/PageDown. | Add tabindex="0" to #station-items-list so keyboard users can navigate and scroll the container independently. |
| `LIVE-REGION-PLATE-SUMMARY-HIDDEN-ON-MOBILE` | 1.3.1 A | index.html:9099 | Constituent ingredients summary of plated dishes is hidden with display:none (hidden sm:inline), preventing mobile screen reader users from hearing dish ingredients on the plate. | Replace class 'hidden sm:inline' with a visually hidden utility class (such as 'sr-only sm:not-sr-only') or expose the summary in aria-label so screen readers on mobile devices can announce the constituent ingredients. |
| `TQR-010` | 4.1.2 A | index.html:8717 | Wrapper and vessel radio buttons apply .truncate to ingredient names without a title attribute. | Add title='${it.name}' to the button or wrap span so multi-ingredient wrapper names (such as kneaded dough) can be read in full. |
| `TQR-010` | 4.1.2 A | index.html:9143 | Plate item fallback row uses CSS .truncate on ${displayName} without a title attribute. | Add title='${displayName}' to the span so truncated text is discoverable on hover and focus. |

## Remediation priorities

Fix these components first. Each one carries the same defect in several places, so one fix clears every instance.

| Component | Instances | Worst severity | Rules |
|---|---:|---|---|
| #station-items-list | 6 | serious | `ARIA-LABEL-IN-NAME`, `ARIA-ROLE-MISMATCH`, `ARIA-SEMANTIC-HTML`, `TQR-009`, `TQR-010` |
| #station-action-buttons | 5 | serious | `ARIA-BUSY-MISUSE`, `ARIA-GROUP-LABEL`, `ARIA-LABEL-IN-NAME`, `ARIA-VERBOSE-NAME`, `TQR-009` |
| #plate-items-list | 3 | serious | `TQR-009`, `TQR-010` |
| StationItemsList | 3 | minor | `A11Y-LABEL-001`, `A11Y-TEXT-001`, `KEYBOARD-002` |
| mixing_table | 2 | serious | `ARIA-NAME-TRUNCATION`, `TQR-003` |
| #station-selector-grid | 2 | serious | `ARIA-ROLE-MISMATCH`, `TQR-009` |
| #staging-items-list | 2 | moderate | `ARIA-LABEL-IN-NAME`, `TQR-009` |
| StationSelectorGrid | 2 | moderate | `FOCUS-003`, `KEYBOARD-001` |

Then the 11 remaining blocking findings, in this order:

1. `ARIA-NAME-TRUNCATION` at index.html:6805-6807. Generate defaultMixedName with the full list of ingredients (names.join(" & ")) without (+N) truncation, matching Station 10 beverage_station to ensure complete sensory information reaches NVDA users.
2. `ARIA-ROLE-MISMATCH` at index.html:8820. Remove role="listitem" from the empty state placeholder so screen readers accurately announce an empty list (0 items).
3. `FOCUS-001` at index.html:9863. Register modalSettings with bindDialogFocusRestore(modalSettings) in index.html, and set modalSettings._returnFocusEl = btnMenuSettings in js/main-menu.js when opened.
4. `LIVE-REGION-SILENT-DROPPED-INGREDIENTS-BLENDER` at index.html:6455. Include all constituent ingredients in the announcement: const allBlended = names.join(', '); announceNVDA(`Máy xay đã xay nhuyễn ${names.length} nguyên liệu (${allBlended}) thành món "${blendedItem.name}" sánh mịn ${coldBlendedPhrase}!`, 'polite');
5. `LIVE-REGION-TRUNCATION-MIXING-TABLE` at index.html:6805. Format the live region announcement to include the full list of constituent ingredients: const allNames = names.join(', '); announceNVDA(`Đã ${actionVerb} ${names.length} nguyên liệu (${allNames}) thành "${mixedItem.name}".${nextHint}`, 'polite');
6. `TQR-003` at index.html:6805. Include the full list of ingredients in describeItemStateShort or provide an accessible title / aria-description containing all combined ingredients.
7. `TQR-009` at index.html:8639. Prepend the visible shortName to the aria-label, e.g. `${st.shortName} - ${st.name}. ${st.desc}`, so voice navigation can target the visible numbered button names.
8. `TQR-009` at index.html:8803. Synchronize the accessible name with the visible text, for example by setting aria-label to `Đang chế biến: ${act.label}`.
9. `TQR-009` at index.html:8839. Change the aria-label to 'Xóa ${it.name} khỏi bếp' so the accessible name starts with the visible button text 'Xóa'.
10. `TQR-009` at index.html:9101. Change the aria-label to 'Xóa món ${dish.name} khỏi dĩa' (and in line 9145 to 'Xóa món ${displayName} khỏi dĩa') so the accessible name begins with the visible label 'Xóa'.
11. `TQR-010` at index.html:8831. Add title attributes (e.g. title='${it.name}') and title='${desc}' to truncated elements, or allow wrapping / accessible tooltip disclosure so full item details are perceivable.

The remaining 24 moderate and minor findings can follow in normal work.

## What passed

24 checks ran and found nothing.

- #panel-workbench has valid role="tabpanel", tabindex="0", and aria-labelledby="tab-workbench" linking to tab trigger.
- Asynchronous operations (baking, frying, mixing, feeding) announce processing state (isCookingBusy, isFeedingBusy) to provide immediate feedback
- Dual polite live regions (#nvda-live-polite-a, #nvda-live-polite-b) are present in the DOM on initial load before any user interaction
- Dynamic wrapper and vessel selector correctly uses role="radiogroup" with aria-labelledby pointing to visible title and role="radio" on options.
- Empty state list items in #station-items-list, #staging-items-list, and #plate-items-list provide meaningful explanatory Vietnamese text.
- Flavor bar progressbars provide sensory descriptive text alternatives via aria-valuetext.
- Focus is maintained in-place on #station-action-buttons across action executions without losing focus to document.body.
- Global :focus-visible provides high-visibility 3px outline on all interactive kitchen elements.
- Item deletion and transfer in #station-items-list preserve focus to adjacent buttons or fall back safely to #panel-workbench.
- Live region DOM text content is updated using textContent rather than innerHTML or node replacement
- Live regions are styled with .sr-only-live offscreen clipping rather than display: none or visibility: hidden
- NVDA live announcements for station switching and cooking completion are dispatched with polite politeness level.
- No placeholder or dummy text (TODO, FIXME, lorem ipsum) in accessible names.
- No positive tabindex values exist in index.html or js/main-menu.js.
- No unresolved template syntax ({0}, {{variable}}, ${expr}) in static HTML attributes.
- Roving tabindex keyboard navigation works across station buttons with Arrow keys, Home, and End.
- Single-key shortcuts (C, K, W) for Station 18 are properly guarded against modifier keys (Ctrl, Alt, Meta) and text entry inputs.
- Single-key shortcuts can be completely disabled via #setting-single-key-shortcuts meeting WCAG 2.1.4 Level A.
- Spice applications announce spice name, target location (station vs staging), and layered outer-wrapper seasoning accurately
- Staging tray transfers (moveStationToStaging, moveStagingToStation) announce exact item counts and names to live regions
- Station 18 (mixing_table) is fully reachable via keyboard in #station-selector-grid via Tab, Arrow keys, and End key.
- Station 18 action buttons (mix_toss, knead_dough, whisk_batter) are native HTML buttons in normal Tab order and operable via Space and Enter.
- Station action buttons maintain focus in-place and use aria-disabled instead of disabling elements during audio playback, preventing focus loss.
- Station selection and kitchen tab switching update live regions with station names and hotkey instructions

## Needs a human

Items a skill could not decide, or could not check automatically.

- **text-quality-reviewer**: Mixing Table (18. Bàn Trộn) actions correctly provide action verbs, sensory feedback, and distinct hotkeys (C, K, W).
- **text-quality-reviewer**: Audited strictly under text-quality-reviewer scope without modifying source code.
- **live-region-controller**: Project implements dual-buffer ARIA live regions (#nvda-live-polite-a / #nvda-live-polite-b and #nvda-live-assertive-a / #nvda-live-assertive-b) rather than a single #nvda-live-region container to guarantee NVDA re-announces identical consecutive messages.
- **live-region-controller**: When testing 4-5+ ingredients at the Mixing Table, visual brevity in mixedItem.name currently causes (+N) truncation to leak into speech announcements unless specifically formatted in announceNVDA.
- **aria-specialist**: Mixing Table (mixing_table) was added as Station 18; generating full multi-ingredient dish names without (+N) truncation ensures screen readers convey full recipe content, but requires accessible names on list buttons to remain concise and conform to WCAG 2.5.3 (Label in Name).
- **aria-specialist**: Semantic HTML refactoring of #station-items-list and #staging-items-list to native <ul> and <li> will eliminate custom ARIA roles and automatically announce correct item counts.
- **keyboard-navigator**: Multi-ingredient names on Mixing Table (Station 18) do not break the index-based focus retention logic upon item removal or staging transfer.
- **keyboard-navigator**: Station 18 actions C, K, W trigger globally when kitchen screen is active; if activeStationId is not mixing_table, K and W provide polite NVDA guidance instead of executing.

## Next steps

1. Fix the 11 blocking findings above, starting with any repeated component.
2. Re-run this audit and check the delta section for regressions.
3. Wire the scan into continuous integration so the next regression is caught before review.

Automated checks find a minority of accessibility barriers. A passing score is a floor, not a guarantee.

## Findings data

The merged findings, embedded so the next run can compute a delta without parsing this document.

```json a11y-findings
{
  "skills": [
    "aria-specialist",
    "keyboard-navigator",
    "live-region-controller",
    "text-quality-reviewer"
  ],
  "scope": [
    "index.html",
    "js/main-menu.js"
  ],
  "findings": [
    {
      "rule": "ARIA-NAME-TRUNCATION",
      "wcag": "1.3.1 A",
      "severity": "serious",
      "location": "index.html:6805-6807",
      "component": "mixing_table",
      "summary": "Mixing Table truncates multi-ingredient dish names with (+N) when mixing 4 or more ingredients, causing assistive technologies to lose critical ingredient information.",
      "evidence": "const previewNames = names.slice(0, 3).join(\" & \"); const extraSuffix = names.length > 3 ? ` (+${names.length - 3})` : \"\"; const defaultMixedName = `${previewNames}${extraSuffix} (${methodLabel})`;",
      "fix": "Generate defaultMixedName with the full list of ingredients (names.join(\" & \")) without (+N) truncation, matching Station 10 beverage_station to ensure complete sensory information reaches NVDA users.",
      "foundBy": [
        "aria-specialist"
      ]
    },
    {
      "rule": "ARIA-ROLE-MISMATCH",
      "wcag": "1.3.1 A",
      "severity": "serious",
      "location": "index.html:8820",
      "component": "#station-items-list",
      "summary": "Empty state placeholder message is given role=\"listitem\", causing screen readers to falsely announce that the list contains 1 item when it is empty.",
      "evidence": "listEl.innerHTML = `<div role=\"listitem\" ...>Bếp đang trống. Hãy lấy nguyên liệu từ Tủ Lạnh (Alt+1) bỏ vào đây!</div>`;",
      "fix": "Remove role=\"listitem\" from the empty state placeholder so screen readers accurately announce an empty list (0 items).",
      "foundBy": [
        "aria-specialist"
      ]
    },
    {
      "rule": "FOCUS-001",
      "wcag": "2.4.3 A",
      "severity": "serious",
      "location": "index.html:9863",
      "summary": "Pressing Escape in #modal-settings closes the dialog without returning focus to #btn-menu-settings.",
      "fix": "Register modalSettings with bindDialogFocusRestore(modalSettings) in index.html, and set modalSettings._returnFocusEl = btnMenuSettings in js/main-menu.js when opened.",
      "evidence": "if (modalSettings && modalSettings.open) { modalSettings.close(); return; }",
      "component": "SettingsModal",
      "foundBy": [
        "keyboard-navigator"
      ]
    },
    {
      "rule": "LIVE-REGION-SILENT-DROPPED-INGREDIENTS-BLENDER",
      "wcag": "4.1.3 AA",
      "severity": "serious",
      "location": "index.html:6455",
      "summary": "Blender station announcement silences ingredients beyond the first 3 when blending 4 or more ingredients, leaving screen reader users unaware of all blended ingredients.",
      "fix": "Include all constituent ingredients in the announcement: const allBlended = names.join(', '); announceNVDA(`Máy xay đã xay nhuyễn ${names.length} nguyên liệu (${allBlended}) thành món \"${blendedItem.name}\" sánh mịn ${coldBlendedPhrase}!`, 'polite');",
      "evidence": "const defaultBlendName = `${names.slice(0, 3).join(' & ')} (xay nhuyễn)`; ... announceNVDA(`Máy xay đã xay nhuyễn tất cả thành món \"${blendedItem.name}\" sánh mịn ${coldBlendedPhrase}!`, 'polite');",
      "component": "Máy Xay Sinh Tố (blender)",
      "foundBy": [
        "live-region-controller"
      ]
    },
    {
      "rule": "LIVE-REGION-TRUNCATION-MIXING-TABLE",
      "wcag": "4.1.3 AA",
      "severity": "serious",
      "location": "index.html:6805",
      "summary": "Mixing table announcement truncates ingredient lists to 3 items with (+N) suffix, preventing screen reader users from hearing all 4-5+ constituent ingredients of the mixture.",
      "fix": "Format the live region announcement to include the full list of constituent ingredients: const allNames = names.join(', '); announceNVDA(`Đã ${actionVerb} ${names.length} nguyên liệu (${allNames}) thành \"${mixedItem.name}\".${nextHint}`, 'polite');",
      "evidence": "const previewNames = names.slice(0, 3).join(' & '); const extraSuffix = names.length > 3 ? ` (+${names.length - 3})` : ''; const defaultMixedName = `${previewNames}${extraSuffix} (${methodLabel})`;",
      "component": "Bàn Trộn Đa Năng (mixing_table)",
      "foundBy": [
        "live-region-controller"
      ]
    },
    {
      "rule": "TQR-003",
      "wcag": "4.1.2 A",
      "severity": "serious",
      "location": "index.html:6805",
      "summary": "Combining 4 or more ingredients replaces remaining items with generic placeholder '(+N)' without disclosing them in name or description.",
      "fix": "Include the full list of ingredients in describeItemStateShort or provide an accessible title / aria-description containing all combined ingredients.",
      "evidence": "const previewNames = names.slice(0, 3).join(' & '); const extraSuffix = names.length > 3 ? ` (+${names.length - 3})` : '';",
      "component": "mixing_table",
      "foundBy": [
        "text-quality-reviewer"
      ]
    },
    {
      "rule": "TQR-009",
      "wcag": "2.5.3 A",
      "severity": "serious",
      "location": "index.html:8639",
      "summary": "Station selector button aria-label '${st.name}. ${st.desc}' does not contain visible text '${st.shortName}' (e.g. '18. Bàn Trộn').",
      "fix": "Prepend the visible shortName to the aria-label, e.g. `${st.shortName} - ${st.name}. ${st.desc}`, so voice navigation can target the visible numbered button names.",
      "evidence": "btn.setAttribute('aria-label', `${st.name}. ${st.desc}`); ... <span>${st.shortName}</span>",
      "component": "#station-selector-grid",
      "foundBy": [
        "text-quality-reviewer",
        "aria-specialist"
      ],
      "alsoReportedAs": [
        "ARIA-LABEL-IN-NAME"
      ]
    },
    {
      "rule": "TQR-009",
      "wcag": "2.5.3 A",
      "severity": "serious",
      "location": "index.html:8803",
      "summary": "Cooking busy button aria-label 'Đang xử lý: ${act.label}' does not contain the visible text '⏳ Đang chế biến...'.",
      "fix": "Synchronize the accessible name with the visible text, for example by setting aria-label to `Đang chế biến: ${act.label}`.",
      "evidence": "btn.setAttribute('aria-label', `Đang xử lý: ${act.label}`); btn.textContent = '⏳ Đang chế biến...';",
      "component": "#station-action-buttons",
      "foundBy": [
        "text-quality-reviewer"
      ]
    },
    {
      "rule": "TQR-009",
      "wcag": "2.5.3 A",
      "severity": "serious",
      "location": "index.html:8839",
      "summary": "Button accessible name 'Bỏ ${it.name}' does not contain the visible text 'Xóa'.",
      "fix": "Change the aria-label to 'Xóa ${it.name} khỏi bếp' so the accessible name starts with the visible button text 'Xóa'.",
      "evidence": "<button ... aria-label=\"Bỏ ${it.name}\">Xóa</button>",
      "component": "#station-items-list",
      "foundBy": [
        "text-quality-reviewer",
        "aria-specialist"
      ],
      "alsoReportedAs": [
        "ARIA-LABEL-IN-NAME"
      ]
    },
    {
      "rule": "TQR-009",
      "wcag": "2.5.3 A",
      "severity": "serious",
      "location": "index.html:9101",
      "summary": "Dish delete button accessible name 'Bỏ món ${dish.name} khỏi dĩa' does not contain visible text 'Xóa'.",
      "fix": "Change the aria-label to 'Xóa món ${dish.name} khỏi dĩa' (and in line 9145 to 'Xóa món ${displayName} khỏi dĩa') so the accessible name begins with the visible label 'Xóa'.",
      "evidence": "<button ... aria-label=\"Bỏ món ${dish.name} khỏi dĩa\">Xóa</button>",
      "component": "#plate-items-list",
      "foundBy": [
        "text-quality-reviewer"
      ]
    },
    {
      "rule": "TQR-010",
      "wcag": "4.1.2 A",
      "severity": "serious",
      "location": "index.html:8831",
      "summary": "Multi-ingredient names and descriptions are clipped by CSS .truncate without title attribute or accessible disclosure in station and staging lists.",
      "fix": "Add title attributes (e.g. title='${it.name}') and title='${desc}' to truncated elements, or allow wrapping / accessible tooltip disclosure so full item details are perceivable.",
      "evidence": "<div class=\"font-bold text-stone-900 truncate\">${idx + 1}. ${it.name}</div><div class=\"text-[10px] text-stone-600 truncate\">${desc}</div>",
      "component": "#station-items-list",
      "foundBy": [
        "text-quality-reviewer",
        "aria-specialist"
      ],
      "alsoReportedAs": [
        "ARIA-NAME-TRUNCATION"
      ]
    },
    {
      "rule": "ARIA-LABEL-IN-NAME",
      "wcag": "2.5.3 A",
      "severity": "moderate",
      "location": "index.html:8802-8805",
      "component": "#station-action-buttons",
      "summary": "When cooking is busy, action buttons visibly display \"⏳ Đang chế biến...\" while aria-label is set to \"Đang xử lý: ${act.label}\", omitting the visible text.",
      "evidence": "btn.setAttribute(\"aria-label\", `Đang xử lý: ${act.label}`); btn.textContent = \"⏳ Đang chế biến...\";",
      "fix": "Align the accessible name with the visible label text, for example aria-label=\"Đang chế biến: ${act.label}\".",
      "foundBy": [
        "aria-specialist"
      ]
    },
    {
      "rule": "ARIA-LABEL-IN-NAME",
      "wcag": "2.5.3 A",
      "severity": "moderate",
      "location": "index.html:8836",
      "component": "#station-items-list",
      "summary": "Staging transfer button with visible text \"Ra khay\" specifies aria-label=\"Cất ${it.name} ra Khay Tạm\", failing to include the exact visible label phrase.",
      "evidence": "<button type=\"button\" data-to-staging=\"${idx}\" ... aria-label=\"Cất ${it.name} ra Khay Tạm\">\n  Ra khay\n</button>",
      "fix": "Update aria-label to include the visible text phrase, for example aria-label=\"Ra khay: Cất ${it.name} ra Khay Tạm\".",
      "foundBy": [
        "aria-specialist"
      ]
    },
    {
      "rule": "ARIA-LABEL-IN-NAME",
      "wcag": "2.5.3 A",
      "severity": "moderate",
      "location": "index.html:8912",
      "component": "#staging-items-list",
      "summary": "Workbench transfer button with visible text \"Vào bếp\" sets aria-label=\"Đưa ${it.name} vào Bếp hiện tại\", failing to include the exact visible text phrase.",
      "evidence": "<button type=\"button\" data-to-st=\"${idx}\" ... aria-label=\"Đưa ${it.name} vào Bếp hiện tại\">\n  Vào bếp\n</button>",
      "fix": "Update aria-label to include the exact visible label text, for example aria-label=\"Vào bếp: Đưa ${it.name} vào Bếp hiện tại\".",
      "foundBy": [
        "aria-specialist"
      ]
    },
    {
      "rule": "ARIA-ROLE-MISMATCH",
      "wcag": "4.1.2 A",
      "severity": "moderate",
      "location": "index.html:832",
      "component": "#station-selector-grid",
      "summary": "Station selector grid uses role=\"toolbar\" and aria-pressed for single-selection stations, misrepresenting mutually exclusive stations as independent toggle buttons.",
      "evidence": "<div id=\"station-selector-grid\" ... role=\"toolbar\"> with btn.setAttribute(\"aria-pressed\", isAct ? \"true\" : \"false\")",
      "fix": "Change container role to \"radiogroup\" with aria-labelledby=\"heading-station-picker\" and child buttons to role=\"radio\" with aria-checked.",
      "foundBy": [
        "aria-specialist"
      ]
    },
    {
      "rule": "ARIA-SEMANTIC-HTML",
      "wcag": "1.3.1 A",
      "severity": "moderate",
      "location": "index.html:909",
      "component": "#station-items-list",
      "summary": "Station and staging item lists use generic <div> with role=\"list\" and role=\"listitem\" instead of semantic HTML <ul> and <li> elements.",
      "evidence": "<div id=\"station-items-list\" ... role=\"list\"> and row.setAttribute(\"role\", \"listitem\")",
      "fix": "Replace container <div> elements with semantic <ul> elements and row elements with native <li> elements, removing explicit role=\"list\" and role=\"listitem\".",
      "foundBy": [
        "aria-specialist"
      ]
    },
    {
      "rule": "FOCUS-002",
      "wcag": "2.4.3 A",
      "severity": "moderate",
      "location": "js/main-menu.js:1644",
      "summary": "Opening #modal-help from Main Menu does not set _returnFocusEl or focus close button, losing focus on close.",
      "fix": "In js/main-menu.js, set modalHelp._returnFocusEl = btnMenuHelp and focus btn-close-help when modalHelp.showModal() is invoked.",
      "evidence": "btnMenuHelp.addEventListener('click', () => { modalHelp.showModal(); });",
      "component": "HelpModal",
      "foundBy": [
        "keyboard-navigator"
      ]
    },
    {
      "rule": "FOCUS-003",
      "wcag": "2.4.3 A",
      "severity": "moderate",
      "location": "index.html:8628",
      "summary": "Roving tabindex callback invokes targetBtn.focus() on a detached DOM element after targetBtn.click() replaces station buttons.",
      "fix": "Remove redundant targetBtn.focus() from onSelectItem callback in renderWorkbench since targetBtn.click() already queries and focuses the active station in the live DOM.",
      "evidence": "attachRovingKeyNavigation(stationGrid, 'button', (targetBtn) => { targetBtn.click(); targetBtn.focus(); });",
      "component": "StationSelectorGrid",
      "foundBy": [
        "keyboard-navigator"
      ]
    },
    {
      "rule": "LIVE-REGION-DUAL-BUFFER-RACE-CONDITION",
      "wcag": "4.1.3 AA",
      "severity": "moderate",
      "location": "index.html:5246",
      "summary": "announceNVDA does not cancel pending setTimeout calls across dual buffers, causing simultaneous live region updates and speech collisions if called within 60ms.",
      "fix": "Track active timer IDs and clearTimeout before toggling or clearing buffers, ensuring previous pending speech triggers are canceled before new text is inserted into the alternating region.",
      "evidence": "state.liveToggleBuffer = !state.liveToggleBuffer; ... if (clearEl) clearEl.textContent = ''; if (targetEl) { targetEl.textContent = ''; setTimeout(() => { targetEl.textContent = message; }, 60); }",
      "component": "announceNVDA",
      "foundBy": [
        "live-region-controller"
      ]
    },
    {
      "rule": "LIVE-REGION-HIDDEN-WITH-DISPLAY-NONE",
      "wcag": "4.1.3 AA",
      "severity": "moderate",
      "location": "index.html:237",
      "summary": "Authentication alert containers use Tailwind 'hidden' (display: none), removing them from the accessibility tree and risking failed announcements when text is inserted dynamically.",
      "fix": "Remove 'hidden' from initial HTML and keep the live region in the DOM with empty textContent, or use visually hidden styling instead of display:none when inactive so screen readers register the live region before error dispatch.",
      "evidence": "<div id=\"login-alert-box\" role=\"alert\" aria-live=\"assertive\" class=\"hidden mb-4 p-3.5 rounded-2xl text-sm font-semibold border\"></div>",
      "component": "form-login / form-register",
      "foundBy": [
        "live-region-controller"
      ]
    },
    {
      "rule": "LIVE-REGION-INAPPROPRIATE-ASSERTIVE-POLITENESS",
      "wcag": "4.1.3 AA",
      "severity": "moderate",
      "location": "index.html:8324",
      "summary": "Tasting review and routine kitchen validation notices use aria-live='assertive' (role='alert'), unnecessarily interrupting user navigation for non-emergency status updates.",
      "fix": "Reserve priority='assertive' strictly for critical system errors. Switch routine dining reviews, empty kitchen notices, and validation guidance to priority='polite' so screen readers do not interrupt in-flight speech.",
      "evidence": "announceNVDA(`${char.name} vừa thưởng thức ${finalDishTitle}. Nhận xét: ${review.speech}`, 'assertive'); ... announceNVDA('Không có thức ăn nào trên bếp để cất vào Khay Tạm!', 'assertive');",
      "component": "feedCharacter / announceNVDA",
      "foundBy": [
        "live-region-controller"
      ]
    },
    {
      "rule": "TQR-009",
      "wcag": "2.5.3 A",
      "severity": "moderate",
      "confidence": "medium",
      "location": "index.html:8836",
      "summary": "Button accessible name 'Cất ${it.name} ra Khay Tạm' places the visible text 'Ra khay' after the variable ingredient name instead of at the start.",
      "fix": "Set aria-label to 'Ra khay: Cất ${it.name} ra Khay Tạm' so speech-input users uttering 'Click Ra khay' can reliably activate the button.",
      "evidence": "<button ... aria-label=\"Cất ${it.name} ra Khay Tạm\">Ra khay</button>",
      "component": "#station-items-list",
      "foundBy": [
        "text-quality-reviewer"
      ]
    },
    {
      "rule": "TQR-009",
      "wcag": "2.5.3 A",
      "severity": "moderate",
      "confidence": "medium",
      "location": "index.html:8912",
      "summary": "Button accessible name 'Đưa ${it.name} vào Bếp hiện tại' places the visible text 'Vào bếp' after the ingredient name instead of at the start.",
      "fix": "Set aria-label to 'Vào bếp: Đưa ${it.name} vào Bếp hiện tại' so speech-input commands matching the visible label succeed.",
      "evidence": "<button ... aria-label=\"Đưa ${it.name} vào Bếp hiện tại\">Vào bếp</button>",
      "component": "#staging-items-list",
      "foundBy": [
        "text-quality-reviewer"
      ]
    },
    {
      "rule": "TQR-010",
      "wcag": "1.3.1 A",
      "severity": "moderate",
      "location": "index.html:9099",
      "summary": "The dish ingredient summary list is hidden on viewports under 640px using class 'hidden sm:inline'.",
      "fix": "Remove 'hidden sm:inline' or provide a responsive layout that wraps the ingredient list below the dish name on narrow viewports.",
      "evidence": "<span class=\"text-[10px] text-stone-500 truncate hidden sm:inline\">${summaryText}</span>",
      "component": "#plate-items-list",
      "foundBy": [
        "text-quality-reviewer"
      ]
    },
    {
      "rule": "A11Y-LABEL-001",
      "wcag": "1.3.1 A",
      "severity": "minor",
      "location": "index.html:8836",
      "summary": "Full multi-ingredient dish names inside aria-label for both Ra khay and Xóa buttons create excessive auditory verbosity for keyboard screen reader users.",
      "fix": "Shorten button aria-label to a concise item identifier (e.g. Cất món 1 ra Khay Tạm) and expose full ingredient names via aria-describedby or an item details disclosure.",
      "evidence": "aria-label=\"Cất ${it.name} ra Khay Tạm\" / aria-label=\"Bỏ ${it.name}\"",
      "component": "StationItemsList",
      "foundBy": [
        "keyboard-navigator"
      ]
    },
    {
      "rule": "A11Y-TEXT-001",
      "wcag": "1.3.1 A",
      "severity": "minor",
      "location": "index.html:8831",
      "summary": "Compound multi-ingredient names in #station-items-list are truncated with CSS ellipsis without a title attribute or focusable disclosure for sighted keyboard users.",
      "fix": "Add title=\"${it.name}\" or a keyboard-focusable inspect trigger to allow sighted keyboard users to view the complete list of ingredients in compound dishes.",
      "evidence": "<div class=\"font-bold text-stone-900 truncate\">${idx + 1}. ${it.name}</div>",
      "component": "StationItemsList",
      "foundBy": [
        "keyboard-navigator"
      ]
    },
    {
      "rule": "ARIA-BUSY-MISUSE",
      "wcag": "4.1.2 A",
      "severity": "minor",
      "location": "index.html:8781",
      "component": "#station-action-buttons",
      "summary": "Attribute aria-busy is set on a static generic <div> container without aria-live or a widget role, rendering the busy state inert to assistive technologies.",
      "evidence": "actionsEl.setAttribute(\"aria-busy\", state.isCookingBusy ? \"true\" : \"false\");",
      "fix": "Remove aria-busy from #station-action-buttons or add aria-live=\"polite\" to the container if dynamic state observation is intended.",
      "foundBy": [
        "aria-specialist"
      ]
    },
    {
      "rule": "ARIA-GROUP-LABEL",
      "wcag": "1.3.1 A",
      "severity": "minor",
      "location": "index.html:885",
      "component": "#station-action-buttons",
      "summary": "Station action buttons container groups related culinary actions but lacks role=\"group\" and an accessible name referencing the station actions heading.",
      "evidence": "<div id=\"station-action-buttons\" class=\"grid grid-cols-2 sm:grid-cols-3 gap-2\">",
      "fix": "Add role=\"group\" and aria-labelledby=\"heading-station-actions\" to #station-action-buttons.",
      "foundBy": [
        "aria-specialist"
      ]
    },
    {
      "rule": "ARIA-ICON-HIDDEN",
      "wcag": "1.1.1 A",
      "severity": "minor",
      "location": "index.html:902",
      "component": "#panel-workbench",
      "summary": "Package emoji in #btn-station-to-staging is bare inline text without aria-hidden=\"true\", causing screen readers to announce the unicode emoji name before the button label.",
      "evidence": "<button id=\"btn-station-to-staging\" ...>\n  📦 Cất ra Khay Tạm (T)\n</button>",
      "fix": "Wrap the emoji in <span aria-hidden=\"true\">📦</span> matching other kitchen buttons.",
      "foundBy": [
        "aria-specialist"
      ]
    },
    {
      "rule": "ARIA-VERBOSE-NAME",
      "wcag": "4.1.2 A",
      "severity": "minor",
      "location": "index.html:8808",
      "component": "#station-action-buttons",
      "summary": "Station action buttons pack multi-sentence descriptions into aria-label, causing screen readers to read lengthy paragraphs as the button accessible name.",
      "evidence": "btn.setAttribute(\"aria-label\", `${act.label}. ${act.desc}`);",
      "fix": "Keep aria-label concise (e.g. act.label) and associate the action description via aria-describedby or visible helper text.",
      "foundBy": [
        "aria-specialist"
      ]
    },
    {
      "rule": "KEYBOARD-001",
      "wcag": "2.1.1 A",
      "severity": "minor",
      "location": "index.html:8628",
      "summary": "Station selector toolbar activates stations immediately on arrow key navigation rather than allowing arrow exploration with Space/Enter activation.",
      "fix": "Separate arrow key focus movement from tool activation by removing targetBtn.click() from the arrow key handler and allowing Enter/Space to select, or change role to radiogroup.",
      "evidence": "attachRovingKeyNavigation(stationGrid, 'button', (targetBtn) => { targetBtn.click(); targetBtn.focus(); });",
      "component": "StationSelectorGrid",
      "foundBy": [
        "keyboard-navigator"
      ]
    },
    {
      "rule": "KEYBOARD-002",
      "wcag": "2.1.1 A",
      "severity": "minor",
      "location": "index.html:909",
      "summary": "Scrollable #station-items-list container lacks tabindex=\"0\", preventing keyboard users from scrolling item contents with arrow keys or PageUp/PageDown.",
      "fix": "Add tabindex=\"0\" to #station-items-list so keyboard users can navigate and scroll the container independently.",
      "evidence": "<div id=\"station-items-list\" class=\"space-y-2 max-h-[180px] overflow-y-auto custom-scroll pr-1\" role=\"list\">",
      "component": "StationItemsList",
      "foundBy": [
        "keyboard-navigator"
      ]
    },
    {
      "rule": "LIVE-REGION-PLATE-SUMMARY-HIDDEN-ON-MOBILE",
      "wcag": "1.3.1 A",
      "severity": "minor",
      "location": "index.html:9099",
      "summary": "Constituent ingredients summary of plated dishes is hidden with display:none (hidden sm:inline), preventing mobile screen reader users from hearing dish ingredients on the plate.",
      "fix": "Replace class 'hidden sm:inline' with a visually hidden utility class (such as 'sr-only sm:not-sr-only') or expose the summary in aria-label so screen readers on mobile devices can announce the constituent ingredients.",
      "evidence": "<span class=\"text-[10px] text-stone-500 truncate hidden sm:inline\">${summaryText}</span>",
      "component": "renderServingPlate",
      "foundBy": [
        "live-region-controller"
      ]
    },
    {
      "rule": "TQR-010",
      "wcag": "4.1.2 A",
      "severity": "minor",
      "confidence": "medium",
      "location": "index.html:8717",
      "summary": "Wrapper and vessel radio buttons apply .truncate to ingredient names without a title attribute.",
      "fix": "Add title='${it.name}' to the button or wrap span so multi-ingredient wrapper names (such as kneaded dough) can be read in full.",
      "evidence": "<button ... class=\"... truncate ...\"><span aria-hidden=\"true\">${it.emoji}</span><span class=\"truncate\">${it.name}</span></button>",
      "component": "#wrap-vessel-options-container",
      "foundBy": [
        "text-quality-reviewer"
      ]
    },
    {
      "rule": "TQR-010",
      "wcag": "4.1.2 A",
      "severity": "minor",
      "location": "index.html:9143",
      "summary": "Plate item fallback row uses CSS .truncate on ${displayName} without a title attribute.",
      "fix": "Add title='${displayName}' to the span so truncated text is discoverable on hover and focus.",
      "evidence": "<span class=\"font-bold text-stone-900 truncate\">${idx + 1}. ${displayName}</span>",
      "component": "#plate-items-list",
      "foundBy": [
        "text-quality-reviewer"
      ]
    }
  ],
  "passed": [
    "#panel-workbench has valid role=\"tabpanel\", tabindex=\"0\", and aria-labelledby=\"tab-workbench\" linking to tab trigger.",
    "Asynchronous operations (baking, frying, mixing, feeding) announce processing state (isCookingBusy, isFeedingBusy) to provide immediate feedback",
    "Dual polite live regions (#nvda-live-polite-a, #nvda-live-polite-b) are present in the DOM on initial load before any user interaction",
    "Dynamic wrapper and vessel selector correctly uses role=\"radiogroup\" with aria-labelledby pointing to visible title and role=\"radio\" on options.",
    "Empty state list items in #station-items-list, #staging-items-list, and #plate-items-list provide meaningful explanatory Vietnamese text.",
    "Flavor bar progressbars provide sensory descriptive text alternatives via aria-valuetext.",
    "Focus is maintained in-place on #station-action-buttons across action executions without losing focus to document.body.",
    "Global :focus-visible provides high-visibility 3px outline on all interactive kitchen elements.",
    "Item deletion and transfer in #station-items-list preserve focus to adjacent buttons or fall back safely to #panel-workbench.",
    "Live region DOM text content is updated using textContent rather than innerHTML or node replacement",
    "Live regions are styled with .sr-only-live offscreen clipping rather than display: none or visibility: hidden",
    "NVDA live announcements for station switching and cooking completion are dispatched with polite politeness level.",
    "No placeholder or dummy text (TODO, FIXME, lorem ipsum) in accessible names.",
    "No positive tabindex values exist in index.html or js/main-menu.js.",
    "No unresolved template syntax ({0}, {{variable}}, ${expr}) in static HTML attributes.",
    "Roving tabindex keyboard navigation works across station buttons with Arrow keys, Home, and End.",
    "Single-key shortcuts (C, K, W) for Station 18 are properly guarded against modifier keys (Ctrl, Alt, Meta) and text entry inputs.",
    "Single-key shortcuts can be completely disabled via #setting-single-key-shortcuts meeting WCAG 2.1.4 Level A.",
    "Spice applications announce spice name, target location (station vs staging), and layered outer-wrapper seasoning accurately",
    "Staging tray transfers (moveStationToStaging, moveStagingToStation) announce exact item counts and names to live regions",
    "Station 18 (mixing_table) is fully reachable via keyboard in #station-selector-grid via Tab, Arrow keys, and End key.",
    "Station 18 action buttons (mix_toss, knead_dough, whisk_batter) are native HTML buttons in normal Tab order and operable via Space and Enter.",
    "Station action buttons maintain focus in-place and use aria-disabled instead of disabling elements during audio playback, preventing focus loss.",
    "Station selection and kitchen tab switching update live regions with station names and hotkey instructions"
  ],
  "notes": [
    {
      "skill": "text-quality-reviewer",
      "note": "Mixing Table (18. Bàn Trộn) actions correctly provide action verbs, sensory feedback, and distinct hotkeys (C, K, W)."
    },
    {
      "skill": "text-quality-reviewer",
      "note": "Audited strictly under text-quality-reviewer scope without modifying source code."
    },
    {
      "skill": "live-region-controller",
      "note": "Project implements dual-buffer ARIA live regions (#nvda-live-polite-a / #nvda-live-polite-b and #nvda-live-assertive-a / #nvda-live-assertive-b) rather than a single #nvda-live-region container to guarantee NVDA re-announces identical consecutive messages."
    },
    {
      "skill": "live-region-controller",
      "note": "When testing 4-5+ ingredients at the Mixing Table, visual brevity in mixedItem.name currently causes (+N) truncation to leak into speech announcements unless specifically formatted in announceNVDA."
    },
    {
      "skill": "aria-specialist",
      "note": "Mixing Table (mixing_table) was added as Station 18; generating full multi-ingredient dish names without (+N) truncation ensures screen readers convey full recipe content, but requires accessible names on list buttons to remain concise and conform to WCAG 2.5.3 (Label in Name)."
    },
    {
      "skill": "aria-specialist",
      "note": "Semantic HTML refactoring of #station-items-list and #staging-items-list to native <ul> and <li> will eliminate custom ARIA roles and automatically announce correct item counts."
    },
    {
      "skill": "keyboard-navigator",
      "note": "Multi-ingredient names on Mixing Table (Station 18) do not break the index-based focus retention logic upon item removal or staging transfer."
    },
    {
      "skill": "keyboard-navigator",
      "note": "Station 18 actions C, K, W trigger globally when kitchen screen is active; if activeStationId is not mixing_table, K and W provide polite NVDA guidance instead of executing."
    }
  ],
  "counts": {
    "critical": 0,
    "serious": 11,
    "moderate": 13,
    "minor": 11
  },
  "components": [
    {
      "component": "#station-items-list",
      "count": 6,
      "worst": "serious",
      "rules": [
        "ARIA-LABEL-IN-NAME",
        "ARIA-ROLE-MISMATCH",
        "ARIA-SEMANTIC-HTML",
        "TQR-009",
        "TQR-010"
      ]
    },
    {
      "component": "#station-action-buttons",
      "count": 5,
      "worst": "serious",
      "rules": [
        "ARIA-BUSY-MISUSE",
        "ARIA-GROUP-LABEL",
        "ARIA-LABEL-IN-NAME",
        "ARIA-VERBOSE-NAME",
        "TQR-009"
      ]
    },
    {
      "component": "#plate-items-list",
      "count": 3,
      "worst": "serious",
      "rules": [
        "TQR-009",
        "TQR-010"
      ]
    },
    {
      "component": "StationItemsList",
      "count": 3,
      "worst": "minor",
      "rules": [
        "A11Y-LABEL-001",
        "A11Y-TEXT-001",
        "KEYBOARD-002"
      ]
    },
    {
      "component": "mixing_table",
      "count": 2,
      "worst": "serious",
      "rules": [
        "ARIA-NAME-TRUNCATION",
        "TQR-003"
      ]
    },
    {
      "component": "#station-selector-grid",
      "count": 2,
      "worst": "serious",
      "rules": [
        "ARIA-ROLE-MISMATCH",
        "TQR-009"
      ]
    },
    {
      "component": "#staging-items-list",
      "count": 2,
      "worst": "moderate",
      "rules": [
        "ARIA-LABEL-IN-NAME",
        "TQR-009"
      ]
    },
    {
      "component": "StationSelectorGrid",
      "count": 2,
      "worst": "moderate",
      "rules": [
        "FOCUS-003",
        "KEYBOARD-001"
      ]
    }
  ],
  "score": 69,
  "grade": "D",
  "penalty": 90.5,
  "checks": 59,
  "generated": "2026-11-13",
  "template": "web"
}
```
