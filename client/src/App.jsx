
import { useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import Axios from 'axios'

import './App.css'

function App() {
  const [isPulledNameVisible, setIsPulledNameVisible] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [nameEntered, setNameEntered] = useState('');
  const [pulledName, setPulledName] = useState('');
  const [data, setData] = useState([]);
  const server = 'https://namepullerservice.onrender.com'
  const toastTopCenter = useRef(null);
  const fileName = "Names.json";

  useEffect(() => {
    const loadData = async () => {
      try {
        // Notify the user that the server is spinning up
        showMessage('warn', 'Server Spinning Up', 'Please wait...');
        Axios.post(server+'/getData', { fileName }).then((response) => {
        const result = response.data;
        if (result.length !== 0) {
          setData(result);
        }
        // Update the message once the server is up
        if (data.length !== 0){
        showMessage('success','Server is Up', 'Data loaded successfully.');
        }
      })
      } catch (error) {
        console.log(error);
        // Notify the user about the server error
        showMessage('error','Server Error', 'An error occurred.');
      }
    };
  
    loadData();
  }, []);

const sendData = async (writtenData) => {
  if (writtenData.length) {

    try {
      await Axios.post(server+"/writeData", { fileName, writtenData })
    } catch (error) {
      console.log(error);
    };
  };
};

const showMessage = (severity, summary, detail) => {
  toastTopCenter.current.show([
    { severity: severity, summary: summary, detail: detail, life: 3000 }
  ])
}

const checkNames = () => {
  const names = data.map((i) => {
    const name = i.name
    return name.toUpperCase()
  })
  if (names.includes(nameEntered.toUpperCase())) {
    setButtonClicked(true);
    return true;
  } else {
    setButtonClicked(false)
    showMessage("you're not on the list", "Hey, a lotta people's girlfriends are in there")
    return false;
  }
}

const checkDrawn = () => {
  const index = data.findIndex((obj) => obj.name.toUpperCase() === nameEntered.toUpperCase())
  if (data[index].drawn === true) {
    return false
  } else {
    return true
  }
}

const drawName = () => {
  const names = data.map((i) => {
    if (nameEntered.toUpperCase() === i.name.toUpperCase()) {
      return null;
    }
    if (i.pickedBy !== "") {
      return null;
    }
    else {
      return i
    }
  })
  const modNames = names.filter((element) => element !== null)
  const randomName = Math.floor(Math.random() * modNames.length);
  return modNames[randomName];
}

const handleButtonClick = async () => {
  if (nameEntered.length === 0) {
    showMessage('error','Sorry', "I can't let you through")
  } else {
    if (checkNames()) {
      if (checkDrawn()) {
        const randomName = drawName();
        const arr = data;
        const index = arr.findIndex((obj) => obj.name === randomName.name);
        arr[index].pickedBy = nameEntered;

        const index2 = arr.findIndex((obj) => obj.name.toUpperCase() === nameEntered.toUpperCase());
        arr[index2].drawn = true;

        const writtenData = arr
        setPulledName(randomName.name)
        setTimeout(() => { setIsPulledNameVisible(true); }, 2000)
        sendData(writtenData)

      } else {
        showMessage('error',`I'm sorry, ${nameEntered}`, "I can't let you do that.")
      }
    };
  }
};

const showPulledName = () => {
  if (isPulledNameVisible) {
    return (
      <p className="pulled-name">{pulledName}</p>
    );
  }
  return null;
};

return (
  <div>
    <Toast ref={toastTopCenter} position="top-center" />
    <div className="p-inputgroup">
      <InputText
        placeholder="Enter Name"
        onChange={(e) => setNameEntered(e.target.value)}
      />
    </div>
    <div className="center-container">
      <div className="buttonContainer">
        <Button
          className={`drawButton ${buttonClicked ? 'clicked' : ''}`}
          onClick={handleButtonClick}
        >
          Draw Name
        </Button>
        <div className="fade-box">
          {showPulledName()} {/* Render the pulledName */}
        </div>
      </div>
    </div>
  </div>
);
}

export default App;
