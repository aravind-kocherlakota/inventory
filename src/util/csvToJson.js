import {actions} from '../store'

const readFile = (file,dispatch)=>{
    const reader = new FileReader()
    reader.onload = (e) =>{
        const json = convertToJson(e.target.result);
        dispatch(actions.setInventory(json))
    }
    reader.readAsText(file)
}

const convertToJson = (csv)=>{
    
    const array = csv.toString().split("\n");
    const csvToJsonResult = [];
    const headers = array[0].split(",")
    for (let i = 1; i < array.length - 1; i++) {
        const jsonObject = {}
        const currentArrayString = array[i]
        let string = ''

        let quoteFlag = 0
        /* in below loop we are interating and creating a string seperated by |
        Also we are taking case of string like "Aravind,kocherlakota" 
        (as we are dealing with csv these should not be takes as two diffrent values) */
        for (let character of currentArrayString) {
            if (character === '"' && quoteFlag === 0) {
                quoteFlag = 1
            }
            else if (character === '"' && quoteFlag === 1) quoteFlag = 0
            if (character === ',' && quoteFlag === 0) character = '|'
            if (character !== '"') string += character
        }

        let jsonProperties = string.split("|")

        for (let j in headers) {
            /* if header has value "aravind,kocherlakota" it will save as header: ["aravind", "kocherlakota"]*/
            if (jsonProperties[j].includes(",")) {
                jsonObject[headers[j]] = jsonProperties[j]
                    .split(",").map(item => item.trim())
            }
            else jsonObject[headers[j]] = jsonProperties[j]
        }
        csvToJsonResult.push(jsonObject)
    }
    return csvToJsonResult
}

export {readFile, convertToJson}