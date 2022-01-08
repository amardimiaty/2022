import os
from threading import Thread

def run():
    os.system("node /home/inbound/Documents/Ammar/EKG/driverutil.js")
    os.system("node /home/inbound/Documents/Ammar/EKG/rtr.js")
    os.system("node /home/inbound/Documents/Ammar/EKG/salik.js")


if __name__ == "__main__":
        t1  = Thread(run())
        th.start()
            

