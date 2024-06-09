import { useState } from 'react';
import reactLogo from '../../assets/images/react.svg';
import viteLogo from '../../assets/images/vite.svg';
import './App.css';
import { Button } from 'antd';
import axios from '../../services/http/axios';

export const App = () => {
    const [count, setCount] = useState(0);

    return (
        <>
            <div>
                <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank" rel="noreferrer">
                    <img
                        src={reactLogo}
                        className="logo react"
                        alt="React logo"
                    />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                {/* <button onClick={() => increaseBears()}>Bears {bears}</button> */}
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
            <Button
                type="primary"
                onClick={() => {
                    console.log(
                        'Button clicked',
                        import.meta.env.VITE_APP_AZ_SP_API_AUTH_CONSENT_URL
                    );
                    // window.location.href = `${import.meta.env.AZ_SP_API_AUTH_CONSENT_URL}`;
                    window.open(
                        `${import.meta.env.VITE_APP_AZ_SP_API_AUTH_CONSENT_URL}`
                        // '_blank'
                    );

                    // axios
                    //     .get(`${import.meta.env.AZ_SP_API_AUTH_CONSENT_URL}`)
                    //     .then((res) => {
                    //         console.log('Response', res?.data);
                    //     })
                    //     .catch((err) => {
                    //         console.error(
                    //             'Error occurred at AZ_SP_API_AUTH_CONSENT_URL',
                    //             err
                    //         );
                    //     });
                }}
            >
                Button
            </Button>
        </>
    );
};
