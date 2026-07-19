import { generateResponse } from "../config/openRouter.js"
import User from "../models/user.model.js"
import Website from "../models/website.model.js"
import extractJson from "../utils/extractJson.js"

const fallbackImage =
    'data:image/svg+xml;charset=UTF-8,' +
    encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
            <rect width="1200" height="800" fill="#e5e7eb" />
            <rect x="120" y="120" width="960" height="560" rx="32" fill="#d1d5db" />
            <text x="600" y="412" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" fill="#6b7280">
                Image unavailable
            </text>
        </svg>
    `)

const sanitizeSrcDoc = (html = '') =>
    html.replace(/https?:\/\/via\.placeholder\.com\/[^"'\s)]+/g, fallbackImage)

const masterPrompt = `
    YOU ARE A PRINCIPAL FRONTEND ARCHITECT, SENIOR UI/UX ENGINEER, AND SENIOR JAVASCRIPT ENGINEER.

Build premium, production-ready websites and web apps using ONLY HTML, CSS, and Vanilla JavaScript.

The generated output must be immediately deployable without any modifications.

USER REQUIREMENT:
{USER_PROMPT}

══════════════════════════════════════
IFRAME COMPATIBILITY (CRITICAL — READ FIRST)
══════════════════════════════════════

This HTML will be rendered inside a sandboxed <iframe srcdoc="..."> — not as a standalone page. Every design and code decision must account for this:

* NO localStorage, sessionStorage, cookies, or IndexedDB. Treat ALL state
  (active tab, form values, selected filters, gallery index, expenses,
  tasks, quiz progress, habit grids, palettes, board/game state, scroll-
  reveal triggers, etc.) as in-memory JavaScript variables only. State
  resets on reload — this is expected and correct, never work around it.
* Everything must be ONE self-contained HTML document — all CSS in a
  single <style> block, all JS in a single <script> block. No external
  <link rel="stylesheet">, no <script src="">, no relative file paths.
* Any link to an external site must use target="_blank".
* Do not use window.location, window.history, or hash-based routing for
  any logic — the iframe's location is not the parent page's URL.
* Avoid APIs that trigger permission prompts (camera, mic, geolocation) —
  typically blocked in sandboxed iframes.
* Clipboard API (navigator.clipboard.writeText) may silently fail
  depending on iframe permissions policy — always provide a visible
  fallback (e.g. show the value in a highlighted/selectable text field) so
  "copy" functionality degrades gracefully instead of appearing broken.
* Native HTML5 drag-and-drop (draggable, dragstart/dragover/drop events)
  works fine under allow-scripts and is the preferred approach for any
  Kanban/reorderable UI — do not use external DnD libraries.
* Google Fonts / external @font-face links may be blocked depending on
  sandboxing. Always define a solid system-font fallback stack so
  typography still looks intentional if a web font fails to load.
* Wrap uncertain browser APIs (IntersectionObserver, matchMedia,
  clipboard, etc.) in feature checks or try/catch — there is no visible
  console for the end user to see errors.
* No multiplayer/networked features (e.g. chess, games) — if the user
  requests a two-player game, it must be local "pass and play" on one
  screen, or single-player vs. a simple JS-based AI opponent. Never
  generate WebSocket/backend code, which cannot run here.

══════════════════════════════════════
QUALITY STANDARD - 2026 MODERN DESIGN
══════════════════════════════════════

Generate a stunning, award-winning quality output that looks like it was designed/built by a top-tier agency in 2026 — not a templated AI default.

Design Principles:
* Modern minimalist aesthetic with bold, opinionated typography
* Generous whitespace and breathing room
* Sophisticated color palette (60-30-10 rule) — use exact hex values from
  the user requirement; never fall back to generic/cliché combinations
  for the stated category
* Premium gradients and subtle shadows, used with restraint
* Smooth micro-interactions and hover/active states
* Glass morphism / backdrop blur where it fits the brand tone requested
* Consistent border-radius language matching the brand (don't mix sharp
  and soft styles arbitrarily)
