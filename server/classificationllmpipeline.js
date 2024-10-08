//let { pipeline, env } = import('@xenova/transformers');
import {pipeline} from "@xenova/transformers";
const task = 'zero-shot-classification';
//const task = 'sentiment-analysis'
const llmodel = 'facebook/bart-large-mnli';
let progress_callback = null;
//const pipe = await pipeline(task, model, {progress_callback});
const pipe = await pipeline(task);

export default pipe;