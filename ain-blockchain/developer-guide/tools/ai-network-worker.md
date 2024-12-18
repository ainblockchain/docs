---
description: This guide will instruct you on how to set up a worker node on the AI Network.
---

# AI Network Worker

**\[CAUTION] AI Network Worker on AIN Blockchain is on beta.**

You can provide your machine's computing power to the decentralized applications on AI Network Blockchain through AI Network Worker.

## How To Run AIN Worker

### Requirements

* Docker
* Ubuntu 18.04 or above
* Minimum Storage Requirements: 50 GB
* If you want to provide GPU computing power,
  * GPU
  * Nvidia-docker

### 1. (Optional) Check Graphics Driver

Before running a GPU supported worker, you should check the requirements. **If you want to run non-GPU worker, please skip this part.** First, let's check if the graphics driver is installed correctly. Please enter the following command:

```
$ nvidia-smi
```

The results will be printed in the following form, and you can check the CUDA version supported by your driver.

```
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 450.80.02    Driver Version: 450.80.02    CUDA Version: 11.0     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  Tesla K80           Off  | 00002DE1:00:00.0 Off |                    0 |
| N/A   44C    P0    69W / 149W |      0MiB / 11441MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+

+-----------------------------------------------------------------------------+
| Processes:                                                                  |
|  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
|        ID   ID                                                   Usage      |
|=============================================================================|
|  No running processes found                                                 |
+-----------------------------------------------------------------------------+
```

