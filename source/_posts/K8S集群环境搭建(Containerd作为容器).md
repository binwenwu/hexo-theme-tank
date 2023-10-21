---
title: K8S集群环境搭建(Containerd作为容器)
cover: https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/u%3D2793533854%2C2733450472%26fm%3D253%26fmt%3Dauto%26app%3D138%26f%3DJPEG
top_img: https://bu.dusays.com/2022/09/01/63103a65e883d.webp
keywords: 'K8S, Containerd'
categories:
  - 云原生
tags:
  - K8S
  - Containerd
abbrlink: 9d39de82
date: 2023-08-06 15:08:12
swiper_index: 1 #置顶轮播图顺序，非负整数，数字越大越靠前
---

## 1 前述

### 1.1 云原生定义

- **Pivotal《传统应用和SOA向云原生转型指南》（2015）的云原生的特征：**
  - 符合 12 要素应用
    - <font color='blue'>基准代码</font>：一份基准代码，多份部署（类似于Git版本控制系统的main分支）；
    - <font color='blue'>显示声明所有依赖关系</font>：通过依赖清单，确切地声明所有依赖项；
    - <font color='blue'>把后端服务当作附加资源</font>：各种后端服务（如数据库、消息队列、邮件服务、缓存系统），不区别对待本地或第三方服务；
    - <font color='blue'>构建、发布、运行</font>：严格区分构建、发布、运行这三个步骤；
    - <font color='blue'>无状态进程</font>：应用的进程必须无状态；
    - <font color='blue'>端口绑定</font>：互联网应用通过端口绑定来提供服务，并监听发送至该端口的请求。应用完全自我加载，不依赖于任何网络服务器；
    - <font color='blue'>并发</font>：通过进程模型进行扩展。进程是一等公民；
    - <font color='blue'>易处理</font>：进程可以瞬间开启或停止，有利于快速、弹性的伸缩应用。进程应追求最小启动时间；进程一旦接受终止信号就会优化的终止；进程在面对突然死亡时保持健壮；
    - <font color='blue'>开发环境与线上环境等价</font>：尽可能的保持开发，预发布，线上环境相同，以尽量做到持续部署；
    - <font color='blue'>日志</font>：应用本身从不存储自己的输出流，不应该试图去写或者管理日志文件，相反，每一个运行的进程都会直接的标准输出（stdout）事件流；
    - <font color='blue'>管理进程</font>：后台管理任务当作一次性进程运行；
  - 面向微服务架构
    - 微服务将<font color='blue'>单体系统</font>分解为多个“仅做好一件事”的可独立部署的服务。这件事通常代表某项业务能力，或者最小可提供业务价值的“原子“服务单元。具备以下优点：
      - <font color='blue'>变更周期解耦</font>：只要变更限于单一有界的环境，并且服务继续履行其现有合约；实现了更频繁和快速的部署，从而实现了持续的价值流动；
      - <font color='blue'>减少业务领域和现有代码的学习负担</font>；
      - <font color='blue'>可以加快采用新技术的步伐</font>；
      - <font color='blue'>提供独立、高效的服务扩展</font>；
  - 自服务敏捷架构（可以认为是DevOps）：
    - 一个能够持续部署和运行这些微服务的平台；如代码以Git形式“推送”。 然后，自服务敏捷平台构建应用程序工件，构建应用程序环境，部署应用程序，并启动必要的进程。 团队不必考虑他们的代码在哪里运行或如何到达那里，这些对用户都是透明得，因为平台会关注这些。
  - 基于 API 的协作
  - 抗脆弱性
- **云原生计算基金会（2015）定义的特征**
  - 应用容器化
  - 面向微服务架构
  - 应用支持容器的编排制度
- **云原生计算基金会（2018）定义**
  - 云原生技术有利于各组织在公有云、私有云和混合云等新型动态环境中，构建和运行可弹性扩展的应用。云原生的代表技术包括容器、服务网格、微服务、不可变基础设施和声明式 API
  - 这些技术能够构建容错性好、易于管理和便于观察的松耦合系统。结合可靠的自动化手段，云原生技术使工程师能够轻松地对系统作出频繁和可预测的重大变更



### 1.2 容器、虚拟机、Docker、Openstack 和 K8S

- **容器&虚拟机**：均为虚拟化技术，容器更为轻量化、效率更高、启动更快；虚拟机需数分钟启动，容器仅需数十毫秒；
- **Docker**： 容器化虚拟技术事实上的标准；
- **OpenStack**：分布式的虚拟机服务平台，相比于普通的虚拟机软件（如Vmare），多了分布式虚拟机调度管理的功能和节点的负载均衡； 
- **K8S**：分布式的容器调度管理平台，相比于Docker，多了分布式的容器调度管理和节点的负载均衡；
- **注意**：常见的中文资料均言K8S是容器编排软件，这里的编排是指调度、管理的意思，而非工作流编排的意思，容易有误导性；
- **注意**：无论是Openstack还是K8S，均不支持跨节点的容器或虚拟机的创建；所以将多台电脑合并成一台电脑的想法是不现实的；



### 1.3 K8S 和 云原生

在单机上运行容器，无法发挥它的最大效能，只有形成集群，才能最大程度发挥容器的良好隔离、资源分配与编排管理的优势，而对于容器的编排管理，Swarm、Mesos 和 Kubernetes 的大战已经基本宣告结束，Kubernetes 成为了无可争议的赢家。

- Kubernetes 成为云原生应用的基石
- 有机会成为跨云的真正的云原生应用的操作系统

### 1.4 K8S 介绍

- **<font color='red'>官方</font>**：**Kubernetes** 也称为 **K8S**，是用于自动部署、扩缩和管理容器化应用程序的开源系统。
- **<font color='red'>发展历史</font>**：由**Google**设计并捐赠给**Cloud Native Computing Foundation**（今属**Linux**基金会）来使用。
- **<font color='red'>能力</font>**：**Google** 每周运行数十亿个容器，能够在不扩张运维团队的情况下进行规模扩展。
- **<font color='red'>作用</font>**： 相当于一个操作系统，可以快速提供**PaaS**服务：1）创建各种容器化测试化环境；2）发布各种容器化服务；3）快速安装各种容器化服务，如MongoDB、**Hbase**、**Postgresql**、**Redis**、**Spark**等；快速提供IaaS服务：通过安装**Openstack**或**KubeVirt**等软件；快速提供**FaaS**服务：通过安装**Kube** **Native**等软件；

![image-20230414170948460](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230414170948460.png)

![image-20230414171119324](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230414171119324.png)

### 1.5 基本概念

- **Container**：轻量级的系统虚拟化技术，使用namespace隔离环境。
- **Pod**：
- - **K8S** 的调度的基本单位，**Pod**是一组紧密关联的容器集合，内部的容器共享PID、IPC、Network和UTS namespace。可以通过进程间通信和文件共享这种简单高效的方式组合完成服务。
  
  ![image-20230415141540422](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230415141540422.png)

​				Pod的设计理念基础是微服务，不同类型的业务组合由不同类型的Pod执行，一个Pod对应一个微服务

- - K8S中，采用manifest（yaml或json）定义对象，比如nginx服务（包含了一个nginx 容器image）定义为：

```YAML
	apiVersion: v1
	kind: Pod
	metadata:
	  name: nginx
	  labels:
	    app: nginx
	spec:
	  containers:
	  - name: nginx
	    image: nginx
	    ports:
```

