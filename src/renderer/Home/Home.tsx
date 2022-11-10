/* eslint-disable react/no-array-index-key */
import React, { useRef } from 'react';
import TextInput from 'react-autocomplete-input';
import 'react-autocomplete-input/dist/bundle.css';
import {
  LogoutPayload,
  NewBillFormState,
  Billing,
  ItemFormData,
  Product,
} from '../Types/DataTypes';
import AuthContext from '../Context/AuthContext';

function convertErrorsToArray(errors): string[] {
  if (typeof errors === 'string') {
    return [errors];
  }
  return Object.values(errors);
}

function Home() {
  let billDate = new Date();
  const initSearchResult: Array<Product> = [];
  const initBillFormState: NewBillFormState = {
    customer_address: '',
    customer_mobile: '',
    customer_name: '',
    payment_type: 'cash',
    isSubmitting: false,
    errorMessage: [],
  };

  const initItemFormData: ItemFormData = {
    name: '',
    quantity: 0,
    rate: 0,
    isSubmitting: false,
    errorMessage: [],
  };

  const { dispatch, state } = React.useContext(AuthContext);

  const initBillingData: Billing = {
    id: '',
    total: 0,
    user_id: state.user.id,
    payment_type: 'cash',
    customer_address: '',
    customer_mobile: '',
    customer_name: '',
    is_complete: false,
    products_count: 0,
    created_at: '',
    updated_at: '',
    amount_payable: 0,
    products: [],
  };

  const [view, setView] = React.useState('home');
  const [billFormData, setBillFormData] = React.useState(initBillFormState);
  const [itemFormData, setItemFormData] = React.useState(initItemFormData);
  const [billingData, setBillingData] = React.useState(initBillingData);
  const [searchResult, setSearchResult] = React.useState(initSearchResult);

  const currentFocus = useRef(null);

  const initLogoutState: LogoutPayload = { user: state.user };
  const initRequestState = { token: state.token };

  const toggleView = (to: string) => {
    if (
      (to === 'new-bill' || to === 'home') &&
      billingData.id !== '' &&
      billingData.is_complete === false
    ) {
      // warn
      setBillingData(initBillingData);
      setBillFormData(initBillFormState);
    }

    setView(to);
    setBillingData(initBillingData);
    setBillFormData(initBillFormState);
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    await window['billing-app'].ipcRenderer.invoke('logout', initRequestState);
    dispatch({
      type: 'logout',
      payload: initLogoutState,
    });
  };

  const handleBillFormInputChange = (event) => {
    setBillFormData({
      ...billFormData,
      [event.target.name]: event.target.value,
    });
  };

  const handleItemFormInputChange = (event) => {
    setItemFormData({
      ...itemFormData,
      [event.target.name]: event.target.value,
    });
  };

  // React.useEffect(() => {
  //   if (currentFocus.current !== null) {
  //     currentFocus.current.focus();
  //   }
  // }, [itemFormData]);

  const handleItemAutocompleteSelect = (value) => {
    setItemFormData({
      ...itemFormData,
      name: value,
    });
  };

  const handleSearchProduct = async (event) => {
    event.preventDefault();
    setSearchResult(initSearchResult);

    const response = await window['billing-app'].ipcRenderer.invoke(
      'searchProduct',
      {
        query: event.target.value,
        token: state.token,
      }
    );

    if (response.status === 'error') {
      console.log('no product!');
    }

    if (response.status === 'success') {
      setSearchResult(response.data.data);
    }
    setItemFormData({
      ...itemFormData,
      [event.target.name]: event.target.value,
    });
  };

  const handleNewBill = async (event) => {
    event.preventDefault();
    setBillingData(initBillingData);
    let errors = [];
    let isSubmitting = true;

    setBillFormData({
      ...billFormData,
      isSubmitting,
      errorMessage: errors,
    });

    const response = await window['billing-app'].ipcRenderer.invoke('newBill', {
      data: billFormData,
      token: state.token,
    });

    if (response.status === 'error') {
      errors = convertErrorsToArray(response.message);
      isSubmitting = false;
      setBillFormData({
        ...billFormData,
        isSubmitting,
        errorMessage: errors,
      });
      setBillingData(initBillingData);
      setView('new-bill');
    }

    if (response.status === 'success') {
      setBillFormData(initBillFormState);
      setBillingData({ ...initBillingData, ...response.data });
      billDate = new Date(billingData.created_at);
      setView('billing');
    }
  };

  const handleBillRefresh = async () => {
    const response = await window['billing-app'].ipcRenderer.invoke('getBill', {
      billId: billingData.id,
      token: state.token,
    });
    if (response.status === 'error') {
      // not decided
    }

    if (response.status === 'success') {
      setBillingData({ ...response.data });
    }
  };

  const handleAddItem = async (event) => {
    event.preventDefault();
    let errors = [];
    let isSubmitting = true;

    setItemFormData({
      ...itemFormData,
      isSubmitting,
      errorMessage: errors,
    });
    const response = await window['billing-app'].ipcRenderer.invoke(
      'addProductToBill',
      {
        billId: billingData.id,
        productId: undefined,
        data: itemFormData,
        token: state.token,
      }
    );
    if (response.status === 'error') {
      // not decided
      errors = convertErrorsToArray(response.message);
      isSubmitting = false;
      setItemFormData({
        ...itemFormData,
        isSubmitting,
        errorMessage: errors,
      });
    }

    if (response.status === 'success') {
      setBillingData({ ...response.data });
      setItemFormData(initItemFormData);
      event.target.reset();
    }
  };

  const handleItemDelete = async (billProductId: string) => {
    const response = await window['billing-app'].ipcRenderer.invoke(
      'deleteItem',
      {
        billProductId,
        token: state.token,
      }
    );

    if (response.status === 'error') {
      // not decided
    }

    if (response.status === 'success') {
      setBillingData({ ...response.data });
    }
  };

  const handlePrint = async (id: string) => {
    const response = await window['billing-app'].ipcRenderer.invoke('print', {
      url: `http://billing-server-app.test/print/${id}`,
      options: {},
      token: state.token,
    });

    // if (response.status === 'error') {
    //   // not decided
    //   console.log();

    // }

    // if (response.status === 'success') {
    //   setBillingData({ ...response.data });
    // }
  };

  return (
    // <>
    // {view == "new-bill" && <div>hello<div/>}

    <>
      <div className="home-container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px',
            backgroundColor: '#008b8b30',
          }}
        >
          <div style={{ flexGrow: 3 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                opacity: 0.6,
                fontSize: '1rem',
              }}
            >
              <span>Employee: {state.user.name}</span>
              <span>Device: {state.user.username}</span>
              <span>
                {/* Bill ID: {billingData.id.length <= 0 ? '---' : billingData.id} */}
                Bill ID: ---
              </span>
            </div>
          </div>
          <div
            style={{
              flexGrow: 2,
              display: 'flex',
              justifyContent: 'space-around',
            }}
          >
            {view !== 'new-bill' && (
              <button
                type="button"
                className="link-like-button"
                onClick={() => toggleView('new-bill')}
              >
                New Bill
              </button>
            )}
            {view === 'new-bill' && (
              <button
                type="button"
                className="link-like-button"
                onClick={() => toggleView('home')}
              >
                Home
              </button>
            )}
            <button
              type="button"
              className="link-like-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
        {view === 'new-bill' && (
          <div className="new-bill-container">
            <div className="card">
              <div className="container">
                <form
                  id="new-bill-form"
                  style={{ display: 'block' }}
                  onSubmit={handleNewBill}
                >
                  <h1 style={{ textAlign: 'center' }}>New Bill</h1>
                  <p>Create new bill, all details are optional.</p>
                  <input
                    type="text"
                    name="customer_name"
                    onChange={handleBillFormInputChange}
                    placeholder="Customer Name (optional)"
                  />
                  <input
                    type="text"
                    name="customer_address"
                    onChange={handleBillFormInputChange}
                    placeholder="Customer Address (optional)"
                  />
                  <input
                    type="number"
                    name="customer_mobile"
                    onChange={handleBillFormInputChange}
                    placeholder="Customer Mobile (optional)"
                  />
                  <select
                    name="payment_type"
                    onChange={handleBillFormInputChange}
                    placeholder="Payment Type (optional)"
                  >
                    <option value="cash" defaultChecked>
                      Cash
                    </option>
                    <option value="upi">UPI</option>
                    <option value="other">Other</option>
                  </select>
                  <div id="loginSubmit" className="formButtons">
                    <button type="submit">Start</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {view === 'billing' && billingData.id !== '' && (
          <>
            <form style={{ padding: '10px' }} onSubmit={handleAddItem}>
              <TextInput
                Component="input"
                trigger=""
                options={[...new Set(searchResult.map((a) => a.name))]}
                placeholder="Item Name"
                style={{ flexGrow: 1 }}
                type="text"
                name="name"
                spacer=""
                regex=""
                onSelect={handleItemAutocompleteSelect}
                spaceRemovers={[]}
                // onChange={handleItemFormInputChange}
                onInput={handleSearchProduct}
                offsetX={100}
                offsetY={-26}
              />
              &nbsp;
              <input
                type="number"
                name="quantity"
                onChange={handleItemFormInputChange}
                placeholder="Quantity"
                ref={currentFocus}
              />
              &nbsp;
              <input
                type="number"
                name="rate"
                onChange={handleItemFormInputChange}
                placeholder="Price"
              />
              &nbsp; &nbsp;
              <input
                type="submit"
                style={{
                  backgroundColor: 'rgb(62, 165, 255)',
                  outline: 0,
                }}
                value="Add Item"
              />
              {itemFormData.errorMessage.length > 0 && (
                <span className="form-error">
                  <span style={{ textAlign: 'center' }}>Input Errors</span>
                  <ul style={{ display: 'inline-block' }}>
                    {itemFormData.errorMessage.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </span>
              )}
            </form>
            {/* <InvoiceTable
              bill={billingData}
              handleRefresh={() => handleBillRefresh()}
            /> */}
            <>
              <div className="invoice-container" style={{ color: 'black' }}>
                <div className="card">
                  <div
                    className="container"
                    style={{ display: 'flex', padding: '10px' }}
                  >
                    <div
                      className="invoice"
                      style={{
                        flexGrow: 6,
                        backgroundColor: 'white',
                        padding: '5px',
                      }}
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
                          <span>
                            ID: --- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div>
                            <div>Name: {billingData.customer_name}</div>
                            {billingData.customer_address?.length > 0 && (
                              <div>
                                Address: <br />
                                {billingData.customer_address}
                              </div>
                            )}
                          </div>
                          <div>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RBS
                          </div>
                          <div>
                            <div>Date: {billDate.toLocaleDateString()}</div>
                            {billingData.customer_mobile?.length > 0 && (
                              <div>Mobile: {billingData.customer_mobile}</div>
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
                            {billingData.products.length > 0 &&
                              billingData.products.map((product, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{product.name}</td>
                                  <td>{product.pivot.quantity}</td>
                                  <td>{product.rate}</td>
                                  <td>{product.pivot.amount}</td>
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
                                {billingData.item_count?.toLocaleString(
                                  'en-IN'
                                )}
                              </th>
                              <th>Total</th>
                              <th style={{ fontWeight: 'bolder' }}>
                                {billingData.total?.toLocaleString('en-IN', {
                                  style: 'currency',
                                  currency: 'INR',
                                })}
                              </th>
                            </tr>
                          </thead>
                        </table>
                      </div>
                    </div>
                    <div
                      className="action-bar"
                      style={{ flexGrow: 3, padding: '10px' }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-evenly',
                          alignItems: 'center',
                          flexDirection: 'column',
                          minHeight: 'calc(100vh - 350px)',
                          textAlign: 'center',
                          fontSize: '1.5rem',
                        }}
                      >
                        {billFormData.errorMessage.length > 0 && (
                          <span className="form-error">
                            <p style={{ textAlign: 'center' }}>Input Errors</p>
                            <ul>
                              {billFormData.errorMessage.map((error, index) => (
                                <li key={index}>{error}</li>
                              ))}
                            </ul>
                          </span>
                        )}
                        <button
                          type="button"
                          className="pill-btn"
                          style={{
                            fontSize: '2rem',
                            fontWeight: 600,
                          }}
                          onClick={handleBillRefresh}
                        >
                          Refresh
                        </button>
                        <button
                          type="button"
                          className="pill-btn"
                          style={{
                            fontSize: '2rem',
                            fontWeight: 600,
                          }}
                          onClick={() => handlePrint(billingData.id)}
                        >
                          Print Bill
                        </button>
                        <div className="pill">
                          Total
                          <div
                            style={{
                              fontSize: '2.7rem',
                              fontWeight: 700,
                            }}
                          >
                            {billingData.total?.toLocaleString('en-IN', {
                              style: 'currency',
                              currency: 'INR',
                            })}
                          </div>
                        </div>
                        <div className="pill">
                          Amount Payable
                          <div
                            style={{
                              fontSize: '2.7rem',
                              fontWeight: 700,
                            }}
                          >
                            {billingData.amount_payable?.toLocaleString(
                              'en-IN',
                              {
                                style: 'currency',
                                currency: 'INR',
                              }
                            )}
                          </div>
                        </div>
                        <div className="pill">
                          Item Count
                          <div
                            style={{
                              fontSize: '2.7rem',
                              fontWeight: 700,
                            }}
                          >
                            {billingData.item_count}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          </>
        )}
        {view === 'billing' && billingData.id === '' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}
          >
            <p>Please click new bill, to add items to it.</p>
            <button type="button" onClick={() => toggleView('new-bill')}>
              New Bill
            </button>
          </div>
        )}
        {view === 'home' && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              height: '100vh',
            }}
          >
            <div>
              <p>User Details:</p>
              <p>
                Employee Name: <strong>{state.user.name}</strong>
              </p>
              <p>
                UserName: <strong>{state.user.username}</strong>
              </p>
              <p>
                Device Name: <strong>{state.user.name}</strong>
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                width: '-webkit-fill-available !important',
              }}
            >
              <button type="button" onClick={() => toggleView('new-bill')}>
                New Bill
              </button>
              &nbsp;&nbsp;
              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
