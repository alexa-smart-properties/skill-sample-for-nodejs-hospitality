# Alexa Smart Properties for Hospitality Sample code repo
<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/header._TTH_.png" />

This is a repo containing samples for [Alexa Smart Properties (ASP)](https://developer.amazon.com/en-US/alexa/alexa-smart-properties) for Hospitality usage. Please note that ASP skills are hidden from the public catalog by default, and can only be enabled on selected properties. To use these skill samples in an ASP organization, you are required to have an active ASP subscription, with properties and rooms (where the skill can be enabled).
You also MUST enable your Vendor ID for Name-Free Interactions (NFI). See the instructions below.
If you are looking for sample skills for the regular consumer version of Alexa, please refer to [Alexa Samples](https://github.com/alexa-samples) instead. 


## Contents
The contents of this repository is broken down into a few sub-folders.
### skill-sample-for-nodejs-hospitality-basic
This subfolder contains a basic skill sample that can be used to set up in an Alexa Smart Properties for Hospitality.  The experience is mostly voice only, with some visual images that are returned with voice responses when it makes sense.
### skill-sample-for-nodejs-hospitality-hotelrating
This subfolder contains a skill sample that implements rating solicitation from hotel guests.  The experience is fully multimodal, with voice and touch capabilities.  It also includes integration with AWS pinpoint for SMS texting to staff mobile number, and an example ASP Proactive Suggestion and Persistent Visual Alert API call that can be deployed to start the hotel rating experience.

For detailed explanation of each sample and set up instructions, please see the README.md file in each of the subfolders.