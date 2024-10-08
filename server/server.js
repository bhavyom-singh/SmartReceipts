import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors());
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });
import googlemultipletextextractor from './googletextextractormultiple.js';
import xlsxCreater from './xlsxcreater.js'
import envs from './config.js';
import receiptOverview from './llmreportoverview.js'
import structureTextFromGoogleMultiple from './textformattormultiple.js'
import path from 'path'
import { fileURLToPath } from 'url';

app.post("/uploadmultiplereceipt", upload.array('files', 10), async (req, res) => {
    let error_all;
    if(req.files.length>0){
        let googleRes = await googlemultipletextextractor(req.files)
        let formattedText = [];
        googleRes.forEach(element => {
            formattedText.push(structureTextFromGoogleMultiple(element.textAnnotations));
        });

        await receiptOverview(structuredClone(formattedText))
        .then(async (result) => {
            formattedText.push(result)
            formattedText.reverse()
            let filepath = await xlsxCreater(formattedText);
            res.json(filepath);
        })
        .catch(error => { error_all = error;
            console.log(error)
        })
    }
    res.json(error_all)
    res.status(500).end()
})

app.get("/downloadexcel/:filepath", (req, res) => {
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    res.setHeader(
        "Content-Disposition",
        `attachment; filename= "${req.params.filepath}"`
      );

    const __dirname = path.dirname(fileURLToPath(import.meta.url));


    let filePath = path.join(__dirname,"xlxsFiles", req.params.filepath)
    res.download(filePath, (err) => {
        if (err) {
            res.status(500).send('Error sending file');
        }
    });    

})

app.listen(5000, ()=>{console.log("Server started at port 5000")})