* Excellent contrast in both light and dark palettes

Typography:
* Use the font pairing/character described in the user requirement via a
  system font stack — no external font files unless explicitly safe (see
  IFRAME COMPATIBILITY)
* Clear hierarchy, deliberate heading sizes, proper line heights (1.5–1.7
  body text), tuned letter-spacing for uppercase/small-caps labels
* Font weights used meaningfully: 400 / 500 / 600 / 700

Visual Elements:
* Cards/sections with borders/shadows appropriate to the brand tone
* Buttons with purposeful hover animations matching what's requested
* SVG icons preferred over emoji for a polished look
* Smooth transitions (0.2s–0.4s ease)
* Scroll-triggered reveal animations, staggered where natural
* Real, specific content — invented but plausible names/numbers/details
  fitting what's described, not generic filler

Content:
* Realistic, professional, brand-specific copy
* No Lorem Ipsum, no generic placeholders ("Project 1", "Lorem Company")
* Industry-specific terminology matching the business/app described

══════════════════════════════════════
WEBSITE / APP TYPE DETECTION
══════════════════════════════════════

First determine what the user requested, then apply the matching pattern below.

A) COMPLETE MARKETING/BROCHURE WEBSITE
Examples: Portfolio, Restaurant, Agency, SaaS Landing Page, Ecommerce,
School, Hospital, Hotel, Travel, Real Estate.
→ Generate all required sections with working navigation (see NAVIGATION).

B) SINGLE PAGE
Examples: Login, Signup, Forgot Password, Pricing Table, Contact Form,
Profile, Settings.
→ Generate ONLY that page. Never invent unnecessary pages or fake nav.

C) INTERACTIVE WEB APP / GAME (real-time, in-memory state)
Examples: Expense Tracker, Todo/Kanban Board, Quiz App, Recipe Finder,
Habit Tracker, Color Palette Generator, Calculator, 2D board/card games
(pass-and-play or vs. simple AI only — see IFRAME COMPATIBILITY).
→ This is a functioning application, not a brochure page. Prioritize the
STATE MANAGEMENT & INTERACTIVITY section below as heavily as visual
design. Every stated capability (add/edit/delete, calculate, filter,
toggle, drag-and-drop, score, progress, legal moves/rules) must actually
work end-to-end with visible, live UI updates — never a static mockup of
an app.

Never invent pages/sections/nav items the user didn't request, regardless of category.

══════════════════════════════════════
RESPONSIVE DESIGN (MANDATORY — TEST ALL BREAKPOINTS)
══════════════════════════════════════

Mobile-first: write base styles for mobile, then layer up with min-width media queries — not the reverse.

Required breakpoints (use these exact ranges, adjust only if content genuinely demands it):
* Small mobile:  320px – 479px
* Mobile:        480px – 767px
* Tablet:        768px – 1023px
* Desktop:       1024px – 1439px
* Large/Wide:    1440px and above

At EVERY breakpoint, verify:
* No horizontal scrolling or overflow under any circumstance (check with
  overflow-x: hidden on body as a safety net, but the root cause —
  oversized fixed-width elements, unescaped long text/URLs, images without
  max-width — must actually be fixed, not just hidden)
* Text remains readable (no font smaller than 14px on mobile body text)
* Touch targets (buttons, links, form inputs) are minimum 44x44px on
  mobile/tablet
* Images and media scale fluidly (max-width: 100%, height: auto, or
  object-fit: cover within a fixed-aspect container)
* Multi-column grids collapse to single or double column appropriately
  (never 4+ columns squeezed onto a 375px viewport)
* Navigation switches to a working hamburger/mobile menu below 768px,
  full nav above it
* Modals, forms, and cards never exceed the viewport width, with
  appropriate padding/margin at every size
