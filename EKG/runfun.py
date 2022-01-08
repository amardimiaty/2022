from datetime import date
import email
import smtplib, ssl     
import os
from email.mime.base import MIMEBase  
from email.mime.multipart import MIMEMultipart  
from email.mime.text import MIMEText  
from email import encoders 
import mysql.connector
db = mysql.connector.connect(option_files='mysql.config')
import pandas as pd
cursor = db.cursor()


class script:
    def __init__(self,database,table,date,file_path,report,column):
        self.database = database
        self.table = table
        self.date = date
        self.report = report
        self.folder = file_path
        self.file = str(file_path+report+' '+date+'.csv')
        self.column = column
    def select_data(self):
        db.connect
        cursor.execute("SELECT distinct* FROM {}.{} where {} like '%{}%';".format(self.database,self.table,self.column,self.date))
        records = cursor.fetchall()
        if records !=[]:
           self.generate_csv(records)
        else:
            pass
    def generate_csv(self,records):
        if self.report =="salik":
         df = pd.DataFrame(records,columns=['Unit', 'Start Time', 'Start Location', 'End Time','End Location', 'Duration', 'Driver', 'Crossing','Route ID','Route Name','Route Type','Route Time','Route Group'])
         df.to_csv (self.file, index = False)
        elif self.report =='rtr':
         df = pd.DataFrame(records,columns=['Date', 'BUS', 'Route ID', 'Trip ID','Driver', 'Direction', 'Stop Name', 'Schedule Arrival','Actual Arrival','Schedule Depature','Actual Depature','Different Depature','Different Arrival'])
         df.to_csv (self.file, index = False)
        elif self.report =='passengers':
         df = pd.DataFrame(records,columns=['t1', 'c1', 'BUS','Time', 'Passenger ID','Stop Name', 'Latitude', 'Longitude', 'Route ID','Route Name','Route Type','Route Time','Route Group','Seat Capacity','Seat Occupancy'])
         df.to_csv (self.file, index = False)
    def attache_report(self):
        self.message.attach(MIMEText('''
        Dears

        Please find attache report'''))
        for i in self.filenames:
          print(i)  
          with open(i, 'rb') as attachment:  
            file_part = MIMEBase('application', 'octet-stream')  
            file_part.set_payload(attachment.read())   
            encoders.encode_base64(file_part)  
            file_part.add_header(  'Content-Disposition',  'attachment',filename=self.folder)
            self.message.attach(file_part)        

class email:
    def __init__(self,to, subject, text, attach):
        self.gmail_user = "support@inbound.ae"
        self.gmail_pwd = "smart@321iot"
        self.recipients = to
        self.subject = subject
        self.text =text
        self.attach = attach
    def mail(self):
        print(self.attach)
        msg = MIMEMultipart()
        msg['From'] = self.gmail_user
        msg['To'] = ", ".join(self.recipients)
        msg['Subject'] = self.subject
        msg.attach(MIMEText(self.text))
        #get all the attachments
        filenames = [os.path.join(self.attach, f) for f in os.listdir(self.attach)]
        for file in filenames:
            print(file)
            part = MIMEBase('application', 'octet-stream')
            part.set_payload(open(file, 'rb').read())
            encoders.encode_base64(part)
            part.add_header('Content-Disposition', 'attachment; filename="%s"' % file.split("Reports//",1)[1] )
            msg.attach(part)

        mailServer = smtplib.SMTP("smtp.gmail.com", 587)
        mailServer.ehlo()
        mailServer.starttls()
        mailServer.ehlo()
        mailServer.login(self.gmail_user, self.gmail_pwd)
        mailServer.sendmail(self.gmail_user, self.recipients, msg.as_string())
        # Should be mailServer.quit(), but that crashes...
        mailServer.close()

