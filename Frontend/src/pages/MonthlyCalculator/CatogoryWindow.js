
import { useEffect, useState } from "react";
import './MonthlyCalculator.css';


function CatogoryWindow({isWindowOpen,windowClose }){
  const [addButtonClicked, setAddButtonClicked] = useState(false);
  const [removeButtonClicked, setRemoveButtonClicked] = useState(false);
  const [isAdditionWindowOpen,setAdditionWindowOpen] = useState(false);
  const [isDeletionWindowOpen,setDeletionWindowOpen] = useState(false);
  useEffect(()=>{
    if(isWindowOpen){
      setAdditionWindowOpen(true);
    setDeletionWindowOpen(false);
    setAddButtonClicked(true);
    setRemoveButtonClicked(false); 
    }
  },[isWindowOpen]);

  const additionWindow = () =>{
    setAdditionWindowOpen(true);
    setDeletionWindowOpen(false);
    setAddButtonClicked(true);
    setRemoveButtonClicked(false); 
  }

  const deletionWindow = () =>{
    setDeletionWindowOpen(true);
    setAdditionWindowOpen(false);
    setAddButtonClicked(false);
    setRemoveButtonClicked(true);

   
  }
 


  const [catogoryName, setCatogoryName] = useState('');
  const handleAddCategory=()=>{
        if(catogoryName.trim===0){
          alert('Catogory Name is required');
          return;
        }
        setCatogoryName('');

  }
  
  
  
  



    
    return(

        <div className="catogoryWindow" style={{ display: isWindowOpen ? 'block' : 'none' }}>
          <h3 style={{marginTop:"2%"}}>Add or Remove Catogories</h3>
          <div className="tabs-block">
            <button className={`tab ${addButtonClicked ? 'clicked' : ''}`} onClick={additionWindow}>Add</button>
            <button className={`tab ${removeButtonClicked ? 'clicked' : ''}`} onClick={deletionWindow}>Remove</button>
          </div>
          <div className="tab-content">
            <div className="additionWindow" style={{ display: isAdditionWindowOpen ? 'block' : 'none' }}>
              <form>
                <label style={{fontSize:'large'}}>
                  Catogory Name: 
                </label>
                <br></br>
                <input className="catogoryNameInputBox"
                  type="text"
                  value={catogoryName}
                  onChange={(e) =>setCatogoryName(e.target.value)}
                  required 
                  placeholder="i.e XYZ supermarket"
                  />
                  <br></br>
                  <button className="catogoryButton"   type="button" onClick={handleAddCategory}>Add Category</button>             
                  <button className="catogoryButton"  onClick={windowClose}>Close</button>
              </form>
              
          </div>
          <div className="deletionWindow" style={{ display: isDeletionWindowOpen ? 'block' : 'none' }}>
                  <button className="catogoryButton"   type="button" >Remove Category</button>             
                  <button className="catogoryButton"  onClick={windowClose}>Close</button>
            
          </div>
          
        </div>
        </div>
            
      
     )
}
export default CatogoryWindow;