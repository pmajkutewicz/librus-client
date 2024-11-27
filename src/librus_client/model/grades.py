import datetime
from dataclasses import dataclass
from enum import Enum
from typing import List, Dict


class Type(str, Enum):
    SEMESTER_1_GRADE = 'sem. 1'
    SEMESTER_1_AVG = 'sem. 1 śr.'
    SEMESTER_1_FINAL = 'sem. 1 końcowa'
    SEMESTER_2_GRADE = 'sem. 2'
    SEMESTER_2_AVG = 'sem. 2 śr.'
    SEMESTER_2_FINAL = 'sem. 2 końcowa'
    YEAR_AVG = 'roczna śr.'
    YEAR_FINAL = 'roczna śr.'


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


@dataclass
class SubjectGrades:
    subject_name: str
    grades: Dict[Type, List[Grade]]
