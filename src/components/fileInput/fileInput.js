import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom'
import {actions} from '../../store'
import {readFile} from '../../util/csvToJson'

function FileInput() {
  const [csvFile,setCsvFile] = useState(null)
  const [errorText,setErrorText] = useState("")
  const [fileName,setFileName] = useState("")
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const submit = (e)=>{
    e.preventDefault();
    if(csvFile) {
      dispatch(actions.loading(true))
      readFile(csvFile,dispatch);
      navigate('/dataTable')
    }else{
      setErrorText('*No File Selected')
    }
  }
  
  const handleOnChange = (e)=>{
    setErrorText('')
    setFileName(`Selected - ${e.target.files[0].name}`)
    setCsvFile(e.target.files[0])
  }

  return (
    <div className='fileInput flex'>
        <form>
          <input 
            type="file"
            accept=".csv"
            id="file"
            className="file"
            onChange={handleOnChange}>
          </input>
          <label htmlFor="file">Select file</label>
          <button type="submit" className='secondary submit' onClick={submit}>Submit</button>
          <div className="msgs flex">
            <p className='fileName'>{fileName}</p>
            <p className='errorText'>{errorText}</p>
          </div>
        </form>
      </div>
  );
}

export default FileInput;
