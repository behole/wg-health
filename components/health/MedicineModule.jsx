'use client';

import React, { useState, useEffect } from 'react';

const MedicineModule = ({ onClose }) => {
  // Sample initial data
  const initialMedicineList = [
    { id: 1, name: 'Vitamin D', dosage: '1000 IU', schedule: 'Daily, Morning' },
    { id: 2, name: 'Probiotic', dosage: '1 capsule', schedule: 'Daily, Evening' },
    { id: 3, name: 'Acetaminophen', dosage: '500mg', schedule: 'As needed for pain' },
  ];

  // State for managing medicines
  const [medicines, setMedicines] = useState([]);
  const [isAddingMedicine, setIsAddingMedicine] = useState(false);
  const [newMedicine, setNewMedicine] = useState({ name: '', dosage: '', schedule: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data from Firebase
  useEffect(() => {
    // Import is inside useEffect to avoid SSR issues
    const fetchData = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const { getMedicines } = await import('../../lib/services/medicineService');
        const medicinesData = await getMedicines();
        
        // If no data exists yet, use sample data
        if (medicinesData.length === 0) {
          // Import is inside to avoid SSR issues
          const { addMedicine } = await import('../../lib/services/medicineService');
          
          // Add sample data if collection is empty
          const addedMedicines = await Promise.all(
            initialMedicineList.map(medicine => addMedicine(medicine))
          );
          
          setMedicines(addedMedicines);
        } else {
          setMedicines(medicinesData);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching medicines:", err);
        setError("Failed to load medications. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMedicine({ ...newMedicine, [name]: value });
  };

  // Add a new medicine
  const handleAddMedicine = async (e) => {
    e.preventDefault();
    if (newMedicine.name.trim() === '') return;
    
    const medicineToAdd = {
      name: newMedicine.name.trim(),
      dosage: newMedicine.dosage.trim(),
      schedule: newMedicine.schedule.trim()
    };
    
    try {
      // Dynamic import to avoid SSR issues
      const { addMedicine } = await import('../../lib/services/medicineService');
      const addedMedicine = await addMedicine(medicineToAdd);
      
      setMedicines([...medicines, addedMedicine]);
      setNewMedicine({ name: '', dosage: '', schedule: '' });
      setIsAddingMedicine(false);
    } catch (err) {
      console.error("Error adding medication:", err);
      alert("Failed to add medication. Please try again.");
    }
  };
  
  // Delete a medicine
  const handleDeleteMedicine = async (id) => {
    if (!confirm("Are you sure you want to delete this medication?")) {
      return;
    }
    
    try {
      // Dynamic import to avoid SSR issues
      const { deleteMedicine } = await import('../../lib/services/medicineService');
      await deleteMedicine(id);
      
      // Update local state
      setMedicines(medicines.filter(medicine => medicine.id !== id));
    } catch (err) {
      console.error("Error deleting medication:", err);
      alert("Failed to delete medication. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <span className="text-3xl mr-2">💊</span>
            <h2 className="text-xl font-bold">Medicine</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {/* Medicine list */}
          <div className="mb-4">
            <h3 className="font-bold mb-2">Medication List</h3>
            
            {isLoading ? (
              <div className="py-4 text-center">
                <p>Loading medications...</p>
              </div>
            ) : error ? (
              <div className="py-4 text-center text-red-500">
                <p>{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-2 px-3 py-1 bg-black text-white rounded"
                >
                  Retry
                </button>
              </div>
            ) : medicines.length === 0 ? (
              <p className="text-gray-500">No medications added yet.</p>
            ) : (
              <ul className="space-y-2">
                {medicines.map(medicine => (
                  <li key={medicine.id} className="border-b border-gray-100 pb-2">
                    <div className="flex justify-between">
                      <div className="font-bold">{medicine.name}</div>
                      <button 
                        onClick={() => handleDeleteMedicine(medicine.id)}
                        className="text-red-500 text-xs"
                        aria-label="Delete medication"
                      >
                        ×
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      {medicine.dosage && <div>{medicine.dosage}</div>}
                      {medicine.schedule && <div>{medicine.schedule}</div>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Add medicine form */}
          {isAddingMedicine ? (
            <form onSubmit={handleAddMedicine} className="border rounded p-3 bg-gray-50">
              <div className="mb-3">
                <label className="block text-sm mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newMedicine.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="Medication name"
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm mb-1">Dosage</label>
                <input
                  type="text"
                  name="dosage"
                  value={newMedicine.dosage}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., 500mg, 1 tablet (Optional)"
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm mb-1">Schedule</label>
                <input
                  type="text"
                  name="schedule"
                  value={newMedicine.schedule}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Daily, Morning (Optional)"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddingMedicine(false)}
                  className="px-3 py-1 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-black text-white rounded"
                >
                  Add
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsAddingMedicine(true)}
              className="w-full py-2 text-center border-2 border-black rounded-full font-bold"
            >
              + Add Medication
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicineModule;