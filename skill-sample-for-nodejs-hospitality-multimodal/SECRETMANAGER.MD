# Using AWS Secrets Manager for LWA Access with the CLI

This guide is designed to help you set up an AWS environment to securely store LWA secrets (e.g., client id, client secret, refresh token) so the sample skill can use these values to automatically retrieve an LWA access token. This is essential for developers working with Alexa Smart Properties APIs. When you need to call ASP management APIs in backend services code, the AWS Secrets Manager method is superior from practical and security perspectives. 

We'll walk you through each step, from creating an AWS account to configuring the AWS Secrets Manager and retrieving refresh token. After you have the refresh token, and the rest of required oAuth values stored in the secrets manager, then you will be able to access it in your services code, such as in an Alexa Skills Lambda handler in this sample and use it to retrieve an updated access token.

## 0. Pre-requisites
To store the token required for calling ASP management APIs, you need to first have obtained both the access token, and the refresh token first.  You can use any oAuth2 codegrant mechanism you know of to obtain these token values.  One easy way to do that is to use the Authorization UI in the Postman (http://www.postman.com).  See step 5 of the [readme.md](./README.md) instruction for how to use Postman to obtain these values.

## 1. Creating an AWS Account
Before you can start using AWS services, you need an AWS account. Here's how to create one:
1. **Visit the AWS Home Page**: Go to AWS Home and click on the "Create an AWS Account" button.
2. **Begin the Sign-Up Process**: Follow the on-screen instructions. You'll need to provide some basic information and payment details.

## 2. Configuring the AWS Secrets Manager with your secrets
AWS Secrets Manager helps you protect access to your applications, services, and IT resources without the upfront investment and on-going maintenance costs of operating your own infrastructure.

**Step 1: Secret Manager – Setting up Secrets**
1.	Log into your AWS account and search for AWS Secrets Manager. 
2.	Create one secret in AWS Secrets Manager (the secret name can truly be whatever you choose it to be – we will use `amazon-api-access-token` in this documentation)

**Step 2:  LWA OAuth Secret Setup (the information in this secret is meant to facilitate LWA OAuth)**
1.	Navigate to AWS Secrets Manager in the AWS Console
2.	Click "Store a new secret"
3.	Choose "Other type of secrets" for secret type
4.	Enter necessary key/value pairs for your LWA OAuth credentials

    | Key | Value | Note |
    | --- | --- | --- |
    | api-access-token | Add your initial access token | You can retrieve your initial access token using various tools such as Postman |
    | lwa-refresh-token | Add your refresh token | You can retrieve your refresh token using various tools such as Postman |
    | lwa-client-id | Add your initial access token | This value should be the same client id value you used to initially obtain the access token |
    | lwa-client-secret | Add your initial access token | This value should be the same client secret value you used to initially obtain the access token |
    | lwa-auth-scope | Add your initial access token | This value should be the same scope value you used to initially obtain the access token |
    | lwa-auth-url | Add your initial access token | the oAuth token URL to call to get access token, for LWA it is  |

5. Click Next
6. Add your Secret Name: We use `amazon-api-access-token` in this documentation
7. Add Description (optional)
8. Click Next and Create Secret

After you have set this up, assuming you use the default key names, then you should be set up so the skill demo code should be able to invoke the ASP management APIs (including in-skill calling)

