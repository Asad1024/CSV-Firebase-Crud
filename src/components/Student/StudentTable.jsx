import { useState } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { database } from "../../firebaseConfig";

const StudentTable = ({ studentsData, fetchData }) => {
  const [editingStudents, setEditingStudents] = useState({});
  const [editedStudentData, setEditedStudentData] = useState({
    name: null,
    age: null,
    marks: null,
  });

  const handleEdit = (studentId) => {
    setEditingStudents({ ...editingStudents, [studentId]: true });
    setEditedStudentData({
      ...studentsData.find((student) => student.id === studentId),
    });
  };

  const handleUpdate = async (student) => {
    try {
      await updateDoc(doc(database, "students", student.id), student);
      fetchData();
      setEditingStudents({ ...editingStudents, [student.id]: false });
      setEditedStudentData({
        name: null,
        age: null,
        marks: null,
      });
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleCancelEdit = (studentId) => {
    setEditingStudents({ ...editingStudents, [studentId]: false });
    setEditedStudentData({
      name: null,
      age: null,
      marks: null,
    });
  };

  const handleDelete = async (studentId) => {
    try {
      await deleteDoc(doc(database, "students", studentId));
      fetchData();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <>
      <h2 style={{ marginBottom: "10px" }}>Student List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Marks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {studentsData.map((student) => (
            <tr key={student.id}>
              <td>
                {editingStudents[student.id] ? (
                  <input
                    type="text"
                    value={
                      editedStudentData.name !== null
                        ? editedStudentData.name
                        : student.name
                    }
                    onChange={(e) =>
                      setEditedStudentData({
                        ...editedStudentData,
                        name: e.target.value,
                      })
                    }
                  />
                ) : (
                  student.name
                )}
              </td>
              <td>
                {editingStudents[student.id] ? (
                  <input
                    type="number"
                    value={
                      editedStudentData.age !== null
                        ? editedStudentData.age
                        : student.age
                    }
                    onChange={(e) =>
                      setEditedStudentData({
                        ...editedStudentData,
                        age: e.target.value,
                      })
                    }
                  />
                ) : (
                  student.age
                )}
              </td>
              <td>
                {editingStudents[student.id] ? (
                  <input
                    type="number"
                    value={
                      editedStudentData.marks !== null
                        ? editedStudentData.marks
                        : student.marks
                    }
                    onChange={(e) =>
                      setEditedStudentData({
                        ...editedStudentData,
                        marks: e.target.value,
                      })
                    }
                  />
                ) : (
                  student.marks
                )}
              </td>
              <td>
                {editingStudents[student.id] ? (
                  <>
                    <button onClick={() => handleUpdate(editedStudentData)}>
                      Update
                    </button>
                    <button onClick={() => handleCancelEdit(student.id)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(student.id)}>Edit</button>
                    <button onClick={() => handleDelete(student.id)}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default StudentTable;
