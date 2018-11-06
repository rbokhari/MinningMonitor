import json
import socket
import statistics
import time
import requests
import os
#import asyncio
#import httplib

# from firebase import firebase
from datetime import datetime
from pathlib import Path
import platform

#uri = "http://46.101.227.146:3000/api/v1/rigs" #"http://sits-002:3000/api/v1/rigs"
uri = "http://myserver.gnsmining.com:3000/api/v1/rigs" #"http://sits-002:3000/api/v1/rigs"

APP_VERSION= '1.1.0'
OS_VERSION=''

# firebase = firebase.FirebaseApplication('https://genesuspool.firebaseio.com/')
miner_ip = '127.0.0.1'
miner_port = 3333
host_name = socket.gethostname()
#print(host_name)
#host_ip = socket.gethostbyname(host_name)
wan_ip = ''
cards = 0
gpus = ''
temp = 0
fan = 0
miner_uptime = 0,
total_shares = 0
invalid_shares = 0
hashrate = 0
hd_serial = ''
gpu_model = ''
config_email = 'test@gmail.com'

print(APP_VERSION)

def get_data():
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_address = (miner_ip, miner_port)
        try:
            sock.connect(server_address)
        except Exception as e:
            #print('Miner socket ' + str(miner_ip) + ':' + str(miner_port) + ' is closed')
            print('Miner is closed, retrying !!!')
            return []
        request = '{\"id\":0,\"jsonrpc\":\"2.0\",\"method\":\"miner_getstat1\",\"psw\":\"''\"}'
        request = request.encode()
        try:
            sock.sendall(request)
        except Exception as e:
            print('Sending data was aborted')
            return []
        try:
            data = sock.recv(512)
        except Exception as e:
            print('Recieveing data was aborted')
            return []
        data = json.loads(data.decode('utf-8'))
        sock.close()
        return data

def avg_hashrate_1min():
    hashrates = []
    
    for i in range(0, 2):
        data = get_data()
        # print('*')
        try:
            hashrate = data['result'][2].split(';')[0]
        except Exception as e:
            print('Data is empty or invalid')
            time.sleep(10)
            continue
        hashrates.append(float(hashrate))
        time.sleep(2)
        i += 1
    try:
        mean = statistics.mean(hashrates)
        return mean
    except Exception as e:
        return 0

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
    return wan_ip.decode("utf-8") # convert byte to string

# def track_external_ip():
#     """
#         Returns Dict with the following keys:
#         - ip
#         - latlong
#         - country
#         - city
#         - user-agent
#     """
#     conn = httplib.HTTPConnection("www.trackip.net")
#     conn.request("GET", "/ip?json")
#     resp = conn.getresponse()
#     if resp.status == 200:
#         ip = json.loads(resp.read())
#     else:
#         print('Connection Error: %s' %resp.reason)

#     conn.close()
#     return ip["ip"]

def get_ip_address():
    # from urllib import urlopen
    import urllib.request
    with urllib.request.urlopen('https://ipinfo.io/ip') as response:
        ip = response.read()
        # print(type(ip))
    # url = 'http://api.hostip.info/get_json.php'
    #info = json.loads(urlopen(url).read())
    # print(info['ip'])
    # url = 'https://ipinfo.io/ip'
    # info = urlopen(url)
    # print(info)

