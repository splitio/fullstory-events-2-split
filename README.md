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
{
  "environmentId": "194da2f0-3e22-11ea-ba75-12f2f63694e5",
  "environmentName": "Prod-Default",
  "eventTypeId": "colorful_click",
  "key": "truncate_session_id",
  "properties": {
    "bar.changeNumber_real": "1667920819383",
    "bar.feature_str": "multivariant_demo",
    "colors.invisible.noface.character_str": "miyazake",
    "split.value_real": "42",
    "colors.prison_strs": "[\"gray\"]",
    "colors.rainbow_strs": "[\"red\", \"orange\", \"yellow\"]",
    "foo_bool": "false"
  },
  "receptionTimestamp": 1668286727292,
  "timestamp": 1668286631425,
  "trafficTypeId": "194c6a70-3e22-11ea-ba75-12f2f63694e5",
  "trafficTypeName": "user",
  "value": 42
}
```
The hierarchy is flattened, but all the same information is available.

Note that if you want Split value, you must put the value in a split{} section, as shown in the example above.

```javascript
split: {
  value: 42
}, // etc.
```
## Installation

Clone the repository in an empty directory.  

Inside the directory created, copy your API keys (carefully) into files with the following names:

 - *SPLIT_API_KEY* (server-side API key for your desired environment)
 - *FULLSTORY_API_KEY* (I used admin)

An extra space at the end of the line, or empty lines after could spell disaster later.
The files must have precisely these names.

Now, from this same directory..

```
> npm install 
> zip -r fullstory.zip *
```

You can "brew install npm" on OSX.  Follow the instructions to install npm for other operating systems.

The fullstory.zip should include the index.js, the key files and a full node_modules directory.

A single node.js lambda does the work for the integration, using only the filesystem (for API keys) and the Axios HTTP client.  The integration makes two cheap API calls per FullStory event.

Install in AWS.  
 - Create a new "fullstory" lambda for Nodes.js
 - Upload fullstory.zip to the Code screen of your AWS lambda.  
 - Give the lambda a functional URL to POST to it.  Enable CORS and give the Allow Headers field a *  
 - Provide the function URL to the FullStory events webhook.

Use the FullStory webhook test button to make sure you get back a 200 reponse from your lambda.

In testing, it sometimes took 5-10 minutes for FS.event calls to propagate to Split.  Try reloading your page after a minute to accelerate the event publishing.

## Debug

Use CloudWatch to look at inbound events and check they're properly handled.  Some events take time to propagate, but CloudWatch will give early indication of trouble.

## Author

David.Martin@split.io
