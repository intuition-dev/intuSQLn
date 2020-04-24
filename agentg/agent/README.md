
# agentG

A good agent, lets you download a branch, or tell you what is going on in the container/box.


You can download a git branch, and find out what is going on in the box(container).


```
    npm i -g agentg

    agentg -g

```

To download a git branch you need a gitdown.yaml file in the current folder, eg:

```
BRANCH: 'master' 

REPOFolder: 'src'

LOGINName: 'cekvenich'

REPO: 'github.com/intuition-dev'
PROJECT: 'intuServices'

```


Note: If running as root (you should not) you need this prefix for install: npm i -g --unsafe-perm=true --allow-root agentg

Note2: https://1155536677.rsc.cdn77.org