def init():
    #condition = True
    wan_ip = get_wan_ip()
    hd_serial = stats_os_serial()
    gpu_model = stats_gpu_model()

    #while True:
    data = get_data()
    #{"result": ["7.3", "19", "16212;7;0", "16212", "0;0;0", "0", "74;30", "us1.ethermine.org:4444", "0;0;0;7"]}
    #u'result': [u'10.6 - ETH', u'76', u'25940;31;0', u'25940', u'0;0;0', u'off', u'45;80', u'eu1.ethermine.org:4444', u'0;0;0;0']}
    #{'id': 0, 'result': ['11.9 - ETH', '4332', '54611;3461;1', '26238;28373', '0;0;0', 'off;off', '39;80;44;80', 'eu1.ethermine.org:4444', '0;0;0;0'], 'error': None}
    OS_VERSION = stats_os_version()
    cards = stats_count() # len(temps)
    cores = stats_core()
    memory = stats_memory()
    temps = stats_temp() #  all[::2]
    fans = stats_fan() # all[1::2]

    miner_uptime = 0,
    total_shares = 0
    invalid_shares = 0
    hashrate = 0

    # hd_serial = stats_os_serial()
    # gpu_model = stats_gpu_model()

    isMinerRunning = (len(data) > 0)
    if (isMinerRunning):
        #all = data['result'][6].split(';')
        gpus = data['result'][3].split(';')
        total_shares = int(data['result'][2].split(';')[1])
        invalid_shares = int(data['result'][8].split(';')[0])
        miner_uptime = data['result'][1]
        
        #temp = ';'.join(temps) #str(temps)
        #fan = ';'.join(fans) #str(fans)

        # print('-----------------START------------------')
        #print('Number of active cards: ' + str(cards))
        # print('GPU temp: ' + str(temp))
        #print('GPU s : ' + gpus)
        # print('Fan speed (%): ' + str(fan))
        # print('Miner uptime is ' + miner_uptime + ' min')
        # print('Total Shares : ' + str(total_shares) + '')
        # print('Invalid Shares : ' + str(invalid_shares) + '')
        # print('Calculating Hashrate ...')
        
        hashrates = []
        i = 0
        #logger.info('Previous hashrate is %s ' % "{:,.2f}".format(previous_hashrate / 1000) + ' Mh/s')
        #logger.info('Started calculating hashrate...')
        for i in range(0, 5):
            hashrates.append(float(avg_hashrate_1min()))
            time.sleep(2)
            i += 1

        current_hashrate = statistics.mean(hashrates)
        hashrate = current_hashrate / 1000

        # print('Current Hashrate ' + str(hashrates[4] / 1000) + ' Mh/s')
        # print('Average Hashrate ' + str(hashrate) + ' Mh/s')
        # print('-----------------END--------------------')

    lan_ip = get_lan_ip()
    #id_file = Path("id.txt")
    action_file = Path("mmos_action.txt")
    action_perform = 0
    client_email = Path("/mnt/user/email.txt") # gns_config.txt
    if client_email.is_file():
        register_email = read_email_from_file()

    # if id_file.is_file():
    #id = read_id_from_file()
    #ping_from_rig(id)
    #result = firebase.put('rigs', id, { 'email': 'py11@gmail.com', 'ip': host_ip, 'worker': host_name, 'ping_time': datetime.now(), 'cards': cards, 'temp': str(temp), 'fan': str(fan), 't_shares': total_shares, 'i_shares': invalid_shares, 'gpu': hashrate, 'gpus': gpus })
    #print('Rig ping at {}'.format(datetime.now()))
    #rig = { 'email': 'py11@gmail.com', 'ip': host_ip, 'osName': 'osname', 'kernel': 'keeeeerrr', 'worker': host_name, 'cards': cards, 'temps': temps, 'fans': fans, 't_shares': total_shares, 'i_shares': invalid_shares, 'gpu': gpus, 'totalHashrate': hashrate }
    if action_file.is_file():
        action_file = open("mmos_action.txt")
        action_perform = action_file.read()
        action_file.close()
        os.remove("mmos_action.txt")
        time.sleep(5)

    # if isMinerRunning:
    #     rig = { 'wanIp': wan_ip, 'gpuModel': gpu_model, 'rigId': hd_serial, 'performAction': action_perform, 'rigUpTime': miner_uptime, 'email': register_email, 'ip': lan_ip, 'serverTime': datetime.now().strftime('%Y-%m-%dT%H:%M:%S'), 'osName': OS_VERSION, 'appVersion': APP_VERSION, 'kernel': 'keeeeerrr', 'worker': lan_ip, 'cards': cards, 'temps': temps, 'fans': fans, 'cores': cores, 'memory': memory, 't_shares': total_shares, 'i_shares': invalid_shares, 'gpu': gpus, 'totalHashrate': hashrate }
    # else:
    #     rig = { 'wanIp': wan_ip, 'gpuModel': gpu_model, 'rigId': hd_serial, 'performAction': action_perform, 'rigUpTime': 0, 'email': register_email, 'ip': lan_ip, 'serverTime': datetime.now().strftime('%Y-%m-%dT%H:%M:%S'), 'osName': OS_VERSION, 'appVersion': APP_VERSION, 'kernel': 'keeeeerrr', 'worker': lan_ip, 'cards': 0, 'temps': temps, 'fans': fans, 'cores': cores, 'memory': memory, 't_shares': 0, 'i_shares': 0, 'gpu': 0, 'totalHashrate': 0 }

    #if isMinerRunning:
    rig = { 'gpuModel': gpu_model, 'rigId': hd_serial, 'performAction': action_perform, 'rigUpTime': miner_uptime, 'appVersion': APP_VERSION, 'cards': cards, 'temps': temps, 'fans': fans, 'cores': cores, 'memory': memory, 't_shares': total_shares, 'i_shares': invalid_shares, 'gpu': gpus, 'totalHashrate': hashrate }
    #else:
    #    rig = { 'gpuModel': gpu_model, 'rigId': hd_serial, 'performAction': action_perform, 'rigUpTime': 0, 'appVersion': APP_VERSION, 'cards': 0, 'temps': temps, 'fans': fans, 'cores': cores, 'memory': memory, 't_shares': 0, 'i_shares': 0, 'gpu': 0, 'totalHashrate': 0 }
    
    try:
        # print(uri)
        #print(id)
        # print(rig)
        response = requests.put(uri + '/' + hd_serial, json=rig)
        if response.status_code != requests.codes.ok: # 201:
            print('error occured update', response.status_code)
        #if response.status_code == requests.codes.ok: # 201:
            #print('Updated Rig. ID: {}'.format(response.json()))
        
        result = response.json()
        comp_name = result['rigReturn']['computer']
        #save_name_to_file(comp_name)
        actions = result['rigReturn']['action']
        if len(actions) > 0:
            execute_actions(actions)
            time.sleep(15) 

        group = result['rigReturn']['group']
        if (len(group)):
            # configuration = str(group['configuration']).replace('$MinerName', comp_name) 
            configuration = str(group).replace('$MinerName', comp_name) 
            save_group_config_to_file(configuration)
            
    except requests.exceptions.ConnectionError as e:
        print('Connection failed.')
        #raise ApiError('POST /tasks/ {}'.format(result.status_code))

    # else:
    #     #result = register_rig()
    #     rig = { 'rigUpTime': miner_uptime, 'email': register_email, 'ip': lan_ip, 'serverTime': datetime.now().strftime('%Y-%m-%dT%H:%M:%S'), 'osName': OS_VERSION, 'appVersion': APP_VERSION, 'kernel': 'keeeeerrr', 'worker': host_name, 'cards': cards, 'temps': temps, 'fans': fans,'cores': cores, 'memory': memory, 't_shares': total_shares, 'i_shares': invalid_shares, 'gpu': gpus, 'totalHashrate': hashrate }
    #     try:
    #         response = requests.post(uri, json=rig)
    #         if response.status_code != requests.codes.created: # 200:
    #             print('error occured create', response.status_code)
    #         print('Created Rig. ID: {}'.format(response.json()))
    #         result = response.json()
    #         #save_id_to_file(result['data']["_id"])
    #     except requests.exceptions.ConnectionError as e:
    #         print('Connection failed.')
            #raise ApiError('POST /tasks/ {}'.format(result.status_code))
        #result = firebase.post('rigs', { 'email': 'py11@gmail.com', 'ip': host_ip, 'worker': host_name, 'ping_time': datetime.now(), 'cards': cards, 'temp': temp, 'fan': fan, 't_shares': total_shares, 'i_shares': invalid_shares, 'gpu': hashrate })
        #print('Rig registered at {}'.format(datetime.now()))

        #time.sleep(15)
        #condition = False

