import './MonthlyCalculator.css';
import {Button,Container,Stack} from "react-bootstrap";
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


function MonthlyCalculator(){


    return (
        <div>
               
                <div className='me-auto'>
                    <h1 className="expenseTitle">Manage Your Expenses </h1>
                    
                </div> 
                    <Stack direction='horizontal'>
                    <Button className='upperButtons' > Manage Catogories</Button>
                    <Button className='upperButtons'>Graphs</Button>
                    <Button className='upperButtons'>History</Button>   
                    </Stack>
                    
                <div>
                <h2 className='infoExpense'> Add your Expenses according to catogories</h2>
                </div>
                
           </div>
    )
}
    
    

export default MonthlyCalculator;