from django.shortcuts import render
# Create your views here.
from moralis import evm_api
from rest_framework.decorators import api_view
import json
from rest_framework.response import Response

@api_view(['GET'])
def Sales(requst):
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
        "address": "0x8783832B3568FC52C5689c06f1350a294EDB4cDa", 
        "topic": "ChangeOwnership(uint256,address,address)", 
        "chain": "mumbai", 
        "disable_total": True, 
    }
    # topic = "ChangeOwnership(uint256, address, address)"
    result = evm_api.events.get_contract_events(
        api_key=api_key,
        params=params,
        body=body,
        )
    return Response(result)