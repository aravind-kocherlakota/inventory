import {useSelector} from 'react-redux'
import {useNavigate,Link} from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Audio } from 'react-loader-spinner'
import Select from 'react-select'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PieChart from './pieChart'
import BarChart from './barChart'

const Charts = ()=>{
    const filterDistinctComapnyName = (state)=>{
        let lookup= {}
        let distinctNames = [];
        state.inventoryDetails.forEach((item) => {
            let company = item.company;
            if (!(company in lookup)) {
                lookup[company] = 1;
                distinctNames.push({label:company,value:company});
            }
        })
        return distinctNames
    }

    const navigate = useNavigate()
    const inventoryDetails = useSelector(state => state.inventoryDetails)
    const distinctCompanyName = useSelector(state => filterDistinctComapnyName(state))
    const loading = useSelector(state => state.loading)

    const [date, setDate] = useState(new Date());
    const [errorText, setErrorText] = useState('');
    const [companySelected, setCompanySelected] = useState('');
    const [loader, setLoader] = useState('');
    const [pieSeries, setPieSeries] = useState({series:[]});
    const [barSeries, setBarSeries] = useState({series:[],products:[]});

    

    const generatePie = ()=>{
        if(!companySelected) setErrorText("*Company name is not selected")
        else {
            setLoader(true)
            setErrorText('')
            const pieData = inventoryDetails.filter((item)=>{
                return item.company === companySelected
            })
            let expiredCount = 0
            let notExpiredCount = 0
            let notValid = 0
            const dateNow = new Date()
            pieData.forEach(item =>{
                let expDate = item.exp
                expDate = expDate.split("/");
                expDate = new Date(+expDate[2], expDate[1] - 1, +expDate[0]); 
                if(isNaN(expDate)) notValid += 1
                else if(expDate > dateNow) notExpiredCount += 1
                else if(expDate <= dateNow) expiredCount+=1
                setPieSeries({series:[expiredCount,notExpiredCount,notValid],titleName:companySelected})
                setLoader(false)
            })
            
        }
    }

    const generateBar = ()=>{
        if(!companySelected) setErrorText("*Company name is not selected")
        else if(!date) setErrorText("*Date is not selected")
        else {
            setLoader(true)
            setErrorText('')
            const month = date.getMonth()+1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1
            const dateFormatted = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
            const dateSelected = `${dateFormatted}/${month}/${date.getFullYear()}`
            const barData = inventoryDetails.filter((item)=>{
                return item.company === companySelected && item.exp === dateSelected
            })
            let barDataPoints = {}
            barData.forEach(data =>{
                if(!barDataPoints[data.name]) barDataPoints[data.name] = 1
                else barDataPoints[data.name] += 1
            })
            setBarSeries({series: Object.values(barDataPoints), products : Object.keys(barDataPoints),titleName: `${companySelected} - ${dateSelected}`})
            if(!Object.keys(barDataPoints).length) setErrorText('*No Data present for slected date and company')
            setLoader(false)
        }
    }


    useEffect(()=>{
        if(inventoryDetails.length === 0 && !loading) navigate('/')
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return(
        <div className='charts flex'>
            <Link to="/dataTable" className='secondary flex link'>View Table</Link>
            <div>
                <p>*Below Pie chart represents expired and not expired product for a selected  (date slection not required)  </p>
                <p>*Below Bar chart represents number of products expiring for selected date and company (name of product VS count of product expiring on that date)</p>
            </div>
            <div className='inputs flex'>
                <Select 
                    className='select'
                    isClearable
                    options={distinctCompanyName}
                    onChange={(data) => setCompanySelected(data?.value)}
                    />
                <DatePicker 
                    className="datePicker" 
                    selected={date} 
                    onChange={(date) => setDate(date)}
                    isClearable
                    placeholderText="Select Date"
                    />
            </div>
            <p className="errorText">{errorText}</p>
            <div className='buttons'>
                <button className='primary pieButton' onClick={generatePie}>Generte Pie Chart</button>
                <button className='primary barButton' onClick={generateBar}>Generte Bar Chart</button>
            </div>

            <div className='flex loader'>
            { loader  && 
            <Audio
                height = "80"
                width = "80"
                radius = "9"
                color = 'green'
                ariaLabel = 'three-dots-loading'     
                wrapperStyle
                wrapperClass
            />}

            </div>
            <div className='flex'>
                {pieSeries.series.length ? <PieChart series={pieSeries.series} titleName={pieSeries.titleName}/> : null}
                {barSeries.series.length && barSeries.products.length ?<BarChart series={barSeries.series} products={barSeries.products} titleName={barSeries.titleName}/> : null}
            </div>
        </div>
    )
}

export default Charts