import datetime
from dataclasses import dataclass


@dataclass
class Notice:
    """Notice entry"""
    date: datetime.date
    teacher: str
    kind: str
    category: str
    content: str     