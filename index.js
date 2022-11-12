const axios = require('axios');
const fs = require('fs');

function flattenObject (obj, prefix) {
  const flattened = {}

  Object.keys(obj).forEach((key) => {
    let value = obj[key]

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value, (!prefix ? '' : prefix) + key + '.'))
    } else {
      if(Array.isArray(value)) {
          let array_str = ''
          for(const i in value) {
              array_str += '"' + value[i] + '", ';
          }
          if(array_str.lastIndexOf(',') !== -1) {
              array_str = array_str.substring(0, array_str.lastIndexOf(','));
          }
          value = '[' + array_str + ']';
      }
      if(!prefix) {
          prefix = '';
      }
      let index = prefix + key;
      flattened[index] =  value
    }     
  })    

  return flattened
}

exports.handler = async (event) => {
    const startTimeInMillis = new Date().getTime();
    console.log(event);
    const body = JSON.parse(event.body);
    console.log(body.data);

    let userId;
    if(body.data.sessionUrl) {
        userId = body.data.sessionUrl.split('/').pop().split(':')[0];
    } else {
        const response = {
            statusCode: 200,
            body: JSON.stringify('no sessionUrl found; noop')
        }
        return response;
    }
    console.log('userId: ' + userId);

    const apiKey = fs.readFileSync('FULLSTORY_API_KEY', 'utf8').trim();
    const endpoint = 'https://api.fullstory.com/v2beta/users/' + userId;

    let key = "placeholder";
    await axios.get(endpoint, { headers: {'Authorization': 'Basic ' + apiKey, 'Content-Type': 'application/json'}})
    .then((response) => {
        key = response.data.uid;
     }).catch((error) => {
        console.log(error);
        const response = {
            statusCode: 400,
            body: JSON.stringify('could not retrieve uid from api.fullstory.com')
        }
        return response;
    });        

    const events = 
    [
        {
            eventTypeId: body.data.name, 
            trafficTypeName: "user", 
            key: key, 
            timestamp: new Date(body.data.timestamp).getTime(), 
            properties: flattenObject(body.data.properties),
            source: "FullStory"
        }   
    ];

    let splitValue = NaN;
    const splitProps = body.data.properties.split;
    // console.log(splitProps);
    if(splitProps && splitProps.value_real) {
        events[0]['value'] = splitProps.value_real;
    }

    const splitApiKey = fs.readFileSync('SPLIT_API_KEY', 'utf8').trim();
    console.log(events);
    await axios.post('https://events.split.io/api/events/bulk', events, { headers: {'Authorization': 'Bearer ' + splitApiKey }}) 
    .then(function (response) {
        console.log(response.status);
    })
    .catch(function (error) {
        console.log(error);
    })
    .finally(() => {
        let endTimeInMillis = new Date().getTime();
        console.log('finished events post in ' + (endTimeInMillis - startTimeInMillis));
    })

    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify('sent FullStory event to Split!'),
    };
    return response;
};


