from django.shortcuts import render
# Create your views here.
from moralis import evm_api
from rest_framework.decorators import api_view
import json
from rest_framework.response import Response
import requests
@api_view(['GET'])
def Mints(request,address,chain):
    body={
    "anonymous": False,
    "inputs": [
      {
        "indexed": False,
        "internalType": "uint256",
        "name": "supply",
        "type": "uint256"
      },
      {
        "indexed": False,
        "internalType": "address",
        "name": "_creator",
        "type": "address"
      },
      {
        "indexed": False,
        "internalType": "uint256",
        "name": "_mintingTime",
        "type": "uint256"
      },
      {
        "indexed": False,
        "internalType": "string",
        "name": "_URI",
        "type": "string"
      },
      {
        "indexed": False,
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      }
    ],
    "name": "CreateCollectible",
    "type": "event"
  }
    api_key = "KcjHvykS40BWeFpXqJHG4glWa3c11soOJSojQaic0nZHPiiZYjadkMC2K1KwtuDD"
    params = {
        "address": address, 
        "topic": "CreateCollectible(uint256 ,address ,uint256 ,string ,uint256)", 
        "chain": chain, 
        "disable_total": True, 
    }
    # topic = "ChangeOwnership(uint256, address, address)"
    result = evm_api.events.get_contract_events(
        api_key=api_key,
        params=params,
        body=body,
        )
    return Response(result)

# 1
@api_view(['GET'])
def Auctions(request,address,chain):
    body={
    "anonymous": False,
    "inputs": [
      {
        "indexed": True,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": True,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": False,
        "internalType": "uint256",
        "name": "tokenID",
        "type": "uint256"
      },
      {
        "indexed": False,
        "internalType": "address",
        "name": "NFTaddress",
        "type": "address"
      },
      {
        "indexed": False,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": True,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": False,
        "internalType": "uint256",
        "name": "itemId",
        "type": "uint256"
      },
      {
        "indexed": False,
        "internalType": "uint256",
        "name": "statingtime",
        "type": "uint256"
      },
      {
        "indexed": False,
        "internalType": "string",
        "name": "uri",
        "type": "string"
      }
    ],
    "name": "AddedAuctions",
    "type": "event"
  }
    
    api_key = "KcjHvykS40BWeFpXqJHG4glWa3c11soOJSojQaic0nZHPiiZYjadkMC2K1KwtuDD"
    params = {
        "address": address, 
        "topic": "AddedAuctions(uint256,address ,uint256 ,address ,uint256 ,address,uint256 ,uint256 ,string)", 
        "chain": chain, 
        "disable_total": True, 
    }
    # topic = "ChangeOwnership(uint256, address, address)"
    result = evm_api.events.get_contract_events(
        api_key=api_key,
        params=params,
        body=body,
        )
    return Response(result)


# 2
@api_view(['GET'])
def Sales(requst,address,chain):
    body = {
    "anonymous": False,
    "inputs": [
      {
        "indexed": False,
        "internalType": "uint256",
        "name": "itemId",
        "type": "uint256"
      },
      {
        "indexed": False,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      },
      {
        "indexed": False,
        "internalType": "address",
        "name": "oldOwner",
        "type": "address"
      }
    ],
    "name": "ChangeOwnership",
    "type": "event"
  }


    api_key = "KcjHvykS40BWeFpXqJHG4glWa3c11soOJSojQaic0nZHPiiZYjadkMC2K1KwtuDD"
    params = {
        "address": address, 
        "topic": "ChangeOwnership(uint256,address,address)", 
        "chain": chain, 
        "disable_total": True, 
    }
    # topic = "ChangeOwnership(uint256, address, address)"
    result = evm_api.events.get_contract_events(
        api_key=api_key,
        params=params,
        body=body,
        )
    return Response(result)


@api_view(['GET'])
def Ranking(request):
    api_key = "KcjHvykS40BWeFpXqJHG4glWa3c11soOJSojQaic0nZHPiiZYjadkMC2K1KwtuDD"


    res = requests.get(
        "https://tehmasipsen0900.pythonanywhere.com/allItems/?category=all")
    collectionreq = requests.get(
        "https://tehmasipsen0900.pythonanywhere.com/all_collections/")
    collection = collectionreq.json()

    data = res.json()


    def crank(add):
        priceArray = []
        holdersArray = []
        for i in data:
            if i.get("contract_address") == add:
                price = float(i.get('price'))
                priceArray.append(price)
        if len(priceArray) > 0:
            return [min(priceArray), max(priceArray), sum(priceArray)]
        else:
            return []


    ranking = []
    for i in collection:
        a = crank(i.get('contract'))
        chainNames = []
        if len(a) > 0:
            chain = i.get("chainId")
            if chain == 137:
                chaniName = "Polygon"
                chainNames.append(chaniName)
            elif chain == 1:
                chaniName = "ETH"
                chainNames.append(chaniName)
            else:
                chaniName = "BSC"
                chainNames.append(chaniName)

            params = {
                "address": i.get("contract"),
                "chain": chainNames[0],
                "format": "decimal",
                "cursor": "",
                "normalizeMetadata": True,
            }

            result = evm_api.nft.get_nft_owners(
                api_key=api_key,
                params=params,
            )

            item = {"floor_price": a[0], "max_price": a[1], "volume": a[2], "holders": len(
                result.get('result')), "name": i.get("name"), "avatr": i.get("avatr"),"chainId":i.get("chainId"),"chainNmae":chainNames[0]}
            ranking.append(item)
    return Response(ranking)

