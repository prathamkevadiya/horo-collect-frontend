import React from "react";

const InquiryTable = ({ inquiries }) => {
  return (
    <div className="bg-white shadow rounded">
      <table className="table-auto w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-4">Product</th>
            <th className="p-4">Inquiry Note</th>
            <th className="p-4">Customer</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inquiry) => (
            <tr key={inquiry.id} className="border-b">
              <td className="p-4">{inquiry.product.name}</td>
              <td className="p-4">{inquiry.note}</td>
              <td className="p-4">{inquiry.customer.name}</td>
              <td className="p-4">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    inquiry.status === "resolved"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                >
                  {inquiry.status}
                </span>
              </td>
              <td className="p-4">
                <button className="text-blue-500 hover:underline">View</button>
                <button className="text-green-500 hover:underline ml-4">
                  Edit
                </button>
                <button className="text-red-500 hover:underline ml-4">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InquiryTable;