* Font sizes scale smoothly — prefer clamp(min, preferred-vw, max) for
  headings so text isn't identical at 320px and 1440px, and isn't
  awkwardly oversized/undersized at either extreme
* Flexbox/Grid layouts use wrap, minmax(), auto-fit/auto-fill, or explicit
  breakpoint overrides — never fixed pixel widths that overflow on
  smaller screens
* Spacing (padding/margin/gap) scales down proportionally on smaller
  screens rather than staying desktop-sized and cramped
* Board/grid-based games (e.g. chess) resize proportionally and remain
  fully visible and tappable at every breakpoint, never overflowing or
  requiring horizontal scroll to reach part of the board

Techniques to use:
* CSS Grid with grid-template-columns: repeat(auto-fit, minmax(...)) for
  galleries/card grids so column count adapts automatically
* Flexbox with flex-wrap: wrap for nav bars, tag groups, button rows
* clamp() for fluid typography and spacing instead of fixed px + multiple
  overrides
* Container-relative units (%, rem, vw/vh) over fixed px for widths
* aspect-ratio property for consistent image/video/board containers
  across sizes

Never ship a design that only looks correct at 1440px and breaks at 375px — every layout must be built breakpoint-by-breakpoint, not scaled down as an afterthought.

══════════════════════════════════════
NAVIGATION (MANDATORY — for categories A & B)
══════════════════════════════════════

Every nav item MUST:
* Scroll to an existing section, OR
* Switch SPA view/page, OR
* Perform a real JavaScript action

Never generate href="#" unless a JS click handler is actually attached.

Desktop: nav works, active section/page highlights correctly.
Mobile: hamburger opens/closes, menu closes after item click, works after resize.
SPA: only one view visible at a time, no reloads, correct active state.

══════════════════════════════════════
CONTEXT-AWARE IMAGE SELECTION
══════════════════════════════════════

Images must visually match each section's content based on the detected category. Use different images per section — never repeat or use unrelated imagery.

Preferred order: Unsplash → Pexels direct image URLs.

Since URL validity can't be guaranteed, ALWAYS fall back to a hand-crafted inline SVG placeholder (styled with a gradient matching the section's palette) whenever there's doubt a URL will resolve — never risk a broken image.

Every image: responsive (object-fit: cover, max-width: 100%), descriptive alt text, loading="lazy".

(Interactive apps/games like Expense Tracker/Todo/Quiz/Chess typically need no photographic images at all — don't force imagery where the app doesn't call for it. Use SVG/CSS for game pieces, icons, and board rendering instead.)

══════════════════════════════════════
BUTTONS & FORMS
══════════════════════════════════════

Every button performs a real action — never a dead button, never a bare alert() standing in for real logic.

Every form includes: client-side validation, inline error messages, an inline success state (not a browser alert), visible focus styles, hover states.

══════════════════════════════════════
STATE MANAGEMENT & INTERACTIVITY (CRITICAL)
══════════════════════════════════════

For any interactive/stateful behavior — tabs, filters, forms, galleries,
add/edit/delete UIs, calculators, counters, quizzes, trackers, boards,
generators, games:

* Maintain state in plain in-memory JS variables/objects/arrays (e.g.
  let expenses = [], let boardState = [...]) — NEVER localStorage,
  sessionStorage, cookies, or a backend call.
* Create a dedicated render()/updateUI() function. Any state change must
  immediately clear and rebuild the relevant DOM to reflect it.
* All interactive elements need real, working event listeners that mutate
  state and call render() instantly.
* Forms use e.preventDefault(), validate, update in-memory state, clear
  inputs, and re-render.
* Totals/counts/scores/streaks/percentages recompute live on every
  relevant state change (e.g. via .reduce()/.filter() over the state
  array).
* Drag-and-drop UIs (Kanban boards, reorderable lists) use native HTML5
  drag events — update the item's state property on drop, then re-render.
* Rule-based games (e.g. chess) must implement actual rule logic in JS:
  legal move generation/validation, turn enforcement, and win/end-state
  detection — never a visual board with no real rules behind it.
* Never generate an interactive-looking element that does nothing or only
  shows an alert().

══════════════════════════════════════
ANIMATIONS
══════════════════════════════════════

Smooth, purposeful animation via CSS transitions/transforms and
IntersectionObserver for scroll-reveal — never JS-driven layout thrashing.
Examples: fade/slide reveal on load, hover elevation, card lift, staggered
section reveal, button press feedback, parallax via transform (never
background-attachment: fixed — breaks on mobile Safari).

Purposeful, not excessive.

══════════════════════════════════════
CODE QUALITY
══════════════════════════════════════

* One HTML document, one <style> block, one <script> block
* No duplicate CSS rules or JS functions
* Minimal inline styles
* Meaningful class names (BEM-style preferred)
* Well-organized, commented code, no unused code
* Zero console errors, zero runtime errors

══════════════════════════════════════
TECHNICAL RULES
══════════════════════════════════════

Use only HTML5, CSS3 (Grid, Flexbox, Custom Properties, modern selectors, backdrop-filter), and Vanilla JS (ES6+). No external frameworks, no external CSS/JS files, no chess/game libraries. System font stack by default. Must render correctly inside a sandboxed <iframe srcdoc>.

══════════════════════════════════════
MANDATORY VALIDATION (INTERNAL — DO NOT SKIP)
══════════════════════════════════════

Before responding, verify:
✓ No localStorage/sessionStorage/cookies used anywhere
✓ Everything self-contained in one HTML document (no external file refs)
✓ Correct pattern applied for detected category (A/B/C above)
✓ Verified independently at 320px, 480px, 768px, 1024px, and 1440px+ —
  no overflow, no broken layout, no oversized/undersized text at any of
  them
✓ Navigation (if applicable) and every nav item works
✓ Every button performs a real action
✓ Every form validates and shows inline success/error states
✓ For interactive apps: every stated feature (add/edit/delete/calculate/
  filter/toggle/drag) actually mutates state and re-renders live
✓ For board/rule-based games (e.g. chess): only legal moves are allowed,
  turn order is enforced, check/checkmate or win/end states are detected
  correctly, captured pieces/scores are tracked accurately, and play is
  strictly local pass-and-play or vs. a simple JS AI (never fake
  multiplayer/networking)
✓ Every image matches its section's content; no broken images (SVG
  fallback used where uncertain); no forced images on app/game builds
✓ Clipboard/drag-and-drop features have safe fallbacks
✓ No console/runtime errors
✓ No dead links, no dead buttons, no href="#" without a handler
✓ Copy is specific and realistic, no Lorem Ipsum
✓ Production-ready and deployable as-is

If any check fails, regenerate before responding.

══════════════════════════════════════
OUTPUT FORMAT
══════════════════════════════════════

Return ONLY valid JSON, nothing else:

{
"message": "Website generated successfully.",
"code": "<FULL VALID HTML DOCUMENT>"
}

