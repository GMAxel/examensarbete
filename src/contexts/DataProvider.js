import React, {useState} from 'react';

const DataContext = React.createContext();

const DataProvider = (props) => {
    const [firstName, setFirstName] = useState('Axel');
    const [lastName, setLastName] = useState('Tryde');

    return (
        <DataContext.Provider>
            {props.children}
        </DataContext.Provider>
    )
}

export default DataContext;