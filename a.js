import React from 'react'
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';
import { apikey, base_Backend_url, eth } from '../../cofig';
import { useState, useEffect } from 'react';
import { marketAddress, polymarketAddress, bnbmarketAddress, bnbtokenAddress, polytokenAddress, tokenAddress, ethauction, polyauction, bnbauction, ethlicensce, polylicensce, bnblicensce } from '../../cofig';
import User from '../plugins/User';
import Dropdown from 'react-bootstrap/Dropdown';
import { Row, Spinner, Button } from "react-bootstrap";
import Users from '../plugins/User';
import './table.css'
import { Link } from 'react-router-dom';
import axios from 'axios';
Moralis.start({
  apiKey: apikey,
  // ...and any other configuration
});
export default function Activities() {
  const [txdata, setTxdata] = useState([])
  const [activity, setActivty] = useState('sale')
  const [ethlength, setethLength] = useState(0)
  const [polylength, setpolyLength] = useState(0)
  const [bnblength, setbnbLength] = useState(0)
  const [loading, setLoading] = useState(true)
  const abi = [{
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_itemId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "oldOwner",
        "type": "address"
      }
    ],
    "name": "ChangeOwnership",
    "type": "event"
  }];
 
  const abiMint = {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "supply",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_creator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_mintingTime",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "_URI",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      }
    ],
    "name": "CreateCollectible",
    "type": "event"
  }
  const Auction = {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokenID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "NFTaddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "itemId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "statingtime",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "uri",
        "type": "string"
      }
    ],
    "name": "AddedAuctions",
    "type": "event"
  }
  const License = {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "seller",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "sold",
        "type": "bool"
      },
      {
        "components": [
          {
            "internalType": "enum LicensingNFTMarketPlace.LicenseType",
            "name": "licenseType",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "registeredOn",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "expiresIn",
            "type": "uint256"
          },
          {
            "internalType": "enum LicensingNFTMarketPlace.LicenseState",
            "name": "state",
            "type": "uint8"
          }
        ],
        "indexed": false,
        "internalType": "struct LicensingNFTMarketPlace.LicenseInfo",
        "name": "licenseInfo",
        "type": "tuple"
      }
    ],
    "name": "MarketItemCreated",
    "type": "event"
  }
  const topic = "ChangeOwnership(uint256, address, address)"
  const minTopic = "CreateCollectible(uint256 ,address ,uint256 ,string ,uint256)"
  const AuctionTopic = `AddedAuctions(uint256,address ,uint256 ,address ,uint256 ,address,uint256 ,uint256 ,string)`
  const LicenseTopic = `MarketItemCreated(uint256,address,address,uint256,bool,LicenseInfo)`
  const ether = EvmChain.GOERLI
  const polygon = EvmChain.MUMBAI
  const Bsc = EvmChain.BSC_TESTNET


  const formatData = (data, symbol, link) => {
    let frmdata = data.map((i) => {
      return { owner: i?.data?.owner, NFTaddress: i?.data?.NFTaddress, price: i?.data?.price, symbol, trx_hash: link + i.transaction_hash, itemId: i.data.itemId, date: i.block_timestamp }
    })
    return frmdata
  }

  const formatData2 = (data, symbol, link) => {
    let frmdata = data.map((i) => {
      return { owner: i?.data?._creator, symbol, trx_hash: link + i.transaction_hash, itemId: i.data._tokenId, date: i.block_timestamp, supply: i.data.supply }
    })
    return frmdata
  }
  const getTransfer = async () => {

    const getNfttxs = async (chain, address) => {
      setLoading(true)
      const response = await axios.get(`https://django-server-production-ccf1.up.railway.app/sales/${address}/${chain}/`)
      console.log(response)
      return response?.data?.result
    }
    let data1 = await getNfttxs('eth', marketAddress)
    let data2 = await getNfttxs('mumbai', polymarketAddress)
    let data3 = await getNfttxs('bsc testnet', bnbmarketAddress)
    let data = data1.concat(data2, data3)
    console.log(data2)
    setTxdata(data)
    setLoading(false)

  }
  const getTmints = async () => {
    setLoading(true)
    const getNfttxs = async (chain, address, abi, topic) => {
      const response = await Moralis.EvmApi.events.getContractEvents({
        address,
        chain,
        abi, topic
      });
      console.log(response?.toJSON());
      return response?.toJSON().result
    }
    let data1 = await getNfttxs(ether, tokenAddress, abiMint, minTopic)
    let data2 = await getNfttxs(polygon, polytokenAddress, abiMint, minTopic)
    let data3 = await getNfttxs(Bsc, bnbtokenAddress, abiMint, minTopic)
    let frmData1 = await formatData2(data1, 'ETH', 'https://goerli.etherscan.io/tx/')
    let frmData2 = await formatData2(data2, 'MATIC', 'https://mumbai.polygonscan.com/tx/')
    let frmData3 = await formatData2(data3, 'BNB', 'https://testnet.bscscan.com/tx/')
    let data = frmData1.concat(frmData2, frmData3)

    setTxdata(data)
    setLoading(false)



  }

  const getAuctions = async () => {
    setLoading(true)
    const getNfttxs = async (chain, address, abi, topic) => {
      const response = await Moralis.EvmApi.events.getContractEvents({
        address,
        chain,
        abi, topic
      });

      return response?.result
    }
    let data1 = await getNfttxs(ether, ethauction, Auction, AuctionTopic)
    let data2 = await getNfttxs(polygon, polyauction, Auction, AuctionTopic)
    let data3 = await getNfttxs(Bsc, bnbauction, Auction, AuctionTopic)
    let frmData1 = await formatData(data1, 'ETH', 'https://goerli.etherscan.io/tx/')
    let frmData2 = await formatData(data2, 'MATIC', 'https://mumbai.polygonscan.com/tx/')
    let frmData3 = await formatData(data3, 'BNB', 'https://testnet.bscscan.com/tx/')
    let data = frmData1.concat(frmData2, frmData3)


    setTxdata(data)
    setLoading(false)

  }

  const getLicense = async () => {
    try {
      setLoading(true)
      let data = await axios.get(base_Backend_url + 'licenses/')
      let tx = data.data
      setTxdata(tx)
      setLoading(false)

    } catch (error) {
      console.log(error)
    }

  }
  
  useEffect(() => {
    getTransfer()



  }, [])

  return (
    <>
      <div className='container'>
        <div className="d-flex justify-content-between">
          <div>
            <h3 className=''>Activity By NFT getty</h3>
          </div>
          <div>
          </div>
          <div>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Filter
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {/* <Dropdown.Item href="#/action-1"><img src="https://img.icons8.com/fluency/48/000000/share-3.png"/></Dropdown.Item> */}
                <Dropdown.Item href="#" onClick={(e) => {
                  e.preventDefault()
                  setActivty('auction')
                  getAuctions()
                }}>Auction</Dropdown.Item>
                <Dropdown.Item href="#" onClick={(e) => {
                  e.preventDefault()
                  getLicense()
                  setActivty('license')

                }}>License Creation</Dropdown.Item>
                <Dropdown.Item href="#" onClick={(e) => {
                  e.preventDefault()

                  setActivty('sale')
                }}>Sales</Dropdown.Item>
                <Dropdown.Item href="#" onClick={(e) => {
                  e.preventDefault()
                  setActivty('mint')
                  getTmints()
                }}>Mint</Dropdown.Item>
                {/* <Dropdown.Item href="#" onClick={(e) => {
                  e.preventDefault()
                 
                  setActivty('activation')
                }}>License Activation</Dropdown.Item> */}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        <hr className='text-white' />

        {loading ? (

          <Row className="justify-content-center">
            <Spinner animation="border" />
          </Row>
        ) :
          <div className="card tbr" style={{ padding: "0px" }}>
            {activity === 'sale' ?
              // sale
              <table className="table table-borderless shadow-sm bg-body rounded" style={{ padding: "0px " }}>
                <thead className="">
                  <tr>
                    <th scope="col" className='text-white'>#</th>
                    <th scope="col" className='text-white'>From</th>
                    <th scope="col" className='text-white'>To</th>
                    <th scope="col" className='text-white'>contract</th>
                    <th scope="col" className='text-white'>tx Hash</th>
                    <th scope="col" className='text-white'>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {txdata && txdata.map((i, j) => {
                    return (
                      <tr>
                        <th scope="row" className='text-white'>{i?.data?.itemId}</th>
                        <td className='text-cs'><Users user={i?.data?.oldOwner} /></td>
                        <td className='text-cs'><Users user={i?.data?.newOwner} /></td>
                        <td className='text-cs'>{i?.address?.slice(0, 6)}...</td>
                        <td className='text-cs'>{i?.transaction_hash?.slice(0, 6)}...</td>
                        <td className='text-cs'>0.01 Eth</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table> : activity === 'mint' ?
                //  mint
                <table className="table table-borderless shadow-sm p-3 mb-5 bg-body rounded">
                  <thead className="">
                    <tr>
                      <th scope="col" className='text-white'>#</th>
                      <th scope="col" className='text-white'>Supply</th>
                      <th scope="col" className='text-white'>User</th>
                      <th scope="col" className='text-white'>Mintin Time</th>
                      <th scope="col" className='text-white'>tx Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {txdata && txdata.map((i, j) => {
                      return (
                        <tr>
                          <th scope="row" className='text-white'>{i?.itemId}</th>
                          <td className='text-cs'>{i?.supply}</td>
                          <td className='text-cs'><Users user={i?.owner} /></td>
                          <td className='text-cs'>{i?.date?.slice(0, 10)}</td>
                          <td className='text-cs'><a href={i?.trx_hash} target="_blank">{i?.trx_hash?.slice(0, 6)}</a></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table> : activity === 'license' ?
                  // license
                  <table className="table table-borderless shadow-sm p-3 mb-5 bg-body rounded">
                    <thead className="">
                      <tr>
                        <th scope="col" className='text-white'>#</th>
                        <th scope="col" className='text-white'>user</th>
                        <th scope="col" className='text-white'>contract</th>
                        <th scope="col" className='text-white'>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {txdata && txdata.map((i, j) => {


                        return (
                          <tr>
                            <th scope="row" className='text-white'>{i?.itemId}</th>
                            <td className='text-cs'><User user={i?.owner} /></td>
                            <td className='text-cs'>{i?.contract_address?.slice(0, 6)}...</td>
                            <td className='text-cs'>{i?.price?.slice(0, 6)}...</td>

                            {/* <td className='text-cs'>0.01 Eth</td> */}
                          </tr>
                        )


                      })}
                    </tbody>
                  </table> :
                  // auction
                  <table className="table table-borderless shadow-sm bg-body rounded">
                    <thead className="">
                      <tr>
                        <th scope="col" className='text-white'>#</th>
                        <th scope="col" className='text-white'>Date</th>
                        {/* <th scope="col" className='text-white'>Time</th> */}
                        <th scope="col" className='text-white'>User</th>
                        <th scope="col" className='text-white'>Tx Hash</th>
                        {/* <th scope="col" className='text-white'>tx Hash</th> */}
                        {/* <th scope="col" className='text-white'>Chain</th> */}
                        <th scope="col" className='text-white'>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {txdata && txdata.map((i, j) => {


                        return (
                          <tr>
                            <th scope="row" className='text-white'>{i.itemId}</th>
                            <td className='text-cs'>{i?.date?.slice(0, 10)}</td>
                            {/* <td className='text-cs'>{i?.block_timestamp?.slice(11, 16)}</td> */}
                            <td className='text-cs'><Link to={`author/${i?.owner?.toLowerCase()}/detail`}><Users user={i?.owner?.toLowerCase()} /></Link></td>
                            <td className='text-cs'><a className='btn btn1' href={i.trx_hash} target="_blank">View</a></td>
                            {/* <td className='text-cs'>{i?.block_hash?.slice(0, 10)}...</td> */}
                            {/* <td className='text-cs'>{'Ethereum'}...</td> */}
                            <td className='text-cs'>{parseInt(i?.price) / 100000000000000000} {i.symbol}</td>
                          </tr>

                        )

                      })}
                    </tbody>
                  </table>
            }
          </div>
        }
      </div>
    </>
  )
}