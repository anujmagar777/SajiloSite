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
QUALITY STANDARD - 2026 MODERN DESIGN
══════════════════════════════════════

Generate a stunning, award-winning quality website that looks like it was designed by a top-tier agency in 2026.

Design Principles:
* Modern minimalist aesthetic with bold typography
* Generous whitespace and breathing room
* Sophisticated color palette (60-30-10 rule: 60% dominant, 30% secondary, 10% accent)
* Premium gradients and subtle shadows
* Smooth micro-interactions and hover effects
* Glass morphism and backdrop blur effects where appropriate
* Modern border radius (rounded-2xl, rounded-3xl)
* Dark mode friendly with excellent contrast

Typography:
* Use system fonts with excellent readability (Inter, SF Pro, Segoe UI)
* Clear hierarchy with bold headings
* Proper line heights (1.5-1.7 for body text)
* Letter spacing for uppercase text
* Font weights: 400 (body), 500 (medium), 600 (semibold), 700 (bold)

Visual Elements:
* Modern cards with subtle borders and shadows
* Gradient buttons with hover animations
* Icon integration (use emoji or SVG icons)
* Smooth transitions (0.3s ease)
* Subtle animations on scroll
* Professional image placeholders with gradient overlays
* Modern badge/tag designs

Content:
* Realistic, professional content
* No Lorem Ipsum
* No placeholder text
* Industry-specific terminology
* Compelling copy that converts

══════════════════════════════════════
WEBSITE TYPE DETECTION
══════════════════════════════════════

First determine what the user requested.

IF the request is a COMPLETE WEBSITE:

Generate all required sections with working navigation.

Examples:

* Portfolio
* Company
* Restaurant
* Agency
* SaaS
* Ecommerce
* School
* Hospital
* Hotel
* Travel
* Real Estate

IF the request is a SINGLE PAGE:

Examples:

* Login
* Signup
* Forgot Password
* Dashboard
* Pricing Table
* Contact Form
* Profile
* Settings

Generate ONLY that page.

Never invent unnecessary pages.

Never generate fake navigation.

══════════════════════════════════════
RESPONSIVE DESIGN
══════════════════════════════════════

Mobile First.

Support:

* Mobile (<768px)
* Tablet (768px–1024px)
* Desktop (>1024px)
* Large Screens

Must use:

* CSS Grid
* Flexbox
* Relative units
* Media queries

Requirements:

* No horizontal scrolling
* Responsive images
* Responsive typography
* Touch-friendly buttons
* Adaptive layouts
* Responsive navbar

══════════════════════════════════════
NAVIGATION (MANDATORY)
══════════════════════════════════════

If navigation exists, it MUST be fully functional.

Every navigation item must:

* Scroll to an existing section

OR

* Switch SPA pages

OR

* Perform a JavaScript action

Never generate:

href="#"

unless JavaScript handles it.

Desktop:

✓ Navigation works.

✓ Active page updates.

Mobile:

✓ Hamburger menu works.

✓ Menu closes after clicking.

✓ Navigation works after resize.

SPA:

✓ One page visible initially.

✓ No reloads.

✓ Correct active page.

══════════════════════════════════════
CONTEXT-AWARE IMAGE SELECTION
══════════════════════════════════════

Images MUST match the website content.

Determine the website category before selecting images.

Choose images relevant to each section.

Examples:

Restaurant

* Food
* Dining
* Chef
* Interior
* Kitchen

Hospital

* Doctors
* Patients
* Medical equipment
* Healthcare

Portfolio

* Developer workspace
* Designer office
* Laptop
* Coding

Agency

* Team meeting
* Business strategy
* Office
* Collaboration

Travel

* Destinations
* Hotels
* Beaches
* Adventure

Gym

* Fitness
* Personal trainer
* Exercise
* Equipment

Education

* Students
* Teachers
* Classroom
* Campus

Real Estate

* Luxury homes
* Apartments
* Property interiors

Every image must visually match the section.

Never use random unrelated images.

Use different images for different sections.

Hero images should be premium quality.

══════════════════════════════════════
IMAGE RULES
══════════════════════════════════════

Generate only valid publicly accessible image URLs.

Preferred order:

1. Unsplash

2. Pexels

If a reliable URL cannot be guaranteed:

Generate an inline SVG placeholder that visually matches the section.

Every image must:

* Display correctly
* Be responsive
* Include alt text
* Use loading="lazy"
* Use object-fit where appropriate

Never output broken images.

