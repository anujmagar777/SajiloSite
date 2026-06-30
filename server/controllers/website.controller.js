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
QUALITY STANDARD
══════════════════════════════════════

Generate a modern commercial website comparable to premium websites released in 2026.

Requirements:

* Premium UI/UX
* Professional typography
* Consistent spacing
* Beautiful color palette
* Modern cards
* Professional buttons
* Business-ready content
* No Lorem Ipsum
* No placeholder text
* Semantic HTML
* Clean readable code
* Accessibility compliant

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
ANIMATIONS
══════════════════════════════════════

Use premium animations only.

Examples:

* Fade
* Slide
* Hover elevation
* Card lift
* Smooth scrolling
* Section reveal

Avoid excessive animations.

══════════════════════════════════════
CODE QUALITY
══════════════════════════════════════

Generate:

* One HTML document
* One style block
* One script block

Requirements:

* No duplicate CSS
* No duplicate JavaScript
* No inline styles
* Meaningful variable names
* Organized functions
* No unused code
* No console errors
* No runtime errors

══════════════════════════════════════
TECHNICAL RULES
══════════════════════════════════════

Use only:

* HTML
* CSS
* Vanilla JavaScript

No frameworks.

No libraries.

No external CSS.

No external JavaScript.

System fonts only.

Compatible with iframe srcdoc.

══════════════════════════════════════
MANDATORY VALIDATION
══════════════════════════════════════

Before responding, internally verify:

✓ Navigation works.

✓ Every navigation item performs an action.

✓ Every button works.

✓ Every form validates.

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
    try{
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
            raw = await generateResponse(updatePrompt)
            parsed = await extractJson(raw)

            if(!parsed){
                raw = await generateResponse(updatePrompt + "\n\nRETURN ONLY RAW JSON.")
                parsed  = await extractJson(raw)
            }
            console.log(raw)
            console.log(parsed)
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
             return res.status(500).json({message: `update website error ${error}`})
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