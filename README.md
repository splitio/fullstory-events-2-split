# Integrate FullStory Events to Split

Using the FullStory events webhook, you can pass FullStory events to Split for use in measurement, alerts, and experimentation.

## Installation

A single node.js lambda does the work, using only the filesystem (for API tokens) and the Axios HTTP client.

Install in AWS.  Give the lambda a functional URL, and provide the function URL to the FullStory events webhook.

Copy your keys (carefully) into:

 - SPLIT_API_KEY file (server-side API key for your desired environment)
 - FULLSTORY_API_KEY (I used admin, but you can experiment)

```
> npm install 
> zip -r fullstory.zip *
```
That should include the index.js and the token files and a full node_modules directory.

Upload to the Code screen of your AWS lambda.  

## Debug

Use CloudWatch to look at inbound events and check they're properly handled.  Some events take time to propagate, but CloudWatch will give early indication of trouble.

## Author

David.Martin@split.io
