# Rule Configs

## Syntax

Rule configs are stored as a ".write" property on a path in the database using SET\_RULE operation.&#x20;

```
{
  <path>: {  // path can include variables like $key
    <to>: {
      <target_node>: {
        .write: <eval string to determine the write permission>
      }
    }
  }
}
```

Its value is an javascript eval string that will be evaluated true or false to determine users' permission on the path whenever a transaction with value write operations on the path is submitted.&#x20;

## Path Variables and Built-in Variables

The path can have path variables like "/transfer/$from/$to/value" to allow flexibility of rule expressions. In the same context, built-in variables are also provided by the system:

| Variable / Function                                   | Members | Semantic                                                                                                                                                                                                                              | Example                                                               | API Version |
| ----------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ----------- |
| auth                                                  | addr    | Sender (signer) address                                                                                                                                                                                                               | auth.addr === '$uid'                                                  | 1.0         |
| auth                                                  | fid     | Caller (function) ID                                                                                                                                                                                                                  | auth.fid === '\_transfer'                                             | 1.0         |
| getValue(\<db path>)                                  |         | To get the value at the db path                                                                                                                                                                                                       | getValue('/accounts/' + $user\_addr + '/balance') >= 0                | 1.0         |
| getRule(\<db path>)                                   |         | To get the rule at the db path                                                                                                                                                                                                        | getRule('/apps/test\_app')                                            | 1.0         |
| getOwner(\<db path>)                                  |         | To get the owner at the db path                                                                                                                                                                                                       | <p>getOwner('/apps/test_app')</p><p></p>                              | 1.0         |
| getFunction(\<db path>)                               |         | To get the function at the db path                                                                                                                                                                                                    | getFunction('/apps/test\_app')                                        | 1.0         |
| evalRule(\<db path>, \<value>, \<auth>, \<timestamp>) |         | To eval the rule config at the rule path                                                                                                                                                                                              | evalRule('/apps/test\_app/posts/1', 'hello world', auth, currentTime) | 1.0         |
| evalOwner(\<db path>, \<permission>, \<auth>)         |         | To eval the owner config at the owner path                                                                                                                                                                                            | evalOwner('/apps/test\_app/posts/1', 'write\_owner', auth)            | 1.0         |
| newData                                               |         | The new data to be set at the given path                                                                                                                                                                                              | getValue('/accounts/' + $user\_addr + '/balance') >= newData          | 1.0         |
| data                                                  |         | The existing data at the given path                                                                                                                                                                                                   | data !== null                                                         | 1.0         |
| currentTime                                           |         | Current timestamp                                                                                                                                                                                                                     | currentTime <= $time + 24 \* 60 \* 60                                 | 1.0         |
| lastBlockNumber                                       |         | Last block number                                                                                                                                                                                                                     | lastBlockNumber > 10000                                               | 1.0         |
| util                                                  |         | <p>A collection of various utilities</p><p>Check this link :<a href="https://github.com/ainblockchain/ain-blockchain/blob/master/db/rule-util.js">https://github.com/ainblockchain/ain-blockchain/blob/master/db/rule-util.js</a></p> | util.isString(newData)                                                |             |

## Examples

Rule configs can be set as the following examples:

```
{
  transfer: {
    $from: {
      $to: {
        $key: {
          value: {
            .write: "auth.addr === $from && !getValue('transfer/' + $from + '/' + $to + '/' + $key) && getValue(util.getBalancePath($from)) >= newData"
          }
        }
      }
    }
  },
  apps: {
    afan: {
      .write: "auth.addr === '0x12345678901234567890123456789012345678'",
      follow: {
        $uid: {
          .write: "auth.addr === $uid"
        }
      }
    }
  }
}
```

There is no ‘read’ permission in data access. It means all network participants can read your data. To secure data on specific node path, users need to encrypt the data with their own private key.

## Application of Rule Configs

Permission of a value write operation (e.g. SET\_VALUE) is check as follows:

* When there are no rule configs on the requested path, closest ancestor's rule config is applied
* If there are more than one path matched, the most specific rule config is applied
  * e.g. Among a) /apps/$app\_id/$service, b) /apps/afan/$service, c) /apps/afan/wonny, c) is applied.
* When the value of the write operation in request is an object, the operation is granted when the permission check succeeds on every path of object. For example, SET\_VALUE operation is requested on /foo/bar with value { abc: "abc\_val", def: "def\_val" }, it should pass the permission check on /foo/bar, /foo/bar/abc, and /foo/bar/def.
* Rule config always overrides its ancestors' rule configs
