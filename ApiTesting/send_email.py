from email.message import EmailMessage
import ssl
import smtplib 

sender_email = "apitesting30022@gmail.com" # Sender email, do not change
receiver_email = "csharman@student.unimelb.edu.au" # To be changed to send to any email
password = "kdgh ykqa kyhp gyxr" # Do not change this password
subject = "Api testing"
message = "This was sent using python"

em = EmailMessage()
em['From'] = sender_email
em['To'] = receiver_email
em['subject'] = subject + " " + str(i)
em.set_content(message)

context = ssl.create_default_context()

with smtplib.SMTP_SSL('smtp.gmail.com', 465, context = context) as smtp:
    smtp.login(sender_email, password)
    smtp.sendmail(sender_email, receiver_email, em.as_string())