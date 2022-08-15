import FileInput from './components/fileInput/fileInput'
import DataTable from './components/dataTable/dataTable'
import Charts from './components/charts/charts'
import Header from './components/header/header'
import ErrorPage from './components/errorPage/errorPage'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Header title="Inventory" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FileInput/>} />
          <Route path="/dataTable" element={<DataTable/>} />
          <Route path="/charts" element={<Charts/>} />
          <Route path="/*" element={<ErrorPage/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
