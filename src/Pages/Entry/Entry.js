import { useState } from 'react';
import { parse } from 'papaparse';
import './Entry.css';

const Entry = () => {
  const [data, setData] = useState([]);
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  const handleFileInput = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const parsedData = parse(event.target.result, { header: true });
      setData(parsedData.data);
      parsedData?.data && setIsFileUploaded(true);
      console.log('parsed', parsedData);
    };

    reader.readAsText(file);
  };

  const calculateDaysWorked = (employee1, employee2, project) => {
    const entries = data.filter(entry => {
      return entry.EmpID === employee1 || entry.EmpID === employee2;
    });

    console.log('entries', entries);
  
    const projectEntries = entries.filter(entry => {
      return entry.ProjectID === project;
    });

    console.log('projectEntries', projectEntries);
  
    let daysWorked = 0;
  
    projectEntries.forEach(entry => {
      const startDate = new Date(entry.DateFrom);
      const endDate = entry.DateTo ? new Date(entry.DateTo) : new Date();
  
      const diffInMs = Math.abs(endDate - startDate);
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  
      daysWorked += diffInDays;
    });

    console.log('daysWorked', daysWorked);
  
    return daysWorked;
  };
  
  const findLongestWorkingPair = () => {
    let longestPair = { employee1: null, employee2: null, projectId: null, daysWorked: 0 };
  
    for (let i = 0; i < data.length; i++) {
      for (let j = i + 1; j < data.length; j++) {
        const employee1 = data[i].EmpID;
        const employee2 = data[j].EmpID;
        const project = data[i].ProjectID;
  
        const daysWorked = calculateDaysWorked(employee1, employee2, project);
  
        if (daysWorked > longestPair.daysWorked) {
          longestPair = {
            employee1,
            employee2,
            projectId: project,
            daysWorked,
          };
        }
      }
    }
  
    return longestPair;
  };
  
  const longestWorkingPair = findLongestWorkingPair();
  
  const renderTable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>Employee ID #1</th>
            <th>Employee ID #2</th>
            <th>Project ID</th>
            <th>Days worked</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{longestWorkingPair.employee1}</td>
            <td>{longestWorkingPair.employee2}</td>
            <td>{longestWorkingPair.projectId}</td>
            <td>{longestWorkingPair.daysWorked}</td>
          </tr>
        </tbody>
      </table>
    );
  };
  return (
    <div>
      <input type="file" onChange={handleFileInput} />
      {isFileUploaded && renderTable()}
    </div>
  );
}

export default Entry;
