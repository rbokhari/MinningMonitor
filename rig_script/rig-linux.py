import json
import socket
import statistics
import time
import requests
import os
#import httplib

# from firebase import firebase
from datetime import datetime
from pathlib import Path
import platform

uri = "http://46.101.227.146:3000/api/v1/rigs" #"http://sits-002:3000/api/v1/rigs"


# firebase = firebase.FirebaseApplication('https://genesuspool.firebaseio.com/')
miner_ip = '127.0.0.1'
miner_port = 3333
host_name = socket.gethostname()
host_ip = socket.gethostbyname(host_name)
cards = 0
gpus = ''
temp = 0
fan = 0
miner_uptime = 0,
total_shares = 0
invalid_shares = 0
hashrate = 0
config_email = 'test@gmail.com'

def get_data():
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_address = (miner_ip, miner_port)
        try:
            sock.connect(server_address)
        except Exception as e:
            print('Miner socket ' + str(miner_ip) + ':' + str(miner_port) + ' is closed')
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
        print(i)
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
        print(type(ip))
    # url = 'http://api.hostip.info/get_json.php'
    #info = json.loads(urlopen(url).read())
    # print(info['ip'])
    # url = 'https://ipinfo.io/ip'
    # info = urlopen(url)
    # print(info)

def init():
    #condition = True
    while True:
        data = get_data()
        #{"result": ["7.3", "19", "16212;7;0", "16212", "0;0;0", "0", "74;30", "us1.ethermine.org:4444", "0;0;0;7"]}
        #u'result': [u'10.6 - ETH', u'76', u'25940;31;0', u'25940', u'0;0;0', u'off', u'45;80', u'eu1.ethermine.org:4444', u'0;0;0;0']}
        #{'id': 0, 'result': ['11.9 - ETH', '4332', '54611;3461;1', '26238;28373', '0;0;0', 'off;off', '39;80;44;80', 'eu1.ethermine.org:4444', '0;0;0;0'], 'error': None}
        all = data['result'][6].split(';')
        gpus = data['result'][3].split(';')
        temps = all[::2]
        fans = all[1::2]
        total_shares = int(data['result'][2].split(';')[1])
        invalid_shares = int(data['result'][8].split(';')[0])
        miner_uptime = data['result'][1]
        cards = len(temps)
        #temp = ';'.join(temps) #str(temps)
        #fan = ';'.join(fans) #str(fans)

        print('-----------------START------------------')
        print('Number of active cards: ' + str(cards))
        print('GPU temp: ' + str(temp))
        #print('GPU s : ' + gpus)
        print('Fan speed (%): ' + str(fan))
        print('Miner uptime is ' + miner_uptime + ' min')
        # print('Total Shares : ' + str(total_shares) + '')
        # print('Invalid Shares : ' + str(invalid_shares) + '')
        print('Calculating Hashrate ...')
        
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

        print('Current Hashrate ' + str(hashrates[4] / 1000) + ' Mh/s')
        print('Average Hashrate ' + str(hashrate) + ' Mh/s')
        print('-----------------END--------------------')

        lan_ip = get_lan_ip()
        id_file = Path("id.txt")
        client_email = Path("gns_config.txt")
        if client_email.is_file():
            register_email = read_email_from_file()

        if id_file.is_file():
            id = read_id_from_file()
            #ping_from_rig(id)
            #result = firebase.put('rigs', id, { 'email': 'py11@gmail.com', 'ip': host_ip, 'worker': host_name, 'ping_time': datetime.now(), 'cards': cards, 'temp': str(temp), 'fan': str(fan), 't_shares': total_shares, 'i_shares': invalid_shares, 'gpu': hashrate, 'gpus': gpus })
            #print('Rig ping at {}'.format(datetime.now()))
            #rig = { 'email': 'py11@gmail.com', 'ip': host_ip, 'osName': 'osname', 'kernel': 'keeeeerrr', 'worker': host_name, 'cards': cards, 'temps': temps, 'fans': fans, 't_shares': total_shares, 'i_shares': invalid_shares, 'gpu': gpus, 'totalHashrate': hashrate }
            rig = { 'rigUpTime': miner_uptime, 'email': register_email, 'ip': lan_ip, 'serverTime': datetime.now().strftime('%Y-%m-%dT%H:%M:%S'),  'osName': 'osname', 'kernel': 'keeeeerrr', 'worker': lan_ip, 'cards': cards, 'temps': temps, 'fans': fans, 't_shares': total_shares, 'i_shares': invalid_shares, 'gpu': gpus, 'totalHashrate': hashrate }
            try:
                response = requests.put(uri + '/' + id, json=rig)
                if response.status_code != requests.codes.ok: # 201:
                    print('error occured update', response.status_code)
                #if response.status_code == requests.codes.ok: # 201:
                    #print('Updated Rig. ID: {}'.format(response.json()))
                result = response.json()
                #print(result)
                comp_name = result['rigReturn']['computer']
                save_name_to_file(comp_name)
                actions = result['rigReturn']['action']
                print(actions)
                if len(actions) > 0:
                    action_id = actions[0]['action']
                    if action_id == 1:
                        execute_sh()
            except requests.exceptions.ConnectionError as e:
                print('Connection failed.')
                #raise ApiError('POST /tasks/ {}'.format(result.status_code))

        else:
            #result = register_rig()
            rig = { 'rigUpTime': miner_uptime, 'email': register_email, 'ip': lan_ip, 'serverTime': datetime.now().strftime('%Y-%m-%dT%H:%M:%S'), 'osName': 'osname', 'kernel': 'keeeeerrr', 'worker': host_name, 'cards': cards, 'temps': temps, 'fans': fans, 't_shares': total_shares, 'i_shares': invalid_shares, 'gpu': gpus, 'totalHashrate': hashrate }
            try:
                response = requests.post(uri, json=rig)
                if response.status_code != requests.codes.created: # 200:
                    print('error occured create', response.status_code)
                print('Created Rig. ID: {}'.format(response.json()))
                result = response.json()
                print('-------')
                print(result['data'])
                save_id_to_file(result['data']["_id"])
            except requests.exceptions.ConnectionError as e:
                print('Connection failed.')
                #raise ApiError('POST /tasks/ {}'.format(result.status_code))
            #result = firebase.post('rigs', { 'email': 'py11@gmail.com', 'ip': host_ip, 'worker': host_name, 'ping_time': datetime.now(), 'cards': cards, 'temp': temp, 'fan': fan, 't_shares': total_shares, 'i_shares': invalid_shares, 'gpu': hashrate })
            #print('Rig registered at {}'.format(datetime.now()))

        time.sleep(30)
        #condition = False

