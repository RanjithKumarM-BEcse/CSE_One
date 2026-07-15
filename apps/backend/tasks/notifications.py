import logging
from core.celery_app import celery_app

# Setup a simple logger for our simulated email dispatch
logger = logging.getLogger(__name__)

@celery_app.task(name="send_leave_status_email")
def send_leave_status_email(student_email: str, status: str, reason: str):
    """
    Simulates sending an email notification via an async worker.
    In production, this would integrate with AWS SES, SendGrid, etc.
    """
    subject = f"Your Leave Request has been {status}"
    body = f"Hello,\n\nYour leave request for '{reason}' is now {status}.\n\nRegards,\nCSE One System"
    
    # Simulate network delay/processing
    logger.info("=========================================")
    logger.info(f"[CELERY] Sending Email to: {student_email}")
    logger.info(f"[CELERY] Subject: {subject}")
    logger.info(f"[CELERY] Body:\n{body}")
    logger.info("=========================================")
    
    return True
