import json
import socket
import statistics
import time
import requests
import os
from pathlib import Path
from datetime import datetime


uri = "http://srv.gnsmining.com:3005/api/v1/rigs"


def get_lan_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    lan_ip = s.getsockname()[0]
    s.close()
    return lan_ip

def get_wan_ip():
    import urllib.request
    with urllib.request.urlopen('http://ipinfo.io/ip') as response:
        wan_ip = response.read()
    return wan_ip.decode("utf-8").strip() # convert byte to string


def read_email_from_file():
    f = open("/mnt/user/email.txt", "r")
    email = f.read()
    f.close()
    return email.strip()
    
def stats_os_version():
    f = Path("/var/tmp/stats_os_version")
    if f.is_file():
        d = open("/var/tmp/stats_os_version")
        version = d.read()
        d.close()
        return version
    return ''

def stats_os_serial():
    f = Path("/var/tmp/stats_os_serial")
    if f.is_file():
        d = open("/var/tmp/stats_os_serial")
        serial = d.read()
        d.close()
        return serial
    return 'No Serial Found'



def init():
    register_email = ''
    os_version = ''
    host_name = socket.gethostname()
    client_email = Path("/mnt/user/email.txt") # gns_config.txt
    # while True:
    os_serial = stats_os_serial()
    if os_serial:   # if serial not found, don't update anything on online server

        # rig_id = Path("/mnt/user/email.txt") 
        if client_email.is_file():
            register_email = read_email_from_file()

        os_version_path = Path("/root/config.txt") 
        if os_version_path.is_file():
            # with open('/root/config.txt', 'r') as myfile:
            #     data = myfile.readline()
            f = open('/root/config.txt', 'r')
            while True:
                data = f.readline()
                if ('osVersion=' in data):
                    os_version = data.replace('osVersion=', '').strip()
                    break

            lan_ip = get_lan_ip()
            wan_ip = get_wan_ip()

            # print(os_version)
            # print(register_email)
            # print(lan_ip)
            # print(wan_ip)
            # print(os_serial)
            # print(host_name)

            rig = { 'rigId': os_serial, 'email': register_email, 'ip': lan_ip, 'updatedAt': datetime.now().strftime('%Y-%m-%dT%H:%M:%S'), 'osName': os_version, 'wanIp': wan_ip }
            # print(rig)
            try:
                response = requests.post(uri, json=rig)
                # if response.status_code != requests.status_codes.codes. || response.status_code != requests.status_codes.codes.update: # 200:
                #     print('error occured create', response.status_code)
                #print('Rig: {}'.format(response.json()))
                #result = response.json()
            except requests.exceptions.ConnectionError as e:
                print('Connection failed.', e)

            print('done')
    else:
        print('serial not found')
    #time.sleep(20)


if __name__ == "__main__":
    init()


