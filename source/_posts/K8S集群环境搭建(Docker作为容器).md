---
title: K8S集群环境搭建(Docker作为容器)
cover: 'https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/u%3D2075113303%2C1509195472%26fm%3D253%26fmt%3Dauto%26app%3D138%26f%3DJPG'
top_img: https://bu.dusays.com/2022/09/01/63103a65e883d.webp
abbrlink: d862c611
date: 2023-05-18 14:08:12
keywords: K8S, Docker
categories:
  - 云原生
tags:
  - K8S
  - Docker
swiper_index: 3 #置顶轮播图顺序，非负整数，数字越大越靠前
---

本文参考：https://zhuanlan.zhihu.com/p/558014199?utm_id=0

## 1.  安装Docker

### 1.1  安装docker 20.10.7

**注意 Docker 版本，要和 Kubernetes 版本 有对应关系**

- 三台机器上执行

```shell
# 安装/更新 yum-utils
yum install -y yum-utils

# 配置 yum源
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 安装 docker 20.10.7 版本
yum -y install docker-ce-20.10.7 docker-ce-cli-20.10.7 containerd.io

# 查看 docker 版本
docker -v

# 启动 docker
systemctl start docker

# 设置开机自启
systemctl enable docker

# 查看 docker 是否成功, 有 Client 和 Server 即成功
docker version
```

### 1.2  配置加速镜像

- 三台机器上执行

```shell
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://82m9ar63.mirror.aliyuncs.com"],
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2"
}
EOF
# 重启docker的后台线程
sudo systemctl daemon-reload
# 重启docker服务
sudo systemctl restart docker

# 查看是否配置成功
docker info
```



## 2.  安装Kubernetes

- 每台机器2GB或者更多的RAM(如果少于这个数字 将会影响应用的运行内存)
- CPU2核以上
- 集群中所有的服务器的网络彼此可以相互连接。



关闭防火墙

````shell
systemctl stop firewalld NetworkManager
systemctl disable firewalld NetworkManager
````



### 2.1  设置hostname

```shell
# 查看主机名
hostname

# 设置主机名
hostnamectl set-hostname k8s-master
hostnamectl set-hostname k8s-node1
hostnamectl set-hostname k8s-node2

# 更新
bash
```



### 2.2  关闭交换区

- 三台机器上执行
- 下面是一些安全设置

```shell
# 查看 交换分区
free -m

# 将 SELinux 设置为 permissive 模式（相当于将其禁用）  第一行是临时禁用，第二行是永久禁用
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



### 2.3  安装K8S三大件

安装 kubelet、kebeadm、kubectl；注意版本 (1.20.9)

- 三台机器上执行

```shell
# 配置 k8s 的 yum 源地址
cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=http://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=0
repo_gpgcheck=0
gpgkey=http://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg
   http://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
```

```shell
# 安装 kubelet、kubeadm、kubectl
yum install -y kubelet-1.20.9 kubeadm-1.20.9 kubectl-1.20.9 --disableexcludes=kubernetes

# 启动kubelet
systemctl enable --now kubelet

# 查看 kubelet 状态：一会停止 一会运行。 这个状态是对的，kubelet 等待 kubeadm 发号指令。
systemctl status kubelet

```



### 2.4   使用kubeadm引导集群

- 下载各个机器需要的镜像,三台机器都要安装

```shell
# 配置镜像，生成 images.sh
sudo tee ./images.sh <<-'EOF'
#!/bin/bash
images=(
kube-apiserver:v1.20.9
kube-proxy:v1.20.9
kube-controller-manager:v1.20.9
kube-scheduler:v1.20.9
coredns:1.7.0
etcd:3.4.13-0
pause:3.2
)
for imageName in ${images[@]} ; do
docker pull registry.cn-hangzhou.aliyuncs.com/lfy_k8s_images/$imageName
done
EOF

