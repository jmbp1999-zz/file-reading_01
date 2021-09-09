const express = require('express');
const fs = require("fs");
const xlsx = require("xlsx");
const app = express();
const DataExtractor = require('./PVH_BEL_CKU W_Input Sheet');
app.get('/',(req,res)=>{

    ////////////////////////
    const workbook = xlsx.readFile('PVH_BEL_CKU W_Input Sheet.xlsx');
    let worksheets = {};
    for (const sheetName of workbook.SheetNames){
        worksheets[sheetName] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    }
    res.send(DataExtractor.getData(worksheets));


    /////////////////////////
})

app.listen(3000,()=>{
    console.log("Server is up and Running on PORT 3000");
})