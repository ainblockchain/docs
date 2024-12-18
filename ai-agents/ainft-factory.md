# AINFT Factory

<figure><img src="../.gitbook/assets/AINFT Factory.png" alt=""><figcaption><p>Figure 1. AINFT Factory.</p></figcaption></figure>

AINFT Factory is a tool for [AINFT](https://docs.ainetwork.ai/ainfts/ainft) communities to manage their projects. It helps manage the data of the community members and the AINFTs in trustable manners by bridging the communities and the common backends such as decentralized storage, blockchain database, and AI model backends. More specifically, AINFT Factory is a platform that provides common APIs for AINFT communities to build up their tokenomics. Table 1 summarizes such APIs.

_Table 1. APIs of AINFT Factory._

<table><thead><tr><th width="122">Category</th><th width="483">API summary</th><th width="97">Notes</th></tr></thead><tbody><tr><td>project</td><td>create project, delete project</td><td></td></tr><tr><td>auth</td><td>manage the access to the project</td><td></td></tr><tr><td>asset</td><td>manage user assets such as NFTs and credits</td><td></td></tr><tr><td>event</td><td>manage community events and rewards</td><td></td></tr><tr><td>store</td><td>manage community item stores</td><td></td></tr><tr><td>AI model</td><td>manage communication between AI models</td><td></td></tr><tr><td>device</td><td>manage devices and games</td><td></td></tr></tbody></table>

<figure><img src="../.gitbook/assets/AINFT Factory structure.png" alt=""><figcaption><p>Figure 2. Structure of AINFT Factory.</p></figcaption></figure>

Using the APIs provided by AINFT Factory, each community can realize their own tokenomics by building their community bots, community homepages, or community devices. Currently, AINFT Factory APIs support Ethereum [ERC721 tokens](https://eips.ethereum.org/EIPS/eip-721) and [AIN Blockchain](https://medium.com/ai-network/bottt-ep-1-ain-blockchain-quick-intro-f0810c146e96) as a blockchain database. Also the platform provides some Solidity template code for deploying new ERC721 NFTs and TypeScript template code for developing Discord community bots and AI model bots.

The AINFT projects implemented upon AINFT Factory can benefit in:

* Managing user-owned NFT collection lists&#x20;
* Managing metadata in AIN Blockchain&#x20;
* Managing metadata in decentralized storage
* Managing the AI models attached to AINFTs&#x20;
* Managing AINFT devices
