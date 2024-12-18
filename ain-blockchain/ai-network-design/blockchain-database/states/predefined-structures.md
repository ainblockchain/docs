# Predefined Structures

## Reserved Characters in Paths

In data paths, the following characters are reserved:

| Characters                                        | Purpose                                           | Example                                                                                                                                         |
| ------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| /                                                 | Reserved for path separator                       | /apps/afan/users                                                                                                                                |
| .                                                 | Reserved for rule configs and owner configs       | <p>{</p><p>  .write: false,</p><p>  ...</p>                                                                                                     |
| \*                                                | Reserved for owner configs                        | <p>{ </p><p>  "apps": {<br>    ".owner": {<br>      "owners": {</p><p>        "*": {</p><p>...</p>                                              |
| $                                                 | Reserved for path variables in rule configs       | <p>{</p><p>  transfer: {</p><p>    $from: {</p><p>      $to: {</p><p>        $key: {</p><p>          value: {</p><p>            .write: ...</p> |
| {, }                                              | Reserved for variables in built-in function paths | /transfer/{from}/{to}/{key}/value                                                                                                               |
| #, \[, ], \<ASCII control characters 0-31 or 127> | Reserved for other purposes in the future         | -                                                                                                                                               |

## Pre-defined Paths in Database

The following pre-defined paths are used in the blockchain database:

| Path                                                  | Purpose            |
| ----------------------------------------------------- | ------------------ |
| /accounts/$address/balance                            | Account balance    |
| /accounts/$address/nonce                              | Account nonce      |
| /apps                                                 | Applications       |
| /consensus                                            | Consensus          |
| /checkin                                              | Check-in           |
| /deposit/$service\_id/$address/$deposit\_id           | Deposit            |
| /deposit\_accounts/$service\_id/$address/$account\_id | Deposit accounts   |
| /escrow                                               | Escrow             |
| /payments                                             | Payment            |
| /sharding                                             | Sharding           |
| /token/name                                           | Token name         |
| /token/symbol                                         | Token symbol       |
| /token/total\_supply                                  | Token total supply |
| /transfer/$from/$to/$key/value                        | Transfer           |
| /withdraw/$service\_id/$address/$withdraw\_id         | Withdraw           |

Owner configs and rule configs are stored in separate places in the database.
