
# Build An Alexa Smart Properties Skill

<img  src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/header._TTH_.png"  />

  

This is a sample Alexa skill for [Alexa Smart Properties (ASP)](https://developer.amazon.com/en-US/alexa/alexa-smart-properties). The sample provides a visual, voice and touch experience for a fictional hotel (Maveri Las Vegas).  

ASP skills are hidden from the public catalog by default, and can only be enabled on selected properties. To use this skill in an ASP organization, an active ASP subscription is required, with properties and rooms created (where the skill can be enabled).

You also can optionally enable your skill development Vendor ID for ASP to get access to feature such as Name-free skill interaction (NFI) and persistent unit id (PUID) access. See the instructions below.

If you are looking for sample skills for the regular consumer version of Alexa, please refer to [Alexa Samples](https://github.com/alexa-samples) instead.

This skill is an example implementation for a rich, interactive multimodal hospitality experience for Alexa Smart Properties managed devices such as the Echo Show 5, Echo Show 8 and Echo Show 15. The sample aims to provide a familiar user experience that hotel guests are comfortable with, using both voice and touch interactions.  The sample can be launched by standard Alexa custom skill invocation phrase (e.g. 'Alexa, open demo hotel'), or through ASP features such as proactive suggestion campaign (https://developer.amazon.com/en-US/docs/alexa/alexa-smart-properties/proactive-suggestion-api.html#create-campaign), or persistent visual alert (https://developer.amazon.com/en-US/docs/alexa/alexa-smart-properties/notifications-api.html#send-notifications) which triggers the Alexa custom skill. Examples of how to use these features, as well as the Alexa demo hotel custom skill experience are provided in this sample.

## Contents

The contents of this sample is broken down into a few sub-folders.

### Skill-package

This folder contains the sample skill's interaction model and metadata. The skill's metadata is defined in '**skill.json**' file, the interaction model (the voice input utterances that the skill supports) are located in '**interactionModels/custom/en-US.json'**. The skill sample also have several skill connection tasks (https://developer.amazon.com/de-DE/docs/alexa/custom-skills/implement-custom-tasks-in-your-skill.html) defined in the '**./Skill-package/tasks/**' folder and in the skill.json file mentioned before.  These skill connections tasks can be invoked by proactive suggestions or persistent visual alert features in Alexa Smart Properties.

### Lambda

This folder contains the backend handlers for the sample skill. This sample uses Node.js runtime and can be hosted on AWS Lambda. However, you have the flexibility to decide where your backend will be hosted, and what programming language to code it with.

Parts of the backend Lambda code requires you to supply your own values, such as, a cell number capable of receiving SMS text messages.  They are annotated with in the comment so you know to change them.  The visual experience under the subfolder **/Lambda/apl** and **/Lambda/languages/data** can also be customized for your hospitality customers.  These will be described in detail in later sections.

### Multimodalcontent

The entry point into the sample hotel experience can be triggered through interacting with a proactive suggestions campaign card, or through interacting with a persistent visual alert. This folder contains a Postman (https://www.postman.com/) collection example that shows how to create a proactive suggestion and a persistent visual alert using Alexa Smart Properties management APIs. Instructions on how to set this up are included below.

### Assets

The proactive suggestion, persistent visual alerts, and the custom skill all use visual assets (such as background images). A copy of all the visual assets used are located in this folder. These assets are provided for your reference, and this sample references a copy of these files hosted online so that the sample can be run immediately when deployed.  If you are deploying and customizing the sample for your customers, update the URLs referencing hosted assets online to your own visual assets.

  

## Sample Setup Instructions

Follow the recommended steps below to setup, host and configure this sample.

  

### Prerequisites:

 - This sample is exclusively written for Alexa Smart Properties, and many of the functionalities will only work when the experience is deployed to an ASP room.  You will need to have a working Alexa Smart Properties organization setup. If you don't have access to Alexa Smart Properties, follow the steps located at https://developer.amazon.com/en-US/docs/alexa/alexa-smart-properties/get-started.html to obtain access and set up Alexa Smart Properties.

 - If you do not have one already, create a free Amazon developer account at https://developer.amazon.com. Please use the same Amazon account you are using for Alexa Smart Properties in the previous step to log in at https://developer.amazon.com. Once when you have created and logged in with your Amazon developer account, navigate to https://developer.amazon.com/mycid.html, note down Your customer ID and vendor ID values.

 - Log into your Alexa Smart Properties management console, on the left handside of the console, click 'Administration'. In the 'Skill Tools Vendors' section, click 'Enable Skill Tools' button. Type in the vendor ID that you have obtained in the previous step, and click 'Submit' to enable your developer vendor account.

 - If you do not have one already, create a free Amazon Web Services account at https://aws.amazon.com.

 - You will need to install and configure Alexa Skills Kit Command Line interface (ASK CLI) to deploy this sample. Instructions are located at https://developer.amazon.com/en-US/docs/alexa/smapi/quick-start-alexa-skills-kit-command-line-interface.html. Follow and perform steps 1-3 to set up ASK CLI, as well as create/configure an AWS profile to use with the ASK CLI. Ensure you have run the 'ask configure' command in your terminal/PowerShell window and configured both ASK and AWS profiles. Note down the name of the ASK profile for later use.

 - Verify ASK and AWS profiles are setup, in a terminal (Mac/Linux) or PowerShell (Windows), type the following commands

    cat ~/.ask/cli_config (you should see on the screen a list of configured profiles for ASK CLI) 
    cat ~/.aws/credentials (you should see on the screen a list of configured profiles for AWS CLI)

 - Verify ASK vendor account access through the ASK CLI by listing skills available for the ask profile by typing in the following command in a terminal/PowerShell window:

    ask smapi list-skills-for-vendor [-p <ask_profile>]

 - Clone the GitHub sample to a local workspace on your computer.


### Step 1: Initialize the skill sample for deployment

Use [ASK CLI commands](https://developer.amazon.com/en-US/docs/alexa/smapi/ask-cli-command-reference.html) to perform initialization for the skill sample.
By the end of this step, your skill should be initialized and ready to be deployed to your skill developer account with the ASK CLI. A  file named ask-resources.json will be generated in the root folder of  your skill sample.
   
 - In a terminal/PowerShell window, if needed, change directory to the workspace folder where the skill sample is located in. This should be the folder/directory that contains this README.md file, along with other sub folders such as assets/lambda/skill-package. Once in the root folder/directory of the skill sample, run the following command:

    ask init

 - When promopted for the skill id, leave it empty so a new one will be created and press return
   
 - Accept the default value for the skill package path (./skill-package) and press return
  
 - Aceept the default value for the Lambda code path for default region (./lambda) and press return
  
 - Choose yes or no to deploy Lambda using AWS CloudFormation, the sample's Lambda can be deployed with or without Cloudformation successfully.
   
 -  Accept the default runtime (nodejs16.x) and press return
   
 - Accept the default Lambda handler (index.handler) and press return
   
 - Select 'Y' (default) when asked if the generated ask-resources.json is correct and press return

### Step 2: Set up AWS Pinpoint

The skill sample uses AWS Pinpoint to send SMS text messages when guest rating is unsatisfactory.  To enable this part of the sample to work, you will need to set up an AWS Pinpoint project for this to work.  Follow the steps outlined in this guide to set it up (https://docs.aws.amazon.com/pinpoint/latest/userguide/channels-sms-setup.html).  Note there is nominal price required to send SMS messages - please refer to this page for more information https://aws.amazon.com/pinpoint/pricing/

- Once when you have configured your AWS Pinpoint SMS channel so that you can send text messages through your Pinpoint project.  Navigate to the AWS Pinpoint project list.  Identify the AWS project you setup, and Write down the project ID listed.
- From the root directory of the sample download, open './lambda/sms.js' in a text editor
- Near the top of the source code file, you should see this line:
   const applicationId = "INSERT YOUR OWN PINPOINT PROJECT ID HERE"
- Put your AWS Pinpoint project ID in the quotation mark and save the file.
- Open './lambda/config.js' - in a text editor
- Nar the top of the source code file, you should see this line:
   GUEST_NUMBER: 'INSERT A VALID MOBILE NUMBER YOU WANT TO SEND SMS MESSAGE TO',
- Put a valid mobile number that can accept SMS Messages between the quotation park and save the file.  For the US, make sure to add +1 at the beginning followed by area code and the phone number. In a production hotel deployment, this phone number should come from the PMS and should be the checked-in guest's mobile number.

### Step 3: Deploy skill

Use [ASK CLI commands](https://developer.amazon.com/en-US/docs/alexa/smapi/ask-cli-command-reference.html) to deploy your new skill to your developer portal account.

By the end of this step, you would have a skill created under your developer.amazon.com account and see this message: Skill package deployed and all models built successfully.

 - In the terminal/PowerShell window, from the root folder of the downloaded sample, type the following to deploy the skill:

    ask deploy [-p <ask_profile>]

 >Note: At this point skill is created and respective skill package and lambda function are deployed to your Amazon developer and AWS accounts. Verify if you see the new skill with the name '**Maveri Hotel**' on the skill developer portal (https://developer.amazon.com/alexa/console/ask) and respective lambda function that starts with name (**ask-maverihotel-default-default-XXXX**) in your associated AWS account (https://us-east-1.console.aws.amazon.com/lambda).

 - Note down the skill id of the deployed 'Maveri Hotel' skill later for step 4.

NOTE: if you are using Microsoft windows, there is an issue with ASK CLI running on Windows where the produced Lambda code package won't have its dependency working properly.  To work around this, please do the following:

- Open an explorer window, navigate to the root folder of the downloaded sample that you deployed.
- Navigate into the .ask folder, and then navigate into the lambda folder, now delete build.zip that is in the folder
- Select all of the files that are in the lambda folder, right click in the window and select 'Compress to zip file'
- In a web browser, navigate to aws.amazon.com, then, log into your AWS account
- Search for Lambda in the services search box, and click the found 'Lambda' result to go to the Lambda functions dashboard
- Find the generated Lambda function for the deployed skill (in the format ask-maverihotel-default-default-XXXX) and click to view the settings
- Click 'Upload from' drop down on the right, and select '.Zip file', in the dialog that shows up, click 'Upload', and select the compressed zip file you generated in the .ask folder, click 'save'
- Wait until the zip file is uploaded successfully (you will see a success status green banner on the top)
- Now the Lambda function is working properly.
  
#### Update Lambda execution permission
The sample skill uses ASK SDK persistance adapter, and the deployed Lambda handler needs to be updated so that it has access to DynamoDB, which it uses to store persistant data.  The following steps sets up your Lambda function with access to dynamo db so the sample can function properly.
- in a web browser, navigate to aws.amazon.com, log in with the aws account credentials you created in the prerequisites step
- in the services search text box at the top, type 'lambda', and click the 'Lambda' item in the search result to access the Lambda dashboard
- Locate your deployed Lambda function, which should be of the form 'ask-maverihotel-default-default-XXXX', click to view its settings
- click 'Configuration' tab, and click 'Permissions', click the role name link under 'Role name' section to view the execution role setting (the role name should be in the format 'ask-lambda-MaveriHotel-XXXX')
- In the 'Permissions policies' section, click 'Add permissions' drop down, select 'Attach policies'
- In the Other permissions policies search box, type 'dynamodb', check the 'AmazonDynamoDBFullAccess' checkbox, and click 'Add permission' button to add the policy to the role.

### Step 4: Try the deployed skill under your developer portal account.

 - In a web browser, navigate to https://developer.amazon.com/alexa/console/ask, click the 'Maveri Hotel' skill to view the details. Then, click the 'Test' Tab near the top. You will see that Skill is enabled in 'Development' stage (the only option you can choose).

 - Start the skill sample by typing '**open demo hotel**' in the dialog box in the Alexa simulator on the left to check out the custom skill experience. You can:

 - Use either typed utterances or click the apl screen in the simulator to check out the experience.

 - When done, Type '**exit**' to exit the skill.


### Step 5: Set up the sample to run under Alexa Smart Properties

#### Enabling the deployed sample skill in an ASP room
- Follow the steps outlined here https://developer.amazon.com/en-US/docs/alexa/alexa-smart-properties/management-console-skills.html#enable-a-skill-for-a-room. Take note that you should perform steps 1 to 4, and skip 5 and 6, and perform steps 8 to 9. Also, you should select 'Development' stage for the skill, and use the skill id obtained in Step 2 of this readme when you deployed the sample skill and input that in the skill id portion of the 'Enabled Property skill' page.

- While in the room settings page, note down the room's **UnitId** that is displayed at the top of the rooms settings page, you will need this value later on.
- (optional) if you would like to enable 'name-free-interaction' (NFI) feature for the sample skill experience in the room.  Please work with your assigned solution architect to get this enabled for your skill in development stage.  Once when you are ready to submit the skill for public certification, you should enable NFI feature for production by following the steps provided at https://developer.amazon.com/en-US/docs/alexa/alexa-smart-properties/name-free-interaction.html. Note that the skill interaction model is already optimized, for step 6, you can simply replace the skill interaction json file at **skill-package/interactionmodels/custom/en-US.json** with the **skill-package/interactionmodels/custom/en-US-nfi.json** file  (remember to rename the file en-US.json).  This file has defined all the necessary NFI intents for the Maveri skill already for you required in this particular step.  After making the change, run **'ask deploy'** again to redeploy your skill.

#### Associate an Echo device to the ASP room

- First, ensure that the device you would like to associate to the ASP room is already set up under the same admin account used to log into the ASP management console using the mobile Alexa app. You should use an echo show 5, 8 or 15 device as the sample skill experience requires a screen for display and touch interactions.

- Then, follow the steps outlined here https://developer.amazon.com/en-US/docs/alexa/alexa-smart-properties/management-console-devices.html#assign-an-alexa-device-to-a-room. In step 3, select the device you set up already under your mobile Alexa app.

#### Test the sample skill using the device in ASP room

- Similar to Step 3 above, you can launch the skill by saying '**Alexa, open demo hotel**', and use the same utterances (or touch the screen) to try out the screen experience.
- (optional) if name-free-interaction is enabled for the sample experience, you can use any of the utterances defined in the skill's interaction model to go directly to that specific portion of the experience.  Some of the phrases to try directly.

'Alexa, what can you do?'
'Alexa, where is the spa?'
'Alexa, request room items.'
'Alexa, order food.'


### Step 6: Setup Proactive Suggestion, and Persistent Visual Alert example to solicit skill rating

In this step, we will install Postman (an API builder/tester application) and import the included Postman collection to deploy proactive suggestion and persistent visual alert to the device you setup and associated to the ASP room in Step 4 that can be used to solicit hotel guest ratings.

- As a per-requisite, you need to have completed step 3b outlined in this link (https://developer.amazon.com/en-US/docs/alexa/alexa-smart-properties/get-started.html) - to gain API access.

-  As you are setting up the LWA security profile, ensure you add the local loopback URL (http://127.0.0.1:9090/cb) as an Allowed Return URL in the security profile's Web Settings.

- Copy down the **Client ID** and **Client Secret** in the Web Settings tab of your Security profile, you will need it later.

- Install Postman from https://www.postman.com/ if you do not have it installed. Launch the application after you have installed it on your computer.

- Import the included Postman collection JSON by going to **File->Import**, and select the **ASPMaveriHotelCardPVAExamples.json** file in the 'multimodalcontent' folder of the downloaded sample to import

- The imported collection will be showing in the tree view on the left hand side of the application, expand it to see two POST API request examples, one to send a PVA to welcome the guest to the hotel, and another to send a proactive suggestion to promote the hotel spa to the guest.

- Before you can use these examples, you need to configure the required variables used in the API calls, as well as configuring Authorization/access token for the API for the API call.

#### Configuring the environment variables used for the API call

-  On the left side of the Postman application, select 'Environment', you can either pick the 'Globals' environment, or create a separate environment to store the variables, decide on the environment you want to use and select it

-  On the right hand side that shows a table of configured variables, make sure you have entered values for the following variables

| Variable Name | Value  |
|--|--------|
| Host | The value for the variable should be **api.amazonalexa.com** |
| SkillId | The value should be set to the skill id of your deployed sample skill you noted down in step 2 earlier in the setup instructions. |
| UnitId | The value should be set to the unit id of the ASP room you noted down where you enabled the sample skill and associated your Echo show device to earlier in step 4 in the setup instructions. |
| StartDateTime | The value is used for the proactive suggestions API call. It specifies the date/time when the proactive suggestion will start showing on the Echo Show device. Set this to sometime in the past, so that the proactive suggestion will show immediately. The datetime string uses UTC time format, e.g.  '2023-12-20T13:00:46.90Z'.|
| EndDateTime | The value is used by the proactive suggestions API call, It specifies date/time when the proactive suggestion will expire, Set this to sometime in the future so the content will show on the device. The datetime string uses UTC time format, e.g.'2024-12-20T13:00:00.00Z'.|

#### Configuring the Authorization method for the API calls

- In the left-hand tree view, click the first API example (**PVA - Welcome Hotel Guest**), click the 'Authorization' tab on the right hand side

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

- NOTE: from the Postman UI, copy down the values for both the access token, and for the refresh token, we will need them later if you want to set up PBX

- Click the **Proactive Suggestion - Promote Hotel Spa** example

- Click on the 'Authorization' Tab

- Select '**OAuth 2.0**' as the Auth Type

- Since you already have a configured token, you can simply select it from the Token drop down list ('**ASPToken**') to use for this API example as well

#### Execute the API calls

##### For Proactive Suggestion:

- Click the '**Proactive Suggestion - Promote Hotel Spa' API** example, and then click the 'Send' Button on the right hand side to call the API, and observe the successful HTTP response (e.g. 200 OK)

- After verifying that you have a successful HTTP response, wait between 1-20 minutes for the proactive suggestion card to show on the device in the ASP room. If you would like it to show up faster, you can reboot the device. Upon reboot, you should see Hotel Spa card showing on the device home screen.

- Tap the text portion of the card, and the Maveri Hotel sample skill will launch directly into spa details page.

##### For Persistent Visual Alert:

- Click the '**PVA- Welcome Hotel Guest**' API example, and click the 'Send' Button on the right hand side to call the API. On the bottom of the right hand side, you should see a successful HTTP response (e.g .200 OK)

- After verifying that you have a successful HTTP response, wait 5-10 seconds for the persistent visual alert to show up on the device screen in the ASP room.

- You can tap the 'Welcome' button, and see the Maveri hotel skill launch, and welcome you with a personal video message video.

### Step 7: Configure PBX Skill Initiatied Calling, and mobile number for SMS Texting
The deployed skill sample has the capability to make calls if the Alexa Smart Properties room that the skill is invoked from is integrated with a PBX system.  If you would like to get this part of the sample working, you need to:

- Configure and deploy the ASP Management API access token and refresh token for use in the skill sample.  This is required so that the skill sample can initiate a PBX call.  Refer to [Secret Manager Setup Instructions](./instructions/SECRETMANAGER.MD) for more information.  You will need the access token, and the refresh token values that you have obtained in the Postman setup in the previous step when setting up the secret manager.   
- Configure your Alexa Smart Properties to work with a SIP capable PBX system.  Please work with your assigned Alexa Smart Properties solution architect on this configuration task.  Ensure that there is at least one extension number that the Alexa device can make a call to (and note down the extension number.)  Also ensure the ASP room that you would be using has a communication profile created.
- The sample skill needs to be allow-listed by your assigned solution architect so that it can make calls on behalf of the customer.
- Once when the access to the feature has been granted, the skill calling permission needs to be enabled by specifying it in the skill manifest.  In the downloaded source code root folder, open './skill-package/skill.json', add the skill permission JSON snippet under the 'permissions' section as shown in the bolded section below:
    "permissions": [
      {
        "name": "alexa::persistent_unit_id::read"
      }**,
      {
        "name": "amazon_communication::calling"
      }**
    ],
- If you configured the secret manager with different key name, key value name, and/or region, then you need to open './lambda/config.js file and update the corresponding variables **SECRET_MGR_S_NAME_ASP_OAUTH**, **REGION**, **SECRET_MGR_S_NAME_ASP_RT**, **SECRET_MGR_S_NAME_ASP_CI**, **SECRET_MGR_S_NAME_ASP_CS**, **SECRET_MGR_S_NAME_ASP_SCOPE**, **SECRET_MGR_S_NAME_AUTH_URL**
- Open './lambda/config.js file and update the PBX extenion number variable **PBX_DEFAULT_EXTENSION** with a configured PBX extension that the Alexa skill can call.  All calling features in the skill will use this extension as the number to call. 
- Open './lambda/config.js file and  './lambda/config.js and update the guest mobile number variable **GUEST_NUMBER** with a working mobile number that can receive SMS text. The mobile number configured here will receive a sms text when the checkout feature is used in the sample hotel checkout experience.
- Re-run step 2 to redploy the skill lambda code again with the changes. 
- Now your sample skill experience should work with your configured PBX, and also with SMS texting.


### Step 8: Customize the skill and cards for your property use!
The sample can be customized for your own use in your ASP properties. The following folders contains the customizable elements:

- **lamba/apl** folder - this folder contains the APL (Alexa presentation language) layout JSON files that determine the layout, sizing etc. of the UI elements of the sample skill.  If you are looking to modify the layout of any of the pages used in the sample, look in this folder for the right APL JSON document file to change. 
   **checkout.json** - UI for the checkout confirmation page
   **confirm.json** - UI of the generic confirmation page (used for housekeeping request, telephone calling)
   **currentbill.json** - UI for the current billing info page 
   **headline.json** - UI shown after someone has checked out of the room.  Uses the generic headline template provided by Amazon.
   **home.json** - this is the main menu/home page for the Maveri hotel skill
   **hotelinfo.json** - this is the page that lists all the hotel facilities and their details
   **inRoomDining.json** - this is the page that shows the in-room dining menu.
   **phoneDirectory.json** - this is the page that shows the list of hotel departments and the buttons to call each department
   **requestItemConfirm** - this is the confirmation page for room item request, it shows list of requested items and confirmation/cancel buttons
   **textInfoOnly.json** - for Alexa requests that only requires a text field to show text responses in.  
   **twoPanelPage.json** - configurable two panel (left/right) page template used in loytalty program, Wifi info, tour info.  
   **videoPage.json** - this is the page that allows for a background full screen video to be playing.  Used in welcome message, and event info page.

- **lamba/apl/packages/asp-hotel-layouts.json** file - This file contains all the dimension resources used for all the UIs of the sample skill, as well as the layout of the common header and footer used in all of the UI pages in the sample skill.  You can see a hosted version of this file referenced in the import section of all the APL documents.  If you would like to modify this and make changes, host the modified package on a publicly accessible HTTPS URI.  
   
- **lambda/data/*.json** files - the *.json files in this folder contain all the text strings, and URLs for the hotel brand logo and background images used in each of the UI pages. You can customize the UI text, as well as supplying your own images hosted on a HTTPS URLs specified in these files to customize the look of the sample.  The file naming should be self-explanatory on where they are used, and they also corresponds to the actual APL document file listed above.

- **languages/en-US.js** file - this file contains the Alexa text-to-speech response that is returned by the skill sample. You can customize the strings located in this file to change what Alexa will say in the sample skill. Note that the room name in **STAFF_TEXT_MESSAGE** is hardcoded, in a production deployed hotel, the skill should be integrated with the hotel PMS to retrieve the actual room number to be returned here.


  

---

  

## Additional Resources

  

### Onboarding

* [ASP Overview](https://developer.amazon.com/en-US/alexa/alexa-smart-properties) - Onboarding Alexa Smart Properties (ASP)

* [Alexa Skill Kit](https://developer.amazon.com/en-US/alexa/alexa-skills-kit) - New to Alexa skills development? Start from here!

  

### Documentation

* [Official Alexa Smart Properties Documentation](https://developer.amazon.com/en-US/docs/alexa/alexa-smart-properties/about-alexa-smart-properties.html)

* [Official Alexa Skills Kit Documentation](https://developer.amazon.com/en-US/docs/alexa/ask-overviews/what-is-the-alexa-skills-kit.html)


