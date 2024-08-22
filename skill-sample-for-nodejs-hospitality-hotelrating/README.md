
# Build An Alexa Smart Properties Skill

<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/header._TTH_.png"  />


This is a sample Alexa skill for [Alexa Smart Properties (ASP)](https://developer.amazon.com/en-US/alexa/alexa-smart-properties). ASP skills are hidden from the public catalog by default, and can only be enabled on selected properties. To use this skill in an ASP organization, an active ASP subscription is required, with properties and rooms created (where the skill can be enabled).

You also can optionally enable your skill development Vendor ID for ASP to get access to features such as Name-free skill interaction (NFI) and persistent unit id (PUID) access. See the instructions below.

If you are looking for sample skills for the regular consumer version of Alexa, please refer to [Alexa Samples](https://github.com/alexa-samples) instead.

This skill is an example implementation for soliciting real time user feedback and ratings using your deployed Alexa Smart Properties multimodal devices such as Echo Show 8. The feedback is usually solicited by using either a proactive suggestion campaign (https://developer.amazon.com/en-US/docs/alexa/alexa-smart-properties/proactive-suggestion-api.html#create-campaign), or a persistent visual alert (https://developer.amazon.com/en-US/docs/alexa/alexa-smart-properties/notifications-api.html#send-notifications) which triggers an Alexa custom skill experience. Examples of how to use these features, as well as the Alexa custom skill experience that supplies the rating voice and touch experience are all provided in this sample.


## Contents

The contents of this repository is broken down into a few sub-folders.

### Skill-package

This is a copy the sample skill's interaction model and metadata. The skill's metadata is defined in '**skill.json**' file, the interaction model (the voice input utterances that the skill supports) are located in '**interactionModels/custom/en-US.json'**. The skill sample also have a skill connection task defined that is invoked by the persistent visual alert that is defined in the '**./tasks/rating.1.json**' file.

### Lambda

This is the backend of the sample skill. It defines how questions how handled on the server-side. This sample uses Node.js runtime and would be hosted on AWS Lambda. However, you have the flexibility to decide where your backend will be hosted, and what programming language to code it with.  Parts of the backend Lambda code requires you to supply your own values, such as, a cell number capable of receiving SMS text messages.

### Multimodalcontent

The entry point into the rating experience is through interacting with a proactive suggestions campaign card, or through interacting with a persistent visual alert. This folder contains a POSTMAN (https://www.postman.com/) collection which includes an example for how to create either a proactive suggestion or persistent visual alert using Alexa Smart Properties management APIs. Instructions on how to set this up are included below.

### Assets

The proactive suggestion, persistent visual alerts, and the custom skill all use visual assets (such as background images). Examples of these are located in this folder. These images are provided for your reference, and the sample references a copy of these files hosted online.

  

## Sample Setup Instructions

Follow the recommended steps below to setup, host and configure this sample.

  

### Prerequisites:

 - If you do not have one already, create a free Amazon developer account at https://developer.amazon.com.

 - If you do not have one already, create a free Amazon Web Services account at https://aws.amazon.com.

 - If you want to run this sample on an Alexa Smart Properties managed device, using proactive suggestion/persistent visual alert, you need to have a working Alexa Smart Properties organization setup. If you don't have access to Alexa Smart Properties, follow the steps located at https://developer.amazon.com/en-US/docs/alexa/alexa-smart-properties/get-started.html to obtain access and set up Alexa Smart Properties.

 - Configure Alexa Skills Kit Command Line interface (ASK CLI): https://developer.amazon.com/en-US/docs/alexa/smapi/quick-start-alexa-skills-kit-command-line-interface.html. Follow and perform steps 1-3 to set up ASK CLI, as well as create/configure an AWS profile to use with the ASK CLI. Ensure you have run the 'ask configure' command in your terminal/PowerShell window and configured both ASK and AWS profiles. Note down the name of the ASK profile for later use.

 - Verify ASK and AWS profiles are setup, in a terminal (or PowerShell for Windows) window, type the following commands

    cat ~/.ask/cli_config (you should see on the screen a list of configured profiles for ASK CLI) 
    cat ~/.aws/credentials (you should see on the screen a list of configured profiles for AWS CLI)

 - Verify ASK vendor account access through the ASK CLI by listing skills available for the ask profile by typing in the following command in a terminal/PowerShell window:

    ask smapi list-skills-for-vendor [-p <ask_profile>]

 - Clone the GitHub sample to the local workspace on your computer.

### Step 1: Initialize the skill sample for deployment

Use [ASK CLI commands](https://developer.amazon.com/en-US/docs/alexa/smapi/ask-cli-command-reference.html) to perform initialization for the skill sample.
By the end of this step, your skill should be initialized and ready to be deployed to your skill developer account with the ASK CLI. A file named ask-resources.json will be generated in the root folder of your skill sample.
   

 - In a terminal/PowerShell window, if needed, change directory to the workspace folder where the skill sample is located in. This should be the folder/directory that contains this README.md file, along with other sub folders such as assets/lambda/skill-package etc. Once in the root folder/directory of the skill sample, run the following command:

    ask init [-p <ask_profile]

 - When prompted for the skill id, leave it empty so a new one will be created and press return
   
 - Accept the default value for the skill package path (./skill-package) and press return
  
 - Accept the default value for the Lambda code path for default region (./lambda) and press return
  
 - Choose yes or no to deploy Lambda using AWS CloudFormation, the sample's Lambda can be deployed with or without Cloudformation successfully.
   
 - Accept the default runtime (nodejs*.x) and press return
   
 - Accept the default Lambda handler (index.handler) and press return
   
 - Select 'Y' (default) when asked if the generated ask-resources.json is correct and press return

### Step 2: Set up AWS Pinpoint

The skill sample uses AWS Pinpoint to send SMS text messages when guest rating is unsatisfactory.  To enable this part of the sample to work, you will need to set up an AWS Pinpoint project for this to work.  Follow the steps outlined in this guide to set it up (https://docs.aws.amazon.com/pinpoint/latest/userguide/channels-sms-setup.html).  Note there is nominal price required to send SMS messages - please refer to this page for more information https://aws.amazon.com/pinpoint/pricing/

- Once when you have configured your AWS Pinpoint SMS channel so that you can send text messages through your Pinpoint project.  Navigate to the AWS Pinpoint project list.  Identify the AWS project you setup, and Write down the project ID listed.
- From the root directory of the sample download, open './lambda/sms.js' in a text editor
- Near the top of the source code file, you should see this line:
   const applicationId = "INSERT YOUR OWN PINPOINT PROJECT ID HERE"
- Put your AWS Pinpoint project ID in the quotation mark and save the file.
- Open **./lambda/index.js** - in a text editor
- Nar the top of the source code file, you should see this line:
   const staffSMSNumber = 'INSERT A VALID MOBILE NUMBER YOU WANT TO SEND SMS MESSAGE TO';     
- Put a valid mobile number that can accept SMS Messages between the quotation park and save the file. For the US, make sure to add +1 at the beginning followed by area code and the phone number.  In a production hotel, this should be set to the staff's mobile number so they can receive the rating message.


### Step 3: Deploy skill

Use [ASK CLI commands](https://developer.amazon.com/en-US/docs/alexa/smapi/ask-cli-command-reference.html) to deploy your new skill to your developer portal account.

By the end of this Step, you would have a skill created under your developer.amazon.com account and see this message:  Skill package deployed and all models built successfully.

 - In the terminal/PowerShell window, from the root folder of the downloaded sample, type the following to deploy the skill:

    ask deploy [-p <ask_profile>]

 >Note: At this point skill is created and respective skill package and lambda function are deployed to your account. Verify if you see the new skill with the name '**Rate my stay**' on developer portal (https://developer.amazon.com/alexa/console/ask) and respective lambda function that starts with name (**ask-Ratemystay-default-skillsta-AlexaskillFunction-XXXX**) in your associated AWS account (https://us-east-1.console.aws.amazon.com/lambda).

 - Note down the skill id of the deployed 'Rate My Stay' skill later for step 4.

 NOTE: if you are using Microsoft windows, there is an issue with ASK CLI running on Windows where the produced Lambda code package won't have its dependency working properly.  To work around this, please do the following:

- Open an explorer window, navigate to the root folder of the downloaded sample that you deployed.
- navigate into the .ask folder, and then navigate into the lambda folder, now delete build.zip that is in the folder
- select all of the files that are in the lambda folder, right click in the window and select 'Compress to zip file'
- in a web browser, navigate to aws.amazon.com, then, log into your AWS account
- search for Lambda in the services search box, and click the found 'Lambda' result to go to the Lambda functions dashboard
- find the generated Lambda function for the deployed skill (in the format ask-ratemystay-default-default-XXXX) and click to view the settings
- click 'Upload from' drop down on the right, and select '.Zip file', in the dialog that shows up, click 'Upload', and select the compressed zip file you generated in the .ask folder, click 'save'
- wait until the zip file is uploaded successfully (you will see a green banner on the top)
- now the Lambda function is working properly.
  

### Step 4: Try the deployed skill under your developer portal account.

 - In a web browser, navigate to https://developer.amazon.com/alexa/console/ask, click the 'Rate my stay' skill to view the details. Then, click the 'Test' Tab near the top. You will see that Skill is enabled in 'Development' stage (the only option you can choose).

 - Start the skill sample by typing '**open rate my stay**' in the dialog box in the Alexa simulator on the left to check out the custom skill experience. You can either:

 - Click the five star graphic, or type '**five stars**' to rate five stars, and see the response

 - Click the one star graphic, type '**one star**' to rate one star, and see the response

 - Type '**help**' to hear the help response.

 - Type '**exit**' to exit the skill.

  

### Step 5: Set up the sample to run under Alexa Smart Properties

#### Enabling the deployed sample skill in an ASP room

- Follow the steps outlined here https://developer.amazon.com/en-US/docs/alexa/alexa-smart-properties/management-console-skills.html#enable-a-skill-for-a-room. Take note that you should perform steps 1 to 4, and skip 5 and 6, and perform steps 8 to 9. Also, you should select 'Development' stage for the skill, and use the skill id obtained in Step 2 of this readme when you deployed the sample skill and input that in the skill id portion of the 'Enabled Property skill' page.

- While in the room settings page, note down the room's **UnitId** that is displayed at the top of the rooms settings page, you will need this value in Step 5.

#### Associate an Echo device to the ASP room

- First, ensure that the device you would like to associate to the ASP room is already set up under the same admin account used to log into the ASP management console using the mobile Alexa app. You should use an echo show 5, 8 or 15 device as the sample skill experience requires a screen for display and touch interactions.

- Then, follow the steps outlined here https://developer.amazon.com/en-US/docs/alexa/alexa-smart-properties/management-console-devices.html#assign-an-alexa-device-to-a-room. In step 3, select the device you set up already under your mobile Alexa app.

#### Test the sample skill using the device in ASP room

- Similar to Step 3 above, you can launch the skill by saying '**Alexa, open rate my stay**', and use the same utterances (or touch the screen) to try out the screen experience.


### Step 6: Setup Proactive Suggestion, and Persistent Visual Alert example to solicit skill rating

In this step, we will install Postman (an API builder/tester application) and import the included Postman collection to deploy proactive suggestion and persistent visual alert to the device you setup and associated to the ASP room in Step 4 that can be used to solicit hotel guest ratings.

- As a per-requisite, you need to have completed step 3b outlined in this link (https://developer.amazon.com/en-US/docs/alexa/alexa-smart-properties/get-started.html) - to gain API access.

-  As you are setting up the LWA security profile, ensure you add the local loopback URL (http://127.0.0.1:9090/cb) as an Allowed Return URL in the security profile's Web Settings.

- Copy down the **Client ID** and **Client Secret** in the Web Settings tab of your Security profile, you will need it later.

- Install Postman from https://www.postman.com/ if you do not have it installed. Launch the application after you have installed it on your computer.

- Import the included Postman collection JSON by going to **File->Import**, and select the **ASPHotelRatingCardPVAExamples.json** file in the 'multimodalcontent' folder of the downloaded sample to import

- The imported collection will be showing in the tree view on the left hand side of the application, expand it to see two POST API request examples, one to send a PVA to solicit room service rating, and another to send a proactive suggestion to get rating from the hotel guest

- Before you can use these examples, you need to configure the required variables used in the API calls, as well as configuring Authorization/access token for the API for the API call.

#### Configuring the environment variables used for the API call

-  On the left side of the Postman application, select 'Environment', you can either pick the 'Globals' environment, or create a separate environment to store the variables, decide on the environment you want to use and select it

-  On the right hand side that shows a table of configured variables, make sure you have entered values for the following variables

| Variable Name | Value  |
|--|--------|
| Host | The value for the variable should be **api.amazonalexa.com** |
| SkillId | The value should be set to the skill id of your deployed sample skill you noted down in step 2 earlier in the setup instructions |
| UnitId | The value should be set to the unit id of the ASP room you noted down where you enabled the sample skill and associated your echo show device to earlier in step 4 in the setup instructions.|
| StartDateTime | The value is used for the proactive suggestions API call, It specifies the date/time when the proactive suggestion will start showing on the Echo Show device. Set this to sometime in the past, so that the proactive suggestion will show immediately. The datetime string uses UTC time format, e.g.  '2023-12-20T13:00:46.90Z'.|
| EndDateTime | The value is used by the proactive suggestions API call, It specifies date/time when the proactive suggestion will expire, Set this to sometime in the future so the content will show on the device. The datetime string uses UTC time format, e.g.'2024-12-20T13:00:00.00Z'.|

#### Configuring the Authorization method for the API calls

- In the left-hand tree view, click the first API example (**PVA - Room Service Rating**), click the 'Authorization' tab on the right hand side

- Select '**OAuth 2.0**' as the Auth type.

- Under the 'Configure Nw Token' section, Type in a name for the token that you will remember (e.g. '**ASPToken**')

- Select '**Authorization Code**' as the Grant Type

- Enter http://127.0.0.1:9090/cb for the Callback URL

- Enter https://www.amazon.com/ap/oa as the Auth URL

- Enter the client ID value that you obtained earlier when you set up the security profile

- Enter the client secret value that you obtained earlier when you set up the security profile

- Enter **alexa::enterprise:management** for the scope

- Leave the rest of the fields unchanged, and click '**Get New Access token**' button at the bottom

- In the dialog window that shows up for login, use your ASP Admin account credential for log in.

- After a successful login, you should have an access token populated for this API example at the top with the Token field shown with the name you entered (e.g. 'ASPToken')

- Click the **Proactive Suggestion - Hotel Rating API** example

- Click on the 'Authorization' Tab

- Select '**OAuth 2.0**' as the Auth Type

- Since you already have a configured token, you can simply select it from the Token drop down list ('**ASPToken**') to use for this API example as well

#### Execute the API calls

##### For Proactive Suggestion:

- Click the '**Proactive Suggestion - Hotel Rating' API** example, and then click the 'Send' Button on the right hand side to call the API, and observe the successful HTTP response (e.g. 200 OK)

- After verifying that you have a successful HTTP response, wait between 1-20 minutes for the proactive suggestion card to show on the device in the ASP room. If you would like it to show up faster, you can reboot the device. Upon reboot, you should see Hotel Rating card showing on the device home screen.

- Tap the text portion of the card, and the Rate My Stay skill should launch to allow you to rate the stay as before.

##### For Persistent Visual Alert:

- Click the '**PVA- Room Service Rating**' API example, and click the 'Send' Button on the right hand side to call the API. On the bottom of the right hand side, you should see a successful HTTP response (e.g .200 OK)

- After verifying that you have a successful HTTP response, wait 5-10 seconds for the persistent visual alert to show up on the device screen in the ASP room.

- You can select either the thumbs up button, or the thumbs down button, a thumbs up is equivalent of sending a 5 stars rating to the Rate my stay skill sample, and a thumbs down is equivalent of sending a 1 star rating. After tapping either button, the PVA should disappear, and you should be greeted by the same response as if you just provided either a 5 star or 1 star rating in the sample skill.  You can also tap the dismiss button to dismiss the PVA without rating.

### Step 7: Customize the skill and cards for your property use!

The sample can be customized for your own use in your ASP properties. The following folders contains the customizable elements:

- **lambda/apl** folder - this folder contains the APL (Alexa presentation language) layout file that determines the layout, sizing etc. of the UI element of the rating skill

- **lambda/data** folder - this folder contains all the text strings, and URLs for the hotel brand logo and background images. You can customize the UI text, as well as supplying your own images hosted on a HTTPS URLs specified in these files to customize the look of the sample.

- **languages/en-US.js** file - this file contains the Alexa text-to-speech response that is returned by the skill sample. You can customize the strings located in this file to change what Alexa will say in the sample skill. Note that the room name in **STAFF_TEXT_MESSAGE** is hardcoded, in a production deployed hotel, the skill should be integrated with the hotel PMS to retrieve the actual room number to be returned here.

  

---

  

## Additional Resources

  

### Onboarding

* [ASP Overview](https://developer.amazon.com/en-US/alexa/alexa-smart-properties) - Onboarding Alexa Smart Properties (ASP)

* [Alexa Skill Kit](https://developer.amazon.com/en-US/alexa/alexa-skills-kit) - New to Alexa skills development? Start from here!

  

### Documentation

* [Official Alexa Smart Properties Documentation](https://developer.amazon.com/en-US/docs/alexa/alexa-smart-properties/about-alexa-smart-properties.html)

* [Official Alexa Skills Kit Documentation](https://developer.amazon.com/en-US/docs/alexa/ask-overviews/what-is-the-alexa-skills-kit.html)


