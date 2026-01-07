# Design Specification

## Visual Direction
- Tone: confident and friendly; avoid generic gradients. Primary palette: charcoal `#0f172a`, off-white `#f7f7f2`, teal accent `#12b8a6`, amber highlight `#f59f00`, muted slate `#334155`.
- Typography: headings in "Space Grotesk" (700/600 weights), body in "Inter" (400/500). Fallback stack: `"Space Grotesk","Inter",system-ui,-apple-system,"Segoe UI",sans-serif`.
- Background: subtle diagonal grain or soft radial gradient from `#f7f7f2` to `#e8ecf1` behind card surfaces to avoid a flat feel.
- Elevation: cards use 12px radius, 1px border `#e2e8f0`, and shadow `0 12px 30px rgba(15,23,42,0.08)`.
- Spacing scale: 4px unit; primary paddings 12/16/24; content max-width 1080px on desktop.

## Components
- **Header**: sticky top bar, 64px height, background `#0f172a`; logo/app title on left, nav links center/left; user capsule (avatar + name + logout) right. Visible on all pages (including Login and Not Found). Hover states use `rgba(255,255,255,0.08)` and focus outlines `2px solid #12b8a6`.
- **Buttons**: primary filled teal with white text; hover darkens to `#0fa490`; active inset shadow; focus ring `2px #f59f00`. Secondary outlined slate with hover fill `#e2e8f0`.
- **Tabs**: pill-shaped toggles for Active/Completed; active tab uses teal background and white text; inactive uses border `#cbd5e1` on soft background; animated underline slides between tabs.
- **Cards**: author header row (avatar, name, timestamp), content area, footer CTA. Include a subtle top accent bar matching author color or teal.
- **Forms**: inputs with 10px radius, 1.5px border `#cbd5e1`, focus border `#12b8a6`; helper text beneath fields. Disabled states reduce opacity to 0.6.
- **Badges**: score pill background `#f59f00` with dark text; secondary badges use `#e2e8f0` and slate text.
- **Charts** (poll results): horizontal progress bars with striped fill for selected option; selected bar uses teal, unselected uses slate; overlay label "Your vote" as a small badge.

## Page Layouts
- **Login**: centered card with title and user list grid. Each user tile shows avatar, name, and `Impersonate` CTA. Include short intro text clarifying the demo nature.
- **Home (Dashboard)**: hero strip with page title and description; tabs beneath. Poll cards arranged in a responsive grid (1 column on mobile, 2 on tablet/desktop).
- **Poll Detail**: two-column layout on desktop (avatar/author on left, poll body on right); single column on mobile. Option cards are clickable; results view swaps cards for bars and summary stats.
- **New Poll**: vertical form with step labels; include preview of final question text; success toast on submit.
- **Leaderboard**: stacked list with rank numbers, avatars, name, counts, and score badge. Logged-in user row uses a faint teal background.
- **Not Found**: simple illustration placeholder, message, and button back to Home.

## Interaction & Motion
- Page load: fade/slide-in from 8px offset; 200ms ease-out. Tab switch uses 150ms cross-fade.
- Buttons and cards: hover translateY(-1px) with shadow intensifying; focus-visible rings always render.
- Form errors: shake animation at 120ms if submission fails; error text in `#b91c1c`.
- Skeleton loaders: rounded bars for list placeholders during initial fetch.

## Responsiveness
- Breakpoints: mobile <640px, tablet 640-1024px, desktop >1024px.
- Header collapses nav into a menu button on mobile; tabs become horizontally scrollable if needed.
- Cards and grids adjust to single-column on small screens; padding reduces to 12px.

## Accessibility
- Color contrast meets WCAG AA for text and controls; verify teal/amber on off-white and slate backgrounds.
- All interactive elements reachable via keyboard with visible focus; form fields have explicit `<label>` tags.
- Live regions for save errors and success toasts; progress bars include ARIA labels and value text.

## Assets
- Avatars from `_DATA.js` paths; ensure consistent 48px circle cropping.
- Logo can be a simple monogram badge in teal/amber; keep SVG under 8kb.
