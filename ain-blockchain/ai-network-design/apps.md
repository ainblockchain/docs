# Apps

Since AIN Blockchain is essentially a large public decentralized database, we have designed a concept of "Apps", where each app could represent a service or an organization.

## Registration

An App can be created and registered by setting app configs at `/manage_app/${appName}/create/${key}`. App configs include admin, billing, and service configs.&#x20;

#### Options

* \[boolean] is\_public: When is\_public option is set to `true`, the created app will allow anyone to set value and give branch\_owner, write\_function, and write\_rule owner permissions to anyone at the app's path (`/apps/${appName}`). Note that this option does not override the admin / billing / service configs, but sets additional permissions on top of the given configs.

## Configuration

### Admin Config

Admin config is a mapping of address and boolean (true), and if an address is added as an admin, upon the creation of the app, the address obtains all the owner permissions (branch\_owner, write\_function, write\_owner, write\_rule) as well as the write rule permission for the path `/apps/${appName}`.

```javascript
ain.db.ref(`/manage_app/${appName}/create/${Date.now()}`).setValue({
  admin: {
    "0xADDR_1": true,
    "0xADDR_2": true
  }
});
```

### Billing Config

The billing config specifies the names of the billing accounts associated with the app and the addresses that can use the billing accounts when sending transactions.

```javascript
ain.db.ref(`/manage_app/${appName}/create/${Date.now()}`).setValue({
  admin: {
    "0xADDR_1": true,
    "0xADDR_2": true
  },
  billing: {
    billingAccountA: {
      users: {
        "0xADDR_1": true,
        "0xADDR_2": true
      }
    },
    billingAccountB: {
      users: {
        "0xADDR_1": true,
        "0xADDR_3": true
      }
    }
  }
});
```

### Service Config

The service config contains service-specific configurations. For example, if the app uses a staking service, it could set the default lock-up duration by setting the config as follows:

```javascript
ain.db.ref(`/manage_app/${appName}/create/${Date.now()}`).setValue({
  admin: {
    "0xADDR_1": true,
    "0xADDR_2": true
  },
  billing: {
    billingAccountA: {
      users: {
        "0xADDR_1": true,
        "0xADDR_2": true
      }
    },
    billingAccountB: {
      users: {
        "0xADDR_1": true,
        "0xADDR_3": true
      }
    }
  },
  service: {
    staking: {
      lockup_duration: 2592000000 // ms
    }
  }
});
```

###

