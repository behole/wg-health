'use client';

import React, { useState } from 'react';

const SimpleMedicineModule = ({ onClose }) => {
  console.log("SimpleMedicineModule initializing...");
  
  // Sample initial data - used as the actual data for simplicity
  const initialMedicineList = [
    { id: 'sample1', name: 'Vitamin D', dosage: '1000 IU', schedule: 'Daily, Morning' },
    { id: 'sample2', name: 'Probiotic', dosage: '1 capsule', schedule: 'Daily, Evening' },
    { id: 'sample3', name: 'Acetaminophen', dosage: '500mg', schedule: 'As needed for pain' },
  ];

  // State
  const [medicines, setMedicines] = useState(initialMedicineList);
  const [isAddingMedicine, setIsAddingMedicine] = useState(false);
  const [newMedicine, setNewMedicine] = useState({ name: '', dosage: '', schedule: '' });

  // Add a medicine
  const handleAddMedicine = (e) => {
    e.preventDefault();
    if (newMedicine.name.trim() === '') return;
    
    const medicineToAdd = {
      id: 'new_' + Date.now(),
      name: newMedicine.name.trim(),
      dosage: newMedicine.dosage.trim() || '',
      schedule: newMedicine.schedule.trim() || ''
    };
    
    // Update UI
    setMedicines([...medicines, medicineToAdd]);
    setNewMedicine({ name: '', dosage: '', schedule: '' });
    setIsAddingMedicine(false);
  };

  // Delete a medicine
  const handleDeleteMedicine = (id) => {
    console.log("Deleting medicine with ID:", id);
    setMedicines(medicines.filter(medicine => medicine.id !== id));
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMedicine({ ...newMedicine, [name]: value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <span className="text-3xl mr-2">💊</span>
            <h2 className="text-xl font-bold">Medicine</h2>
            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              Local Data
            </span>
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
            
            {medicines.length === 0 ? (
              <p className="text-gray-500">No medications added yet.</p>
            ) : (
              <ul className="space-y-2">
                {medicines.map(medicine => (
                  <li key={medicine.id} className="border-b border-gray-100 pb-2">
                    <div className="flex justify-between items-center">
                      <div className="font-bold">{medicine.name}</div>
                      <button 
                        onClick={() => handleDeleteMedicine(medicine.id)}
                        className="bg-red-500 text-white hover:bg-red-600 px-3 py-1 rounded-md text-sm font-bold flex items-center"
                        aria-label="Delete medicine"
                      >
                        <span className="mr-1">🗑️</span> Delete
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

export default SimpleMedicineModule;