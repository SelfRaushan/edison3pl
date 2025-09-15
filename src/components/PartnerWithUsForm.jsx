import React, { useState, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa'; // Icon for the 'deselect' button

// --- Configuration ---
const ALL_INDUSTRIES = ["eCommerce", "Retail", "Healthcare", "Electronics", "Food", "Industrial"];

function PartnerWithUsForm() {
  // --- State Management ---
  const [formData, setFormData] = useState({
    contactName: '',
    contactNumber: '',
    email: '',
    companyName: '',
    estimatedUnits: '',
    comments: '',
  });
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref to handle clicks outside the dropdown

  // --- Effects ---
  // Effect to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    let removeListener = () => {};
    let doc = null;

    // Check if globalThis is available and has a document property
    // This avoids direct reference to 'window' in the typeof check
    if (typeof globalThis !== 'undefined' && typeof globalThis.window !== 'undefined' && globalThis.window.document) {
      doc = globalThis.window.document;
      doc.addEventListener("mousedown", handleClickOutside);
      removeListener = () => {
        doc.removeEventListener("mousedown", handleClickOutside);
      };
    }

    // Return the cleanup function
    return removeListener;
  }, [dropdownRef]);

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleToggleIndustry = (industryName) => {
    const isSelected = selectedIndustries.includes(industryName);
    if (isSelected) {
      setSelectedIndustries(prev => prev.filter(item => item !== industryName));
    } else {
      setSelectedIndustries(prev => [...prev, industryName]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation check
    if (!formData.contactName || !formData.email || !formData.companyName || selectedIndustries.length === 0) {
      // eslint-disable-next-line no-undef
      alert("Please fill in all required fields: Name, Email, Company, and select at least one Industry.");
      return;
    }

    const payload = {
      name: formData.contactName,
      email: formData.email,
      phone: formData.contactNumber,
      companyName: formData.companyName,
      industries: selectedIndustries, // Assuming backend expects array of strings
      estimatedUnits: formData.estimatedUnits,
      comments: formData.comments,
    };

    try {
      // FIX: Changed endpoint from '/api/partner' to '/api/forms/partner'
      // eslint-disable-next-line no-undef
      const response = await fetch('https://edison3pl-m6gx.vercel.app/api/forms/partner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // eslint-disable-next-line no-undef
      console.log('Partnership Proposal Response:', data);
      // eslint-disable-next-line no-undef
      alert("Thank you for your interest in partnering with us! We will review your proposal and be in touch soon.");
      // Optionally clear form or redirect
      setFormData({ contactName: '', contactNumber: '', email: '', companyName: '', estimatedUnits: '', comments: '' });
      setSelectedIndustries([]);

    } catch (error) {
      // eslint-disable-next-line no-undef
      console.error('Error submitting partnership proposal:', error);
      // eslint-disable-next-line no-undef
      alert('Failed to submit proposal. Please try again later.');
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900">Partner With Us</h2>
      <p className="mt-2 text-gray-600">
        We're looking for great partners. Tell us about your business and let's grow together.
      </p>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {/* --- Contact & Company Info --- */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <input type="text" id="contactName" value={formData.contactName} onChange={handleInputChange} placeholder="Contact Name" className="w-full px-4 py-3 text-gray-800 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required />
          <input type="email" id="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" className="w-full px-4 py-3 text-gray-800 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required />
          <input type="tel" id="contactNumber" value={formData.contactNumber} onChange={handleInputChange} placeholder="Contact Number" className="w-full px-4 py-3 text-gray-800 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
          <input type="text" id="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Company Name" className="w-full px-4 py-3 text-gray-800 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required />
        </div>

        {/* --- Custom Multi-Selector for Industries --- */}
        <div ref={dropdownRef}>
          <label className="text-sm font-bold text-gray-800">Your Industry/Industries</label>
          <div className="flex flex-wrap gap-2 p-2 mt-2 bg-gray-100 border-transparent rounded-lg min-h-[48px] items-center cursor-pointer" onClick={() => setDropdownOpen(!isDropdownOpen)}>
            {selectedIndustries.map(industry => (
              <div key={industry} className="flex items-center gap-2 px-3 py-1 text-sm font-semibold text-white bg-green-600 rounded-full">
                {industry}
                <button type="button" onClick={(e) => { e.stopPropagation(); handleToggleIndustry(industry); }} className="transition-transform duration-150 hover:scale-125">
                  <FaTimes />
                </button>
              </div>
            ))}
            {selectedIndustries.length === 0 && <span className="text-gray-500 px-2">Click to select industries...</span>}
          </div>
          {isDropdownOpen && (
            <div className="relative">
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                {ALL_INDUSTRIES.map(industryName => {
                  const isSelected = selectedIndustries.includes(industryName);
                  return (
                    <div key={industryName} onClick={() => handleToggleIndustry(industryName)} className={`px-4 py-3 cursor-pointer flex justify-between items-center transition-colors ${isSelected ? 'bg-blue-100 font-bold text-green-600' : 'hover:bg-gray-100'}`}>
                      {industryName}
                      {isSelected && <span className="text-green-600">✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* --- Estimated Volume & Comments --- */}
        <div>
          <label htmlFor="estimatedUnits" className="text-sm font-medium text-gray-700">Estimated Units Per Month</label>
          <input type="number" id="estimatedUnits" value={formData.estimatedUnits} onChange={handleInputChange} placeholder="e.g., 2000" min="0" onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} className="w-full px-4 py-3 mt-2 text-gray-800 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
          <label htmlFor="comments" className="text-sm font-medium text-gray-700">Comments</label>
          <textarea id="comments" value={formData.comments} onChange={handleInputChange} rows="4" placeholder="Tell us more about your business needs or partnership ideas..." className="w-full px-4 py-3 mt-2 text-gray-800 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
        </div>

        {/* --- Action Button --- */}
        <button type="submit" className="
              px-6 py-3 w-full font-semibold rounded-lg
              bg-gradient-to-r from-green-300 to-green-500 text-white
              transition-all duration-300 ease-in-out
              hover:bg-gradient-to-r hover:from-green-300 hover:to-green-500 hover:text-white
              hover:scale-105 hover:shadow-lg
            ">
          Submit Proposal
        </button>
      </form>
    </div>
  );
}

export default PartnerWithUsForm;
