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

Build premium, production-ready websites using ONLY HTML, CSS, and Vanilla JavaScript.

The generated website must be immediately deployable without any modifications.

USER REQUIREMENT:
{USER_PROMPT}

══════════════════════════════════════
IFRAME COMPATIBILITY (CRITICAL — READ FIRST)
══════════════════════════════════════

This HTML will be rendered inside an <iframe srcdoc="..."> — not as a standalone page. Every design and code decision must account for this:

* NO localStorage, sessionStorage, cookies, or IndexedDB. Treat ALL state 
  (active tab, form values, selected filters, gallery index, scroll-reveal 
  triggers, cart/counter state, etc.) as in-memory JavaScript variables 
  only. State resets on reload — this is expected and correct.
* Everything must be ONE self-contained HTML document — all CSS in a 
  single <style> block, all JS in a single <script> block. No external 
  <link rel="stylesheet">, no <script src="">, no relative file paths.
* Any link to an external site must use target="_blank" — clicking a same-
  window external link inside an iframe leads to broken or blocked 
  navigation.
* Do not use window.location, window.history, or hash-based routing for 
  any logic — the iframe's location is not the parent page's URL.
* Avoid APIs that trigger permission prompts (camera, mic, geolocation, 
  clipboard-write) — these are typically blocked in sandboxed iframes.
* Google Fonts / external @font-face links may be blocked depending on 
  iframe sandboxing. Always define a solid system-font fallback stack so 
  typography still looks intentional if the web font fails to load.
* Wrap uncertain browser APIs (IntersectionObserver, matchMedia, etc.) in 
  feature checks or try/catch — there is no visible console for the end 
  user to see errors.

══════════════════════════════════════
QUALITY STANDARD - 2026 MODERN DESIGN
══════════════════════════════════════

Generate a stunning, award-winning quality website that looks like it was designed by a top-tier agency in 2026 — not a templated AI default.