# online registering
# def register_rig():
#     #{'fans': [1, 2, 3], 'computer': 'comp', 'invalid': 777, 'totalHash': 12300, 'single': 123, 'kernel': 'kernel11', 'status': 1, 'ip': '192.168.1.1', 'temps': [2, 3, 54], 'osName': 'windows', 'shares': 1111}
#     rig = { 'email': 'py11@gmail.com', 'ip': host_ip, 'worker': host_name, 'cards': cards, 'temp': temp, 'fan': fan, 't_shares': total_shares, 'i_shares': invalid_shares, 'gpu': hashrate }
#     print('-------------rig-------------')
#     print(rig)
#     response = requests.post(uri, json=rig)
#     if response.status_code != requests.codes.created: # 201:
#         print('error occured', response.status_code)
#         #raise ApiError('POST /tasks/ {}'.format(result.status_code))
#     print('Created Rig. ID: {}'.format(response.json()))
#     #result = firebase.post('rigs', { 'email': 'py11@gmail.com', 'ip': host_ip, 'worker': host_name, 'ping_time': datetime.now(), 'cards': cards, 'temp': temp, 'fan': fan, 't_shares': total_shares, 'i_shares': invalid_shares, 'gpu': hashrate })
#     print(response)
#     return response

#def ping_from_rig(id):
    #result = firebase.put('rigs', id, { 'email': 'py_update@gmail.com', 'ip': host_ip, 'worker': host_name, 'ping_time': datetime.now() })
    #return result

