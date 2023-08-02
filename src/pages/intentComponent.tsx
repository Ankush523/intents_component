import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';

const API_URL_1 = 'http://example.com/api1';
const API_URL_2 = 'http://example.com/api2';

const ApiComponent: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        let accounts = await provider.listAccounts();
        let apiUrl = accounts && accounts.length > 0 ? API_URL_2 : API_URL_1;

        const result = await axios.get(apiUrl);
        setData(result.data);
      } catch (error) {
        console.error('Error in fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>API Response:</h1>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
};

export default ApiComponent;
