import { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { database } from "../firebaseConfig";
import StudentTable from "./Student/StudentTable";
import { toast } from "react-toastify";
import Loader from "./Loader";

const Dashboard = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: "",
    age: "",
    marks: "",
  });
  
  const [csvData, setCsvData] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  console.log(csvData);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoadingData(true); 
      const querySnapshot = await getDocs(collection(database, "students"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudentsData(data);
      setIsLoadingData(false); 
    } catch (error) {
      console.error("Error fetching data from Firestore:", error);
      setIsLoadingData(false); 
    }
  };

  const handleCreate = async () => {
    if (!newStudent.name || !newStudent.age || !newStudent.marks) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      await addDoc(collection(database, "students"), newStudent);
      setNewStudent({ name: "", age: "", marks: "" });
      fetchData();
      toast.success("Successfully Created");
    } catch (error) {
      console.error("Error creating a new student:", error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const fileText = await file.text();
        const parsedData = parseCSV(fileText);
        setCsvData(parsedData);
        await storeCSVDataInFirestore(parsedData);
        fetchData();
      } catch (error) {
        console.error("Error parsing CSV file:", error);
      }
    }
  };

  const storeCSVDataInFirestore = async (data) => {
    const batch = [];
    const studentsCollection = collection(database, "students");
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const dataObject = {
        name: row[0],
        age: parseInt(row[1]),
        marks: parseFloat(row[2]),
      };
      batch.push(addDoc(studentsCollection, dataObject));
    }

    await Promise.all(batch);
  };

  const parseCSV = (csvText) => {
    const rows = csvText.split("\n");
    const parsedData = rows.map((row) => row.split(","));
    return parsedData;
  };

  return (
    <div className="container">
      {isLoadingData ? ( 
        <Loader />
      ) : (
        !isLoadingData && studentsData.length > 0 ? (
          <>
            <div className="newStudent">
              <h2 style={{ marginBottom: "10px" }}>Add New Student</h2>
              <input
                type="text"
                placeholder="Name"
                value={newStudent.name}
                required
                onChange={(e) =>
                  setNewStudent({ ...newStudent, name: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Age"
                value={newStudent.age}
                required
                onChange={(e) =>
                  setNewStudent({ ...newStudent, age: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Marks"
                value={newStudent.marks}
                required
                onChange={(e) =>
                  setNewStudent({ ...newStudent, marks: e.target.value })
                }
              />
              <button
                onClick={handleCreate}
                style={{ width: "30%", margin: "10px 0 20px 0", padding: "10px" }}
              >
                Add Student
              </button>
            </div>
            <StudentTable studentsData={studentsData} fetchData={fetchData} />
          </>
        ) : (
          <div className="import">
            <span>Import File</span>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="importInput" />
          </div>
        )
      )}
    </div>
  );
};

export default Dashboard;
