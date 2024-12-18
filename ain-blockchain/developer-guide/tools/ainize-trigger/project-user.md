# Project user



Let's find out how to create an App on AI Network Blockchain and set up the Trigger Function through Ainize.

#### (1) Create your own app

First, let's create an App.

![](<../../../../.gitbook/assets/image (14).png>)

When creating an app, the `/manage_app/${appName}` Database path will appear as shown in the picture above. This means that the user who created the app has been registered as the admin of the app. The admin will get owner and writing permissions in the `/apps/${appName}` path. (You can check the following picture in detail on [AI Network Insight](https://insight.ainetwork.ai/))

![](<../../../../.gitbook/assets/image (41).png>)

#### (2) Set a Trigger Function

Now, let’s register the Trigger Function. When a value is written in a specific path set as the `Database path`, a POST request is sent to the endpoint set as the `API endpoint`, including the value written to the path.

![](<../../../../.gitbook/assets/image (45).png>)

#### (3) Test Trigger Function (optional)

Let's check if the Trigger Function has been set correctly. First, input the path and value you want to write down and click the Test trigger button. When this button is clicked, the value entered as Input will be written in the `Database path`. When the value is written, the trigger function set in step 2 will be triggered and a POST request will go to the `API endpoint`. After creating the result value in the API Server deployed on Ainize, the result value will be written on the blockchain.

![](<../../../../.gitbook/assets/image (40).png>)

When you click the “Go to check result” button, you can see the blockchain, like in the following picture, and you will be able to see that the values are written correctly.

![](<../../../../.gitbook/assets/image (42).png>)

To summarize the flow:

![](<../../../../.gitbook/assets/image (4).png>)
