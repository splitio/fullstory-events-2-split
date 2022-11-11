const properties = 
	{
		hostname_bool:false,
		impression:
			{
				changeNumber_real:1667920819383,
				feature_str:"multivariant_demo",
				keyName_str:"a5ad5f75-e379-477e-97bc-585710c0c659",
				label_str:"default rule",
				time_real:1668106790992,
				treatment_str:"blue"
			},
		ip_bool:false,
		sdkLanguageVersion_str:"javascript-10.15.9",
		colors: {
			rainbow: ["red", "orange", "yellow"],
			prison: ["gray"],
			invisible: {
				noface: {
					character: "miyazake"
				}
			}
		}
	};

function flattenObject (obj, prefix) {
  const flattened = {}

  Object.keys(obj).forEach((key) => {
    const value = obj[key]

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value, prefix + key + '.'))
    } else {
      let index = prefix + key;
      flattened[index] =  value
    }
  })

  return flattened
}

console.log(JSON.stringify(properties, null, 2));

const flattened = flattenObject(properties, '');

console.log(flattened);