- - **Node:** 是Pod运行的主机，可以为物理机，也可以为虚拟机。每个Node上要运行container runtime （docker或者rkt）、kubelet和kube-proxy服务
  - ![image-20230415142123300](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230415142123300.png)

- - **Service:** 一个Pod只是一个运行服务的实例，可能在一个节点上停止，在另一个节点以一个新的IP启动一个新的Pod。在K8S集群中，客户端需要访问的服务就是Service对象。每个Service会对应一个集群内部有效的虚拟IP，集群内部通过虚拟IP访问一个服务。
- - **Kubelet:**  每个Node的任务和资源管理
- - **Kube-proxy:**  负责每个节点的硬件负载均衡



### 1.6 K8S 常见命令

- **运行一个Nginix容器：** 
  - `kubectl run --image=nginx:alpine nginx-app --port=80`
- **Kubectl 命令：**
  - `kubectl get - 类似于 docker ps，查询资源列表`
  - `kubectl describe - 类似于 docker inspect，获取资源的详细信息`
  - `kubectl logs - 类似于 docker logs，获取容器的日志`
  - `kubectl exec - 类似于 docker exec，在容器内执行一个命令`
  - `kubectl create -f file.yaml – 根据yaml创建Deployment资源`
  - `kubectl delete 删除命令，可删除node、pod、svc、depolyment`
- **yaml 定义 Pod：**

```YAML
	apiVersion: v1
	kind: Pod
	metadata:
	  name: nginx
	  labels:
	    app: nginx
	spec:
	  containers:
	  - name: nginx
	    image: nginx
	    ports:
	    - containerPort: 80
```

- **Volume：**
  -  一个**Pod**一旦发生异常，**Pod** 产生的数据会随着 **Pod** 消亡而自动消失。**Volume** 用于持久化容器数据。
  - 如：为 **redis** 容器指定一个 **hostPath** 来存储 **redis** 数据

```YAML
	apiVersion: v1
	kind: Pod
	metadata:
	  name: redis
	spec:
	  containers:
	  - name: redis
	    image: redis
	    volumeMounts:
	    - name: redis-persistent-storage
	      mountPath: /data/redis
	  volumes:
	  - name: redis-persistent-storage
	    hostPath:
	      path: /data/
```

- **Service：**
  - kubectl创建Pod，Pob的IP地址会随着Pod的重启而变化
  - 为了访问Pod提供的服务，采用Service提供为一组Pod一个统一的入口，并提供负载均衡和**自动服务发现**。
    - `kubectl expose deployment nginx-app --port=80 --target-port=80 --type=NodePort`
- **Replicas set：**
  - 在一个Service中,可为Pod设置数个副本，以确保服务永不掉线
    - `kubectl scale --replicas=3 deployment/nginx-app`

![image-20230415143046325](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230415143046325.png)

- **滚动升级（Rolling Update）：**
  - 滚动升级（Rolling Update）通过逐个副本容器替代升级的方式来实现无中断的服务升级：
    - `kubectl rolling-update frontend-v1 frontend-v2 --image=image:v2`
  - 滚动升级中若发生错误，可随时回滚：
    - `kubectl rolling-update frontend-v1 frontend-v2 --rollback`
- **资源限制：**
  - K8S通过 cgroups 提供容器资源管理的功能，可限制每个容器的 CPU 和内存使用，比如对于刚才创建的 deployment，可以通过下面的命令限制 nginx 容器最多只用 50% 的 CPU 和 128MB 的内存：
    - `kubectl set resources deployment nginx-app -c=nginx --limits=cpu=500m,memory=128Mi`
  - 或者在yaml中指定资源限制
- **健康检查：**
  - K8S Kubernetes 提供了两种探针（Probe，支持 exec、tcpSocket 和 http 方式）来探测容器的状态：
    - LivenessProbe：探测应用是否处于健康状态，如果不健康则删除并重新创建容器
    - ReadinessProbe：探测应用是否启动完成并且处于正常服务状态，如果不正常则不会接收来自 Kubernetes Service 的流量



### 1.7 K8S 常用运维命令

- **查看pod，及所在的节点：**
  - `kubectl get pods -o wide`
- **若有节点warn，回收垃圾失败：**

```BASH
kubectl drain --delete-local-data --ignore-daemonsets NODENAME
kubectl uncordon NODENAME
```



## 2 K8S 集群基础环境部署

{% p red, 若服务器之前搭建过 K8S 集群，需要彻底删除 %}

<span style="color:red">参考</span>：https://blog.csdn.net/qq_43159578/article/details/124131709 

- 停止所有的Kubernetes服务

```BASH
sudo systemctl stop kubelet
sudo systemctl stop containerd
```

- 删除Kubernetes软件包

```BASH
yum remove kubeadm kubectl kubelet kubernetes-cni -y
```

- 删除配置文件

```BASH
# 清除残留文件
rm -rf /root/.kube
rm -rf /etc/cni/net.d
rm -rf /etc/kubernetes/*
```

- 删除etcd数据目录

```BASH
rm -rf /var/lib/etcd
```

- 清除iptables或者ipvs的配置

```BASH
# sudo ipvsadm -C
# sudo iptables -F && sudo iptables -t nat -F && sudo iptables -t mangle -F && sudo # # iptables -Xkubec
```

- <font color='red'>如果只是想重新部署集群</font>

```BASH
kubeadm reset
```

`kubeadm reset` 命令用于清除当前节点上所有与 `kubeadm init` 或 `kubeadm join` 命令创建的 Kubernetes 集群相关的状态。其主要作用如下：

1. 移除 Kubernetes 集群相关的系统服务，如 kubelet 和 kube-proxy。

2. 删除所有在当前节点上创建的 Kubernetes 对象，包括 Pod、Service、Deployment 等。

3. 移除 etcd 中与当前节点相关的信息，如节点标识、配置信息等。

4. 删除 Kubernetes 数据目录，包括证书、密钥、kubeconfig 文件等。

使用 `kubeadm reset` 命令可以清除当前节点上的所有 Kubernetes 相关状态，以便重新创建新的 Kubernetes 集群或者将当前节点加入到另一个 Kubernetes 集群中。在进行 `kubeadm reset` 操作之前，应该先备份当前节点上的重要数据和配置信息，以便在需要时进行恢复。



### 2.1 服务器	

- **网络资源：**各节点间通过**千兆交换机**互联（非光纤交换机）
- **管理节点：**
  - <font color='blue'>Gisweb4，Gisweb3</font>
- **计算节点：**
  - <font color='blue'>Gisweb3，GISweb2，dellm640-01, Gisweb4, dellslot03, dellslot4</font>
- **持久化存储资源：**
  - 目前采用：
    - <font color='blue'>nfs-client: 23服务器的/mnt/storage/k8s/pv</font>
- **Node1（刀片3）：**
  - <font color='blue'>子网 IP：192.168.0.177</font>
  - <font color='blue'>CPU：Intel(R) Xeon(R) Silver 4216 CPU @ 2.10GHz；32核心</font><font color='red'>，64线程。</font>
  - <font color='blue'>内存：64GB（32GB*2），每根DDR4，</font><font color='red'>3000Mhz</font>
- **Node2（刀片4）：**
  - <font color='blue'>子网 IP：192.168.0.209</font>
  - <font color='blue'>CPU：Intel(R) Xeon(R) Silver 4216 CPU @ 2.10GHz；32核心</font>，<font color='red'>64线程。</font>
  - <font color='blue'>内存：64GB（32GB*2），每根DDR4</font><font color='red'>3200Mhz</font>



