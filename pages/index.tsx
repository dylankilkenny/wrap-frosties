import Head from 'next/head';
import { useEthers } from '@usedapp/core';
import dynamic from 'next/dynamic';
import { ethers } from 'ethers';
import FrostiesABI from '../abi/frosties.json';
import { useEffect, useState } from 'react';
import axios from 'axios';

const frostiesMainnetAddress = '0x3c99f2a4b366d46bcf2277639a135a6d1288eceb';
const frostiesRinkebyAddress = '';

const wrappedMainnetAddress = '';
const wrappedRinkebyAddress = '';

const WalleButton = dynamic(
  () => {
    return import('../components/wallet');
  },
  { ssr: false }
);

interface Metadata {
  tokenId: string;
  image: string;
}

export default function App() {
  const [metadata, setMetadata] = useState<Metadata[]>([]);
  const [oldContract, setOldContract] = useState<string>();
  const [newContract, setNewContract] = useState<string>();
  const { account, chainId, library } = useEthers();

  useEffect(() => {
    setOldContract(chainId === 1 ? frostiesMainnetAddress : frostiesRinkebyAddress);
    setNewContract(chainId === 1 ? wrappedMainnetAddress : wrappedRinkebyAddress);
  }, [chainId]);

  useEffect(() => {
    async function fetchMetadata() {
      console.log('account:', account);
      if (account && oldContract) {
        const IFrosties = new ethers.utils.Interface(FrostiesABI);
        const frostiesContract = new ethers.Contract(oldContract, IFrosties, library);

        const IDs = await frostiesContract.walletOfOwner(account);
        console.log('Frostie IDs', IDs);

        const meta = [];
        for (let id of IDs) {
          const uri: string = await frostiesContract.tokenURI(id);
          console.log(`Metadata URI for ${id}: ${uri}`);

          const ipfsURL = 'https://ipfs.io/ipfs/' + uri.split('://')[1];
          const resp = await axios(ipfsURL);

          meta.push({ tokenId: id, image: 'https://ipfs.io/ipfs/' + resp.data.image.split('://')[1] });
        }

        setMetadata(meta);
      }
    }
    void fetchMetadata();
  }, [account, oldContract]);

  return (
    <div>
      <Head>
        <title>Wrap Frosties</title>
      </Head>
      <div className="text-gray-900 mx-auto bg-gray-100 border-b p-1 border-gray-300 h-14">
        <nav className="flex justify-between mt-0.5">
          <div className="mx-4 mt-1 text-gray-900 text-2xl">Wrapped Frosties</div>
          <div className="float-right mx-4">
            <WalleButton />
          </div>
        </nav>
      </div>
      <div className="w-96 m-auto">
        <div className="grid grid-cols-2 mt-24">
          <div className="col-span-1">
            <button className="shadow-md flex justify-center w-44 py-2 mb-4 border text-white bg-blue-600  border-blue-700 rounded-lg cursor-pointer hover:bg-blue-500">
              <span>Wrap All Frosties</span>
            </button>
          </div>
          <div className="col-span-1">
            <button className="float-right flex justify-center w-44 py-2 mb-4 border text-gray-500 bg-white border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <span>Unwrap All Frosties</span>
            </button>
          </div>
        </div>
      </div>
      <div className="grid justify-center text-3xl font-normal leading-normal mt-0 mb-2 text-gray-800">
        Your Unwrapped Frosties
      </div>
      <div className="flex flex-wrap border p-8 mx-8 lg:mx-44 xl:mx-80 rounded-lg shadow-md">
        {metadata.map((m, i) => (
          <img key={i} className="w-48 shadow-md m-4" src={m.image} />
        ))}
      </div>
    </div>
  );
}
