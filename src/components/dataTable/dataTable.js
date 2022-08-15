import {useSelector, useDispatch} from 'react-redux'
import {useNavigate, Link} from 'react-router-dom'
import { useEffect } from 'react'
import {actions} from '../../store'
import MUIDataTable from "mui-datatables";
import Select from 'react-select'
import Loader from '../loader/loader'

const DataTable = ()=>{
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const inventoryDetails = useSelector(state => state.aggregatedDetails)
    // const inventoryDetails2 = [{showName:"1",showStock:25,showDeal:"123",showMrp:"123",showFree:"FREE",showRate:"RATE",showExp:"AD"}]
    const loading = useSelector(state => state.loading)
    const tableOptions ={
        download:false,
        filter:false,
        viewColumns: false,
        print:false,
        selectableRows:"none",
        searchAlwaysOpen: true
    }
    const options ={options:  {
            sort: true,
        }
    }
    const handleSelectChange = (data,product) =>{
        dispatch(actions.updateAggDetails([data.value,product]))
    }
    const columns = [{
            name: "name",
            label: "Name",
            ...options
        },{
            name: "batches",
            label: "Batches",
            options:{
                sort:false,
                customBodyRender: (values, tableMeta, updateValue) => {
                    return <Select 
                    className='select'
                    options={values}
                    defaultValue={values[0]}
                    value={values.find((option) => {
                        return option.selected === true;
                      })}
                    onChange={(data) => handleSelectChange(data,tableMeta.rowData[0])}
                    />;
                  },
            }
        },{
            name: "stock",
            label: "Stock",
            ...options
        },{
            name: "deal",
            label: "Deal",
            ...options
        },{
            name: "free",
            label: "Free",
            ...options
        },{
            name: "mrp",
            label: "MRP",
            ...options
        },{
            name: "rate",
            label: "Rate",
            ...options
        },{
            name: "exp",
            label: "Expiry Date",
            ...options
        },{
            name: "company",
            label: "companyName",
            ...options
        }
    ]
    useEffect(()=>{
        if(inventoryDetails.length === 0 && !loading) navigate('/')
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return(
        <div className='flex tablePage'>
            {loading && <Loader />}
            <Link to="/charts" className='secondary flex link'>View Charts</Link>
            <h4>Inventory Details</h4>
            <MUIDataTable
                className="table"
                title={"Inventory Details"}
                data={inventoryDetails}
                columns={columns}
                options={tableOptions}
                />
        </div>
    )
}

export default DataTable