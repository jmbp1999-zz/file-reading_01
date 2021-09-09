const express = require('express');
const fs = require("fs");
const xlsx = require("xlsx");
const excel  = require('./excel');
const app = express();


app.get('/',(req,res)=>{
    const workbook = xlsx.readFile('PVH_BEL_CKU M_AA Sheet.xlsx');

    let worksheets = {};
    for (const sheetName of workbook.SheetNames){
        worksheets[sheetName] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    }
    const AA = worksheets['AA']
    res.send(AA);

})

app.listen(3000,()=>{
    console.log("Server is up and Running on PORT 3000");
})