If the driver is not installed or the supported CUDA version is lower than 10.1, refer to [here](ai-network-worker.md#install-graphic-driver) to install the graphics driver.

### 2. (Optional) Check Nvidia Docker

**If you want to run non-GPU worker, please skip this part.** The next step is to check whether the docker and Nvidia docker is installed, which allows you to utilize the GPU on docker containers. Please enter the following command:

```
$ sudo docker run --rm --gpus all nvidia/cuda:11.0-base nvidia-smi
```

After you run the above command, you should see something similar to this:

```
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 450.80.02    Driver Version: 450.80.02    CUDA Version: 11.0     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  Tesla K80           Off  | 00002DE1:00:00.0 Off |                    0 |
| N/A   44C    P0    69W / 149W |      0MiB / 11441MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+

+-----------------------------------------------------------------------------+
| Processes:                                                                  |
|  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
|        ID   ID                                                   Usage      |
|=============================================================================|
|  No running processes found                                                 |
+-----------------------------------------------------------------------------+
```

If you're having trouble with the installation, please refer [here](ai-network-worker.md#install-nvidia-docker) to install the Nvidia docker.

### 3. Start a Worker

#### Non-GPU Worker

```shell
docker run -l AinConnect.container=master -d \
--restart unless-stopped --name ain-worker
-e APP_NAME=collaborative_ai \
-e NAME={NAME} \
-v /var/run/docker.sock:/var/run/docker.sock \
-v $HOME/ain-worker/{NAME}:/root/ain-worker/{NAME} \
ainblockchain/ain-worker
```

#### GPU Worker

```shell
docker run -l AinConnect.container=master -d \
--restart unless-stopped --name ain-worker --gpus all
-e APP_NAME=collaborative_ai \
-e NAME={NAME} \
-e CONTAINER_GPU_CNT=1 \
-e GPU_DEVICE_NUMBER=0 \
-v /var/run/docker.sock:/var/run/docker.sock \
-v $HOME/ain-worker/{NAME}:/root/ain-worker/{NAME} \
ainblockchain/ain-worker
```

#### Configurable Parameters

<table><thead><tr><th width="251.20151792692485">Parameter Name</th><th width="332.30795431298645">Description</th></tr></thead><tbody><tr><td><code>NAME</code></td><td>Worker Name</td></tr><tr><td><code>APP_NAME</code></td><td>AI Network Blockchain APP Name<br>(ex. collaborative_ai)</td></tr><tr><td><code>CONTAINER_VCPU</code></td><td>(Optional) Container CPU Core. Default is 1.</td></tr><tr><td><code>CONTAINER_MEMORY_GB</code></td><td>(Optional) A Container memory capacity in GB <br>Default is 4.</td></tr><tr><td><code>DISK_GB</code></td><td>(Optional) DISK Capacity in GB. Default is 50.</td></tr><tr><td><code>CONTAINER_GPU_CNT</code></td><td>(Optional) A Container Number of GPUs</td></tr><tr><td><code>GPU_DEVICE_NUMBER</code></td><td>(Optional) GPU Device IDs separated <code>,</code> <br>(ex. <code>0</code>, <code>0,1</code>, ...)</td></tr><tr><td><code>CONTAINER_MAX_CNT</code></td><td>(Optional) The maximum number of containers. Default is 1.</td></tr><tr><td><code>MNEMONIC</code></td><td>(Optional) if it does not exist, it is automatically created and saved in <code>$HOME/ain-worker/{NAME}/env.json</code></td></tr></tbody></table>

#### Officially Supported App List

* collaborative\_ai

### 4. Terminate a Worker

To terminate the AIN Worker, enter the following command:

```shell
docker rm -f $(docker ps -f "label=AinConnect.container" -q -a)
```

## Appendix

### Install Graphics Driver

Let's install the Nvidia graphics driver. The graphics driver's version must be at least 418.39. Execute the following commands in order:

```bash
$ sudo apt-get update -y
$ sudo apt purge nvidia-*
$ sudo add-apt-repository ppa:graphics-drivers/ppa
$ sudo apt update
```

You can find the appropriate driver version in the following way:

```bash
$ sudo apt install ubuntu-drivers-common
$ ubuntu-drivers devices
...
vendor   : NVIDIA Corporation
model    : GK210GL [Tesla K80]
driver   : nvidia-driver-440-server - distro non-free
driver   : nvidia-driver-390 - distro non-free
driver   : nvidia-driver-410 - third-party free
driver   : nvidia-driver-415 - third-party free
driver   : nvidia-driver-418-server - distro non-free
driver   : nvidia-driver-455 - third-party free recommended
driver   : nvidia-driver-450-server - distro non-free
driver   : nvidia-driver-450 - distro non-free
driver   : xserver-xorg-video-nouveau - distro free builtin
...
```

Find the version tagged 'recommended' in the list of drivers. In the example above, `nvidia-driver-455` is tagged with 'recommended'. Now you can install the appropriate graphics driver with the following command.

```
// Change `455` to the number that recommended for your system.
$ sudo apt install nvidia-driver-455
```

After installation is complete, reboot the system.

```bash
$ sudo reboot
```

Use the `nvidia-smi` command to confirm that the driver installation was successful.

```bash
$ nvidia-smi

+-----------------------------------------------------------------------------+
| NVIDIA-SMI 450.80.02    Driver Version: 450.80.02    CUDA Version: 11.0     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  Tesla K80           Off  | 00002DE1:00:00.0 Off |                    0 |
| N/A   44C    P0    69W / 149W |      0MiB / 11441MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+

+-----------------------------------------------------------------------------+
| Processes:                                                                  |
|  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
|        ID   ID                                                   Usage      |
|=============================================================================|
|  No running processes found                                                 |
+-----------------------------------------------------------------------------+
```

### Install Nvidia Docker

When the graphic driver installation is completed, you need to install the Nvidia docker to run AIN Worker. This guide has been created by referring to the Nvidia docs: [https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html#docker](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html#docker)

First, run the following command to install docker.

```bash
$ curl https://get.docker.com | sh \
  && sudo systemctl start docker \
  && sudo systemctl enable docker
```

After that, install the Nvidia container toolkit.

```bash
$ distribution=$(. /etc/os-release;echo $ID$VERSION_ID) \
   && curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add - \
   && curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
```

Finally, after installing the Nvidia docker, restart the docker.

```bash
$ sudo apt-get update
$ sudo apt-get install -y nvidia-docker2
$ sudo systemctl restart docker
```

Nvidia docker installation is complete. To check if it's installed properly, run the command below and make sure you see an output similar to the following.

```bash
$ sudo docker run --rm --gpus all nvidia/cuda:11.0-base nvidia-smi

+-----------------------------------------------------------------------------+
| NVIDIA-SMI 450.51.06    Driver Version: 450.51.06    CUDA Version: 11.0     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  Tesla T4            On   | 00000000:00:1E.0 Off |                    0 |
| N/A   34C    P8     9W /  70W |      0MiB / 15109MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+

+-----------------------------------------------------------------------------+
| Processes:                                                                  |
|  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
|        ID   ID                                                   Usage      |
|=============================================================================|
|  No running processes found                                                 |
+-----------------------------------------------------------------------------+
```

##
