import datetime
import hashlib
from dataclasses import dataclass


@dataclass
class Notice:
    """Notice entry"""
    date: datetime.date
    teacher: str
    kind: str
    category: str
    content: str

    def __hash__(self) -> str:
        a_date = '' if self.date is None else str(self.date)
        a_teacher = '' if self.teacher is None else self.teacher
        a_kind = '' if self.kind is None else self.kind
        a_category = '' if self.category is None else self.category
        return hashlib.md5(f'{a_date}-{a_teacher}-{a_kind}-{a_category}'.encode('utf-8')).hexdigest()
