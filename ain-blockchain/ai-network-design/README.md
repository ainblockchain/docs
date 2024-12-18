---
description: Blockchain for Serverless Computing
---

# Architecture

#### **Background**

AI Network was highly motivated by the idea behind Ethereum’s Turing completeness and world computer. A network in which every node verifies code execution can provide unprecedented security and immutability in the permissionless network. However, despite the considerable improvement over a few years, the performance of the smart contract still remains inadequate in terms of being capable of handling operations for all projected global applications. By design, scalability of Ethereum is limited by its own strength which can be summarized as statefulness, trustlessness, and serialized operation.

When designing modern serverless architecture, applications achieve high scalability through statelessness, permission, and concurrent operations. By decoupling computation from blockchain, AI Network can perform large scale operations in a serverless architecture. At the same time, AI Network blockchain is designed as a lightweight ledger that can process millions of transactions per second and safely record communication between clients and workers. The detailed differences between AI Network, blockchains, and serverless architectures are described in the following diagram.\


|               | **Blockchain** | **Serverless** | **AI Network**                                                                                        |
| ------------- | -------------- | -------------- | ----------------------------------------------------------------------------------------------------- |
| Operation     | Stateful       | Stateless      | <p>Balance/Rules/Trigger State: Stateful</p><p>Value State: Stateless</p>                             |
| Access        | Permissionless | Permissioned   | <p>Blockchain Validator: Permissionless</p><p>Trigger: Permissioned/Permissionless (configurable)</p> |
| Storage       | Persistent     | Ephemeral      | Persistent                                                                                            |
| Network       | Distributed    | Decentralized  | Distributed                                                                                           |
| Scalability   | Low            | High           | High                                                                                                  |
| Latency       | High           | Low            | Low                                                                                                   |
| Data Capacity | Low            | High           | High                                                                                                  |
| Concurrency   | Serialized     | Concurrent     | Concurrent                                                                                            |
| Language      | Monoglot       | Polyglot       | Polyglot                                                                                              |

Table 1. Comparison between blockchain, serverless, and AI Network. AI Network uses blockchain as a lightweight communication channel and adapts serverless architecture for computation.\


#### **Blockchain for Serverless Computing** 

Function as a service (FaaS) is a platform allowing customers to develop, run, and manage application functionalities without the complexity of building and maintaining the infrastructure. Although FaaS is often used as a category of cloud service, it is interesting to notice that Ethereum can also provide similar characteristics. Especially, Web IDEs for solidity such as remix ([https://remix.ethereum.org](https://remix.ethereum.org/)) enable developers to develop Solidity contracts straight from the browser, and then deploy to Ethereum network. Once it is deployed, EVM in Ethereum nodes run the functions, and developers don’t have to worry about maintaining the infrastructure. Furthermore, unlike cloud functions that can be stopped and modified as developers require, deployed functions are managed forever, unless the function has exposed the self-destruction method.

Despite the similarities, Ethereum is far from a general purpose FaaS because (1) It only supports Solidity. (2) Operations are expensive. (3) It can only interact with Ethereum’s internal state, and cannot call other components such as external databases and APIs.&#x20;

![](<../../.gitbook/assets/image (27).png>)

Fig 1. EVM runs contracts and contracts need not to be managed by developers once they are deployed. In this respect, Ethereum can be viewed as a very slow and expensive Function as a Service. Unlike monoglot Ethereum, AI Network runs a variety of languages on heterogeneous types of runtime environments. We refer to these environments as Secure Runtime Environment, or SRE for short.



AI Network deploys functions to the blockchain just like Ethereum, but it can also (1) support all available languages and framework, (2) cost less than major cloud services, and (3) can interact with off-chain components if necessary.\


| <p></p><p></p><p><img src="../../.gitbook/assets/image (18).png" alt=""></p><p></p> | <p></p><p><img src="../../.gitbook/assets/image (33).png" alt=""></p> |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------------- |

Fig 2. Ethereum supports only one language (Solidity) and one virtual machine (EVM), and all nodes execute the same transactions. AI Network can support multiple languages and several types of SREs host different types of functions. While blockchain records transactions, execution for the transaction happens on off-chain worker nodes.

For more information, refer to the [AI Network Architecture Paper](https://www.ainetwork.ai/public/architecture.pdf)
