import vision from '@google-cloud/vision';
import {readFileSync } from 'node:fs';
import {resolve} from 'node:path'

const getMultipleTextFromGoogle = async (files) =>{
    // Creates a client
    const client = new vision.ImageAnnotatorClient();   
    const requests = [];
    const features = [{type: 'TEXT_DETECTION'}];
    files.forEach(element => {
        const filePath = resolve(element["path"])        
        const image = {
            content: readFileSync(filePath).toString('base64'),
        };
        const request = {
            image: image,
            features: features,
        };
        requests.push(request);
    });
    
    let [response] = await client.batchAnnotateImages({ requests: requests });
    return response.responses;
    
}

export default getMultipleTextFromGoogle