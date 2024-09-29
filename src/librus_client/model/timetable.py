import datetime
import hashlib
from dataclasses import dataclass
from typing import Optional


@dataclass
class Timetable:
    """Timetable entry"""
    date: datetime.date
    color: str
    text: str
    description: Optional[str]

    def __str__(self):
        return f'{self.color}: {self.text}'

    def __hash__(self) -> str:
        a_date = '' if self.date is None else str(self.date)
        a_color = '' if self.color is None else self.color
        a_text = '' if self.text is None else self.text
        return hashlib.md5(f'{a_date}-{a_color}-{a_text}'.encode('utf-8')).hexdigest()
