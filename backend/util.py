import importlib.util
import sys
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import os


def send_application_reminder(recipient_email, application_data):
    # Email server settings
    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = int(os.getenv("SMTP_PORT"))
    sender_email = os.getenv("EMAIL_SENDER")
    sender_password = os.getenv("EMAIL_PASSWORD")

    # Create message
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = recipient_email
    message["Subject"] = f"Job Application Reminder - {application_data['companyName']}"

    # Create email body
    body = f"""
    Hello,

    This is a reminder about your job application:

    Company: {application_data['companyName']}
    Position: {application_data['jobTitle']}
    Location: {application_data['location']}
    Application Date: {application_data['date']}
    Current Status: {application_data['status']}

    Job Link: {application_data['jobLink']}

    Notes: {application_data['notes']}
    Latest Updates: {application_data['updates']}

    Best regards,
    Job Tracker App ;)
    """

    message.attach(MIMEText(body, "plain"))

    try:
        # Create secure SSL/TLS connection
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()

        # Login to the server
        server.login(sender_email, sender_password)

        # Send email
        text = message.as_string()
        server.sendmail(sender_email, recipient_email, text)

        # Close connection
        server.quit()
        return True, "Email sent successfully"
    except Exception as e:
        return False, str(e)


def load_and_run_function(module_path, function_name, *args, **kwargs):
    """
    Dynamically loads a module from a given file path and runs a specified function from that module.

    Args:
        module_path (str): The file path to the module to be loaded.
        function_name (str): The name of the function to be executed from the loaded module.
        *args: Variable length argument list to be passed to the function.
        **kwargs: Arbitrary keyword arguments to be passed to the function.

    Returns:
        The return value of the specified function from the loaded module.

    Raises:
        AttributeError: If the specified function does not exist in the loaded module.
    """
    # Load the module spec from the path
    spec = importlib.util.spec_from_file_location("dynamic_module", module_path)
    module = importlib.util.module_from_spec(spec)
    sys.modules["dynamic_module"] = module
    spec.loader.exec_module(module)

    # Run the desired function from the imported module
    if hasattr(module, function_name):
        func = getattr(module, function_name)
        return func(*args, **kwargs)
    else:
        raise AttributeError(
            f"The function '{function_name}' does not exist in {module_path}"
        )