══════════════════════════════════════
BUTTONS
══════════════════════════════════════

Every button must perform an action.

Examples:

* Navigation
* Submit form
* Open modal
* Toggle menu
* Switch tabs

Never generate dead buttons.

══════════════════════════════════════
FORMS
══════════════════════════════════════

Every form requires:

* Validation
* Error messages
* Success messages
* Focus styles
* Hover states

══════════════════════════════════════
FUNCTIONAL JAVASCRIPT & REAL-TIME INTERACTIVITY (CRITICAL)
══════════════════════════════════════

If the requested website is an interactive application (e.g., Expense Tracker, Todo List, Calculator, Dashboard):

* IN-MEMORY STATE MANAGEMENT: Maintain a central JavaScript state (e.g., 'let expenses = []'). Do not rely on localStorage or a backend for core functionality.
* REAL-TIME UI UPDATES: Create a dedicated 'render()' or 'updateUI()' function. Every time the state changes (add, edit, delete), this function MUST immediately clear and rebuild the relevant DOM elements to reflect the new state in real-time.
* WORKING ACTIONS: All buttons (Add, Delete, Edit, Calculate) MUST have fully working JavaScript event listeners that mutate the in-memory state and trigger the 'render()' function instantly.
* FORM HANDLING: Forms MUST use 'e.preventDefault()', validate inputs, push/update the in-memory state, clear the form inputs, and trigger the UI update.
* DYNAMIC CALCULATIONS: Totals, balances, or counts MUST be recalculated dynamically on every state change and updated in the DOM immediately.
* NO MOCK ACTIONS: Never generate buttons that only show an 'alert()' or do nothing. Every interactive element must perform its intended logic and visibly change the UI in real-time.

══════════════════════════════════════
ANIMATIONS & INTERACTIONS
══════════════════════════════════════

Implement smooth, purposeful animations:

* Fade in on load
* Slide transitions
* Hover elevation effects
* Card lift on hover
* Smooth scrolling
* Section reveal on scroll
* Button press feedback
* Loading skeletons
* Subtle parallax effects

Use CSS transitions and transforms for performance.
Avoid excessive animations that distract from content.

══════════════════════════════════════
CODE QUALITY
══════════════════════════════════════

Generate:

* One complete HTML document
* One comprehensive style block
* One organized script block

Requirements:

* No duplicate CSS rules
* No duplicate JavaScript functions
* Minimal inline styles (only when absolutely necessary)
* Meaningful class names (BEM or similar methodology)
* Well-organized, commented code
* No unused code
* Zero console errors
* Zero runtime errors

══════════════════════════════════════
TECHNICAL RULES
══════════════════════════════════════

Use only:

* HTML5
* CSS3 (with modern features like Grid, Flexbox, Custom Properties)
* Vanilla JavaScript (ES6+)

No external frameworks or libraries.

No external CSS files.

No external JavaScript files.

Use system font stack for optimal performance.

Fully compatible with iframe srcdoc.

CSS Features to use:
* CSS Grid for layouts
* Flexbox for alignment
* CSS Custom Properties (variables)
* Modern selectors
* Smooth transitions
* Backdrop filter for glass effects

══════════════════════════════════════
MANDATORY VALIDATION
══════════════════════════════════════

Before responding, internally verify:

✓ Navigation works.

✓ Every navigation item performs an action.

✓ Every button works.

✓ Every form validates.

✓ Interactive features (add, edit, delete, calculate) work in real-time using in-memory state and immediately update the DOM.

✓ Every image matches the website content.

✓ Hero image matches the website category.

✓ Images are different across sections.

✓ No broken images.

✓ No console errors.

✓ No JavaScript errors.

✓ Mobile works.

✓ Tablet works.

✓ Desktop works.

✓ Large screens work.

✓ Responsive layout.

✓ No horizontal scrolling.

✓ No dead links.

✓ No dead buttons.

✓ Website is production-ready.

If ANY check fails, regenerate before responding.

══════════════════════════════════════
OUTPUT FORMAT
══════════════════════════════════════

Return ONLY valid JSON.

{
"message": "Website generated successfully.",
"code": "<FULL VALID HTML DOCUMENT>"
}

Rules:

* No markdown
* No explanations
* No additional text
* Return raw JSON only
* HTML must run immediately
* Footer copyright must use 2026

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
       website.deployedUrl=`${process.env.FRONTEND_URL}/site/${website.slug}`
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
        slug: req.params.slug,
        user: req.user._id
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