# online registering
def register_rig():
    #{'fans': [1, 2, 3], 'computer': 'comp', 'invalid': 777, 'totalHash': 12300, 'single': 123, 'kernel': 'kernel11', 'status': 1, 'ip': '192.168.1.1', 'temps': [2, 3, 54], 'osName': 'windows', 'shares': 1111}
    rig = { 'email': 'py11@gmail.com', 'ip': host_ip, 'worker': host_name, 'cards': cards, 'temp': temp, 'fan': fan, 't_shares': total_shares, 'i_shares': invalid_shares, 'gpu': hashrate }
    print('-------------rig-------------')
    print(rig)
    response = requests.post(uri, json=rig)
    if response.status_code != requests.codes.created: # 201:
        print('error occured', response.status_code)
        #raise ApiError('POST /tasks/ {}'.format(result.status_code))
    print('Created Rig. ID: {}'.format(response.json()))
    #result = firebase.post('rigs', { 'email': 'py11@gmail.com', 'ip': host_ip, 'worker': host_name, 'ping_time': datetime.now(), 'cards': cards, 'temp': temp, 'fan': fan, 't_shares': total_shares, 'i_shares': invalid_shares, 'gpu': hashrate })
    print(response)
    return response

def ping_from_rig(id):
    #result = firebase.put('rigs', id, { 'email': 'py_update@gmail.com', 'ip': host_ip, 'worker': host_name, 'ping_time': datetime.now() })
    return result

def save_id_to_file(id):
    f = open("id.txt", "w+")
    f.write(id)
    f.close()

def save_name_to_file(name):
    f = open("name.txt", "w+")
    f.write(name)
    f.close()

def read_id_from_file():
    f = open("id.txt", "r")
    id = f.read()
    f.close()
    return id

def read_email_from_file():
    f = open("gns_config.txt", "r")
    email = f.read()
    f.close()
    return email

def execute_sh():
    os.system('sudo ./force_reboot.sh')
        
if __name__ == '__main__':
    init()
    #get_ip_address()
