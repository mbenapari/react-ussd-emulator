import React from 'react';
import phone from './images/dumb_phone.png';
import './App.css';
import useUSSD from './hooks/useUSSD';

function App() {
  const {
    handleSubmit,
    endpoint,
    setEndpoint,
    networks,
    network,
    setNetwork,
    msisdn,
    setMsisdn,
    screen,
    ussdinput,
    setUssdInput,
    handleOkClick,
    resetSession,
    responseType,
  } = useUSSD();

  return (
    <div className="App">
      <div className="App-container">
        <div style={{ position: 'relative' }}>
          <div className="ussd-screen">
            <div
              dangerouslySetInnerHTML={{ __html: screen }}
              className="ussd-screen-text"
            />
            <div>
              <div>
                {
                  responseType === 'continue' && (
                    <input
                      className="ussd-input"
                      onChange={e => setUssdInput(e.target.value)}
                      value={ussdinput}
                      type="text"
                      placeholder="input" />
                  )
                }

              </div>
              <button className="ussd-btn" onClick={handleOkClick}>Ok</button>
              {
                responseType === 'continue' && (
                  <button className="ussd-btn" onClick={resetSession}>Cancel</button>
                )
              }
            </div>
          </div>
          <img src={phone} className="phone" alt="logo" />
        </div>

        <form onSubmit={handleSubmit} className="emulator-controls">
          <label>USSD endpoint</label>
          <div>
            <input
              onChange={e => setEndpoint(e.target.value)}
              value={endpoint}
              type="text"
              placeholder="Endpoint"
            />
          </div>
          <label>MSISDN</label>
          <div>
            <input
              onChange={e => setMsisdn(e.target.value)}
              value={msisdn}
              type="text"
              placeholder="MSISDN"
            />
          </div>
          <label>Network/Operator</label>
          <div>
            <select
              onChange={e => setNetwork(e.target.value)}
              value={network}
            >
              {
                networks.map(({ id, name }) => (
                  <option
                    key={id}
                    value={id}
                  >
                    {name}
                  </option>
                ))
              }
            </select>
          </div>
          <div>
            <button type="submit">Send</button>
            <button type="button" onClick={resetSession}>Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
