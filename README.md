# this.dev.blog / Bradley Caravana Portoflio

## This site's sole purpose is to be my portfolio of web development work while also being a spot to post blog posts on my own domain.

I set a goal for myself over the span of three months or so to start a blog from scratch. I had to learn the proper technologies in order to do so, which took some time. I didn't just want to make a blog on an already existing blog service, becauase where's the fun in that? I wanted something that I built from the groundup; it serves as a learning experience (I have to learn these technologies for my industry anyway) and something that fits into a portfolio quite nicely.

## The Stack

The technology stack used to create this blog was NodeJs, Express, MongoDB, and good ol' HTML & CSS.

## Why?

### The Old Site

The old website I had was starting to get a little dusty. Now don't get me wrong, it was recently built about 2 years ago, but I've grown a lot since then in my work. I'm capable of writing clean code and layouts that just make sense.

The code in my old site had a ton of unnecessary containers just to align elements properly, and it made me cringe every time I looked at it. The portfolio section was bland and didn't like to load very quickly, even though the images were correctly optimized for the web. **This was not sustainable**.

I wanted to completely overhaul the design, and add something great, like a blog. The code for this layout is super clean, readable, and sustainable. I'm really happy with how it turned out.

Also, **why not**! I wanted to make a blog because I like the idea of distributing information in this manner. I think it's a little more personal and opens the door to distribute other info, such as lifestyle, programming lessons, etc. Previously I was posting code snippets on my Instagram profile, which I still might do, but I think that dedicated blog for code snippets and other lessons is a better medium to distribute this information.

## Authentication Using JSON Web Tokens

This wasn't the original plan. I wanted to let users authenticate with Google using passport Google OAuth 2.0 under the hood, and at first, it worked great; only when running the site locally.

Once I made the original push to Heroku, it was completely busted. Google kept throwing a 500 'Internal Server Error' on the second half of the authentication process, where the user is redirected back to the site.

I searched the web for a solution, asked multiple programming discord/slack channels to no avail. I was very frustrated to say the least.

I rushed to re-write the authentication using JWT and custom login/registration forms, and it worked beautifuly. While I'm happy with the end product, I'd still like to know why that 500 error was being thrown every time. If you have any idea, let me know.

## Caveats

Like all projects, there are some drawbacks.

### Here's the Big One.

1. The site has no SSL. This is very problematic, as you can't just enter bradleycaravana(dot)com into a URL bar. You first have to type 'www.' with HTTP, rather than HTTPS.

   Some folks might be skeptical of creating an account on a site with no SSL Cert, but your passwords and emails are safe. I'm currently looking into purchasing an SSL or finding a work around, but if you have experience in this, any help would be greatly appreciated.

2. Each blogpost is written in markdown, which means if I want to add an image to a post that isn't the thumbnail image, I have to enclose the text in markdown syntax for images while also including the path to those images. This means whenever I make a post, I have to make sure I manually put all of those images for the post in the images folder in the project file.

   I'm overlooking this because it's just a minor inconvenience and really only takes about 30 seconds.

3. The error handling on this site isn't...polished. I basically extended the existing "Error" class in Javascript and added a custom message that sends back the status code associated with the error. There's around two custom pages that have to do with permissions, but that's about it.

   In the near future, I really want to crack down on the error handling and get a wicked system in place to let the user know what went wrong, instead of crashing the app and needing a refresh.

4. The Thumbnail uploader doesn't delete the previous thumbnail of a blog post if I edit it to be a new one. I couldn't figure out a script to add this functionality, but it's something I'm looking into currently.

   Without this script in place, the uploads folder can get a little out of hand very quickly if the old isn't being replaced with the new, and both the old & new are having a little party in the folder taking up a ton of space with their friends. What?? Yeah.

## What I'd Like to Add in the Future

1. An instagram scraper that grabs my three latest posts & stories and puts them in the footer. I'd rather not use the clunky Instagram/Facebook API, as they ask for a lot of info when registering your app.

2. Instead of manually placing my GitHub projects in the portfolio section, I'd like to use client-side Fetch to do this for me. I haven't really gotten around to making client-side and server-side Javascript play well, but it's on the bucket list.

### Aside from the drawbacks, I really love this site.

I built it. It's mine. Yeah, the code is open source, a lot of code was grabbed from courses I've taken and other blogposts that I've read, but my fingers/brain did a ton of the coding and logic; I couldn't be happier.

This beats having a blog hosted on another blogging website (you know the ones), because if something goes wrong, I can just hop under the hood and check it out.

Also, I know the only data being saved online is the data I put in this site. **Nothing else**.

## Feel Free to Clone This Repo and Check Out the Code

This is open source, because this project wouldn't be possible without open source resources I've found online. People like Wes Bos, Brad Traversy, and Kyle from Web Dev Simplified really made a difference on how this site turned out. Without them, I wouldn't be writing this READEME.

Download it, clone it, learn a thing or two (hopefully), and try not to make fun of me too much about the code that I think looks clean but you may think looks sloppy. It was fun to create, I'm happy, and those two things are all that matters.

## Socials

Find me on:

1. [Instagram](https://www.instagram.com/bradleycaravana/)
2. [Twitter](https://twitter.com/BradleyCaravana)
3. [Website](http://www.bradleycaravana.com)

Feel free to get into contact with me any time.
