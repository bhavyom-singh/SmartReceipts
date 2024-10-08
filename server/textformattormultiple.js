import classificationllmpipeline from './classificationllmpipeline.js';
const structureTextFromGoogleMultiple = (googleResponse) => {
    let dollarAmount = []
    googleResponse.reverse()
    googleResponse.pop()
    googleResponse.reverse()
    googleResponse.sort((k1, k2) => k1.boundingPoly.vertices[0].y - k2.boundingPoly.vertices[0].y)
    
    dollarAmount = googleResponse.filter(element => useRegexForAmount(element.description))
    let receiptDate = googleResponse.filter(element => useRegexForDate(element.description))
    let receiptTime = googleResponse.filter(element => useRegexForTime(element.description))
    
    let namePriceDict = []
    dollarAmount.forEach(node1 =>{
        let intermediateNamePriceDict = {}
        let nameNodeArray = []
        googleResponse.forEach(node2 =>{
            if(
                node1.boundingPoly.vertices[0].x > node2.boundingPoly.vertices[1].x &&
                (
                    node1.boundingPoly.vertices[0].y == node2.boundingPoly.vertices[1].y ||
                    (node1.boundingPoly.vertices[0].y + 10 >= node2.boundingPoly.vertices[1].y &&
                    node1.boundingPoly.vertices[0].y - 10 <= node2.boundingPoly.vertices[1].y)
                )
                )
                {
                    nameNodeArray.push(node2)
                }
        })
        
        nameNodeArray.sort((k1, k2) => k1.boundingPoly.vertices[1].x - k2.boundingPoly.vertices[1].x)
        let namekey = nameNodeArray.map(k1=>k1.description).join(" ")
        
        intermediateNamePriceDict["name"] = namekey
        intermediateNamePriceDict["price"] = parseFloat(node1.description)
        
        namePriceDict.push(intermediateNamePriceDict)
        
    })
    
    const namePriceDict_copy = structuredClone(namePriceDict);
    
    return namePriceDict;
}
    



function useRegexForAmount(input) {
    let regex = /^[0-9]*\.[0-9][0-9]*$/i;
    return regex.test(input);
}

function useRegexForDate(input) {
    let regex = /^(1[0-2]|0?[1-9])(\/|-)(3[01]|[12][0-9]|0?[1-9])\2([0-9]{2})?[0-9]{2}$/i;
    return regex.test(input);
}

function useRegexForTime(input) {
    let regex = /(0?[0-9]|1[0-9]|2[0-3]):[0-9]+/i;
    return regex.test(input);
}

function removeUnnessaryWords(key) {
        let flag = true
        let strArr = key.split(' ')
        strArr.forEach(element => {
            if(['tax', 'sub total', 'card', 'balance', 'sale tax', 'rewards', 'savings', 'total', 'saved', 'discover', 'charge'].includes(element.toLowerCase()))
            {
                flag &= false;
            }
        });
    return flag;
}

async function receiptOverview(llmData){
    const llmData_copy = llmData
    let keys = []
    let label_price_percentage = []
    llmData.forEach(element=> { keys.push(element.name)});
    const candidate_labels = ["Apparel", "Electronics", "Food", "Finance", "Medical", "Others", "Supplies", "Toy"]
    
    await classificationllmpipeline(keys, candidate_labels)
        .then(result =>{
            let name_label_map = create_name_label_mapping(result);
            let label_price_map = create_price_label_mapping(name_label_map, llmData_copy);
            label_price_percentage = spend_analyzer(label_price_map);
        }).catch((error) =>{ return error}) 
    return label_price_percentage;
}

function create_name_label_mapping(llm_result){
    let name_label_mapping = []
    llm_result.forEach(element=>{
        let name_label_map = {};
        name_label_map["name"] = element.sequence;
        name_label_map["label"] = element.labels[0];
        name_label_mapping.push(name_label_map);
    });  
    return name_label_mapping;
}

function create_price_label_mapping(name_label_mapping, llmData){
    let label_price_map = []
    for(let i=0; i<name_label_mapping.length; i++){
        if(name_label_mapping[i].name==llmData[i].name){
            llmData[i].name = name_label_mapping[i].label;
        }
    }
    return llmData
}

function spend_analyzer(label_price_map){
    let total = 0
    label_price_map.forEach(element => {total += element.price})
    let label_price_percentage = []
    label_price_map.forEach(element => {
        let label_price = {}
        label_price["name"] = element.name
        label_price["percentage"] = Number(((element.price/total) * 100).toFixed(2));
        label_price_percentage.push(label_price);
    });
    return label_price_percentage;
}
export default structureTextFromGoogleMultiple;