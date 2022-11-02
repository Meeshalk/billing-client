/* eslint-disable react/no-array-index-key */

import React from 'react';
import { Billing, BillProduct, Product } from 'renderer/Types/DataTypes';
import AuthContext from '../Context/AuthContext';

// function convertErrorsToArray(errors): string[] {
//   if (typeof errors === 'string') {
//     return [errors];
//   }
//   return Object.values(errors);
// }

const InvoiceTable = (
  bill: { bill: Billing },
  handleRefresh: { handleRefresh: Promise<void> }
) => {
  // const initBillProduct: BillProduct = {
  //   bill_id: '',
  //   product_id: '',
  //   quantity: 0,
  //   amount: 0,
  // };
  // const initProduct: Product = {
  //   id: '',
  //   user_id: '',
  //   name: '',
  //   rate: 0,
  //   pivot: initBillProduct,
  // };
  const { dispatch, state } = React.useContext(AuthContext);
  const { bill: billInfo } = bill;
  const billDate = new Date(billInfo.created_at);
  const handleItemDelete = (billProductId: string) => {
    return false;
  };

  return (
    <>
      <div className="invoice-container" style={{ color: 'black' }}>
        <div className="card">
          <div
            className="container"
            style={{ display: 'flex', padding: '10px' }}
          >
            <div
              className="invoice"
              style={{ flexGrow: 6, backgroundColor: 'white', padding: '5px' }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    backgroundColor: 'lightgray',
                    padding: '5px',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>TO</span>
                  <div>ESTIMATE &nbsp;&nbsp;&nbsp;&nbsp;</div>
                  <span>ID: --- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <div>
                    <div>Name: {billInfo.customer_name}</div>
                    {billInfo.customer_address?.length > 0 && (
                      <div>
                        Address: <br />
                        {billInfo.customer_address}
                      </div>
                    )}
                  </div>
                  <div>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BK
                  </div>
                  <div>
                    <div>Date: {billDate.toLocaleDateString()}</div>
                    {billInfo.customer_mobile?.length > 0 && (
                      <div>Mobile: {billInfo.customer_mobile}</div>
                    )}
                  </div>
                </div>
              </div>
              <div
                style={{
                  marginTop: '20px',
                  maxHeight: 'calc(100vh - 235px)',
                  overflowY: 'scroll',
                }}
              >
                <table style={{ position: 'relative' }}>
                  <thead style={{ position: 'sticky', top: 0 }}>
                    <tr>
                      <th>#</th>
                      <th style={{ width: '100%' }}>Item</th>
                      <th>Qty.</th>
                      <th>Rate</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billInfo.products.length > 0 &&
                      billInfo.products.map((product, index) => (
                        <tr>
                          <td>{index}</td>
                          <td>1</td>
                          <td>1</td>
                          <td>1</td>
                          <td>1</td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              className="btn-small-round"
                              onClick={() =>
                                handleItemDelete(product.pivot?.id)
                              }
                              style={{
                                backgroundColor: 'red',
                                color: 'whitesmoke',
                              }}
                              title="Delete Item"
                            >
                              &nbsp;x&nbsp;
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                  <thead style={{ position: 'sticky', bottom: 0 }}>
                    <tr>
                      <th colSpan={2}>Total Items</th>
                      <th style={{ fontWeight: 'bolder' }}>
                        {(23234).toLocaleString('en-IN')}
                      </th>
                      <th>Total</th>
                      <th style={{ fontWeight: 'bolder' }}>
                        {(145000.0).toLocaleString('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                        })}
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
            <div className="action-bar" style={{ flexGrow: 3 }}>
              <button type="button" onClick={() => handleRefresh}>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceTable;
