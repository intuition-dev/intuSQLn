clear

#Add to startup
invoke-rc.d netfilter-persistent save

iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X
iptables -t mangle -F
iptables -t mangle -X

iptables -P INPUT ACCEPT
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT
# cleared


iptables -A INPUT  -p tcp --dport 22 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT
iptables -A OUTPUT -p tcp --sport 22 -m conntrack --ctstate ESTABLISHED     -j ACCEPT
iptables -I INPUT  -p tcp --dport 22 -j ACCEPT
iptables -A INPUT  -i lo -j ACCEPT
iptables -A INPUT -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
iptables -A INPUT -m conntrack --ctstate INVALID -j DROP

iptables -I INPUT -p tcp --dport 8070 -j ACCEPT
iptables -I INPUT -p tcp --dport 8443 -j ACCEPT
iptables -I INPUT -p tcp --dport 8080 -j ACCEPT
iptables -I INPUT -p tcp --dport 443  -j ACCEPT
iptables -I INPUT -p tcp --dport 80   -j ACCEPT
iptables -I INPUT -p udp -m udp --dport 53   -j ACCEPT
iptables -I INPUT -p udp -m udp --dport 9053 -j ACCEPT

iptables -A PREROUTING -t nat -p tcp --dport 80  -j REDIRECT --to-ports 8080
iptables -A PREROUTING -t nat -p tcp --dport 443 -j REDIRECT --to-ports 8443
#iptables -A PREROUTING -t nat -p udp --dport 53  -j REDIRECT --to-port 9053


#http://archive.is/7IQlb

#iptables -N SSHBRUTE
#iptables -A SSHBRUTE -m recent --name SSH --set
#iptables -A SSHBRUTE -m recent --name SSH --update --seconds 300 --hitcount 10 -m limit --limit 1/second --limit-burst 100 -j LOG --log-prefix "iptables[SSH-brute]: "
#iptables -A SSHBRUTE -m recent --name SSH --update --seconds 300 --hitcount 10 -j DROP
#iptables -A SSHBRUTE -j ACCEPT

#iptables -N ICMPFLOOD
#iptables -A ICMPFLOOD -m recent --set --name ICMP --rsource
#iptables -A ICMPFLOOD -m recent --update --seconds 1 --hitcount 6 --name ICMP --rsource --rttl -m limit --limit 1/sec --limit-burst 1 -j LOG --log-prefix "iptables[ICMP-flood]: "
#iptables -A ICMPFLOOD -m recent --update --seconds 1 --hitcount 6 --name ICMP --rsource --rttl -j DROP
#iptables -A ICMPFLOOD -j ACCEPT


#iptables -4 -A INPUT -p icmp --icmp-type 0  -m conntrack --ctstate NEW -j ACCEPT
#iptables -4 -A INPUT -p icmp --icmp-type 3  -m conntrack --ctstate NEW -j ACCEPT
#iptables -4 -A INPUT -p icmp --icmp-type 11 -m conntrack --ctstate NEW -j ACCEPT
#iptables -4 -A INPUT -p icmp --icmp-type 8  -m conntrack --ctstate NEW -j ICMPFLOOD
#iptables -6 -A INPUT -p ipv6-icmp --icmpv6-type 128 -j ICMPFLOOD


/sbin/iptables-save
netfilter-persistent save
netfilter-persistent reload

iptables -t nat -L -n -v
