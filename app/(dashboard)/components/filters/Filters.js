import React from "react";

const Filters = ({ filters, setFilters }) => {
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex space-x-4 mb-6">
      <select
        name="status"
        value={filters.status}
        onChange={handleFilterChange}
        className="border p-2 rounded"
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="resolved">Resolved</option>
      </select>
      <input
        type="text"
        name="product"
        placeholder="Search by Product"
        value={filters.product}
        onChange={handleFilterChange}
        className="border p-2 rounded"
      />
      <input
        type="date"
        name="dateRange"
        value={filters.dateRange}
        onChange={handleFilterChange}
        className="border p-2 rounded"
      />
    </div>
  );
};

export default Filters;