### 2.2 安装过程

#### 2.2.1 前提条件

a.    节点之中不可以有重复的主机名、`MAC` 地址或 `product_uuid`

```BASH
cat /sys/class/dmi/id/product_uuid
```

b.    检查网络适配器：若有多个网卡，确保每个node的子网通过默认路由可达

c.    防火墙开放端口<font color='red'>(所有节点)</font>：

![image-20230415145138479](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230415145138479.png)

```BASH
systemctl restart firewalld
firewall-cmd --zone=public --add-port=443/tcp --permanent
firewall-cmd --zone=public --add-port=6443/tcp --permanent
firewall-cmd --zone=public --add-port=2379-2380/tcp --permanent
firewall-cmd --zone=public --add-port=10250/tcp --permanent
firewall-cmd --zone=public --add-port=10259/tcp --permanent
firewall-cmd --zone=public --add-port=10257/tcp --permanent
```

d.    关闭防火墙<font color='red'>(所有节点）</font>：

```BASH
systemctl stop firewalld NetworkManager
systemctl disable firewalld NetworkManager
```

e.    关闭交换分区并禁用 SELinux<font color='red'>（所有节点）</font>：

```bash
# 查看 交换分区
free -m

# 将 `SELinux` 设置为 `permissive` 模式（相当于将其禁用）  第一行是临时禁用，第二行是永久禁用
setenforce 0
sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config

# 关闭swap；第一行是临时禁用，第二行是永久禁用
swapoff -a  
sed -ri 's/.*swap.*/#&/' /etc/fstab

# 允许 iptables 检查桥接流量 （K8s 官方要求）
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
br_netfilter
EOF

cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF

# 让配置生效
sysctl --system
```

f.    时间同步<font color='red'>（所有节点）</font>：

```bash
yum install chrony -y
systemctl start chronyd
systemctl enable chronyd
chronyc sources
```

g.    设置主机名并添加 ip 映射<font color='red'>（所有节点）</font>：

```BASH
# 以 gisweb4 为例
# 查看主机名cat 
hostname
# 设置主机名
hostnamectl set-hostname gisweb4
# 更新
bash

# 添加 ip 映射
echo "125.250.153.23  gisweb4" >> /etc/hosts
echo "125.250.153.23  gisweb4" >> /etc/hosts
# 两台无外网ip的刀片添加内网ip

# /etc/hosts 文件内容如下：
192.168.0.203 gisweb1
192.168.0.202 gisweb2
192.168.0.204 gisweb4
192.168.0.208 gisweb3
192.168.0.176 dellm640-01
192.168.0.177 dellm640-03
192.168.0.209 dellslot04

125.220.153.26 gisweb1
125.220.153.25 gisweb2
125.220.153.22 gisweb3
125.220.153.23 gisweb4
125.220.153.28 dellm640-01
```

#### 2.2.2 升级 Linux 内核到最新<font color='red'>（所有节点）</font>：

**清除缓存，重新构建缓存：**

```BASH
# 清除缓存
yum makecache & yum -y update
```

**<font color='red'>参考链接</font>：*<font color='cyan'>https://zhuanlan.zhihu.com/p/368879345</font>***

#### 2.2.3 转发 IPv4 并让 iptables 看到桥接流量<font color='red'>（所有节点）</font>

``````SHELL
# a.	验证br_netfilter是否已经加载
lsmod | grep br_netfilter
# b.	加载br_netfilter模块：
modprobe br_netfilter
# c.	iptabels桥接
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

modprobe overlay
modprobe br_netfilter

# 设置所需的 sysctl 参数，参数在重新启动后保持不变
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

# 应用 sysctl 参数而不重新启动
sysctl --system
``````

#### 2.2.4  安装 ipvsadm<font color='red'>（所有节点）</font>

``````BASH
yum install ipvsadm ipset sysstat conntrack libseccomp -y

cat <<EOF | sudo tee /etc/modules-load.d/ipvs.conf
ip_vs
ip_vs_rr
ip_vs_wrr
ip_vs_sh
nf_conntrack
ip_tables
ip_set
xt_set
ipt_set
ipt_rpfilter
ipt_REJECT
ipip
EOF

systemctl restart systemd-modules-load.service

lsmod | grep -e ip_vs -e nf_conntrack
``````

#### 2.2.5 修改内核参数<font color='red'>（所有节点，lb除外）</font>

```BASH
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.ipv4.ip_forward = 1
net.bridge.bridge-nf-call-iptables = 1
fs.may_detach_mounts = 1
vm.overcommit_memory=1
vm.panic_on_oom=0
fs.inotify.max_user_watches=89100
fs.file-max=52706963
fs.nr_open=52706963
net.netfilter.nf_conntrack_max=2310720

net.ipv4.tcp_keepalive_time = 600
net.ipv4.tcp_keepalive_probes = 3
net.ipv4.tcp_keepalive_intvl =15
net.ipv4.tcp_max_tw_buckets = 36000
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_max_orphans = 327680
net.ipv4.tcp_orphan_retries = 3
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 16384
net.ipv4.ip_conntrack_max = 65536
net.ipv4.tcp_max_syn_backlog = 16384
net.ipv4.tcp_timestamps = 0
net.core.somaxconn = 16384

net.ipv6.conf.all.disable_ipv6 = 0
net.ipv6.conf.default.disable_ipv6 = 0
net.ipv6.conf.lo.disable_ipv6 = 0
net.ipv6.conf.all.forwarding = 1
EOF

sysctl --systemS
```

#### 2.2.6 安装Container Runtime<font color='red'>(选用containerd,弃用docker)</font>：

- **Docker-engine+cir-dockerd方案（<font color='red'>舍弃</font>）**：从kubernetes 1.24开始，dockershim已经从kubelet中移除，但因为历史问题docker却不支持kubernetes主推的CRI（容器运行时接口）标准，需要在kubelet和docker之间加上一个中间层cri-docker。cri-docker是一个支持CRI标准的shim。一头通过CRI跟kubelet交互，另一头跟docker api交互，从而间接的实现了kubernetes以docker作为容器运行时。但是这种架构缺点也很明显，**调用链更长，效率更低**。因此选用containerd作为容器runtime
- **containerd**方案: **containerd**是一个**docker**的容器**runtime**，成为**CNCF**的官方项目

官方安装教程：https://github.com/containerd/containerd/blob/main/docs/getting-started.md

```BASH
# 安装containerd.io
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum install containerd.io


# 安装CNI插件
# i.下载cni-plugins.tar 从https://github.com/containernetworking/plugins/releases
# 在线下载：
# wget https://github.com/containernetworking/plugins/releases/download/v1.1.1/cni-plugins-linux-amd64-v1.1.1.tgz
# ii.在/opt/cni/bin下解压：

# 把22上的拷贝到没有公网ip的服务器上
# scp -P22 /opt/cni/bin/cni-plugins-linux-amd64-v1.1.1.tgz root@192.168.0.203:/opt/cni/bin/

mkdir -p /opt/cni/bin
cd /opt/cni/bin
tar Cxzvf /opt/cni/bin cni-plugins-linux-amd64-v1.1.1.tgz


# 重启服务：
systemctl restart containerd
# 开机启动：
systemctl enable containerd


# 配置systemd cgroup驱动
# 修改配置文件，将 SystemdCgroup 改为 true 注意配置项是区分大小写的
containerd config default | sudo tee /etc/containerd/config.toml
vim /etc/containerd/config.toml

[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  ...
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true
# 并将 sandbox_image 地址修改为国内的地址
并且将 sandbox_image = "registry.k8s.io/pause:3.6"
修改为 sandbox_image = "registry.cn-hangzhou.aliyuncs.com/google_containers/pause:3.6"

# 启动 containerd
systemctl restart containerd

# 开机自启
systemctl enable containerd

# 启动成功后可以查看到监听的端口
netstat -nlput | grep containerd
tcp        0      0 127.0.0.1:36669         0.0.0.0:*               LISTEN      8665/containerd      off (0.00/0/0)
```


#### 2.2.7 在所有电脑上安装 kubeadm, kubelet and kubectl<font color='red'>（所有节点）</font>

```BASH
# a.	kubeadm: the command to bootstrap the cluster.
# b.	kubelet: the component that runs on all of the machines in your cluster and does things like starting pods and containers.
# c.	kubectl: the command line util to talk to your cluster.
```

1. *配置阿里云的k8s源，加速安装*

```BASH
cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
```

2. *将 SELinux 设置为 permissive 模式（相当于将其禁用）*

```BASH
setenforce 0
sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config
```

3. *安装*

```BASH
yum install -y --nogpgcheck kubelet-1.25.2 kubeadm-1.25.2 kubectl-1.25.2  
# sudo yum install -y --nogpgcheck kubelet-1.26.3 kubeadm-1.26.3 kubectl-1.26.3 
# 自启动
systemctl enable --now kubelet
```

#### 2.2.8 启动控制面节点

```BASH
kubeadm init --kubernetes-version=v1.25.2 --image-repository registry.aliyuncs.com/google_containers --pod-network-cidr=10.244.0.0/16 

#kubeadm init --kubernetes-version=v1.26.3 --image-repository registry.aliyuncs.com/google_containers --pod-network-cidr=10.244.0.0/16 
```

<font color='red'>若出现如下错误（上一次集群初始化的残留文件）</font>

```bash
# 如果出现报错  
[ERROR FileAvailable--etc-kubernetes-manifests-kube-apiserver.yaml]: /etc/kubernetes/manifests/kube-apiserver.yaml already exists
```

<font color='red'>执行如下命令后再次初始化</font>

```BASH
rm -rf /var/lib/etcd
rm -rf /etc/kubernetes/manifests/* 
```

#### 2.2.9 配置环境变量<font color='red'>(初始化后)</font>

```BASH
mkdir -p $HOME/.kube
cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
chown $(id -u):$(id -g) $HOME/.kube/config
```

#### 2.2.10 将 master 作为node（管理节点上执行）

- 检查 node 是否存在污点
  - 污点值有三种：
    - <font color='blue'>NoSchedule</font>：一定不被调度
    - <font color='blue'>PreferNoSchedule</font>：尽量不被调度【也有被调度的几率】
    - <font color='blue'>NoExecute</font>：不会调度，并且还会驱逐Node已有Pod

```BASH
kubectl describe nodes gisweb4 |grep Taints
```

- 删除污点：

```BASH
# 本次删除的污点为：node-role.kubernetes.io/control-plane-
kubectl taint nodes --all node-role.kubernetes.io/control-plane-
```

#### 2.2.11 安装 Pod 网络插件（CNI：Container Network Interface）<font color='red'>(master)</font>

你必须部署一个基于 Pod 网络插件的 容器网络接口 (CNI)，以便你的 Pod 可以相互通信。

<font color='red'>确保kubeadm初始化时，pod_cidr 为10.244.0.0</font>

- 下载 **yml** 配置文件
  - 或自己下载到本地

```BASH
curl https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml -O
```

- 编辑**kube-flannel.yml**
  - 找到如下位置，添加 **iface-regex**

```BASH
vim kube-flannel.yml
# 添加
- --iface-regex=^192.168..
```

![](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230408114839608.png)

- 构建

```BASH
kubectl apply -f kube-flannel.yml
```

#### 2.2.12 node 节点加入集群

- 管理节点获取加入命令：

```BASH
kubeadm token create --print-join-command
# 返回如下
kubeadm join 125.220.153.23:6443 --token x0wdaj.d5wltdzdtos22fl6 --discovery-token-ca-cert-hash sha256:9245d363cdeb1757bacba21b9ccdc06a28e7490bcedfb0eeb404b56f769fa112
```

- 在 node 节点执行生成命令

如果此步报如下错误

<span style="color:red">The connection to the server localhost:8080 was refused - did you specify the right host</span>

1. <span style="color:blue">出现这个问题的原因是kubectl命令需要使用`kubernetes-admin`的身份来运行，在`kubeadm int`启动集群的步骤中就生成了`/etc/kubernetes/admin.conf`。</span>
2. <span style="color:blue">因此，解决方法如下，将主节点中的`/etc/kubernetes/admin.conf`文件拷贝到工作节点相同目录下：</span>
3. <span style="color:blue">然后分别在工作节点上配置环境变量：</span>


{% p red, 解决方案 %}

- 主节点执行

```BASH
# 将主节点中的【/etc/kubernetes/admin.conf】文件拷贝到工作节点相同目录下：
scp -P22 /etc/kubernetes/admin.conf oge@125.220.153.22:/etc/kubernetes/
```

- `node` 节点执行如下命令后，再次执行加入集群的命令

```BASH
echo "export KUBECONFIG=/etc/kubernetes/admin.conf" >> ~/.bash_profile
source ~/.bash_profile
```

- 如果是重新加入集群，需要 `reset` 一下

```BASH
kubeadm reset
```



#### 2.2.13 添加新的 master 节点

- 管理节点：

```BASH
# 管理节点查看
kubeadm token create --print-join-command
# 生成如下
kubeadm join 125.220.153.23:6443 --token mc56rw.t9b3d1ql53yhom9y --discovery-token-ca-cert-hash sha256:753ccf865a9c590413043d469a9848300871afaef7221e3fdb97d981939a2b83

# 管理节点
kubeadm init phase upload-certs --upload-certs 
# 输出
I0413 11:00:30.817038   10009 version.go:256] remote version is much newer: v1.27.0; falling back to: stable-1.25
[upload-certs] Storing the certificates in Secret "kubeadm-certs" in the "kube-system" Namespace
[upload-certs] Using certificate key:
70d43cde7f6423b5c3e88c0fa9d08511cefbc53992dc63a13544cd548a912941

# 管理节点，在networking前添加：controlPlaneEndpoint: 125.220.153.23:6443
kubectl -n kube-system edit cm kubeadm-config
```

- 新的master节点

```BASH
# 新节点
# 重新加入的话，检查是否需要kill掉6443端口（这是之前的api-service服务）
kubeadm join 125.220.153.23:6443 --token mc56rw.t9b3d1ql53yhom9y --discovery-token-ca-cert-hash sha256:753ccf865a9c590413043d469a9848300871afaef7221e3fdb97d981939a2b83 --control-plane --certificate-key 70d43cde7f6423b5c3e88c0fa9d08511cefbc53992dc63a13544cd548a912941

# 生成
This node has joined the cluster and a new control plane instance was created:

* Certificate signing request was sent to apiserver and approval was received.
* The Kubelet was informed of the new secure connection details.
* Control plane label and taint were applied to the new node.
* The Kubernetes control plane instances scaled up.
* A new etcd member was added to the local/stacked etcd cluster.

To start administering your cluster from this node, you need to run the following as a regular user:

        mkdir -p $HOME/.kube
        sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
        sudo chown $(id -u):$(id -g) $HOME/.kube/config

Run 'kubectl get nodes' to see this node join the cluster.
```



## 3 K8S 管理平台 dashboard 环境部署<font color='red'>（管理节点）</font>

- 下载 **yaml** 配置文件并应用
  - 或下载到本地然后上传

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.6.1/aio/deploy/recommended.yaml
```

- 修改配置文件(以node)
  - 但是这个只能内部访问，所以要外部访问，要么部署 ingress，要么就是设置 service NodePort 类型。这里选择 service 暴露端口。

```BASH
kubectl edit svc kubernetes-dashboard -n kubernetes-dashboard

# 将其中的，type: ClusterIP 修改成type: NodePort，保存退出即可。

# 查看服务的暴露端口，需在安全组放行
kubectl get svc -A |grep kubernetes-dashboard

```

![image-20230415154841715](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230415154841715.png)

- 权限认证

```BASH
# 创建访问用户
kubectl apply -f https://kuboard.cn/install-script/k8s-dashboard/auth.yaml
# 获取访问令牌
kubectl -n kubernetes-dashboard create token admin-user 
# 生成的令牌
eyJhbGciOiJSUzI1NiIsImtpZCI6IkdVQTZzb3JEM1FHdkpxVDNsSEwtVEZWc2hyR08tbmFFWnFGX2Q2OGt5cEkifQ.eyJhdWQiOlsiaHR0cHM6Ly9rdWJlcm5ldGVzLmRlZmF1bHQuc3ZjLmNsdXN0ZXIubG9jYWwiXSwiZXhwIjoxNjgzNzM1MTQ1LCJpYXQiOjE2ODM3MzE1NDUsImlzcyI6Imh0dHBzOi8va3ViZXJuZXRlcy5kZWZhdWx0LnN2Yy5jbHVzdGVyLmxvY2FsIiwia3ViZXJuZXRlcy5pbyI6eyJuYW1lc3BhY2UiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsInNlcnZpY2VhY2NvdW50Ijp7Im5hbWUiOiJhZG1pbi11c2VyIiwidWlkIjoiMzBlMWQzNDEtNDc0Yi00M2MyLWIyNzYtZGIxZTU4NzM5ZTgxIn19LCJuYmYiOjE2ODM3MzE1NDUsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDprdWJlcm5ldGVzLWRhc2hib2FyZDphZG1pbi11c2VyIn0.mg1IU29tBpH23nglJVbRmVa2A26WZjXxMCzckQyb-dnviLBRzBuvNebb8H4YH5CNJUPkB2GGC_r7dlm5zEbPpK8RqkbwXy-wqkOoMephs83gIQkJ3RgskpWqTgqqg87e6WXHRtuzYsQQZ4Rq3Y4uQy9jJS9o1lIoRTujpmpWORb9vu4JN0RqEfK2chQqNsYCe_TCtvtvkP2EyuU3QSeYdvWh5NNZ9CYwA8l8eqA6ijrmTqZjnI6Q9Ymo7trKSuGFmffotBpN9dTYZoyv6Io_VgEz6_1oHsA0pwG-3wc41Ly11sDAzwjZvoGN1yfw0vsVcwnAjH4LkRG2ImwYIcZbig
```

- 访问方式（每个节点 ip 均可访问）：https://125.220.153.23:30151



## 4 安装K8S的包管理工具Helm <font color='red'>（管理节点）</font>
<span style="color:red">参考</span>：https://helm.sh/docs/intro/install/ 


- 这里以下载压缩包安装为例：

<span style="color:red">参考</span>：https://www.cnblogs.com/zhanglianghhh/p/14165995.html
<span style="color:red">github地址</span>：https://github.com/helm/helm



![image-20230413112634363](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230413112634363.png)

```BASH
cd  ~/k8s/helm
wget https://get.helm.sh/helm-v3.11.3-linux-amd64.tar.gz
tar zxfv helm-v3.11.3-linux-amd64.tar.gz
mv ./linux-amd64/helm /usr/bin/
# 显示版本，安装完成
helm version
```

## 5 安装K8S的包管理工具 krew`（管理节点）`
<span style="color:red">参考</span>：https://krew.sigs.k8s.io/docs/user-guide/setup/install/  


- 确保 git 已经安装

```BASH
git version
# 若未安装
yum -y install git
```

- 安装krew

```BASH
(
  set -x; cd "$(mktemp -d)" &&
  OS="$(uname | tr '[:upper:]' '[:lower:]')" &&
  ARCH="$(uname -m | sed -e 's/x86_64/amd64/' -e 's/\(arm\)\(64\)\?.*/\1\2/' -e 's/aarch64$/arm64/')" &&
  KREW="krew-${OS}_${ARCH}" &&
  curl -fsSLO "https://github.com/kubernetes-sigs/krew/releases/latest/download/${KREW}.tar.gz" &&
  tar zxvf "${KREW}.tar.gz" &&
  ./"${KREW}" install krew
)
```

- 添加 `$HOME/.krew/bin`目录到您的 PATH 环境变量。  更新你的 `.bashrc`或者 `.zshrc`文件

```BASH
# 永久写的用户的环境变量文件，避免登出后失效
export PATH="${KREW_ROOT:-$HOME/.krew}/bin:$PATH"
source ~/.bashrc
```

- 若安装失败，采用压缩包安装

```BASH
wget https://github.com/kubernetes-sigs/krew/releases/latest/download/krew-linux_amd64.tar.gz

tar -zxvf krew-linux_amd64.tar.gz
# 添加$HOME/.krew/bin目录到PATH环境变量
export PATH="${KREW_ROOT:-$HOME/.krew}/bin:$PATH"
# 配置为 kubectl 插件
mv ./krew-linux_amd64 ./kubectl-krew
mv ./kubectl-krew /usr/local/bin/
# 测试
kubectl krew version
```

- 检查是否安装成功

```BASH
kubectl krew
kubectl plugin list
```



## 6 为 K8S 创建 PV 持久卷

### 6.1 PV和PVC

- <font color='red'>持久卷(PersistentVolume，PV)</font>是集群中由管理员配置的一段网络存储。它是集群中的资源，就像节点是集群资源一样。PV持久卷和普通的Volume一样，也是使用卷插件来实现的，只是它们拥有独立于任何使用PV的Pod的生命周期。此API对象捕获存储实现的详细信息，包括NFS，iSCSI或特定于云提供程序的存储系统。

- <font color='red'>持久卷申领(PersistentVolumeClaim，PVC)</font>表达的是用户对存储的请求。概念上与Pod类似。Pod会耗用节点资源，而PVC申领会耗用PV资源。

### 6.2 用 storageClass 动态创建 PV 

- <font color='green'>对1PB的大量目录创建NFS服务，gisweb1-4，以gisweb4为例子</font>

```bash
安装NFS: 
yum -y install nfs-utils rpcbind
```

- <font color='green'>设置持久卷权限</font>

```BASH
# 执行权限
chown -R nobody:nfsnobody /mnt/storage/k8s/pv
#chmod -R 777 /mnt/storage/k8s/pv
```

- 配置 nfs

```BASH
vim /etc/exports
# 添加：
/mnt/storage/k8s/pv 192.168.0.0/24(rw,sync,no_root_squash)
# 以上设置让所有的 IP 都有效
```

```BASH
systemctl start rpcbind
systemctl enable rpcbind
systemctl enable nfs
systemctl start nfs
systemctl start nfs-server
systemctl enable nfs-server

systemctl start firewalld
firewall-cmd --permanent --add-service=nfs
firewall-cmd  --reload
systemctl stop firewalld && sudo systemctl disable firewalld
```

- 检查

```BASH
exportfs -rv
showmount -e 127.0.0.1
```

- <font color='red'>所有节点安装nfs客户端</font>

```BASH
yum install -y nfs-utils
# 每个节点挂载nfs客户端的存储目录，本次nfs客户端在gisweb4（192.168.0.204）上
mount -t nfs 192.168.0.204:/mnt/storage/k8s/pv /mnt/storage/k8s/pv 
# 检查挂载情况
df -h
```

- 安装nfs-client-provisioner (需要翻墙)

参考：[**https://github.com/kubernetes-sigs/nfs-subdir-external-provisioner**](https://github.com/kubernetes-sigs/nfs-subdir-external-provisioner)

```bash
# 更新helm repo
helm repo update
# 搜索helm库中nfs版本
helm search repo nfs-subdir-external-provisioner

# 添加 helm 仓库
helm repo add nfs-subdir-external-provisioner https://kubernetes-sigs.github.io/nfs-subdir-external-provisioner/

helm install nfs-subdir-external-provisioner nfs-subdir-external-provisioner/nfs-subdir-external-provisioner \
--set nfs.server=192.168.0.204 \
--set nfs.path=/mnt/storage/k8s/pv	 \
--set image.repository=registry.cn-hangzhou.aliyuncs.com/xzjs/nfs-subdir-external-provisioner \
--set image.tag=v4.0.0
```

- <font color='red'>手动安装 nfs-client-provisioner</font>

参考：http://www.mydlq.club/article/109/#%E5%88%9B%E5%BB%BA-nfs-subdir-external-provisioner-%E9%83%A8%E7%BD%B2%E6%96%87%E4%BB%B6

- 成功后，安装时添加持久化参数，其中 nfs-storage 为安装的 storageclass 的 provisioner 字段名字

## 7 安装 kubeAPPS 可视化软件管理工具

参考：[**https://kubeapps.dev/docs/latest/tutorials/getting-started/**](https://kubeapps.dev/docs/latest/tutorials/getting-started/)

- 安装

```BASH
# 添加 kubeapps 仓库
helm repo add bitnami https://charts.bitnami.com/bitnami
# 创建 kubeapps 的命名空间
kubectl create namespace kubeapps
# 安装
helm install kubeapps --namespace kubeapps bitnami/kubeapps
```

- 创建证书

```bash
# 创建用于访问 Kubeapps 和 Kubernetes 的演示凭证
kubectl create --namespace default serviceaccount kubeapps-operator
kubectl create clusterrolebinding kubeapps-operator --clusterrole=cluster-admin --serviceaccount=default:kubeapps-operator


cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: kubeapps-operator-token
  namespace: default
  annotations:
    kubernetes.io/service-account.name: kubeapps-operator
type: kubernetes.io/service-account-token
EOF
```

- 查看令牌 token

```BASH
kubectl get --namespace default secret kubeapps-operator-token -o go-template='{{.data.token | base64decode}}'
```

```bash
eyJhbGciOiJSUzI1NiIsImtpZCI6IkdVQTZzb3JEM1FHdkpxVDNsSEwtVEZWc2hyR08tbmFFWnFGX2Q2OGt5cEkifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJkZWZhdWx0Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZWNyZXQubmFtZSI6Imt1YmVhcHBzLW9wZXJhdG9yLXRva2VuIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6Imt1YmVhcHBzLW9wZXJhdG9yIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQudWlkIjoiNTNjY2M0N2YtZWFmMS00NDY4LWJkN2ItYTVhMzliMzJjMzExIiwic3ViIjoic3lzdGVtOnNlcnZpY2VhY2NvdW50OmRlZmF1bHQ6a3ViZWFwcHMtb3BlcmF0b3IifQ.qsTBQODZLD1EUP5WjF_ju0-_ZFoJa2pEGCGf2zoLK71TjZeytD0GUGp4Z5ACNFuJMtedtx8tRgWhioU2oimxGdCIL4f7Szt0dOQgXD15HmoiUjYEcDQNsfTdcmfZw-m3-zwtTqa3kTTG3Wio0wf_f_ayw8qZCDL2i3PK-7h0QeAb1rQhtCz_e8huNrcshjixGlyw8aKUvdi2hPe6yvpxKJqQeOalNhT22b-ax28oIyqmC-NXYUMyRbEsgOjyuJAv6XdjqsQKbOGMKsTtNyf7CvnHl88hfRZpF0W-GuKj1ggKGYClTHuXnsv9QP-AQN1UaEtcAbUp08bHN9isedJL6w
```

- 修改服务模式，将其改为 NodePort

```bash
# 因为是测试环境，因此直接采用 NodePort 方式暴露服务端口
kubectl edit svc kubeapps -n kubeapps
```

- 找到端口，在安全组放行

```BASH
kubectl get svc -A |grep kubeapps
```

- <font color='red'>访问</font>：http://125.220.153.23:31885/

## 8 在 K8S 上部署虚拟机服务 Kubevirt

- 设置 **K8S** **ApiServer** 允许特权容器

```BASH
vim /etc/kubernetes/manifests/kube-apiserver.yaml
# 设置 
--allow-privileged=true
```

- 检查每个节点是否支持虚拟化

```BASH
virt-host-validate qemu
# 如果显示没有这个命令，先安装 libvrt 和 qemu 软件包：
yum install -y qemu-kvm libvirt virt-install bridge-utils
```

- 若有**warnning**，需要解决

![image-20230408181653957](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230408181653957.png)

```BASH
# 1
vim /etc/default/grub
# 2.添加
GRUB_CMDLINE_LINUX="crashkernel=auto rd.lvm.lv=centos/root rd.lvm.lv=centos/swap rhgb quiet intel_iommu=on"
# 3 
grub2-mkconfig -o /boot/grub2/grub.cfg
# 4 
reboot
```

- 安装 **Kubevirt**

```BASH
# K8S 1.25版本，Kubervirt必须0.57.2以上，才能适配
kubectl apply -f https://github.com/kubevirt/kubevirt/releases/download/v0.58.0-rc.0/kubevirt-operator.yaml

kubectl apply -f https://github.com/kubevirt/kubevirt/releases/download/v0.58.0-rc.0/kubevirt-cr.yaml
```

- 等待 **Kubevirt** 资源创建完毕

```BASH
kubectl -n kubevirt wait kv kubevirt --for condition=Available
```

- 安装 **CDI** 

<span style="color:red">参考</span>：https://kubevirt.io/labs/kubernetes/lab2.html

- 安装 **VNC**

```BASH
yum install -y tigervnc
```

- 查看 **Kubevirt** 资源

```BASH
kubectl get pods -n kubevirt
```

![image-20230408185646502](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230408185646502.png)

- 安装 **Kubevirt** 的 **cli** 管理工具

```BASH
kubectl krew install virt
kubectl virt help
```

- Kubevirt创建/删除虚拟机服务

```BASH
# 1.	创建yaml文件
Xxx
# 2.	运行一个虚拟机
kubectl apply -f test.yaml
# 3.	查看虚拟机
kubectl get vmis
# 4.	停止/删除虚拟机
kubectl delete -f vmi.yaml
# 或者
kubectl delete vmis testvmi
# 5.	开始/停止/暂停虚拟机
virtctl start/stop/pause my-vm
```

## 9 在 K8S 上部署 PostgreSQL

- 安装

  - 注意：数据库安装需要持久卷，需提前创建满足要求的**pv**，或者创建**nas**的**stroageclass**，以自动根据**mysql**的**pvc**创建**pv**。


  - 集群已经配置23服务器的`/mnt/storage/k8s/pv`为NAS,并已经配置名字为**nas-storage**的**sc**


```BASH
helm repo add bitnami https://charts.bitnami.com/bitnami
# 首先检查是否有oge这个命名空间，否则执行如下进行创建
kubectl create ns oge
# postgresql 这个名字可以自己定义，但后面每一步都要注意对应更改
helm install -n oge  bitnami/postgresql \
--set global.storageClass=nfs-client \
--set readReplicas.persistence.storageClass=nfs-client \
--set primary.persistence.storageClass=nfs-client \
--set primary.persistence.size=200Gi \
--set readReplicas.persistence.size=200Gi \
--set image.tag=14.5.0-debian-11-r6


helm install -n geoctap  bitnami/postgresql \
--set global.storageClass=nfs-client \
--set readReplicas.persistence.storageClass=nfs-client \
--set primary.persistence.storageClass=nfs-client \
--set primary.persistence.size=200Gi \
--set readReplicas.persistence.size=200Gi \
--set image.tag=14.5.0-debian-11-r6
# 指定版本，可在kubeapps里面查看
# --set image.tag=14.5.0-debian-11-r6
```

- 查看 postgresql 密码

```BASH
kubectl get secret --namespace oge postgresql -o jsonpath="{.data.postgres-password}" | base64 -d

# 密码
7jXf2gsmUX
```

- 更改服务端口

```BASH
kubectl edit svc --namespace oge postgresql
# 将 type=ClusterIP 改为 NodePort
# b8:85:84:71:64:28
echo "SUBSYSTEM==\"net\", ACTION==\"add\", DRIVERS==\"?*\", ATTR{address}==\" b8:85:84:71:64:28\", ATTR{type}==\"1\", KERNEL==\"eno*\", NAME=\"eno1\"" >> /etc/udev/rules.d/70-persistent-net.rules
```

- 缩放副本集

```BASH
kubectl get deployment 
# 发现并没有postgresql
kubectl get all -n oge
# 发现有statefulset.apps/postgresql
# 设置副本集个数为1
kubectl scale --replicas=1 statefulset.apps/postgresql -n oge
```

- 命令行进入pgsql

```bash
# 进入pgsql的pod
kubectl exec -it -n oge postgresql-0 bash 
# 用户登录
psql -U postgres 
# 输入密码
7jXf2gsmUX
```

- 在pod外面执行sql

```BASH
psql -h 125.220.153.23 -p 30865 -U postgres -W -f ./public.sql
```



## 10 在 K8S 上部署 MySQL

- 安装

  - 注意：数据库安装需要持久卷，需提前创建满足要求的`pv`，或者创建`nas`的 `stroageclass`，以自动根据postgresql的pvc创建pv。

  - 集群已经配置23服务器的`/mnt/storage/k8s/pv`为 `NAS`,并已经配置名字为 `nas-storage` 的 `sc`


```BASH
helm repo add bitnami https://charts.bitnami.com/bitnami

# 安装
helm install -n oge mysql bitnami/mysql \
--set global.storageClass=nfs-client \
--set readReplicas.persistence.storageClass=nfs-client \
--set primary.persistence.storageClass=nfs-client \
--set primary.persistence.size=200Gi \
--set readReplicas.persistence.size=200Gi
```

- 查看 MySQL 密码

```BASH
kubectl get secret --namespace oge mysql -o jsonpath="{.data.mysql-root-password}" | base64 -d

# 密码
VubCMiHvT1
```

- 更改服务端口

```BASH
kubectl edit svc --namespace oge mysql
# 将type=ClusterIP改为NodePort
# b8:85:84:71:64:28
echo "SUBSYSTEM==\"net\", ACTION==\"add\", DRIVERS==\"?*\", ATTR{address}==\" b8:85:84:71:64:28\", ATTR{type}==\"1\", KERNEL==\"eno*\", NAME=\"eno1\"" >> /etc/udev/rules.d/70-persistent-net.rules
```

2. 缩放副本集

```BASH
kubectl get deployment 
# 发现并没有mysql
kubectl get all -n oge
# 发现有statefulset.apps/mysql
kubectl scale --replicas=1 statefulset.apps/mysql -n oge
```

3. 在K8S中进入数据库

```BASH
kubectl exec -it -n oge mysql-1  bash
# 进入后登录用户
mysql -u root -p
# 输入密码
```



## 11 在K8S上部署 MongoDB 

- 安装

  - 注意：数据库安装需要持久卷，需提前创建满足要求的pv，或者创建nas的stroageclass，以自动根据postgresql的pvc创建pv。

  - 集群已经配置23服务器的`/mnt/storage/k8s/pv`为NAS,并已经配置名字为nas-storage的sc


```BASH
helm repo add bitnami https://charts.bitnami.com/bitnami

# 安装
helm install -n ydy mongodb bitnami/mongodb \
--set global.storageClass=nfs-client \
--set readReplicas.persistence.storageClass=nfs-client \
--set primary.persistence.storageClass=nfs-client \
--set primary.persistence.size=100Gi \
--set readReplicas.persistence.size=100Gi
```

- 查看 MongoDB 密码

```BASH
kubectl get secret --namespace ydy mongodb -o jsonpath="{.data.mongodb-root-password}" | base64 -d

# 密码
WUL9FPQ2V9
```

- 更改服务端口

```BASH
kubectl edit svc --namespace ydy mongodb
# 将type=ClusterIP改为NodePort
# b8:85:84:71:64:28
echo "SUBSYSTEM==\"net\", ACTION==\"add\", DRIVERS==\"?*\", ATTR{address}==\" b8:85:84:71:64:28\", ATTR{type}==\"1\", KERNEL==\"eno*\", NAME=\"eno1\"" >> /etc/udev/rules.d/70-persistent-net.rules
```

2. 缩放副本集

```BASH
kubectl get deployment 
# 发现并没有mongodb
kubectl get all -n ydy
# 发现有statefulset.apps/mongodb
kubectl scale --replicas=1 statefulset.apps/mongodb -n ydy
```

3. 在K8S中进入数据库

```BASH
kubectl exec -it -n ydy mongodb-644c657c4f-x62cn bash
```



## 12 在 K8S 上部署 Apache Spark

两个方式，第一种方式为Spark官方提出的；第二种为Google提出的，更符合K8S原生概念

1. Spark On K8S
2. spark-on-k8s-operator

![image-20230408170401365](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230408170401365.png)

<center>Spark On K8S</center>

![image-20230408170444023](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230408170444023.png)



<center>spark-on-k8s-operator</center>



### 12.1 <font color='black'>安装 spark-on-k8s-operator </font>

<span style="color:red">参考 </span>：https://blog.csdn.net/w8998036/article/details/122217230

- 安装

```BASH
helm repo add spark-operator https://googlecloudplatform.github.io/spark-on-k8s-operator 

# 注意是否存在 spark-operator 命名空间，没有则创建
kubectl create ns spark-operator

# 安装
helm install spark-operator spark-operator/spark-operator --namespace spark-operator  --set sparkJobNamespace=default  --set webhook.enable=true
```

- 创建服务账户

```bash
vim spark-application-rbac.yaml
# 内容如下
```

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: spark
  namespace: spark
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: spark
  name: spark-role
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["*"]
- apiGroups: [""]
  resources: ["services"]
  verbs: ["*"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: spark-role-binding
  namespace: spark
subjects:
- kind: ServiceAccount
  name: spark
  namespace: spark
roleRef:
  kind: Role
  name: spark-role
  apiGroup: rbac.authorization.k8s.io
```

```BASH
kubectl create clusterrolebinding root-cluster-admin-binding --clusterrole=cluster-admin --user=root
```

- 编写作业模板并提交作业

_创建一个Spark作业的YAML配置文件，并进行部署。_

1. 创建spark-pi.yaml文件

```YAML
apiVersion: "sparkoperator.k8s.io/v1beta2"
kind: SparkApplication
metadata:
  name: spark-pi
  namespace: spark
spec:
  type: Scala
  mode: cluster
  image: "registry.cn-hangzhou.aliyuncs.com/yudayu/spark:v3.1.1"  
  # 1gcr.io/spark-operator/spark:v3.1.1需要更换镜像，gcr.io目前国内无法访问。可以先对docker挂代理，pull到阿里云镜像后
  imagePullPolicy: IfNotPresent
  mainClass: org.apache.spark.examples.SparkPi
  mainApplicationFile: "local:///opt/spark/examples/jars/spark-examples_2.12-3.1.1.jar"    
  # 需要更换自己的jar包，local指该jar位于image内，可换成所有节点都能访问的web路径，或者通过指定nas挂载pv，将jar包放在nas的pv里
  sparkVersion: "3.1.1"
  restartPolicy:
    type: Never
  volumes:
    - name: "test-volume"
      hostPath:
        path: "/tmp"
        type: Directory
  driver:
    cores: 1
    coreLimit: "1200m"
    memory: "512m"
    labels:
      version: 3.1.1
    serviceAccount: spark
    volumeMounts:
      - name: "test-volume"
        mountPath: "/tmp"
  executor:
    cores: 1
    instances: 2
    memory: "512m"
    labels:
      version: 3.1.1
    volumeMounts:
      - name: "test-volume"
        mountPath: "/tmp"
```

2. 部署一个Spark计算任务

```BASH
kubectl apply -f spark-pi.yaml
```

运维

```BASH
kubectl get sparkapplications
kubectl describe sparkapplications
kubectl get svc  # 查看该任务的spark ui
```

### 12.2 <font color='black'>安装  Spark On K8S</font>

```BASH
helm repo add bitnami https://charts.bitnami.com/bitnami
# 注意是否存在 spark-operator 命名空间，没有则创建
kubectl create ns spark-on-k8s
helm install -n spark-on-k8s spark bitnami/spark \
  --set worker.coreLimit=28 
```

```BASH
./bin/spark-submit    \
    --class org.apache.spark.examples.SparkPi \
    --conf spark.kubernetes.container.image=bitnami/spark:3 \
    --master k8s://https://125.220.153.23:6443 \
    --conf spark.kubernetes.driverEnv.SPARK_MASTER_URL=spark://10.97.43.141:7077  \
--deploy-mode cluster \
  --executor-memory 20G \
  --num-executors 10 \
--conf spark.executor.instances=5 \
https:///data/spark-examples_2.12-3.3.0.jar 1000
```

```bash
kubectl run --namespace spark-on-k8s spark-oge --rm --tty -i --restart='Never' \
--image bitnami/spark:3 \
-- spark-submit --master spark://10.97.43.141:7077 \
--class org.apache.spark.examples.SparkPi \
    --deploy-mode cluster \
/data/spark-examples_2.12-3.3.0.jar 100000
```



## 13 在K8S上部署redis集群

- 待更



## 14 在K8S上部署nginx

### 14.1 创建pv

```BASH
vim nginx-pv.yaml
```

```YAML
apiVersion: v1
kind: PersistentVolume
metadata:
  name: nginx-ydy-pv
  namespace: ydy
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: manual
  hostPath:
    path: /mnt/storage/k8s/pv/ydy-nginx-pvc
```

### 14.2 创建pvc

```BASH
vim nginx-pvc.yaml
```

```YAML
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: nginx-ydy-pvc
  namespace: ydy
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: manual
```

### 14.3 安装nginx并设置静态资源挂载的pvc

将nginx中的`/app`挂载到`/mnt/storage/k8s/pv/luluancheng-nginx-pvc`下

```BASH
helm install -n ydy nginx bitnami/nginx \
--set staticSitePVC=nginx-ydy-pvc
```





## 附录：疑难问题解决：

### 1 K8S强制删除 namespace（会删除该命名空间中的所有 pod ）

```bash
#1、将该分区导出为json文件，以 oge namespace为例
kubectl get ns oge -o json > oge.json
#2、编辑该json文件，将spec内的内容全部删除，然后保存退出
```

![22f0a5cbf0424425b0d62681f79cb713](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/22f0a5cbf0424425b0d62681f79cb713.png)

![ef949b8bb503410c918894ab20bad993](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/ef949b8bb503410c918894ab20bad993.png)

```BASH
# 3、另开一个终端，启动一个proxy
kubectl proxy --port=8081
```

```BASH
# 4、执行一个curl命令，更新oge namespace
curl -k -H "Content-Type: application/json" -X PUT --data-binary @oge.json http://127.0.0.1:8081/api/v1/namespaces/oge/finalize
```



### 2 CNI网络错误

- 当迁移集群之后，拉取镜像报cni网络错误，如下：

![8d5d49703c8ac59f24fde81b3982b616](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/8d5d49703c8ac59f24fde81b3982b616.png)

- 从上面的截图中看到问题出现在给Pod分配IP上，意思是 cni0 的IP不同于``10.244.9.1/24`，下面我们使用  `ifconfig`命令查看IP信息

![79e65e4f797200ad98feac6f8b2d4254](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/79e65e4f797200ad98feac6f8b2d4254.png)

- 从上面的图中我们可以看到``flannel.1`的 **IP** 为`10.244.9.0`，然后我们又使用`cat /run/flannel/subnet.env`，该文件内容如下：  

![310efbdb614636a17aa48eaf4a8dc2c5](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/310efbdb614636a17aa48eaf4a8dc2c5.png)

- 其实现在的问题就比较明确了，我们使用的Overlay network为Flannel，也就是说Pod的IP地址段应该在Flannel的subnet下，而现在我们看到cni0的IP地址段与flannel subnet地址段不同，所以就出现了问题。  

- 解决方案
  - 方法1是将 cni0 的 IP 段修改为``10.244.9.1`
  - 方法2是将这个错误的网卡删除掉，之后会自动重建

```bash
# 下面我们删除错误的cni0，然后让它自己重建
ifconfig cni0 down
ip link delete cni0
```



### 3 28 服务器增加路由（为了让两台刀片上网）

- 28上执行

```BASH
iptables -t nat -A POSTROUTING -s 192.168.0.209/24 -o em1_2 -j MASQUERADE
iptables -t nat -A POSTROUTING -s 192.168.0.177/24 -o em1_2 -j MASQUERADE
```



### 4 异常断电等导致 etcd 心跳检测出现问题

- [Kubernetes API Server cannot be started after improper reboot](https://github.com/kubernetes/kubernetes/issues/107491)

- [K8S: etcd 集群备份灾难恢复操作手册](https://blog.51cto.com/liruilong/6060676)



### 5 OpenStack服务器网络跳转镜像

>作用: 保证OpenStack上服务器与实验室服务器可以 ping 通

- **IP**
  - `115.156.91.250`
- **网关**
  - `115.156.91.254`
- **子网掩码**
  - `255.255.255.0`





