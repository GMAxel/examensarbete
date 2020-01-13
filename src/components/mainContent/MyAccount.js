import React, {useEffect} from 'react'
import Axios from 'axios';
import DataContext from '../../contexts/DataProvider';

const API_PATH = 'http://localhost/wies/examensarbete/examensarbete/api/queryHandler.php'

const MyAccount = () => {

    // useEffect(() => {
    //     Axios.get(API_PATH, {
    //         action: 'myAccount',
    //     })
    //     .then((response) => {
    //         console.log(response)
    //         // Rerouta användaren vid sucess.
    //     })
    //     .catch((error) => {
    //         console.log(error.response);
    //         // Visa felet för användaren.
    //     })
    //     .finally(function () {
    //         // always executed
    //     });    
    // }) 
    

    return (
        <div className="mainContentStyle">
            {/* <DataContext.Consumer>
                {(context) => (
                    <p>Hello</p>
                )}
            </DataContext.Consumer> */}
        </div>
    
    )
}

export default MyAccount;