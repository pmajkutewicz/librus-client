import datetime
import hashlib
from dataclasses import dataclass
from enum import Enum
from typing import List, Dict


class Type(Enum):
    SEMESTER_1_GRADE = 1
    SEMESTER_1_AVG = 2
    SEMESTER_1_EXPECTED_FINAL = 3
    SEMESTER_1_FINAL = 4
    SEMESTER_2_GRADE = 5
    SEMESTER_2_AVG = 6
    SEMESTER_2_EXPECTED_FINAL = 7
    SEMESTER_2_FINAL = 8
    YEAR_AVG = 9
    YEAR_FINAL = 10


@dataclass
class Grade:
    """Grade entry"""
    id: str
    date: datetime.date
    teacher: str
    category: str
    grade: str
    details: str
    comment: str

    def __hash__(self) -> str:
        a_date = '' if self.date is None else str(self.date)
        a_teacher = '' if self.teacher is None else self.teacher
        a_category = '' if self.category is None else self.category
        a_grade = '' if self.grade is None else self.grade
        return hashlib.md5(f'{a_date}-{a_teacher}-{a_category}-{a_grade}'.encode('utf-8')).hexdigest()


@dataclass
class SubjectGrades:
    subject_name: str
    grades: Dict[Type, List[Grade]]
