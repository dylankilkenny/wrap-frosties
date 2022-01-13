import Head from 'next/head';
import { useContractFunction, useEthers } from '@usedapp/core';
import dynamic from 'next/dynamic';
import { ethers } from 'ethers';
import FrostiesABI from '../abi/frosties.json';
import WrappedFrostiesABI from '../abi/wrapped.json';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

const frostiesMainnetAddress = '0x3c99f2a4b366d46bcf2277639a135a6d1288eceb';
const wrappedMainnetAddress = '0x4c864f944e6d819f7bad23d2e92333182cb69ea4';

const frostiesRinkebyAddress = '0xefe602390551b41ad24d28b2b4161023adb45803';
const wrappedRinkebyAddress = '0xe905fccfb6fd93cc81cd5e2f544078bd2cfcc316';

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
  const [tokenIDs, setTokenIDs] = useState<number[]>();
  const [approved, setApproved] = useState<boolean>(false);
  const { account, chainId, library } = useEthers();

  useEffect(() => {
    console.log('chainId:', chainId);

    setOldContract(chainId === 1 ? frostiesMainnetAddress : frostiesRinkebyAddress);
    setNewContract(chainId === 1 ? wrappedMainnetAddress : wrappedRinkebyAddress);
  }, [chainId]);

  useEffect(() => {
    async function fetchMetadata() {
      try {
        console.log('account:', account);
        console.log('Frosties Address:', oldContract);
        console.log('Frosties Wrapped:', newContract);
        if (account && oldContract && newContract) {
          const IFrosties = new ethers.utils.Interface(FrostiesABI);
          const frostiesContract = new ethers.Contract(oldContract, IFrosties, library);

          const approved = await frostiesContract.isApprovedForAll(account, newContract);
          console.log('approved', approved);

          const IDs = await frostiesContract.walletOfOwner(account);
          setTokenIDs(IDs.map((x: string) => parseInt(x)));
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
          setApproved(approved);
        }
      } catch (error) {
        console.log('Loading Error:', error);
      }
    }
    void fetchMetadata();
  }, [account, oldContract, newContract]);

  async function wrapAll() {
    if (!approved && oldContract && newContract) {
      const IFrosties = new ethers.utils.Interface(FrostiesABI);
      const frostiesContract = new ethers.Contract(oldContract, IFrosties, library?.getSigner());
      await frostiesContract.setApprovalForAll(newContract, true);
    } else if (newContract) {
      const IWrappedFrosties = new ethers.utils.Interface(WrappedFrostiesABI);
      const frostiesWrappedContract = new ethers.Contract(newContract, IWrappedFrosties, library?.getSigner());
      await frostiesWrappedContract.wrap(tokenIDs);
    }
  }
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
        <div className="w-56 m-auto mt-12">
          <Image src="/images/Icon.gif" height={250} width={250} />
        </div>
        <div className="mt-12">
          <button
            onClick={wrapAll}
            className="shadow-md m-auto flex justify-center w-44 py-2 mb-4 border text-white bg-blue-600  border-blue-700 rounded-lg cursor-pointer hover:bg-blue-500"
          >
            {approved ? <span>Wrap All Frosties</span> : <span>Approve Wrapper</span>}
          </button>
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
      <div className="p-12 text-lg">
        Built by{' '}
        <a className="underline text-blue-500" href="https://twitter.com/dylkil" target="_blank">
          @dylkil
        </a>
      </div>
    </div>
  );
}