Rules: no markdown, no explanations, no additional text outside the JSON, HTML must run immediately as-is, footer copyright must use 2026.
            `


export const generateWebsite=async (req,res) => {
    try{
        const {prompt}=req.body
        if(!prompt){
            return res.status(400).json({message:"prompt is required"})
        }
        const user= await User.findById(req.user._id)
        console.log(user)
        if(!user){
            return res.status(400).json({message:"user not found"})
        }

        const finalPrompt = masterPrompt.replace('USER_PROMPT', prompt)
        let raw= ''
        let parsed = null
       //iterate until parsed data is not received
        for(let i =0; i<2 && !parsed; i++){
            raw = await generateResponse(finalPrompt)
            parsed = await extractJson(raw)

            if(!parsed){
                raw = await generateResponse(finalPrompt + "\n\nRETURN ONLY RAW JSON.")
                parsed  = await extractJson(raw)
            }
            console.log(raw)
            console.log(parsed)
        }

        if(!parsed.code){
            console.log('ai returned invalid response')
            return res.status(400).json({message: 'ai returned invalid response'})
        }

        const website = await Website.create({
            user: user._id,
            title: prompt.slice(0, 60),
            latestCode: parsed.code,
            conversation: [
                {
                    role: 'user',
                    content: prompt
                },
                {
                    role: 'ai',
                    content: parsed.message
                },
                
            ]
        })

        await user.save()

        return res.status(200).json({
            websiteId: website._id,
            
        })
    }catch (error) {
        return res.status(500).json({message: `generate website error ${error}`})
    }
}

export const getWebsiteById = async(req,res)=>{
    try{
        const website = await Website.findById(req.params.id)
        if(!website){
            return res.status(400).json({message: 'Website not found'})
        }
        if(website.user.toString() !== req.user._id.toString()){
            return res.status(403).json({message: 'Forbidden'})
        }
        return res.status(200).json(website)
    }catch(error){
        return res.status(500).json({message: `Get  website by id error : ${error}`})
    }
}

export const changes = async (req,res) =>{
    const abortController = new AbortController()
    const handleRequestClose = () => abortController.abort()

    try{
        req.on('close', handleRequestClose)

        const {prompt}=req.body
        if(!prompt){
            return res.status(400).json({message:"prompt is required"})
        }
        const website = await Website.findById(req.params.id)
        if(!website){
            return res.status(400).json({message: 'Website not found'})
        }
        if(website.user.toString() !== req.user._id.toString()){
            return res.status(403).json({message: 'Forbidden'})
        }
        const user= await User.findById(req.user._id)
        console.log(user)
        if(!user){
            return res.status(400).json({message:"user not found"})
        }

        const updatePrompt = `
                UPDATE THIS HTML WEBSITE
                CURRENT CODE: ${website.latestCode}
                USER REQUEST: ${prompt}

                Apply the requested changes while maintaining the modern 2026 design aesthetic.
                
                Requirements:
                * Keep the existing design language
                * Apply changes smoothly
                * Maintain responsive design
                * Keep animations and interactions
                * Ensure all functionality works
                
                RETURN RAW JSON ONLY: 
                {
                    "message": "Short confirmation",
                    "code": "<UPDATED FULL HTML>"
                }
                    FOOTER RULE:
- When generating copyright FOOTER, use the latest date(2026)
        `
         let raw= ''
        let parsed = null
       //iterate until parsed data is not received
        for(let i =0; i<2 && !parsed; i++){
            raw = await generateResponse(updatePrompt, { signal: abortController.signal })
            parsed = await extractJson(raw)

            if(!parsed){
                raw = await generateResponse(updatePrompt + "\n\nRETURN ONLY RAW JSON.", { signal: abortController.signal })
                parsed  = await extractJson(raw)
            }
            console.log(raw)
            console.log(parsed)
        }

        if(abortController.signal.aborted){
            return
        }

        if(!parsed.code){
            console.log('ai returned invalid response')
            return res.status(400).json({message: 'ai returned invalid response'})
        }

        website.conversation.push(
            {role: "user", content: prompt},
            {role: "ai", content: parsed.message}
        )
        website.latestCode = parsed.code

        await website.save()
        await user.save()

        return res.status(200).json({
            message:parsed.message,
            code:parsed.code
        })

    }catch(error){
             if(abortController.signal.aborted || error.name === 'AbortError'){
                return
             }
             return res.status(500).json({message: `update website error ${error}`})
    }finally{
             req.off('close', handleRequestClose)
    }
}

export const getAll = async (req,res)=>{
    try {
        const websites = await Website.find({user:req.user._id})
        const sanitizedWebsites = websites.map((website) => ({
            ...website.toObject(),
            latestCode: sanitizeSrcDoc(website.latestCode || '')
        }))
        return res.status(200).json(sanitizedWebsites)
    } catch (error) {
         return res.status(500).json({message: `Get all website error ${error}`})
    }
}


export const deploy=async (req,res)=>{
    try{
       const website = await Website.findOne({
        _id: req.params.id,
        user: req.user._id
       })

       if(!website){
        return res.status(400).json({message:"website not found"})
       }

       if(!website.slug){
        website.slug=website.title.toLowerCase().replace(/[^a-z0-9]/g,"").slice(0,60)+website.
        _id.toString().slice(-5)
       }

       website.deployed=true
       const liveSiteUrl = process.env.LIVE_SITE_URL || process.env.FRONTEND_URL
       website.deployedUrl=`${liveSiteUrl}/site/${website.slug}`
       await website.save()

       return res.status(200).json({
        url:website.deployedUrl
       })

    }catch (error){
        return res.status(500).json({message:`deploy website error ${error}`})
    }
}

export async function getBySlug(req,res){
    try{
    const website = await Website.findOne({
        slug: req.params.slug
       })

       if(!website){
        return res.status(400).json({message:"website not found"})
       }
       return res.status(200).json({
        ...website.toObject(),
        latestCode: sanitizeSrcDoc(website.latestCode || '')
       })
    } catch(error){
        return res.status(500).json({message:`get bu slug website error ${error}`})
    }
}

const storageShim = `
<script>
(function () {
  const store = {};
  const fakeStorage = {
    getItem(key) { return store[key] ?? null; },
    setItem(key, value) { store[key] = String(value); },
    removeItem(key) { delete store[key]; },
    clear() { Object.keys(store).forEach(k => delete store[k]); }
  };
  try {
    Object.defineProperty(window, "localStorage", {
      value: fakeStorage, configurable: true
    });
    Object.defineProperty(window, "sessionStorage", {
      value: fakeStorage, configurable: true
    });
  } catch (e) {}
  try {
    var _origPushState = window.history.pushState.bind(window.history);
    var _origReplaceState = window.history.replaceState.bind(window.history);
    window.history.pushState = function (s, u, t) {
      try { return _origPushState(s, u, t); } catch (e) {}
    };
    window.history.replaceState = function (s, u, t) {
      try { return _origReplaceState(s, u, t); } catch (e) {}
    };
  } catch (e) {}
  try {
    window.indexedDB = {
      open: function () { return { result: null, onerror: null, onsuccess: null, onupgradeneeded: null }; },
      deleteDatabase: function () {},
      databases: function () { return Promise.resolve([]); },
      cmp: function () { return 0; }
    };
  } catch (e) {}
})();
</script>
`;

function buildPreviewHtml(html) {
  const sanitized = sanitizeSrcDoc(html);
  if (/<\/head>/i.test(sanitized)) {
    return sanitized.replace(/<\/head>/i, storageShim + '</head>');
  }
  return storageShim + sanitized;
}

export async function previewSite(req, res) {
  try {
    const website = await Website.findOne({ slug: req.params.slug });
    if (!website) {
      return res.status(404).send('Website not found');
    }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(buildPreviewHtml(website.latestCode || ''));
  } catch (error) {
    res.status(500).send('Preview error');
  }
}

export async function previewById(req, res) {
  try {
    const website = await Website.findById(req.params.id);
    if (!website) {
      return res.status(404).send('Website not found');
    }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(buildPreviewHtml(website.latestCode || ''));
  } catch (error) {
    res.status(500).send('Preview error');
  }
}

export async function saveDraft(req, res) {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'code is required' });
    }
    const website = await Website.findById(req.params.id);
    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }
    if (website.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    website.latestCode = code;
    await website.save();
    return res.status(200).json({ message: 'Draft saved' });
  } catch (error) {
    return res.status(500).json({ message: `Save draft error: ${error}` });
  }
}