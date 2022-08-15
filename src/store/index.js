import { createSlice, configureStore } from "@reduxjs/toolkit";

const inventorySlice = createSlice({
    name: "inventory",
    initialState :{
        loading: false,
        inventoryDetails: [],
        aggregatedDetails: []
    },
    reducers:{
        setInventory: (state,data) =>{
            const formatDate = (expDate)=>{
                expDate = expDate.split("/");
                expDate = new Date(+expDate[2], expDate[1] - 1, +expDate[0]); 
                return expDate
            }

            const calculate = (calcObj,item) =>{
                //stock
                if(calcObj.stock){
                    calcObj.stock = Number(calcObj.stock) + Number(item.stock)
                }else{
                    calcObj.stock = Number(item.stock)
                }
                //deal and free
                if(item.deal === 0 && item.free === 0){
                    calcObj.deal = 0
                    calcObj.free = 0
                    //consider 0/0 is minimum ratio
                }
                else if(calcObj.free === undefined && calcObj.deal === undefined){
                    calcObj.deal = item.deal
                    calcObj.free = item.free
                }
                else if(calcObj.free/calcObj.deal > item.free/item.deal){
                    calcObj.deal = item.deal
                    calcObj.free = item.free
                }
                //MRP
                if(calcObj.mrp){
                    calcObj.mrp = calcObj.mrp < item.mrp ? item.mrp : calcObj.mrp
                }else{
                    calcObj.mrp = item.mrp
                }
                //rate
                if(calcObj.rate){
                    calcObj.rate = calcObj.rate < item.rate ? item.rate : calcObj.rate
                }else{
                    calcObj.rate = item.rate
                }
                //date
                if(calcObj.exp){
                    const currentExp = formatDate(item.exp)
                    const exp = formatDate(calcObj.exp)
                    if(!isNaN(currentExp)){
                        if(exp > currentExp) calcObj.exp = item.exp
                    }
                }else{
                    calcObj.exp = item.exp
                }

                return calcObj

            }
            state.inventoryDetails = data.payload
            const aggDetails = {}
            data.payload.forEach(item =>{
                if(!aggDetails[item.name]) {
                    aggDetails[item.name] = {}
                }
                let tempObj = aggDetails[item.name]
                tempObj.company = item.company
                tempObj.name = item.name

                const batch = !item.batch ? "NA" : item.batch
                //nested aggregation
                if(tempObj[batch]){
                    tempObj[batch] = calculate(tempObj[batch], item)
                }else{
                    //if you don't want nested aggregation keep this outside 
                    tempObj[batch] = item
                }

                //total aggregation
                tempObj = calculate(tempObj,item)
                //batch arr
                if(tempObj.batches){
                    const pushObj = {label: batch, value:batch}
                    tempObj.batches.findIndex(ele => ele.value === batch) < 0 && tempObj.batches.push(pushObj)
                }else{
                    tempObj.batches = [{label:"ALL",value:"ALL",selected:true},
                                                     {label: batch, value:batch}]
                }
                //other
                tempObj.ALL = {}
                tempObj.ALL.stock = tempObj.stock
                tempObj.ALL.deal = tempObj.deal
                tempObj.ALL.free = tempObj.free
                tempObj.ALL.mrp = tempObj.mrp
                tempObj.ALL.rate = tempObj.rate
                tempObj.ALL.exp = tempObj.exp
                tempObj.ALL.name = item.name

            })
            state.aggregatedDetails = Object.values(aggDetails)
            state.loading = false
        },
        updateAggDetails: (state,data) =>{
            const batchName = data.payload[0]
            const productName = data.payload[1]
            const temp = state.aggregatedDetails.map(item => {
                if(item.name === productName){  
                    item.stock = item[batchName].stock
                    item.deal = item[batchName].deal
                    item.free = item[batchName].free
                    item.mrp = item[batchName].mrp
                    item.rate = item[batchName].rate
                    item.exp = item[batchName].exp
                    item.batches = item.batches.map((e) =>{
                        if(e.selected === true) e.selected =false
                        if(e.value === batchName) { return {...e,selected: true} }
                        return e
                })
                    return item
                }
                return item
            })
            state.aggregatedDetails = temp

        },
        loading :(state,data) =>{
            state.loading = data.payload
        }
    }
})

const store = configureStore({
    reducer: inventorySlice.reducer
})

export default store
export const actions =  inventorySlice.actions;