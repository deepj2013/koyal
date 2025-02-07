import React, { useState } from 'react';
// import { Link } from "react-router-dom";
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import configData from "../../config.json";
import successIcon from '../Spinningball.gif';

export default function Edit() {

  const [data, setData] = useState(null);  // To store the fetched JSON data
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  let intervalId = 0;
  let navCall = false;
  const [uploadStatus, setUploadStatus] = useState('Not uploaded');

  useEffect(() => {
    // Fetch JSON data from the URL
    fetch(configData.SERVER_URL+ 'setup_project_status/' + id)
      .then(response => response.json())
      .then(jsonData => {
        setData(jsonData.mux); // Set the structured_prompts data
        setIsLoading(false);  // Disable loading state
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);


  if (isLoading) {
    return <p>Loading...</p>;
  }

  // const [data, setData] = useState(initialData);

  const handleChange = (index, field, value) => {
    const updatedData = [...data];
    updatedData[index][field] = value;
    setData(updatedData);
  };

  const handleAdd = () => {
    setData([...data, [0, 0, "", ""]]);
  };

  const handleRemove = (index) => {
    const updatedData = data.filter((_, i) => i !== index);
    if(index == 0){
      updatedData[index][0] = 0;
    }else{
      updatedData[index][0] = updatedData[index-1][1];
    }
    setData(updatedData);
    // setData(data.filter((_, i) => i !== index));
  };

  // Function to insert a row between two rows
  const handleInsert = (index) => {
    const updatedData = [...data];
    const currRow = updatedData[index];
    var startTime = currRow[0];
    var endTime = currRow[1];
    var midTime = startTime + ((endTime - startTime) / 2);
    handleChange(index, 1, midTime)
    // const newCurrRow = [startTime,midTime,currRow[3],currRow[4]];
    // updatedData
    const newRow = [midTime, endTime, currRow[2], currRow[3]];

    updatedData.splice(index + 1, 0, newRow);  // Insert after the current row
    setData(updatedData);
  };

  function handleSubmit(event) {
    event.preventDefault();
    const filename_base = localStorage.getItem("filename_base");
    const url = configData.SERVER_URL + 'update_mux/' + filename_base;
    
    // Wrap the data array in an object with the required properties
    const requestData = {
        mux: data,
        use_s3: true
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    setUploadStatus(<>
      <span>Upload Started</span>
      <img src={successIcon} alt="Success Icon" style={{ width: '20px', marginLeft: '5px' }} />
    </>);
    axios.post(url, requestData, config)
        .then((response) => {
            console.log(response.data);
            setUploadStatus('Upload Complete!');
            navigate('/choice/'+id);
        })
        .catch(error => {
            console.error('Error updating mux:', error);
            setUploadStatus('Upload failed: ' + error.message);
        });
  }




  return (
    <div className="App">
      <h1>JSON Editor</h1>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Lyric</th>
            <th>Emotion</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <React.Fragment key={index}>
              <tr>
                <td>
                  <input
                    type="number"
                    value={row[0]}
                    onChange={(e) => handleChange(index, 0, parseFloat(e.target.value))}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row[1]}
                    onChange={(e) => handleChange(index, 1, parseFloat(e.target.value))}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row[2]}
                    onChange={(e) => handleChange(index, 2, e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row[3]}
                    onChange={(e) => handleChange(index, 3, e.target.value)}
                  />
                </td>
                <td>
                  <button onClick={() => handleRemove(index)}>Delete</button>
                  <button onClick={() => handleInsert(index)}>Insert Row Below</button>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <br></br><br></br>
      <button onClick={handleSubmit}>Save JSON</button>
      {/* <Link to="../narrative" relative="path">Narrative</Link>  */}
      <p>{uploadStatus}</p>
    </div>


  );
}


