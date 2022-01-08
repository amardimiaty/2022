from email.mime import text

from numpy import true_divide
from runfun import script
from runfun import email
import datetime
import schedule
import time


def salik(date,file_path):
    database = "ekg_2021"
    table ="salik_nimbus_2021"
    date = str(date) 
    report ='salik'
    column='beginning'
    salik = script(database=database,table=table,date=date,file_path=file_path,report=report,column=column)
    salik.select_data()

def rtr(date,file_path):
    database = "ekg_2021"
    table ="rtr"
    date = str(date) 
    report ='rtr'
    column='the_date'
    salik = script(database=database,table=table,date=date,file_path=file_path,report=report,column=column)
    salik.select_data()
    
def passenger(date,file_path):
    database = "ekg_2021"
    table ="passengers"
    date = str(date) 
    report ='passengers'
    column='punchtime'
    salik = script(database=database,table=table,date=date,file_path=file_path,report=report,column=column)
    salik.select_data()

def send_mail(to,subject,text,attach):
    send = email(to=to,subject=subject,text=text,attach=attach)
    send.mail()


def client():
    today =datetime.datetime.today()
    yesterday = today - datetime.timedelta(days=1)
    yesterday =yesterday.strftime("%Y-%m-%d")
    file = '/home/inbound/Documents/Ammar/csv/ekg//ea'
    salik(yesterday,file)
    rtr(yesterday,file)
    send_mail(['ammar.redhat@gmail.com','alou.redhat@gmail.com'],"Daily Report","""
    Dears 
    Please find attached Reports """,file)
def occ():
    today =datetime.datetime.today()
    yesterday = today - datetime.timedelta(days=1)
    yesterday =yesterday.strftime("%Y-%m-%d")
    file = '/home/inbound/Documents/Ammar/csv/ekg/occ//'
    passenger(yesterday,file)
    send_mail(['ammar.redhat@gmail.com','alou.redhat@gmail.com'],"Daily Report","""
    Dears 
    Please find attached Reports """,file)