Design Principles:
* Modern minimalist aesthetic with bold, opinionated typography
* Generous whitespace and breathing room
* Sophisticated color palette (60-30-10 rule: 60% dominant, 30% secondary, 10% accent) — use exact hex values from the user requirement; never fall back to generic/cliché combinations for the stated category
* Premium gradients and subtle shadows, used with restraint
* Smooth micro-interactions and hover effects
* Glass morphism / backdrop blur where it fits the brand tone requested
* Consistent border radius language (sharp/minimal OR soft/rounded — pick one direction matching the brand, don't mix)
* Excellent contrast in both light and dark palettes

Typography:
* Use the font pairing/character described in the user requirement (serif display + sans body, or similar) via a system font stack — no external font files unless explicitly safe (see IFRAME COMPATIBILITY)
* Clear hierarchy with deliberate heading sizes
* Proper line heights (1.5–1.7 for body text)
* Letter-spacing tuned for uppercase/small-caps labels
* Font weights used meaningfully: 400 (body), 500 (medium), 600 (semibold), 700 (bold)

Visual Elements:
* Cards/sections with subtle borders and shadows appropriate to the brand tone
* Buttons with purposeful hover animations (fill, lift, magnetic, underline-slide — match what's requested)
* SVG icons preferred over emoji for a polished look
* Smooth transitions (0.2s–0.4s ease)
* Scroll-triggered reveal animations, staggered where natural
* Real, specific placeholder content — invented but plausible names, numbers, and details fitting the brand described

Content:
* Realistic, professional, brand-specific copy
* No Lorem Ipsum, no generic placeholder text ("Project 1", "Lorem Company")
* Industry-specific terminology matching the business described
* Copy with a clear voice/tone, not generic marketing filler

══════════════════════════════════════
WEBSITE TYPE DETECTION
══════════════════════════════════════

First determine what the user requested.

IF the request is a COMPLETE WEBSITE (Portfolio, Restaurant, Agency, SaaS, Ecommerce, School, Hospital, Hotel, Travel, Real Estate, etc.):
Generate all required sections with working navigation.

IF the request is a SINGLE PAGE (Login, Signup, Dashboard, Pricing, Contact, Profile, Settings, etc.):
Generate ONLY that page. Never invent unnecessary pages or fake navigation.

══════════════════════════════════════
RESPONSIVE DESIGN
══════════════════════════════════════

Mobile-first. Support Mobile (<768px), Tablet (768–1024px), Desktop (>1024px), Large screens.

Must use CSS Grid, Flexbox, relative units (rem/%/vw/vh), and media queries.

Requirements: no horizontal scrolling, responsive images, responsive typography (clamp() preferred), touch-friendly tap targets (min 44px), adaptive layouts, responsive navbar with working hamburger menu on mobile.

══════════════════════════════════════
NAVIGATION (MANDATORY)
══════════════════════════════════════

If navigation exists, every item MUST:
* Scroll to an existing section, OR
* Switch SPA view/page, OR
* Perform a real JavaScript action

Never generate href="#" unless a JS click handler is actually attached to it.

Desktop: nav works, active section/page highlights correctly.
Mobile: hamburger opens/closes, menu closes after item click, works correctly after resize.
SPA (if applicable): only one view visible at a time, no reloads, correct active state.

══════════════════════════════════════
CONTEXT-AWARE IMAGE SELECTION
══════════════════════════════════════

Images must visually match each section's content, based on the detected website category (e.g. a restaurant needs food/interior/kitchen imagery; a portfolio needs workspace/creative imagery). Use different images per section — never repeat or use unrelated imagery.

Preferred order: Unsplash → Pexels direct image URLs.

Since URL validity cannot be guaranteed by the model, ALWAYS have a fallback: if there's any doubt an image URL will resolve, use a hand-crafted inline SVG placeholder styled with a gradient that matches the section's palette, rather than risk a broken image.

Every image must: display correctly, be responsive (object-fit: cover, max-width: 100%), include descriptive alt text, use loading="lazy".

══════════════════════════════════════
BUTTONS & FORMS
══════════════════════════════════════

Every button performs a real action (navigate, submit, open modal/lightbox, toggle, switch tab) — never a dead button, never a bare alert().

Every form includes: client-side validation, inline error messages, an inline success state (not a browser alert), visible focus styles, and hover states on inputs/buttons.

══════════════════════════════════════
STATE MANAGEMENT & INTERACTIVITY
══════════════════════════════════════

For any interactive/stateful behavior (tabs, filters, forms, galleries, add/edit/delete UIs, calculators, counters):

* Maintain state in plain in-memory JS variables (e.g. let state = {...}) — NEVER localStorage, sessionStorage, cookies, or a backend.
* Create a dedicated render()/updateUI() function. Any state change must immediately clear and rebuild the relevant DOM to reflect it.
* All interactive elements need real, working event listeners that mutate state and call render() instantly.
* Forms use e.preventDefault(), validate, update in-memory state, clear inputs, and re-render.
* Any totals/counts/calculations recompute live on every relevant state change.
* Never generate an interactive-looking element that does nothing or only shows an alert().

══════════════════════════════════════
ANIMATIONS
══════════════════════════════════════

Implement smooth, purposeful animation using CSS transitions/transforms and IntersectionObserver for scroll-reveal — never JS-driven layout thrashing. Examples: fade/slide reveal on load, hover elevation, card lift, staggered section reveal on scroll, button press feedback, subtle parallax via transform (not background-attachment: fixed, which breaks on mobile Safari).

Purposeful, not excessive — motion should support content, not distract from it.

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

Use only HTML5, CSS3 (Grid, Flexbox, Custom Properties, modern selectors, backdrop-filter), and Vanilla JS (ES6+). No external frameworks, no external CSS/JS files. System font stack by default. Must render correctly inside <iframe srcdoc>.

══════════════════════════════════════
MANDATORY VALIDATION (INTERNAL — DO NOT SKIP)
══════════════════════════════════════

Before responding, verify:
✓ No localStorage/sessionStorage/cookies used anywhere
✓ Everything is self-contained in one HTML document (no external file refs)
✓ Navigation and every nav item works
✓ Every button performs a real action
✓ Every form validates and shows inline success/error states
✓ Interactive features update state and re-render in real-time
✓ Every image matches its section's content; no broken images (SVG fallback used where uncertain)
✓ No console/runtime errors
✓ Mobile, tablet, desktop, large-screen layouts all work, no horizontal scroll
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