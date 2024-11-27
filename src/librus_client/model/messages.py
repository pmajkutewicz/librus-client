import datetime
from dataclasses import dataclass
from typing import List


@dataclass
class Receiver:
    first_name: str
    last_name: str
    group: str
    active: int
    pupil_first_name: str
    pupil_lastname_name: str
    is_bcc: str
    is_cc: str


@dataclass
class Message:
    """Message entry"""
    message_id: str
    send_date: datetime.datetime
    topic: str
    message: str
    sender: str
    receivers: List[Receiver]