# def save_id_to_file(id):
#     f = open("id.txt", "w+")
#     f.write(id)
#     f.close()

# def save_name_to_file(name):
#     f = open("name.txt", "w+")
#     f.write(name)
#     f.close()

def save_group_config_to_file(config):
    p = Path("/home/miner/config.json")
    if p.is_file():
        fi = open("/home/miner/config.json", "r")
        data = fi.read()

        if data == config:
            fi.close()
            return
        else:
            fi.close()

    f = open("/home/miner/config.json", "w+")
    f.write(config)
    f.close()
    time.sleep(20)
    os.system('./miner_restart.sh')

def read_id_from_file():
    f = open("id.txt", "r")
    id = f.read()
    f.close()
    return id

def read_email_from_file():
    f = open("/mnt/user/email.txt", "r")
    email = f.read()
    f.close()
    return email

def stats_core():
    f = Path("/var/tmp/stats_gpu_core")
    if f.is_file():
        d = open("/var/tmp/stats_gpu_core")
        cores = d.read()
        d.close()
        cores = cores.strip()
        cores = cores.split("  ")
        #cores = map(int, cores)
        return cores
    return []

def stats_memory():
    f = Path("/var/tmp/stats_gpu_memory")
    if f.is_file():
        d = open("/var/tmp/stats_gpu_memory")
        memory = d.read()
        d.close()
        memory = memory.strip()
        memory = memory.split("  ")
        #memory = map(int, memory)
        return memory
    return []

def stats_fan():
    f = Path("/var/tmp/stats_gpu_fanspeed")
    if f.is_file():
        d = open("/var/tmp/stats_gpu_fanspeed")
        fans = d.read()
        d.close()
        fans = fans.strip()
        fans = fans.split(" ")
        #fans = map(int, fans)
        return fans
    return []

def stats_temp():
    f = Path("/var/tmp/stats_gpu_temp")
    if f.is_file():
        d = open("/var/tmp/stats_gpu_temp")
        temps = d.read()
        d.close()
        temps = temps.strip()
        temps = temps.split(" ")
        #temps = map(int, temps)
        return temps
    return []

def stats_count():
    f = Path("/var/tmp/stats_gpu_count")
    if f.is_file():
        d = open("/var/tmp/stats_gpu_count")
        counts = d.read()
        d.close()
        return counts
    return 0

def stats_os_version():
    f = Path("/var/tmp/stats_os_version")
    if f.is_file():
        d = open("/var/tmp/stats_os_version")
        version = d.read()
        d.close()
        return version
    return 'No Version Found'

def stats_os_serial():
    f = Path("/var/tmp/stats_os_serial")
    if f.is_file():
        d = open("/var/tmp/stats_os_serial")
        serial = d.read()
        d.close()
        return serial
    return 'No Serial Found'

def stats_gpu_model():
    f = Path("/var/tmp/stats_gpu_model")
    if f.is_file():
        d = open("/var/tmp/stats_gpu_model")
        model = d.read()
        d.close()
        return model
    return 'No Model Found'

def execute_actions(actions):
    if len(actions) > 0:
        action_id = actions[0]['action']
        if action_id == 1:
            # f = Path("mmos_action.txt")
            # if f.is_file():
            #     os.remove("mmos_action.txt")
            execute_reboot()
        elif (action_id == 2):
            execute_miner_reset()


def execute_reboot():
    f = open("mmos_action.txt", "w+")
    f.write(str(1))
    f.close()
    time.sleep(15)
    run_reboot()

def run_reboot():    
    os.system('apps/force_reboot.sh')

def execute_miner_reset():
    f = open("mmos_action.txt", "w+")
    f.write(str(2))
    f.close()
    time.sleep(10)
    os.system('./miner_restart.sh')

if __name__ == '__main__':
    init()
    #get_ip_address()
