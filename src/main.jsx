import React from 'react';
import  ReactDom from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import StoreContextProvider from './context/StoreContext'


ReactDom.createRoot (document.getElementById('root')).render(
 <BrowserRouter>
 <StoreContextProvider>
<App/>
 </StoreContextProvider>
 
 
 </BrowserRouter>
 

)
