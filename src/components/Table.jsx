import React from 'react';
import {FaEllipsisH ,FaEye} from 'react-icons/fa'; 

const Table = ({ data }) => {
  return (
    <div className="overflow-x-auto ml-56 rounded-lg">
      <table className="min-w-full bg-white shadow-lg">
        <thead className="bg-gray-100">
          <tr className="text-left text-gray-700">
            <th className="w-8 p-4">
              
            </th>
            <th className="py-3 px-4 font-semibold">Client</th>
            <th className="py-3 px-4 font-semibold">Transaction Details</th>
            <th className="py-3 px-4 font-semibold">Type</th>
            <th className="py-3 px-4 font-semibold">Broker/Wallet</th>
            <th className="py-3 px-4 font-semibold">Wallet Address</th>
            <th className="py-3 px-4 font-semibold">Amount</th>
            <th className="py-3 px-4 font-semibold">Assigned To</th>
            <th className="py-3 px-4 font-semibold">Status</th>
            <th className="py-3 px-4 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((transaction, index) => (
            <tr key={index} className="border-t align-top">
              <td>
                <input type="checkbox" className="rounded border-gray-300 mt-4 border-green-600" /></td>
              <td className="py-4 px-4 flex flex-col items-center">
                <div className='flex gap-2 items-start'>
                    <div>
                        <img
                        src={transaction.clientImage}
                        alt="Client"
                        className="w-10 h-10 rounded-full mr-3"
                        />
                    </div>
                   
                    <div>
                    <p className="font-medium">{transaction.client}</p>
                    <div>
                    <p className=" text-sm font-bold">{transaction.clientName}</p>
                    <p className=' text-gray-400'>Client Name</p>
                    </div>
                    
                    </div>
                </div>
               
                <div className='flex gap-2 mt-2'>
                    <p className='p-1 border border-green-600 rounded-xl text-center text-green-600 text-xs'>Verified</p>
                    <p className='p-1 border border-indigo-800 rounded-xl text-center text-indigo-800 text-xs'>Approved</p>
                </div>
                
              </td>
              <td className="py-4 px-4">
                <div className='flex gap-2 items-center'> 
                    <p className="text-green-600 font-medium" >{transaction.transactionDetails}</p>
                    <FaEye className="text-green-600 cursor-pointer" />
                </div>           
                <p className="text-gray-500 details-size">{transaction.transactionTime}</p>
                <div className='flex gap-2 mt-2'>
                    <p className='p-1 border border-red-600 rounded-xl text-center text-red-600 text-xs'>Approve</p>
                    <p className='p-1 border border-indigo-800 rounded-xl text-center text-indigo-800 text-2xl'>Reject</p>
                </div>
              </td>
              <td className="py-4 px-4 font-semibold">{transaction.type}</td>
              <td className="py-4 px-4 font-semibold">{transaction.broker}</td>
              <td className="py-4 px-4 text-gray-500">{transaction.walletAddress}</td>
              <td className="py-4 px-4 font-medium">{transaction.amount}</td>
              <td className="py-4 px-4">
                <div className="flex items-start">
                  <img
                    src={transaction.assigneePic}
                    alt="Assigned"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <p>{transaction.assigneeName}</p>
                </div>
              </td>
              <td className="py-4 px-4">
                <span className="flex items-center space-x-2 text-gray-700">
                  <span>{transaction.status}</span>
                </span>
              </td>
              <td className="py-4 px-4">
              <FaEllipsisH className="text-gray-400 cursor-pointer" />
              </td>
            </tr>
            
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
