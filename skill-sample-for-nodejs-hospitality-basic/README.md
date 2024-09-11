# Build An Alexa Smart Properties Skill
<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/header._TTH_.png" />

This is a sample Alexa skill for [Alexa Smart Properties (ASP)](https://developer.amazon.com/en-US/alexa/alexa-smart-properties). Please note that ASP skills are hidden from the public catalog by default, and can only be enabled on selected properties. To use this skill in an ASP organization, you are required to have an active ASP subscription, with properties and rooms (where the skill can be enalbed).
You also MUST enable your Vendor ID for Name-Free Interactions (NFI). See the instructions below.
If you are looking for sample skills for the regular consumer version of Alexa, please refer to [Alexa Samples](https://github.com/alexa-samples) instead. 
This skill acts as an assistant in a hospitality facility. Guests can ask questions such as "Alexa, tell me about the pool" or make requests like "Alexa, where is the hotel conference center", "Alexa, where is the hotel cafe", "Alexa, please checkout". Feel free to use this sample skill as a reference, or as a template to build your own property skill(s).


## Contents

The contents of this repository is broken down into a few sub-folders.

### Skill-package

This folder contains the sample skill's interaction model and metadata. The skill's metadata is defined in '**skill.json**' file, the interaction model (the voice input utterances that the skill supports) are located in '**interactionModels/custom/en-US.json'**. 

### Lambda

This folder contains the backend handlers for the sample skill. This sample uses Node.js runtime and can be hosted on AWS Lambda. However, you have the flexibility to decide where your backend will be hosted, and what programming language to code it with.

Parts of the lambda code are left for you to implement. For example, if your property has a staff notification system (via text etc.) that can be called via an API, you can modify the help intent handler such that whenever a user asks Alexa for help, Alexa automatically opens a ticket to your staff.

## Sample Skill Setup
If you intend to use this sample skill as a template to build your own property skill, here are the recommended steps:

### Prerequisites:
1. Configure ASK_CLI: https://developer.amazon.com/en-US/docs/alexa/smapi/quick-start-alexa-skills-kit-command-line-interface.html
2. Create amazon developer account at developer.amazon.com and AWS account at aws.amazon.com
3. Clone the sample skill to local workspace.
4. Verify ask and aws profiles:
    cat ~/.ask/cli_config 
    cat ~/.aws/credentials
5. Verify vendor account access by listing skills available for the ask profile:
   
       ask smapi list-skills-for-vendor [-p <ask_profile>]
    
 
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

### Step 2: Deploy skill

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

### Step 3: Try the deployed skill under your developer portal account.

 - In a web browser, navigate to https://developer.amazon.com/alexa/console/ask, click the 'Maveri Hotel' skill to view the details. Then, click the 'Test' Tab near the top. You will see that Skill is enabled in 'Development' stage (the only option you can choose).

 - Start the skill sample by typing '**open hotel demo**' in the dialog box in the Alexa simulator on the left to check out the custom skill experience. You can:

 - Use either typed utterances or click the apl screen in the simulator to check out the experience.

 - When done, Type '**exit**' to exit the skill.


### Step 4: Set up the sample to run under Alexa Smart Properties

#### Enabling the deployed sample skill in an ASP room
- Follow the steps outlined here https://developer.amazon.com/en-US/docs/alexa/alexa-smart-properties/management-console-skills.html#enable-a-skill-for-a-room. Take note that you should perform steps 1 to 4, and skip 5 and 6, and perform steps 8 to 9. Also, you should select 'Development' stage for the skill, and use the skill id obtained in Step 2 of this readme when you deployed the sample skill and input that in the skill id portion of the 'Enabled Property skill' page.

- While in the room settings page, note down the room's **UnitId** that is displayed at the top of the rooms settings page, you will need this value later on.
- (optional) if you would like to enable 'name-free-interaction' (NFI) feature for the sample skill experience in the room.  Please work with your assigned solution architect to get this enabled for your skill in development stage.  Once when you are ready to submit the skill for public certification, you should enable NFI feature for production by following the steps provided at https://developer.amazon.com/en-US/docs/alexa/alexa-smart-properties/name-free-interaction.html. Note that the skill interaction model is already optimized, for step 6, you can simply replace the skill interaction json file at **skill-package/interactionmodels/custom/en-US.json** with the **skill-package/interactionmodels/custom/en-US-nfi.json** file  (remember to rename the file en-US.json).  This file has defined all the necessary NFI intents for the Maveri skill already for you required in this particular step.  After making the change, run **'ask deploy'** again to redeploy your skill.

#### Associate an Echo device to the ASP room

- First, ensure that the device you would like to associate to the ASP room is already set up under the same admin account used to log into the ASP management console using the mobile Alexa app. You can use either an Echo device with no screen, or an Echo Show device with screen.  The skill is mostly audio only, but does have some read-only screen experience.

- Then, follow the steps outlined here https://developer.amazon.com/en-US/docs/alexa/alexa-smart-properties/management-console-devices.html#assign-an-alexa-device-to-a-room. In step 3, select the device you set up already under your mobile Alexa app.

#### Test the sample skill using the device in ASP room

- Similar to Step 3 above, you can launch the skill by saying '**Alexa, open hotel demo**', and use voice utterances to try out the experience.
- (optional) if name-free-interaction is enabled for the sample experience, you can use any of the utterances defined in the skill's interaction model to go directly to that specific portion of the experience.  Some of the phrases to try directly.

'Alexa, where is the spa?'
'Alexa, request room items.'
'Alexa, order food.'

### Step 5: Update and Customize the skill for your property
The sample can be customized for your own use in your ASP properties. The following folders contains the customizable elements:

- **languages/en-US.js** file - this file contains the Alexa text-to-speech response that is returned by the skill sample. You can customize the strings located in this file to change what Alexa will say in the sample skill.
- **constants.js** file - this file contains a list of image urls that are used in the skill responses returned to the customers who has a screen-based Alexa device such as an Echo Show.  The image assets should be updated to something that corresponds to the property you are customizing it for.

---

## Additional Resources

### Onboarding
* [ASP Overview](https://developer.amazon.com/en-US/alexa/alexa-smart-properties) - Onboarding Alexa Smart Properties (ASP)
* [Alexa Skill Kit](https://developer.amazon.com/en-US/alexa/alexa-skills-kit) - New to Alexa skills development? Start from here!

### Documentation
* [Official Alexa Smart Properties Documentation](https://developer.amazon.com/en-US/docs/alexa/alexa-smart-properties/about-alexa-smart-properties.html)
* [Official Alexa Skills Kit Documentation](https://developer.amazon.com/en-US/docs/alexa/ask-overviews/what-is-the-alexa-skills-kit.html)