# 拉取镜像
chmod +x ./images.sh && ./images.sh
```

- 使用`docker images` 查看

![image-20230406144630834](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230406144630834.png)



### 2.5  初始化主节点，即把看 k8s-master 变为主节点

- 三台机器上执行

```shell
# 所有机器添加 master 域名映射，以下 IP 为 master 的 IP；
# 访问 k8s-master 即 访问 192.168.1.135
echo "192.168.1.135  k8s-master" >> /etc/hosts
```

- master节点上执行

```shell
# 主节点初始化 （只在 master 服务器执行， 其他 node 不用）
# --apiserver-advertise-address: master 的 IP
# --control-plane-endpoint: master 的域名
# --service-cidr 和 --pod-network-cidr 是网络范围，雷神 建议不要改。要改的话 2 个cidr 和 vps（192.168.x.x） 的，3 个网络互相不能重叠；还要修改 calico.yaml的 IP（下图有写）。
kubeadm init \
--apiserver-advertise-address=192.168.1.135 \
--control-plane-endpoint=k8s-master \
--image-repository registry.cn-hangzhou.aliyuncs.com/lfy_k8s_images \
--kubernetes-version v1.20.9 \
--service-cidr=10.96.0.0/16 \
--pod-network-cidr=192.168.0.0/16
```

- 出现这个即成功了

![image-20230406145652752](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230406145652752.png)



### 2.5  根据提示继续

- master成功后提示

```shell
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

Alternatively, if you are the root user, you can run:

  export KUBECONFIG=/etc/kubernetes/admin.conf

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

You can now join any number of control-plane nodes by copying certificate authorities
and service account keys on each node and then running the following as root:

  kubeadm join k8s-master:6443 --token is7ewi.nznlk1wdhsaocmp1 \
    --discovery-token-ca-cert-hash sha256:b2795fca75bab316c566e98a619a3ce9b18c418e978c7b8fa9c48ff4143fd3c5 \
    --control-plane

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join k8s-master:6443 --token is7ewi.nznlk1wdhsaocmp1 \
    --discovery-token-ca-cert-hash sha256:b2795fca75bab316c566e98a619a3ce9b18c418e978c7b8fa9c48ff4143fd3c5
```



To start using your cluster, you need to run the following as a regular user:

要开始使用集群，您需要以普通用户身份运行以下命令(<font color='red'>master节点执行</font>）：源自上面的提示

```shell
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```



### 2.6  安装网络组件（calico）

<font color='red'>注：只在 master 服务执行。其他 node 服务器 不用。</font>

- 在master上执行

```shell
# 下载 calico.yaml
curl https://docs.projectcalico.org/manifests/calico.yaml -O

# 加载配置
kubectl apply -f calico.yaml
```

- 或者（这个更不会出错）

```shell
kubectl apply -f https://docs.projectcalico.org/v3.18/manifests/calico.yaml
```

- 下载完成后生成calico.yaml

![image-20230406150214816](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230406150214816.png)


- 或者安装flannel

```shell
kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml
```



<font color='red'>注意</font>
```shell
如果修改了 初始化主节点中的
--pod-network-cidr=192.168.0.0/16
将 calico.yaml 的配置， # 去掉，IP 写 改的 IP。
```



### 2.7  **Worker 加入集群**

- worker节点加入到集群中（源自提示）

```shell
kubeadm join k8s-master:6443 --token is7ewi.nznlk1wdhsaocmp1 \
    --discovery-token-ca-cert-hash sha256:b2795fca75bab316c566e98a619a3ce9b18c418e978c7b8fa9c48ff4143fd3c5
```

- 出现这个即成功

![image-20230406153948047](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230406153948047.png)



### 2.8  每次重启需要先启动docker，否则k8s无法启动



### 2.9  令牌过期

- 在master主节点执行

```shell
# 重新获取令牌
kubeadm token create --print-join-command
```



### 2.10  部署Dashboard

- 参考链接: [kubernetes(k8s)部署Dashboard - 干货分享 - 代码森林 (codeforest.cn)](http://www.codeforest.cn/article/570)


#### 2.10.1  运行pod（创建资源）

部署 dashboard（可视化页面）, [kubernetes 官方提供的可视化界面](https://github.com/kubernetes/dashboard)

- 在master上执行，推荐下载到本地导入虚拟机

```shell
# 根据 在线配置文件 创建资源
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.3.1/aio/deploy/recommended.yaml
```

```shell
# 本地配置
kubectl apply -f recommended.yaml
```

#### 2.10.2  设置访问端口

```shell
# 修改配置文件 找到 type，将 ClusterIP 改成 NodePort
kubectl edit svc kubernetes-dashboard -n kubernetes-dashboard

