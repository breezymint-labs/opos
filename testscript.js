const web3 = require("@solana/web3.js");

initializeKeypair()

function initializeKeypair() {
    // const secret = JSON.parse(process.env.NEXT_PUBLIC_VAULT_ACCOUNT);
    const account = process.env.VAULT_ACCOUNT
    const secret = JSON.parse("[72,112,40,218,181,68,47,102,143,13,241,5,65,28,72,20,70,51,194,91,36,130,19,115,221,193,177,131,182,81,85,202,35,142,181,24,232,206,32,248,194,184,145,171,110,42,44,82,160,184,214,35,142,65,193,255,38,43,87,85,14,113,11,217]");
    const secretKey = Uint8Array.from(secret);
    const keypairFromSecretKey = web3.Keypair.fromSecretKey(secretKey);
    console.log(keypairFromSecretKey.publicKey);
    console.log(account)
}


function sendSol() {
    const transaction = new web3.Transaction()
    const recipientPubKey = `BTBPKRJQv7mn2kxBBJUpzh3wKN567ZLdXDWcxXFQ4KaV`

    const sendSolInstruction = web3.SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipientPubKey,
        lamports: web3.LAMPORTS_PER_SOL * 0.1
    })

    transaction.add(sendSolInstruction)

    sendTransaction(transaction, connection).then(sig => {console.log(sig)})
}


async function createTA() {

    console.log("Creating a token account...");

    const connection = new web3.Connection("https://api.devnet.solana.com/");

    const payer = web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse("[72,112,40,218,181,68,47,102,143,13,241,5,65,28,72,20,70,51,194,91,36,130,19,115,221,193,177,131,182,81,85,202,35,142,181,24,232,206,32,248,194,184,145,171,110,42,44,82,160,184,214,35,142,65,193,255,38,43,87,85,14,113,11,217]")));

    const keypairTA = web3.Keypair.generate()

    const mint = `PublicKey [PublicKey(CSNEw2CA7Xp2wonXZK8XcivYDbiJGcioCa96oZpHsGzi)] {
        _bn: <BN: a9f017c0a62f185f0505411b9e1e144cb2892549253ec4a41c108d7029e9535f>
      }`

    const tokenAccount = await createAccount(
        connection,
        payer,
        mint,
        payer.publicKey,
        keypairTA
        // undefined, undefined,
    );
    console.log("Token account:", tokenAccount.toBase58());
}