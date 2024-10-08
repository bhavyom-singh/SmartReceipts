import classificationllmpipeline from './classificationllmpipeline.js';

function removeUnnessaryWords(key) {
    let flag = true
    let strArr = key.split(' ')
    strArr.forEach(element => {
        if(['tax', 'sub total', 'subtotal', 'card', 'credit cards', 'credit', 'cash', 'balance', 'sale tax', 'rewards', 'savings', 'total', 'saved', 'discover', 'charge', 'usd'].includes(element.toLowerCase()))
        {
            flag &= false;
        }
    });
return flag;
}

async function receiptOverview(llmData){
    llmData = format_data_for_llm(llmData);
    llmData = llmData.filter(element => element.price>0 && removeUnnessaryWords(element.name))
    let keys = []
    let label_price_percentage = []
    llmData.forEach(element=> { keys.push(element.name)});
    const candidate_labels = ["Apparel", "Electronics", "Food", "Finance", "Medical", "Others", "Supplies", "Toy"]
    await classificationllmpipeline(keys, candidate_labels)
        .then(result =>{
            let name_label_map = create_name_label_mapping(result);
            let label_price_map = create_price_label_mapping(name_label_map, llmData);
            label_price_percentage = spend_analyzer(label_price_map);
        }).catch((error) =>{ return error}) 
    return label_price_percentage;
}

let format_data_for_llm = (formattedText) =>{
    let formattedTextflat = formattedText.flat()
    return formattedTextflat;    
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
    label_price_percentage = group_sum_spending(label_price_percentage)
    return label_price_percentage;
}

function group_sum_spending(label_price_percentage){
    const grouped = {};

    // Loop through the array of objects
    for (const obj of label_price_percentage) {
        const { name, percentage } = obj;
        // If the name already exists in the grouped object, add the percentage
        if (grouped[name]) {
            grouped[name].percentage += percentage;
        } else {
            // Otherwise, create a new entry for the name
            grouped[name] = { name, percentage };
        }
    }

    // Convert the grouped object values back to an array
    const result = Object.values(grouped);

    return result;
}

export default receiptOverview;