import React from "react";

const SummaryCards = () => {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold">Total Inquiries</h2>
        <p className="text-2xl font-bold">50</p>
      </div>
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold">Resolved Inquiries</h2>
        <p className="text-2xl font-bold">30</p>
      </div>
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold">Pending Inquiries</h2>
        <p className="text-2xl font-bold">20</p>
      </div>
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold">Orders Linked</h2>
        <p className="text-2xl font-bold">15</p>
      </div>
    </div>
  );
};

export default SummaryCards;
