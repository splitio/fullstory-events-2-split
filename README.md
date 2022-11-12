# Integrate FullStory Events to Split

Using the FullStory events webhook, you can pass FullStory events to Split for use in measurement, alerts, and experimentation.  Events are the result of an FS.event() call from the FullStory SDK, e.g.

```javascript
const props = 
{
	split: {
		value: 42
	},
	foo:false,
	bar: {
		changeNumber_real:1667920819383,
		feature_str:"multivariant_demo",
	}, colors: {
		rainbow: ["red", "orange", "yellow"],
		prison: ["gray"],
		invisible: {
			noface: {
				character: "miyazake"
			}
		}
	}
};	
FS.event('colorful_click', props);	
```
This transforms into the corresponding Split event:
```json
```
The hierarchy is flattened, but all the same information is available.

## Installation

Clone the repository in an empty directory.  

Inside the directory created, copy your API keys (carefully) into:

 - SPLIT_API_KEY file (server-side API key for your desired environment)
 - FULLSTORY_API_KEY (I used admin, but you can experiment)

Now, from this same directory..

```
> npm install 
> zip -r fullstory.zip *
```

You can "brew install npm" on OSX.

The fullstory.zip should include the index.js, the key files and a full node_modules directory.

A single node.js lambda does the work for the integration, using only the filesystem (for API keys) and the Axios HTTP client.  The integration makes two cheap API calls per FullStory event.

Install in AWS.  
 - Create a new "fullstory" lambda for Nodes.js
 - Upload fullstory.zip to the Code screen of your AWS lambda.  
 - Give the lambda a functional URL to POST to it, and provide the function URL to the FullStory events webhook.  Enable CORS.

Use the FullStory webhook test button to make sure you get back a 200 reponse from your lambda.

## Debug

Use CloudWatch to look at inbound events and check they're properly handled.  Some events take time to propagate, but CloudWatch will give early indication of trouble.

## Author

David.Martin@split.io
