import { VercelRequest, VercelResponse } from '@vercel/node';
import algosdk from 'algosdk';


export default async (request: VercelRequest, response: VercelResponse) => {
  try {
    const client = new algosdk.Algodv2(
      {
        'X-API-key' : process.env.ALGOD_TOKEN,
      },
      process.env.ALGOD_SERVER,
      '',
    );

    const recoveredAccount = algosdk.mnemonicToSecretKey(mnemonic);


    const params = await client.getTransactionParams().do();

    let txn = {
      from: recoveredAccount.addr,
      to: toAddress,
      fee: 1,
      amount: 1000000,
      firstRound: params.firstRound,
      lastRound: params.lastRound,
      genesisID: params.genesisID,
      genesisHash: params.genesisHash,
      note: new Uint8Array(0),
    };

    let signedTxn = algosdk.signTransaction(txn, recoveredAccount.sk);
    let sendTx = await client.sendRawTransaction(signedTxn.blob).do();

    console.log(`Transaction : ${sendTx.txId}`);
    // console.log(await client.accountInformation(recoveredAccount.addr).do());
    response.end();
  } catch (e) {
    console.log(e);
    response.end();
  }
}