# 找到端口，在安全组放行
kubectl get svc -A |grep kubernetes-dashboard
```

![image-20230406155958282](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230406155958282.png)

![image-20230406161329065](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230406161329065.png)

32499即为访问端口，以后只需要使用任一节点的ip+32499即可访问

[https://192.168.1.135:32499](https://192.168.1.135:32499/) （要注意是 https，port 是映射的端口，在配置文件查看）

## 3 疑难杂症
### 3.1 删除现有的dashboard服务

```shell
kubectl delete service kubernetes-dashboard --namespace=kubernetes-dashboard
```

- 根据yaml来删除

```shell
kubectl delete -f recommended.yaml 
```

- 若资源下载不下来，则直接本地导入recommended.yaml  ，下载地址如下

https://raw.githubusercontent.com/kubernetes/dashboard/v2.3.1/aio/deploy/recommended.yaml

- 执行:

```shell
kubectl apply -f recommended.yaml
```


### 3.2 dashboard启动失败（无法访问）

修改了 NodePort 后，Pod kubernetes-dashboard 起不来了。（环境：虚拟机）

```shell
# 查看日志
kubectl logs -f -n kubernetes-dashboard kubernetes-dashboard-658485d5c7-f89v7
```

![image.png](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/1652075593643-5900409d-98b9-48ef-8eb8-b6160feb6b71.png)

解决思路

```shell
1、将 dashboard 部署到 master上，因为 master 刚安装了网络组件
2、让 工作节点 也能访问 apiServer
```

方案1

- 先卸载原来的 dashboard

```shell
# 无法访问，查看 部署到 哪个 node 上了， 将 dashboard 部署到 master 上
kubectl get pods -A -o wide
```

![image-20230407113313033](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230407113313033.png)

```shell
# 修改 recommended.yaml，添加下面
```

![image.png](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/1652078359412-58130528-5fe9-407b-8be2-5b4ddcbad064.png)

![image.png](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/1652078430899-c1b3f50d-354e-495c-8d02-e5e5e1353d1c.png)

```shell
# 重新安装 dashboard

# 修改配置文件 找到 type，将 ClusterIP 改成 NodePort
kubectl edit svc kubernetes-dashboard -n kubernetes-dashboard

# 找到端口，在安全组放行
kubectl get svc -A |grep kubernetes-dashboard
```



- 创建访问账号

```shell
#创建访问账号，准备一个yaml文件
vim dash-usr.yaml
```

- 文件内容如下

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kubernetes-dashboard
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: admin-user
  namespace: kubernetes-dashboard
```

```shell
kubectl apply -f dash-usr.yaml
```



- 令牌访问

```shell
#获取访问令牌
kubectl -n kubernetes-dashboard get secret $(kubectl -n kubernetes-dashboard get sa/admin-user -o jsonpath="{.secrets[0].name}") -o go-template="{{.data.token | base64decode}}"
```

![image-20230407135656881](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230407135656881.png)

```tex
eyJhbGciOiJSUzI1NiIsImtpZCI6IkZkbV91WkVqTnp3clZLd29JS1FYUWxURzZyd0FLcnpVQzBtRlRMTmpya0UifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJhZG1pbi11c2VyLXRva2VuLTVrbGtrIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6ImFkbWluLXVzZXIiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiJiNWVhYjQ2MS0xNjE1LTQ5ZTQtYTAzNC0wY2MxYWM1YTI5ODkiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6a3ViZXJuZXRlcy1kYXNoYm9hcmQ6YWRtaW4tdXNlciJ9.eum4COcUzn6wt_vOpCUUEiNENzeGUTC_ZlKeB8d0IplFlZWrAav3RbqV5LMDRRIyyZ-7csJb3COhFEiCRtlkc9MM60od4IRMscNxv_tm11A32pmGn9eFERyaYjKUFBHZfF34jPcsjYqU50TDn6wykI_B6r9ZzvpJemR-wqF2y-GBvmz8q19D9q5zlhaE9gmmvksEx-D0ZyOeZo4tMdbD757OdTjgzlYhmTpfTs-Z8-sdKWnHGFCYbAPzrEgMgChcIjlyDle9-JaE1WCosGCA73xsBzXNnkvYC7YB_tagX4BhGDZEu4eyRNbgCAqO6of6QnvDXvlesd59IU-WMVE-7Q
```

- 将令牌复制到token处

![image-20230407140527932](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230407140527932.png)

- 登录成功

![image-20230407140620636](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230407140620636.png)



























