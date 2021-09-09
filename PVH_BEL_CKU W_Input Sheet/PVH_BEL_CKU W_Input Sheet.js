const unique= require('array-unique');

function getData(worksheets){
    //This function combine all the other functions and return the value
    const Standardize_CO = worksheets["Standardize CO"]

    const Standardize_BOM = worksheets["Standardize BOM"]

    const M = Slicer(Standardize_CO) //M is the Partitions from which row to which row headers and tables are 
    const headers = Standardize_CO.slice(M[0][0],M[0][1]);  // slice the data and get the headers
    const table = Standardize_CO.slice(M[1][0],M[1][1]);    // slice the data and get the table details


    const obj = {} //Create an object to send 
    obj["Standardize BOM"] =Standardize_BOM 
    obj["Standardize CO Headers"] = Header(headers) //calling Header function to get the Data in the correct format
    obj["Standardize CO Body"] = Body(table)    //calling the Body function to get the Data in the Correct Format
    return obj;

}
function Header(array){ //Extract the Header Data
    const final_01 = []
    array.forEach(element => {
        let keys = Object.keys(element);
        for(let i=0;i<keys.length;i=i+2){
            const key =String(element[keys[i]]);
            const obj1 = {};
            const obj2 = {};
            obj1[key] = element[keys[i+1]]
            obj2[keys[i]] = keys[i+1]
            final_01.push(obj2)
            final_01.push(obj1)
        }
    });
    const unique_keys = [];
    const unique_data = [];
    final_01.forEach(e=>{
        if(!unique_keys.includes(Object.keys(e)[0])){
            unique_keys.push(Object.keys(e)[0])
            unique_data.push(e)
        }
    })
    console.log(unique_keys);
    return unique_data;
}
function Body(L){
    //Extract the Table data



    let keys = [];
    for(let i=0;i<L.length;i++){
        keys=[...keys,...Object.keys(L[i])]
    }
    let common_keys = unique(keys);
    let final=[]
    for(let i=0;i<common_keys.length;i++){
        let info = [];
        for (let j=0;j<L.length;j++){
            if(L[j][common_keys[i]]){
                info.push(L[j][common_keys[i]]);
            }
            else{
                info.push('');
            }
        }
        final.push(info);
    }

    let arr_01 = []
    for (let m=0;m<final.length;m++){
        let arr_=[]
        for(let n=1;n<final[m].length;n++){
            arr_.push([final[m][0],final[m][n]])
        }
        arr_01.push(arr_)
    }
    let arr_02 = []
    for(let y=0;y<arr_01[0].length;y++){
        let arr_=[];
        for(let x=0;x<arr_01.length;x++){
            arr_.push(arr_01[x][y])
        }
        arr_02.push(arr_)

    }
    let final_=[]
    for(let y=0;y<arr_02.length;y++){
        let f=[]
        for(let x=0;x<arr_02[0].length;x++){
            let name = arr_02[y][x][0]
            let obj = {};
            obj[name] = arr_02[y][x][1];
            f.push(obj);
        }
        final_.push(f);
    }

    return final_;
}
function Slicer(array){  //This function partition the array according to an unexpected change in the rows.
    let key_array = [];
    let distances = [];
    array.forEach((item)=>{
        key_array.push(Object.keys(item));
    })
    for(let i=0;i<key_array.length-1;i++){
        distances.push(levenshteinDistance(key_array[i],key_array[i+1]))

    }
    let slices =[];
    let start = 0;
    for(let m=0;m<distances.length;m++){
        if(distances[m]>12){
            slices.push([start,m+1])
            start = m+1

        }
    }
    slices.push([start,distances.length+1]);
    return slices;
}
const levenshteinDistance = (arr1,arr2) => {

    /*
    * This is for getting the Difference of two arrays that helps for Partitioning.
    *
    *
    *
    * */

    const track = Array(arr2.length + 1).fill(null).map(() =>
        Array(arr1.length + 1).fill(null));
    for (let i = 0; i <= arr1.length; i += 1) {
        track[0][i] = i;
    }
    for (let j = 0; j <= arr2.length; j += 1) {
        track[j][0] = j;
    }
    for (let j = 1; j <= arr2.length; j += 1) {
        for (let i = 1; i <= arr1.length; i += 1) {
            const indicator = arr1[i - 1] === arr2[j - 1] ? 0 : 1;
            track[j][i] = Math.min(
                track[j][i - 1] + 1, // deletion
                track[j - 1][i] + 1, // insertion
                track[j - 1][i - 1] + indicator, // substitution
            );
        }
    }
    return track[arr2.length][arr1.length];
};
module.exports = {getData}