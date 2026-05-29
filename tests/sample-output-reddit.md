# The Anti-YOLO Method: Why I make Claude draw ASCII art before writing code - How it make me ship faster, better, and with less tokens spent

**[Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-27 05:58 UTC

**\*\*\[UPDATE\]:\*\*** You all made this post special - thank you! Part 2 is live -[bettering our prompts](https://www.reddit.com/r/ClaudeAI/comments/1n1xhz2/the_ascii_method_improved_your_planning_this_gets/)

After months of trial and error, I've settled on a workflow that's completely changed how I build features with Claude. It's cut my token usage way down and basically eliminated those "wait, that's not what I meant" moments.

# The TL;DR Flow:

Brainstorm → ASCII Wireframe → Plan³ → Test → Ship

# 1\. Collaborative Brainstorming

Start by explaining the problem space, not the solution. I tell Claude:

-   Current UX pain points
    
-   What users have now vs. what they need
    
-   Context about the existing system
    

Then we go back and forth on ideas. This collaborative phase matters - Claude often suggests approaches I hadn't thought of.

# 2\. ASCII Wireframing (This is where it gets good)

Before writing any code, I ask Claude to create ASCII art wireframes.

Why this works so well:

-   Super quick iterations
    
-   Uses 10x fewer tokens than HTML prototypes
    
-   Forces focus on layout/flow, not colors/fonts
    
-   Dead simple to edit and discuss
    

I save these ASCII wireframes + decisions in markdown files. They become my single source of truth.

Real example from this week: ASCII wireframe for [Vibe-Logs](https://vibe-log.dev/)' Prompt Pattern Analyzer (basically helps you spot what makes your prompts work)

[![r/ClaudeAI - The Anti-YOLO Method: Why I make Claude draw ASCII art before writing code - How it make me ship faster, better, and with less tokens spent](https://preview.redd.it/the-anti-yolo-method-why-i-make-claude-draw-ascii-art-v0-w34seoa5bglf1.jpg?width=1167&format=pjpg&auto=webp&s=c56ae1aeae41b980606a0505fe422d660d3d310c)](https://preview.redd.it/the-anti-yolo-method-why-i-make-claude-draw-ascii-art-v0-w34seoa5bglf1.jpg?width=1167&format=pjpg&auto=webp&s=c56ae1aeae41b980606a0505fe422d660d3d310c "图像来自 r/ClaudeAI - The Anti-YOLO Method: Why I make Claude draw ASCII art before writing code - How it make me ship faster, better, and with less tokens spent")

# 3\. Plan Until It Hurts

Shift + Tab x2 → Plan mode → @ tag the brainstorming file

Ask Claude to review the codebase and create a full plan covering:

-   Backend architecture
    
-   Database considerations
    
-   UI - matching existing styles + Friendly Id names for components and sub-components
    
-   Security implications
    
-   Testing strategy
    

Here's the thing: Ask Claude to ask YOU clarifying questions first. The questions it asks often expose assumptions you didn't realize you were making.

Seriously: Read the plan twice. If you change nothing, you're probably missing something.

# 4\. Test Before You Celebrate

With the implementation done, I have Claude write comprehensive tests:

-   Unit tests for the business logic
    
-   Integration tests for API endpoints
    
-   Component tests for UI behavior
    
-   Edge cases from our original brainstorm
    

\*Don't trust the auto-generated test and make sure to test everything manually, also check data integrity against the DB.

The ASCII wireframe becomes the test spec - if it's in the wireframe, it gets tested.

# 5\. Ship with Confidence

Now the implementation phase becomes surprisingly smooth. Claude has everything it needs to build exactly what you had in mind, and you know it works because you've tested it properly.

[![r/ClaudeAI - The Anti-YOLO Method: Why I make Claude draw ASCII art before writing code - How it make me ship faster, better, and with less tokens spent](https://preview.redd.it/the-anti-yolo-method-why-i-make-claude-draw-ascii-art-v0-bdwfyja6fglf1.png?width=1230&format=png&auto=webp&s=27aad41c801458f601e3a026b2f6c7d8d3dc45e8)](https://preview.redd.it/the-anti-yolo-method-why-i-make-claude-draw-ascii-art-v0-bdwfyja6fglf1.png?width=1230&format=png&auto=webp&s=27aad41c801458f601e3a026b2f6c7d8d3dc45e8 "图像来自 r/ClaudeAI - The Anti-YOLO Method: Why I make Claude draw ASCII art before writing code - How it make me ship faster, better, and with less tokens spent")

# What I've noticed:

-   Less "close but not quite" moments - > Way fewer iterations needed
    
-   Cleaner code on first pass
    
-   Features that actually ship (and don't break)
    
-   Way less debugging in production
    

Would love to hear if anyone else is using ASCII wireframing or similar techniques. What's working in your Claude workflow?

---

## Comments (118)

**[ClaudeAI-mod-bot](https://www.reddit.com/user/ClaudeAI-mod-bot)** · 2025-08-27 06:00 UTC · 1 pts

**If this post is showcasing a project you built with Claude, consider entering it into the** [r/ClaudeAI](/r/ClaudeAI/) **contest by changing the post flair to Built with Claude.** More info: [https://www.reddit.com/r/ClaudeAI/comments/1muwro0/built\_with\_claude\_contest\_from\_anthropic/](https://www.reddit.com/r/ClaudeAI/comments/1muwro0/built_with_claude_contest_from_anthropic/)

**[yopla](https://www.reddit.com/user/yopla)** · 2025-08-27 07:30 UTC · 35 pts

Planning and documentation is the key. I'll try to add more wireframe to see if that helps but I find them cumbersome to use and they do waste a lot of tokens.

Anyway Oblig: "You're absolutely right, it's ready to ship"

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-27 07:46 UTC · 6 pts
> 
> Heheh let us know how does it work for you!

> **[↳ kexnyc](https://www.reddit.com/user/kexnyc)** · 2025-08-27 22:40 UTC · 6 pts
> 
> There's a common misconception that developers write code all day every day. 80% of the work I do daily is planning. The other 20% is reporting analysis to stakeholders and then coding the tasks broken out from the plan.
> 
> IMO, folks don't spend nearly enough time methodically planning their work. They just want to dive in and implement. Y'know, just like claude-code does. Now we know where it gets that annoying behavior.

> > **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-28 10:38 UTC · 0 pts
> > 
> > You are correct this phenomena also intensified when coding is also done by prompting, this is why we created the status line coach that help you be more mindful.
> > 
> > [https://www.reddit.com/r/ClaudeAI/s/7Ifm1NqKxC](https://www.reddit.com/r/ClaudeAI/s/7Ifm1NqKxC)

**[DarkEye1234](https://www.reddit.com/user/DarkEye1234)** · 2025-08-27 07:42 UTC · 12 pts

From my experience writing pure text for llm works best. Ascii is benefit for you, not llm. Wherever I tried ASCII or state machine expressions it was not following majority of the flow.

After many iterations a went back to pure text and llm was much better in following the plan or CLAUDE.md

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-27 08:48 UTC · 2 pts
> 
> Hi thank you for the input! When did you last try it ? My screenshots and experience tell otherwise Claude gave me this UI on first try!

> > **[↳ DarkEye1234](https://www.reddit.com/user/DarkEye1234)** · 2025-08-27 10:29 UTC · 5 pts
> > 
> > Not saying you shouldn't do that, I just added my observations.
> > 
> > LLM can't visualise, so for it it is just a set of characters without meaning. Imagine the picture as lines full of characters (as even space or new line are characters)
> > 
> > I was using state machine diagrams and ascii for claude code self review process and I noticed big drop in instructions followings I tweaked that for multiple days and then just switched to text again. Quality went over the roof. I tried that during June when I was preparing white paper for my team

> > > **[↳ amnesia0287](https://www.reddit.com/user/amnesia0287)** · 2025-08-27 21:45 UTC · 5 pts
> > > 
> > > Tell it to make mermaid charts instead of ascii. Then it’s parsable and doesn’t waste all the tokens on ui elements.

> > > **[↳ Brave-History-6502](https://www.reddit.com/user/Brave-History-6502)** · 2025-08-28 03:17 UTC · 2 pts
> > > 
> > > Yeah I agree with this. These pattern/concept is also likely not widely in its training data.

> > > > **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-28 10:19 UTC · 2 pts
> > > > 
> > > > Hi just wanted to jump in said that I agree for diagrams describing flow and architecture there is no use of creating an ascii art. but for UI prototyping ascii it still makes a lot of sense to me compared to the alternatives do let me know if I missed something!
> > > > 
> > > > Also in my 2nd post I present a system for better prompting skills would love to get your educated voices heard over there as well!
> > > > 
> > > > [https://www.reddit.com/r/ClaudeAI/s/7Ifm1NqKxC](https://www.reddit.com/r/ClaudeAI/s/7Ifm1NqKxC)

**[alexanderriccio](https://www.reddit.com/user/alexanderriccio)** · 2025-08-27 06:14 UTC · 13 pts

Step #1 and step #3 are steps I can endorse - they work incredibly well.

But ascii wireframing?! That's nuts! It's amazing it works.

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-27 06:23 UTC · 5 pts
> 
> Yes I was shocked the from the results first time I have asked for it as well!

> > **[↳ AI\_is\_the\_rake](https://www.reddit.com/user/AI_is_the_rake)** · 2025-08-27 06:43 UTC · 4 pts
> > 
> > I did this for a project as well and it worked out well. Thanks for reminding me! I need to make this a regular part of my workflow.

> > > **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-27 06:46 UTC · 1 pts
> > > 
> > > Happy to hear that! This definitely part of my cookbook!

> > **[↳ kexnyc](https://www.reddit.com/user/kexnyc)** · 2025-08-27 22:43 UTC · 2 pts
> > 
> > Just today, when I said i didn't want to waste time creating formal wireframes in Figma (or whatever), it said it could do ascii wireframes. I said, "oh really?". Do it. And it did. All my initial UI components framed out in seconds exactly to spec. <chef kiss>

> > **[↳ alexanderriccio](https://www.reddit.com/user/alexanderriccio)** · 2025-08-27 06:58 UTC · 4 pts
> > 
> > One of the things that very few people seem to understand about using LLMs for practical tasks is that you shouldn't actually assume by default that you know better than the model, especially not in ALL cases. If you only ever give them narrow, extremely explicit, and rote mechanical, instructions, then you neuter much of the benefit of using an LLM.
> > 
> > Sometimes, surprisingly often, the model will come up with a solution that works for itself far better than you would expect, in ways you'd never ever expect. This happened for me recently when I was hacking together some really primitive bootleg simulacrum of RAG:
> > 
> > [https://x.com/ariccio/status/1959003667190923317](https://x.com/ariccio/status/1959003667190923317)
> > 
> > My first reaction to that was - WTF - then second, asking it essentially wtf, how could it work?! It's so bizarre and unexpected that it's kinda scary. It feels like the AI is getting ahead of me, a bit like skynet. Which is fitting, since I've been including variations of "benevolent self-improving skynet" in my instructions for a while.
> > 
> > And you know what? It's actually been _working_. It's non-deterministic, which can be irritating and I'm convinced would make many programmers give up on the approach... But I'm _not_ convinced that our programmer instincts for repeatable and reliable execution are the right model here.
> > 
> > It's the same as the general problem statement of artificial intelligence as a whole! Unlike machine code, we (in all practical senses) do not know a priori the general "problem" form or the problem solving workflow that will work for that unknowable problem form. When we introduce our beliefs and expectations about how the model reasons and how it might _best_ behave into our prompts, we risk unwittingly inducing very strong biases into the space of available problem solving strategies and narrow the creativity with which it will explore them.
> > 
> > What I've gotten very good at - partly because I've always had this exact insane style when writing anything critical for decades now - is VERY carefully and intentionally couching my prompts. It's a very delicate balancing act that I desperately wish I knew how to quantify and test formally: we want to provide as much useful context as possible, without, giving it directions that confine it problematically, all the while trying to nudge (ahem, prompt) the model to sometimes do things in a way that we expect works best. Since grammar and "nice" sentence structure only somewhat matter, I end up with prompts that often have the same level of awkward run on sentences and annoying number of classes as you see in this paragraph... And the results are phenomenal!
> > 
> > What you discovered is very much the same thing. The model is apparently using ascii art as a kind of visuospatial sketchpad which is _of course_ a vastly more efficient pseudo-neural architecture than going through the intermediary of prose and html. Strangely obvious in retrospect, but I don't think _any_ of us would have guessed it beforehand.
> > 
> > Beautiful.

> > > **[↳ ExistingCard9621](https://www.reddit.com/user/ExistingCard9621)** · 2025-08-27 10:59 UTC · 2 pts
> > > 
> > > Well... "any"... I have been asking AIs to generate ASCII art like this for months, and I am pretty sure I am not alone. It's quite obvious (or at least I thought it was).

> > > **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-27 07:24 UTC · 1 pts
> > > 
> > > Wow thank you for the response! I guess there are a lot of research groups right now trying to quantify and methodize how to prompt better, but it is they are dealing with a moving target because models change rapidly.
> > > 
> > > ,

> > > **[↳ fafnir665](https://www.reddit.com/user/fafnir665)** · 2025-08-27 11:17 UTC · 1 pts
> > > 
> > > Are you going to publish a repo with this framework? I’d be interested in trying it out, if not public, I have some I could swap with you, like a sequential thinking upgrade that produces branching tree plans

> > > **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-28 10:26 UTC · 1 pts
> > > 
> > > As someone with vast experience in prompting I would love to get your thoughts on the tools we offer for better prompting.
> > > 
> > > [https://www.reddit.com/r/ClaudeAI/s/7Ifm1NqKxC](https://www.reddit.com/r/ClaudeAI/s/7Ifm1NqKxC)

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-27 06:26 UTC · 2 pts
> 
> I’m glad that you already gave it a spin !!

> > **[↳ alexanderriccio](https://www.reddit.com/user/alexanderriccio)** · 2025-08-27 06:27 UTC · 1 pts
> > 
> > Heh, I mean, I've been doing them for a month on my own 😏

> > > **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-27 06:31 UTC · 2 pts
> > > 
> > > Hehehe, what other secrets are you holding from us? Sharing is caring!

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-27 08:57 UTC · 2 pts
> 
> Would love to hear how do did it go using Mermaid will your report back ?

> > **[↳ ShuckForJustice](https://www.reddit.com/user/ShuckForJustice)** · 2025-08-27 21:22 UTC · 4 pts
> > 
> > Hey just wanna let you know the mermaid diagrams are really easy for the agent to read, fewer tokens, and render beautifully in markdown on GitHub, I've been using them exclusively

> **[↳ jwikstrom](https://www.reddit.com/user/jwikstrom)** · 2025-08-27 18:40 UTC · 2 pts
> 
> I have been using mermaid for a while now. I completely recommend this. It is one of the most succinct ways to model software and is very token friendly.

**[Intyub](https://www.reddit.com/user/Intyub)** · 2025-08-27 06:10 UTC · 4 pts

what do you actually say to get that ASCII wireframing method going?, just a simple make a "ASCII wireframe of the interface we discussed"?

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-27 06:13 UTC · 4 pts
> 
> Yep!

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-28 10:28 UTC · 1 pts
> 
> But maybe it is not enough, here is how I level up my skills and optimize my prompts
> 
> [https://www.reddit.com/r/ClaudeAI/s/7Ifm1NqKxC](https://www.reddit.com/r/ClaudeAI/s/7Ifm1NqKxC)

**[Otje89](https://www.reddit.com/user/Otje89)** · 2025-08-27 10:30 UTC · 3 pts

I’ve been using ASCII wire framing for some time now and it is really helpful. I quite often ask I to draw multiple options, what are the pros and cons of each option and ask for its recommendation including arguments.

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-27 10:33 UTC · 2 pts
> 
> Niceee

**[AppealSame4367](https://www.reddit.com/user/AppealSame4367)** · 2025-08-27 11:50 UTC · 3 pts

This is the first of these posts in months where i think: Wow, that sounds like fun.

Thank you

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-27 12:47 UTC · 1 pts
> 
> Thank you! Making it fun is super important! We are going to release a new post soon with a feature that is going to change the way you Clauding in a very playful way

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-28 10:29 UTC · 1 pts
> 
> Here is what I have been talking about
> 
> [https://www.reddit.com/r/ClaudeAI/s/7Ifm1NqKxC](https://www.reddit.com/r/ClaudeAI/s/7Ifm1NqKxC)

**[KloudKorner](https://www.reddit.com/user/KloudKorner)** · 2025-08-27 06:32 UTC · 2 pts

uuh interesting I will try that. Thank you for sharing.

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-27 06:38 UTC · 2 pts
> 
> I'm doing it with great love.
> 
> This community gave me so much when I was just getting started, I feel obliged to share any meaningful insight I find.
> 
> Will you report back and tell us how did it go ?

> > **[↳ KloudKorner](https://www.reddit.com/user/KloudKorner)** · 2025-08-27 07:44 UTC · 2 pts
> > 
> > will do

**[waterytartwithasword](https://www.reddit.com/user/waterytartwithasword)** · 2025-08-27 06:50 UTC · 2 pts

Following! Great tip!

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-27 07:25 UTC · 2 pts
> 
> Please report back once you try it, would love to hear if there's something that can be improved :)

**[oneshotmind](https://www.reddit.com/user/oneshotmind)** · 2025-08-27 06:53 UTC · 2 pts

You’re absolutely right!. Even I can vouch for the ascii wire framing. Worked really well for me in the past.

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-27 07:25 UTC · 1 pts
> 
> Nice! What did you ship?

> > **[↳ oneshotmind](https://www.reddit.com/user/oneshotmind)** · 2025-08-27 12:06 UTC · 2 pts
> > 
> > Nothing open source yet. Used it for work

**[designxtek9](https://www.reddit.com/user/designxtek9)** · 2025-08-27 07:31 UTC · 2 pts

I use ascii sequence diagrams. This way I can see what the high level implementation looks like. I also ask it to diagram current architecture and proposed changes. If it is complex then I have it create a markdown todo list. Implement in phases where it is testable.

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-27 07:48 UTC · 2 pts
> 
> This is also an excellent tip!!!

**[swizzlewizzle](https://www.reddit.com/user/swizzlewizzle)** · 2025-08-27 09:58 UTC · 2 pts

You should add some thoughts on running parallel instances of Claude while making sure it doesn’t cross-code and uses/shares info between multiple master agents - that would also be super helpful

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-27 10:04 UTC · 1 pts
> 
> I would if these thoughts were running through my head 😂 Maybe you could teach us a few things?

> > **[↳ swizzlewizzle](https://www.reddit.com/user/swizzlewizzle)** · 2025-09-01 05:00 UTC · 2 pts
> > 
> > Probably couldn’t teach anything, but I do find having a central context.md document that agents can refer to helps keep them up to date with what is being worked on when being done in parallel.

**[RiskyBizz216](https://www.reddit.com/user/RiskyBizz216)** · 2025-08-27 10:41 UTC · 2 pts

why not ask him to create a "final product mockup or prototype" instead?

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-27 10:47 UTC · 1 pts
> 
> This vague. it might create things you don’t want to get in high fidelity in a format or coding framework you don’t use, you waste more tokens.

> > **[↳ RiskyBizz216](https://www.reddit.com/user/RiskyBizz216)** · 2025-08-27 11:31 UTC · 1 pts
> > 
> > True, but like you said "Claude often suggests approaches I hadn't thought of" so you may also see something in a prototype you hadn't thought of.
> > 
> > Also, I thought that was why you brainstormed beforehand, to hone in on technologies?

> > > **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-27 12:43 UTC · 1 pts
> > > 
> > > Yeah but being vague on the format will cause you to waste time & tokens in the long run.

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-28 10:49 UTC · 1 pts
> 
> You might find value in my 2nd post
> 
> [https://www.reddit.com/r/ClaudeAI/s/7Ifm1NqKxC](https://www.reddit.com/r/ClaudeAI/s/7Ifm1NqKxC)

**[stumpyinc](https://www.reddit.com/user/stumpyinc)** · 2025-08-27 11:27 UTC · 2 pts

To be fair this just sounds like the normal development cycle so that makes sense! If I could just get Claude to design in figma first I'd be very happy with that, but the figma official mcp is read only :(

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-27 11:44 UTC · 1 pts
> 
> Yep but not everybody here start with the same level of experience in SW development or knows that you can wireframe with Claude Code

**[Cool-Cicada9228](https://www.reddit.com/user/Cool-Cicada9228)** · 2025-08-27 11:45 UTC · 2 pts

I create wireframes because Claude’s multimodal capabilities allow it to understand and interpret visual designs directly. This eliminates the need for multiple iterations just to convey the UI concept.

You make an excellent point about iteration, though: Claude performs best with short feedback loops, especially when they can be automated. A perfect example would be instructing Claude to capture screenshots of the UI it generates, allowing it to evaluate and refine its own work based on the visual output.​​​​​​​​​​​​​​​​

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-27 12:10 UTC · 1 pts
> 
> yep, also think of all these wasted tokens sending back screenshots when you just wanted to move a text element to the other side of the component..

**[visa\_co\_pilot](https://www.reddit.com/user/visa_co_pilot)** · 2025-08-27 17:49 UTC · 2 pts

Love this structured approach! I've found that starting with a conversational PRD (Product Requirements Document) before the ASCII wireframing phase helps ensure you're solving the right problem. The combination of clear requirements → ASCII wireframes → implementation has been game-changing for my product development workflow.

The beauty of your ASCII method is that it forces you to think through the structure before jumping to code. I do something similar in the requirements phase - having AI help me interview myself about the product concept until all the edge cases and user flows are crystal clear.

Have you noticed that projects with this kind of upfront structure tend to need fewer major refactors later?

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-27 22:24 UTC · 1 pts
> 
> 100%
> 
> I see they need less debugging and refactoring.

**[BidGrand4668](https://www.reddit.com/user/BidGrand4668)** · 2025-08-27 19:02 UTC · 2 pts

Do you find yourself asking Claude to always create the output in this format? Or are you using the output style slash command? If it’s the former I’d recommend implementing the latter :). Great post btw! I personally use yml output style. LLMs generally understand that format quite well (and json too). It’s my day-to-day choice and find that its accuracy has improved since changing to that style.

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-27 22:39 UTC · 1 pts
> 
> Depended on the task size…

**[Designer-Knowledge63](https://www.reddit.com/user/Designer-Knowledge63)** · 2025-08-27 19:24 UTC · 2 pts

Such a good idea, going to try this, thanks.

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-27 22:18 UTC · 1 pts
> 
> Sure thing! Please do come back here and tell us how it went :)

**[dyatlovcomrade](https://www.reddit.com/user/dyatlovcomrade)** · 2025-08-27 20:39 UTC · 2 pts

This post is brought you by the ASCII wire framing gang

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-27 22:16 UTC · 1 pts
> 
> LoL

**[enigmae](https://www.reddit.com/user/enigmae)** · 2025-08-27 22:36 UTC · 2 pts

I still find xml is the king- running evaluations of prompts xml format seems to always deliver better value per token- I use the AI to get write the xml prompts as well- it almost seems like it’s the native language for it-

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-27 22:40 UTC · 1 pts
> 
> Thanks for sharing !!! Will try this at home ;)

> > **[↳ enigmae](https://www.reddit.com/user/enigmae)** · 2025-08-27 22:53 UTC · 2 pts
> > 
> > Here is a reference from anthropic [https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags)

> > > **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-28 07:43 UTC · 1 pts
> > > 
> > > Completely agree, using best practices is key! But, Remembering to do it is hard!! You can view our proposed solution in my 2nd post
> > > 
> > > [https://www.reddit.com/r/ClaudeAI/s/kpV0a3pVsN](https://www.reddit.com/r/ClaudeAI/s/kpV0a3pVsN)

**[Can\_I\_be\_serious](https://www.reddit.com/user/Can_I_be_serious)** · 2025-08-28 01:38 UTC · 2 pts

Are you conducting this as a single, ongoing conversation that gets condensed, or do you clear and start again after each phase?

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-28 03:42 UTC · 1 pts
> 
> Great question! Depends on the feature size I do /context and if I go above 50% I will probably just open a new chat.

**[Overall\_Ad\_2067](https://www.reddit.com/user/Overall_Ad_2067)** · 2025-08-28 01:38 UTC · 2 pts

This is gold! Thanks for sharing!

**[jiiins](https://www.reddit.com/user/jiiins)** · 2025-08-28 04:21 UTC · 2 pts

+1 ask me for clarification

It’s been a real game changer for me

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-28 05:43 UTC · 1 pts
> 
> See my 2nd post let me know if it moves your needle as well.

**[Mikky48](https://www.reddit.com/user/Mikky48)** · 2025-08-28 09:19 UTC · 2 pts

We're going back to the basics to go forward, finally )

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-28 10:49 UTC · 1 pts
> 
> Exactly!!!!

**[ziurnauj](https://www.reddit.com/user/ziurnauj)** · 2025-08-28 16:58 UTC · 2 pts

have you done this for software architecture? i keep getting stuck with the overall structure of the app after a certain point of complexity. claude gets stuck between alternative ways of doing things that are mutually incompatible

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-28 19:54 UTC · 1 pts
> 
> Not really I also find ascii to not work as well for drawing architecture a lot of other comments recommended mermaid.

> **[↳ DazzlingTagliatelle](https://www.reddit.com/user/DazzlingTagliatelle)** · 2025-09-04 18:36 UTC · 1 pts
> 
> ASCII works well for me in architecture diagrams, but I focus and zoom in on specific components and things I want to illustrate, rather than trying to capture everything at once.
> 
> I wouldn't create a giant diagram with all the detailed stuff in ASCII - that really doesn't work well. But honestly, I don't like those giant architecture diagrams with overwhelming details and hard-to-trace connections in any format anyway.
> 
> Instead, I keep the overall flow diagram intentionally short, succinct, and high-level. Then if I need to show how several specific components work together, that becomes a separate diagram.
> 
> The real power is having the ability to zoom in and out of levels of abstraction. Code is the lowest level, but you can summarize it higher and higher - it's like having a tool that lets you zoom in on the meaning of any text or code.

**[DazzlingTagliatelle](https://www.reddit.com/user/DazzlingTagliatelle)** · 2025-09-04 16:36 UTC · 2 pts

I've been doing this for a long time, and it has been working well for me. Thought I was the only one doing it, but looks like there's a few of us out there.

AI is really good at writing and understanding ASCII, humans are bad at writing it but it's super easy to edit small bits of it for us or tell AI to do it. And the benefit of staying in ASCII is that it doesn't take me away from CC into another tool, I can stay in text all this time.

My architecture diagrams are mostly ASCII in markdown together with short architecture descriptions. Keeping those succinct is what makes them work really well, and ASCII helps me to see important bits at a glance.

I've been prototyping like you're showing here as well, and I've even taken notes in a workshop in ASCII using LLM, wanted to see if I can take those fancy drawing lecture notes but in ASCII. Totally can :)

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-09-04 19:41 UTC · 2 pts
> 
> 🤯 Wish I had these kind of technologies as a student!

> > **[↳ DazzlingTagliatelle](https://www.reddit.com/user/DazzlingTagliatelle)** · 2025-09-04 19:43 UTC · 2 pts
> > 
> > 100%
> > 
> > It's so easy to drop into any codebase nowadays and say "go understand how this is done and show me architecture on higher level in ASCII, keep it very short and high level", and bam, you have a genuine understanding of what's in front of you without having to look at details.
> > 
> > And same with any text. Give me the gist of it, draw, I don't understand this bit, explain, ok redraw differently... something impossible before.

**[tranqy](https://www.reddit.com/user/tranqy)** · 2025-10-29 11:29 UTC · 2 pts

For anyone that is interested, we recently released a set of open source Claude Skills to do exactly this, design components and screens in ascii. Check out the post over here, or directly at [www.fluxwing.com](http://www.fluxwing.com) ..

[https://www.reddit.com/r/ClaudeAI/comments/1oh01tt/fluxwing\_claude\_skills\_for\_asciifirst\_ux\_design/](https://www.reddit.com/r/ClaudeAI/comments/1oh01tt/fluxwing_claude_skills_for_asciifirst_ux_design/)

**[AfternoonShot9285](https://www.reddit.com/user/AfternoonShot9285)** · 2025-08-28 01:18 UTC · 1 pts

Whatever the ex0lanati9n is, Use capitalized w9rds in claude.md For instance we will make THIS editor.

we will build THIS project.

Maybe just use capitalized THIS.

I think that's all.

**[Socratesticles\_](https://www.reddit.com/user/Socratesticles_)** · 2025-08-27 06:15 UTC · 1 pts

Can you be more specific?

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-27 06:25 UTC · 8 pts
> 
> I can but is there any specific part you want me to be more specific about?

> > **[↳ AI\_is\_the\_rake](https://www.reddit.com/user/AI_is_the_rake)** · 2025-08-27 06:41 UTC · 7 pts
> > 
> > Specifically be specific about what specific types of parts you need to be more specific in your specific workflow.

> > > **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-27 06:43 UTC · 16 pts
> > > 
> > > You are absolutely right! Let me create a comprehensive documentation on the specific workflow you are referring to.

**[Shmumic](https://www.reddit.com/user/Shmumic)** · 2025-08-27 06:30 UTC · 1 pts

Wow 😮 Im glad that I saw it now was just about to start working on a new feature!

BTW what are you building? your UI got me intrigued 🤔

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-27 06:37 UTC · 2 pts
> 
> We are working on the open-source lovechild of Doulingo and Strava for vibe coders, it helps you track, analyze, and improve your vibe-coding journey!
> 
> **If you want to get started**: npx vibe-log-clli@latest
> 
> **Github:** [**https://github.com/vibe-log/vibe-log-cli**](https://github.com/vibe-log/vibe-log-cli)
> 
> **Website:** [vib-log.dev](http://vib-log.dev)
> 
> The UI I have shared in the post is going to be shipped in a few hours!

**[amnesia0287](https://www.reddit.com/user/amnesia0287)** · 2025-08-27 21:44 UTC · 0 pts

Using ascii is inefficient. It natively talks in markdown lol. Every single | and like all the ui elements like the parts of the graph are tokens. There is no reason to not just have it write markdown docs lol.

> **[↳ Big\_Status\_2433](https://www.reddit.com/user/Big_Status_2433)** · 2025-08-27 22:21 UTC · 2 pts
> 
> Not sure I understood you, so how do you visualize what you want to see in the GUI before it's implemented?

> > **[↳ amnesia0287](https://www.reddit.com/user/amnesia0287)** · 2025-08-27 22:44 UTC · 1 pts
> > 
> > In vscode you can just preview the pd file, and there are extensions for mermaid charts. Or you push to GitHub/ado/etc and then you can read the Md files in the repo browser or even setup a wiki.